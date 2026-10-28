import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { audit } from "@/lib/auth/audit"
import { apiAuth } from "@/lib/auth/guards"
import { clientIp, readJson, route } from "@/lib/auth/request"
import { menuSchema, saveMenu } from "@/lib/menu"

export const runtime = "nodejs"

/** Saves the whole header menu at once and refreshes the public site. */
export const PUT = route(async (req: Request) => {
  const actor = await apiAuth(req, "navigation:edit")
  const { tops } = menuSchema.parse(await readJson(req, 1_500_000))
  await saveMenu(tops)
  revalidateTag("menu", { expire: 0 })
  await audit({
    actor,
    action: "menu.update",
    meta: { tops: tops.length, links: tops.reduce((n, t) => n + t.categories.reduce((m, c) => m + c.links.length, 0), 0) },
    ip: clientIp(req),
  })
  return NextResponse.json({ ok: true })
})
