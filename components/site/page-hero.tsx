"use client"

import Image from "next/image"
import Link from "next/link"
import { MotionConfig, motion } from "framer-motion"
import { ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ColorIcon, Eyebrow, wrap } from "@/components/site/ui"

/** Yellow marker highlight for the key words of a hero title. */
export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-[linear-gradient(transparent_64%,#ffd93d_64%)] px-1">
      {children}
    </span>
  )
}

type PageHeroProps = {
  /** Trail after "Home", e.g. [{ label: "Careers" }] */
  crumbs: { label: string; href?: string }[]
  eyebrow: string
  title: React.ReactNode
  description: string
  actions?: React.ReactNode
  chips?: string[]
  image: {
    src: string
    alt: string
    width: number
    height: number
    position?: string
  }
  /** Small floating confirmation card on the picture. */
  note?: { title: string; sub: string }
  /** Up to three icon names (public/icons) that float around the picture. */
  icons?: [string, string, string]
}

const iconSpots = [
  "-top-5 -left-5 max-[560px]:-top-3 max-[560px]:-left-2",
  "top-[38%] -right-6 max-[1100px]:-right-3 max-[560px]:hidden",
  "-bottom-6 right-[18%] max-[560px]:-bottom-4 max-[560px]:right-4",
]

/**
 * Hero for all inner pages (About, Partner, Careers, Reviews, Contact).
 * A rounded light panel, dark type with a yellow highlight, a shaped
 * illustration and floating icon tiles. Home keeps its own blue hero.
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  description,
  actions,
  chips,
  image,
  note,
  icons = ["network", "expert", "approved"],
}: PageHeroProps) {
  return (
    <MotionConfig reducedMotion="user">
      <section className="pt-[142px] max-[1024px]:pt-[106px] max-[560px]:pt-[88px]">
        <div
          className={cn(
            wrap,
            "relative overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#eaf3ff_0%,#cfe5ff_58%,#dcebff_100%)] px-14 py-16 max-[1024px]:px-10 max-[1024px]:py-12 max-[560px]:rounded-[28px] max-[560px]:px-5 max-[560px]:py-9",
          )}
        >
          {/* decoration */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle,rgba(27,95,217,.22)_1.4px,transparent_2px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_55%_90%_at_88%_40%,black,transparent_75%)]"
          />
          <div
            aria-hidden="true"
            className="absolute -top-28 -left-20 size-80 rounded-full border border-brand/15"
          />
          <div
            aria-hidden="true"
            className="absolute -top-16 -left-8 size-52 rounded-full border border-brand/15"
          />
          <div
            aria-hidden="true"
            className="absolute -right-24 -bottom-24 size-72 rounded-full bg-sun/50 blur-[70px]"
          />

          <div className="relative grid grid-cols-[1.05fr_0.95fr] items-center gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <nav
                aria-label="Breadcrumb"
                className="mb-6 inline-flex flex-wrap items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-[13px] font-semibold text-mute shadow-[0_6px_18px_rgba(11,27,77,.08)] backdrop-blur"
              >
                <Link href="/" className="hover:text-brand">
                  Home
                </Link>
                {crumbs.map((crumb, i) => (
                  <span key={crumb.label} className="flex items-center gap-1.5">
                    <ChevronRight size={14} className="text-brand/50" />
                    {crumb.href && i < crumbs.length - 1 ? (
                      <Link href={crumb.href} className="hover:text-brand">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-brand" aria-current="page">
                        {crumb.label}
                      </span>
                    )}
                  </span>
                ))}
              </nav>

              <Eyebrow>{eyebrow}</Eyebrow>
              <h1 className="max-w-[620px] text-[clamp(34px,4.4vw,58px)] leading-[1.06] font-extrabold tracking-[-0.04em] text-ink">
                {title}
              </h1>
              <p className="mt-6 max-w-[540px] text-base leading-[1.75] text-mute max-[560px]:text-[15px]">
                {description}
              </p>
              {actions && (
                <div className="mt-7 flex flex-wrap gap-3">{actions}</div>
              )}
              {chips && (
                <ul className="mt-7 flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <li
                      key={chip}
                      className="rounded-full border border-brand/15 bg-white px-3.5 py-1.5 text-[12px] font-bold text-brand shadow-[0_4px_12px_rgba(27,95,217,.08)]"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="relative mx-auto w-full max-w-[540px]"
            >
              <div
                aria-hidden="true"
                className="absolute -right-4 -bottom-4 size-[85%] rounded-[36px_36px_36px_120px] bg-brand/90 max-[560px]:-right-2 max-[560px]:-bottom-2"
              />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[36px_36px_36px_120px] bg-white shadow-[0_30px_70px_rgba(11,27,77,.22)] max-[560px]:rounded-[24px_24px_24px_70px]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  priority
                  sizes="(max-width: 900px) 100vw, 540px"
                  className={cn(
                    "size-full animate-float-slow object-cover",
                    image.position,
                  )}
                />
              </div>

              {icons.map((name, i) => (
                <span
                  key={name + i}
                  aria-hidden="true"
                  style={{ animationDelay: `${-i * 2}s` }}
                  className={cn(
                    "absolute grid size-[68px] animate-float place-items-center rounded-2xl bg-white shadow-[0_16px_34px_rgba(11,27,77,.2)] motion-reduce:animate-none max-[560px]:size-14",
                    iconSpots[i],
                  )}
                >
                  <ColorIcon
                    name={name}
                    size={44}
                    className="max-[560px]:size-9"
                  />
                </span>
              ))}

              {note && (
                <div className="absolute bottom-6 -left-4 flex animate-float items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_36px_rgba(11,27,77,.2)] max-[560px]:bottom-4 max-[560px]:-left-1">
                  <span className="grid size-8 place-items-center rounded-full bg-brand text-white">
                    <Check size={16} />
                  </span>
                  <span className="text-xs leading-tight font-bold">
                    {note.title}
                    <small className="block text-[11px] font-medium text-mute">
                      {note.sub}
                    </small>
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  )
}
