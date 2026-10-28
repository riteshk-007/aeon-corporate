import { z } from "zod"
import { db } from "@/lib/db"
import { deleteOwnerAssets, syncAssets } from "@/lib/assets"
import { sanitizeRich, slugify } from "@/lib/rich-text"

export const JOB_ICONS = [
  "briefcase",
  "accountant",
  "trademark",
  "chip",
  "bank",
  "workflow",
  "bulb",
  "target",
] as const

export const jobSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(120),
  location: z.string().trim().min(2).max(80),
  type: z.enum(["Full-time", "Part-time", "Internship", "Contract"]),
  openings: z.coerce.number().int().min(1).max(99),
  icon: z.enum(JOB_ICONS),
  skills: z.array(z.string().trim().min(1).max(40)).max(12),
  summary: z.string().trim().max(300),
  descriptionHtml: z.string().max(100_000),
  isOpen: z.boolean(),
})
export type JobInput = z.infer<typeof jobSchema>

export function cleanJob(input: JobInput) {
  return { ...input, descriptionHtml: sanitizeRich(input.descriptionHtml) }
}

export async function uniqueSlug(title: string, ignoreId?: string) {
  const base = slugify(title)
  for (let i = 0; i < 50; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`
    const clash = await db.job.findFirst({
      where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
      select: { id: true },
    })
    if (!clash) return slug
  }
  return `${base}-${Date.now()}`
}

export const syncJobAssets = (jobId: string, html: string) =>
  syncAssets({ field: "jobId", id: jobId }, html)

export const deleteJobAssets = (jobId: string) => deleteOwnerAssets({ field: "jobId", id: jobId })
