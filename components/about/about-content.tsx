"use client"

import Image from "next/image"
import Link from "next/link"
import { MotionConfig, motion } from "framer-motion"
import { ArrowRight, Clock, Cpu, Handshake, Mail, MapPin, Network, Phone, Quote, Target, UserRound } from "lucide-react"
import { cn } from "@/lib/utils"
import { contactInfo } from "@/lib/site-data"
import { Highlight, PageHero } from "@/components/site/page-hero"
import { ColorIcon, Eyebrow, SectionHeading, btnBlue, btnYellow, wrap } from "@/components/site/ui"

/* Content from the client's "About Us" brief (12.11.2026) and team profile. */

const focusAreas = ["Corporate laws", "Regulatory compliance", "Finance & accounts", "Legal advisory"]

const workingProcess = [
  ["Request / Enquiry", "You fill in your details and submit the enquiry form."],
  ["Understanding your requirements", "An Aeon representative reaches you over a phone call or email."],
  ["Service formalities", "We complete the agreed documentation, SLA and payment requirements, where applicable."],
  ["Assignment initiation", "Resources are deployed, with a kick-off meeting if required."],
  ["Advice", "We tell you the options, the risks and what we recommend, in easy-to-understand language."],
  ["Execution & delivery", "You get a confirmation email and stay informed through every milestone."],
] as const

const expertise = [
  "Banking and Finance",
  "Corporate and Commercial",
  "Corporate Governance",
  "Corporate Restructuring",
  "Data Protection and Privacy",
  "Dispute Resolution and Litigation",
  "Employment and Labour",
  "Startups and Emerging Companies",
  "Energy, Infrastructure and Resources",
  "Estate Planning, Trusts and Private Client Services",
  "Intellectual Property",
  "Mergers and Acquisitions",
]

const cities = contactInfo.cities

const values = [
  { icon: Target, title: "Precision", text: "Tailored business solutions" },
  { icon: Handshake, title: "Trust", text: "Long-term client partnerships" },
  { icon: Network, title: "Integration", text: "Connected service ecosystem" },
  { icon: Cpu, title: "Innovation", text: "Technology-enabled delivery" },
]

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, delay: i * 0.06 },
})

