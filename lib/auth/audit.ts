import { db } from "@/lib/db"
import type { Prisma } from "@/lib/generated/prisma/client"

/** The log keeps the latest entries only: past AUDIT_MAX rows, the oldest AUDIT_PRUNE are removed. */
export const AUDIT_MAX = 500
export const AUDIT_PRUNE = 100

async function pruneAuditLog() {
  // Loop so a log that grew far past the limit (for example after a restore) shrinks back too.
  for (let i = 0; i < 20; i++) {
    const total = await db.auditLog.count()
    if (total <= AUDIT_MAX) return
    const oldest = await db.auditLog.findMany({ orderBy: { createdAt: "asc" }, take: AUDIT_PRUNE, select: { id: true } })
    await db.auditLog.deleteMany({ where: { id: { in: oldest.map((o) => o.id) } } })
  }
}

export async function audit(entry: {
  actor?: { id: string; email: string } | null
  actorEmail?: string
  action: string
  target?: string
  meta?: Prisma.InputJsonValue
  ip?: string
}) {
  try {
    await db.auditLog.create({
      data: {
        actorId: entry.actor?.id,
        actorEmail: entry.actor?.email ?? entry.actorEmail,
        action: entry.action,
        target: entry.target,
        meta: entry.meta,
        ip: entry.ip,
      },
    })
    await pruneAuditLog()
  } catch (error) {
    console.error("[audit]", error)
  }
}
