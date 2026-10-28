import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { requirePagePermission } from "@/lib/auth/guards"
import { PageHeader } from "@/components/admin/ui"
import { JobForm } from "../job-form"

export const metadata = { title: "Edit job" }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePagePermission("careers:edit")
  const { id } = await params
  const job = await db.job.findUnique({ where: { id } })
  if (!job) notFound()
  return (
    <>
      <PageHeader title="Edit job" description={job.title} />
      <JobForm
        id={job.id}
        canDelete={user.permissions.includes("careers:delete")}
        initial={{
          title: job.title,
          location: job.location,
          type: job.type,
          openings: job.openings,
          icon: job.icon,
          skills: job.skills,
          summary: job.summary,
          descriptionHtml: job.descriptionHtml,
          isOpen: job.isOpen,
        }}
      />
    </>
  )
}