export function AboutContent() {
  return (
    <MotionConfig reducedMotion="user">
      <main id="top" className="overflow-hidden">
        <PageHero
          crumbs={[{ label: "About Us" }]}
          eyebrow="ABOUT AEON CORPORATE"
          title={
            <>
              Your Business. <Highlight>Our Expertise.</Highlight>
            </>
          }
          description="An AI and tech-enabled corporate and business advisory platform, offering curated services and solutions tailored to the unique needs of each client across industries and sectors."
          chips={focusAreas}
          image={{
            src: "/illustrations/about-team.jpg",
            alt: "Illustration of consultants working together on a client checklist",
            width: 900,
            height: 900,
            position: "object-top",
          }}
          note={{ title: "Plan • Protect • Grow", sub: "From first call to ongoing support" }}
          icons={["advisory", "shield", "accountant"]}
        />

        {/* About */}
        <section className={cn(wrap, "grid grid-cols-[1.1fr_0.9fr] items-center gap-14 py-[100px] max-[900px]:grid-cols-1 max-[560px]:py-16")}>
          <motion.div {...reveal()}>
            <Eyebrow>WHO WE ARE</Eyebrow>
            <h2 className="max-w-[580px] text-[clamp(30px,3.7vw,46px)] leading-[1.06] font-extrabold tracking-[-0.035em]">
              Guiding you through the complexities of your business journey.
            </h2>
            <div className="mt-6 grid gap-4 text-[15.5px] leading-[1.8] text-mute">
              <p>
                With a deep commitment to timely, seamless and proficient support, we guide and handhold our clients through the complexities of their business and organisational journey. Whether it is corporate consultancy on day-to-day or complex issues, regulatory compliance, business registrations and approvals, outsourcing, fundraising or capital structuring, we prioritise solutions aligned with your strategic and long-term goals.
              </p>
              <p>
                The platform is an initiative led by <b className="text-ink">Mr. Dev Kumar Panda</b>, with a vision to redefine the delivery of legal and business advisory services. By integrating technology with experienced professional expertise, Aeon gives founders, entrepreneurs and startups comprehensive legal, regulatory and business advisory support through a cost-effective, accessible and founder-centric approach. Our objective is to make high-quality professional advice and business support more accessible, without the complexity and cost structures traditionally associated with large firms.
              </p>
              <p>
                Our core team and professional partners specialise in financial services, regulatory matters and approvals, corporate laws, intellectual property, commercial transactions and other legal and finance services. Their working knowledge comes from decades with renowned corporates and independent professional practices, along with practical experience at the grass-root level.
              </p>
              <p>
                Our approach is founded on legal expertise, professional integrity and a steadfast commitment to protecting your interests while facilitating your objectives.
              </p>
            </div>
            <div className="mt-6 rounded-lg border-l-4 border-flame bg-[#fff4ec] px-5 py-4">
              <b className="block text-[16px] text-ink">Support doesn&apos;t mean charging for a chat.</b>
              <p className="mt-1 text-[14.5px] leading-[1.7] text-mute">
                We believe in providing proactive advisory and handholding, as a value integrator. For future-thinkers who are in for the long game, not just for now.
              </p>
            </div>
          </motion.div>
          <motion.div {...reveal(1)} className="relative">
            <div aria-hidden="true" className="absolute -inset-4 rounded-xl bg-[linear-gradient(135deg,#eaf3ff,#fff4d6)]" />
            <Image
              src="/illustrations/about-connected.jpg"
              alt="Illustration of connected teams and systems working as one"
              width={704}
              height={546}
              className="relative w-full rounded-lg border border-line bg-white object-contain shadow-[0_24px_60px_rgba(11,27,77,.12)]"
            />
          </motion.div>
        </section>

        {/* Mission */}
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#3f6df6,#0a44b8)] py-16 text-white max-[560px]:py-12">
          <div aria-hidden="true" className="absolute -right-24 -bottom-24 size-80 rounded-full bg-sun/25 blur-3xl" />
          <div className={cn(wrap, "relative grid grid-cols-[auto_1fr] items-center gap-8 max-[700px]:grid-cols-1")}>
            <span className="grid size-20 place-items-center rounded-lg bg-white/15">
              <Quote size={36} className="text-sun" />
            </span>
            <div>
              <Eyebrow className="text-sun">OUR MISSION</Eyebrow>
              <p className="max-w-[860px] text-[clamp(22px,2.6vw,32px)] leading-[1.3] font-extrabold tracking-[-0.02em]">
                We aim to elevate our clients&apos; service excellence and satisfaction through innovation, technology and teamwork.
              </p>
            </div>
          </div>
        </section>

        {/* Working process */}
        <section className="bg-pale py-[100px] max-[560px]:py-16">
          <div className={wrap}>
            <SectionHeading
              eyebrow="OUR WORKING PROCESS"
              title="Your Journey, Clearly Mapped Out."
              description="Plan • Protect • Grow. A seamless journey from your first interaction to continuous business support."
            />
            <ol className="mt-12 grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
              {workingProcess.map(([title, text], i) => (
                <motion.li
                  key={title}
                  {...reveal(i)}
                  className="relative overflow-hidden rounded-lg border border-line bg-white p-6 shadow-[0_10px_30px_rgba(11,27,77,.05)]"
                >
                  <span aria-hidden="true" className="absolute -top-3 right-4 text-[80px] leading-none font-black text-brand/[.07]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative text-[11px] font-black tracking-[.16em] text-brand">STEP {i + 1}</span>
                  <h3 className="relative mt-2 text-[18px] font-bold tracking-[-0.02em]">{title}</h3>
                  <p className="relative mt-2 text-[14px] leading-[1.65] text-mute">{text}</p>
                </motion.li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-ink px-6 py-5 text-white">
              <div>
                <b className="block text-[17px]">Continuous client relationship</b>
                <p className="mt-1 text-[14px] text-white/70">There is a process, but we are always just a call away.</p>
              </div>
              <Link href="/contact-us" className={btnYellow}>
                Talk to us <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section className={cn(wrap, "py-[100px] max-[560px]:py-16")}>
          <SectionHeading
            eyebrow="OUR EXPERTISE"
            title="What We Help With."
            description="Our team and professional partners bring practical experience across these areas."
          />
          <ul className="mt-10 grid grid-cols-3 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
            {expertise.map((e, i) => (
              <motion.li
                key={e}
                {...reveal(i % 6)}
                className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-4 text-[15px] font-bold transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_14px_30px_rgba(63,109,246,.1)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/aeon-bullet.png" alt="" aria-hidden="true" className="size-7 shrink-0" />
                {e}
              </motion.li>
            ))}
          </ul>
          <div className="mt-8">
            <Link href="/#services" className={btnBlue}>
              View all services <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Team */}
        <section className="bg-sky py-[100px] max-[560px]:py-16">
          <div className={wrap}>
            <SectionHeading
              eyebrow="OUR TEAM, OUR STRENGTH"
              title="The People Behind Aeon."
              description="Young, enthusiastic and highly motivated professionals, extensively experienced in their domains, providing a wide range of corporate and business advisory services to clients and their stakeholders."
            />
            <motion.article
              {...reveal()}
              className="mt-10 grid grid-cols-[260px_1fr] gap-8 rounded-xl bg-white p-8 shadow-[0_24px_60px_rgba(11,27,77,.08)] max-[800px]:grid-cols-1 max-[560px]:p-5"
            >
              <div>
                {/* Photo to be supplied by the client. */}
                <div className="grid aspect-[4/5] w-full place-items-center rounded-lg bg-[linear-gradient(160deg,#eaf3ff,#cfe5ff)] text-brand/50 max-[800px]:max-w-[260px]">
                  <UserRound size={96} strokeWidth={1.2} />
                </div>
                <b className="mt-4 block text-[20px] tracking-[-0.02em]">Dev Kumar Panda</b>
                <span className="text-[14px] font-semibold text-brand">Founder, Aeon Corporate</span>
                <p className="mt-1 text-[13px] text-mute">ACS · Commerce and law graduate</p>
              </div>
              <div className="grid content-start gap-4 text-[15px] leading-[1.8] text-mute">
                <p>
                  Mr. Dev Kumar Panda has over two decades of experience in corporate and commercial laws. He has worked with renowned corporates, where he led the legal, compliance and corporate secretarial function, before moving into practice. He has advised clients on business structuring, day-to-day corporate and commercial legal needs, labour law matters, drafting and negotiating commercial contracts, and intellectual property rights.
                </p>
                <p>
                  He is also involved in investment advisory, and has advised early-stage startups, growth-stage companies and private equity funds, including structuring and day-to-day legal support for a YC startup and investee group. He has worked on private equity and business transfer transactions from term sheet and due diligence through to drafting, negotiation and execution, and advises extensively on SEBI, IRDA and RBI regulations, foreign direct investment and overseas direct investment.
                </p>
                <p>
                  He specialises in corporate restructuring, including mergers, demergers, compromises and arrangements, reduction of capital, slump sales, minority squeeze-outs, family settlements and succession planning.
                </p>
              </div>
            </motion.article>
            <p className="mt-6 rounded-lg bg-white px-6 py-5 text-center text-[17px] font-extrabold tracking-[-0.01em]">
              …and <span className="text-brand">40+ professional experts</span> who make it happen for you!
            </p>
          </div>
        </section>

        {/* Presence */}
        <section className={cn(wrap, "grid grid-cols-[1fr_1fr] items-center gap-14 py-[100px] max-[900px]:grid-cols-1 max-[560px]:py-16")}>
          <motion.div {...reveal()}>
            <Eyebrow>ONLINE EASE, LOCAL REACH</Eyebrow>
            <h2 className="text-[clamp(28px,3.4vw,42px)] leading-[1.08] font-extrabold tracking-[-0.03em]">
              Technology with a personal touch, across India.
            </h2>
            <p className="mt-5 text-[15.5px] leading-[1.8] text-mute">
              We combine technology with a personalised human approach to deliver business and professional services across India and select international jurisdictions. Our in-house team works with a network of independent professionals with deep domain expertise in more than 15 cities and towns, so services stay responsive, efficient and locally informed across India&apos;s key business and commercial centres.
            </p>
            <Image
              src="/illustrations/online-ease-local-reach.jpg"
              alt="Online ease, local reach: digital convenience, expert team, pan-India presence and personalised service"
              width={650}
              height={366}
              className="mt-6 w-full rounded-lg border border-line shadow-[0_18px_44px_rgba(11,27,77,.1)]"
            />
          </motion.div>
          <motion.div {...reveal(1)}>
            <b className="text-[12px] font-black tracking-[.16em] text-brand">OUR PRESENCE</b>
            <ul className="mt-4 grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
              {cities.map((c) => (
                <li key={c} className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-4 font-bold">
                  <span className="grid size-10 place-items-center rounded-md bg-pale text-brand">
                    <MapPin size={19} />
                  </span>
                  {c}
                </li>
              ))}
              <li className="flex items-center gap-3 rounded-lg bg-ink px-4 py-4 font-bold text-white">
                <span className="grid size-10 place-items-center rounded-md bg-white/10 text-sun">
                  <ColorIcon name="network" size={22} />
                </span>
                15+ cities & towns
              </li>
            </ul>
            <b className="mt-7 block text-[12px] font-black tracking-[.16em] text-brand">QUICK ENQUIRIES</b>
            <div className="mt-4 grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
              <a href={`tel:+${contactInfo.phone}`} className="flex items-center gap-3 rounded-lg bg-pale px-4 py-4 text-[14px] font-bold hover:text-brand">
                <Phone size={18} className="shrink-0 text-brand" /> {contactInfo.phoneDisplay}
              </a>
              <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg bg-pale px-4 py-4 text-[14px] font-bold hover:text-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/whatsapp.png" alt="" className="size-[18px] shrink-0" /> WhatsApp us
              </a>
              <a href="mailto:support@aeoncorporate.com" className="flex items-center gap-3 rounded-lg bg-pale px-4 py-4 text-[14px] font-bold hover:text-brand">
                <Mail size={18} className="shrink-0 text-brand" /> support@aeoncorporate.com
              </a>
              <span className="flex items-center gap-3 rounded-lg bg-pale px-4 py-4 text-[14px] font-bold">
                <Clock size={18} className="shrink-0 text-brand" /> We reply within 24 hours
              </span>
            </div>
          </motion.div>
        </section>

        {/* The Aeon difference */}
        <section className="relative overflow-hidden bg-ink py-[100px] text-white max-[560px]:py-16">
          <div aria-hidden="true" className="absolute -top-24 left-1/3 size-96 rounded-full bg-brand/30 blur-[120px]" />
          <div className={cn(wrap, "relative grid grid-cols-[0.9fr_1.1fr] gap-14 max-[900px]:grid-cols-1")}>
            <div>
              <Eyebrow className="text-sun">THE AEON DIFFERENCE</Eyebrow>
              <h2 className="text-[clamp(30px,3.7vw,48px)] leading-[1.06] font-extrabold tracking-[-0.035em]">
                Beyond Advice. Building Business Confidence.
              </h2>
              <Link href="/contact-us" className={cn(btnYellow, "mt-8")}>
                Start a conversation <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid gap-4 text-[15.5px] leading-[1.8] text-white/75">
              <p>
                At Aeon, we believe that exceptional advisory goes beyond providing answers. It is about creating clarity, enabling informed decisions and delivering meaningful outcomes.
              </p>
              <p>
                We bring together multidisciplinary domain expertise and industry insight with a practical understanding of business realities, gained through our teams&apos; extensive corporate experience, to deliver solutions that are relevant, responsive and result-oriented.
              </p>
              <p>
                From setting up a business to navigating regulatory requirements, managing compliance and facilitating strategic growth, we partner with our clients at every stage of their journey. Our approach is built on professional excellence, personalised attention, proactive support and an unwavering commitment to delivering value.
              </p>
              <p className="text-[17px] font-bold text-white">
                With Aeon, you gain more than an advisor. You gain a partner invested in your progress.
              </p>
            </div>
          </div>
          <ul className={cn(wrap, "relative mt-14 grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1")}>
            {values.map(({ icon: Icon, title, text }, i) => (
              <motion.li key={title} {...reveal(i)} className="rounded-lg border border-white/10 bg-white/[.06] p-6">
                <span className="grid size-11 place-items-center rounded-md bg-white/10 text-sun">
                  <Icon size={22} />
                </span>
                <b className="mt-4 block text-[18px]">{title}</b>
                <p className="mt-1 text-[14px] text-white/65">{text}</p>
              </motion.li>
            ))}
          </ul>
        </section>
      </main>
    </MotionConfig>
  )
}
