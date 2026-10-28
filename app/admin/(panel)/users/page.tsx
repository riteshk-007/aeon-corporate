import { db } from "@/lib/db"
import { requirePagePermission } from "@/lib/auth/guards"
import { publicUserSelect } from "@/lib/auth/users"
import { PageHeader } from "@/components/admin/ui"
import { UsersClient } from "./users-client"

export const metadata = { title: "Admin Users" }

export default async function UsersPage() {
  const me = await requirePagePermission("users:view")
  const [users, roles] = await Promise.all([
    db.user.findMany({
      select: publicUserSelect,
      orderBy: { createdAt: "asc" },
    }),
    db.role.findMany({ orderBy: { createdAt: "asc" } }),
  ])

  return (
    <>
      <PageHeader
        title="Admin Users"
        description="Create admin accounts and decide which pages each person can open. There is no public sign-up: accounts are only created here, by someone allowed to."
      />
      <UsersClient
        me={{
          id: me.id,
          isSuperAdmin: me.isSuperAdmin,
          permissions: me.permissions,
        }}
        roles={roles.map((r) => ({
          id: r.id,
          name: r.name,
          permissions: r.permissions,
        }))}
        users={users.map((u) => ({
          ...u,
          lockedUntil: u.lockedUntil?.toISOString() ?? null,
          lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </>
  )
}
