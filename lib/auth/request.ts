import { NextResponse } from "next/server"
import { ZodError } from "zod"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public extra?: Record<string, unknown>,
  ) {
    super(message)
  }
}

/** Best-effort client IP (works behind Vercel / Hostinger / Nginx proxies). */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  return ip.slice(0, 64)
}

/**
 * CSRF defence for cookie-authenticated requests: the browser must say the
 * request comes from our own origin, and bodies must be JSON (a cross-site
 * form cannot send that).
 */
export function assertSameOrigin(
  req: Request,
  options: { multipart?: boolean } = {},
) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return
  const url = new URL(req.url)
  const origin = req.headers.get("origin")
  const fetchSite = req.headers.get("sec-fetch-site")

  const allowed = new Set([url.origin])
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  if (configured) allowed.add(new URL(configured).origin)
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host")
  if (host) {
    const proto =
      req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")
    allowed.add(`${proto}://${host}`)
  }

  const okOrigin = origin ? allowed.has(origin) : fetchSite === "same-origin"
  if (!okOrigin) throw new ApiError(403, "Request blocked (invalid origin)")

  if (req.method !== "DELETE") {
    const type = req.headers.get("content-type") ?? ""
    const okType =
      type.includes("application/json") ||
      (options.multipart && type.includes("multipart/form-data"))
    if (!okType) {
      throw new ApiError(415, "Content-Type must be application/json")
    }
  }
}

/** Small by default; routes that save big content (menus, pages) pass a larger limit. */
export async function readJson(req: Request, maxChars = 20_000): Promise<unknown> {
  const text = await req.text()
  if (text.length > maxChars) throw new ApiError(413, "Request body too large")
  try {
    return text ? JSON.parse(text) : {}
  } catch {
    throw new ApiError(400, "Invalid JSON")
  }
}

const noStore = { "Cache-Control": "no-store" }

/** Wrap a route handler so errors become tidy JSON responses. */
export function route<A extends unknown[]>(
  handler: (...args: A) => Promise<Response>,
) {
  return async (...args: A): Promise<Response> => {
    try {
      const res = await handler(...args)
      res.headers.set("Cache-Control", "no-store")
      return res
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message, ...error.extra },
          { status: error.status, headers: noStore },
        )
      }
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: error.issues[0]?.message ?? "Invalid input",
            issues: error.issues.map((i) => ({
              path: i.path.join("."),
              message: i.message,
            })),
          },
          { status: 422, headers: noStore },
        )
      }
      console.error("[admin api]", error)
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500, headers: noStore },
      )
    }
  }
}
