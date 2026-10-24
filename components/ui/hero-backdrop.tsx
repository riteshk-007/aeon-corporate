"use client"

import { useEffect, useRef } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { cn } from "@/lib/utils"

const soft = { stiffness: 28, damping: 24, mass: 1.2 }

function ParallaxBlob({
  nx,
  ny,
  depth,
  className,
  duration,
  delay = 0,
}: {
  nx: MotionValue<number>
  ny: MotionValue<number>
  depth: number
  className: string
  duration: number
  delay?: number
}) {
  const x = useSpring(
    useTransform(nx, (v) => v * depth),
    soft,
  )
  const y = useSpring(
    useTransform(ny, (v) => v * depth),
    soft,
  )
  return (
    <motion.div style={{ x, y }} className="absolute">
      <div
        className={cn("animate-blob rounded-full", className)}
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    </motion.div>
  )
}

/** Soft floating blobs, plus dots and glows that react to the cursor. */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const mx = useMotionValue(-1000)
  const my = useMotionValue(-1000)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)
  const presence = useMotionValue(0)

  // Two followers at different speeds: blue leads, yellow trails behind it.
  const bx = useSpring(mx, { stiffness: 60, damping: 26, mass: 0.9 })
  const by = useSpring(my, { stiffness: 60, damping: 26, mass: 0.9 })
  const yx = useSpring(mx, { stiffness: 26, damping: 22, mass: 1.3 })
  const yy = useSpring(my, { stiffness: 26, damping: 22, mass: 1.3 })
  const visible = useSpring(presence, { stiffness: 40, damping: 18 })
  const glowOpacity = useTransform(visible, (v) => v * 0.35)
  const dotOpacity = useTransform(visible, (v) => v * 0.3)

  const blueX = useTransform(bx, (v) => v - 300)
  const blueY = useTransform(by, (v) => v - 300)
  const sunX = useTransform(yx, (v) => v - 230)
  const sunY = useTransform(yy, (v) => v - 230)
  const dotShiftX = useSpring(
    useTransform(nx, (v) => v * -12),
    soft,
  )
  const dotShiftY = useSpring(
    useTransform(ny, (v) => v * -12),
    soft,
  )
  const blueSpot = useMotionTemplate`radial-gradient(220px circle at ${bx}px ${by}px, black 0%, transparent 100%)`
  const sunSpot = useMotionTemplate`radial-gradient(180px circle at ${yx}px ${yy}px, black 0%, transparent 100%)`

  useEffect(() => {
    if (reduce) return
    const onMove = (event: MouseEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const inside =
        event.clientX >= r.left &&
        event.clientX <= r.right &&
        event.clientY >= r.top &&
        event.clientY <= r.bottom
      if (!inside) {
        presence.set(0)
        return
      }
      const x = event.clientX - r.left
      const y = event.clientY - r.top
      mx.set(x)
      my.set(y)
      nx.set(x / r.width - 0.5)
      ny.set(y / r.height - 0.5)
      presence.set(1)
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [reduce, mx, my, nx, ny, presence])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)]"
    >
      <div className="absolute top-[4%] right-[-4%]">
        <ParallaxBlob
          nx={nx}
          ny={ny}
          depth={reduce ? 0 : 24}
          duration={20}
          className="size-[520px] bg-white/15 blur-[110px] max-[900px]:size-[360px]"
        />
      </div>
      <div className="absolute bottom-[-6%] left-[0%]">
        <ParallaxBlob
          nx={nx}
          ny={ny}
          depth={reduce ? 0 : -18}
          duration={24}
          delay={-6}
          className="size-[400px] bg-[#8fc1ff]/25 blur-[100px] max-[900px]:size-[300px]"
        />
      </div>
      <div className="absolute top-[18%] left-[34%]">
        <ParallaxBlob
          nx={nx}
          ny={ny}
          depth={reduce ? 0 : 20}
          duration={26}
          delay={-11}
          className="size-[320px] bg-sun/22 blur-[90px] max-[900px]:size-[240px]"
        />
      </div>
      <div className="absolute top-[52%] right-[18%]">
        <ParallaxBlob
          nx={nx}
          ny={ny}
          depth={reduce ? 0 : -24}
          duration={18}
          delay={-3}
          className="size-[260px] bg-[#8fc1ff]/20 blur-[90px] max-[900px]:hidden"
        />
      </div>
      <div className="absolute top-[-8%] left-[8%]">
        <ParallaxBlob
          nx={nx}
          ny={ny}
          depth={reduce ? 0 : 24}
          duration={21}
          delay={-9}
          className="size-[240px] bg-sun/16 blur-[80px] max-[900px]:hidden"
        />
      </div>

      {!reduce && (
        <>
          <motion.div
            style={{ x: sunX, y: sunY, opacity: glowOpacity }}
            className="absolute top-0 left-0 size-[460px] rounded-full bg-sun/22 blur-[90px]"
          />
          <motion.div
            style={{ x: blueX, y: blueY, opacity: glowOpacity }}
            className="absolute top-0 left-0 size-[600px] rounded-full bg-white/15 blur-[110px]"
          />
          <motion.div
            style={{
              x: dotShiftX,
              y: dotShiftY,
              opacity: dotOpacity,
              maskImage: sunSpot,
              WebkitMaskImage: sunSpot,
            }}
            className="absolute -inset-10 bg-[radial-gradient(circle,rgba(255,217,61,.95)_1.6px,transparent_2.3px)] [background-position:10px_10px] [background-size:21px_21px]"
          />
          <motion.div
            style={{
              x: dotShiftX,
              y: dotShiftY,
              opacity: dotOpacity,
              maskImage: blueSpot,
              WebkitMaskImage: blueSpot,
            }}
            className="absolute -inset-10 bg-[radial-gradient(circle,rgba(255,255,255,.95)_1.6px,transparent_2.3px)] [background-size:21px_21px]"
          />
        </>
      )}
    </div>
  )
}
