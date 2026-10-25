"use client"

import Image from "next/image"
import Link from "next/link"
import { MotionConfig, motion } from "framer-motion"
import { ArrowRight, Check, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ColorIcon,
  Eyebrow,
  SectionHeading,
  btnWhite,
  btnYellow,
  reveal,
  wrap,
  btnBlue,
} from "@/components/site/ui"
import { Highlight, PageHero } from "@/components/site/page-hero"
import { LeadForm, type LeadField } from "@/components/site/lead-form"
import { STATES } from "@/lib/states"

const benefits = [
  "Establish a strong reputation",
  "Value for money",
  "Customised solutions",
  "Work with industry experts",
  "Cut additional costs",
  "Stay one step ahead of competitors",
  "Get excellent exposure",
  "Get work done efficiently",
]

const occupations = [
  "Advocate",
  "Angel Investor",
  "Chartered Accountant",
  "Company Secretary",
  "Cost Accountant",
  "Ex-Tax Officer",
  "Management Team (CXO)",
  "Retired Judge",
  "Tax Expert",
]

const whyCards = [
  {
    icon: "chip",
    title: "Experienced Team, Modern Technology",
    text: "Seasoned professionals supported by a technology-enabled way of working.",
  },
  {
    icon: "tax",
    title: "Smart Solutions at Fair Prices",
    text: "Practical, well-scoped solutions designed to keep costs sensible.",
  },
  {
    icon: "steps",
    title: "Punctual, Deadline-Focused",
    text: "A disciplined team that plans work around your timelines.",
  },
  {
    icon: "advisory",
    title: "Responsive Support",
    text: "Prospective partners get clear answers and a helpful point of contact.",
  },
  {
    icon: "folder",
    title: "Customised Project Management",
    text: "Structured tracking so everyone sees what is happening and what is next.",
  },
]

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
    name: "occupation",
    label: "Occupation",
    type: "select",
    required: true,
    options: occupations,
  },
  {
    name: "state",
    label: "State",
    type: "select",
    required: true,
    options: STATES,
    full: true,
  },
  {
    name: "human",
    label: "Human verification",
    type: "captcha",
    required: true,
    full: true,
    placeholder: "Your answer",
  },
]

