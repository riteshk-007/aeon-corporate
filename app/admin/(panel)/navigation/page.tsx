import { requirePagePermission } from "@/lib/auth/guards"
import { PageHeader } from "@/components/admin/ui"
import { db } from "@/lib/db"
import { readMenuForAdmin } from "@/lib/menu"
import { MenuEditor } from "./menu-editor"

export const metadata = { title: "Menus" }

export default async function Page() {
  const user = await requirePagePermission("navigation:view")
  const [tops, svc] = await Promise.all([
    readMenuForAdmin(),
    db.service.findMany({ orderBy: { title: "asc" }, select: { id: true, slug: true, title: true, isPublished: true } }),
  ])
  const services = svc.map((s) => ({ id: s.id, path: `/services/${s.slug}`, name: s.isPublished ? s.title : `${s.title} (draft)` }))
  return (
    <>
      <PageHeader
        title="Menus"
        description="The dropdown menus in the website header. Each top item opens a panel: categories on the left, links on the right."
      />
      <MenuEditor initial={tops} canEdit={user.permissions.includes("navigation:edit")} services={services}
        canEditPages={user.permissions.includes("pages:edit")}
        canCreatePages={user.permissions.includes("pages:create")}
      />
    </>
  )
}
