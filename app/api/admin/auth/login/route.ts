import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { audit } from "@/lib/auth/audit"
import { createSession } from "@/lib/auth/session"
import { dummyHash, verifyPassword } from "@/lib/auth/password"
import { loginSchema } from "@/lib/auth/schemas"
import {
  assertSameOrigin,
  ApiError,
  clientIp,
  readJson,
  route,
} from "@/lib/auth/request"
import {
  MAX_FAILED_ATTEMPTS,
  LOCK_WINDOW_MS,
  clearFailures,
  failureState,
  pruneAuthData,
  recordAttempt,
} from "@/lib/auth/login-guard"

const lockedMessage = (seconds: number) =>
  `Too many failed attempts. Try again in ${Math.ceil(seconds / 60)} minute(s).`

export const POST = route(async (req: Request) => {
  assertSameOrigin(req)
  const ip = clientIp(req)
  const { email, password } = loginSchema.parse(await readJson(req))

  // 1. Already locked? Same answer whether or not the account exists.
  const before = await failureState(email, ip)
  if (before.ipBlocked) {
    throw new ApiError(
      429,
      "Too many attempts from this network. Try again later.",
      {
        retryAfterSeconds: LOCK_WINDOW_MS / 1000,
      },
    )
  }
  if (before.locked) {
    throw new ApiError(423, lockedMessage(before.retryAfterSeconds), {
      locked: true,
      retryAfterSeconds: before.retryAfterSeconds,
    })
  }

  // 2. Always verify a hash, so unknown emails take as long as real ones.
  const user = await db.user.findUnique({ where: { email } })
  const valid = await verifyPassword(
    user?.passwordHash ?? (await dummyHash()),
    password,
  )
  const ok = Boolean(user && valid && user.isActive)

  if (!ok) {
    await recordAttempt(email, ip, false)
    const after = await failureState(email, ip)
    if (user) {
      await db.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: after.byEmail,
          lockedUntil: after.locked
            ? new Date(Date.now() + LOCK_WINDOW_MS)
            : null,
        },
      })
    }
    await audit({
      actorEmail: email,
      action: after.locked ? "auth.locked" : "auth.login_failed",
      ip,
    })
    if (after.locked) {
      throw new ApiError(
        423,
        `Too many failed attempts (${MAX_FAILED_ATTEMPTS}). Account locked for ${LOCK_WINDOW_MS / 60000} minutes.`,
        { locked: true, retryAfterSeconds: LOCK_WINDOW_MS / 1000 },
      )
    }
    throw new ApiError(401, "Invalid email or password")
  }

  // 3. Success: reset counters, open a brand-new session.
  await clearFailures(email)
  await recordAttempt(email, ip, true)
  await db.user.update({
    where: { id: user!.id },
    data: {
      failedAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    },
  })
  await createSession(user!.id, {
    ip,
    userAgent: req.headers.get("user-agent") ?? undefined,
  })
  await audit({ actor: user!, action: "auth.login", ip })
  if (Math.random() < 0.05) void pruneAuthData()

  return NextResponse.json({
    ok: true,
    mustChangePassword: user!.mustChangePassword,
  })
})
