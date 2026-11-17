import type { Metadata } from "next"
import Link from "next/link"
import { AeBullet } from "@/components/site/ae-bullet"
import { notFound } from "next/navigation"
import {
  ArrowRight, BadgeCheck, Check, ChevronRight, ClipboardCheck, FileSearch, Headphones,
  Lock, Mail, Phone, ShieldCheck, UserRoundCheck,
} from "lucide-react"
import { db } from "@/lib/db"
import { getMenu } from "@/lib/menu"
import { JsonLd } from "@/components/site/json-ld"
import { LeadForm, type LeadField } from "@/components/site/lead-form"
import { SectionNav } from "@/components/site/section-nav"
import { StepsDialog } from "@/components/site/steps-dialog"
import { splitList } from "@/lib/section-items"
import { BarChart3, Clock, FileText, Globe2, Handshake, Landmark, Scale, Search, SlidersHorizontal, Sparkles, Users, Zap, type LucideIcon } from "lucide-react"
import { ColorIcon, Eyebrow, btnBlue, btnYellow } from "@/components/site/ui"
import { RichContent } from "@/components/editor/rich-content"
import { SITE_URL, breadcrumbLd, pageMetadata } from "@/lib/seo"
import { autoSeoDescription, autoSeoTitle } from "@/lib/seo-auto"
import { readFaqs, readSections, sectionLook } from "@/lib/services"
import { iconFor } from "@/lib/icons"

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
  { name: "phone", label: "Mobile number", type: "tel", required: true, autoComplete: "tel", placeholder: "10-digit mobile number" },
  { name: "email", label: "Email ID", type: "email", required: true, autoComplete: "email", placeholder: "you@example.com", full: true },
  { name: "message", label: "Your requirement", type: "textarea", rows: 2, placeholder: "Tell us briefly what you need (optional)", full: true },
]

/** Coloured icons (public/icons) for the "What is included" cards, chosen by what the line says. */
function includedIcon(text: string, i: number) {
  const t = text.toLowerCase()
  if (/eligib|check|assess|search|class/.test(t)) return "svc-eligibility"
  if (/review|document|verify/.test(t)) return "svc-review"
  if (/filing|file|application|prepar|regist/.test(t)) return "svc-registration"
  if (/follow|complete|support|track|monitor/.test(t)) return "svc-approval"
  return ["svc-eligibility", "svc-review", "svc-registration", "svc-approval"][i % 4]
}

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


const CARD_ICONS: [RegExp, LucideIcon][] = [
  [/legal|law|precis|rights|court|dispute|regulat/i, Scale],
  [/digital|technolog|speed|online|convenien/i, Zap],
  [/end-to-end|support|assist|partner|guidance|hand/i, Handshake],
  [/custom|tailor|personal|bespoke/i, SlidersHorizontal],
  [/secur|protect|safeguard|risk|complian/i, ShieldCheck],
  [/document|draft|agreement|deed|memorand|policy/i, FileText],
  [/review|diligence|assess|audit|examin|evaluat/i, Search],
  [/regist|authority|registrar|licen|filing|sebi|irdai|incorporat/i, Landmark],
  [/financ|account|tax|valuation|fund|capital|loan|invest|budget/i, BarChart3],
  [/global|cross|foreign|international|india entry|ifsc/i, Globe2],
  [/team|people|employee|shareholder|investor|member/i, Users],
  [/time|timeline|clarity|tomorrow|today|lifecycle/i, Clock],
]
const FALLBACK_ICONS: LucideIcon[] = [ClipboardCheck, FileText, ShieldCheck, Scale, Landmark, BarChart3, Handshake, Search, Sparkles, Users, Globe2, Clock, Zap, SlidersHorizontal]
/** A fitting icon per card; one icon is never used twice in the same list. */
function pickIcons(titles: string[]): LucideIcon[] {
  const used = new Set<LucideIcon>()
  return titles.map((t, i) => {
    const hit = CARD_ICONS.map(([re, ic]) => (re.test(t) ? ic : null)).filter((x): x is LucideIcon => !!x).find((x) => !used.has(x))
    const pick = hit ?? FALLBACK_ICONS.find((x, k) => !used.has(x) && k >= i % 4) ?? FALLBACK_ICONS.find((x) => !used.has(x)) ?? FALLBACK_ICONS[i % FALLBACK_ICONS.length]
    used.add(pick)
    return pick
  })
}

