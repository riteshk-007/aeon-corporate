"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { api } from "@/lib/admin-client"
import { adminBtn, adminInput } from "@/components/admin/ui"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [lockedFor, setLockedFor] = useState(0)

  // Countdown while the account is locked.
  useEffect(() => {
    if (lockedFor <= 0) return
    const t = window.setInterval(
      () => setLockedFor((s) => Math.max(0, s - 1)),
      1000,
    )
    return () => window.clearInterval(t)
  }, [lockedFor])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy || lockedFor > 0) return
    setBusy(true)
    setError("")
    const res = await api<{ mustChangePassword: boolean }>(
      "POST",
      "/api/admin/auth/login",
      {
        email,
        password,
      },
    )
    if (res.ok) {
      router.replace(
        res.data.mustChangePassword
          ? "/admin/account?change=required"
          : "/admin",
      )
      router.refresh()
      return
    }
    setBusy(false)
    setPassword("")
    setError(res.error)
    if (res.status === 423) {
      setLockedFor(15 * 60)
    }
  }

  const mm = String(Math.floor(lockedFor / 60)).padStart(2, "0")
  const ss = String(lockedFor % 60).padStart(2, "0")

  return (
    <form onSubmit={submit} className="grid gap-4" noValidate>
      {error && (
        <div
          role="alert"
          className={cn(
            "flex items-start gap-2.5 rounded-xl border p-3.5 text-[13px] font-semibold",
            lockedFor > 0
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-red-200 bg-red-50 text-red-700",
          )}
        >
          {lockedFor > 0 ? (
            <Lock size={16} className="mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          )}
          <span>
            {error}
            {lockedFor > 0 && (
              <b className="mt-1 block font-mono text-[15px]">
                Unlocks in {mm}:{ss}
              </b>
            )}
          </span>
        </div>
      )}

      <label className="grid gap-1.5 text-[13px] font-bold">
        Email
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={adminInput}
          disabled={busy}
        />
      </label>

      <label className="grid gap-1.5 text-[13px] font-bold">
        Password
        <span className="relative block">
          <input
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className={cn(adminInput, "pr-11")}
            disabled={busy}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-mute hover:text-ink"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>

      <button
        type="submit"
        disabled={busy || lockedFor > 0 || !email || !password}
        className={cn(adminBtn.primary, "mt-2 h-12 w-full text-[14px]")}
      >
        {busy ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
      <p className="text-center text-[12px] text-mute">
        There is no public sign-up. Ask an administrator to create your account.
      </p>
    </form>
  )
}
