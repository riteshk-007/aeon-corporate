"use client"

import { LoopVideo } from "@/components/site/loop-video"

/**
 * Home hero picture. On wide screens it is the right-hand part of the hero background and dissolves
 * into the sky on the left, top and bottom. On phones and tablets it sits above the text as a
 * full-width picture that fades into the page at the bottom.
 */
export function HeroLoop() {
  return (
    <div
      className={
        "pointer-events-none absolute top-[2%] -right-[4%] aspect-[4/3] h-[90%] " +
        "[-webkit-mask-composite:source-in] [mask-composite:intersect] " +
        "[-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_42%),linear-gradient(to_bottom,transparent_0%,#000_16%,#000_78%,transparent_100%)] " +
        "[mask-image:linear-gradient(to_right,transparent_0%,#000_42%),linear-gradient(to_bottom,transparent_0%,#000_16%,#000_78%,transparent_100%)] " +
        "max-[900px]:relative max-[900px]:order-last max-[900px]:top-auto max-[900px]:right-auto max-[900px]:mx-auto max-[900px]:mt-8 max-[900px]:-mb-6 max-[900px]:h-auto max-[900px]:w-[min(100%,760px)] " +
        "max-[900px]:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_9%,#000_91%,transparent_100%),linear-gradient(to_bottom,transparent_0%,#000_14%,#000_62%,transparent_100%)] max-[900px]:[mask-image:linear-gradient(to_right,transparent_0%,#000_9%,#000_91%,transparent_100%),linear-gradient(to_bottom,transparent_0%,#000_14%,#000_62%,transparent_100%)]"
      }
    >
      <LoopVideo
        src="/video/hero-infinity.mp4"
        poster="/video/hero-infinity-poster.jpg"
        alt="A glass infinity-loop of city towers rising from the water at sunrise"
        className="size-full object-cover object-center"
        eager
      />
    </div>
  )
}
