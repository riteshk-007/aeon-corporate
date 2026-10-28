import sanitizeHtml from "sanitize-html"

const BASE_URL = () => (process.env.R2_PUBLIC_URL ?? "").replace(/\/+$/, "")

/**
 * Clean HTML coming from the rich-text editor before it is stored or shown.
 * Only a safe set of tags/styles is kept; images must come from our own R2
 * bucket; links open safely. This is the protection against stored XSS.
 */
export function sanitizeRich(html: string): string {
  const base = BASE_URL()
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h1", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s",
      "sub", "sup", "mark", "code", "pre", "blockquote", "hr", "ul", "ol", "li",
      "a", "img", "span", "table", "thead", "tbody", "tr", "th", "td", "colgroup", "col",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      "*": ["style", "class"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
      ol: ["start"],
    },
    allowedClasses: { "*": [/^hljs/, "language-*"], code: [/.*/] },
    allowedStyles: {
      "*": {
        color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i],
        "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i],
        "text-align": [/^(left|right|center|justify)$/],
        "font-size": [/^\d{1,2}(\.\d+)?(px|rem|em)$/],
        "font-family": [/^[\w\s"',-]{1,80}$/],
        width: [/^\d{1,4}(\.\d+)?(px|%)$/],
        height: [/^auto$/],
        display: [/^block$/],
        "margin-left": [/^(auto|0|0px)$/],
        "margin-right": [/^(auto|0|0px)$/],
        "min-width": [/^\d{1,4}(px)$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
    transformTags: {
      a: (tag, attribs) => ({
        tagName: tag,
        attribs: {
          ...attribs,
          rel: "noopener noreferrer nofollow",
          ...(attribs.target ? { target: "_blank" } : {}),
        },
      }),
    },
    exclusiveFilter: (frame) =>
      frame.tag === "img" && (!base || !frame.attribs.src?.startsWith(`${base}/`)),
  })
}

/** Object keys of R2 images used inside some HTML. */
export function imageKeysIn(html: string): string[] {
  const base = BASE_URL()
  if (!base) return []
  const keys: string[] = []
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    if (m[1].startsWith(`${base}/`)) keys.push(decodeURIComponent(m[1].slice(base.length + 1)))
  }
  return keys
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "job"
