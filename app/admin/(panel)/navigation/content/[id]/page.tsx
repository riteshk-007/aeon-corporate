import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { requirePagePermission } from "@/lib/auth/guards"
import { PageHeader } from "@/components/admin/ui"
import { readFaqs, readSections } from "@/lib/services"
import { PageForm } from "./page-form"

export const metadata = { title: "Edit page" }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePagePermission("pages:edit")
  const { id } = await params
  const s = await db.service.findUnique({ where: { id } })
  if (!s) notFound()
  return (
    <>
      <PageHeader title="Edit page content" description={`${s.category ? s.category + " › " : ""}${s.title}`} />
      <PageForm
        id={s.id}
        slug={s.slug}
        autoContent={s.autoContent}
        canDelete={user.permissions.includes("pages:delete")}
        initial={{
          title: s.title,
          category: s.category,
          icon: s.icon,
          summary: s.summary,
          highlights: s.highlights,
          sections: readSections(s.sections),
          faqs: readFaqs(s.faqs),
          heroImageUrl: s.heroImageUrl,
          seoTitle: s.seoTitle,
          seoDescription: s.seoDescription,
          isPublished: s.isPublished,
        }}
      />
    </>
  )
}
