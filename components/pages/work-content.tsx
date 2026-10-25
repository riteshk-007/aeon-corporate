"use client"

import Image from "next/image"
import Link from "next/link"
import { MotionConfig, motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ColorIcon,
  Eyebrow,
  SectionHeading,
  btnWhite,
  btnYellow,
  dots,
  reveal,
  wrap,
  btnBlue,
} from "@/components/site/ui"
import { Highlight, PageHero } from "@/components/site/page-hero"

const culture = [
  {
    icon: "expert",
    title: "Healthy Work Culture",
    text: "We care about wellbeing, a safe and comfortable workplace, and recognising hard work. Diversity and inclusion matter here: everyone is treated as an equal, regardless of gender, background or designation.",
    points: [
      "Festival celebrations",
      "Recreational activities",
      "Team off-sites",
    ],
    image: "/illustrations/about-team.jpg",
    alt: "Illustration of a team collaborating around a table",
    w: 900,
    h: 900,
  },
  {
    icon: "bulb",
    title: "Holistic Learning Opportunities",
    text: "Learning never stops. We encourage peer learning at every level, with regular training, meetups and career counselling to help you grow.",
    points: ["Regular training", "Meetups", "Career counselling"],
    image: "/illustrations/story-process.jpg",
    alt: "Illustration of a team learning together in front of a process board",
    w: 1400,
    h: 910,
  },
  {
    icon: "network",
    title: "Community Exposure",
    text: "We host events and encourage our people to attend industry events, meet peers and share what they know on bigger stages.",
    points: ["Industry events", "Speaking opportunities", "Networking"],
    image: "/illustrations/about-dashboard.jpg",
    alt: "Illustration of a compliance dashboard",
    w: 1200,
    h: 884,
  },
]

// Confirm these against your real policies before launch.
const benefits = [
  {
    icon: "workflow",
    title: "Flexible Timings",
    text: "Work schedules that respect real life.",
  },
  {
    icon: "health",
    title: "Health Insurance",
    text: "Cover that looks after you and your wellbeing.",
  },
  {
    icon: "form",
    title: "Paid Leave Policy",
    text: "Time off to rest and recharge.",
  },
  {
    icon: "target",
    title: "Sport Activities",
    text: "Stay active with the team.",
  },
]

const moments = [
  {
    title: "Festival Celebrations",
    text: "Office celebrations that feel like family.",
    icon: "bag",
  },
  {
    title: "Annual Day & Foundation Day",
    text: "Performances, awards and a lot of fun.",
    icon: "target",
  },
  {
    title: "Off-sites & Outings",
    text: "Time away from the desk to connect and recharge.",
    icon: "store",
  },
]

