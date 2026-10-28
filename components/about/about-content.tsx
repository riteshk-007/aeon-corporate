"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"
import { MotionConfig, motion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Mail,
  Phone,
  Play,
  Globe,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Highlight, PageHero } from "@/components/site/page-hero"
import {
  ColorIcon,
  Eyebrow,
  SectionHeading,
  btnBlue,
  btnOutline,
  btnYellow,
  wrap,
} from "@/components/site/ui"

/* ------------------------------------------------------------------ *
 * Content. Edit freely — the journey phases and contact details are
 * general placeholders until real milestones / numbers are supplied.
 * ------------------------------------------------------------------ */

const focusAreas = [
  "Startup",
  "IP & Trademark",
  "Compliance",
  "Regulatory",
  "Environmental",
]

const whyCards = [
  {
    icon: "network",
    title: "One Connected Partner",
    text: "Registrations, licences, tax, intellectual property, regulatory and environmental support, all under one roof.",
  },
  {
    icon: "expert",
    title: "Get Expert Guidance",
    text: "Experienced professionals review your requirement and explain the next steps in plain language.",
  },
  {
    icon: "advisory",
    title: "Talk to an Expert Now",
    text: "Reach our team for the specific matter you are facing and we will point you to the right service.",
  },
]

// Replace these general phases with real dated milestones when available.
const journey = [
  {
    label: "Vision",
    text: "A clear goal: make business compliance simpler for every founder and team.",
  },
  {
    label: "Foundation",
    text: "Core services take shape: registrations, licences and tax support.",
  },
  {
    label: "Growth",
    text: "The catalogue widens across compliance, intellectual property and advisory.",
  },
  {
    label: "Regulatory & Environmental",
    text: "Regulatory approvals and environmental permissions join the offering.",
  },
  {
    label: "Technology-Enabled Experience",
    text: "Requirements, documents and progress move into a clearer digital experience.",
  },
  {
    label: "What's Next",
    text: "Continuing to expand services and support for ambitious businesses.",
  },
]

const researchSteps = [
  "We Do Our Research",
  "We Meet Our Client",
  "We Create Ideas",
  "We Revise or Make Changes",
  "We Execute the Work",
]

const workSteps = [
  {
    icon: "form",
    title: "Fill Up Application Form",
    text: "Share the context, goals and requirements that matter.",
  },
  {
    icon: "folder",
    title: "Complete Service Formalities",
    text: "Finish the agreed documentation or payment requirements where applicable.",
  },
  {
    icon: "workflow",
    title: "Executive Will Process Application",
    text: "We organize the details and keep work moving.",
  },
  {
    icon: "mail",
    title: "Get Confirmation on Mail",
    text: "Stay informed through every milestone.",
  },
]

const industries = [
  { label: "Technology", icon: "laptop" },
  { label: "Manufacturing", icon: "factory" },
  { label: "Retail", icon: "store" },
  { label: "Healthcare", icon: "health" },
  { label: "Professional Services", icon: "briefcase" },
  { label: "Consumer Brands", icon: "bag" },
]

const articles = [
  {
    tag: "BUSINESS & STARTUPS",
    title: "How businesses can prepare for their next stage of growth",
    text: "Practical considerations for building structured business operations.",
    image: "/illustrations/insight-startup.jpg",
  },
  {
    tag: "COMPLIANCE & REGULATION",
    title: "Understanding the importance of proactive compliance",
    text: "How organized processes help businesses stay prepared.",
    image: "/illustrations/insight-compliance.jpg",
  },
  {
    tag: "SUSTAINABILITY",
    title: "Building environmental responsibility into business strategy",
    text: "The role of environmental thinking in modern business planning.",
    image: "/illustrations/insight-sustainability.jpg",
  },
]

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, delay: i * 0.1 },
})

const dots =
  "bg-[radial-gradient(circle,rgba(27,95,217,.4)_1.6px,transparent_2.2px)] [background-size:16px_16px]"

