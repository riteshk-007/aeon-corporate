"use client"

import { useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { ArrowUp } from "lucide-react"

const RADIUS = 22
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Floating button with a page-progress ring. Appears once the hero is passed. */
export function ScrollToTop() {
  const reduce = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  const offset = useTransform(
    progress,
    (p) => CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, p))),
  )
  const [visible, setVisible] = useState(false)
  const [percent, setPercent] = useState(0)

  useMotionValueEvent(scrollY, "change", (y) => {
    setVisible(y > window.innerHeight * 0.9)
  })
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setPercent(Math.min(100, Math.max(0, Math.round(p * 100))))
  })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label={`Back to top (${percent}% scrolled)`}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
          }
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          data-floater="top" className="group fixed right-[22px] bottom-[78px] z-30 grid size-[54px] place-items-center rounded-full bg-white shadow-[0_14px_34px_rgba(11,27,77,.22)] max-[560px]:right-3.5 max-[560px]:bottom-[70px]"
        >
          <svg
            viewBox="0 0 54 54"
            className="absolute inset-0 -rotate-90"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="scroll-progress" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1b5fd9" />
                <stop offset="100%" stopColor="#e6bd00" />
              </linearGradient>
            </defs>
            <circle
              cx="27"
              cy="27"
              r={RADIUS}
              fill="none"
              stroke="#dcebff"
              strokeWidth="3.5"
            />
            <motion.circle
              cx="27"
              cy="27"
              r={RADIUS}
              fill="none"
              stroke="url(#scroll-progress)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              style={{ strokeDashoffset: offset }}
            />
          </svg>
          <span className="relative grid size-[38px] place-items-center rounded-full bg-ink text-white transition-colors group-hover:bg-brand">
            <ArrowUp
              size={18}
              className="transition-all duration-200 group-hover:-translate-y-4 group-hover:opacity-0"
            />
            <span className="absolute translate-y-4 text-[11px] font-extrabold opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
              {percent}%
            </span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