export function PartnerContent() {
  return (
    <MotionConfig reducedMotion="user">
      <main id="top" className="overflow-hidden">
        <PageHero
          crumbs={[{ label: "Partner With Us" }]}
          eyebrow="PARTNER WITH AEON"
          title={
            <>
              Partner with us to boost your{" "}
              <Highlight>business and brand.</Highlight>
            </>
          }
          description="Join hands with industry experts to set up or scale a business. We welcome professionals and organizations who want to grow alongside Aeon Corporate."
          actions={
            <Link href="#enquiry" className={btnBlue}>
              Become a Partner <ArrowRight size={16} />
            </Link>
          }
          chips={["Advocates", "CAs & CSs", "Tax experts", "Investors", "CXOs"]}
          image={{
            src: "/illustrations/about-team.jpg",
            alt: "Illustration of consultants partnering on a compliance project",
            width: 900,
            height: 900,
            position: "object-top",
          }}
          note={{ title: "Grow together", sub: "Shared expertise" }}
          icons={["network", "expert", "approved"]}
        />

        {/* Benefits */}
        <section className={cn(wrap, "py-[100px] max-[560px]:py-16")}>
          <SectionHeading
            eyebrow="BENEFITS OF PARTNERING"
            title="Why partner with Aeon Corporate?"
            description="Work alongside a connected team and build your reputation with clients who need dependable guidance."
          />
          <ul className="mt-12 grid grid-cols-4 gap-4 max-[1024px]:grid-cols-2 max-[560px]:grid-cols-1">
            {benefits.map((item, i) => (
              <motion.li
                key={item}
                {...reveal(i % 4)}
                className="group flex items-center gap-3.5 rounded-2xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_18px_36px_rgba(27,95,217,.12)] motion-reduce:transition-none"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white shadow-[0_6px_14px_rgba(27,95,217,.3)]">
                  <Check size={18} />
                </span>
                <b className="text-[15px] leading-snug">{item}</b>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Enquiry */}
        <section
          id="enquiry"
          className="scroll-mt-24 bg-sky py-[100px] max-[560px]:py-16"
        >
          <div
            className={cn(
              wrap,
              "grid grid-cols-[0.85fr_1.15fr] items-start gap-14 max-[1024px]:gap-10 max-[900px]:grid-cols-1",
            )}
          >
            <motion.div {...reveal()}>
              <Eyebrow>REQUEST INFORMATION</Eyebrow>
              <h2 className="text-[clamp(28px,3.4vw,42px)] leading-[1.08] font-extrabold tracking-[-0.03em]">
                Tell us about yourself and we&apos;ll get in touch.
              </h2>
              <p className="mt-5 max-w-[460px] text-[15px] leading-[1.75] text-mute">
                Share a few details and our team will reach out about
                partnership options that suit your profile.
              </p>
              <ul className="mt-6 grid gap-3">
                {[
                  "Easy, no-pressure conversation",
                  "No spam, no sharing of your details",
                  "Your information stays confidential",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 text-[15px] font-semibold"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-brand shadow-sm">
                      <ShieldCheck size={14} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="relative mt-8 hidden max-w-[460px] overflow-hidden rounded-[24px] bg-white p-3 shadow-[0_24px_50px_rgba(11,27,77,.12)] min-[901px]:block">
                <Image
                  src="/illustrations/about-dashboard.jpg"
                  alt="Illustration of a compliance dashboard with shield and documents"
                  width={1200}
                  height={884}
                  sizes="460px"
                  loading="lazy"
                  className="h-auto w-full rounded-2xl"
                />
              </div>
            </motion.div>

            <motion.div
              {...reveal(1)}
              className="rounded-[28px] bg-white p-8 shadow-[0_30px_70px_rgba(11,27,77,.14)] max-[560px]:rounded-[22px] max-[560px]:p-5"
            >
              <h3 className="mb-6 text-2xl font-bold tracking-[-0.02em]">
                Become a partner
              </h3>
              <LeadForm
                fields={fields}
                captcha={{ a: 4, b: 7 }}
                submitLabel="Request information"
                successTitle="Thanks, we'll be in touch"
                successText="Our team will review your details and reach out about partnership options."
              />
            </motion.div>
          </div>
        </section>

        {/* Who can partner */}
        <section className={cn(wrap, "py-[100px] max-[560px]:py-16")}>
          <SectionHeading
            eyebrow="WHO CAN PARTNER"
            title="Open to professionals across disciplines."
          />
          <div className="mt-10 flex flex-wrap gap-3">
            {occupations.map((o, i) => (
              <motion.span
                key={o}
                {...reveal(i % 5)}
                className="rounded-full border border-line bg-[#eaf3ff] px-5 py-3 text-[14px] font-bold text-ink transition hover:border-brand hover:bg-white hover:text-brand"
              >
                {o}
              </motion.span>
            ))}
          </div>
        </section>

        {/* Why choose */}
        <section className="relative overflow-hidden bg-ink py-[100px] text-white max-[560px]:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(27,95,217,.4),transparent_35%)]" />
          <div className={cn(wrap, "relative")}>
            <SectionHeading
              light
              eyebrow="WHY AEON CORPORATE"
              title="A team that is easy to work with."
            />
            <div className="mt-12 grid grid-cols-5 gap-4 max-[1100px]:grid-cols-3 max-[760px]:grid-cols-2 max-[560px]:grid-cols-1">
              {whyCards.map((c, i) => (
                <motion.article
                  key={c.title}
                  {...reveal(i % 3)}
                  className="rounded-[22px] border border-white/10 bg-white/[.06] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-brand hover:bg-white/10 motion-reduce:transition-none"
                >
                  <span className="grid size-14 place-items-center rounded-2xl bg-white shadow-[0_8px_20px_rgba(0,0,0,.2)]">
                    <ColorIcon name={c.icon} size={40} />
                  </span>
                  <h3 className="mt-5 text-[17px] leading-snug font-bold">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.65] text-white/65">
                    {c.text}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1b5fd9,#0a44b8)] py-20 text-white max-[560px]:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle,white_1px,transparent_1.5px)] [background-size:22px_22px] opacity-[.2] [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />
          <div
            className={cn(
              wrap,
              "relative flex items-center justify-between gap-8 max-[900px]:flex-col max-[900px]:items-start",
            )}
          >
            <div>
              <Eyebrow className="text-sun">JOIN US</Eyebrow>
              <h2 className="max-w-[640px] text-[clamp(30px,4vw,52px)] leading-[1.02] font-bold tracking-[-0.04em]">
                Become a member of this growing business.
              </h2>
            </div>
            <Link href="#enquiry" className={btnWhite}>
              Become Partner <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </MotionConfig>
  )
}
