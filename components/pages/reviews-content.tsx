"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { ArrowRight, Mail, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ColorIcon,
  Eyebrow,
  SectionHeading,
  btnBlue,
  btnWhite,
  btnYellow,
  reveal,
  wrap,
} from "@/components/site/ui"
import { Highlight, PageHero } from "@/components/site/page-hero"

const filters = [
  "All",
  "Company Registration",
  "GST & Tax",
  "Trademark & IP",
  "ISO & Licences",
  "Environmental",
  "Compliance",
]

// Sample content for presentation. Replace with verified customer reviews.
const reviews = [
  {
    name: "Maya Rao",
    role: "Founder, Northstar Studio",
    service: "Company Registration",
    text: "Aeon gave our team a clear path through a complicated setup. Every next step was explained in plain language.",
  },
  {
    name: "Arjun Mehta",
    role: "Director, Meridian Works",
    service: "Compliance",
    text: "The experience felt organized from our first conversation. We always knew what information was needed and why.",
  },
  {
    name: "Leena Shah",
    role: "COO, Fieldhouse Labs",
    service: "GST & Tax",
    text: "A thoughtful partner for the parts of business that usually slow you down. The guidance helped us move decisively.",
  },
  {
    name: "Sample Reviewer",
    role: "Brand Owner",
    service: "Trademark & IP",
    text: "The trademark process was broken into simple steps and we were kept informed all the way through.",
  },
  {
    name: "Sample Reviewer",
    role: "Operations Head",
    service: "ISO & Licences",
    text: "Documentation was organized upfront, which made the licence application far less stressful than we expected.",
  },
  {
    name: "Sample Reviewer",
    role: "Plant Manager",
    service: "Environmental",
    text: "We got practical guidance on environmental permissions and clear checklists for each stage.",
  },
]

const initials = (name: string, i: number) =>
  name === "Sample Reviewer"
    ? ["SR", "SV", "SP"][i % 3]
    : name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)

export function ReviewsContent() {
  const [active, setActive] = useState("All")
  const visible = reviews.filter(
    (r) => active === "All" || r.service === active,
  )

  return (
    <MotionConfig reducedMotion="user">
      <main id="top" className="overflow-hidden">
        <PageHero
          crumbs={[{ label: "Reviews" }]}
          eyebrow="CLIENT REVIEWS"
          title={
            <>
              Still in two minds? <Highlight>Hear from our clients.</Highlight>
            </>
          }
          description="See how businesses describe working with Aeon Corporate, from first conversation to the final confirmation."
          actions={
            <>
              <Link href="/contact-us" className={btnBlue}>
                Write a Review <ArrowRight size={16} />
              </Link>
            </>
          }
          chips={[
            "Company Registration",
            "GST & Tax",
            "Trademark",
            "Compliance",
          ]}
          image={{
            src: "/illustrations/about-team.jpg",
            alt: "Illustration of clients and consultants reviewing documents together",
            width: 900,
            height: 900,
            position: "object-top",
          }}
          note={{ title: "Client-first", sub: "Clear communication" }}
          icons={["expert", "approved", "bolt"]}
        />

        {/* Notice + filters */}
        <section
          className={cn(
            wrap,
            "pt-[90px] pb-[100px] max-[560px]:pt-14 max-[560px]:pb-16",
          )}
        >
          <motion.div
            {...reveal()}
            className="mb-10 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-[#f2f8ff] px-5 py-4"
          >
            <span className="size-2.5 rounded-full bg-sun ring-4 ring-[#e6bd00]/30" />
            <p className="text-[13px] font-semibold text-mute">
              Sample reviews are shown for presentation until verified customer
              feedback is supplied.
            </p>
          </motion.div>

          <SectionHeading
            eyebrow="WHAT CLIENTS SAY"
            title="Reviews by service."
            description="Filter by the service you are interested in."
          />

          <div
            role="tablist"
            aria-label="Filter reviews by service"
            className="mt-8 flex flex-wrap gap-2.5"
          >
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={active === f}
                onClick={() => setActive(f)}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-[13px] font-bold transition",
                  active === f
                    ? "border-brand bg-brand text-white shadow-[0_10px_22px_rgba(27,95,217,.28)]"
                    : "border-line bg-white text-ink hover:border-brand hover:text-brand",
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-5 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
            <AnimatePresence mode="popLayout">
              {visible.map((r, i) => (
                <motion.article
                  key={r.text}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="group flex flex-col rounded-[24px] border border-line bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_22px_44px_rgba(27,95,217,.12)] motion-reduce:transition-none"
                >
                  <Quote size={28} className="text-brand/30" />
                  <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-ink/85">
                    “{r.text}”
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-[13px] font-black text-white">
                      {initials(r.name, i)}
                    </span>
                    <div className="min-w-0">
                      <b className="block truncate text-[14px]">{r.name}</b>
                      <small className="block truncate text-[12px] text-mute">
                        {r.role}
                      </small>
                    </div>
                    <span className="ml-auto shrink-0 rounded-full bg-[#dcebff] px-2.5 py-1 text-[11px] font-black text-brand">
                      {r.service}
                    </span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {visible.length === 0 && (
            <p className="mt-10 rounded-2xl bg-pale p-6 text-center text-[14px] text-mute">
              No reviews for this service yet.
            </p>
          )}
        </section>

        {/* Feedback banner */}
        <section className="bg-sky py-[90px] max-[560px]:py-14">
          <div
            className={cn(
              wrap,
              "grid grid-cols-[1.1fr_0.9fr] items-center gap-12 max-[900px]:grid-cols-1",
            )}
          >
            <motion.div {...reveal()}>
              <Eyebrow>YOUR FEEDBACK MATTERS</Eyebrow>
              <h2 className="text-[clamp(28px,3.4vw,42px)] leading-[1.08] font-extrabold tracking-[-0.03em]">
                Happy with our service? Tell others. Not happy? Tell us.
              </h2>
              <p className="mt-5 max-w-[520px] text-[15px] leading-[1.75] text-mute">
                If something fell short, write to us and we&apos;ll work to put
                it right. We read every message.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="mailto:help@aeoncorporate.com" className={btnBlue}>
                  <Mail size={16} /> help@aeoncorporate.com
                </a>
                <Link href="/contact-us" className={btnWhite}>
                  Contact us <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
            <motion.div
              {...reveal(1)}
              className="grid grid-cols-3 gap-4 max-[560px]:grid-cols-1"
            >
              {[
                { icon: "expert", t: "Expert-led" },
                { icon: "approved", t: "Clear process" },
                { icon: "bolt", t: "Prompt replies" },
              ].map((x) => (
                <div
                  key={x.t}
                  className="flex flex-col items-center gap-3 rounded-[22px] bg-white p-6 text-center shadow-[0_18px_40px_rgba(11,27,77,.1)]"
                >
                  <span className="grid size-16 place-items-center rounded-2xl bg-[#eaf3ff]">
                    <ColorIcon name={x.icon} size={44} />
                  </span>
                  <b className="text-[14px]">{x.t}</b>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </MotionConfig>
  )
}
