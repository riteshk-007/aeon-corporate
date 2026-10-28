import Link from "next/link"
import { db } from "@/lib/db"
import { requirePagePermission } from "@/lib/auth/guards"
import { Badge, Card, PageHeader, adminBtn } from "@/components/admin/ui"
import { formatDate } from "@/lib/admin-client"
import { cn } from "@/lib/utils"

export const metadata = { title: "Audit Log" }

const PAGE_SIZE = 40

const tone = (action: string) =>
  action.includes("failed") ||
  action.includes("locked") ||
  action.includes("delete")
    ? "red"
    : action.startsWith("auth.login") || action.startsWith("auth.logout")
      ? "gray"
      : "blue"

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  await requirePagePermission("audit:view")
  const page = Math.max(1, Number((await searchParams).page) || 1)

  const [rows, total] = await Promise.all([
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    db.auditLog.count(),
  ])
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <>
      <PageHeader
        title="Audit Log"
        description="Sign-ins, failed attempts, and every change to admins, roles, menus and pages. Only the latest 500 entries are kept: when it passes 500, the oldest 100 are removed automatically."
      />
      <Card className="overflow-hidden max-[760px]:hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead className="bg-pale text-[11px] font-black tracking-[.12em] text-mute uppercase">
              <tr>
                <th className="px-5 py-3.5">When</th>
                <th className="px-3 py-3.5">Action</th>
                <th className="px-3 py-3.5">Who</th>
                <th className="px-3 py-3.5">Target</th>
                <th className="px-5 py-3.5">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id} className="align-top hover:bg-pale/50">
                  <td className="px-5 py-3 whitespace-nowrap text-mute">
                    {formatDate(r.createdAt)}
                  </td>
                  <td className="px-3 py-3">
                    <Badge tone={tone(r.action)}>{r.action}</Badge>
                  </td>
                  <td className="px-3 py-3 font-semibold">
                    {r.actorEmail ?? "system"}
                  </td>
                  <td className="px-3 py-3 text-mute">{r.target ?? "–"}</td>
                  <td className="px-5 py-3 font-mono text-[12px] text-mute">
                    {r.ip ?? "–"}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-mute">
                    No activity yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Phones: one card per entry */}
      <ul className="grid gap-3 min-[761px]:hidden">
        {rows.map((r) => (
          <li key={r.id}>
            <Card className="grid gap-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge tone={tone(r.action)}>{r.action}</Badge>
                <span className="text-[12px] text-mute">{formatDate(r.createdAt)}</span>
              </div>
              <p className="text-[13px] font-semibold [overflow-wrap:anywhere]">{r.actorEmail ?? "system"}</p>
              {r.target && <p className="text-[12px] text-mute [overflow-wrap:anywhere]">{r.target}</p>}
              {r.ip && <p className="font-mono text-[11px] text-mute">{r.ip}</p>}
            </Card>
          </li>
        ))}
        {rows.length === 0 && <li className="p-6 text-center text-[13px] text-mute">No activity yet.</li>}
      </ul>

      {pages > 1 && (
        <nav
          className="mt-5 flex items-center justify-between"
          aria-label="Pagination"
        >
          <Link
            href={`/admin/audit?page=${page - 1}`}
            aria-disabled={page <= 1}
            className={cn(
              adminBtn.ghost,
              page <= 1 && "pointer-events-none opacity-40",
            )}
          >
            Newer
          </Link>
          <span className="text-[13px] font-semibold text-mute">
            Page {page} of {pages}
          </span>
          <Link
            href={`/admin/audit?page=${page + 1}`}
            aria-disabled={page >= pages}
            className={cn(
              adminBtn.ghost,
              page >= pages && "pointer-events-none opacity-40",
            )}
          >
            Older
          </Link>
        </nav>
      )}
    </>
  )
}
