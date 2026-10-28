import { NextResponse } from "next/server"
import { audit } from "@/lib/auth/audit"
import { destroyCurrentSession, getAuthUser } from "@/lib/auth/session"
import { assertSameOrigin, clientIp, route } from "@/lib/auth/request"

export const POST = route(async (req: Request) => {
  assertSameOrigin(req)
  const user = await getAuthUser()
  await destroyCurrentSession()
  if (user)
    await audit({ actor: user, action: "auth.logout", ip: clientIp(req) })
  return NextResponse.json({ ok: true })
})
