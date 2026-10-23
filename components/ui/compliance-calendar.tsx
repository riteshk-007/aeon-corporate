"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import { Bell, Check } from "lucide-react"
import { cn } from "@/lib/utils"

/* Illustrative schedule only — not real filing deadlines. */
const tasks = [
  { day: 7, label: "Payroll compliance", date: "7 Oct" },
  { day: 12, label: "GST return filing", date: "12 Oct" },
  { day: 20, label: "Document review", date: "20 Oct" },
  { day: 24, label: "Annual documentation", date: "24 Oct" },
]
const taskDays = tasks.map((t) => t.day)
const weekdays = ["M", "T", "W", "T", "F", "S", "S"]
// 1 October 2026 falls on a Thursday (Monday-first grid => 3 blanks).
const leadingBlanks = 3
const daysInMonth = 31

export function ComplianceCalendar() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { amount: 0.3 })
  const [active, setActive] = useState(1)
  const [hold, setHold] = useState(false)

  useEffect(() => {
    if (reduce || !inView || hold) return
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % tasks.length),
      2600,
    )
    return () => window.clearInterval(timer)
  }, [reduce, inView, hold])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const spring = { stiffness: 140, damping: 18, mass: 0.6 }
  const rotateY = useSpring(
    useTransform(mx, (v) => v * 14),
    spring,
  )
  const rotateX = useSpring(
    useTransform(my, (v) => v * -14),
    spring,
  )
  const glareX = useTransform(mx, (v) => (v + 0.5) * 100)
  const glareY = useTransform(my, (v) => (v + 0.5) * 100)
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255,255,255,.16), transparent 60%)`
  const glareOpacity = useSpring(useMotionValue(0), {
    stiffness: 90,
    damping: 20,
  })

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return
    const r = event.currentTarget.getBoundingClientRect()
    mx.set((event.clientX - r.left) / r.width - 0.5)
    my.set((event.clientY - r.top) / r.height - 0.5)
    glareOpacity.set(1)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
    glareOpacity.set(0)
  }

  const activeDay = tasks[active].day

  return (
    <div ref={ref} className="relative [perspective:1200px]">
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <motion.div
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={{
            rotateX,
            rotateY,
            rotateZ: 1,
            transformStyle: "preserve-3d",
          }}
          className="relative rounded-[22px] border border-white/[.16] bg-white/[.09] p-5 shadow-[14px_14px_0_rgba(249,250,112,.12)] backdrop-blur-[12px] max-[560px]:rounded-[18px] max-[560px]:p-4 max-[560px]:shadow-[8px_8px_0_rgba(249,250,112,.12)]"
        >
          <motion.div
            aria-hidden="true"
            style={{ backgroundImage: glare, opacity: glareOpacity }}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
          />

          <div className="relative flex items-center justify-between border-b border-white/[.13] pb-3.5 max-[560px]:pb-3">
            <div>
              <small className="block text-[11px] tracking-[.13em] text-white/50">
                COMPLIANCE VIEW
              </small>
              <b className="mt-1.5 block text-[19px] max-[560px]:text-[17px]">
                October 2026
              </b>
            </div>
            <span className="rounded-md bg-brand px-2.5 py-1.5 text-xs font-bold">
              {tasks.length} tasks
            </span>
          </div>

          <div className="relative grid grid-cols-7 gap-1.5 py-3.5 text-center max-[560px]:py-3">
            {weekdays.map((d, i) => (
              <small key={`${d}${i}`} className="text-xs text-white/[.42]">
                {d}
              </small>
            ))}
            {Array.from({ length: leadingBlanks }, (_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const isTask = taskDays.includes(day)
              const isActive = day === activeDay
              return (
                <motion.span
                  key={day}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.35,
                    delay: (leadingBlanks + i) * 0.015,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    "relative grid h-9 place-items-center rounded-lg text-[13px] min-[1025px]:h-10 transition-[background,color,box-shadow,transform] duration-300 motion-reduce:transition-none max-[560px]:rounded-md max-[560px]:text-xs",
                    isTask
                      ? "cursor-pointer bg-sun font-black text-ink"
                      : "bg-white/[.06] text-white/80 hover:bg-white/15",
                    isActive &&
                      "z-10 scale-[1.14] shadow-[0_0_0_3px_rgba(249,250,112,.35),0_10px_28px_rgba(249,250,112,.45)]",
                  )}
                  onMouseEnter={() => {
                    const index = taskDays.indexOf(day)
                    if (index >= 0) {
                      setActive(index)
                      setHold(true)
                    }
                  }}
                  onMouseLeave={() => setHold(false)}
                >
                  {isActive && !reduce && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 animate-ping rounded-[inherit] bg-sun/50"
                    />
                  )}
                  <span className="relative">{day}</span>
                </motion.span>
              )
            })}
          </div>

          <div className="relative grid grid-cols-2 gap-1.5 max-[560px]:grid-cols-1">
            {tasks.map((task, i) => {
              const isActive = i === active
              return (
                <button
                  key={task.label}
                  onClick={() => {
                    setActive(i)
                    setHold(true)
                  }}
                  onMouseEnter={() => {
                    setActive(i)
                    setHold(true)
                  }}
                  onMouseLeave={() => setHold(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] transition duration-300 motion-reduce:transition-none",
                    isActive
                      ? "bg-white/[.14] text-white"
                      : "text-white/65 hover:bg-white/[.07]",
                  )}
                >
                  <i
                    className={cn(
                      "size-2 shrink-0 rounded-full transition-colors duration-300",
                      isActive ? "bg-sun" : "bg-brand",
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate">{task.label}</span>
                  <b
                    className={cn(
                      "text-xs",
                      isActive ? "text-sun" : "text-white/45",
                    )}
                  >
                    {task.date}
                  </b>
                </button>
              )
            })}
          </div>
          <p className="relative mt-2 text-[11px] text-white/35">
            Illustrative schedule for presentation.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
        className="absolute -top-5 -right-3 flex items-center gap-2 rounded-2xl border border-white/20 bg-white px-3.5 py-2.5 text-xs font-bold text-ink shadow-[0_18px_36px_rgba(0,0,0,.35)] max-[560px]:hidden"
      >
        <span className="grid size-7 place-items-center rounded-full bg-sun">
          <Bell size={14} />
        </span>
        Reminder set
      </motion.div>
      <motion.div
        aria-hidden="true"
        animate={reduce ? undefined : { y: [0, -9, 0] }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.4,
        }}
        className="absolute -bottom-6 -left-5 flex items-center gap-2 rounded-2xl border border-white/20 bg-brand px-3.5 py-2.5 text-xs font-bold text-white shadow-[0_18px_36px_rgba(0,0,0,.35)] max-[560px]:hidden"
      >
        <span className="grid size-7 place-items-center rounded-full bg-white/20">
          <Check size={14} />
        </span>
        Documents ready
      </motion.div>
    </div>
  )
}
