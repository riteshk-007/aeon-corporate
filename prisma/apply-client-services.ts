/**
 * One-off helper: adds the services from the client's brief (lib/advisory-content.ts)
 * to the existing header menus and creates their service pages.
 *
 *   pnpm exec tsx prisma/apply-client-services.ts
 *
 * Safe to re-run: existing pages and menu links are left as they are; only missing
 * pages, categories and links are added.
 */
import "dotenv/config"
import { db } from "../lib/db"
import { readMenuForAdmin, saveMenu } from "../lib/menu"
import { sanitizeRich, slugify } from "../lib/rich-text"
import { buildContent } from "../lib/startup-content"
import { ADVISORY_CATEGORY_ICON, CLIENT_ADDITIONS } from "../lib/advisory-content"
import { CATEGORY_ICON } from "../lib/startup-data"
import { COMPLIANCE_CATEGORY_ICON } from "../lib/compliance-data"
import { REGULATORY_CATEGORY_ICON } from "../lib/regulatory-data"

const ICONS: Record<string, string> = { ...CATEGORY_ICON, ...COMPLIANCE_CATEGORY_ICON, ...REGULATORY_CATEGORY_ICON, ...ADVISORY_CATEGORY_ICON }
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()

async function main() {
  const tree = await readMenuForAdmin()
  let pages = 0
  let links = 0

  for (const group of CLIENT_ADDITIONS) {
    const top = tree.find((t) => t.label === group.top)
    if (!top) {
      console.warn(`Menu "${group.top}" not found, skipped ${group.category}`)
      continue
    }
    let cat = top.categories.find((c) => c.label === group.category)
    if (!cat) {
      cat = { label: group.category, href: "", links: [] }
      top.categories.push(cat)
    }
    for (const title of group.titles) {
      const slug = slugify(title)
      let page = await db.service.findUnique({ where: { slug } })
      if (!page) {
        const content = buildContent(group.category, title)
        page = await db.service.create({
          data: {
            slug,
            title,
            category: group.category,
            icon: ICONS[group.category] ?? "",
            summary: content.summary,
            highlights: content.highlights,
            sections: content.sections.map((x) => ({ ...x, html: sanitizeRich(x.html) })),
            faqs: content.faqs,
            seoTitle: "",
            seoDescription: "",
            isPublished: true,
            autoContent: title !== "Startup Legal Support",
          },
        })
        pages++
      }
      const href = `/services/${page.slug}`
      const already = top.categories.some((c) => c.links.some((l) => l.href === href || norm(l.label) === norm(title)))
      if (!already) {
        cat.links.push({ label: title, href })
        links++
      }
    }
  }

  await saveMenu(tree)
  console.log(`Client services: ${pages} pages created, ${links} menu links added.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
