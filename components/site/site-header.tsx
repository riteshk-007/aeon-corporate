"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion"
import {
  ArrowRight,
  ChevronDown,
  Mail,
  Menu,
  Phone,
  X,
  ChevronRight,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ColorIcon,
  Logo,
  btnBlue,
  btnOutline,
} from "@/components/site/ui"
import { companyLinks } from "@/lib/site-data"
import { TopBar } from "@/components/site/top-bar"
import type { MenuTop } from "@/lib/menu"

const companyIcons: Record<string, string> = {
  "About Us": "company",
  "Partner With Us": "advisory",
  "Work at Aeon": "expert",
  Career: "briefcase",
  "Client Reviews": "approved",
  "Contact Us": "mail",
}

export function SiteHeader({ menu }: { menu: MenuTop[] }) {
  const pathname = usePathname()
  const [panelOpen, setPanelOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
  })
  const [catIdx, setCatIdx] = useState(0)
  const [hoverNav, setHoverNav] = useState<string | null>(null)
  const [openNav, setOpenNav] = useState<string | null>(null)
  const closeTimer = useRef<number | undefined>(undefined)

  const openMenu = (label: string) => {
    window.clearTimeout(closeTimer.current)
    if (label !== openNav) setCatIdx(0)
    setOpenNav(label)
    setHoverNav(label)
  }
  /** Small delay so moving the mouse into the panel doesn't flicker it shut. */
  const closeMenu = (delay = 140) => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setOpenNav(null)
      setHoverNav(null)
    }, delay)
  }
  const closeNow = () => {
    window.clearTimeout(closeTimer.current)
    setOpenNav(null)
    setHoverNav(null)
      ; (document.activeElement as HTMLElement | null)?.blur()
  }
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        setPanelOpen(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    setOpenNav(null)
    setHoverNav(null)
    setMenuOpen(false)
    setPanelOpen(false)
  }, [pathname])

  const openTop = menu.find((m) => m.label === openNav && m.categories.length > 1)
  // The menu that owns the page you are on (a service page belongs to the menu that lists it).
  const activeTop = menu.find(
    (m) => m.href === pathname || m.categories.some((c) => c.href === pathname || c.links.some((l) => l.href === pathname)),
  )?.label

  return (
    <>
      <TopBar hidden={scrolled} />
      <header
        className={cn(
          "fixed inset-x-0 z-50 border-b border-line/80 bg-white transition-[top,box-shadow] duration-300 max-[1024px]:top-0",
          scrolled ? "top-0 shadow-[0_8px_30px_rgba(11,27,77,.10)]" : "top-10 shadow-none",
        )}
      >
        <div
          className={cn(
            "relative mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-4 transition-[height] duration-300 sm:px-6 lg:px-8 max-[1279px]:gap-3",
            "h-[84px]",
            "max-[560px]:h-[64px]",
          )}
        >
          <Logo />
          <nav
            aria-label="Main"
            className="mr-3 ml-auto flex items-center gap-0 max-[1024px]:hidden"
            onMouseLeave={() => setHoverNav(null)}
          >
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={cn(
                "relative inline-flex items-center px-2.5 py-2 text-[13.5px] font-extrabold tracking-[.04em] max-[1279px]:px-1.5 max-[1279px]:text-[12.5px] max-[1279px]:tracking-[.02em] whitespace-nowrap uppercase transition-colors duration-200 hover:text-brand hover:after:scale-x-100 after:absolute after:inset-x-2.5 after:-bottom-[3px] after:h-[3px] after:origin-left after:rounded-full after:bg-sun after:transition-transform after:duration-200",
                pathname === "/" ? "rounded-md bg-[#dcebff] text-brand after:scale-x-0 hover:after:scale-x-0" : "rounded-md text-ink/80 after:scale-x-0",
              )}
            >
              Home
            </Link>
            {menu.map(({ label, href, categories }, mi) => {
              const plain = categories.length === 0
              const small = categories.length === 1
              return plain ? (
                <Link
                  key={label}
                  href={href || "/contact-us"}
                  onClick={closeNow}
                  aria-current={activeTop === label ? "page" : undefined}
                  className={cn(
                    "relative inline-flex items-center rounded-md px-2.5 py-2 text-[13.5px] font-extrabold tracking-[.04em] max-[1279px]:px-1.5 max-[1279px]:text-[12.5px] max-[1279px]:tracking-[.02em] whitespace-nowrap uppercase transition-colors duration-200 after:absolute after:inset-x-2.5 after:-bottom-[3px] after:h-[3px] after:origin-left after:rounded-full after:bg-sun after:transition-transform after:duration-200 hover:text-brand hover:after:scale-x-100",
                    activeTop === label ? "bg-[#dcebff] text-brand after:scale-x-0 hover:after:scale-x-0" : "text-ink/80 after:scale-x-0",
                  )}
                >
                  {label}
                </Link>
              ) : (
              <div
                key={label}
                className="relative"
                onMouseEnter={() => openMenu(label)}
                onMouseLeave={() => closeMenu()}
                onFocus={() => openMenu(label)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMenu(60)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeNow()
                }}
              >
                <Link
                  href={href || "/#services"}
                  onClick={closeNow}
                  aria-haspopup="true"
                  aria-expanded={openNav === label}
                  className={cn(
                    "relative inline-flex items-center gap-1 px-2.5 py-2 text-[13.5px] font-extrabold tracking-[.04em] max-[1279px]:px-1.5 max-[1279px]:text-[12.5px] max-[1279px]:tracking-[.02em] whitespace-nowrap uppercase transition-colors duration-200 after:absolute after:inset-x-2.5 after:-bottom-[3px] after:h-[3px] after:origin-left after:rounded-full after:bg-sun after:transition-transform after:duration-200",
                    activeTop === label && "rounded-md bg-[#dcebff]",
                    activeTop !== label && "rounded-md",
                    activeTop === label ? "text-brand after:scale-x-0" : openNav === label || hoverNav === label ? "text-brand after:scale-x-100" : "text-ink/80 after:scale-x-0",
                  )}
                >
                  <span className="relative">{label}</span>
                  <ChevronDown
                    size={14}
                    className={cn("relative transition-transform duration-200", openNav === label && "rotate-180")}
                  />
                </Link>
                {/* Menus with a single group open as a small list under the item instead of the wide panel */}
                {small && (
                  <div
                    className={cn(
                      "absolute top-full z-10 w-[270px] pt-2 transition duration-200 max-[1024px]:hidden",
                      mi >= menu.length - 2 ? "right-0" : "left-0",
                      openNav === label ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0",
                    )}
                  >
                    <ul className="overflow-hidden rounded-lg border border-line bg-white p-2 shadow-[0_24px_60px_rgba(11,27,77,.18)]">
                      {categories[0].links.map((l, i) => (
                        <li key={l.label + i}>
                          <Link
                            href={l.href || "/contact-us"}
                            onClick={closeNow}
                            className={cn(
                              "block rounded-md px-3.5 py-2.5 text-[14px] font-semibold text-ink/85 transition-colors hover:bg-pale hover:text-brand",
                              l.href === pathname && "bg-pale text-brand",
                            )}
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              )
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button
              className="hidden size-10 items-center justify-center rounded-md border border-line bg-white max-[1024px]:flex"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {/* Mega menu: categories on the left, their links on the right */}
          <div
            className={cn(
              "absolute inset-x-4 top-full z-10 pt-2 transition sm:inset-x-6 lg:inset-x-8 duration-200 max-[1024px]:hidden",
              openTop ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0",
            )}
            onMouseEnter={() => openNav && openMenu(openNav)}
            onMouseLeave={() => closeMenu()}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeNow()
            }}
          >
            {openTop && (
              <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_30px_80px_rgba(11,27,77,.2)]">
                {openTop.categories.length === 0 ? (
                  <p className="p-6 text-[14px] text-mute">No links yet.</p>
                ) : (
                  <div className="grid h-[min(70dvh,520px)] grid-cols-[270px_1fr] grid-rows-[minmax(0,1fr)_auto]">
                    <ul
                      className="row-span-1 min-h-0 overflow-y-auto overscroll-contain border-r border-line bg-[linear-gradient(180deg,#f3f8ff,#eaf2ff)] p-3"
                      role="tablist"
                      aria-label={`${openTop.label} categories`}
                    >
                      <li className="px-2 pt-1 pb-2 text-[11px] font-black tracking-[.16em] text-brand/80 uppercase">{openTop.label}</li>
                      {openTop.categories.map((c, i) => (
                        <li key={c.label + i}>
                          <button
                            type="button"
                            role="tab"
                            aria-selected={catIdx === i}
                            onMouseEnter={() => setCatIdx(i)}
                            onFocus={() => setCatIdx(i)}
                            onClick={() => setCatIdx(i)}
                            className={cn(
                              "group relative flex w-full items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left text-[14px] font-bold transition-all",
                              catIdx === i
                                ? "bg-white text-brand shadow-[0_8px_20px_rgba(63,109,246,.16)] ring-1 ring-brand/15"
                                : "text-ink/80 hover:bg-white/70 hover:text-ink",
                            )}
                          >
                            {catIdx === i && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-1 rounded-full bg-sun" />}
                            <span className="min-w-0 leading-snug">{c.label}</span>
                            <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-extrabold text-brand tabular-nums">{c.links.length}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="min-h-0 overflow-y-auto overscroll-contain p-6">
                      {(() => {
                        const cat = openTop.categories[Math.min(catIdx, openTop.categories.length - 1)]
                        return (
                          <>
                            <div className="mb-4 flex items-center justify-between gap-4 border-b border-line pb-3">
                              <h3 className="text-[20px] font-extrabold tracking-[-0.02em] text-ink">{cat.label}</h3>
                              {cat.href ? (
                                <Link href={cat.href} onClick={closeNow} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[13px] font-bold text-white transition hover:bg-[#2c55d6]">
                                  View overview <ArrowRight size={14} />
                                </Link>
                              ) : (
                                <span className="shrink-0 text-[12px] font-bold text-mute">{cat.links.length} services</span>
                              )}
                            </div>
                            {cat.links.length === 0 ? (
                              <p className="text-[13px] text-mute">No links yet.</p>
                            ) : (
                              <ul className="grid grid-cols-3 gap-2 max-[1280px]:grid-cols-2">
                                {cat.links.map((l, i) => (
                                  <li key={l.label + i}>
                                    <Link
                                      href={l.href || "/contact-us"}
                                      onClick={closeNow}
                                      className={cn(
                                        "group flex h-full items-center justify-between gap-2 rounded-lg border border-transparent bg-[#f6faff] px-3.5 py-3 text-[13.5px] leading-snug font-semibold text-ink/90 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:bg-white hover:text-brand hover:shadow-[0_10px_24px_rgba(63,109,246,.14)]",
                                        l.href === pathname && "border-brand/30 bg-white text-brand",
                                      )}
                                    >
                                      <span className="min-w-0">{l.label}</span>
                                      <ArrowRight size={14} className="shrink-0 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        )
                      })()}
                    </div>
                    <div className="col-span-2 flex items-center justify-between gap-4 border-t border-line bg-[#fbfdff] px-6 py-3 text-[13px]">
                      <span className="text-mute">Not sure which service you need? Our team replies within 24 hours.</span>
                      <Link href="/contact-us" onClick={closeNow} className="inline-flex items-center gap-1.5 font-bold text-brand hover:underline">
                        Talk to an expert <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <motion.div
            aria-hidden="true"
            style={{ scaleX: scrollProgress }}
            className={cn(
              "absolute inset-x-0 bottom-[-1px] h-[3px] origin-left bg-[linear-gradient(90deg,#3f6df6,#ffbe0b)] transition-opacity duration-300",
              scrolled ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                key="backdrop"
                aria-hidden="true"
                className="fixed inset-0 -z-10 bg-ink/40 backdrop-blur-sm min-[1025px]:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
              />
              <motion.nav
                key="sheet"
                aria-label="Mobile"
                className="mx-auto flex max-h-[calc(100dvh-72px)] w-full flex-col overflow-y-auto border-t border-line bg-white p-3 shadow-[0_28px_70px_rgba(11,27,77,.25)] min-[1025px]:hidden"
                initial={{ opacity: 0, y: -14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between border-b border-line px-2 py-4 text-[15px] font-bold",
                    pathname === "/" && "text-brand",
                  )}
                >
                  Home
                  <ChevronRight size={18} className="text-mute" />
                </Link>
                {menu.map(({ label, href, categories }) =>
                  categories.length === 0 ? (
                    <Link
                      key={label}
                      href={href || "/contact-us"}
                      onClick={() => setMenuOpen(false)}
                      className={cn("flex items-center justify-between border-b border-line px-2 py-4 text-[15px] font-bold", activeTop === label && "text-brand")}
                    >
                      {label}
                      <ChevronRight size={18} className="text-mute" />
                    </Link>
                  ) : categories.length === 1 ? (
                    <details key={label} className="group border-b border-line">
                      <summary className="flex cursor-pointer list-none items-center gap-3 px-2 py-4 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
                        <span className="flex-1">{label}</span>
                        <ChevronDown size={18} className="shrink-0 text-mute transition-transform duration-200 group-open:rotate-180" />
                      </summary>
                      <div className="grid pb-3 pl-3">
                        {categories[0].links.map((l, li) => (
                          <Link
                            key={l.label + li}
                            href={l.href || "/contact-us"}
                            onClick={() => setMenuOpen(false)}
                            className="rounded-lg px-3 py-2.5 text-[14px] font-semibold text-mute hover:bg-[#f6faff] hover:text-brand"
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : (
                  <details key={label} className="group border-b border-line">
                    <summary className="flex cursor-pointer list-none items-center gap-3 px-2 py-4 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
                      <span className="flex-1">{label}</span>
                      <ChevronDown size={18} className="shrink-0 text-mute transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <div className="grid gap-1 pb-3">
                      {categories.map((c, ci) => (
                        <details key={c.label + ci} className="group/cat rounded-lg bg-[#f6faff]">
                          <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-3 text-[14px] font-semibold [&::-webkit-details-marker]:hidden">
                            <span className="flex-1">{c.label}</span>
                            <ChevronRight size={16} className="shrink-0 text-mute transition-transform duration-200 group-open/cat:rotate-90" />
                          </summary>
                          <div className="grid pb-2 pl-3">
                            {c.links.map((l, li) => (
                              <Link
                                key={l.label + li}
                                href={l.href || "/contact-us"}
                                onClick={() => setMenuOpen(false)}
                                className="rounded-lg px-3 py-2 text-[13px] text-mute hover:bg-white hover:text-brand"
                              >
                                {l.label}
                              </Link>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </details>
                  ),
                )}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href="/contact-us"
                    onClick={() => setMenuOpen(false)}
                    className={cn(btnOutline, "gap-2")}
                  >
                    <Phone size={15} /> Contact us
                  </Link>
                  <Link
                    href="mailto:support@aeoncorporate.com"
                    className={cn(btnOutline, "gap-2")}
                  >
                    <Mail size={15} /> Email
                  </Link>
                </div>
                <Link
                  className={cn(btnBlue, "mt-2")}
                  href="/#contact"
                  onClick={() => setMenuOpen(false)}
                >
                  Get consultation <ArrowRight size={15} />
                </Link>
              </motion.nav>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {panelOpen && (
            <>
              <motion.div
                key="panel-backdrop"
                aria-hidden="true"
                className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm max-[1024px]:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPanelOpen(false)}
              />
              <motion.aside
                key="panel"
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                className="fixed top-0 right-0 bottom-0 z-[70] flex w-[min(420px,100%)] flex-col overflow-y-auto rounded-l-lg bg-white p-6 shadow-[0_30px_90px_rgba(11,27,77,.35)] max-[1024px]:hidden"
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 48 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between">
                  <Logo />
                  <button
                    type="button"
                    onClick={() => setPanelOpen(false)}
                    aria-label="Close menu"
                    className="grid size-10 place-items-center rounded-lg border border-line hover:border-brand hover:text-brand"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="mt-8 mb-3 text-[11px] font-black tracking-[.18em] text-brand">
                  EXPLORE AEON
                </p>
                <ul className="grid gap-1">
                  {companyLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setPanelOpen(false)}
                        aria-current={
                          pathname === item.href ? "page" : undefined
                        }
                        className={cn(
                          "group flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-[16px] font-bold transition-colors hover:bg-[#eaf3ff]",
                          pathname === item.href && "bg-[#eaf3ff] text-brand",
                        )}
                      >
                        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-white shadow-[0_4px_12px_rgba(11,27,77,.12)] ring-1 ring-line">
                          <ColorIcon
                            name={companyIcons[item.label] ?? "company"}
                            size={30}
                          />
                        </span>
                        {item.label}
                        <ChevronRight
                          size={18}
                          className="ml-auto text-mute transition group-hover:translate-x-0.5 group-hover:text-brand"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      href="/contact-us"
                      className="flex flex-col items-center gap-1.5 rounded-lg bg-[#eaf3ff] px-2 py-3.5 text-[12px] font-bold hover:bg-[#dcebff]"
                    >
                      <Phone size={18} className="text-brand" /> Contact
                    </Link>
                    <Link
                      href="mailto:support@aeoncorporate.com"
                      className="flex flex-col items-center gap-1.5 rounded-lg bg-[#eaf3ff] px-2 py-3.5 text-[12px] font-bold hover:bg-[#dcebff]"
                    >
                      <Mail size={18} className="text-brand" /> Email
                    </Link>
                    <Link
                      href="/contact-us"
                      className="flex flex-col items-center gap-1.5 rounded-lg bg-[#eaf3ff] px-2 py-3.5 text-[12px] font-bold hover:bg-[#dcebff]"
                    >
                      <MessageCircle size={18} className="text-brand" />{" "}
                      Enquire
                    </Link>
                  </div>
                  <Link
                    href="/#contact"
                    onClick={() => setPanelOpen(false)}
                    className={cn(btnBlue, "mt-3 w-full")}
                  >
                    Get consultation <ArrowRight size={15} />
                  </Link>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
