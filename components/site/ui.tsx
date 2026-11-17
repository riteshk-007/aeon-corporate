import Link from "next/link"
import { cn } from "@/lib/utils"

/* Shared style tokens (Tailwind utilities) */
export const wrap =
  "mx-auto w-[min(1160px,calc(100%_-_48px))] max-[560px]:w-[min(calc(100%_-_32px),500px)]"
export const btn =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-[14px] font-bold transition duration-200 hover:-translate-y-0.5 motion-reduce:transition-none"
export const btnBlueFlat = `${btn} bg-brand text-white hover:bg-[#01398a]`
export const btnBlue = `${btnBlueFlat} shadow-[0_10px_23px_rgba(2,72,169,.22)]`
export const btnYellow = `${btn} bg-sun text-ink`
export const btnWhite = `${btn} bg-white text-ink`
export const btnOutline = `${btn} border border-[#bfcbe0] bg-white/70 text-ink`

const LINE: Record<string, string> = {
  accountant: "tax", advisory: "consulting", bag: "briefcase", bolt: "rocket", bulb: "idea", chip: "network",
  company: "government", factory: "briefcase", form: "checklist", health: "shield", laptop: "network",
  mail: "email", store: "briefcase", templates: "folder", "svc-approval": "approved", "svc-eligibility": "checklist",
  "svc-registration": "license", "svc-review": "folder", "svc-support": "consulting",
}

/** Black outline icon (Magnific set in /icons/line). Old colourful names map to the closest outline. */
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
      src={`/icons/line/${LINE[name] ?? name}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      style={{ width: size, height: size }}
      className={cn("shrink-0 object-contain [filter:brightness(0)]", className)}
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={light ? "/brand/aeon-logo-light.png" : "/brand/aeon-logo.png"}
        alt="Aeon: Corporate and Business Advisors"
        width={900}
        height={290}
        className={cn(
          "w-auto object-contain transition-[height] duration-300",
          light
            ? "h-24 max-[560px]:h-[76px]"
            : compact
              ? "h-12 max-[560px]:h-[42px]"
              : "h-[62px] max-[1100px]:h-14 max-[560px]:h-[50px]",
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
        )}
      >
        {(() => {
          const w = title.split(" ")
          const n = w.length > 3 ? 2 : 1
          return (
            <>
              <span className={light ? "text-white" : "text-brand"}>{w.slice(0, -n).join(" ")} </span>
              <span className="text-sun">{w.slice(-n).join(" ")}</span>
            </>
          )
        })()}
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
  "bg-[radial-gradient(circle,rgba(2,72,169,.4)_1.6px,transparent_2.2px)] [background-size:16px_16px]"
