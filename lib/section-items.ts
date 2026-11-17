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
    if (!strong) return null
    const text = li[1].slice(strong[0].length).replace(/^\s*(<br\s*\/?>)?\s*:?\s*/i, "").replace(/<[^>]+>/g, "")
    items.push({ title: un(strong[1].replace(/<[^>]+>/g, "")).replace(/:\s*$/, ""), text: un(text).trim() })
  }
  if (items.length < min) return null
  return { before: html.slice(0, m.index!), items, after: html.slice((m.index ?? 0) + m[0].length) }
}
