import Link from "next/link"
import { ChevronRight, FileText, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Eyebrow, wrap } from "@/components/site/ui"
import { LEGAL_UPDATED } from "@/lib/legal"

export type LegalSection = {
  id: string
  title: string
  body: React.ReactNode
}

/** Readable long-form layout for Privacy Policy, Terms, etc. */
export function LegalLayout({
  title,
  eyebrow,
  intro,
  current,
  sections,
}: {
  title: string
  eyebrow: string
  intro: string
  current: "privacy" | "terms"
  sections: LegalSection[]
}) {
  const other =
    current === "privacy"
      ? { href: "/terms-and-conditions", label: "Terms & Conditions", icon: FileText }
      : { href: "/privacy-policy", label: "Privacy Policy", icon: ShieldCheck }

  return (
    <main id="top" className="overflow-hidden pt-[142px] pb-24 max-[1024px]:pt-[106px] max-[560px]:pt-[88px]">
      <div className={wrap}>
        <header className="rounded-[32px] bg-[linear-gradient(135deg,#eaf3ff,#cfe5ff_60%,#dcebff)] px-12 py-12 max-[900px]:px-6 max-[900px]:py-9 max-[560px]:rounded-[24px]">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-[13px] font-semibold text-mute"
          >
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <ChevronRight size={14} className="text-brand/50" />
            <span className="text-brand" aria-current="page">
              {title}
            </span>
          </nav>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-[clamp(32px,4.2vw,52px)] leading-[1.05] font-extrabold tracking-[-0.04em]">
            {title}
          </h1>
          <p className="mt-4 max-w-[680px] text-[15px] leading-[1.75] text-mute">{intro}</p>
          <p className="mt-4 text-[13px] font-semibold text-ink/70">
            Last updated: {LEGAL_UPDATED}
          </p>
        </header>

        <div className="mt-10 grid grid-cols-[260px_1fr] items-start gap-12 max-[1024px]:grid-cols-1 max-[1024px]:gap-8">
          <aside className="sticky top-28 max-[1024px]:static">
            <nav
              aria-label="On this page"
              className="rounded-[22px] border border-line bg-white p-5 shadow-[0_10px_30px_rgba(11,27,77,.06)]"
            >
              <p className="mb-3 text-[11px] font-black tracking-[.16em] text-mute uppercase">
                On this page
              </p>
              <ol className="grid gap-0.5">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] leading-snug font-semibold text-ink/80 transition hover:bg-pale hover:text-brand"
                    >
                      <span className="text-brand/60">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
              <Link
                href={other.href}
                className="mt-4 flex items-center gap-2 rounded-xl bg-[#eaf3ff] px-3 py-2.5 text-[13px] font-bold text-brand hover:bg-[#dcebff]"
              >
                <other.icon size={16} /> {other.label}
              </Link>
            </nav>
          </aside>

          <article className="min-w-0">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className={cn("scroll-mt-28 py-7", i > 0 && "border-t border-line")}
              >
                <h2 className="text-[22px] font-extrabold tracking-[-0.02em]">
                  <span className="mr-2 text-brand/60">{i + 1}.</span>
                  {s.title}
                </h2>
                <div className="legal-body mt-3 grid gap-3 text-[15px] leading-[1.8] text-ink/80 [&_a]:font-semibold [&_a]:text-brand [&_a]:underline-offset-2 hover:[&_a]:underline [&_li]:pl-1 [&_strong]:text-ink [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-1.5 [&_ul]:pl-5">
                  {s.body}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  )
}
