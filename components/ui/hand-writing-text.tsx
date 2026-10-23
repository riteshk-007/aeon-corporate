"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

const path =
  "M 950 90 C 1250 300, 1050 480, 600 520 C 250 520, 150 480, 150 300 C 150 120, 350 80, 600 80 C 850 80, 950 180, 950 180"

const makeDraw = (duration: number) => ({
  hidden: { pathLength: 0, opacity: 0, transition: { duration: 0.5 } },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration,
        delay: 0.25,
        ease: [0.45, 0.05, 0.25, 1] as const,
      },
      opacity: { duration: 0.6, delay: 0.25 },
    },
  },
})

/** Hand-drawn loop that is redrawn every time it scrolls into view. */
function HandDrawnFrame({
  children,
  className,
  strokeClassName = "text-brand",
  d = path,
  strokeWidth = 3.5,
  svgClassName = "-inset-x-3 -inset-y-8 h-[calc(100%+4rem)] w-[calc(100%+1.5rem)] min-[561px]:-inset-x-6 min-[561px]:w-[calc(100%+3rem)]",
  inline = false,
  duration = 2.5,
}: {
  children: React.ReactNode
  className?: string
  strokeClassName?: string
  d?: string
  strokeWidth?: number
  svgClassName?: string
  inline?: boolean
  duration?: number
}) {
  const Tag = inline ? "span" : "div"
  const ref = useRef<HTMLDivElement & HTMLSpanElement>(null)
  const inView = useInView(ref, { amount: 0.6 })
  const reduceMotion = useReducedMotion()
  const visible = reduceMotion || inView

  return (
    <Tag ref={ref} className={cn("relative", className)}>
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute overflow-visible",
          svgClassName,
        )}
      >
        <motion.path
          d={d}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          variants={makeDraw(duration)}
          initial="hidden"
          animate={visible ? "visible" : "hidden"}
          className={cn("opacity-90", strokeClassName)}
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </Tag>
  )
}

interface HandWrittenTitleProps {
  title?: string
  subtitle?: string
}

function HandWrittenTitle({
  title = "Hand Written",
  subtitle = "Optional subtitle",
}: HandWrittenTitleProps) {
  return (
    <div className="relative mx-auto w-full max-w-4xl py-24">
      <HandDrawnFrame className="flex flex-col items-center text-center">
        <motion.h1
          className="flex items-center gap-2 text-4xl tracking-tighter text-black md:text-6xl dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="text-xl text-black/80 dark:text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
        )}
      </HandDrawnFrame>
    </div>
  )
}

export { HandWrittenTitle, HandDrawnFrame }
