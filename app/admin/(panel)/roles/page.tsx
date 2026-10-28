import { db } from "@/lib/db"
import { requirePagePermission } from "@/lib/auth/guards"
import { PageHeader } from "@/components/admin/ui"
import { RolesClient } from "./roles-client"

export const metadata = { title: "Roles & Access" }

export default async function RolesPage() {
  const me = await requirePagePermission("roles:view")
  const roles = await db.role.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { users: true } } },
  })

  return (
    <>
      <PageHeader
        title="Roles & Access"
        description="A role is a ready-made set of page permissions. Put people in a role, then add extra pages to individuals from the Admin Users page."
      />
      <RolesClient
        me={{ isSuperAdmin: me.isSuperAdmin, permissions: me.permissions }}
        roles={roles.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description ?? "",
          isSystem: r.isSystem,
          permissions: r.permissions,
          users: r._count.users,
        }))}
      />
    </>
  )
}
