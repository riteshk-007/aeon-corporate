import { createHash, randomBytes } from "node:crypto"
import { cache } from "react"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { effectivePermissions, type Permission } from "@/lib/auth/permissions"

const isProd = process.env.NODE_ENV === "production"
/** `__Host-` pins the cookie to this exact host over HTTPS (production only). */
export const SESSION_COOKIE = isProd ? "__Host-aeon_session" : "aeon_session"

/** Signed in for 7 days; the token is renewed automatically while the panel is in use. */
const SESSION_MS = 7 * 24 * 60 * 60 * 1000
/** Even with renewals, sign in again after 30 days. */
const HARD_CAP_MS = 30 * 24 * 60 * 60 * 1000
/** Rotate the cookie token when it is older than this. */
const ROTATE_AFTER_MS = 12 * 60 * 60 * 1000
const TOUCH_EVERY_MS = 5 * 60 * 1000

const sha256 = (value: string) =>
  createHash("sha256").update(value).digest("hex")

export type AuthUser = {
  id: string
  email: string
  name: string
  roleId: string
  roleName: string
  isSuperAdmin: boolean
  mustChangePassword: boolean
  permissions: Permission[]
  sessionId: string
}

export async function createSession(
  userId: string,
  meta: { ip?: string; userAgent?: string },
) {
  const token = randomBytes(32).toString("base64url")
  const expiresAt = new Date(Date.now() + SESSION_MS)
  await db.session.create({
    data: {
      id: sha256(token),
      userId,
      ip: meta.ip?.slice(0, 64),
      userAgent: meta.userAgent?.slice(0, 255),
      expiresAt,
    },
  })
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  })
}

/** The signed-in admin for this request, or null. Cached per request. */
export const getAuthUser = cache(async (): Promise<AuthUser | null> => {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token || token.length > 128) return null

  const id = sha256(token)
  const session = await db.session.findUnique({
    where: { id },
    include: { user: { include: { role: true } } },
  })
  if (!session) return null

  const now = Date.now()
  const expired =
    session.expiresAt.getTime() <= now ||
    now - session.startedAt.getTime() > HARD_CAP_MS ||
    !session.user.isActive
  if (expired) {
    await db.session.delete({ where: { id } }).catch(() => {})
    return null
  }
  if (now - session.lastUsedAt.getTime() > TOUCH_EVERY_MS) {
    await db.session
      .update({ where: { id }, data: { lastUsedAt: new Date() } })
      .catch(() => {})
  }

  const { user } = session
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
    roleName: user.role.name,
    isSuperAdmin: user.isSuperAdmin,
    mustChangePassword: user.mustChangePassword,
    permissions: [...effectivePermissions(user)],
    sessionId: id,
  }
})

export async function destroyCurrentSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) {
    await db.session.delete({ where: { id: sha256(token) } }).catch(() => {})
  }
  store.delete(SESSION_COOKIE)
}

/** Sign a user out everywhere (optionally keeping one session). */
export async function destroyUserSessions(
  userId: string,
  exceptSessionId?: string,
) {
  await db.session.deleteMany({
    where: {
      userId,
      ...(exceptSessionId ? { id: { not: exceptSessionId } } : {}),
    },
  })
}

/**
 * Swap the cookie token for a fresh one and push the expiry 7 days ahead.
 * The old token keeps working for 60 seconds so parallel requests don't fail.
 * Call from a route handler (cookies can't be set while rendering a page).
 */
export async function refreshSession(): Promise<"rotated" | "fresh" | "none"> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token || token.length > 128) return "none"
  const old = await db.session.findUnique({ where: { id: sha256(token) } })
  if (!old) return "none"
  const now = Date.now()
  if (
    old.expiresAt.getTime() <= now ||
    now - old.startedAt.getTime() > HARD_CAP_MS
  ) {
    return "none"
  }
  if (now - old.createdAt.getTime() < ROTATE_AFTER_MS) return "fresh"

  const next = randomBytes(32).toString("base64url")
  const expiresAt = new Date(now + SESSION_MS)
  await db.$transaction([
    db.session.create({
      data: {
        id: sha256(next),
        userId: old.userId,
        ip: old.ip,
        userAgent: old.userAgent,
        startedAt: old.startedAt,
        expiresAt,
      },
    }),
    db.session.update({
      where: { id: old.id },
      data: { expiresAt: new Date(now + 60_000) },
    }),
  ])
  store.set(SESSION_COOKIE, next, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  })
  return "rotated"
}
