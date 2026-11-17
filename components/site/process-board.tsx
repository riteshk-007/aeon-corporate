"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AeBullet } from "@/components/site/ae-bullet"

export type ProcessStep = {
  num: string
  title: string
  description: string
  points: string[]
  icon?: string
}

const TONES = [
  { panel: "bg-[#fff0e6] ring-[#ffd9bf]", num: "text-sun", pin: "from-[#ff9a52] to-[#e05400] shadow-[0_6px_16px_rgba(253,105,2,.55)]" },
  { panel: "bg-[#e8f0ff] ring-[#cddcff]", num: "text-brand", pin: "from-[#4d8ef0] to-[#0248A9] shadow-[0_6px_16px_rgba(2,72,169,.5)]" },
  { panel: "bg-[#eef3fb] ring-[#d6e0f0]", num: "text-ink", pin: "from-[#3a4f8a] to-[#0b1b4d] shadow-[0_6px_16px_rgba(11,27,77,.45)]" },
]

/**
 * "Working process" as pinned notes on a board: each step is a tilted card with a pin,
 * zig-zagging down the page and joined by dashed lines. On phones the cards stack with a
 * dashed spine and a slight alternating offset; tilt is removed for reduced-motion visitors.
 */
export function ProcessBoard({ steps }: { steps: ProcessStep[] }) {
  const reduced = useReducedMotion()
  return (
    <ol className="relative mx-auto flex max-w-[1080px] flex-col gap-8 py-4 max-[900px]:gap-7 min-[901px]:gap-0">
      {/* dashed spine on phones */}
      <span aria-hidden="true" className="pointer-events-none absolute top-6 bottom-6 left-1/2 w-0 -translate-x-1/2 border-l-2 border-dashed border-brand/20 min-[901px]:hidden" />
      {steps.map((s, i) => {
        const tone = TONES[i % TONES.length]
        const right = i % 2 === 1
        const tilt = right ? 2.4 : -2.8
        return (
          <motion.li
            key={s.num}
            initial={reduced ? false : { opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              "relative z-10 w-[min(500px,calc(100%-24px))] min-[901px]:w-[46%] min-[901px]:-mt-14 first:mt-0",
              right ? "self-end" : "self-start",
            )}
          >
            <div
              style={{ ["--tilt" as string]: `${tilt}deg` }}
              className="group relative rotate-[calc(var(--tilt)*.55)] rounded-[26px] bg-white p-3 shadow-[0_26px_50px_-18px_rgba(11,27,77,.28),0_4px_12px_rgba(11,27,77,.06)] ring-1 ring-black/[.04] transition duration-300 hover:rotate-0 hover:-translate-y-1 motion-reduce:rotate-0 min-[901px]:rotate-[var(--tilt)]"
            >
              <span aria-hidden="true" className={cn("absolute -top-3.5 left-1/2 z-10 size-7 -translate-x-1/2 rounded-full bg-gradient-to-b ring-4 ring-white", tone.pin)} />
              <div className={cn("rounded-[18px] p-5 pt-6 ring-1 max-[560px]:p-4 max-[560px]:pt-5", tone.panel)}>
                <span className={cn("block text-[28px] leading-none font-extrabold tracking-[-0.04em] tabular-nums", tone.num)}>{s.num}</span>
                <h3 className="mt-3 text-[22px] leading-tight font-extrabold tracking-[-0.03em] text-ink max-[560px]:text-[19px]">{s.title}</h3>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-mute">{s.description}</p>
                <ul className="mt-3.5 grid gap-1.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[13.5px] leading-snug font-semibold text-ink/85">
                      <AeBullet className="mt-0.5 size-4 shrink-0" />
                      <span className="min-w-0">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* dashed link to the next note (desktop) */}
            {i < steps.length - 1 && (
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className={cn(
                  "pointer-events-none absolute top-[42%] hidden h-[125%] w-[62%] text-ink/30 min-[901px]:block",
                  right ? "right-[96%] -scale-x-100" : "left-[96%]",
                )}
              >
                <path d="M0 0 C 55 6, 62 70, 100 100" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
              </svg>
            )}
          </motion.li>
        )
      })}
    </ol>
  )
}
