import Link from "next/link"
import { db } from "@/lib/db"
import { requirePagePermission } from "@/lib/auth/guards"
import { Badge, Card, PageHeader, adminBtn } from "@/components/admin/ui"
import { formatDate } from "@/lib/admin-client"

export const metadata = { title: "Careers" }

export default async function Page() {
  const user = await requirePagePermission("careers:view")
  const jobs = await db.job.findMany({ orderBy: { createdAt: "desc" } })
  const canCreate = user.permissions.includes("careers:create")
  const canEdit = user.permissions.includes("careers:edit")

  return (
    <>
      <PageHeader
        title="Careers"
        description="Job openings shown on the website. Applications arrive under Enquiries (type: career)."
        actions={
          canCreate && (
            <Link href="/admin/careers/new" className={adminBtn.primary}>
              Add job
            </Link>
          )
        }
      />
      <Card className="overflow-hidden max-[760px]:hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="bg-pale text-[11px] font-black tracking-[.12em] text-mute uppercase">
              <tr>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-3 py-3.5">Location</th>
                <th className="px-3 py-3.5">Openings</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Updated</th>
                <th className="px-5 py-3.5 text-right">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-pale/50">
                  <td className="px-5 py-3 font-semibold">{j.title}</td>
                  <td className="px-3 py-3 text-mute">{j.location} · {j.type}</td>
                  <td className="px-3 py-3">{j.openings}</td>
                  <td className="px-3 py-3"><Badge tone={j.isOpen ? "green" : "gray"}>{j.isOpen ? "Open" : "Hidden"}</Badge></td>
                  <td className="px-3 py-3 whitespace-nowrap text-mute">{formatDate(j.updatedAt)}</td>
                  <td className="px-5 py-3 text-right">
                    {canEdit && (<Link href={`/admin/careers/${j.id}`} className={adminBtn.ghost}>Edit</Link>)}
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-mute">
                    No jobs yet. The Careers page on the website shows “no openings” until you add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Phones: one card per job */}
      <ul className="grid gap-3 min-[761px]:hidden">
        {jobs.map((j) => (
          <li key={j.id}>
            <Card className="grid gap-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b className="text-[15px] [overflow-wrap:anywhere]">{j.title}</b>
                <Badge tone={j.isOpen ? "green" : "gray"}>{j.isOpen ? "Open" : "Hidden"}</Badge>
              </div>
              <p className="text-[13px] text-mute">{j.location} · {j.type} · {j.openings} {j.openings === 1 ? "opening" : "openings"}</p>
              <p className="text-[12px] text-mute">Updated {formatDate(j.updatedAt)}</p>
              {canEdit && (
                <Link href={`/admin/careers/${j.id}`} className={adminBtn.ghost}>
                  Edit
                </Link>
              )}
            </Card>
          </li>
        ))}
        {jobs.length === 0 && <li className="p-6 text-center text-[13px] text-mute">No jobs yet. The Careers page on the website shows “no openings” until you add one.</li>}
      </ul>
    </>
  )
}
