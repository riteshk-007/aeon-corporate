import { z } from "zod"
import { db } from "@/lib/db"
import { sanitizeRich, slugify } from "@/lib/rich-text"

import { SECTION_DEFS, type SectionKey } from "@/lib/service-sections"

export { SECTION_DEFS, readSections, sectionLook } from "@/lib/service-sections"
export type { Section, SectionKey } from "@/lib/service-sections"
const KEYS = SECTION_DEFS.map((s) => s.key) as [SectionKey, ...SectionKey[]]
const text = (max: number) => z.string().trim().max(max)

export const serviceSchema = z.object({
  title: text(120).min(3, "Title is required"),
  category: text(80),
  icon: text(40),
  summary: text(400),
  /** "What's included" bullets shown beside the title. */
  highlights: z.array(text(160).min(1)).max(12),
  sections: z.array(z.object({ key: z.enum(KEYS), html: z.string().max(120_000), title: text(60).optional(), icon: text(40).optional() })).max(SECTION_DEFS.length),
  faqs: z.array(z.object({ q: text(200).min(1), a: text(1500).min(1) })).max(30),
  heroImageUrl: z.string().trim().max(500).nullable(),
  seoTitle: text(70),
  seoDescription: text(170),
  isPublished: z.boolean(),
})
export type ServiceInput = z.infer<typeof serviceSchema>

export const cleanService = (input: ServiceInput) => ({
  ...input,
  sections: input.sections
    .map((s) => ({ key: s.key, html: sanitizeRich(s.html), ...(s.title ? { title: s.title } : {}), ...(s.icon ? { icon: s.icon } : {}) }))
    .filter((s) => s.html.trim() !== ""),
  heroImageUrl: input.heroImageUrl || null,
})

export async function uniqueServiceSlug(title: string, ignoreId?: string) {
  const base = slugify(title)
  for (let i = 0; i < 50; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`
    const clash = await db.service.findFirst({
      where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
      select: { id: true },
    })
    if (!clash) return slug
  }
  return `${base}-${Date.now()}`
}

export type Faq = { q: string; a: string }

/** Json columns come back untyped; keep only well-formed items. */
export function readFaqs(value: unknown): Faq[] {
  return Array.isArray(value)
    ? value.filter((v): v is Faq => !!v && typeof v.q === "string" && typeof v.a === "string")
    : []
}

/** All the HTML of a page in one string (used to find which images are still used). */
export const allHtml = (sections: { html: string }[]) => sections.map((s) => s.html).join("\n")
