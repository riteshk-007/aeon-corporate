import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth/session"
import { navFor } from "@/lib/admin-nav"
import { AdminShell } from "@/components/admin/shell"

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getAuthUser()
  if (!user) redirect("/admin/login")

  // Until a temporary password is replaced, only the account page is usable.
  const groups = user.mustChangePassword ? [] : navFor(user.permissions)

  return (
    <AdminShell
      user={{
        name: user.name,
        email: user.email,
        roleName: user.roleName,
        isSuperAdmin: user.isSuperAdmin,
      }}
      groups={groups}
    >
      {children}
    </AdminShell>
  )
}
