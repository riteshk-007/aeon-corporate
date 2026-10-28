import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import type { Node as PMNode } from "@tiptap/pm/model"

export type Match = { from: number; to: number }

type SearchState = {
  term: string
  replace: string
  caseSensitive: boolean
  index: number
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    searchReplace: {
      setSearch: (opts: Partial<SearchState>) => ReturnType
      nextMatch: () => ReturnType
      prevMatch: () => ReturnType
      replaceCurrent: () => ReturnType
      replaceAll: () => ReturnType
      clearSearch: () => ReturnType
    }
  }
}

export function findMatches(doc: PMNode, term: string, caseSensitive: boolean) {
  const out: Match[] = []
  if (!term) return out
  const needle = caseSensitive ? term : term.toLowerCase()
  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return
    const hay = caseSensitive ? node.text : node.text.toLowerCase()
    let at = hay.indexOf(needle)
    while (at !== -1) {
      out.push({ from: pos + at, to: pos + at + needle.length })
      at = hay.indexOf(needle, at + needle.length)
    }
  })
  return out
}

const key = new PluginKey("searchReplace")

/** Find & replace for the editor: highlights matches, steps through them, replaces one or all. */
export const SearchReplace = Extension.create<object, SearchState>({
  name: "searchReplace",

  addStorage() {
    return { term: "", replace: "", caseSensitive: false, index: 0 }
  },

  addCommands() {
    const refresh = (tr: import("@tiptap/pm/state").Transaction) =>
      tr.setMeta(key, true)
    return {
      setSearch:
        (opts) =>
        ({ tr, dispatch }) => {
          Object.assign(this.storage, opts)
          if (opts.term !== undefined || opts.caseSensitive !== undefined)
            this.storage.index = 0
          if (dispatch) dispatch(refresh(tr))
          return true
        },
      clearSearch:
        () =>
        ({ tr, dispatch }) => {
          this.storage.term = ""
          this.storage.index = 0
          if (dispatch) dispatch(refresh(tr))
          return true
        },
      nextMatch:
        () =>
        ({ state, tr, dispatch, editor }) => {
          const m = findMatches(state.doc, this.storage.term, this.storage.caseSensitive)
          if (!m.length) return false
          this.storage.index = (this.storage.index + 1) % m.length
          if (dispatch) {
            const hit = m[this.storage.index]
            dispatch(refresh(tr))
            editor.commands.setTextSelection(hit)
            editor.commands.scrollIntoView()
          }
          return true
        },
      prevMatch:
        () =>
        ({ state, tr, dispatch, editor }) => {
          const m = findMatches(state.doc, this.storage.term, this.storage.caseSensitive)
          if (!m.length) return false
          this.storage.index = (this.storage.index - 1 + m.length) % m.length
          if (dispatch) {
            const hit = m[this.storage.index]
            dispatch(refresh(tr))
            editor.commands.setTextSelection(hit)
            editor.commands.scrollIntoView()
          }
          return true
        },
      replaceCurrent:
        () =>
        ({ state, tr, dispatch }) => {
          const m = findMatches(state.doc, this.storage.term, this.storage.caseSensitive)
          const hit = m[Math.min(this.storage.index, m.length - 1)]
          if (!hit) return false
          if (dispatch) {
            tr.insertText(this.storage.replace, hit.from, hit.to)
            dispatch(refresh(tr))
          }
          return true
        },
      replaceAll:
        () =>
        ({ state, tr, dispatch }) => {
          const m = findMatches(state.doc, this.storage.term, this.storage.caseSensitive)
          if (!m.length) return false
          if (dispatch) {
            for (const hit of [...m].reverse()) tr.insertText(this.storage.replace, hit.from, hit.to)
            this.storage.index = 0
            dispatch(refresh(tr))
          }
          return true
        },
    }
  },

  addProseMirrorPlugins() {
    const storage = this.storage
    return [
      new Plugin({
        key,
        props: {
          decorations(state) {
            if (!storage.term) return DecorationSet.empty
            const matches = findMatches(state.doc, storage.term, storage.caseSensitive)
            return DecorationSet.create(
              state.doc,
              matches.map((m, i) =>
                Decoration.inline(m.from, m.to, {
                  class: i === storage.index ? "search-hit search-hit-current" : "search-hit",
                }),
              ),
            )
          },
        },
      }),
    ]
  },
})
