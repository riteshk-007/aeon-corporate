"use client"
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { contactInfo } from "@/lib/site-data"

const channels: { key: string; icon: LucideIcon; title: string; text: string; action: string; href: string; tone: string; img?: string }[] = [
  {
    key: "call",
    icon: Phone,
    title: "Call Us",
    text: "Speak to our team",
    action: "Call now",
    href: contactInfo.phone ? `tel:+${contactInfo.phone}` : "/contact-us",
    tone: "bg-[#fff1dc] text-[#e8890c]",
  },
  {
    key: "mail",
    icon: Mail,
    title: "Email Us",
    text: "Share your requirements",
    action: "Send email",
    href: `mailto:${contactInfo.email}`,
    tone: "bg-[#e3efff] text-brand",
  },
  {
    key: "whatsapp",
    icon: MessageCircle,
    title: "WhatsApp",
    text: "Send us a message",
    action: "Chat now",
    href: contactInfo.whatsapp ? `https://wa.me/${contactInfo.whatsapp}` : "/contact-us",
    tone: "bg-[#ddf6e6] text-[#1f9d55]",
    img: "/brand/whatsapp.png",
  },
]

/** Call / email / WhatsApp icons in the header; hovering (or focusing) opens the contact cards below. */
export function HeaderContact() {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const show = () => {
    if (timer.current) clearTimeout(timer.current)
    setOpen(true)
  }
  const hide = () => {
    timer.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div
      className="relative max-[1279px]:hidden"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && hide()}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <div className="flex items-center gap-0.5 rounded-md border border-line bg-white p-1">
        {channels.map(({ key, icon: Icon, title, href, tone, img }) => (
          <Link
            key={key}
            href={href}
            aria-label={title}
            aria-haspopup="true"
            aria-expanded={open}
            target={href.startsWith("https://") ? "_blank" : undefined}
            rel={href.startsWith("https://") ? "noopener noreferrer" : undefined}
            className={cn("grid size-8 place-items-center rounded transition hover:scale-105", tone)}
          >
            {img ? <img src={img} alt="" className="size-5" /> : <Icon size={16} />}
          </Link>
        ))}
      </div>

      <div
        className={cn(
          "absolute top-full right-0 z-20 pt-3 transition duration-200",
          open ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-1 opacity-0",
        )}
      >
        <div className="w-[540px] overflow-hidden rounded-lg border border-line bg-white shadow-[0_24px_60px_rgba(11,27,77,.18)]">
          <div className="grid grid-cols-3 gap-2 p-3">
            {channels.map(({ key, icon: Icon, title, text, action, href, tone, img }) => (
              <Link
                key={key}
                href={href}
                target={href.startsWith("https://") ? "_blank" : undefined}
                rel={href.startsWith("https://") ? "noopener noreferrer" : undefined}
                className="group flex flex-col items-center rounded-md border border-line bg-[#fbfdff] px-3 py-5 text-center transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_12px_26px_rgba(63,109,246,.12)]"
              >
                <span className={cn("grid size-11 place-items-center rounded-md", tone)}>
                  {img ? <img src={img} alt="" className="size-7" /> : <Icon size={20} />}
                </span>
                <b className="mt-3 text-[15px]">{title}</b>
                <span className="mt-1 text-[12px] text-mute">{text}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-brand">
                  {action} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
          <p className="border-t border-line bg-pale py-2.5 text-center text-[12px] font-semibold text-mute">
            Aeon Corporate &amp; Business Advisors · We reply within 24 hours
          </p>
        </div>
      </div>
    </div>
  )
}
