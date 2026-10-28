/**
 * Pages that exist on the website, so the menu editor can show WHICH page a
 * link opens. Add a line here whenever a new public page is created.
 */
export const SITE_PAGES: { path: string; name: string }[] = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About Us" },
  { path: "/contact-us", name: "Contact Us" },
  { path: "/partner-with-us", name: "Partner With Us" },
  { path: "/work-at-aeon", name: "Work at Aeon" },
  { path: "/career", name: "Careers" },
  { path: "/reviews", name: "Client Reviews" },
  { path: "/privacy-policy", name: "Privacy Policy" },
  { path: "/terms-and-conditions", name: "Terms & Conditions" },
]

/** Human description of where a link goes (shown next to the link in admin). */
export function describeHref(href: string | null | undefined): {
  kind: "none" | "page" | "section" | "external" | "unknown"
  text: string
} {
  const h = (href ?? "").trim()
  if (!h) return { kind: "none", text: "No link" }
  if (/^https?:\/\//i.test(h)) return { kind: "external", text: `External: ${new URL(h).host}` }
  const [path, hash] = h.split("#")
  const page = SITE_PAGES.find((p) => p.path === (path || "/"))
  if (!page) return { kind: "unknown", text: "Page not found on the site yet" }
  return hash
    ? { kind: "section", text: `${page.name} → section #${hash}` }
    : { kind: "page", text: page.name }
}

/** Only internal paths and https links are allowed in menus. */
export const isSafeHref = (href: string) =>
  /^\/(?!\/)[\w\-./#?=&%]*$/.test(href) || /^https:\/\/[^\s]+$/i.test(href)
