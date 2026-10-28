import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { db } from "@/lib/db"
import { audit } from "@/lib/auth/audit"
import { apiAuth } from "@/lib/auth/guards"
import { ApiError, clientIp, readJson, route } from "@/lib/auth/request"
import { deleteOwnerAssets, syncAssets } from "@/lib/assets"
import { allHtml, cleanService, serviceSchema, uniqueServiceSlug } from "@/lib/services"

export const runtime = "nodejs"

type Ctx = { params: Promise<{ id: string }> }

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params
  const actor = await apiAuth(req, "pages:edit")
  const data = cleanService(serviceSchema.parse(await readJson(req, 1_500_000)))
  const existing = await db.service.findUnique({ where: { id } })
  if (!existing) throw new ApiError(404, "Page not found")

  // The address only changes while the page is still a draft, so live links never break.
  const slug =
    !existing.isPublished && data.title !== existing.title
      ? await uniqueServiceSlug(data.title, id)
      : existing.slug
  const service = await db.service.update({ where: { id }, data: { ...data, slug, autoContent: false } })
  // A new address must not leave the menu pointing at the old one.
  if (slug !== existing.slug) {
    await db.menuItem.updateMany({ where: { href: `/services/${existing.slug}` }, data: { href: `/services/${slug}` } })
  }
  await syncAssets({ field: "serviceId", id }, allHtml(data.sections), [service.heroImageUrl])
  revalidatePath(`/services/${existing.slug}`)
  revalidatePath(`/services/${service.slug}`)
  revalidatePath("/sitemap.xml")
  revalidateTag("menu", { expire: 0 })
  await audit({ actor, action: "service.update", target: service.title, ip: clientIp(req) })
  return NextResponse.json({ ok: true, slug: service.slug })
})

/** Deleting a page also deletes its images from Cloudflare R2. */
export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params
  const actor = await apiAuth(req, "pages:delete")
  const service = await db.service.findUnique({ where: { id } })
  if (!service) throw new ApiError(404, "Page not found")
  await deleteOwnerAssets({ field: "serviceId", id })
  await db.service.delete({ where: { id } })
  // Menu links to a deleted page would be dead; send them to Contact Us instead.
  await db.menuItem.updateMany({ where: { href: `/services/${service.slug}` }, data: { href: "/contact-us" } })
  revalidatePath(`/services/${service.slug}`)
  revalidatePath("/sitemap.xml")
  revalidateTag("menu", { expire: 0 })
  await audit({ actor, action: "service.delete", target: service.title, ip: clientIp(req) })
  return NextResponse.json({ ok: true })
})
