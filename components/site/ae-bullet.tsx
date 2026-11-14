import { cn } from "@/lib/utils"

/** The round "ae" mark from the logo, used as the bullet across the site. */
export function AeBullet({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/aeon-bullet.png" alt="" aria-hidden="true" width={20} height={20} className={cn("size-5 shrink-0", className)} />
  )
}