function VISUAL(group: string, top: string, category: string) {
  const g = `${group} ${top} ${category}`
  if (/aif|fund/i.test(g)) return "aif"
  if (/sebi|irda/i.test(g)) return "regulatory"
  if (/foreign|india entry|gift|cross/i.test(g)) return "global"
  if (/finance advisory/i.test(g)) return "advisory"
  if (/startup/i.test(top) || /startup/i.test(g)) return "startup"
  if (/corporate laws|secretarial/i.test(g)) return "corporate"
  if (/finance|account|cfo|tax/i.test(g)) return "finance"
  return "legal"
}

function Cards({ items, cols = 3 }: { items: { title: string; text: string }[]; cols?: 2 | 3 }) {
  const icons = pickIcons(items.map((x) => x.title))
  return (
    <ul className={`mt-5 grid gap-3.5 max-[640px]:grid-cols-1 ${cols === 2 ? "grid-cols-2" : "grid-cols-3 max-[1180px]:grid-cols-2"}`}>
      {items.map((it, i) => {
        const Icon = icons[i]
        return (
          <li key={it.title + i} className="group rounded-xl border border-line bg-[#fbfdff] p-4 transition hover:-translate-y-0.5 hover:border-brand/30 hover:bg-white hover:shadow-[0_14px_30px_rgba(2,72,169,.1)]">
            <span className="grid size-10 place-items-center rounded-lg bg-[#eaf2ff] text-brand transition group-hover:bg-brand group-hover:text-white"><Icon size={20} strokeWidth={1.8} /></span>
            <b className="mt-3 block text-[15px] leading-snug text-ink [overflow-wrap:anywhere]">{it.title}</b>
            {it.text && <p className="mt-1.5 text-[13.5px] leading-[1.65] text-mute">{it.text}</p>}
          </li>
        )
      })}
    </ul>
  )
}

function Flow({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="mt-6 grid gap-4 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1 min-[1025px]:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ "--n": Math.min(items.length, 5) } as React.CSSProperties}>
      {items.map((it, i) => (
        <li key={it.title + i} className="relative rounded-xl border border-line bg-white p-4 pt-6 shadow-[0_8px_22px_rgba(11,27,77,.05)]">
          <span className="absolute -top-3.5 left-4 grid size-8 place-items-center rounded-full bg-[linear-gradient(135deg,#0248A9,#FD6902)] text-[13px] font-black text-white shadow-[0_6px_14px_rgba(2,72,169,.3)]">{i + 1}</span>
          {i < items.length - 1 && <span aria-hidden="true" className="absolute top-0 -right-[17px] z-10 hidden h-px w-[17px] translate-y-0 bg-transparent min-[1025px]:block" />}
          <b className="block text-[14.5px] leading-snug text-ink [overflow-wrap:anywhere]">{it.title}</b>
          {it.text && <p className="mt-1.5 text-[13px] leading-[1.6] text-mute">{it.text}</p>}
        </li>
      ))}
    </ol>
  )
}

