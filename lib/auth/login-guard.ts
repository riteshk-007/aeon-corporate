import { db } from "@/lib/db"

export const MAX_FAILED_ATTEMPTS = 5
export const LOCK_WINDOW_MS = 15 * 60 * 1000
const MAX_FAILED_PER_IP = 20

/** Failed tries for this email inside the window (works for unknown emails too). */
export async function failureState(email: string, ip: string) {
  const since = new Date(Date.now() - LOCK_WINDOW_MS)
  const [byEmail, byIp, latest] = await Promise.all([
    db.loginAttempt.count({
      where: { email, success: false, createdAt: { gte: since } },
    }),
    db.loginAttempt.count({
      where: { ip, success: false, createdAt: { gte: since } },
    }),
    db.loginAttempt.findFirst({
      where: { email, success: false, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ])
  const locked = byEmail >= MAX_FAILED_ATTEMPTS
  const retryAfterSeconds =
    locked && latest
      ? Math.max(
          1,
          Math.ceil(
            (latest.createdAt.getTime() + LOCK_WINDOW_MS - Date.now()) / 1000,
          ),
        )
      : 0
  return {
    byEmail,
    locked,
    retryAfterSeconds,
    ipBlocked: byIp >= MAX_FAILED_PER_IP,
  }
}

export const recordAttempt = (email: string, ip: string, success: boolean) =>
  db.loginAttempt.create({ data: { email, ip, success } })

/** Called on success, or when an admin presses "Unlock". */
export const clearFailures = (email: string) =>
  db.loginAttempt.deleteMany({ where: { email, success: false } })

/** Housekeeping: drop old attempts and expired sessions. */
export async function pruneAuthData() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
  await Promise.all([
    db.loginAttempt.deleteMany({ where: { createdAt: { lt: cutoff } } }),
    db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
  ])
}
