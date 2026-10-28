"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"
import { api } from "@/lib/admin-client"
import { adminBtn, adminInput } from "@/components/admin/ui"
import { PasswordField } from "@/components/admin/password-field"
import { passwordProblems } from "@/lib/auth/password-policy"

export function AccountForm({ email, name }: { email: string; name: string }) {
  const router = useRouter()
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setDone(false)
    const res = await api("POST", "/api/admin/auth/password", {
      currentPassword: current,
      newPassword: next,
    }, { success: "Password changed" })
    setBusy(false)
    if (!res.ok) return
    setDone(true)
    setCurrent("")
    setNext("")
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      {done && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[13px] font-semibold text-emerald-700"
        >
          <Check size={16} /> Password changed. Your other devices were signed
          out.
        </p>
      )}
      <label className="grid gap-1.5 text-[13px] font-bold">
        Current password
        <input
          type="password"
          className={adminInput}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      <PasswordField
        label="New password"
        value={next}
        onChange={setNext}
        email={email}
        name={name}
      />
      <div>
        <button
          type="submit"
          disabled={
            busy ||
            !current ||
            passwordProblems(next, { email, name }).length > 0
          }
          className={adminBtn.primary}
        >
          {busy && <Loader2 size={16} className="animate-spin" />} Update
          password
        </button>
      </div>
    </form>
  )
}
