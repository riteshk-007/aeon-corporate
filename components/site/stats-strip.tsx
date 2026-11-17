"use client"

import { useEffect, useRef, useState } from "react"
import NumberFlow from "@number-flow/react"
import { Clock, Layers, MapPin, Users, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Eyebrow, wrap } from "@/components/site/ui"

type Stat = { value: number; suffix: string; label: string; hint: string; icon: LucideIcon; tone: string; glow: string }

// Figures from the client's brief and the site's own content.
const stats: Stat[] = [
  { value: 40, suffix: "+", label: "Professional experts", hint: "In-house team and partner network", icon: Users, tone: "bg-brand text-white", glow: "rgba(2,72,169,.35)" },
  { value: 15, suffix: "+", label: "Cities and towns", hint: "Independent professionals across India", icon: MapPin, tone: "bg-sun text-ink", glow: "rgba(255,190,11,.3)" },
  { value: 550, suffix: "+", label: "Services covered", hint: "Registrations, licences, compliance, advisory", icon: Layers, tone: "bg-flame text-white", glow: "rgba(249,87,1,.3)" },
  { value: 24, suffix: " hrs", label: "To hear back", hint: "Our team replies promptly", icon: Clock, tone: "bg-white text-brand", glow: "rgba(255,255,255,.25)" },
]

/**
 * Rolling-digit counters (NumberFlow, the library used by the 21st.dev "Number Ticker" component)
 * on cards with a light that follows the pointer. The numbers roll up when the section scrolls into view.
 */
function Card({ stat, run, i }: { stat: Stat; run: boolean; i: number }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLLIElement>(null)
  const Icon = stat.icon

  useEffect(() => {
    if (!run) return
    const t = setTimeout(() => setN(stat.value), 250 + i * 160)
    return () => clearTimeout(t)
  }, [run, stat.value, i])

  const onMove = (e: React.PointerEvent<HTMLLIElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }

  return (
    <li
      ref={ref}
      onPointerMove={onMove}
      style={{ transitionDelay: `${i * 90}ms`, ["--glow" as string]: stat.glow }}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-white/10 bg-white/[.06] p-6 transition duration-700 hover:-translate-y-1.5 hover:border-white/30",
        run ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
      )}
    >
      {/* light that follows the pointer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), var(--glow), transparent 70%)" }}
      />
      <div className="relative flex items-center justify-between">
        <span className={cn("grid size-11 place-items-center rounded-md", stat.tone)}>
          <Icon size={21} />
        </span>
        <span className="relative flex size-2.5" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-sun opacity-70 [animation-duration:2.2s]" />
          <span className="relative inline-flex size-2.5 rounded-full bg-sun" />
        </span>
      </div>
      <b className="relative mt-5 block text-[clamp(40px,4.2vw,58px)] leading-none font-extrabold tracking-[-0.04em] text-white">
        <NumberFlow
          value={n}
          suffix={stat.suffix}
          trend={1}
          transformTiming={{ duration: 1300, easing: "cubic-bezier(.22,1,.36,1)" }}
          spinTiming={{ duration: 1300, easing: "cubic-bezier(.22,1,.36,1)" }}
          className="[&::part(suffix)]:text-sun"
        />
      </b>
      <span className="relative mt-3 block text-[16px] font-bold text-white">{stat.label}</span>
      <span className="relative mt-1 block text-[13px] leading-snug text-white/60">{stat.hint}</span>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[linear-gradient(90deg,#0248A9,#FD6902)] transition-transform duration-300 group-hover:scale-x-100" />
    </li>
  )
}

export function StatsStrip() {
  const ref = useRef<HTMLElement>(null)
  const [run, setRun] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-20 text-white max-[560px]:py-14" aria-label="Aeon in numbers">
      <div aria-hidden="true" className="absolute -top-24 -left-20 size-80 rounded-full bg-brand/35 blur-[110px]" />
      <div aria-hidden="true" className="absolute -right-16 -bottom-24 size-72 rounded-full bg-sun/20 blur-[110px]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,.08)_1px,transparent_1.5px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]"
      />
      <div className={cn(wrap, "relative")}>
        <div className="mb-10 text-center max-[560px]:mb-8">
          <Eyebrow className="justify-center text-sun">AEON IN NUMBERS</Eyebrow>
          <h2 className="mx-auto max-w-[640px] text-[clamp(26px,3.2vw,40px)] leading-[1.1] font-extrabold tracking-[-0.03em]">
            A team you can reach, wherever you are.
          </h2>
        </div>
        <ul className="grid grid-cols-4 gap-4 max-[1000px]:grid-cols-2 max-[480px]:grid-cols-1">
          {stats.map((s, i) => (
            <Card key={s.label} stat={s} run={run} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
