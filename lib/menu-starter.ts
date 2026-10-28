import type { MenuInput } from "@/lib/menu"
import { STARTUP_CATEGORIES, startupPages } from "@/lib/startup-data"
import { IP_CATEGORIES, ipPages } from "@/lib/ip-data"
import { COMPLIANCE_CATEGORIES, compliancePages } from "@/lib/compliance-data"
import { REGULATORY_CATEGORIES, regulatoryPages } from "@/lib/regulatory-data"
import { ENVIRONMENTAL_CATEGORIES, environmentalPages } from "@/lib/environmental-data"

const C = "/contact-us" // every link opens the contact page until its own page exists

const mk = (label: string, links: string[]) => ({
  label,
  href: "",
  links: links.map((l) => ({ label: l, href: C })),
})

/** Startup menu: every link opens its own service page (/services/<slug>). */
export function startupTop(): MenuInput["tops"][number] {
  const slugOf = new Map(startupPages().map((p) => [`${p.category}|${p.label}`, p.slug]))
  return {
    label: "Startup",
    href: "",
    categories: STARTUP_CATEGORIES.map((c) => ({
      label: c.label,
      href: "",
      links: c.links.map((l) => ({ label: l, href: `/services/${slugOf.get(`${c.label}|${l}`)}` })),
    })),
  }
}

/** IP & Trademark menu: every link opens its own service page. */
export function ipTop(): MenuInput["tops"][number] {
  const taken = new Set(startupPages().map((p) => p.slug))
  const slugOf = new Map(ipPages(taken).map((p) => [`${p.category}|${p.label}`, p.slug]))
  return {
    label: "IP & Trademark",
    href: "",
    categories: IP_CATEGORIES.map((c) => ({
      label: c.label,
      href: "",
      links: c.links.map((l) => ({ label: l, href: `/services/${slugOf.get(`${c.label}|${l}`)}` })),
    })),
  }
}

/** Compliance menu: every link opens its own service page. */
export function complianceTop(): MenuInput["tops"][number] {
  const start = startupPages()
  const ip = ipPages(new Set(start.map((p) => p.slug)))
  const slugOf = new Map(compliancePages(new Set([...start, ...ip].map((p) => p.slug))).map((p) => [`${p.category}|${p.label}`, p.slug]))
  return {
    label: "Compliance",
    href: "",
    categories: COMPLIANCE_CATEGORIES.map((c) => ({
      label: c.label,
      href: "",
      links: c.links.map((l) => ({ label: l, href: `/services/${slugOf.get(`${c.label}|${l}`)}` })),
    })),
  }
}

/** Regulatory menu: every link opens its own service page. */
export function regulatoryTop(): MenuInput["tops"][number] {
  const start = startupPages()
  const ip = ipPages(new Set(start.map((p) => p.slug)))
  const compliance = compliancePages(new Set([...start, ...ip].map((p) => p.slug)))
  const slugOf = new Map(
    regulatoryPages(new Set([...start, ...ip, ...compliance].map((p) => p.slug))).map((p) => [`${p.category}|${p.label}`, p.slug]),
  )
  return {
    label: "Regulatory",
    href: "",
    categories: REGULATORY_CATEGORIES.map((c) => ({
      label: c.label,
      href: "",
      links: c.links.map((l) => ({ label: l, href: `/services/${slugOf.get(`${c.label}|${l}`)}` })),
    })),
  }
}

/** Environmental menu: every link opens its own service page. */
export function environmentalTop(): MenuInput["tops"][number] {
  const start = startupPages()
  const ip = ipPages(new Set(start.map((p) => p.slug)))
  const compliance = compliancePages(new Set([...start, ...ip].map((p) => p.slug)))
  const regulatory = regulatoryPages(new Set([...start, ...ip, ...compliance].map((p) => p.slug)))
  const slugOf = new Map(
    environmentalPages(new Set([...start, ...ip, ...compliance, ...regulatory].map((p) => p.slug))).map((p) => [`${p.category}|${p.label}`, p.slug]),
  )
  return {
    label: "Environmental",
    href: "",
    categories: ENVIRONMENTAL_CATEGORIES.map((c) => ({
      label: c.label,
      href: "",
      links: c.links.map((l) => ({ label: l, href: `/services/${slugOf.get(`${c.label}|${l}`)}` })),
    })),
  }
}

/**
 * First menu, based on the service groups of the reference site. Every link goes
 * to Contact Us for now; change each one under Admin > Menus when its page exists.
 */
export const STARTER_MENU: MenuInput["tops"] = [
  startupTop(),
  ipTop(),
  complianceTop(),
  regulatoryTop(),
  environmentalTop(),
]
