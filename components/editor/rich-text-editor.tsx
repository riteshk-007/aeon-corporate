"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import type { Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyleKit } from "@tiptap/extension-text-style"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
import { TableKit } from "@tiptap/extension-table"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Code, Code2, Eraser,
  Highlighter, ImagePlus, Italic, Link2, List, ListOrdered, Minus, Quote,
  Redo2, Replace, Search, Strikethrough, Subscript as SubIcon,
  Superscript as SupIcon, Table2, Underline as UnderlineIcon, Undo2, Unlink, X,
  ChevronDown, ChevronUp, Palette,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { SearchReplace, findMatches } from "./search-replace"

const lowlight = createLowlight(common)

/** Image that remembers its width (% of the text column) and left/centre/right alignment. */
const RichImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el: HTMLElement) => (el.style.width.endsWith("%") ? parseInt(el.style.width, 10) : null),
        renderHTML: (a: { width?: number | null }) => (a.width ? { style: `width:${a.width}%;height:auto` } : {}),
      },
      align: {
        default: "center",
        parseHTML: (el: HTMLElement) =>
          el.style.marginLeft === "auto" && el.style.marginRight === "auto" ? "center" : el.style.marginLeft === "auto" ? "right" : el.style.marginRight === "auto" ? "left" : "center",
        renderHTML: (a: { align?: string }) => ({
          style:
            a.align === "right"
              ? "display:block;margin-left:auto;margin-right:0"
              : a.align === "left"
                ? "display:block;margin-left:0;margin-right:auto"
                : "display:block;margin-left:auto;margin-right:auto",
        }),
      },
    }
  },
})