function Cta({ title }: { title: string }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-[linear-gradient(135deg,#0b1b4d,#16327f)] px-6 py-6 text-white max-[560px]:px-5">
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
  const all = readSections(s.sections).filter((x) => x.html.trim() !== "")
  const heroHtml = all.find((x) => x.key === "hero")?.html ?? ""
  const ctaHtml = all.find((x) => x.key === "cta")?.html ?? ""
  const sections = all.filter((x) => x.key !== "hero" && x.key !== "cta")
  const heroLines = [...heroHtml.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1])
  const faqs = readFaqs(s.faqs)
  const processHtml = sections.find((x) => x.key === "process")?.html ?? ""
  const url = `${SITE_URL}/services/${s.slug}`
  const heroBtns = (all.find((x) => x.key === "hero")?.title ?? "").split("|").map((x) => x.trim()).filter(Boolean)
  const ctaBtns = (all.find((x) => x.key === "cta")?.title ?? "").split("|").map((x) => x.trim()).filter(Boolean)
  const sectionsHaveCards = sections.some((x) => x.key === "services")

  // Path shown above the title: Home > menu > category > service (from the admin-edited menu).
  const menu = await getMenu()
  const here = `/services/${s.slug}`
  let trail: { label: string; href: string }[] = []
  for (const t of menu) {
    const c = t.categories.find((x) => x.links.some((l) => l.href === here))
    if (c) {
      trail = [
        { label: t.label, href: t.href || t.categories[0]?.links[0]?.href || "/" },
        { label: c.label, href: c.href || c.links[0]?.href || "/" },
      ]
      break
    }
  }

  const visual = VISUAL(trail[1]?.label ?? "", trail[0]?.label ?? "", s.category)

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
    <main id="top" className="overflow-x-clip pt-[100px] pb-28 min-[1025px]:pt-[140px] max-[1024px]:pt-[110px] max-[560px]:pt-[92px]">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            ...trail.map((t) => ({ name: t.label, path: t.href })),
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
        <header className="relative grid grid-cols-[minmax(0,1fr)_500px] items-center gap-8 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#eaf3ff,#cfe5ff_60%,#dcebff)] p-6 max-[1100px]:grid-cols-[minmax(0,1fr)] max-[900px]:p-6 max-[560px]:rounded-xl max-[560px]:p-5">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-20 size-72 rounded-full bg-white/50 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -bottom-24 size-72 rounded-full bg-sun/25 blur-3xl" />
          <div className="relative min-w-0">
            <nav aria-label="Breadcrumb" className="mb-3 flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-[12.5px] font-semibold text-mute">
              <Link href="/" className="hover:text-brand">Home</Link>
              <ChevronRight size={14} className="shrink-0 text-brand/50" />
              {trail.map((t) => (
                <span key={t.label} className="contents">
                  <Link href={t.href} className="hover:text-brand">{t.label}</Link>
                  <ChevronRight size={14} className="shrink-0 text-brand/50" />
                </span>
              ))}
              <span className="min-w-0 truncate text-brand" aria-current="page">{s.title}</span>
            </nav>
            <div className="flex items-center gap-3">
              {s.icon && (
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-white text-brand shadow-[0_8px_20px_rgba(11,27,77,.12)] ring-1 ring-line">
                  {(() => { const PageIcon = iconFor(s.icon); return <PageIcon size={22} /> })()}
                </span>
              )}
              {s.category && <Eyebrow className="mb-0">{s.category.toUpperCase()}</Eyebrow>}
            </div>
            <h1 className="mt-3 text-[clamp(26px,3.2vw,40px)] leading-[1.08] font-extrabold tracking-[-0.04em] [overflow-wrap:anywhere] text-brand">{s.title}</h1>
            {heroLines[0] && <p className="mt-3 text-[clamp(17px,1.7vw,21px)] leading-snug font-extrabold tracking-[-0.02em] text-sun [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: heroLines[0] }} />}
            {s.summary && <p className="mt-3 line-clamp-4 text-[15px] leading-[1.65] text-mute max-[560px]:line-clamp-6">{s.summary}</p>}
            {s.highlights.length > 0 && (
              <ul className="mt-5 grid grid-cols-2 gap-2.5 max-[640px]:grid-cols-1">
                {s.highlights.slice(0, 4).map((h, i) => (
                  <li key={h} className="flex items-center gap-3 rounded-lg bg-white/85 p-2.5 pr-3 text-[13.5px] leading-[1.35] font-bold text-ink/90 shadow-[0_6px_18px_rgba(11,27,77,.05)] ring-1 ring-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <ColorIcon name={includedIcon(h, i)} size={40} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5 flex flex-wrap gap-3 max-[560px]:grid max-[560px]:grid-cols-1">
              <Link href="#enquire" className={`${btnBlue} max-[560px]:w-full`}>
                {heroBtns[0] ?? "Schedule a call"} <ArrowRight size={16} />
              </Link>
              {processHtml && <StepsDialog title={s.title} html={processHtml} className="max-[560px]:w-full" />}
            </div>
          </div>

          <aside id="enquire" className="relative scroll-mt-28 overflow-hidden rounded-xl border border-white bg-white shadow-[0_22px_54px_rgba(11,27,77,.16)]">
            <div className="relative flex items-center gap-3 bg-[linear-gradient(135deg,#0248A9,#0a44b8)] px-5 py-3.5 text-white">
              <div aria-hidden="true" className="absolute -top-10 -right-10 size-32 rounded-full border border-white/20" />
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <ColorIcon name="svc-support" size={30} />
              </span>
              <div className="min-w-0">
                <b className="block text-[17px] leading-tight tracking-[-0.02em]">Get free expert consultation</b>
                <p className="mt-0.5 truncate text-[12.5px] text-white/80">About {s.title}</p>
              </div>
            </div>
            <div className="p-5 max-[560px]:p-4">
            <LeadForm
              fields={fields}
              kind="contact"
              extra={{ service: s.title }}
              className="gap-3"
              submitLabel="Get started"
              successTitle="Thanks, we got your request"
              successText="Our team will contact you shortly."
            />
            </div>
          </aside>
        </header>

        <ol className="mt-6 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
          {how.map(({ icon: HI, title, text }, i) => (
            <li key={title} className="flex items-start gap-3 rounded-lg border border-line bg-white p-4 shadow-[0_8px_24px_rgba(11,27,77,.04)]">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-pale text-brand"><HI size={22} /></span>
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
              <p className="rounded-lg bg-pale p-6 text-[15px] text-mute">Details for this service are coming soon. Please request a call back and we will guide you.</p>
            )}

            <div className="grid gap-5" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
              {sections.map((sec, i) => {
                const look = sectionLook(sec)
                const Icon = iconFor(look.icon)
                return (
                  <section key={sec.key} id={sec.key} className="relative scroll-mt-40 overflow-hidden rounded-xl border border-line bg-white p-7 pl-8 shadow-[0_10px_30px_rgba(11,27,77,.05)] max-[560px]:rounded-lg max-[560px]:p-5 max-[560px]:pl-6">
                    <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[linear-gradient(to_bottom,#0248A9,#FD6902)]" />
                    <span aria-hidden="true" className="pointer-events-none absolute -top-3 right-5 text-[84px] leading-none font-black text-brand/[.06] select-none">{String(i + 1).padStart(2, "0")}</span>
                    <div className="relative mb-5 flex flex-wrap items-center gap-3 border-b border-line pb-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[linear-gradient(135deg,#eaf3ff,#cfe5ff)] text-brand ring-1 ring-white"><Icon size={24} /></span>
                      <h2 className="min-w-0 flex-1 text-[22px] font-extrabold tracking-[-0.03em] max-[560px]:text-[20px]">{look.title}</h2>
                      {sec.key === "process" && <StepsDialog title={s.title} html={sec.html} className="h-10 px-4 max-[560px]:order-last max-[560px]:w-full">Open as pop-up</StepsDialog>}
                    </div>
                    {sec.key === "overview" && (s.heroImageUrl || sectionsHaveCards) ? (
                      <div className="grid grid-cols-[1fr_300px] items-start gap-6 max-[900px]:grid-cols-1">
                        <RichContent html={sec.html} className="text-[15.5px]" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.heroImageUrl || `/photos/svc/${visual}.jpg`} alt="" loading="lazy" className="w-full rounded-lg border border-line object-cover" />
                      </div>
                    ) : (() => {
                      const sp = (sec.key === "services" || sec.key === "why-us" || sec.key === "process") ? splitList(sec.html, sec.key === "why-us" ? 2 : 3) : null
                      if (!sp) return <RichContent html={sec.html} className="text-[15.5px]" />
                      return (
                        <>
                          {sp.before && <RichContent html={sp.before} className="text-[15.5px]" />}
                          {sec.key === "process" ? <Flow items={sp.items} /> : <Cards items={sp.items} cols={sec.key === "why-us" ? 2 : 3} />}
                          {sp.after && <RichContent html={sp.after} className="mt-5 text-[15.5px]" />}
                        </>
                      )
                    })()}
                    {(sec.key === "advantages" || sec.key === "documents") && i < sections.length - 1 && (
                      <Cta title={`Start ${s.title} with Aeon`} />
                    )}
                  </section>
                )
              })}

              {faqs.length > 0 && (
                <section id="faq" className="scroll-mt-40 rounded-xl border border-line bg-white p-7 max-[560px]:rounded-lg max-[560px]:p-5" aria-labelledby="faq-title">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[linear-gradient(135deg,#eaf3ff,#cfe5ff)] text-brand ring-1 ring-white"><Phone size={24} /></span>
                    <h2 id="faq-title" className="text-[22px] font-extrabold tracking-[-0.03em] max-[560px]:text-[20px]">Frequently asked questions</h2>
                  </div>
                  <div className="grid gap-2.5">
                    {faqs.map((f, i) => (
                      <details key={i} className="group rounded-lg border border-line bg-[#f8fbff] px-4 py-3.5">
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

            {ctaHtml && (
              <section className="mt-5 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#0b1b4d,#0248A9)] p-7 text-white max-[560px]:p-5">
                <RichContent html={ctaHtml} className="text-[15px] text-white/85 [&_h1]:text-white [&_h2]:text-white [&_h3]:mt-0 [&_h3]:text-[clamp(22px,2.4vw,30px)] [&_h3]:leading-tight [&_h3]:!text-white [&_h4]:!text-white [&_p:nth-of-type(1)]:text-[18px] [&_p:nth-of-type(1)]:font-bold [&_p:nth-of-type(1)]:!text-sun [&_strong]:!text-white [&_p]:text-white/85" />
                <div className="mt-5 flex flex-wrap gap-3 max-[560px]:grid">
                  <Link href="#enquire" className={btnYellow}>{ctaBtns[0] ?? "Request a call back"} <ArrowRight size={15} /></Link>
                  <Link href="#enquire" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/40 px-5 text-[14px] font-bold hover:bg-white/10">{ctaBtns[1] ?? "Talk to our experts"}</Link>
                </div>
              </section>
            )}

            {similar.length > 0 && (
              <section className="mt-10" aria-labelledby="similar">
                <h2 id="similar" className="text-[20px] font-extrabold tracking-[-0.02em]">Other services in {s.category}</h2>
                <ul className="mt-4 grid grid-cols-3 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
                  {similar.map((x) => (
                    <li key={x.slug}>
                      <Link href={`/services/${x.slug}`} className="flex items-center justify-between gap-2 rounded-lg border border-line bg-white px-4 py-3 text-[14px] font-semibold transition hover:border-brand hover:text-brand">
                        <span className="min-w-0 truncate">{x.title}</span>
                        <ArrowRight size={15} className="shrink-0 text-brand" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!ctaHtml && (
            <div className="mt-10 grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg bg-[linear-gradient(135deg,#0b1b4d,#16327f)] p-6 text-white max-[700px]:grid-cols-1">
              <div>
                <b className="block text-[19px] tracking-[-0.02em]">Still have questions about {s.title}?</b>
                <p className="mt-1 text-[14px] text-white/70">Talk to our team. We will explain the process in simple words.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="#enquire" className={btnYellow}>Request a call back <ArrowRight size={15} /></Link>
                <Link href="mailto:support@aeoncorporate.com" className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/30 px-5 text-[14px] font-bold hover:bg-white/10"><Mail size={16} /> Email us</Link>
              </div>
            </div>
            )}

            <p className="mt-6 rounded-lg bg-pale p-4 text-[12px] leading-[1.7] text-mute">
              Aeon Corporate is a private advisory and facilitation service and is not affiliated with any government body or regulator.{/^(SEBI|IRDA|AIF)/i.test(s.category) ? " We provide registration and compliance assistance and are not a SEBI-registered Investment Adviser or an IRDAI-registered intermediary." : ""} This page is general information, not legal advice. Fees, timelines and outcomes depend on the case and on the relevant authorities.
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
