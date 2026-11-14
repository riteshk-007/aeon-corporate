"use client"

import { LoopVideo } from "@/components/site/loop-video"

// Fades the picture into the hero background on every side that touches it.
const FADE =
  "linear-gradient(to right, transparent 0%, #000 42%), linear-gradient(to bottom, transparent 0%, #000 16%, #000 78%, transparent 100%)"

/**
 * Home hero picture as the right-hand part of the hero background: the infinity-loop city
 * dissolves into the sky on the left, top and bottom, so there is no box or frame around it.
 */
export function HeroLoop() {
  return (
    <div
      aria-hidden={false}
      className="pointer-events-none absolute inset-y-0 right-0 w-[66%] max-[900px]:w-full max-[900px]:opacity-45"
      style={{
        WebkitMaskImage: FADE,
        maskImage: FADE,
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      <LoopVideo
        src="/video/hero-infinity.mp4"
        poster="/video/hero-infinity-poster.jpg"
        alt="A glass infinity-loop of city towers rising from the water at sunrise"
        className="size-full object-cover object-[60%_55%]"
        eager
      />
    </div>
  )
}
