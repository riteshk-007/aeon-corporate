/** Turns a section's list HTML into cards: the text before and after the list, and each item's title and text. */
export type Item = { title: string; text: string }
export type Split = { before: string; items: Item[]; after: string }

const un = (s: string) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")

export function splitList(html: string, min = 3): Split | null {
  const lists = [...html.matchAll(/<(ul|ol)>([\s\S]*?)<\/\1>/g)]
  if (lists.length !== 1) return null
  const m = lists[0]
  const items: Item[] = []
  for (const li of m[2].matchAll(/<li>([\s\S]*?)<\/li>/g)) {
    const strong = /^<strong>([\s\S]*?)<\/strong>/.exec(li[1])
    if (!strong) {
      items.push({ title: un(li[1].replace(/<[^>]+>/g, "")).trim(), text: "" })
      continue
    }
    const text = li[1].slice(strong[0].length).replace(/^\s*(<br\s*\/?>)?\s*:?\s*/i, "").replace(/<[^>]+>/g, "")
    items.push({ title: un(strong[1].replace(/<[^>]+>/g, "")).replace(/:\s*$/, ""), text: un(text).trim() })
  }
  if (items.length < min) return null
  return { before: html.slice(0, m.index!), items, after: html.slice((m.index ?? 0) + m[0].length) }
}

export type Group = { head: string; intro: string; items: Item[] }
/** "Services Offered" written as titled groups: an h4, an optional paragraph and a list. */
export function splitGroups(html: string): { before: string; groups: Group[]; after: string } | null {
  const first = html.search(/<h4>/)
  if (first < 0) return null
  const before = html.slice(0, first)
  const groups: Group[] = []
  let tail = ""
  for (const part of html.slice(first).split(/(?=<h4>)/)) {
    const h = /^<h4>([\s\S]*?)<\/h4>/.exec(part)
    if (!h) return null
    const rest = part.slice(h[0].length)
    const list = /<(ul|ol)>[\s\S]*?<\/\1>/.exec(rest)
    const sp = list ? splitList(list[0], 1) : null
    if (!sp) {
      if (groups.length === 0) return null
      tail += rest
      continue
    }
    const intro = rest.slice(0, list!.index)
    groups.push({ head: un(h[1]), intro, items: sp.items })
    tail += rest.slice(list!.index + list![0].length)
  }
  return groups.length ? { before, groups, after: tail } : null
}
