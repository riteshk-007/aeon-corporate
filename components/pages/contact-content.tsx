"use client"

import Link from "next/link"
import { MotionConfig, motion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Eyebrow,
  SectionHeading,
  btnWhite,
  reveal,
  wrap,
  btnBlue,
} from "@/components/site/ui"
import { Highlight, PageHero } from "@/components/site/page-hero"
import { LeadForm, type LeadField } from "@/components/site/lead-form"
import { STATES } from "@/lib/states"

const fields: LeadField[] = [
  {
    name: "name",
    label: "Full name",
    required: true,
    autoComplete: "name",
    placeholder: "Your name",
  },
  {
    name: "email",
    label: "Email ID",
    type: "email",
    required: true,
    autoComplete: "email",
    placeholder: "you@example.com",
  },
  {
    name: "phone",
    label: "Mobile number",
    type: "tel",
    required: true,
    autoComplete: "tel",
    placeholder: "10-digit mobile number",
  },
  {
    name: "state",
    label: "State",
    type: "select",
    required: true,
    options: STATES,
  },
  {
    name: "message",
    label: "How can we help you?",
    type: "textarea",
    placeholder: "Tell us about your requirement",
  },
]

const channels = [
  {
    icon: MessageCircle,
    label: "Quick enquiries",
    lines: [
      { text: "Call +91 00000 00000", href: "tel:+910000000000" },
    ],
  },
  {
    icon: Mail,
    label: "Email",
    lines: [
      {
        text: "Sales: hello@aeoncorporate.com",
        href: "mailto:hello@aeoncorporate.com",
      },
      {
        text: "Support: help@aeoncorporate.com",
        href: "mailto:help@aeoncorporate.com",
      },
      {
        text: "Careers: hr@aeoncorporate.com",
        href: "mailto:hr@aeoncorporate.com",
      },
    ],
  },
  {
    icon: Clock,
    label: "Support",
    lines: [
      {
        text: "Our team replies promptly during working days.",
        href: undefined,
      },
    ],
  },
]

const socials = ["Facebook", "X", "Instagram", "LinkedIn", "YouTube"]

export function ContactContent() {
  return (
    <MotionConfig reducedMotion="user">
      <main id="top" className="overflow-hidden">
        <PageHero
          crumbs={[{ label: "Contact Us" }]}
          eyebrow="CONTACT US"
          title={
            <>
              Let&apos;s talk about your <Highlight>next milestone.</Highlight>
            </>
          }
          description="Consult with chartered accountants, company secretaries, lawyers and consultants. One-to-one guidance across business consulting, compliance, tax and more."
          actions={
            <Link href="#quick-support" className={btnBlue}>
              Send a message <ArrowRight size={16} />
            </Link>
          }
          chips={["Consulting", "Compliance", "Tax filing", "Business support"]}
          image={{
            src: "/illustrations/hero.jpg",
            alt: "Illustration of a consultant presenting a compliance dashboard",
            width: 1400,
            height: 1032,
          }}
          note={{ title: "We reply promptly", sub: "Working days" }}
          icons={["mail", "advisory", "bolt"]}
        />

        <section
          id="quick-support"
          className={cn(wrap, "scroll-mt-24 py-[100px] max-[560px]:py-16")}
        >
          <div className="grid grid-cols-[1.05fr_0.95fr] items-start gap-12 max-[1024px]:gap-8 max-[900px]:grid-cols-1">
            <motion.div
              {...reveal()}
              className="rounded-[28px] bg-white p-8 shadow-[0_30px_70px_rgba(11,27,77,.14)] ring-1 ring-line max-[560px]:rounded-[22px] max-[560px]:p-5"
            >
              <Eyebrow>QUICK SUPPORT</Eyebrow>
              <h2 className="mb-6 text-[clamp(26px,3vw,36px)] leading-[1.1] font-extrabold tracking-[-0.03em]">
                Send us a message
              </h2>
              <LeadForm
                fields={fields}
                kind="contact"
                marketing
                submitLabel="Submit"
                successTitle="Thanks, we got your message"
                successText="A member of our team will get back to you shortly."
              />
              <div className="mt-8 border-t border-line pt-6">
                <p className="mb-3 text-[12px] font-black tracking-[.14em] text-mute uppercase">
                  Follow us
                </p>
                <ul className="flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <li key={s}>
                      <a
                        href="/#contact"
                        aria-label={`Aeon Corporate on ${s}`}
                        className="rounded-full border border-line px-4 py-2 text-[13px] font-bold transition hover:border-brand hover:bg-brand hover:text-white"
                      >
                        {s}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <div className="grid gap-5">
              {channels.map((c, i) => (
                <motion.div
                  key={c.label}
                  {...reveal(i)}
                  className="flex gap-4 rounded-[24px] border border-line bg-[#f2f8ff] p-6 transition hover:border-brand/40 hover:bg-white hover:shadow-[0_18px_40px_rgba(27,95,217,.1)]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand text-white">
                    <c.icon size={21} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-bold">{c.label}</h3>
                    <ul className="mt-2 grid gap-1.5">
                      {c.lines.map((l) => (
                        <li
                          key={l.text}
                          className="text-[14px] leading-snug text-mute"
                        >
                          {l.href ? (
                            <a
                              href={l.href}
                              className="break-words hover:text-brand"
                            >
                              {l.text}
                            </a>
                          ) : (
                            l.text
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-sky py-[100px] max-[560px]:py-16">
          <div className={wrap}>
            <SectionHeading
              eyebrow="VISIT US"
              title="Our office."
              description="Drop in by appointment. Please reach out before visiting."
            />
            <motion.article
              {...reveal()}
              className="mt-10 grid max-w-[720px] grid-cols-[auto_1fr] gap-5 rounded-[28px] bg-white p-7 shadow-[0_24px_60px_rgba(11,27,77,.1)] max-[560px]:grid-cols-1 max-[560px]:p-5"
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-[#eaf3ff] text-brand">
                <MapPin size={26} />
              </span>
              <div>
                <h3 className="text-xl font-bold">Head Office</h3>
                <address className="mt-2 text-[14px] leading-[1.7] text-mute not-italic">
                  Office address placeholder
                  <br />
                  City, State, India
                </address>
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 py-1 text-[14px] font-bold text-brand hover:underline"
                >
                  Get Direction <ArrowUpRight size={15} />
                </a>
              </div>
            </motion.article>
          </div>
        </section>
      </main>
    </MotionConfig>
  )
}
