import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { getAuthUser } from "@/lib/auth/session"
import { Card, adminBtn } from "@/components/admin/ui"

export const metadata = { title: "No access" }

export default async function ForbiddenPage() {
  await getAuthUser()
  return (
    <Card className="mx-auto mt-10 max-w-[520px] p-10 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 text-red-600">
        <ShieldAlert size={30} />
      </span>
      <h1 className="mt-5 text-[24px] font-extrabold tracking-[-0.02em]">
        You do not have access to this page
      </h1>
      <p className="mt-2 text-[14px] leading-[1.7] text-mute">
        Ask an administrator to give you access. They can add this page to your
        account without changing anything else.
      </p>
      <Link href="/admin" className={`${adminBtn.primary} mt-6`}>
        Back to dashboard
      </Link>
    </Card>
  )
}