const FONTS = [
  { label: "Default", value: "" },
  { label: "Sans", value: "Arial, Helvetica, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "'Courier New', monospace" },
]
const SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"]
const SWATCHES = [
  "#0b1b4d", "#1b5fd9", "#0a44b8", "#16a34a", "#ca8a04", "#ea580c",
  "#dc2626", "#9333ea", "#475569", "#000000",
]
const HIGHLIGHTS = ["#ffe58a", "#bbf7d0", "#bfdbfe", "#fecdd3", "#e9d5ff", "#e2e8f0"]

export type RichTextEditorProps = {
  /** HTML string */
  value: string
  onChange: (html: string) => void
  /**
   * Enables image upload to Cloudflare R2 through /api/admin/upload.
   * `scope` decides which permission is needed (see the upload route).
   */
  upload?: { scope: string; ownerId?: string }
  placeholder?: string
  /** minimum height of the writing area, in px */
  minHeight?: number
  disabled?: boolean
  id?: string
  "aria-label"?: string
}

/**
 * Reusable rich-text editor (Tiptap). Output is HTML; always pass it through
 * `sanitizeRich` on the server before saving and render it with <RichContent>.
 */
export function RichTextEditor({
  value,
  onChange,
  upload,
  placeholder = "Start writing…",
  minHeight = 260,
  disabled,
  id,
  "aria-label": ariaLabel,
}: RichTextEditorProps) {
  const [message, setMessage] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const uploadRef = useRef(upload)
  uploadRef.current = upload

  const uploadImage = async (file: File): Promise<string | null> => {
    const cfg = uploadRef.current
    if (!cfg) return null
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large (max 5 MB)")
      return null
    }
    const progress = toast.loading("Uploading image…")
    const body = new FormData()
    body.append("file", file)
    if (cfg.ownerId) body.append("ownerId", cfg.ownerId)
    try {
      const res = await fetch(`/api/admin/upload?scope=${encodeURIComponent(cfg.scope)}`, {
        method: "POST",
        body,
        credentials: "same-origin",
      })
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!res.ok || !json.url) {
        toast.error(json.error ?? "Upload failed", { id: progress })
        return null
      }
      toast.success("Image uploaded", { id: progress })
      return json.url
    } catch {
      toast.error("Network error while uploading", { id: progress })
      return null
    }
  }

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    content: value,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: { openOnClick: false, autolink: true, protocols: ["mailto", "tel"] },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      TextStyleKit,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      RichImage.configure({ allowBase64: false }),
      TableKit.configure({ table: { resizable: false } }),
      Subscript,
      Superscript,
      SearchReplace,
    ],
    editorProps: {
      attributes: {
        id: id ?? "",
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": ariaLabel ?? "Rich text editor",
        class: "rich-content px-4 py-3",
        style: `min-height:${minHeight}px`,
      },
      handlePaste(view, event) {
        const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith("image/"))
        if (!file || !uploadRef.current) return false
        void uploadImage(file).then((url) => {
          if (url) view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.image.create({ src: url })))
        })
        return true
      },
      handleDrop(view, event) {
        const file = Array.from(event.dataTransfer?.files ?? []).find((f) => f.type.startsWith("image/"))
        if (!file || !uploadRef.current) return false
        void uploadImage(file).then((url) => {
          if (url) view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.image.create({ src: url })))
        })
        return true
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
  })

  // Keep the editor in step when the parent replaces the value (e.g. opening another job).
  useEffect(() => {
    if (editor && value !== (editor.isEmpty ? "" : editor.getHTML())) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  useEffect(() => {
    editor?.setEditable(!disabled)
  }, [disabled, editor])

  if (!editor) {
    return <div className="rounded-xl border border-line bg-white" style={{ minHeight: minHeight + 48 }} aria-busy="true" />
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white focus-within:border-brand focus-within:shadow-[0_0_0_4px_rgba(27,95,217,.12)]">
      <Toolbar
        editor={editor}
        canUpload={!!upload}
        onPickImage={() => fileRef.current?.click()}
        searchOpen={searchOpen}
        toggleSearch={() => {
          setSearchOpen((o) => {
            if (o) editor.commands.clearSearch()
            return !o
          })
        }}
        toggleLink={() => setLinkOpen((o) => !o)}
      />
      <ImageBar editor={editor} />
      {linkOpen && <LinkBar editor={editor} close={() => setLinkOpen(false)} />}
      {searchOpen && <SearchBar editor={editor} />}
      <div className="relative">
        {editor.isEmpty && (
          <p className="pointer-events-none absolute top-3 left-4 text-[15px] text-mute/70" aria-hidden="true">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line bg-pale/50 px-3 py-1.5 text-[12px] text-mute">
        <span role="status" aria-live="polite" className={cn(message && "font-semibold text-brand")}>
          {message || "Tip: paste or drop an image to upload it."}
        </span>
        <span>{editor.getText().trim().split(/\s+/).filter(Boolean).length} words</span>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ""
          if (!file) return
          const url = await uploadImage(file)
          if (url) editor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, "") }).run()
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ toolbar */

const btn =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-ink/80 transition hover:bg-pale hover:text-brand disabled:cursor-not-allowed disabled:opacity-35 aria-pressed:bg-brand aria-pressed:text-white"
const select =
  "h-8 shrink-0 rounded-lg border border-line bg-white px-2 text-[12px] font-semibold text-ink outline-none focus:border-brand"
const sep = <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-line" />

function Btn({
  label, onClick, active, disabled, children,
}: {
  label: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active ?? false}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep the text selection
      onClick={onClick}
      className={btn}
    >
      {children}
    </button>
  )
}

function Toolbar({
  editor, canUpload, onPickImage, searchOpen, toggleSearch, toggleLink,
}: {
  editor: Editor
  canUpload: boolean
  onPickImage: () => void
  searchOpen: boolean
  toggleSearch: () => void
  toggleLink: () => void
}) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      sub: e.isActive("subscript"),
      sup: e.isActive("superscript"),
      link: e.isActive("link"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      table: e.isActive("table"),
      left: e.isActive({ textAlign: "left" }),
      center: e.isActive({ textAlign: "center" }),
      right: e.isActive({ textAlign: "right" }),
      justify: e.isActive({ textAlign: "justify" }),
      heading: e.isActive("heading", { level: 1 }) ? "1" : e.isActive("heading", { level: 2 }) ? "2" : e.isActive("heading", { level: 3 }) ? "3" : "0",
      font: (e.getAttributes("textStyle").fontFamily as string | undefined) ?? "",
      size: (e.getAttributes("textStyle").fontSize as string | undefined) ?? "",
      color: (e.getAttributes("textStyle").color as string | undefined) ?? "",
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })
  const run = () => editor.chain().focus()

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex flex-wrap items-center gap-0.5 border-b border-line bg-[#f6faff] px-2 py-1.5 max-[640px]:flex-nowrap max-[640px]:overflow-x-auto"
    >
      <Btn label="Undo (Ctrl+Z)" disabled={!s.canUndo} onClick={() => run().undo().run()}><Undo2 size={16} /></Btn>
      <Btn label="Redo (Ctrl+Y)" disabled={!s.canRedo} onClick={() => run().redo().run()}><Redo2 size={16} /></Btn>
      {sep}
      <select
        aria-label="Text style"
        className={select}
        value={s.heading}
        onChange={(e) => {
          const v = e.target.value
          if (v === "0") run().setParagraph().run()
          else run().setHeading({ level: Number(v) as 1 | 2 | 3 }).run()
        }}
      >
        <option value="0">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>
      <select
        aria-label="Font"
        className={cn(select, "max-w-24")}
        value={FONTS.some((f) => f.value === s.font) ? s.font : ""}
        onChange={(e) => (e.target.value ? run().setFontFamily(e.target.value).run() : run().unsetFontFamily().run())}
      >
        {FONTS.map((f) => (<option key={f.label} value={f.value}>{f.label}</option>))}
      </select>
      <select
        aria-label="Font size"
        className={cn(select, "w-[72px]")}
        value={s.size}
        onChange={(e) => (e.target.value ? run().setFontSize(e.target.value).run() : run().unsetFontSize().run())}
      >
        <option value="">Size</option>
        {SIZES.map((z) => (<option key={z} value={z}>{z.replace("px", "")}</option>))}
      </select>
      {sep}
      <Btn label="Bold (Ctrl+B)" active={s.bold} onClick={() => run().toggleBold().run()}><Bold size={16} /></Btn>
      <Btn label="Italic (Ctrl+I)" active={s.italic} onClick={() => run().toggleItalic().run()}><Italic size={16} /></Btn>
      <Btn label="Underline (Ctrl+U)" active={s.underline} onClick={() => run().toggleUnderline().run()}><UnderlineIcon size={16} /></Btn>
      <Btn label="Strikethrough" active={s.strike} onClick={() => run().toggleStrike().run()}><Strikethrough size={16} /></Btn>
      <Btn label="Inline code" active={s.code} onClick={() => run().toggleCode().run()}><Code size={16} /></Btn>
      <Btn label="Subscript" active={s.sub} onClick={() => run().toggleSubscript().run()}><SubIcon size={16} /></Btn>
      <Btn label="Superscript" active={s.sup} onClick={() => run().toggleSuperscript().run()}><SupIcon size={16} /></Btn>
      {sep}
      <ColorMenu
        label="Text colour"
        icon={<Palette size={16} />}
        swatches={SWATCHES}
        current={s.color}
        onPick={(c) => run().setColor(c).run()}
        onReset={() => run().unsetColor().run()}
      />
      <ColorMenu
        label="Highlight colour"
        icon={<Highlighter size={16} />}
        swatches={HIGHLIGHTS}
        current=""
        onPick={(c) => run().setHighlight({ color: c }).run()}
        onReset={() => run().unsetHighlight().run()}
      />
      {sep}
      <Btn label="Align left" active={s.left} onClick={() => run().setTextAlign("left").run()}><AlignLeft size={16} /></Btn>
      <Btn label="Align centre" active={s.center} onClick={() => run().setTextAlign("center").run()}><AlignCenter size={16} /></Btn>
      <Btn label="Align right" active={s.right} onClick={() => run().setTextAlign("right").run()}><AlignRight size={16} /></Btn>
      <Btn label="Justify" active={s.justify} onClick={() => run().setTextAlign("justify").run()}><AlignJustify size={16} /></Btn>
      {sep}
      <Btn label="Bullet list" active={s.bullet} onClick={() => run().toggleBulletList().run()}><List size={16} /></Btn>
      <Btn label="Numbered list" active={s.ordered} onClick={() => run().toggleOrderedList().run()}><ListOrdered size={16} /></Btn>
      <Btn label="Quote" active={s.quote} onClick={() => run().toggleBlockquote().run()}><Quote size={16} /></Btn>
      <Btn label="Code block" active={s.codeBlock} onClick={() => run().toggleCodeBlock().run()}><Code2 size={16} /></Btn>
      <Btn label="Divider" onClick={() => run().setHorizontalRule().run()}><Minus size={16} /></Btn>
      {sep}
      <Btn label="Add or edit link" active={s.link} onClick={toggleLink}><Link2 size={16} /></Btn>
      <Btn label="Remove link" disabled={!s.link} onClick={() => run().unsetLink().run()}><Unlink size={16} /></Btn>
      {canUpload && (<Btn label="Insert image (you can also paste or drag a picture into the text)" onClick={onPickImage}><ImagePlus size={16} /></Btn>)}
      <Btn label="Insert table" onClick={() => run().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><Table2 size={16} /></Btn>
      {s.table && <TableTools editor={editor} />}
      {sep}
      <Btn label="Clear formatting" onClick={() => run().unsetAllMarks().clearNodes().run()}><Eraser size={16} /></Btn>
      <Btn label="Find and replace" active={searchOpen} onClick={toggleSearch}><Search size={16} /></Btn>
    </div>
  )
}

