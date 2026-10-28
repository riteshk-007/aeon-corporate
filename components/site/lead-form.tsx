"use client"

import { useId, useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ConsentCheckbox } from "@/components/site/consent-checkbox"

export type LeadField = {
  name: string
  label: string
  type?: "text" | "email" | "tel" | "select" | "textarea" | "captcha" | "file"
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
  /** which enquiry this is; decides how it is stored and how long it is kept */
  kind: "contact" | "partner" | "career"
  /** show the separate, optional "send me updates" checkbox */
  marketing?: boolean
  /** extra context saved with the enquiry, e.g. the job applied for */
  extra?: Record<string, string>
  /** 1 = every field on its own row (narrow cards); 2 = two per row */
  columns?: 1 | 2
  className?: string
}

const inputBase =
  "h-12 rounded-xl border-line bg-[#f6faff] px-4 text-[15px] text-ink shadow-none placeholder:text-mute/70 focus-visible:border-brand focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand/15 aria-invalid:border-red-400 aria-invalid:ring-red-100 md:text-[15px]"

const DIRECT = new Set(["name", "email", "phone", "state", "message"])

/**
 * Enquiry form: validates, requires explicit consent (DPDP Act), then posts
 * to /api/enquiries.
 */
export function LeadForm({
  fields,
  submitLabel,
  successTitle,
  successText,
  captcha,
  kind,
  marketing = false,
  extra,
  columns = 2,
  className,
}: LeadFormProps) {
  const [selects, setSelects] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<Record<string, File | null>>({})
  const uid = useId()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [serverError, setServerError] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get("company_website")) return // honeypot
    const next: Record<string, string> = {}
    if (data.get("consent") !== "on")
      next.consent = "Please tick this box to continue"
    for (const f of fields) {
      const value = String(selects[f.name] ?? data.get(f.name) ?? "").trim()
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
    for (const f of fields) {
      const file = files[f.name]
      if (f.type === "file" && file) {
        if (file.size > 5 * 1024 * 1024) next[f.name] = "File is too large (max 5 MB)"
        else if (!/\.(pdf|jpe?g|png|webp)$/i.test(file.name)) next[f.name] = "Use a PDF, JPG, PNG or WebP file"
      }
    }
    setErrors(next)
    setServerError("")
    if (Object.keys(next).length > 0) return

    const body: Record<string, unknown> = {
      kind,
      consent: true,
      marketingOptIn: data.get("marketing") === "on",
      source: window.location.pathname,
    }
    const details: Record<string, string> = { ...extra }
    for (const f of fields) {
      if (f.type === "captcha" || f.type === "file") continue
      const value = String(selects[f.name] ?? data.get(f.name) ?? "").trim()
      if (!value) continue
      if (DIRECT.has(f.name)) body[f.name] = value
      else if (f.name === "note") body.message = value
      else details[f.name] = value
    }
    if (Object.keys(details).length) body.details = details

    setBusy(true)
    try {
      for (const f of fields) {
        const file = files[f.name]
        if (f.type !== "file" || !file) continue
        const up = new FormData()
        up.append("file", file)
        const upRes = await fetch("/api/careers/resume", { method: "POST", body: up })
        const upJson = (await upRes.json().catch(() => null)) as { url?: string; name?: string; error?: string } | null
        if (!upRes.ok || !upJson?.url) {
          setServerError(upJson?.error ?? "Could not upload the file. Please try again or paste a link instead.")
          return
        }
        details.resumeUrl = upJson.url
        details.resumeName = upJson.name ?? file.name
        body.details = details
      }
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as {
          error?: string
        } | null
        setServerError(json?.error ?? "Could not send. Please try again.")
        return
      }
      setSent(true)
    } catch {
      setServerError("Network error. Please check your connection and retry.")
    } finally {
      setBusy(false)
    }
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
        "grid gap-4",
        columns === 2 ? "grid-cols-2 max-[560px]:grid-cols-1" : "grid-cols-1",
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
              "grid min-w-0 content-start gap-1.5",
              columns === 2 && (f.full || f.type === "textarea")
                ? "col-span-2 max-[560px]:col-span-1"
                : "",
            )}
          >
            <Label htmlFor={id} className="text-[13px] font-bold text-ink">
              {label}
              {f.required && <span className="text-red-500"> *</span>}
            </Label>
            {f.type === "select" ? (
              <Select
                value={selects[f.name] ?? null}
                onValueChange={(v) =>
                  setSelects((s) => ({ ...s, [f.name]: String(v ?? "") }))
                }
              >
                <SelectTrigger
                  id={id}
                  aria-invalid={!!error}
                  className={cn(inputBase, "w-full py-0 pr-3 data-[size=default]:h-12")}
                >
                  <SelectValue
                    placeholder={f.placeholder ?? `Select ${f.label.toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {f.options?.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : f.type === "file" ? (
              <Input
                id={id}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                aria-invalid={!!error}
                onChange={(e) => setFiles((x) => ({ ...x, [f.name]: e.target.files?.[0] ?? null }))}
                className={cn(inputBase, "cursor-pointer py-2.5 file:mr-3 file:rounded-lg file:bg-brand file:px-3 file:py-1 file:text-[13px] file:font-bold file:text-white")}
              />
            ) : f.type === "textarea" ? (
              <Textarea
                id={id}
                name={f.name}
                rows={4}
                placeholder={f.placeholder}
                aria-invalid={!!error}
                className={cn(inputBase, "h-auto min-h-28 resize-y py-3")}
              />
            ) : (
              <Input
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
                className={inputBase}
              />
            )}
            {error && (
              <p className="text-[12px] font-semibold text-red-500" role="alert">
                {error}
              </p>
            )}
          </div>
        )
      })}
      <div
        className={cn(
          "grid gap-3 rounded-2xl bg-[#f6faff] p-4 ring-1 ring-line",
          columns === 2 && "col-span-2 max-[560px]:col-span-1",
        )}
      >
        <ConsentCheckbox
          purpose={
            kind === "career"
              ? "to process my job application and contact me about it"
              : kind === "partner"
                ? "to respond to my partnership enquiry"
                : "to respond to my enquiry"
          }
          error={errors.consent}
        />
        {marketing && <ConsentCheckbox optional />}
      </div>
      <div className={cn("mt-1", columns === 2 && "col-span-2 max-[560px]:col-span-1")}>
        {serverError && (
          <p className="mb-3 text-[13px] font-semibold text-red-500" role="alert">
            {serverError}
          </p>
        )}
        <Button
          type="submit"
          disabled={busy}
          className={cn(
            "h-12 rounded-xl bg-brand px-8 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(27,95,217,.28)] hover:bg-brand/90",
            columns === 1 ? "w-full" : "w-full sm:w-auto",
          )}
        >
          {busy ? "Sending…" : submitLabel} <ArrowRight size={16} />
        </Button>
      </div>
    </form>
  )
}
