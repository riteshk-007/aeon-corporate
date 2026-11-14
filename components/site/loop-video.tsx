"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Silent looping clip that only downloads and plays while it is on screen, so it never slows the page.
 * Shows the still poster until then and for visitors who prefer reduced motion.
 */
export function LoopVideo({
  src,
  poster,
  alt,
  className,
  eager = false,
}: {
  src: string
  poster: string
  alt: string
  className?: string
  /** above the fold: start downloading straight away */
  eager?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(eager)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
        if (entry.isIntersecting) setStarted(true)
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Play while on screen, pause when scrolled away (also once the file has been attached).
  useEffect(() => {
    const el = ref.current
    if (!el || !started) return
    if (visible) el.play().catch(() => {})
    else el.pause()
  }, [visible, started])

  return (
    <video
      ref={ref}
      className={cn("block w-full", className)}
      poster={poster}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      aria-label={alt}
      src={started ? src : undefined}
      autoPlay={started}
    />
  )
}
