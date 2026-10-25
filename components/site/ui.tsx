import Link from "next/link"
import { cn } from "@/lib/utils"

/* Shared style tokens (Tailwind utilities) */
export const wrap =
  "mx-auto w-[min(1160px,calc(100%_-_48px))] max-[560px]:w-[min(calc(100%_-_32px),500px)]"
export const btn =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-bold transition duration-200 hover:-translate-y-0.5 motion-reduce:transition-none"
export const btnBlueFlat = `${btn} bg-brand text-white hover:bg-[#1450bd]`
export const btnBlue = `${btnBlueFlat} shadow-[0_10px_23px_rgba(27,95,217,.22)]`
export const btnYellow = `${btn} bg-sun text-ink`
export const btnWhite = `${btn} bg-white text-ink`
export const btnOutline = `${btn} border border-[#bfcbe0] bg-white/70 text-ink`

export function ColorIcon({
  name,
  size = 28,
  className,
}: {
  name: string
  size?: number
  className?: string
}) {
  return (
    <img
      src={`/icons/${name}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      style={{ width: size, height: size }}
      className={cn("shrink-0 object-contain", className)}
    />
  )
}
export function Logo({
  light = false,
  compact = false,
}: {
  light?: boolean
  compact?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex shrink-0 items-center")}
      aria-label="Aeon Corporate home"
    >
      <img
        src="/brand/aeon-logo.png"
        alt="Aeon — Corporate & Business Advisors"
        width={600}
        height={200}
        className={cn(
          "w-auto object-contain transition-[height,transform] duration-300 group-hover:scale-[1.03]",
          light
            ? "h-14 brightness-0 invert max-[560px]:h-12"
            : compact
              ? "h-[38px] max-[560px]:h-[36px]"
              : "h-[50px] max-[560px]:h-[40px]",
        )}
      />
    </Link>
  )
}
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "mb-[17px] flex items-center gap-2 text-xs font-black tracking-[0.18em] text-brand",
        className,
      )}
    >
      <i className="inline-block size-[7px] rounded-full bg-sun" />
      {children}
    </p>
  )
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string
  title: string
  description?: string
  light?: boolean
}) {
  return (
    <div>
      <Eyebrow className={light ? "text-sun" : undefined}>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          "max-w-[680px] text-[clamp(34px,4.5vw,58px)] leading-none font-bold tracking-[-0.04em] max-[560px]:text-[37px]",
          light && "text-white",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-[19px] max-w-[570px] text-sm leading-[1.75] max-[560px]:text-[15px] max-[560px]:leading-[1.65]",
            light ? "text-white/60" : "text-mute",
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}

/** Scroll-reveal props for framer-motion elements. */
export const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, delay: i * 0.1 },
})

/** Decorative dot grid. */
export const dots =
  "bg-[radial-gradient(circle,rgba(27,95,217,.4)_1.6px,transparent_2.2px)] [background-size:16px_16px]"
