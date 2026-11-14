"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Clock, Mail, MapPin, Phone, X } from "lucide-react"
import { contactInfo } from "@/lib/site-data"
import { LeadForm, type LeadField } from "@/components/site/lead-form"

const EXIT_KEY = "aeon-exit-offer"

const fields: LeadField[] = [
  { name: "name", label: "Name", required: true, autoComplete: "name", placeholder: "Your name" },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", placeholder: "10-digit mobile number" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", placeholder: "you@example.com", full: true },
  { name: "message", label: "Your message", type: "textarea", required: true, placeholder: "Tell us what you are looking for" },
]

/**
 * Client requests for the public site:
 * - copying page text puts only the page address on the clipboard (form fields still copy normally);
 * - a one-time "Didn't find what you were looking for?" enquiry when a desktop visitor moves to leave.
 */
export function SiteGuards() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onCopy = (e: ClipboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest("input, textarea, [contenteditable='true']")) return
      e.preventDefault()
      e.clipboardData?.setData("text/plain", window.location.href)
    }
    document.addEventListener("copy", onCopy)
    return () => document.removeEventListener("copy", onCopy)
  }, [])

  useEffect(() => {
    if (pathname.startsWith("/contact-us")) return
    if (!window.matchMedia("(pointer: fine)").matches) return
    try {
      if (sessionStorage.getItem(EXIT_KEY)) return
    } catch {}
    const armedAt = Date.now()
    const onLeave = (e: MouseEvent) => {
      if (e.relatedTarget || e.clientY > 0 || Date.now() - armedAt < 8000) return
      try {
        sessionStorage.setItem(EXIT_KEY, "1")
      } catch {}
      setOpen(true)
      document.removeEventListener("mouseout", onLeave)
    }
    document.addEventListener("mouseout", onLeave)
    return () => document.removeEventListener("mouseout", onLeave)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-ink/55 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-title"
        className="relative grid w-[min(880px,100%)] grid-cols-[300px_1fr] overflow-hidden rounded-xl bg-white shadow-[0_30px_90px_rgba(0,0,0,.35)] max-[760px]:grid-cols-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-sun text-ink hover:brightness-95"
        >
          <X size={18} />
        </button>
        <aside className="relative bg-[linear-gradient(160deg,#0b1b4d,#0b3590)] p-8 text-white max-[760px]:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/aeon-logo-light.png" alt="Aeon Corporate" className="h-14 w-auto" />
          <ul className="mt-8 grid gap-5 text-[15px]">
            <li className="flex items-start gap-3 border-b border-white/15 pb-5">
              <Phone size={20} className="mt-0.5 shrink-0 text-sun" />
              <a href={`tel:+${contactInfo.phone}`} className="hover:text-sun">{contactInfo.phoneDisplay}</a>
            </li>
            <li className="flex items-start gap-3 border-b border-white/15 pb-5">
              <Mail size={20} className="mt-0.5 shrink-0 text-sun" />
              <a href="mailto:support@aeoncorporate.com" className="hover:text-sun">support@aeoncorporate.com</a>
            </li>
            <li className="flex items-start gap-3 border-b border-white/15 pb-5">
              <MapPin size={20} className="mt-0.5 shrink-0 text-sun" />
              Delhi | Mumbai | Bangalore | Raipur | Dehradun
            </li>
            <li className="flex items-start gap-3">
              <Clock size={20} className="mt-0.5 shrink-0 text-sun" />
              Our team will get back to you within 24 hours.
            </li>
          </ul>
        </aside>
        <div className="p-8 max-[560px]:p-5">
          <h2 id="exit-title" className="pr-10 text-[24px] leading-tight font-extrabold tracking-[-0.02em]">
            Didn&apos;t find what you were looking for?
          </h2>
          <p className="mt-2 mb-5 text-[14px] text-mute">Send us your query. An Aeon expert will reply within 24 hours.</p>
          <LeadForm
            fields={fields}
            kind="contact"
            extra={{ service: "Exit enquiry pop-up" }}
            submitLabel="Send enquiry"
            successTitle="Thanks, we got your query"
            successText="An Aeon expert will reply within 24 hours."
          />
          <p className="mt-3 text-[12px] text-mute">Your information is confidential and secure.</p>
        </div>
      </div>
    </div>
  )
}
