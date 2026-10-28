import { slugify } from "@/lib/rich-text"

/**
 * The "IP & Trademark" menu: categories and the pages (links) under each.
 * Edit them later in Admin > Menus & Pages; this is only the first data.
 */
export const IP_CATEGORIES: { label: string; links: string[] }[] = [
  {
    label: "Trademarks India",
    links: [
      "Trademark Registration", "Trademark Objection", "Trademark Assignment", "Trademark Rectification",
      "Intellectual Property Dispute", "Trademark Renewal", "Trademark Classes Finder", "Trademark Hearing",
      "Trademark Opposition", "Trademark Search", "Brand Name Registration", "Logo Registration",
      "Wordmark Registration", "IP Risk Assessment Reports",
    ],
  },
  {
    label: "International TM",
    links: [
      "International Trademark Registration", "Trademark Registration USA", "Trademark Registration Mauritius",
      "Trademark Registration Dubai", "Trademark Registration France", "Trademark Registration Singapore",
      "UK Trademark Registration", "Trademark Registration Luxembourg", "Trademark Registration Indonesia",
      "Trademark Registration Poland", "Trademark Registration Japan", "Trademark Registration Germany",
      "Trademark Registration Sri Lanka", "Trademark Registration Egypt",
    ],
  },
  { label: "Designs", links: ["Design Registration", "Design Registration Renewal"] },
  { label: "GI", links: ["Registration OF Geographical Indication (GI)", "GI Enforcement Service"] },
  { label: "Advisory", links: ["Patent Due Diligence", "IP Valuation Services"] },
  { label: "TM Watch", links: ["Trademark Watch Services", "Trademark Monitoring"] },
  {
    label: "Copyright",
    links: ["Copyright Registration", "Copyright Disclaimer", "Copyright Objection", "Copyright Assignment"],
  },
  {
    label: "Patent",
    links: ["Patent Registration", "Indian Patent Search", "Patent Opposition", "Patent Revocation"],
  },
]

export const IP_CATEGORY_ICON: Record<string, string> = {
  "Trademarks India": "badge",
  "International TM": "globe",
  Designs: "sparkles",
  GI: "pin",
  Advisory: "scale",
  "TM Watch": "target",
  Copyright: "file-check",
  Patent: "lightbulb",
}

/** Every link with its page address, kept unique against the slugs already taken. */
export function ipPages(taken: Set<string>) {
  const used = new Set(taken)
  const out: { category: string; label: string; slug: string }[] = []
  for (const cat of IP_CATEGORIES) {
    for (const label of cat.links) {
      const base = slugify(label)
      let slug = base
      for (let i = 2; used.has(slug); i++) slug = `${base}-${i}`
      used.add(slug)
      out.push({ category: cat.label, label, slug })
    }
  }
  return out
}
