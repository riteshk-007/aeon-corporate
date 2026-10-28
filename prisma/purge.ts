/**
 * Retention job (DPDP Act: keep personal data no longer than needed).
 * Deletes expired enquiries, old audit logs, expired sessions and old login
 * attempts. Run daily from cron on the host: `pnpm db:purge`.
 */
import "dotenv/config"
import { db } from "../lib/db"
import { RETENTION_DAYS } from "../lib/legal"
import { deleteObjects } from "../lib/storage"
import { removeResume } from "../lib/resume"

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000)

async function main() {
  const now = new Date()
  const expired = await db.lead.findMany({
    where: { retainUntil: { lt: now } },
    select: { details: true },
  })
  for (const l of expired) await removeResume(l.details)
  const leads = await db.lead.deleteMany({ where: { retainUntil: { lt: now } } })
  const audit = await db.auditLog.deleteMany({
    where: { createdAt: { lt: daysAgo(RETENTION_DAYS.auditLog) } },
  })
  const sessions = await db.session.deleteMany({ where: { expiresAt: { lt: now } } })
  const attempts = await db.loginAttempt.deleteMany({
    where: { createdAt: { lt: daysAgo(30) } },
  })
  // Uploads never attached to a saved job (abandoned drafts): remove from R2 too.
  const orphans = await db.asset.findMany({
    where: { jobId: null, serviceId: null, createdAt: { lt: daysAgo(1) } },
    select: { id: true, key: true },
  })
  await deleteObjects(orphans.map((a) => a.key))
  await db.asset.deleteMany({ where: { id: { in: orphans.map((a) => a.id) } } })
  console.log(
    `Purged: ${leads.count} enquiries, ${audit.count} audit rows, ${sessions.count} sessions, ${attempts.count} login attempts, ${orphans.length} unused uploads`,
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