function TableTools({ editor }: { editor: Editor }) {
  const run = () => editor.chain().focus()
  const t = "h-8 shrink-0 rounded-lg px-2 text-[11px] font-bold text-brand hover:bg-pale"
  return (
    <>
      <button type="button" className={t} onMouseDown={(e) => e.preventDefault()} onClick={() => run().addRowAfter().run()}>+Row</button>
      <button type="button" className={t} onMouseDown={(e) => e.preventDefault()} onClick={() => run().addColumnAfter().run()}>+Col</button>
      <button type="button" className={t} onMouseDown={(e) => e.preventDefault()} onClick={() => run().deleteRow().run()}>−Row</button>
      <button type="button" className={t} onMouseDown={(e) => e.preventDefault()} onClick={() => run().deleteColumn().run()}>−Col</button>
      <button type="button" className={cn(t, "text-red-600 hover:bg-red-50")} onMouseDown={(e) => e.preventDefault()} onClick={() => run().deleteTable().run()}>Delete table</button>
    </>
  )
}

function ColorMenu({
  label, icon, swatches, current, onPick, onReset,
}: {
  label: string
  icon: React.ReactNode
  swatches: string[]
  current: string
  onPick: (c: string) => void
  onReset: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", close)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("mousedown", close)
      document.removeEventListener("keydown", esc)
    }
  }, [open])
  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        title={label}
        aria-label={label}
        aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        className={btn}
        style={current ? { color: current } : undefined}
      >
        {icon}
      </button>
      {open && (
        <div className="absolute top-9 left-0 z-30 w-[180px] rounded-xl border border-line bg-white p-3 shadow-[0_16px_40px_rgba(11,27,77,.16)]">
          <div className="grid grid-cols-5 gap-1.5">
            {swatches.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`${label} ${c}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onPick(c); setOpen(false) }}
                className="size-6 rounded-full border border-black/10 transition hover:scale-110"
                style={{ background: c }}
              />
            ))}
          </div>
          <label className="mt-3 flex items-center justify-between gap-2 text-[12px] font-semibold text-mute">
            Custom
            <input
              type="color"
              aria-label={`Custom ${label}`}
              className="h-7 w-10 cursor-pointer rounded border border-line bg-white"
              onChange={(e) => onPick(e.target.value)}
            />
          </label>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { onReset(); setOpen(false) }}
            className="mt-2 w-full rounded-lg bg-pale py-1.5 text-[12px] font-bold text-brand hover:bg-sky"
          >
            Remove colour
          </button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------- link + search */

/** Shows when a picture is selected: size, alignment, description and delete. */
function ImageBar({ editor }: { editor: Editor }) {
  const st = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const a = e.getAttributes("image") as { width?: number | null; align?: string; alt?: string }
      return { active: e.isActive("image"), width: a.width ?? 100, align: a.align ?? "center", alt: a.alt ?? "" }
    },
  })
  if (!st.active) return null
  const set = (attrs: Record<string, unknown>) => editor.chain().focus().updateAttributes("image", attrs).run()
  const pill = (on: boolean) =>
    cn("h-8 rounded-lg px-3 text-[12px] font-bold transition", on ? "bg-brand text-white" : "border border-line bg-white text-ink hover:border-brand hover:text-brand")
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line bg-pale/60 px-3 py-2" role="group" aria-label="Picture options">
      <span className="text-[12px] font-black tracking-[.1em] text-mute uppercase">Picture</span>
      {[
        ["Small", 33],
        ["Medium", 50],
        ["Large", 75],
        ["Full width", 100],
      ].map(([label, w]) => (
        <button key={label} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => set({ width: w })} className={pill(st.width === w)}>
          {label}
        </button>
      ))}
      <span className="mx-1 hidden h-5 w-px bg-line sm:block" aria-hidden="true" />
      {[
        ["Left", "left"],
        ["Centre", "center"],
        ["Right", "right"],
      ].map(([label, a]) => (
        <button key={a} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => set({ align: a })} className={pill(st.align === a)}>
          {label}
        </button>
      ))}
      <input
        aria-label="Picture description (for people who cannot see it, and for Google)"
        placeholder="Describe the picture"
        defaultValue={st.alt}
        key={st.alt === "" ? "empty" : "filled"}
        onChange={(e) => set({ alt: e.target.value })}
        className="h-8 min-w-[160px] flex-1 rounded-lg border border-line bg-white px-3 text-[12px] outline-none focus:border-brand"
      />
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().deleteSelection().run()} className="h-8 rounded-lg border border-red-200 bg-red-50 px-3 text-[12px] font-bold text-red-600 hover:bg-red-100">
        Delete picture
      </button>
    </div>
  )
}

function LinkBar({ editor, close }: { editor: Editor; close: () => void }) {
  const [url, setUrl] = useState((editor.getAttributes("link").href as string | undefined) ?? "")
  const [error, setError] = useState("")

  const apply = () => {
    let href = url.trim()
    if (!href) return
    if (!/^(https?:|mailto:|tel:)/i.test(href)) href = `https://${href}`
    try {
      const u = new URL(href)
      if (!["http:", "https:", "mailto:", "tel:"].includes(u.protocol)) throw new Error()
    } catch {
      setError("Enter a valid link")
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href, target: "_blank" }).run()
    close()
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line bg-pale/60 px-3 py-2">
      <input
        autoFocus
        value={url}
        onChange={(e) => { setUrl(e.target.value); setError("") }}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); apply() } if (e.key === "Escape") close() }}
        placeholder="https://example.com"
        aria-label="Link address"
        className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-[13px] outline-none focus:border-brand"
      />
      <button type="button" onClick={apply} className="h-9 rounded-lg bg-brand px-4 text-[13px] font-bold text-white hover:bg-royal">Apply</button>
      <button type="button" onClick={close} aria-label="Close link bar" className="grid size-9 place-items-center rounded-lg hover:bg-white"><X size={16} /></button>
      {error && <p role="alert" className="w-full text-[12px] font-semibold text-red-500">{error}</p>}
    </div>
  )
}

