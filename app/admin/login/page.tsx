import { redirect } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { getAuthUser } from "@/lib/auth/session"
import { Logo } from "@/components/site/ui"
import { LoginForm } from "./login-form"

export const metadata = { title: "Sign in" }

export default async function LoginPage() {
  const user = await getAuthUser()
  if (user) redirect("/admin")

  return (
    <main className="grid min-h-screen grid-cols-[1.05fr_0.95fr] bg-white max-[900px]:grid-cols-1">
      <section className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#1b5fd9,#0a44b8)] p-12 text-white max-[900px]:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,.3)_1px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_70%_at_30%_70%,black,transparent)]" />
        <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-sun/25 blur-[100px]" />
        <Logo light />
        <div className="relative max-w-[460px]">
          <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-white/15 backdrop-blur">
            <ShieldCheck size={28} />
          </span>
          <h1 className="text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em]">
            Manage Aeon Corporate, securely.
          </h1>
          <p className="mt-4 text-[15px] leading-[1.7] text-white/80">
            Role-based access, per-page permissions and a full audit trail.
            Accounts lock for 15 minutes after 5 failed sign-ins.
          </p>
        </div>
        <p className="relative text-[12px] text-white/60">
          Authorised staff only. Activity on this panel is logged.
        </p>
      </section>

      <section className="grid place-items-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 min-[901px]:hidden">
            <Logo />
          </div>
          <h2 className="text-[30px] font-extrabold tracking-[-0.03em]">
            Sign in
          </h2>
          <p className="mt-1.5 mb-7 text-[14px] text-mute">
            Use the email and password given to you by an administrator.
          </p>
          <LoginForm />
        </div>
      </section>
    </main>
  )
}