export function WorkContent() {
  return (
    <MotionConfig reducedMotion="user">
      <main id="top" className="overflow-hidden">
        <PageHero
          crumbs={[{ label: "Work at Aeon" }]}
          eyebrow="WORK AT AEON CORPORATE"
          title={
            <>
              Work where talent, ideas and <Highlight>enthusiasm</Highlight>{" "}
              matter.
            </>
          }
          description="We believe that if everyone is moving forward together, success takes care of itself. Come build a career with a team that values what you bring."
          actions={
            <Link href="/career" className={btnBlue}>
              View Open Positions <ArrowRight size={16} />
            </Link>
          }
          chips={["Learning", "Inclusive culture", "Growth"]}
          image={{
            src: "/illustrations/story-process.jpg",
            alt: "Illustration of a team presenting a process to colleagues",
            width: 1400,
            height: 910,
          }}
          note={{ title: "Grow with us", sub: "Learn and lead" }}
          icons={["bulb", "health", "workflow"]}
        />

        {/* Why join */}
        <section className={cn(wrap, "py-[100px] max-[560px]:py-16")}>
          <div className="grid grid-cols-[1.05fr_0.95fr] items-center gap-16 max-[1024px]:gap-10 max-[900px]:grid-cols-1">
            <motion.div {...reveal()}>
              <Eyebrow>WHY JOIN AEON?</Eyebrow>
              <h2 className="max-w-[560px] text-[clamp(30px,3.7vw,46px)] leading-[1.06] font-extrabold tracking-[-0.035em]">
                We grow as our people{" "}
                <span className="bg-[linear-gradient(transparent_62%,#ffd93d_62%)] px-1">
                  grow.
                </span>
              </h2>
              <p className="mt-5 max-w-[540px] text-[15px] leading-[1.75] text-mute">
                At Aeon Corporate we grow alongside our employees by developing
                their talent and giving them room to take on real
                responsibility. A diverse, motivated team is what lets us serve
                founders and businesses well.
              </p>
              <Link
                href="/career"
                className="mt-7 inline-flex items-center gap-2 py-2 text-[14px] font-bold text-brand hover:underline"
              >
                Explore current openings <ArrowRight size={15} />
              </Link>
            </motion.div>
            <motion.div {...reveal(1)} className="relative">
              <div
                aria-hidden="true"
                className={cn("absolute -top-5 -right-5 size-36", dots)}
              />
              <div className="relative overflow-hidden rounded-[32px] border border-line bg-white shadow-[0_30px_70px_rgba(11,27,77,.14)]">
                <Image
                  src="/illustrations/hero.jpg"
                  alt="Illustration of a consultant presenting a dashboard to the team"
                  width={1400}
                  height={1032}
                  sizes="(max-width: 900px) 100vw, 520px"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Culture */}
        <section className="bg-sky py-[100px] max-[560px]:py-16">
          <div className={wrap}>
            <SectionHeading
              eyebrow="LIFE AT AEON"
              title="A place to learn, belong and grow."
            />
            <div className="mt-14 grid gap-10">
              {culture.map((c, i) => (
                <motion.article
                  key={c.title}
                  {...reveal()}
                  className={cn(
                    "grid grid-cols-2 items-center gap-10 rounded-[32px] bg-white p-8 shadow-[0_24px_60px_rgba(11,27,77,.1)] max-[900px]:grid-cols-1 max-[560px]:rounded-[24px] max-[560px]:p-5",
                    i % 2 === 1 &&
                      "[&>div:first-child]:order-2 max-[900px]:[&>div:first-child]:order-1",
                  )}
                >
                  <div>
                    <span className="grid size-16 place-items-center rounded-2xl bg-[#eaf3ff]">
                      <ColorIcon name={c.icon} size={44} />
                    </span>
                    <h3 className="mt-5 text-2xl font-bold tracking-[-0.02em]">
                      {c.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.75] text-mute">
                      {c.text}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {c.points.map((p) => (
                        <li
                          key={p}
                          className="rounded-full bg-[#eaf3ff] px-3.5 py-1.5 text-[12px] font-bold text-brand"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="overflow-hidden rounded-[24px] border border-line bg-white">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      width={c.w}
                      height={c.h}
                      sizes="(max-width: 900px) 100vw, 520px"
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className={cn(wrap, "py-[100px] max-[560px]:py-16")}>
          <SectionHeading
            eyebrow="PERKS"
            title="A handful of benefits that matter."
          />
          <div className="mt-12 grid grid-cols-4 gap-5 max-[1024px]:grid-cols-2 max-[560px]:grid-cols-1">
            {benefits.map((b, i) => (
              <motion.article
                key={b.title}
                {...reveal(i)}
                className="group rounded-[24px] border border-line bg-white p-6 text-center transition duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_22px_44px_rgba(27,95,217,.12)] motion-reduce:transition-none"
              >
                <span className="mx-auto grid size-[76px] place-items-center rounded-2xl bg-[#eaf3ff]">
                  <ColorIcon name={b.icon} size={50} />
                </span>
                <h3 className="mt-5 text-lg font-bold">{b.title}</h3>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-mute">
                  {b.text}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Moments */}
        <section className="relative overflow-hidden bg-ink py-[100px] text-white max-[560px]:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(27,95,217,.4),transparent_35%)]" />
          <div className={cn(wrap, "relative")}>
            <SectionHeading
              light
              eyebrow="FUN AND CELEBRATION"
              title="Work is an adventure, with fun and celebration!"
            />
            <div className="mt-12 grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
              {moments.map((m, i) => (
                <motion.article
                  key={m.title}
                  {...reveal(i)}
                  className="rounded-[24px] border border-white/10 bg-white/[.06] p-7 transition duration-300 hover:-translate-y-1.5 hover:border-brand hover:bg-white/10 motion-reduce:transition-none"
                >
                  <span className="grid size-14 place-items-center rounded-2xl bg-white">
                    <ColorIcon name={m.icon} size={38} />
                  </span>
                  <h3 className="mt-5 text-xl font-bold">{m.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-white/65">
                    {m.text}
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
              <Eyebrow className="text-sun">JOIN THE TEAM</Eyebrow>
              <h2 className="max-w-[640px] text-[clamp(30px,4vw,52px)] leading-[1.02] font-bold tracking-[-0.04em]">
                Ready to build your career with Aeon?
              </h2>
            </div>
            <Link href="/career" className={btnWhite}>
              View Open Positions <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </MotionConfig>
  )
}
