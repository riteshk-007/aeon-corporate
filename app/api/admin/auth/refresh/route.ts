import { NextResponse } from "next/server"
import { apiAuth } from "@/lib/auth/guards"
import { refreshSession } from "@/lib/auth/session"
import { ApiError, route } from "@/lib/auth/request"

/** Called quietly by the admin panel to keep a working session signed in. */
export const POST = route(async (req: Request) => {
  await apiAuth(req, undefined, { allowPasswordChange: true })
  const result = await refreshSession()
  if (result === "none") throw new ApiError(401, "Please sign in")
  return NextResponse.json({ ok: true, result })
})
