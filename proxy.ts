import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * First gate for the admin area (pages AND /api/admin).
 *  - Signed-out visitors never reach the panel or its API.
 *  - Writes to the API must come from our own site (CSRF defence in depth).
 * This is only an optimistic check: the real checks (is the session valid, does
 * this person's role allow this page or action?) run on the server for every
 * page (requirePagePermission) and every API call (apiAuth).
 */
const COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-aeon_session" : "aeon_session"

/** API routes that work without a session. */
const PUBLIC_API = new Set(["/api/admin/auth/login", "/api/admin/auth/logout"])

const json = (status: number, error: string) =>
  NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } })

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasCookie = Boolean(request.cookies.get(COOKIE)?.value)

  if (pathname.startsWith("/api/admin")) {
    const unsafe = !["GET", "HEAD", "OPTIONS"].includes(request.method)
    if (unsafe) {
      const origin = request.headers.get("origin")
      const site = request.headers.get("sec-fetch-site")
      const sameOrigin = origin
        ? origin === request.nextUrl.origin ||
          origin === process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "")
        : site === "same-origin"
      // Behind a proxy the origin can differ; apiAuth() does the precise check.
      if (!sameOrigin && !request.headers.get("x-forwarded-host") && origin) {
        return json(403, "Request blocked (invalid origin)")
      }
    }
    if (!hasCookie && !PUBLIC_API.has(pathname)) return json(401, "Please sign in")
    return NextResponse.next()
  }

  // The login page itself redirects signed-in users (a stale cookie must not loop).
  if (pathname === "/admin/login") return NextResponse.next()
  if (!hasCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
}
