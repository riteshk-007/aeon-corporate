import { requireUser } from "@/lib/auth/guards"
import { Badge, Card, PageHeader } from "@/components/admin/ui"
import { MODULES } from "@/lib/auth/permissions"
import { AccountForm } from "./account-form"

export const metadata = { title: "My account" }

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ change?: string }>
}) {
  const user = await requireUser({ allowPasswordChange: true })
  const forced =
    user.mustChangePassword || (await searchParams).change === "required"
  const pages = MODULES.filter((m) =>
    user.permissions.includes(`${m.key}:view` as never),
  )

  return (
    <>
      <PageHeader
        title="My account"
        description="Your sign-in details and password."
      />
      <div className="grid grid-cols-[1fr_1fr] items-start gap-6 max-[1024px]:grid-cols-1">
        <Card className="p-6">
          <h2 className="mb-4 text-[17px] font-bold">Change password</h2>
          {forced && user.mustChangePassword && (
            <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] font-semibold text-amber-800">
              For your security, choose a new password before you continue.
            </p>
          )}
          <AccountForm email={user.email} name={user.name} />
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-[17px] font-bold">Profile</h2>
          <dl className="grid gap-3 text-[14px]">
            <div>
              <dt className="text-[12px] font-bold tracking-wider text-mute uppercase">
                Name
              </dt>
              <dd className="font-semibold">{user.name}</dd>
            </div>
            <div>
              <dt className="text-[12px] font-bold tracking-wider text-mute uppercase">
                Email (login ID)
              </dt>
              <dd className="font-semibold">{user.email}</dd>
            </div>
            <div>
              <dt className="text-[12px] font-bold tracking-wider text-mute uppercase">
                Role
              </dt>
              <dd>
                <Badge tone="navy">
                  {user.isSuperAdmin ? "Super admin" : user.roleName}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="mb-1.5 text-[12px] font-bold tracking-wider text-mute uppercase">
                Pages you can open
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {pages.length ? (
                  pages.map((m) => (
                    <Badge key={m.key} tone="blue">
                      {m.label}
                    </Badge>
                  ))
                ) : (
                  <span className="text-mute">None yet</span>
                )}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  )
}
