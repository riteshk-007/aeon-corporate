"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { ColorIcon } from "@/components/site/ui"
import { AeBullet } from "@/components/site/ae-bullet"

export type ProcessStep = {
  num: string
  title: string
  description: string
  points: string[]
  icon: string
}

const AUTO_MS = 3800
const EASE = [0.23, 1, 0.32, 1] as const

/**
 * Interactive "working process": a progress rail you can click or step through with arrows,
 * and a panel that slides in the direction you are moving. Steps advance by themselves
 * (paused on hover/focus or with the pause button, and never for reduced-motion visitors).
 * The rail and panel pattern follows the "Wizard Steps" component from 21st.dev, restyled for Aeon.
 */
export function ProcessWizard({ steps }: { steps: ProcessStep[] }) {
  const reduced = useReducedMotion()
  const [at, setAt] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [auto, setAuto] = useState(true)
  const [hold, setHold] = useState(false)
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLOListElement>(null)
  const total = steps.length

  const go = (to: number, stop = true) => {
    const t = (to + total) % total
    if (t === at) return
    setDir(to > at ? 1 : -1)
    setAt(t)
    if (stop) setAuto(false)
  }

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Keep the current step in view when the rail scrolls sideways (phones). Only the rail itself
  // is scrolled: scrollIntoView would also shift the page's clipped containers.
  useEffect(() => {
    const el = rail.current
    const cur = el?.querySelector<HTMLElement>('[aria-current="step"]')
    if (!el || !cur || el.scrollWidth <= el.clientWidth) return
    const left = cur.offsetLeft - el.clientWidth / 2 + cur.offsetWidth / 2
    el.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' })
  }, [at, reduced])

  const running = auto && !hold && visible && !reduced
  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => {
      setDir(1)
      setAt((i) => (i + 1) % total)
    }, AUTO_MS)
    return () => clearTimeout(t)
  }, [running, at, total])

  const step = steps[at]
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") go(at + 1)
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(at - 1)
    else if (e.key === "Home") go(0)
    else if (e.key === "End") go(total - 1)
    else return
    e.preventDefault()
  }

  const slide = reduced
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (d: number) => ({ opacity: 0, x: d * 48 }),
        center: { opacity: 1, x: 0 },
        exit: (d: number) => ({ opacity: 0, x: d * -48 }),
      }

  return (
    <div
      ref={root}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      className="mt-14 max-[560px]:mt-10"
    >
      {/* Rail */}
      <ol
        ref={rail}
        aria-label="Working process steps"
        onKeyDown={onKey}
        className="no-scrollbar relative -mx-4 flex snap-x items-start overflow-x-auto px-4 pb-3 min-[1000px]:mx-0 min-[1000px]:overflow-visible min-[1000px]:px-0"
      >
        {steps.map((s, i) => {
          const done = i < at
          const here = i === at
          return (
            <li key={s.num} className="flex min-w-[96px] flex-1 snap-center flex-col items-center last:flex-none min-[1000px]:min-w-0">
              <div className="flex w-full items-center">
                <button
                  type="button"
                  aria-current={here ? "step" : undefined}
                  aria-label={`Step ${s.num}: ${s.title}`}
                  tabIndex={here ? 0 : -1}
                  onClick={() => go(i)}
                  className={cn(
                    "relative z-10 grid size-12 shrink-0 place-items-center rounded-lg border-2 text-[15px] font-extrabold tabular-nums transition duration-300 outline-none focus-visible:ring-4 focus-visible:ring-brand/25",
                    done && "border-brand bg-brand text-white",
                    here && "scale-110 border-sun bg-ink text-white shadow-[0_12px_28px_rgba(11,27,77,.3)]",
                    !done && !here && "border-line bg-white text-mute hover:border-brand/50 hover:text-brand",
                  )}
                >
                  {done ? <Check size={20} strokeWidth={3} /> : s.num}
                  {here && !reduced && (
                    <span aria-hidden="true" className="absolute inset-0 -z-10 animate-ping rounded-lg bg-sun/40 [animation-duration:2.4s]" />
                  )}
                </button>
                {i < total - 1 && (
                  <span aria-hidden="true" className="relative mx-1 h-1 flex-1 overflow-hidden rounded-full bg-[#dbe6fb]">
                    <motion.span
                      key={`${i}-${at}-${running}`}
                      className="absolute inset-0 origin-left rounded-full bg-[linear-gradient(90deg,#3f6df6,#ffbe0b)]"
                      initial={{ scaleX: done ? 1 : 0 }}
                      animate={{ scaleX: done ? 1 : here && running ? 1 : 0 }}
                      transition={here && running ? { duration: AUTO_MS / 1000, ease: "linear" } : { duration: 0.4, ease: EASE }}
                    />
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "mt-3 w-full px-1 text-center text-[12.5px] leading-tight font-bold transition-colors max-[999px]:hidden",
                  here ? "text-ink" : "text-mute",
                  i === total - 1 && "min-[1000px]:w-12 min-[1000px]:overflow-visible min-[1000px]:whitespace-nowrap",
                )}
              >
                {s.title}
              </span>
            </li>
          )
        })}
      </ol>

      {/* Panel */}
      <div
        role="group"
        aria-label={`Step ${step.num} of ${String(total).padStart(2, "0")}: ${step.title}`}
        className="relative mt-6 overflow-hidden rounded-xl border border-line bg-white shadow-[0_24px_60px_rgba(11,27,77,.1)]"
      >
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[linear-gradient(to_bottom,#3f6df6,#ffbe0b)]" />
        <div aria-hidden="true" className="absolute -top-24 -right-16 size-64 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative grid min-h-[330px] max-[760px]:min-h-[420px]">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={step.num}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE }}
              className="col-start-1 row-start-1 grid grid-cols-[220px_1fr] items-center gap-10 p-9 pl-11 max-[900px]:grid-cols-[1fr] max-[900px]:gap-6 max-[560px]:p-6 max-[560px]:pl-7"
            >
              <div className="relative mx-auto grid place-items-center max-[900px]:mx-0 max-[900px]:flex max-[900px]:items-center max-[900px]:gap-4">
                <span aria-hidden="true" className="absolute -top-8 -left-4 text-[120px] leading-none font-black tracking-[-0.06em] text-brand/[.07] select-none max-[900px]:static max-[900px]:order-2 max-[900px]:text-[64px]">
                  {step.num}
                </span>
                <motion.span
                  initial={reduced ? false : { scale: 0.6, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="relative grid size-36 place-items-center rounded-xl bg-[linear-gradient(145deg,#eaf3ff,#cfe0ff)] ring-1 ring-white shadow-[0_18px_40px_rgba(63,109,246,.22)] max-[900px]:size-20"
                >
                  <ColorIcon name={step.icon} size={84} />
                </motion.span>
              </div>
              <div className="min-w-0">
                <span className="text-[12px] font-black tracking-[.18em] text-brand">
                  STEP {step.num} OF {String(total).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-[clamp(24px,2.6vw,34px)] leading-[1.1] font-extrabold tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-3 max-w-[560px] text-[15.5px] leading-[1.7] text-mute">{step.description}</p>
                <ul className="mt-5 grid max-w-[620px] grid-cols-2 gap-2.5 max-[560px]:grid-cols-1">
                  {step.points.map((p, i) => (
                    <motion.li
                      key={p}
                      initial={reduced ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.07, duration: 0.35, ease: EASE }}
                      className="flex items-center gap-3 rounded-lg bg-[#f3f8ff] px-3.5 py-3 text-[14px] leading-snug font-semibold text-ink/90 ring-1 ring-line"
                    >
                      <AeBullet className="size-6" />
                      {p}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="relative flex items-center gap-3 border-t border-line bg-[#fbfdff] px-5 py-3.5 max-[560px]:px-4">
          <button
            type="button"
            onClick={() => go(at - 1)}
            disabled={at === 0}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-[13.5px] font-bold text-ink transition hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft size={16} /> <span className="max-[420px]:hidden">Back</span>
          </button>
          <button
            type="button"
            onClick={() => setAuto((v) => !v)}
            aria-label={auto ? "Pause automatic steps" : "Play steps automatically"}
            className="grid size-10 place-items-center rounded-lg border border-line bg-white text-ink transition hover:border-brand hover:text-brand"
          >
            {auto ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <div className="mx-auto flex items-center gap-1.5" aria-hidden="true">
            {steps.map((s, i) => (
              <span key={s.num} className={cn("h-1.5 rounded-full transition-all duration-300", i === at ? "w-7 bg-brand" : "w-1.5 bg-[#cbd9f4]")} />
            ))}
          </div>
          <button
            type="button"
            onClick={() => (at === total - 1 ? go(0) : go(at + 1))}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-[13.5px] font-bold text-white shadow-[0_10px_22px_rgba(63,109,246,.28)] transition hover:bg-[#2c55d6]"
          >
            {at === total - 1 ? "Start over" : "Next"} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
