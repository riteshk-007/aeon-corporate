"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
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
  wrap,
} from "@/components/site/ui"
import { companyLinks } from "@/lib/site-data"
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
    ;(document.activeElement as HTMLElement | null)?.blur()
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

  const openTop = menu.find((m) => m.label === openNav)

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-40 flex h-9 items-center border-b border-white/10 bg-ink text-xs text-white/75 transition-transform duration-300 max-[1024px]:hidden",
          scrolled && "-translate-y-full",
        )}
      >
        <div className={cn(wrap, "flex items-center justify-between")}>
          <span className="flex items-center gap-2">
            <i className="size-1.5 rounded-full bg-sun" />
            Technology-enabled corporate guidance for ambitious businesses
          </span>
          <span className="flex items-center gap-5">
            <Link
              href="tel:+910000000000"
              className="inline-flex items-center gap-1.5 hover:text-sun"
            >
              <Phone size={13} /> +91 00000 00000
            </Link>
            <Link
              href="mailto:hello@aeoncorporate.com"
              className="inline-flex items-center gap-1.5 hover:text-sun"
            >
              <Mail size={13} /> hello@aeoncorporate.com
            </Link>
          </span>
        </div>
      </div>

      <header
        className={cn(
          "fixed inset-x-0 z-50 transition-[top] duration-300 max-[1024px]:top-4 max-[560px]:top-2.5",
          scrolled ? "top-4" : "top-[52px]",
        )}
      >
        <div
          className={cn(
            wrap,
            "relative flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 backdrop-blur-xl max-[560px]:px-3 transition-all duration-300",
            scrolled
              ? "h-[58px] shadow-[0_18px_50px_rgba(11,27,77,.14)]"
              : "h-[70px] shadow-[0_14px_45px_rgba(11,27,77,.08)]",
            "max-[560px]:h-[56px]",
          )}
        >
          <Logo compact={scrolled} />
          <nav
            aria-label="Main"
            className="mr-3 ml-auto flex items-center gap-0 max-[1024px]:hidden"
            onMouseLeave={() => setHoverNav(null)}
          >
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={cn(
                "inline-flex items-center rounded-lg px-3 py-2 text-[13px] font-bold whitespace-nowrap transition-colors duration-200 hover:bg-[#dcebff] hover:text-brand",
                pathname === "/" ? "bg-[#dcebff] text-brand" : "text-mute",
              )}
            >
              Home
            </Link>
            {menu.map(({ label, href }) => (
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
                    "relative inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-bold whitespace-nowrap transition-colors duration-200",
                    openNav === label ? "text-brand" : "text-mute",
                  )}
                >
                  {hoverNav === label && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-[#dcebff]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                  <ChevronDown
                    size={14}
                    className={cn("relative transition-transform duration-200", openNav === label && "rotate-180")}
                  />
                </Link>
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              className={cn(
                btnBlue,
                "h-10 shrink-0 px-5 whitespace-nowrap max-[1024px]:hidden",
              )}
              href="/#contact"
            >
              Get consultation <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              onClick={() => setPanelOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={panelOpen}
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-white transition hover:border-brand hover:bg-[#eaf3ff] hover:text-brand max-[1024px]:hidden"
            >
              <Menu size={20} />
            </button>
            <button
              className="hidden size-10 items-center justify-center rounded-xl border border-line bg-white max-[1024px]:flex"
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
              "absolute inset-x-0 top-full z-10 pt-3 transition duration-200 max-[1024px]:hidden",
              openTop ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0",
            )}
            onMouseEnter={() => openNav && openMenu(openNav)}
            onMouseLeave={() => closeMenu()}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeNow()
            }}
          >
            {openTop && (
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_28px_70px_rgba(11,27,77,.18)]">
                {openTop.categories.length === 0 ? (
                  <p className="p-6 text-[14px] text-mute">No links yet.</p>
                ) : (
                  <div className={cn("grid h-[min(72dvh,540px)] grid-rows-[minmax(0,1fr)]", openTop.categories.length > 1 ? "grid-cols-[250px_1fr]" : "grid-cols-1")}>
                    {openTop.categories.length > 1 && (
                      <ul className="min-h-0 overflow-y-auto overscroll-contain border-r border-line bg-[#f6faff] p-2.5" role="tablist" aria-label={`${openTop.label} categories`}>
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
                                "flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-[14px] font-semibold transition-colors",
                                catIdx === i ? "bg-brand text-white shadow-[0_8px_18px_rgba(27,95,217,.25)]" : "text-ink hover:bg-pale",
                              )}
                            >
                              <span className="min-w-0 leading-snug">{c.label}</span>
                              <ChevronRight size={15} className="shrink-0 opacity-70" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="min-h-0 overflow-y-auto overscroll-contain p-6 pb-10">
                      {(() => {
                        const cat = openTop.categories[Math.min(catIdx, openTop.categories.length - 1)]
                        return (
                          <>
                            <h3 className="mb-3 text-[18px] font-extrabold tracking-[-0.02em] text-royal">
                              {cat.href ? (
                                <Link href={cat.href} onClick={closeNow} className="hover:underline">{cat.label}</Link>
                              ) : (
                                cat.label
                              )}
                            </h3>
                            {cat.links.length === 0 ? (
                              <p className="text-[13px] text-mute">No links yet.</p>
                            ) : (
                              <ul className="columns-2 gap-x-10 [&>li]:break-inside-avoid">
                                {cat.links.map((l, i) => (
                                  <li key={l.label + i}>
                                    <Link
                                      href={l.href || "/contact-us"}
                                      onClick={closeNow}
                                      className="block rounded-lg px-2 py-1.5 text-[14px] text-ink/85 transition-colors hover:bg-pale hover:text-brand"
                                    >
                                      {l.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        )
                      })()}
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
              "absolute inset-x-5 bottom-0 h-[3px] origin-left rounded-full bg-[linear-gradient(90deg,#1b5fd9,#ffd93d)] transition-opacity duration-300",
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
                className="mx-auto mt-2 flex max-h-[calc(100dvh-90px)] w-[min(560px,calc(100%_-_32px))] flex-col overflow-y-auto rounded-3xl border border-line bg-white p-3 shadow-[0_28px_70px_rgba(11,27,77,.25)] min-[1025px]:hidden"
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
                {menu.map(({ label, categories }) => (
                  <details key={label} className="group border-b border-line">
                    <summary className="flex cursor-pointer list-none items-center gap-3 px-2 py-4 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
                      <span className="flex-1">{label}</span>
                      <ChevronDown size={18} className="shrink-0 text-mute transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <div className="grid gap-1 pb-3">
                      {categories.map((c, ci) => (
                        <details key={c.label + ci} className="group/cat rounded-xl bg-[#f6faff]">
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
                ))}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href="tel:+910000000000"
                    className={cn(btnOutline, "gap-2")}
                  >
                    <Phone size={15} /> Call us
                  </Link>
                  <Link
                    href="mailto:hello@aeoncorporate.com"
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
                className="fixed top-4 right-4 bottom-4 z-[70] flex w-[min(400px,calc(100%_-_32px))] flex-col overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_30px_90px_rgba(11,27,77,.35)] max-[1024px]:hidden"
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
                    className="grid size-10 place-items-center rounded-xl border border-line hover:border-brand hover:text-brand"
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
                          "group flex items-center gap-3.5 rounded-2xl px-3 py-2.5 text-[16px] font-bold transition-colors hover:bg-[#eaf3ff]",
                          pathname === item.href && "bg-[#eaf3ff] text-brand",
                        )}
                      >
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white shadow-[0_4px_12px_rgba(11,27,77,.12)] ring-1 ring-line">
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
                      href="tel:+910000000000"
                      className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#eaf3ff] px-2 py-3.5 text-[12px] font-bold hover:bg-[#dcebff]"
                    >
                      <Phone size={18} className="text-brand" /> Call
                    </Link>
                    <Link
                      href="mailto:hello@aeoncorporate.com"
                      className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#eaf3ff] px-2 py-3.5 text-[12px] font-bold hover:bg-[#dcebff]"
                    >
                      <Mail size={18} className="text-brand" /> Email
                    </Link>
                    <Link
                      href="/contact-us"
                      className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#eaf3ff] px-2 py-3.5 text-[12px] font-bold hover:bg-[#dcebff]"
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
