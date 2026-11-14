"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUp,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ConsentCheckbox } from "@/components/site/consent-checkbox"
import { Eyebrow, Logo, btnBlueFlat, wrap } from "@/components/site/ui"
import { contactInfo, footerLinks } from "@/lib/site-data"
import type { MenuTop } from "@/lib/menu"

const footerHref: Record<string, string> = {
  "About Us": "/about",
  "Contact Us": "/contact-us",
  "Refund Policy": "/terms-and-conditions#fees",
  Sitemap: "/sitemap.xml",
  "Privacy Policy": "/privacy-policy",
  "Terms & Conditions": "/terms-and-conditions",
}

export function SiteFooter({ menu }: { menu: MenuTop[] }) {
  // Footer columns follow the header menu that is edited in the admin panel.
  const columns = menu.map((t) => ({
    title: t.label,
    links: t.categories.slice(0, 9).map((c) => ({
      label: c.label,
      href: c.href || c.links[0]?.href || t.href || "/contact-us",
    })),
  }))
  const [newsletterNotice, setNewsletterNotice] = useState("")

  return (
    <>
      <footer className="relative overflow-hidden bg-ink pt-16 pb-6 text-white max-[560px]:pt-12">
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,.07)_1px,transparent_1.5px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_60%)]"
        />
        <div className={cn(wrap, "relative")}>
          <div className="relative overflow-hidden rounded-xl bg-sun p-9 text-ink max-[560px]:rounded-lg max-[560px]:p-6">
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-16 size-72 rounded-full border border-ink/10"
            />
            <div
              aria-hidden="true"
              className="absolute -top-10 -right-2 size-44 rounded-full border border-ink/10"
            />
            <div className="relative grid grid-cols-[1.1fr_1fr] items-center gap-8 max-[900px]:grid-cols-1 max-[900px]:gap-6">
              <div>
                <Eyebrow className="text-ink">OUR NEWSLETTER: AEON EXPRESS</Eyebrow>
                <h2 className="max-w-[520px] text-[clamp(24px,2.8vw,32px)] leading-[1.15] font-extrabold tracking-[-0.03em]">
                  Insights that keep you ahead.
                </h2>
                <p className="mt-3 max-w-[480px] text-[14px] leading-[1.6] text-ink/75">
                  Curated insights on the latest legal developments, regulatory
                  changes, corporate updates and business trends, delivered to
                  your inbox. Subscribe to Aeon Express. It&apos;s complimentary.
                </p>
                <p className="mt-2 text-[13px] font-bold text-ink">
                  Stay informed. Stay prepared. Stay ahead.
                </p>
              </div>
              <div>
                <form
                  id="newsletter-form"
                  className="flex gap-2 rounded-lg bg-white p-2 shadow-[0_14px_34px_rgba(11,27,77,.14)] max-[560px]:flex-col"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const form = e.currentTarget
                    if (!form.checkValidity()) {
                      form.reportValidity()
                      return
                    }
                    const data = new FormData(form)
                    if (data.get("consent") !== "on") {
                      setNewsletterNotice(
                        "Please tick the consent box to subscribe.",
                      )
                      return
                    }
                    try {
                      const res = await fetch("/api/enquiries", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          kind: "newsletter",
                          email: data.get("email"),
                          consent: true,
                          source: window.location.pathname,
                        }),
                      })
                      if (!res.ok) throw new Error()
                      setNewsletterNotice(
                        "Thanks! You're subscribed. You can unsubscribe any time by emailing privacy@aeoncorporate.com.",
                      )
                      form.reset()
                    } catch {
                      setNewsletterNotice(
                        "Could not subscribe right now. Please try again later.",
                      )
                    }
                  }}
                >
                  <div className="flex h-12 min-w-0 flex-1 items-center gap-2.5 px-3">
                    <Mail size={18} className="shrink-0 text-mute" />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      placeholder="Your email address"
                      aria-label="Email address"
                      className="w-full min-w-0 bg-transparent text-[15px] outline-none placeholder:text-mute/80"
                    />
                  </div>
                  <button
                    className={cn(btnBlueFlat, "h-12 px-6 max-[560px]:w-full")}
                    type="submit"
                  >
                    Subscribe <ArrowRight size={15} />
                  </button>
                </form>
                <div className="mt-3">
                  <ConsentCheckbox
                    light
                    purpose="to send me the Aeon Express newsletter by email"
                    name="consent"
                    form="newsletter-form"
                  />
                </div>
                {newsletterNotice && (
                  <p
                    className="mt-3 text-[13px] font-semibold text-ink"
                    role="status"
                  >
                    {newsletterNotice}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1.4fr_repeat(5,1fr)] gap-x-8 gap-y-12 pt-16 pb-12 max-[1100px]:grid-cols-[1.2fr_repeat(5,1fr)] max-[900px]:grid-cols-2 max-[900px]:pt-12 max-[560px]:gap-x-5 max-[560px]:pt-10">
            <div className="max-[900px]:col-span-2">
              <Logo light />
              <p className="mt-5 max-w-[300px] text-[14px] leading-[1.7] text-white/70">
                Aeon Corporate provides integrated business advisory and
                professional support services to clients across diverse
                industries and geographies. Our expertise spans corporate laws,
                legal and financial advisory, regulatory compliance and
                outsourced business support, delivered through flexible
                engagement models, including retainership arrangements.
              </p>
              <address className="mt-6 grid gap-3 not-italic max-[900px]:grid-cols-3 max-[900px]:gap-4 max-[640px]:grid-cols-1">
                {[
                  [
                    Mail,
                    "support@aeoncorporate.com",
                    "mailto:support@aeoncorporate.com",
                  ],
                  [Phone, contactInfo.phoneDisplay, `tel:+${contactInfo.phone}`],
                  [MessageCircle, "WhatsApp us", `https://wa.me/${contactInfo.whatsapp}`],
                  [MapPin, contactInfo.cities.join(" · "), undefined],
                ].map(([Icon, text, href]) => {
                  const ContactIcon = Icon as typeof Mail
                  const content = (
                    <>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-sun">
                        <ContactIcon size={16} />
                      </span>
                      <span className="text-[14px] leading-snug text-white/85">
                        {text as string}
                      </span>
                    </>
                  )
                  return href ? (
                    <Link
                      key={text as string}
                      href={href as string}
                      className="flex items-center gap-3 hover:text-sun"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div
                      key={text as string}
                      className="flex items-center gap-3"
                    >
                      {content}
                    </div>
                  )
                })}
              </address>
            </div>
            {columns.map(({ title, links }) => (
              <div key={title}>
                <h3 className="mb-5 inline-block border-b-2 border-sun pb-2 text-[12px] font-extrabold tracking-[.14em] text-white uppercase">
                  {title}
                </h3>
                <ul className="grid gap-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-start gap-1.5 text-[14px] leading-snug text-white/70 transition-colors hover:text-sun"
                      >
                        <ChevronRight
                          size={14}
                          className="mt-[3px] -ml-3.5 shrink-0 opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100"
                        />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <nav
            aria-label="Company and legal"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 py-6"
          >
            {footerLinks.map((link) => (
              <Link
                key={link}
                href={footerHref[link] ?? "/#contact"}
                className="text-[13px] font-semibold text-white/85 transition-colors hover:text-sun"
              >
                {link}
              </Link>
            ))}
          </nav>
          <p className="rounded-lg border border-white/10 bg-white/[.04] p-4 text-[12px] leading-[1.7] text-white/60">
            <b className="text-white/80">Legal disclaimer:</b> The information
            on this website describes our corporate and business advisory
            services to people who want to know more about us. It is not
            intended to solicit work or advertise our capabilities. It is
            general in nature and should not be used for decisions without
            further professional and legal advice. Links to third-party sites
            are for reference only; we do not control their content and take no
            responsibility for it. Aeon Corporate is not affiliated with any
            government body.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[13px] text-white/60">
            <span>© 2026 Aeon Corporate. All rights reserved.</span>
            <Link
              href="#top"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-semibold text-white/85 transition hover:border-sun hover:bg-sun hover:text-ink"
            >
              Back to top <ArrowUp size={14} />
            </Link>
          </div>
        </div>
      </footer>

      <Link
        data-floater="mail" className="fixed right-[22px] bottom-[22px] z-30 grid size-[43px] place-items-center rounded-full bg-[#27b95a] text-white shadow-[0_8px_18px_rgba(11,27,77,.2)] max-[560px]:right-3.5 max-[560px]:bottom-3.5"
        href="mailto:support@aeoncorporate.com"
        aria-label="Email Aeon Corporate"
      >
        <Mail size={19} />
      </Link>
    </>
  )
}
