import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight, BadgeCheck, Check, ChevronRight, ClipboardCheck, FileSearch, Headphones,
  Lock, Mail, Phone, ShieldCheck, UserRoundCheck,
} from "lucide-react"
import { db } from "@/lib/db"
import { JsonLd } from "@/components/site/json-ld"
import { LeadForm, type LeadField } from "@/components/site/lead-form"
import { SectionNav } from "@/components/site/section-nav"
import { StepsDialog } from "@/components/site/steps-dialog"
import { Eyebrow, btnBlue, btnYellow } from "@/components/site/ui"
import { RichContent } from "@/components/editor/rich-content"
import { SITE_URL, breadcrumbLd, pageMetadata } from "@/lib/seo"
import { autoSeoDescription, autoSeoTitle } from "@/lib/seo-auto"
import { readFaqs, readSections, sectionLook } from "@/lib/services"
import { iconFor } from "@/lib/icons"
import { STATES } from "@/lib/states"

// Pages are built on first visit and refreshed when saved in the admin panel.
export const revalidate = 300

export async function generateStaticParams() {
  return []
}

async function load(slug: string) {
  if (!process.env.DATABASE_URL) return null
  try {
    const s = await db.service.findUnique({ where: { slug } })
    return s?.isPublished ? s : null
  } catch (error) {
    console.error("[service page]", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = await load((await params).slug)
  if (!s) return { title: "Page not found", robots: { index: false } }
  const hasContent = readSections(s.sections).some((x) => x.html.trim() !== "")
  // Written by a person: use their SEO text when filled in. Otherwise (or for starter pages)
  // the title and description are made automatically from the page name.
  const own = !s.autoContent
  const title = (own && s.seoTitle.trim()) || autoSeoTitle(s.title)
  const description = (own && s.seoDescription.trim()) || autoSeoDescription(s.title, own ? s.summary : undefined)
  return {
    ...pageMetadata({
      title,
      description,
      path: `/services/${s.slug}`,
      // Without a picture of its own, the page uses the generated share image (opengraph-image).
      image: s.heroImageUrl ?? null,
      keywords: [s.title, `${s.title} India`, s.category, "Aeon Corporate"].filter(Boolean),
    }),
    ...(hasContent ? {} : { robots: { index: false, follow: true } }),
  }
}

const fields: LeadField[] = [
  { name: "name", label: "Full name", required: true, autoComplete: "name", placeholder: "Your name" },
  { name: "email", label: "Email ID", type: "email", required: true, autoComplete: "email", placeholder: "you@example.com" },
  { name: "phone", label: "Mobile number", type: "tel", required: true, autoComplete: "tel", placeholder: "10-digit mobile number" },
  { name: "state", label: "State", type: "select", required: true, options: STATES },
  { name: "city", label: "City", autoComplete: "address-level2", placeholder: "Your city" },
  { name: "callTime", label: "Best time to call", type: "select", options: ["Morning (9 am - 12 pm)", "Afternoon (12 pm - 4 pm)", "Evening (4 pm - 7 pm)", "Any time"], placeholder: "Select a time" },
  { name: "message", label: "Your requirement", type: "textarea", placeholder: "Tell us briefly what you need (optional)" },
]

const trust = [
  { icon: UserRoundCheck, text: "Guided by experts" },
  { icon: FileSearch, text: "Document review" },
  { icon: BadgeCheck, text: "End-to-end follow-up" },
]

const how = [
  { icon: Headphones, title: "Tell us your need", text: "Share a few details in the form." },
  { icon: FileSearch, title: "Expert review", text: "We check eligibility and documents." },
  { icon: ClipboardCheck, title: "We prepare and file", text: "Application and paperwork handled." },
  { icon: BadgeCheck, title: "Follow-up", text: "We stay with you until it is done." },
]


function Cta({ title }: { title: string }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[20px] bg-[linear-gradient(135deg,#0b1b4d,#16327f)] px-6 py-6 text-white max-[560px]:px-5">
      <div className="min-w-0">
        <b className="block text-[18px] tracking-[-0.02em]">{title}</b>
        <p className="mt-1 text-[13px] text-white/70">Share a few details and our team will get back to you.</p>
      </div>
      <Link href="#enquire" className={btnYellow}>
        Request a call back <ArrowRight size={15} />
      </Link>
    </div>
  )
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = await load((await params).slug)
  if (!s) notFound()
  const sections = readSections(s.sections).filter((x) => x.html.trim() !== "")
  const faqs = readFaqs(s.faqs)
  const processHtml = sections.find((x) => x.key === "process")?.html ?? ""
  const url = `${SITE_URL}/services/${s.slug}`

  let similar: { slug: string; title: string }[] = []
  try {
    similar = await db.service.findMany({
      where: { isPublished: true, category: s.category, NOT: { id: s.id } },
      select: { slug: true, title: true },
      orderBy: { title: "asc" },
      take: 12,
    })
  } catch {}

  const tabs = [
    ...sections.map((x) => ({ id: x.key, title: sectionLook(x).title })),
    ...(faqs.length ? [{ id: "faq", title: "FAQs" }] : []),
  ]

  return (
    <main id="top" className="overflow-x-clip pt-[142px] pb-28 max-[1024px]:pt-[106px] max-[560px]:pt-[88px]">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: s.title, path: `/services/${s.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            description: s.summary || undefined,
            url,
            provider: { "@type": "Organization", name: "Aeon Corporate", url: SITE_URL },
            areaServed: "IN",
          },
          ...(faqs.length
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                },
              ]
            : []),
        ]}
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: title + what is included, with the enquiry form beside it */}
        <header className="relative grid grid-cols-[minmax(0,1fr)_600px] items-center gap-10 max-[1280px]:grid-cols-[minmax(0,1fr)_520px] overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#eaf3ff,#cfe5ff_60%,#dcebff)] p-10 max-[1100px]:grid-cols-[minmax(0,1fr)] max-[900px]:gap-8 max-[900px]:p-6 max-[560px]:rounded-[24px] max-[560px]:p-5">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-20 size-72 rounded-full bg-white/50 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -bottom-24 size-72 rounded-full bg-sun/25 blur-3xl" />
          <div className="relative min-w-0">
            <nav aria-label="Breadcrumb" className="mb-5 flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-[13px] font-semibold text-mute">
              <Link href="/" className="hover:text-brand">Home</Link>
              <ChevronRight size={14} className="shrink-0 text-brand/50" />
              <span className="min-w-0 truncate text-brand" aria-current="page">{s.title}</span>
            </nav>
            {s.icon && (
              <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-white text-brand shadow-[0_10px_24px_rgba(11,27,77,.12)] ring-1 ring-line">
                {(() => { const PageIcon = iconFor(s.icon); return <PageIcon size={28} /> })()}
              </span>
            )}
            {s.category && <Eyebrow>{s.category.toUpperCase()}</Eyebrow>}
            <h1 className="text-[clamp(28px,3.6vw,46px)] leading-[1.08] font-extrabold tracking-[-0.04em] [overflow-wrap:anywhere]">{s.title}</h1>
            {s.summary && <p className="mt-4 text-[16px] leading-[1.75] text-mute max-[560px]:text-[15px]">{s.summary}</p>}
            {s.highlights.length > 0 && (
              <div className="mt-6 rounded-[22px] bg-white/80 p-5 shadow-[0_10px_30px_rgba(11,27,77,.06)] ring-1 ring-white">
                <b className="flex items-center gap-2 text-[14px] text-brand"><ShieldCheck size={18} /> What is included</b>
                <ul className="mt-3 grid grid-cols-2 gap-2.5 max-[640px]:grid-cols-1">
                  {s.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-[14px] leading-[1.4] font-semibold text-ink/90 ring-1 ring-line">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-white"><Check size={15} strokeWidth={3} /></span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ul className="mt-5 flex flex-wrap gap-2">
              {trust.map(({ icon: TI, text }) => (
                <li key={text} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-2 text-[13px] font-bold text-ink/80 ring-1 ring-white">
                  <TI size={16} className="text-brand" /> {text}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3 max-[560px]:grid max-[560px]:grid-cols-1">
              <Link href="#enquire" className={`${btnBlue} max-[560px]:w-full`}>
                Schedule a call <ArrowRight size={16} />
              </Link>
              {processHtml && <StepsDialog title={s.title} html={processHtml} className="max-[560px]:w-full" />}
            </div>
          </div>

          <aside id="enquire" className="relative scroll-mt-28 overflow-hidden rounded-[26px] border border-white bg-white shadow-[0_22px_54px_rgba(11,27,77,.16)]">
            <div className="relative bg-[linear-gradient(135deg,#1b5fd9,#0a44b8)] px-6 py-5 text-white max-[560px]:px-5">
              <div aria-hidden="true" className="absolute -top-10 -right-10 size-32 rounded-full border border-white/20" />
              <span className="mb-2 grid size-10 place-items-center rounded-xl bg-white/15"><Headphones size={20} /></span>
              <b className="block text-[19px] tracking-[-0.02em]">Get free expert consultation</b>
              <p className="mt-1 text-[13px] text-white/80 [overflow-wrap:anywhere]">About {s.title}</p>
            </div>
            <div className="p-6 max-[560px]:p-5">
            <LeadForm
              fields={fields}
              kind="contact"
              marketing
              extra={{ service: s.title }}
              submitLabel="Get started"
              successTitle="Thanks, we got your request"
              successText="Our team will contact you shortly."
            />
            <p className="mt-4 flex items-start gap-2 text-[12px] leading-[1.6] text-mute">
              <Lock size={14} className="mt-0.5 shrink-0 text-brand" />
              <span>Your details are used only to reply to this request. See our <Link href="/privacy-policy" className="font-bold text-brand">Privacy Policy</Link>.</span>
            </p>
            </div>
          </aside>
        </header>

        <ol className="mt-6 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
          {how.map(({ icon: HI, title, text }, i) => (
            <li key={title} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_8px_24px_rgba(11,27,77,.04)]">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-pale text-brand"><HI size={22} /></span>
              <div className="min-w-0">
                <span className="text-[11px] font-black tracking-[.12em] text-brand">STEP {i + 1}</span>
                <b className="block text-[14.5px] leading-snug">{title}</b>
                <p className="mt-0.5 text-[12.5px] leading-[1.5] text-mute">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Content: section list beside it on large screens, a sticky bar on small ones */}
        <div className="mt-8 grid grid-cols-[250px_1fr] items-start gap-8 max-[1024px]:grid-cols-[minmax(0,1fr)] max-[1024px]:gap-5">
          {tabs.length > 1 ? <SectionNav tabs={tabs} /> : <span />}

          <div className="min-w-0">
            {sections.length === 0 && (
              <p className="rounded-2xl bg-pale p-6 text-[15px] text-mute">Details for this service are coming soon. Please request a call back and we will guide you.</p>
            )}

            <div className="grid gap-5" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
              {sections.map((sec, i) => {
                const look = sectionLook(sec)
                const Icon = iconFor(look.icon)
                return (
                  <section key={sec.key} id={sec.key} className="relative scroll-mt-40 overflow-hidden rounded-[24px] border border-line bg-white p-7 pl-8 shadow-[0_10px_30px_rgba(11,27,77,.05)] max-[560px]:rounded-[20px] max-[560px]:p-5 max-[560px]:pl-6">
                    <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[linear-gradient(to_bottom,#1b5fd9,#ffd93d)]" />
                    <span aria-hidden="true" className="pointer-events-none absolute -top-3 right-5 text-[84px] leading-none font-black text-brand/[.06] select-none">{String(i + 1).padStart(2, "0")}</span>
                    <div className="relative mb-5 flex flex-wrap items-center gap-3 border-b border-line pb-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#eaf3ff,#cfe5ff)] text-brand ring-1 ring-white"><Icon size={24} /></span>
                      <h2 className="min-w-0 flex-1 text-[22px] font-extrabold tracking-[-0.03em] max-[560px]:text-[20px]">{look.title}</h2>
                      {sec.key === "process" && <StepsDialog title={s.title} html={sec.html} className="h-10 px-4">Open as pop-up</StepsDialog>}
                    </div>
                    {sec.key === "overview" && s.heroImageUrl ? (
                      <div className="grid grid-cols-[1fr_280px] items-start gap-6 max-[900px]:grid-cols-1">
                        <RichContent html={sec.html} className="text-[15.5px]" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.heroImageUrl} alt="" className="w-full rounded-[18px] border border-line object-cover" />
                      </div>
                    ) : (
                      <RichContent html={sec.html} className="text-[15.5px]" />
                    )}
                    {(sec.key === "advantages" || sec.key === "documents") && i < sections.length - 1 && (
                      <Cta title={`Start ${s.title} with Aeon`} />
                    )}
                  </section>
                )
              })}

              {faqs.length > 0 && (
                <section id="faq" className="scroll-mt-40 rounded-[24px] border border-line bg-white p-7 max-[560px]:rounded-[20px] max-[560px]:p-5" aria-labelledby="faq-title">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#eaf3ff,#cfe5ff)] text-brand ring-1 ring-white"><Phone size={24} /></span>
                    <h2 id="faq-title" className="text-[22px] font-extrabold tracking-[-0.03em] max-[560px]:text-[20px]">Frequently asked questions</h2>
                  </div>
                  <div className="grid gap-2.5">
                    {faqs.map((f, i) => (
                      <details key={i} className="group rounded-2xl border border-line bg-[#f8fbff] px-4 py-3.5">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
                          <span className="min-w-0">{f.q}</span>
                          <ChevronRight size={18} className="shrink-0 text-mute transition-transform group-open:rotate-90" />
                        </summary>
                        <p className="mt-3 text-[14px] leading-[1.8] whitespace-pre-line text-mute">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {similar.length > 0 && (
              <section className="mt-10" aria-labelledby="similar">
                <h2 id="similar" className="text-[20px] font-extrabold tracking-[-0.02em]">Other services in {s.category}</h2>
                <ul className="mt-4 grid grid-cols-3 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
                  {similar.map((x) => (
                    <li key={x.slug}>
                      <Link href={`/services/${x.slug}`} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-white px-4 py-3 text-[14px] font-semibold transition hover:border-brand hover:text-brand">
                        <span className="min-w-0 truncate">{x.title}</span>
                        <ArrowRight size={15} className="shrink-0 text-brand" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-10 grid grid-cols-[1fr_auto] items-center gap-4 rounded-[22px] bg-[linear-gradient(135deg,#0b1b4d,#16327f)] p-6 text-white max-[700px]:grid-cols-1">
              <div>
                <b className="block text-[19px] tracking-[-0.02em]">Still have questions about {s.title}?</b>
                <p className="mt-1 text-[14px] text-white/70">Talk to our team. We will explain the process in simple words.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="#enquire" className={btnYellow}>Request a call back <ArrowRight size={15} /></Link>
                <Link href="mailto:hello@aeoncorporate.com" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 px-5 text-[14px] font-bold hover:bg-white/10"><Mail size={16} /> Email us</Link>
              </div>
            </div>

            <p className="mt-6 rounded-2xl bg-pale p-4 text-[12px] leading-[1.7] text-mute">
              Aeon Corporate is a private advisory and facilitation service and is not affiliated with any government body. This page is general information, not legal advice. Fees, timelines and outcomes depend on the case and on the relevant authorities.
            </p>
          </div>
        </div>
      </div>

      {/* Small screens: always-visible call-back button */}
      <div data-bottom-bar className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 backdrop-blur min-[1025px]:hidden">
        <Link href="#enquire" className={`${btnBlue} w-full`}>
          Request a call back <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  )
}
