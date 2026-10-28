"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { ArrowRight, Briefcase, MapPin, Users, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ColorIcon,
  Eyebrow,
  SectionHeading,
  btnBlue,
  btnYellow,
  reveal,
  wrap,
} from "@/components/site/ui"
import { Highlight, PageHero } from "@/components/site/page-hero"
import { RichContent } from "@/components/editor/rich-content"
import { LeadForm, type LeadField } from "@/components/site/lead-form"

export type PublicJob = {
  id: string
  icon: string
  title: string
  openings: number
  location: string
  type: string
  skills: string[]
  summary: string
  descriptionHtml: string
}

const perks = [
  { icon: "expert", t: "Inclusive culture" },
  { icon: "bulb", t: "Continuous learning" },
  { icon: "health", t: "Wellbeing focus" },
  { icon: "network", t: "Community exposure" },
]

const baseFields: LeadField[] = [
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
    name: "experience",
    label: "Experience",
    type: "select",
    required: true,
    options: ["Fresher", "1–3 years", "3–5 years", "5+ years"],
  },
  {
    name: "resumeFile",
    label: "Resume (PDF or image, max 5 MB)",
    type: "file",
    full: true,
  },
  {
    name: "note",
    label: "Cover note or resume link",
    type: "textarea",
    placeholder: "Tell us a little about yourself",
  },
]

export function CareerContent({ openings }: { openings: PublicJob[] }) {
  const [role, setRole] = useState<PublicJob | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setRole(null)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])
  useEffect(() => {
    document.body.style.overflow = role ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [role])

  return (
    <MotionConfig reducedMotion="user">
      <main id="top" className="overflow-hidden">
        <PageHero
          crumbs={[
            { label: "Work at Aeon", href: "/work-at-aeon" },
            { label: "Careers" },
          ]}
          eyebrow="CAREERS"
          title={
            <>
              Build your career with <Highlight>Aeon Corporate.</Highlight>
            </>
          }
          description="Here is the list of positions we are currently hiring for. Find a role that fits and tell us about yourself."
          actions={
            <Link href="#openings" className={btnBlue}>
              See open positions <ArrowRight size={16} />
            </Link>
          }
          chips={[
            "Compliance",
            "IP & Trademark",
            "Business development",
            "Creative",
          ]}
          image={{
            src: "/illustrations/story-process.jpg",
            alt: "Illustration of a team presenting a process, representing life at Aeon",
            width: 1400,
            height: 910,
          }}
          note={{ title: "We are hiring", sub: "Join our team" }}
          icons={["briefcase", "target", "chip"]}
        />

        <section
          id="openings"
          className={cn(wrap, "scroll-mt-24 py-[100px] max-[560px]:py-16")}
        >
          <SectionHeading
            eyebrow="OPEN POSITIONS"
            title="Find your next role."
            description="Click Apply Now on any position and share a few details."
          />

          {openings.length === 0 && (
            <p className="mt-12 rounded-[24px] bg-pale p-8 text-center text-[15px] leading-[1.7] text-mute">
              There are no open positions right now. Send your resume to{" "}
              <a href="mailto:hr@aeoncorporate.com" className="font-bold text-brand hover:underline">hr@aeoncorporate.com</a>{" "}
              and we will keep it on file.
            </p>
          )}
          <ul className="mt-12 grid grid-cols-2 items-start gap-5 max-[900px]:grid-cols-1">
            {openings.map((job, i) => (
              <motion.li
                key={job.id}
                {...reveal(i % 2)}
                className="group flex flex-col rounded-[26px] border border-line bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_24px_48px_rgba(27,95,217,.13)] motion-reduce:transition-none"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#eaf3ff]">
                    <ColorIcon name={job.icon} size={44} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xl leading-snug font-bold tracking-[-0.02em]">
                      {job.title}
                    </h3>
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-semibold text-mute">
                      <li className="flex items-center gap-1.5">
                        <Users size={14} className="text-brand" />
                        {job.openings} opening{job.openings > 1 ? "s" : ""}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-brand" />
                        {job.location}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-brand" />
                        {job.type}
                      </li>
                    </ul>
                  </div>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <li
                      key={s}
                      className="rounded-full bg-[#eaf3ff] px-3 py-1.5 text-[12px] font-bold text-brand"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
                {job.summary && (
                  <p className="mt-4 text-[14px] leading-[1.7] text-mute">{job.summary}</p>
                )}
                {expanded === job.id && job.descriptionHtml && (
                  <RichContent html={job.descriptionHtml} className="mt-4 rounded-2xl bg-[#f6faff] p-4" />
                )}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button onClick={() => setRole(job)} className={cn(btnBlue, "w-fit")}>
                    Apply Now <ArrowRight size={15} />
                  </button>
                  {job.descriptionHtml && (
                    <button
                      type="button"
                      aria-expanded={expanded === job.id}
                      onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                      className="text-[14px] font-bold text-brand hover:underline"
                    >
                      {expanded === job.id ? "Hide details" : "View details"}
                    </button>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>

          <motion.div
            {...reveal()}
            className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-pale p-6"
          >
            <p className="max-w-[560px] text-[15px] leading-[1.6] text-mute">
              Don&apos;t see a role that fits? Send your resume to{" "}
              <a
                href="mailto:hr@aeoncorporate.com"
                className="font-bold text-brand hover:underline"
              >
                hr@aeoncorporate.com
              </a>{" "}
              and we&apos;ll keep it on file.
            </p>
            <Link
              href="/work-at-aeon"
              className="inline-flex items-center gap-2 py-2 text-[14px] font-bold text-brand hover:underline"
            >
              Life at Aeon <ArrowRight size={15} />
            </Link>
          </motion.div>
        </section>

        <section className="bg-sky py-[90px] max-[560px]:py-14">
          <div className={wrap}>
            <Eyebrow>WHY WORK WITH US</Eyebrow>
            <div className="grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
              {perks.map((p, i) => (
                <motion.div
                  key={p.t}
                  {...reveal(i)}
                  className="flex items-center gap-4 rounded-[22px] bg-white p-5 shadow-[0_14px_34px_rgba(11,27,77,.08)]"
                >
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#eaf3ff]">
                    <ColorIcon name={p.icon} size={38} />
                  </span>
                  <b className="text-[15px]">{p.t}</b>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <AnimatePresence>
          {role && (
            <motion.div
              className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-ink/70 p-5 backdrop-blur-[8px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRole(null)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={`Apply for ${role.title}`}
                className="relative my-auto w-[min(560px,100%)] rounded-[24px] bg-white p-8 shadow-[0_30px_90px_rgba(0,0,0,.3)] max-[560px]:p-5"
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setRole(null)}
                  aria-label="Close"
                  className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-[#f1f5ff] hover:bg-line"
                >
                  <X size={18} />
                </button>
                <Eyebrow>APPLY NOW</Eyebrow>
                <h2 className="mb-6 pr-10 text-[26px] leading-tight font-extrabold tracking-[-0.03em]">
                  {role.title}
                </h2>
                <LeadForm
                  fields={baseFields}
                  kind="career"
                  extra={{ job: role.title, jobId: role.id }}
                  submitLabel="Submit application"
                  successTitle="Application received"
                  successText="Thank you for applying. Our HR team will review your details and get in touch."
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  )
}
