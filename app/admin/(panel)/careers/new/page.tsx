import { requirePagePermission } from "@/lib/auth/guards"
import { PageHeader } from "@/components/admin/ui"
import { JobForm, emptyJob } from "../job-form"

export const metadata = { title: "Add job" }

export default async function Page() {
  await requirePagePermission("careers:create")
  return (
    <>
      <PageHeader title="Add job" />
      <JobForm initial={emptyJob} canDelete={false} />
    </>
  )
}
