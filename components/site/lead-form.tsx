"use client"

import { useId, useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { btnBlue } from "@/components/site/ui"

export type LeadField = {
  name: string
  label: string
  type?: "text" | "email" | "tel" | "select" | "textarea" | "captcha"
  required?: boolean
  options?: string[]
  placeholder?: string
  autoComplete?: string
  /** span both columns */
  full?: boolean
}

type LeadFormProps = {
  fields: LeadField[]
  submitLabel: string
  successTitle: string
  successText: string
  /** simple arithmetic check, e.g. { a: 4, b: 7 } */
  captcha?: { a: number; b: number }
  className?: string
}

const inputBase =
  "w-full rounded-xl border border-line bg-[#f6faff] px-4 text-[15px] text-ink outline-none transition placeholder:text-mute/70 focus:border-brand focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,95,217,.12)] aria-[invalid=true]:border-red-400"

/**
 * Enquiry form with client-side validation.
 * No backend is connected yet, so it runs in demo mode and says so.
 */
export function LeadForm({
  fields,
  submitLabel,
  successTitle,
  successText,
  captcha,
  className,
}: LeadFormProps) {
  const uid = useId()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get("company_website")) return // honeypot
    const next: Record<string, string> = {}
    for (const f of fields) {
      const value = String(data.get(f.name) ?? "").trim()
      if (f.required && !value) next[f.name] = `${f.label} is required`
      else if (f.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value))
        next[f.name] = "Enter a valid email address"
      else if (
        f.type === "tel" &&
        value &&
        value.replace(/\D/g, "").length < 10
      )
        next[f.name] = "Enter a valid mobile number"
      else if (
        f.type === "captcha" &&
        captcha &&
        Number(value) !== captcha.a + captcha.b
      )
        next[f.name] = "That answer is not correct"
    }
    setErrors(next)
    if (Object.keys(next).length === 0) setSent(true)
  }

  if (sent) {
    return (
      <div
        role="status"
        className={cn(
          "grid place-items-center rounded-2xl bg-[#eaf3ff] p-8 text-center",
          className,
        )}
      >
        <span className="grid size-14 place-items-center rounded-full bg-brand text-white shadow-[0_10px_24px_rgba(27,95,217,.3)]">
          <Check size={26} />
        </span>
        <h3 className="mt-5 text-xl font-bold tracking-[-0.02em]">
          {successTitle}
        </h3>
        <p className="mt-2 max-w-[360px] text-[14px] leading-[1.7] text-mute">
          {successText}
        </p>
        <p className="mt-3 text-[12px] font-semibold text-brand">
          Demo mode: no data was saved because a backend isn&apos;t connected
          yet.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 text-[13px] font-bold text-brand hover:underline"
        >
          Send another response
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn(
        "grid grid-cols-2 gap-4 max-[560px]:grid-cols-1",
        className,
      )}
    >
      {/* honeypot: hidden from people, bots tend to fill it */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      {fields.map((f) => {
        const id = `${uid}-${f.name}`
        const error = errors[f.name]
        const label =
          f.type === "captcha" && captcha
            ? `${f.label}: ${captcha.a} + ${captcha.b} =`
            : f.label
        return (
          <div
            key={f.name}
            className={cn(
              f.full || f.type === "textarea"
                ? "col-span-2 max-[560px]:col-span-1"
                : "",
            )}
          >
            <label
              htmlFor={id}
              className="mb-1.5 block text-[13px] font-bold text-ink"
            >
              {label}
              {f.required && <span className="text-red-500"> *</span>}
            </label>
            {f.type === "select" ? (
              <select
                id={id}
                name={f.name}
                defaultValue=""
                aria-invalid={!!error}
                className={cn(inputBase, "h-12")}
              >
                <option value="" disabled>
                  {f.placeholder ?? `Select ${f.label.toLowerCase()}`}
                </option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                id={id}
                name={f.name}
                rows={4}
                placeholder={f.placeholder}
                aria-invalid={!!error}
                className={cn(inputBase, "resize-y py-3")}
              />
            ) : (
              <input
                id={id}
                name={f.name}
                type={f.type === "captcha" ? "text" : (f.type ?? "text")}
                inputMode={
                  f.type === "tel" || f.type === "captcha"
                    ? "numeric"
                    : undefined
                }
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                aria-invalid={!!error}
                className={cn(inputBase, "h-12")}
              />
            )}
            {error && (
              <p
                className="mt-1 text-[12px] font-semibold text-red-500"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
        )
      })}
      <div className="col-span-2 mt-1 max-[560px]:col-span-1">
        <button
          type="submit"
          className={cn(btnBlue, "h-12 w-full px-8 sm:w-auto")}
        >
          {submitLabel} <ArrowRight size={16} />
        </button>
      </div>
    </form>
  )
}
