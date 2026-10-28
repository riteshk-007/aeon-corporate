import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Badge as ShadBadge } from "@/components/ui/badge"
import { Card as ShadCard } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

/**
 * Admin building blocks on top of shadcn/ui. Existing screens use these class
 * strings and wrappers, so the whole panel shares one look.
 */
export const adminInput =
  "h-9 w-full min-w-0 rounded-lg border border-input bg-white px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-destructive/20"

export const adminBtn = {
  primary: buttonVariants({ variant: "default", size: "lg" }),
  ghost: buttonVariants({ variant: "outline", size: "lg" }),
  danger: buttonVariants({ variant: "destructive", size: "lg" }),
}

export function Card({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <ShadCard className={cn("gap-0 rounded-2xl bg-white py-0 shadow-[0_8px_24px_rgba(11,27,77,.05)]", className)}>
      {children}
    </ShadCard>
  )
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[24px] leading-tight font-extrabold tracking-[-0.03em] max-[560px]:text-[21px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-[620px] text-[14px] text-mute">{description}</p>
        )}
      </div>
      {actions}
    </div>
  )
}

const tones = {
  blue: "bg-[#dcebff] text-brand",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-700",
  gray: "bg-[#eef1f7] text-mute",
  navy: "bg-ink text-white",
} as const

export function Badge({
  tone = "gray",
  children,
}: {
  tone?: keyof typeof tones
  children: React.ReactNode
}) {
  return (
    <ShadBadge variant="secondary" className={cn("h-auto rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap", tones[tone])}>
      {children}
    </ShadBadge>
  )
}

/** Label + control + inline hint/error, wired for screen readers. */
export function Field({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={id} className="text-[13px] font-bold text-ink">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-[12px] text-mute">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[12px] font-semibold text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

/** Spinner for loading states inside buttons. */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden="true" className={cn("size-4 animate-spin", className)} />
}
