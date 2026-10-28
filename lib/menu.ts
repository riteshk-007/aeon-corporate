import { randomUUID } from "node:crypto"
import { unstable_cache } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { navMenus } from "@/lib/site-data"
import { isSafeHref } from "@/lib/site-pages"

export type MenuLink = { label: string; href: string }
export type MenuCategory = { label: string; href: string; links: MenuLink[] }
export type MenuTop = { label: string; href: string; categories: MenuCategory[] }

const href = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || isSafeHref(v), "Use a page path like /about or a full https:// link")
const label = z.string().trim().min(1, "Every item needs a name").max(80)

export const menuSchema = z.object({
  tops: z
    .array(
      z.object({
        label,
        href,
        categories: z
          .array(
            z.object({
              label,
              href,
              links: z.array(z.object({ label, href })).max(150, "A category can have at most 150 links"),
            }),
          )
          .max(20, "A menu can have at most 20 categories"),
      }),
    )
    .max(8),
})
export type MenuInput = z.infer<typeof menuSchema>

/** Used until the admin saves a menu, so the header never goes empty. */
export function fallbackMenu(): MenuTop[] {
  return navMenus
    .filter((m) => m.label !== "Company")
    .map((m) => ({
      label: m.label,
      href: "/#services",
      categories: [
        {
          label: m.label,
          href: "",
          links: m.links.map((l) => ({ label: l, href: "/#explorer" })),
        },
      ],
    }))
}

async function readMenu(): Promise<MenuTop[]> {
  if (!process.env.DATABASE_URL) return fallbackMenu()
  try {
    const tops = await db.menuItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: { children: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
        },
      },
    })
    if (tops.length === 0) return fallbackMenu()
    // A link to a page that is not published yet quietly opens Contact Us.
    const live = new Set(
      (await db.service.findMany({ where: { isPublished: true }, select: { slug: true } })).map((s) => s.slug),
    )
    const resolve = (h: string | null) => {
      const href = h ?? ""
      const m = /^\/services\/([^/?#]+)/.exec(href)
      return m && !live.has(m[1]) ? "/contact-us" : href
    }
    return tops.map((t) => ({
      label: t.label,
      href: resolve(t.href),
      categories: t.children.map((c) => ({
        label: c.label,
        href: resolve(c.href),
        links: c.children.map((l) => ({ label: l.label, href: resolve(l.href) })),
      })),
    }))
  } catch (error) {
    console.error("[menu] could not load", error)
    return fallbackMenu()
  }
}

/** Cached for the public site (60s) and cleared when admin saves (tag "menu"). Not cached in development. */
const cachedMenu = unstable_cache(readMenu, ["site-menu"], { tags: ["menu"], revalidate: 60 })
export const getMenu = () => (process.env.NODE_ENV === "production" ? cachedMenu() : readMenu())

/** Whole tree for the admin editor (includes hidden items). */
export async function readMenuForAdmin(): Promise<MenuInput["tops"]> {
  const tops = await db.menuItem.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      children: { orderBy: { sortOrder: "asc" }, include: { children: { orderBy: { sortOrder: "asc" } } } },
    },
  })
  return tops.map((t) => ({
    label: t.label,
    href: t.href ?? "",
    categories: t.children.map((c) => ({
      label: c.label,
      href: c.href ?? "",
      links: c.children.map((l) => ({ label: l.label, href: l.href ?? "" })),
    })),
  }))
}

/** Replace the whole menu in one transaction (three bulk inserts, so even 500+ links save quickly). */
export async function saveMenu(tops: MenuInput["tops"]) {
  const topRows: { id: string; label: string; href: string | null; sortOrder: number }[] = []
  const catRows: { id: string; parentId: string; label: string; href: string | null; sortOrder: number }[] = []
  const linkRows: { id: string; parentId: string; label: string; href: string | null; sortOrder: number }[] = []
  tops.forEach((t, i) => {
    const topId = randomUUID()
    topRows.push({ id: topId, label: t.label, href: t.href || null, sortOrder: i })
    t.categories.forEach((c, j) => {
      const catId = randomUUID()
      catRows.push({ id: catId, parentId: topId, label: c.label, href: c.href || null, sortOrder: j })
      c.links.forEach((l, k) =>
        linkRows.push({ id: randomUUID(), parentId: catId, label: l.label, href: l.href || null, sortOrder: k }),
      )
    })
  })
  await db.$transaction(
    async (tx) => {
      await tx.menuItem.deleteMany({})
      if (topRows.length) await tx.menuItem.createMany({ data: topRows })
      if (catRows.length) await tx.menuItem.createMany({ data: catRows })
      // keep each insert comfortably below the database's parameter limit
      for (let i = 0; i < linkRows.length; i += 1000) {
        await tx.menuItem.createMany({ data: linkRows.slice(i, i + 1000) })
      }
    },
    { timeout: 30_000, maxWait: 10_000 },
  )
}
