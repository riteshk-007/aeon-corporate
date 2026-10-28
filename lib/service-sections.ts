/** The fixed sections of a service page, in order (same idea as the reference site's tabs). */
export const SECTION_DEFS = [
  { key: "overview", title: "Overview", icon: "book-open", hint: "What the service is, in plain words." },
  { key: "advantages", title: "Advantages", icon: "thumbs-up", hint: "Why it is useful. Use a bullet list." },
  { key: "eligibility", title: "Eligibility Criteria", icon: "clipboard-check", hint: "Who can apply and what is required." },
  { key: "documents", title: "Documents Required", icon: "file-text", hint: "Checklist of documents." },
  { key: "process", title: "Process", icon: "list-ordered", hint: "Step-by-step (use a numbered list)." },
  { key: "features", title: "Features", icon: "sparkles", hint: "Key features and compliance after registration." },
  { key: "types", title: "Types", icon: "table", hint: "Compare options. A table works well here." },
  { key: "why-us", title: "Why Us", icon: "shield-check", hint: "How Aeon helps. Only claims you can stand behind." },
] as const

export type SectionKey = (typeof SECTION_DEFS)[number]["key"]
/** `title` and `icon` are optional overrides; empty means "use the default". */
export type Section = { key: SectionKey; html: string; title?: string; icon?: string }

/** All 8 sections in order, empty ones included (for the editor). */
export function readSections(value: unknown): Section[] {
  const saved = new Map<string, { html: string; title?: string; icon?: string }>()
  if (Array.isArray(value)) {
    for (const v of value) {
      if (v && typeof v.key === "string" && typeof v.html === "string") {
        saved.set(v.key, {
          html: v.html,
          title: typeof v.title === "string" ? v.title : undefined,
          icon: typeof v.icon === "string" ? v.icon : undefined,
        })
      }
    }
  }
  return SECTION_DEFS.map((d) => ({ key: d.key, html: saved.get(d.key)?.html ?? "", title: saved.get(d.key)?.title, icon: saved.get(d.key)?.icon }))
}

/** Heading and icon to show for a section, after the admin's overrides. */
export function sectionLook(s: { key: SectionKey; title?: string; icon?: string }) {
  const def = SECTION_DEFS.find((d) => d.key === s.key)!
  return { title: s.title?.trim() || def.title, icon: s.icon || def.icon }
}
