"use client"

import { useEffect, useRef, useState } from "react"
import { Clock, Layers, MapPin, Users, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Eyebrow, wrap } from "@/components/site/ui"

type Stat = { value: number; suffix?: string; label: string; hint: string; icon: LucideIcon; tone: string }

// Figures from the client's brief and the site's own content.
const stats: Stat[] = [
  { value: 40, suffix: "+", label: "Professional experts", hint: "In-house team and partner network", icon: Users, tone: "bg-brand text-white" },
  { value: 15, suffix: "+", label: "Cities and towns", hint: "Independent professionals across India", icon: MapPin, tone: "bg-sun text-ink" },
  { value: 550, suffix: "+", label: "Services covered", hint: "Registrations, licences, compliance, advisory", icon: Layers, tone: "bg-flame text-white" },
  { value: 24, suffix: " hrs", label: "To hear back", hint: "Our team replies promptly", icon: Clock, tone: "bg-white text-brand" },
]

function useCountUp(target: number, run: boolean, ms = 1500) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms)
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, target, ms])
  return n
}

function Card({ stat, run, i }: { stat: Stat; run: boolean; i: number }) {
  const n = useCountUp(stat.value, run)
  const Icon = stat.icon
  return (
    <li
      className={cn(
        "group relative overflow-hidden rounded-lg border border-white/10 bg-white/[.06] p-6 transition duration-700 hover:-translate-y-1 hover:border-white/25 hover:bg-white/10",
        run ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
      )}
      style={{ transitionDelay: `${i * 100}ms` }}
    >
      <span className={cn("grid size-11 place-items-center rounded-md", stat.tone)}>
        <Icon size={21} />
      </span>
      <b className="mt-5 block text-[clamp(40px,4.2vw,56px)] leading-none font-extrabold tracking-[-0.04em] text-white tabular-nums">
        {n}
        <span className="text-sun">{stat.suffix}</span>
      </b>
      <span className="mt-3 block text-[16px] font-bold text-white">{stat.label}</span>
      <span className="mt-1 block text-[13px] leading-snug text-white/60">{stat.hint}</span>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[linear-gradient(90deg,#3f6df6,#ffbe0b)] transition-transform duration-300 group-hover:scale-x-100" />
    </li>
  )
}

/** Four counting figures on a navy band. Light CSS only, nothing heavy to load. */
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