function SearchBar({ editor }: { editor: Editor }) {
  const st = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const sr = (e.storage as unknown as { searchReplace: { term: string; caseSensitive: boolean; index: number } }).searchReplace as { term: string; caseSensitive: boolean; index: number }
      const count = findMatches(e.state.doc, sr.term, sr.caseSensitive).length
      return { count, index: sr.index, term: sr.term, caseSensitive: sr.caseSensitive }
    },
  })
  const small = "h-9 rounded-lg px-3 text-[12px] font-bold disabled:opacity-40"
  return (
    <div className="grid gap-2 border-b border-line bg-pale/60 px-3 py-2 sm:grid-cols-[1fr_1fr_auto]">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          aria-label="Find"
          placeholder="Find"
          defaultValue={st.term}
          onChange={(e) => editor.commands.setSearch({ term: e.target.value })}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); editor.commands.nextMatch() } }}
          className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-[13px] outline-none focus:border-brand"
        />
        <span className="w-14 shrink-0 text-center text-[12px] font-semibold text-mute" aria-live="polite">
          {st.term ? (st.count ? `${Math.min(st.index + 1, st.count)}/${st.count}` : "0") : ""}
        </span>
      </div>
      <input
        aria-label="Replace with"
        placeholder="Replace with"
        onChange={(e) => editor.commands.setSearch({ replace: e.target.value })}
        className="h-9 min-w-0 rounded-lg border border-line bg-white px-3 text-[13px] outline-none focus:border-brand"
      />
      <div className="flex flex-wrap items-center gap-1.5">
        <button type="button" aria-label="Previous match" disabled={!st.count} onClick={() => editor.commands.prevMatch()} className={cn(small, "border border-line bg-white")}><ChevronUp size={14} /></button>
        <button type="button" aria-label="Next match" disabled={!st.count} onClick={() => editor.commands.nextMatch()} className={cn(small, "border border-line bg-white")}><ChevronDown size={14} /></button>
        <button type="button" disabled={!st.count} onClick={() => editor.commands.replaceCurrent()} className={cn(small, "border border-line bg-white")}><Replace size={14} className="mr-1 inline" />Replace</button>
        <button type="button" disabled={!st.count} onClick={() => editor.commands.replaceAll()} className={cn(small, "bg-brand text-white")}>All</button>
        <label className="flex items-center gap-1.5 text-[12px] font-semibold text-mute">
          <input type="checkbox" checked={st.caseSensitive} onChange={(e) => editor.commands.setSearch({ caseSensitive: e.target.checked })} className="accent-brand" />
          Aa
        </label>
      </div>
    </div>
  )
}
