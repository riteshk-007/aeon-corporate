"use client"

import { useId, useState } from "react"
import { Check, Copy, Eye, EyeOff, Wand2 } from "lucide-react"
import { adminInput } from "@/components/admin/ui"
import { cn } from "@/lib/utils"
import {
  PASSWORD_RULES,
  generatePassword,
  passwordProblems,
} from "@/lib/auth/password-policy"

/** Password input with live strength feedback, a strong generator and copy. */
export function PasswordField({
  label = "Password",
  value,
  onChange,
  email,
  name,
  autoComplete = "new-password",
  showGenerator = true,
}: {
  label?: string
  value: string
  onChange: (v: string) => void
  email?: string
  name?: string
  autoComplete?: string
  showGenerator?: boolean
}) {
  const id = useId()
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)
  const problems = value ? passwordProblems(value, { email, name }) : []
  const strong = value.length > 0 && problems.length === 0

  const generate = () => {
    onChange(generatePassword())
    setShow(true)
    setCopied(false)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked: the password is visible anyway */
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-end justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-bold">
          {label}
        </label>
        {showGenerator && (
          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand hover:underline"
          >
            <Wand2 size={14} /> Generate strong password
          </button>
        )}
      </div>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          spellCheck={false}
          className={cn(adminInput, "pr-[84px] font-mono")}
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5">
          {value && (
            <button
              type="button"
              onClick={copy}
              aria-label="Copy password"
              className="grid size-8 place-items-center rounded-lg text-mute hover:bg-pale hover:text-ink"
            >
              {copied ? (
                <Check size={16} className="text-emerald-600" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
            className="grid size-8 place-items-center rounded-lg text-mute hover:bg-pale hover:text-ink"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {value ? (
        strong ? (
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-700">
            <Check size={14} /> Strong password
          </p>
        ) : (
          <ul className="grid gap-0.5 text-[12px] font-semibold text-red-600">
            {problems.slice(0, 4).map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
        )
      ) : (
        <ul className="grid gap-0.5 text-[12px] text-mute">
          {PASSWORD_RULES.map((r) => (
            <li key={r}>• {r}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
