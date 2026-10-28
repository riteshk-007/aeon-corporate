import Link from "next/link"
import {
  ArrowUpRight,
  KeyRound,
  ScrollText,
  ShieldAlert,
  Users,
} from "lucide-react"
import { db } from "@/lib/db"
import { requirePagePermission } from "@/lib/auth/guards"
import { Badge, Card, PageHeader } from "@/components/admin/ui"
import { formatDate } from "@/lib/admin-client"

export const metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const user = await requirePagePermission("dashboard:view")
  const can = (p: string) => (user.permissions as string[]).includes(p)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const [admins, roles, sessions, failed, recent] = await Promise.all([
    can("users:view") ? db.user.count({ where: { isActive: true } }) : null,
    can("roles:view") ? db.role.count() : null,
    can("users:view")
      ? db.session.count({ where: { expiresAt: { gt: new Date() } } })
      : null,
    can("audit:view")
      ? db.loginAttempt.count({
          where: { success: false, createdAt: { gte: since } },
        })
      : null,
    can("audit:view")
      ? db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 })
      : [],
  ])

  const stats = [
    {
      label: "Active admins",
      value: admins,
      icon: Users,
      href: "/admin/users",
    },
    { label: "Roles", value: roles, icon: KeyRound, href: "/admin/roles" },
    {
      label: "Open sessions",
      value: sessions,
      icon: ScrollText,
      href: "/admin/users",
    },
    {
      label: "Failed sign-ins (24h)",
      value: failed,
      icon: ShieldAlert,
      href: "/admin/audit",
    },
  ].filter((s) => s.value !== null)

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Here is what is happening on the admin panel."
      />

      {stats.length > 0 && (
        <div className="grid grid-cols-4 gap-4 max-[1024px]:grid-cols-2 max-[560px]:grid-cols-1">
          {stats.map(({ label, value, icon: Icon, href }) => (
            <Link key={label} href={href} className="group">
              <Card className="p-5 transition group-hover:-translate-y-0.5 group-hover:border-brand/40">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-[#dcebff] text-brand">
                    <Icon size={20} />
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-mute opacity-0 transition group-hover:opacity-100"
                  />
                </div>
                <b className="mt-4 block text-[32px] leading-none font-extrabold">
                  {value}
                </b>
                <span className="mt-1.5 block text-[13px] font-semibold text-mute">
                  {label}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-[1.4fr_1fr] gap-6 max-[1024px]:grid-cols-1">
        {can("audit:view") && (
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[17px] font-bold">Recent activity</h2>
              <Link
                href="/admin/audit"
                className="text-[13px] font-bold text-brand hover:underline"
              >
                View all
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="text-[14px] text-mute">Nothing yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {recent.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <span className="min-w-0 text-[13px]">
                      <b className="block truncate">{r.action}</b>
                      <span className="block truncate text-mute">
                        {r.actorEmail ?? "system"}
                        {r.target ? ` → ${r.target}` : ""}
                      </span>
                    </span>
                    <time className="shrink-0 text-[12px] text-mute">
                      {formatDate(r.createdAt)}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        <Card className="p-6">
          <h2 className="mb-4 text-[17px] font-bold">Your access</h2>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge tone="navy">
              {user.isSuperAdmin ? "Super admin" : user.roleName}
            </Badge>
            <Badge tone="blue">{user.permissions.length} permissions</Badge>
          </div>
          <p className="text-[13px] leading-[1.7] text-mute">
            The pages in the left menu are the ones you can open. An
            administrator can give you access to more pages at any time.
          </p>
        </Card>
      </div>
    </>
  )
}
