import type { MetadataRoute } from "next"
import { db } from "@/lib/db"
import { SITE_URL, sitePages } from "@/lib/seo"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const pages: MetadataRoute.Sitemap = sitePages.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
  if (!process.env.DATABASE_URL) return pages
  try {
    const services = await db.service.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, sections: true, autoContent: true },
    })
    return [
      ...pages,
      ...services.filter((s) => Array.isArray(s.sections) && s.sections.length > 0).map((s) => ({
        url: `${SITE_URL}/services/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "monthly" as const,
        priority: s.autoContent ? 0.5 : 0.7,
      })),
    ]
  } catch {
    return pages
  }
}
