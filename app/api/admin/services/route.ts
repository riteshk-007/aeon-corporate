import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { db } from "@/lib/db"
import { audit } from "@/lib/auth/audit"
import { apiAuth } from "@/lib/auth/guards"
import { clientIp, readJson, route } from "@/lib/auth/request"
import { syncAssets } from "@/lib/assets"
import { allHtml, cleanService, serviceSchema, uniqueServiceSlug } from "@/lib/services"

export const runtime = "nodejs"

export const POST = route(async (req: Request) => {
  const actor = await apiAuth(req, "pages:create")
  const data = cleanService(serviceSchema.parse(await readJson(req, 1_500_000)))
  const service = await db.service.create({
    data: { ...data, slug: await uniqueServiceSlug(data.title) },
  })
  await syncAssets({ field: "serviceId", id: service.id }, allHtml(data.sections), [service.heroImageUrl])
  revalidateTag("menu", { expire: 0 })
  revalidatePath("/sitemap.xml")
  await audit({ actor, action: "service.create", target: service.title, ip: clientIp(req) })
  return NextResponse.json({ service: { id: service.id, slug: service.slug } }, { status: 201 })
})
