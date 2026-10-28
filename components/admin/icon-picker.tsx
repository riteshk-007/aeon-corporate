"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { ICONS, ICON_KEYS, iconFor } from "@/lib/icons"
import { cn } from "@/lib/utils"

/** Pick an icon from a small grid. `value` is the saved key ("" = use the default). */
export function IconPicker({
  value,
  onChange,
  label,
  fallback,
}: {
  value: string
  onChange: (key: string) => void
  label: string
  /** icon shown when nothing is chosen */
  fallback?: string
}) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const Current = iconFor(value, fallback)
  const keys = ICON_KEYS.filter((k) => !q.trim() || `${k} ${ICONS[k].label}`.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <div className="grid gap-2">
      <span className="text-[13px] font-bold text-ink">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-11 w-full items-center gap-3 rounded-xl border border-input bg-white px-3 text-left text-[14px] transition hover:border-brand sm:w-fit sm:min-w-[220px]"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-pale text-brand"><Current size={18} /></span>
        <span className="flex-1 font-semibold">{value && ICONS[value] ? ICONS[value].label : "Default icon"}</span>
        <ChevronDown size={16} className={cn("text-mute transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="rounded-xl border border-line bg-[#f8fbff] p-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search icons (e.g. tax, food, company)"
            aria-label="Search icons"
            className="mb-3 h-10 w-full rounded-lg border border-input bg-white px-3 text-[14px] outline-none focus:border-brand"
          />
          <div className="grid max-h-56 grid-cols-5 gap-2 overflow-y-auto sm:grid-cols-8 md:grid-cols-10">
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false) }}
              className={cn("grid h-14 place-items-center rounded-lg border text-[11px] font-bold", !value ? "border-brand bg-white text-brand" : "border-line bg-white text-mute hover:border-brand")}
            >
              Default
            </button>
            {keys.map((k) => {
              const { Icon, label: name } = ICONS[k]
              return (
                <button
                  key={k}
                  type="button"
                  title={name}
                  aria-label={name}
                  aria-pressed={value === k}
                  onClick={() => { onChange(k); setOpen(false) }}
                  className={cn("grid h-14 place-items-center rounded-lg border transition", value === k ? "border-brand bg-white text-brand ring-2 ring-brand/20" : "border-line bg-white text-ink/70 hover:border-brand hover:text-brand")}
                >
                  <Icon size={20} />
                </button>
              )
            })}
            {keys.length === 0 && <p className="col-span-full text-[13px] text-mute">No icon matches.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
