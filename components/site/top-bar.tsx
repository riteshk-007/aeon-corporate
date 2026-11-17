import { Mail, MapPin, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { contactInfo } from "@/lib/site-data"

const link = "inline-flex items-center gap-2 transition-colors hover:text-sun"

/** Slim bar above the header with the phone number, WhatsApp, email and offices, in plain sight. */
export function TopBar({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-[51] h-10 border-b border-white/10 bg-ink text-[13px] font-semibold text-white/90 transition-transform duration-300 max-[1024px]:hidden",
        hidden && "-translate-y-full",
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <span className="flex items-center gap-2 text-white/70 max-[1280px]:hidden">
          <MapPin size={15} className="text-sun" />
          {contactInfo.cities.join(" · ")}
        </span>
        <div className="ml-auto flex items-center gap-6">
          <a href={`tel:+${contactInfo.phone}`} className={link}>
            <Phone size={15} className="text-sun" />
            {contactInfo.phoneDisplay}
          </a>
          <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className={link}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/whatsapp.png" alt="" aria-hidden="true" width={16} height={16} className="size-4" />
            WhatsApp: {contactInfo.phoneDisplay}
          </a>
          <a href={`mailto:${contactInfo.email}`} className={link}>
            <Mail size={15} className="text-sun" />
            {contactInfo.email}
          </a>
        </div>
      </div>
    </div>
  )
}
