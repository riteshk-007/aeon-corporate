/**
 * One-off helper: replaces the "Startup" header menu with the full category and
 * link list, and makes sure every link has a service page.
 *
 *   pnpm exec tsx prisma/apply-startup.ts
 *
 * Safe to re-run. Pages you already edited are left alone: only untouched
 * starter pages (no sections saved from the admin panel) are refreshed or removed.
 */
import "dotenv/config"
import { db } from "../lib/db"
import { readMenuForAdmin, saveMenu } from "../lib/menu"
import { complianceTop, environmentalTop, ipTop, regulatoryTop, startupTop } from "../lib/menu-starter"
import { CATEGORY_ICON } from "../lib/startup-data"
import { IP_CATEGORY_ICON } from "../lib/ip-data"
import { COMPLIANCE_CATEGORY_ICON } from "../lib/compliance-data"
import { REGULATORY_CATEGORY_ICON } from "../lib/regulatory-data"
import { ENVIRONMENTAL_CATEGORY_ICON } from "../lib/environmental-data"
import { sanitizeRich } from "../lib/rich-text"
import { starterServices } from "../lib/service-starter"

async function main() {
  const pages = starterServices()
  const wanted = new Set(pages.map((p) => p.slug))

  // 1. Pages: create missing ones, refresh untouched old starter pages.
  let created = 0
  let refreshed = 0
  for (const page of pages) {
    const data = {
      ...page,
      sections: page.sections.map((x) => ({ ...x, html: sanitizeRich(x.html) })),
      heroImageUrl: null,
    }
    const existing = await db.service.findUnique({ where: { slug: page.slug } })
    if (!existing) {
      await db.service.create({ data })
      created++
    } else if (existing.autoContent || (existing.sections === null && page.sections.length > 0) || (Array.isArray(existing.sections) && existing.sections.length === 0 && page.sections.length > 0 && Math.abs(existing.updatedAt.getTime() - existing.createdAt.getTime()) < 86_400_000 * 60 && !existing.summary)) {
      // Old first-version starter page (single body, never edited in the new editor).
      await db.service.update({ where: { id: existing.id }, data })
      refreshed++
    }
  }

  // Give pages without an icon their category icon (never overrides one an admin chose).
  for (const [category, icon] of Object.entries({ ...CATEGORY_ICON, ...IP_CATEGORY_ICON, ...COMPLIANCE_CATEGORY_ICON, ...REGULATORY_CATEGORY_ICON, ...ENVIRONMENTAL_CATEGORY_ICON })) {
    await db.service.updateMany({ where: { category, icon: "" }, data: { icon } })
  }

  // 2. Remove old starter pages that are no longer part of the menu and were never edited.
  const stale = await db.service.findMany({ where: { slug: { notIn: [...wanted] } } })
  const removable = stale.filter(
    (s) => s.sections === null && Math.abs(s.updatedAt.getTime() - s.createdAt.getTime()) < 60_000,
  )
  const removedSlugs = new Set(removable.map((s) => s.slug))
  if (removable.length) await db.service.deleteMany({ where: { id: { in: removable.map((s) => s.id) } } })

  // 3. Menu: add or refresh the starter menus. A menu that already links to service pages is
  //    treated as edited by the team and is kept as it is.
  const tree = await readMenuForAdmin()
  const next = tree.map((t) => ({ ...t, categories: t.categories.map((c) => ({ ...c, links: c.links.map((l) => ({ ...l })) })) }))
  for (const t of next) {
    for (const c of t.categories) {
      for (const l of c.links) {
        const m = /^\/services\/([^/?#]+)/.exec(l.href)
        if (m && removedSlugs.has(m[1])) l.href = "/contact-us"
      }
    }
  }
  const usesPages = (t: (typeof tree)[number]) => t.categories.some((c) => c.links.some((l) => l.href.startsWith("/services/")))
  const place = (starter: ReturnType<typeof startupTop>, fallbackIndex: number) => {
    const i = next.findIndex((t) => t.label === starter.label)
    if (i < 0) next.splice(Math.min(fallbackIndex, next.length), 0, starter)
    else if (!usesPages(next[i])) next[i] = starter
  }
  place(startupTop(), 0)
  place(ipTop(), 1)
  place(complianceTop(), 2)
  place(regulatoryTop(), 3)
  place(environmentalTop(), 4)
  await saveMenu(next)

  console.log(`Pages: ${created} created, ${refreshed} refreshed, ${removable.length} old starter pages removed.`)
  console.log(`Menus: Startup ${startupTop().categories.length} categories, IP & Trademark ${ipTop().categories.length}, Compliance ${complianceTop().categories.length}, Regulatory ${regulatoryTop().categories.length}, Environmental ${environmentalTop().categories.length} categories. ${pages.length} pages in total.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