export function AboutContent() {
  const [videoOpen, setVideoOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVideoOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])
  useEffect(() => {
    document.body.style.overflow = videoOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [videoOpen])

  return (
    <MotionConfig reducedMotion="user">
      <main id="top" className="overflow-hidden">
        {/* ---------------- Hero banner ---------------- */}
        <PageHero
          crumbs={[{ label: "About Us" }]}
          eyebrow="ABOUT AEON CORPORATE"
          title={
            <>
              Clarity for every <Highlight>business journey.</Highlight>
            </>
          }
          description="Aeon Corporate is a technology-enabled partner for registrations, licensing, tax, intellectual property, regulatory and environmental compliance, built for startups, growing teams and established organizations."
          chips={focusAreas}
          image={{
            src: "/illustrations/about-team.jpg",
            alt: "Illustration of consultants collaborating on a compliance checklist",
            width: 900,
            height: 900,
            position: "object-top",
          }}
          note={{ title: "Structured process", sub: "Clear next steps" }}
          icons={["shield", "tax", "eco"]}
        />

        {/* ---------------- Who we are / About us ---------------- */}
        <section className={cn(wrap, "py-[100px] max-[560px]:py-16")}>
          <div className="grid grid-cols-[1.05fr_0.95fr] items-center gap-16 max-[1024px]:gap-10 max-[900px]:grid-cols-1">
            <motion.div {...reveal()}>
              <Eyebrow>WHO WE ARE</Eyebrow>
              <h2 className="max-w-[560px] text-[clamp(30px,3.7vw,46px)] leading-[1.06] font-extrabold tracking-[-0.035em]">
                We serve small teams, ambitious founders and{" "}
                <span className="bg-[linear-gradient(transparent_62%,#ffd93d_62%)] px-1">
                  established companies.
                </span>
              </h2>
              <p className="mt-5 max-w-[540px] text-[15px] leading-[1.75] text-mute">
                Aeon Corporate serves small businesses, growing entrepreneurs
                and established organizations. Wherever you are on your journey,
                we help you move forward with clarity and confidence.
              </p>
              <h3 className="mt-8 text-lg font-bold">About us</h3>
              <p className="mt-2 max-w-[540px] text-[15px] leading-[1.75] text-mute">
                We bring together experienced Chartered Accountants, Company
                Secretaries, engineers and legal professionals, so you can
                handle registrations, licences, tax, intellectual property,
                regulatory and environmental requirements through one connected
                partner. Professional expertise, combined with a
                technology-enabled experience, built to make compliance feel
                more manageable.
              </p>
            </motion.div>
            <motion.div {...reveal(1)} className="relative">
              <div
                aria-hidden="true"
                className={cn("absolute -top-5 -right-5 size-36", dots)}
              />
              <div className="relative overflow-hidden rounded-[32px] border border-line bg-white shadow-[0_30px_70px_rgba(11,27,77,.14)]">
                <Image
                  src="/illustrations/hero.jpg"
                  alt="Illustration of a consultant presenting a compliance dashboard"

                  className="aspect-[4/3] w-full object-cover"
                  width={1400}
                  height={1032}
                  sizes="(max-width: 900px) 100vw, 560px"
                />
              </div>
            </motion.div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
            {[
              {
                icon: "expert",
                title: "Client-Centric and Independent",
                text: "You explain your requirement and we recommend the route that fits, with clear scope, documentation and next steps, so our advice stays practical and impartial.",
              },
              {
                icon: "network",
                title: "Extensive Reach and Tailored Solutions",
                text: "Our services span startup registration, compliance, regulatory approvals, intellectual property and environmental permissions, tailored to your industry and stage.",
              },
            ].map((item, i) => (
              <motion.article
                key={item.title}
                {...reveal(i)}
                className="group flex gap-5 rounded-[24px] border border-line bg-pale p-7 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_22px_44px_rgba(27,95,217,.12)] motion-reduce:transition-none max-[560px]:flex-col max-[560px]:p-6"
              >
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white shadow-[0_8px_20px_rgba(11,27,77,.12)]">
                  <ColorIcon name={item.icon} size={44} />
                </span>
                <div>
                  <h3 className="text-xl leading-snug font-bold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-mute">
                    {item.text}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ---------------- Tagline banner ---------------- */}
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1b5fd9,#0a44b8)] py-16 text-white max-[560px]:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle,white_1px,transparent_1.5px)] [background-size:22px_22px] opacity-[.18] [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />
          <div className={cn(wrap, "relative text-center")}>
            <motion.p
              {...reveal()}
              className="mx-auto max-w-[860px] text-[clamp(22px,3vw,36px)] leading-[1.25] font-extrabold tracking-[-0.025em]"
            >
              Join Aeon Corporate, where you don&apos;t just start a business;
              you start a{" "}
              <span className="rounded-lg bg-sun px-2 text-ink">
                new chapter
              </span>{" "}
              in professional services.
            </motion.p>
          </div>
        </section>

        {/* ---------------- Streamlining compliance ---------------- */}
        <section className={cn(wrap, "py-[100px] max-[560px]:py-16")}>
          <div className="grid grid-cols-[0.95fr_1.05fr] items-center gap-16 max-[1024px]:gap-10 max-[900px]:grid-cols-1">
            <motion.div {...reveal()} className="relative max-[900px]:order-2">
              <div
                aria-hidden="true"
                className="absolute -bottom-5 -left-5 size-40 rounded-[28px] bg-sun max-[560px]:size-24"
              />
              <div className="relative overflow-hidden rounded-[32px] border border-line bg-white shadow-[0_30px_70px_rgba(11,27,77,.14)]">
                <Image
                  src="/illustrations/about-dashboard.jpg"
                  alt="Illustration of a compliance dashboard with a shield, calendar and documents"

                  className="aspect-[4/3] w-full object-cover"
                  width={1200}
                  height={884}
                  sizes="(max-width: 900px) 100vw, 640px"
                />
              </div>
            </motion.div>
            <motion.div {...reveal(1)} className="max-[900px]:order-1">
              <Eyebrow>COMPLIANCE, SIMPLIFIED</Eyebrow>
              <h2 className="max-w-[560px] text-[clamp(28px,3.4vw,42px)] leading-[1.08] font-extrabold tracking-[-0.03em]">
                Streamlining Business in India: Your Solution for Complex
                Compliance
              </h2>
              <p className="mt-5 max-w-[540px] text-[15px] leading-[1.75] text-mute">
                Aeon Corporate helps businesses manage compliance across many
                business types and sectors, from financial services and
                manufacturing to retail, healthcare and technology. With a
                technology-enabled approach, your requirements, documents and
                progress stay organized in one place.
              </p>
              <ul className="mt-6 grid gap-3">
                {[
                  "Prompt responses and clear next steps",
                  "Expert, tailored guidance for your industry",
                  "All your compliance needs in one place",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[15px] font-semibold"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                      <Check size={14} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ---------------- How to reach us ---------------- */}
        <section className="bg-sky py-[100px] max-[560px]:py-16">
          <div className={wrap}>
            <SectionHeading
              eyebrow="GET IN TOUCH"
              title="How to Reach Us?"
              description="Choose the channel that suits you. A member of our team will get back to you."
            />
            <div className="mt-12 grid grid-cols-[1fr_1fr] gap-6 max-[900px]:grid-cols-1">
              <motion.div
                {...reveal()}
                className="grid gap-3 rounded-[28px] bg-white p-6 shadow-[0_24px_50px_rgba(11,27,77,.1)] max-[560px]:p-4"
              >
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "hello@aeoncorporate.com",
                    href: "mailto:hello@aeoncorporate.com",
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+91 00000 00000",
                    href: "tel:+910000000000",
                  },
                  {
                    icon: Globe,
                    label: "Website",
                    value: "www.aeoncorporate.com",
                    href: "/",
                  },
                ].map(({ icon: Icon, label, value, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="group flex items-center gap-4 rounded-2xl border border-line p-4 transition hover:border-brand/40 hover:bg-pale"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#dcebff] text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      <Icon size={21} />
                    </span>
                    <span className="min-w-0">
                      <small className="block text-[12px] font-bold tracking-[.12em] text-mute uppercase">
                        {label}
                      </small>
                      <b className="block truncate text-[15px]">{value}</b>
                    </span>
                    <ArrowUpRight
                      size={17}
                      className="ml-auto shrink-0 text-brand opacity-60 transition group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </motion.div>

              <motion.div
                {...reveal(1)}
                className="relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1b5fd9,#0a44b8)] p-8 text-white max-[560px]:p-6"
              >
                <div
                  aria-hidden="true"
                  className="absolute -top-16 -right-16 size-56 rounded-full border border-white/20"
                />
                <div className="relative">
                  <h3 className="text-2xl font-bold tracking-[-0.02em]">
                    Two simple steps
                  </h3>
                  <ol className="mt-6 grid gap-5">
                    {[
                      "Submit your query and state your requirements.",
                      "Receive a callback from our experts, who give you initial guidance and help you move forward.",
                    ].map((step, i) => (
                      <li key={step} className="flex gap-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sun text-[15px] font-black text-ink">
                          {i + 1}
                        </span>
                        <p className="pt-1.5 text-[15px] leading-[1.6] text-white/90">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
                <Link
                  href="/#contact"
                  className={cn(btnYellow, "relative mt-8 w-fit")}
                >
                  Get Started <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---------------- Why businesses choose us ---------------- */}
        <section className={cn(wrap, "py-[100px] max-[560px]:py-16")}>
          <SectionHeading
            eyebrow="WHY AEON"
            title="Why Businesses Choose Aeon Corporate"
            description="A connected partner for the requirements that usually slow growing businesses down."
          />
          <div className="mt-12 grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
            {whyCards.map((card, i) => (
              <motion.article
                key={card.title}
                {...reveal(i)}
                className="group relative overflow-hidden rounded-[26px] border border-line bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_24px_48px_rgba(27,95,217,.14)] motion-reduce:transition-none"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-3 right-4 text-[84px] leading-none font-black tracking-[-0.06em] text-brand/[.07]"
                >
                  0{i + 1}
                </span>
                <span className="relative grid size-16 place-items-center rounded-2xl bg-[#eaf3ff]">
                  <ColorIcon name={card.icon} size={44} />
                </span>
                <h3 className="relative mt-6 text-xl font-bold tracking-[-0.02em]">
                  {card.title}
                </h3>
                <p className="relative mt-2.5 text-[14px] leading-[1.7] text-mute">
                  {card.text}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ---------------- Our journey ---------------- */}
        <section className="relative overflow-hidden bg-ink py-[100px] text-white max-[560px]:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(27,95,217,.4),transparent_35%)]" />
          <div className={cn(wrap, "relative")}>
            <SectionHeading
              light
              eyebrow="OUR JOURNEY"
              title="From a simple idea to a connected business partner."
              description="The phases that shaped how we work today."
            />
            <ol className="relative mt-14 grid grid-cols-3 gap-x-6 gap-y-10 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:gap-y-8 max-[560px]:border-l max-[560px]:border-white/20 max-[560px]:pl-6">
              {journey.map((item, i) => (
                <motion.li
                  key={item.label}
                  {...reveal(i % 3)}
                  className="relative"
                >
                  <span className="absolute top-[9px] left-0 hidden h-px w-full bg-white/15 min-[561px]:block" />
                  <span className="relative z-10 grid size-[18px] place-items-center rounded-full bg-sun shadow-[0_0_0_6px_rgba(255,217,61,.22)] max-[560px]:absolute max-[560px]:top-1 max-[560px]:-left-[33px]" />
                  <p className="mt-5 text-[11px] font-black tracking-[.18em] text-sun max-[560px]:mt-0">
                    PHASE 0{i + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-bold tracking-[-0.02em]">
                    {item.label}
                  </h3>
                  <p className="mt-2 max-w-[300px] text-[14px] leading-[1.65] text-white/65">
                    {item.text}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- Watch our process ---------------- */}
        <section className={cn(wrap, "py-[100px] max-[560px]:py-16")}>
          <div className="grid grid-cols-[0.9fr_1.1fr] items-center gap-16 max-[1024px]:gap-10 max-[900px]:grid-cols-1">
            <motion.div {...reveal()}>
              <Eyebrow>OUR APPROACH</Eyebrow>
              <h2 className="text-[clamp(28px,3.4vw,42px)] leading-[1.08] font-extrabold tracking-[-0.03em]">
                Watch our process
              </h2>
              <ul className="mt-7 grid gap-3">
                {researchSteps.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_8px_20px_rgba(11,27,77,.05)]"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-[13px] font-black text-white">
                      {i + 1}
                    </span>
                    <b className="text-[15px]">{step}</b>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...reveal(1)} className="relative">
              <div
                aria-hidden="true"
                className={cn("absolute -top-5 -right-5 size-36", dots)}
              />
              <div className="relative min-h-[380px] overflow-hidden rounded-[32px] shadow-[0_30px_70px_rgba(11,27,77,.2)] max-[560px]:min-h-[280px] max-[560px]:rounded-[24px]">
                <Image
                  src="/illustrations/story-process.jpg"
                  alt="Illustration of a team presenting a step-by-step process"

                  className="absolute inset-0 size-full object-cover"
                  width={1400}
                  height={910}
                  sizes="(max-width: 900px) 100vw, 640px"
                />
                <button
                  onClick={() => setVideoOpen(true)}
                  aria-label="Open brand story"
                  className="group absolute top-1/2 left-1/2 grid size-[84px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand shadow-[0_0_0_12px_rgba(255,255,255,.22)] transition duration-300 hover:scale-110 max-[560px]:size-16"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 animate-ping rounded-full bg-white/60 motion-reduce:animate-none"
                  />
                  <Play
                    size={26}
                    fill="currentColor"
                    className="relative ml-1"
                  />
                </button>
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[13px] font-bold whitespace-nowrap text-white backdrop-blur-md">
                  Welcome to Aeon Corporate
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ---------------- Our working process ---------------- */}
        <section className="bg-pale py-[100px] max-[560px]:py-16">
          <div className={wrap}>
            <SectionHeading
              eyebrow="OUR WORKING PROCESS"
              title="Your Journey, Clearly Mapped Out."
              description="A considered process that keeps requirements, documentation and progress visible."
            />
            <ol className="relative mt-14 grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
              <div
                aria-hidden="true"
                className="absolute top-8 right-8 left-8 h-0.5 rounded-full bg-[linear-gradient(90deg,#1b5fd9,#ffd93d)] max-[900px]:hidden"
              />
              {workSteps.map((step, i) => (
                <motion.li key={step.title} {...reveal(i)} className="relative">
                  <span
                    className={cn(
                      "relative z-10 grid size-16 place-items-center rounded-full border-4 bg-white shadow-[0_10px_24px_rgba(27,95,217,.22)]",
                      i % 2 === 1 ? "border-sun" : "border-brand",
                    )}
                  >
                    <ColorIcon name={step.icon} size={42} />
                  </span>
                  <div className="relative mt-5 overflow-hidden rounded-[24px] border border-line bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_rgba(27,95,217,.12)] motion-reduce:transition-none">
                    <span
                      aria-hidden="true"
                      className="absolute -top-3 right-3 text-[84px] leading-none font-black tracking-[-0.06em] text-brand/[.07]"
                    >
                      0{i + 1}
                    </span>
                    <p className="relative text-[11px] font-black tracking-[.18em] text-brand">
                      STEP 0{i + 1}
                    </p>
                    <h3 className="relative mt-3 text-[19px] leading-[1.2] font-bold tracking-[-0.02em]">
                      {step.title}
                    </h3>
                    <p className="relative mt-2.5 text-[13px] leading-[1.65] text-mute">
                      {step.text}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- Industries ---------------- */}
        <section className={cn(wrap, "py-[100px] max-[560px]:py-16")}>
          <SectionHeading
            eyebrow="BUILT FOR AMBITIOUS TEAMS"
            title="Support for businesses across a range of industries."
          />
          <div className="mt-12 grid grid-cols-6 gap-4 max-[1024px]:grid-cols-3 max-[560px]:grid-cols-2 max-[560px]:gap-3">
            {industries.map((item, i) => (
              <motion.div
                key={item.label}
                {...reveal(i % 3)}
                className="group flex flex-col items-center gap-4 rounded-[22px] border border-line bg-white p-6 text-center transition duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_20px_40px_rgba(27,95,217,.12)] motion-reduce:transition-none max-[560px]:p-4"
              >
                <span className="grid size-[72px] place-items-center rounded-2xl bg-[#eaf3ff]">
                  <ColorIcon name={item.icon} size={48} />
                </span>
                <b className="text-[14px] leading-snug">{item.label}</b>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------------- Articles ---------------- */}
        <section className="bg-sky py-[100px] max-[560px]:py-16">
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
              <SectionHeading
                eyebrow="VISIT OUR ARTICLES"
                title="Insights for businesses moving forward."
                description="Practical ideas for teams building with more structure, clarity and confidence."
              />
              <Link
                href="/#insights"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-[14px] font-bold transition hover:border-brand hover:text-brand"
              >
                View More Articles <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
              {articles.map((a, i) => (
                <motion.article
                  key={a.title}
                  {...reveal(i)}
                  className="group overflow-hidden rounded-[24px] border border-line bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(11,27,77,.14)] motion-reduce:transition-none"
                >
                  <div className="overflow-hidden">
                    <Image
                      src={a.image}
                      alt={a.title}

                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                      width={1000}
                      height={650}
                      sizes="(max-width: 900px) 100vw, 640px"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block rounded-full bg-[#dcebff] px-3 py-1.5 text-[11px] font-black tracking-[.1em] text-brand">
                      {a.tag}
                    </span>
                    <h3 className="mt-3.5 text-[18px] leading-[1.25] font-bold tracking-[-0.02em]">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.6] text-mute">
                      {a.text}
                    </p>
                    <Link
                      href="/#contact"
                      className="mt-4 inline-flex items-center gap-2 py-1 text-[13px] font-bold text-brand"
                    >
                      Read More <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1b5fd9,#0a44b8)] py-20 text-white max-[560px]:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle,white_1px,transparent_1.5px)] [background-size:22px_22px] opacity-[.2] [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />
          <div
            className={cn(
              wrap,
              "relative flex items-center justify-between gap-8 max-[900px]:flex-col max-[900px]:items-start",
            )}
          >
            <div>
              <Eyebrow className="text-sun">TRANSFORM YOUR BUSINESS</Eyebrow>
              <h2 className="max-w-[640px] text-[clamp(30px,4vw,52px)] leading-[1.02] font-bold tracking-[-0.04em]">
                Ready to talk about your next business milestone?
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/#contact" className={btnYellow}>
                Request a consultation <ArrowRight size={16} />
              </Link>
              <Link
                href="/#services"
                className={cn(
                  btnOutline,
                  "!bg-white/10 !text-white !border-white/40",
                )}
              >
                Explore services
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------- Video dialog ---------------- */}
        {videoOpen && (
          <div
            className="fixed inset-0 z-[100] grid animate-modal-in place-items-center bg-ink/70 p-5 backdrop-blur-[8px]"
            onClick={() => setVideoOpen(false)}
          >
            <div
              className="relative w-[min(500px,100%)] animate-card-in rounded-[20px] bg-white p-[35px] text-center shadow-[0_30px_90px_rgba(0,0,0,.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-[13px] right-[13px] grid size-[31px] place-items-center rounded-full bg-[#f1f5ff]"
                onClick={() => setVideoOpen(false)}
                aria-label="Close"
              >
                <X />
              </button>
              <div className="mx-auto mb-6 grid size-[68px] place-items-center rounded-full bg-white text-brand shadow-[0_0_0_11px_rgba(27,95,217,.12)]">
                <Play fill="currentColor" size={19} />
              </div>
              <Eyebrow className="justify-center">THE AEON APPROACH</Eyebrow>
              <h2 className="text-[32px] leading-none font-bold tracking-[-0.03em]">
                Clarity in complexity, built into every step.
              </h2>
              <p className="mt-4 mb-6 text-[13px] leading-[1.7] text-mute">
                Our brand story is being prepared. In the meantime, speak with
                our team to see how a structured, business-focused process can
                help you move forward.
              </p>
              <Link
                href="/#contact"
                className={btnBlue}
                onClick={() => setVideoOpen(false)}
              >
                Start a conversation <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </main>
    </MotionConfig>
  )
}
