"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  Factory,
  Mail,
  MapPin,
  Menu,
  Phone,
  Play,
  Quote,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion"
import { cn } from "@/lib/utils"
import { ComplianceCalendar } from "@/components/ui/compliance-calendar"
import { HeroBackdrop } from "@/components/ui/hero-backdrop"
import { HandDrawnFrame } from "@/components/ui/hand-writing-text"

const categories = [
  "Business Registration",
  "Government Registration",
  "Government Licenses",
  "RBI Regulatory",
  "Environment Laws",
  "Tax Filing",
  "Intellectual Property",
]
const categoryServices: Record<
  string,
  { title: string; description: string }[]
> = {
  "Business Registration": [
    {
      title: "Private Limited Company",
      description:
        "Build a structured foundation for your next stage of growth.",
    },
    {
      title: "LLP Registration",
      description: "A flexible, protected structure for modern partnerships.",
    },
    {
      title: "Partnership Firm",
      description: "Set up your partnership with clear documentation.",
    },
    {
      title: "One Person Company",
      description: "Turn an independent venture into a formal business.",
    },
  ],
  "Government Registration": [
    {
      title: "MSME / Udyam Registration",
      description: "Unlock a clearer path to government schemes and support.",
    },
    {
      title: "IEC Registration",
      description: "Prepare your business for international trade.",
    },
    {
      title: "Drone Registration",
      description: "Organize the documentation for your drone operations.",
    },
    {
      title: "EPF Registration",
      description: "Create the right foundation for your growing team.",
    },
  ],
  "Government Licenses": [
    {
      title: "FSSAI License",
      description: "Support your food business with the right application.",
    },
    {
      title: "PSARA License",
      description: "Guidance for private security agency licensing.",
    },
    {
      title: "Trade License",
      description: "Navigate local business licensing requirements.",
    },
    {
      title: "Factory License",
      description: "Structure manufacturing permissions with confidence.",
    },
  ],
  "RBI Regulatory": [
    {
      title: "RBI Compliance Advisory",
      description: "Make regulatory requirements easier to understand.",
    },
    {
      title: "NBFC Guidance",
      description: "Practical support for financial services businesses.",
    },
    {
      title: "FEMA Compliance",
      description: "Bring clarity to cross-border business obligations.",
    },
    {
      title: "Financial Documentation",
      description: "Keep critical regulatory paperwork organized.",
    },
  ],
  "Environment Laws": [
    {
      title: "Pollution Control Permissions",
      description: "Prepare the right documents for your operations.",
    },
    {
      title: "E-Waste Management",
      description: "Build responsible systems for electronic waste.",
    },
    {
      title: "Plastic Waste Management",
      description: "Move sustainability requirements into action.",
    },
    {
      title: "Environmental Licensing",
      description: "Understand the permissions relevant to your site.",
    },
  ],
  "Tax Filing": [
    {
      title: "GST Registration",
      description: "Get your tax setup ready for business activity.",
    },
    {
      title: "GST Return Assistance",
      description: "Keep recurring filing processes structured.",
    },
    {
      title: "Income Tax Support",
      description: "Prepare and manage key tax responsibilities.",
    },
    {
      title: "TDS Compliance",
      description: "Make withholding obligations more manageable.",
    },
  ],
  "Intellectual Property": [
    {
      title: "Trademark Registration",
      description: "Protect the identity your business is building.",
    },
    {
      title: "Copyright Registration",
      description: "Create clearer ownership around original work.",
    },
    {
      title: "Patent Filing Assistance",
      description: "Organize the journey from idea to application.",
    },
    {
      title: "Design Registration",
      description: "Support distinctive product and brand design.",
    },
  ],
}
const quickServices = [
  "Company Registration",
  "GST Registration",
  "ISO Certification",
  "NGO Registration",
  "Trademark Registration",
  "PSARA License",
  "CDSCO Registration",
  "Environmental Compliance",
  "EPR Registration",
  "E-Waste EPR",
  "Plastic Waste EPR",
]

const tones = {
  blue: { card: "bg-brand text-white", icon: "bg-white" },
  navy: { card: "bg-ink text-white", icon: "bg-white" },
  white: { card: "bg-white", icon: "bg-[#eaf3ff]" },
  pale: { card: "bg-[#dcebff]", icon: "bg-white" },
  yellow: { card: "bg-sun", icon: "bg-white" },
} as const

const serviceCards: {
  icon: string
  title: string
  description: string
  tone: keyof typeof tones
  className: string
}[] = [
  {
    icon: "rocket",
    title: "Startup Registration",
    description:
      "Company incorporation, LLP setup, startup recognition, and more.",
    tone: "blue",
    className: "col-span-2 min-[901px]:row-span-2",
  },
  {
    icon: "tax",
    title: "Tax and Auditing",
    description:
      "GST, income tax, accounting, and recurring compliance support.",
    tone: "yellow",
    className: "",
  },
  {
    icon: "eco",
    title: "Environmental Consultancy",
    description:
      "Practical guidance for permits, waste, and sustainability obligations.",
    tone: "pale",
    className: "",
  },
  {
    icon: "advisory",
    title: "Advisory and Consultancy",
    description:
      "Clear advice for contracts, documentation, and business decisions.",
    tone: "navy",
    className: "col-span-2",
  },
  {
    icon: "shield",
    title: "Regulatory Compliance",
    description: "BIS, CDSCO, ISO, and industry-specific regulatory support.",
    tone: "white",
    className: "",
  },
  {
    icon: "license",
    title: "Licensing",
    description: "FSSAI, PSARA, trade, factory, and other business licenses.",
    tone: "pale",
    className: "",
  },
  {
    icon: "accountant",
    title: "On-Demand CA/CS Services",
    description:
      "Flexible access to accounting and company secretarial expertise.",
    tone: "white",
    className: "",
  },
  {
    icon: "templates",
    title: "Business Resources and Templates",
    description: "Templates, guides, and helpful compliance resources.",
    tone: "yellow",
    className: "",
  },
]
const articles = [
  {
    category: "BUSINESS & STARTUPS",
    title: "How businesses can prepare for their next stage of growth",
    description:
      "Practical considerations for building structured business operations.",
    image: "/illustrations/insight-startup.jpg",
  },
  {
    category: "COMPLIANCE & REGULATION",
    title: "Understanding the importance of proactive compliance",
    description: "How organized processes help businesses stay prepared.",
    image: "/illustrations/insight-compliance.jpg",
  },
  {
    category: "SUSTAINABILITY",
    title: "Building environmental responsibility into business strategy",
    description:
      "The role of environmental thinking in modern business planning.",
    image: "/illustrations/insight-sustainability.jpg",
  },
]
const testimonials = [
  {
    quote:
      "Aeon gave our team a clear path through a complicated setup. Every next step was explained in plain language.",
    name: "Maya Rao",
    role: "Founder, Northstar Studio",
    initials: "MR",
  },
  {
    quote:
      "The experience felt organized from our first conversation. We always knew what information was needed and why.",
    name: "Arjun Mehta",
    role: "Director, Meridian Works",
    initials: "AM",
  },
  {
    quote:
      "A thoughtful partner for the parts of business that usually slow you down. The guidance helped us move decisively.",
    name: "Leena Shah",
    role: "COO, Fieldhouse Labs",
    initials: "LS",
  },
]
const industries = [
  { label: "Technology", icon: "laptop" },
  { label: "Manufacturing", icon: "factory" },
  { label: "Retail", icon: "store" },
  { label: "Healthcare", icon: "health" },
  { label: "Professional Services", icon: "briefcase" },
  { label: "Consumer Brands", icon: "bag" },
]
const processSteps = [
  [
    "01",
    "Fill Up Application Form",
    "Share the context, goals, and requirements that matter.",
  ],
  [
    "02",
    "Complete Service Formalities",
    "Finish the agreed documentation or payment requirements where applicable.",
  ],
  [
    "03",
    "Executive Will Process Application",
    "We organize the details and keep work moving.",
  ],
  ["04", "Get Confirmation on Mail", "Stay informed through every milestone."],
]
const featureIcons = ["bolt", "chip", "approved", "expert", "network"]
const featureTones = [
  {
    card: "border-line bg-white",
    icon: "bg-white shadow-[0_8px_20px_rgba(11,27,77,.16)]",
    number: "text-brand/[.07]",
    text: "text-mute",
  },
  {
    card: "border-brand bg-brand text-white",
    icon: "bg-white shadow-[0_8px_20px_rgba(11,27,77,.16)]",
    number: "text-white/10",
    text: "text-white/75",
  },
  {
    card: "border-line bg-[#dcebff]",
    icon: "bg-white shadow-[0_8px_20px_rgba(11,27,77,.16)]",
    number: "text-brand/10",
    text: "text-mute",
  },
  {
    card: "border-sun bg-sun",
    icon: "bg-white shadow-[0_8px_20px_rgba(11,27,77,.16)]",
    number: "text-ink/10",
    text: "text-ink/70",
  },
  {
    card: "border-ink bg-ink text-white",
    icon: "bg-white shadow-[0_8px_20px_rgba(11,27,77,.16)]",
    number: "text-white/10",
    text: "text-white/65",
  },
]
const categoryIcons = [
  "company",
  "government",
  "license",
  "bank",
  "eco",
  "tax",
  "trademark",
]
const processIcons = ["form", "folder", "workflow", "mail"]
const features = [
  [
    "Quick Responses",
    "We aim to acknowledge every enquiry promptly and keep you informed.",
  ],
  [
    "Technology-Enabled Service",
    "Processes shaped around how modern teams work.",
  ],
  [
    "Hassle-Free Registration Assistance",
    "Clear checklists and organized paperwork for registrations and licenses.",
  ],
  ["Expert Guidance", "Advice that keeps your business context in view."],
  [
    "Broad Service Coverage",
    "One connected partner across your business journey.",
  ],
]
const footerColumns = [
  [
    "Startup",
    "Business Registration",
    "NGO / Trust Registration",
    "Global Incorporation",
    "Industry Setup",
    "Government Licenses",
    "Government Registration",
    "ISO Certifications",
    "FSSAI and Related Licensing",
  ],
  [
    "Compliance",
    "Secretarial Services",
    "Tax Filing / Compliance",
    "Accounting and CFO",
    "Contracts and Agreements",
    "Legal Services",
    "Business Advisory",
  ],
  [
    "Regulatory",
    "RBI",
    "SEBI",
    "IRDAI",
    "CDSCO",
    "BIS",
    "FEMA",
    "Legal Metrology",
    "Telecom",
  ],
  [
    "Environmental",
    "Pollution Control Permissions",
    "E-Waste Management",
    "Plastic Waste Management",
    "Hazardous Waste Management",
    "Battery Waste Management",
    "Environmental Licensing",
    "Environmental Advisory",
    "Environmental Compliance",
  ],
]
const footerLinks = [
  "About Us",
  "Learning & Resources",
  "Privacy Policy",
  "Refund Policy",
  "Terms & Conditions",
  "Sitemap",
  "Contact Us",
]

const navMenus = [
  {
    label: "Startup",
    blurb: "Company, LLP, licences and more",
    icon: "rocket",
    links: footerColumns[0].slice(1),
  },
  {
    label: "IP & Trademark",
    blurb: "Protect your brand and ideas",
    icon: "trademark",
    links: categoryServices["Intellectual Property"].map((i) => i.title),
  },
  {
    label: "Compliance",
    blurb: "Stay filing-ready all year",
    icon: "checklist",
    links: footerColumns[1].slice(1),
  },
  {
    label: "Regulatory",
    blurb: "Sector approvals and registrations",
    icon: "government",
    links: footerColumns[2].slice(1),
  },
  {
    label: "Environmental",
    blurb: "Permits, waste and sustainability",
    icon: "eco",
    links: footerColumns[3].slice(1),
  },
]

/* Shared style tokens (Tailwind utilities) */
const circlePath =
  "M 1090 110 C 1190 330, 950 565, 560 565 C 190 565, 25 430, 45 290 C 65 130, 320 35, 620 35 C 920 35, 1150 150, 1135 300"

const wrap =
  "mx-auto w-[min(1160px,calc(100%_-_48px))] max-[560px]:w-[min(calc(100%_-_32px),500px)]"
const btn =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-bold transition duration-200 hover:-translate-y-0.5 motion-reduce:transition-none"
const btnBlueFlat = `${btn} bg-brand text-white hover:bg-[#1450bd]`
const btnBlue = `${btnBlueFlat} shadow-[0_10px_23px_rgba(27,95,217,.22)]`
const btnYellow = `${btn} bg-sun text-ink`
const btnWhite = `${btn} bg-white text-ink`
const btnOutline = `${btn} border border-[#bfcbe0] bg-white/70 text-ink`
const floatCard =
  "absolute animate-float motion-reduce:animate-none flex items-center gap-2.5 rounded-[13px] border border-[rgba(220,229,245,.9)] bg-white/90 px-[15px] py-[13px] shadow-[0_15px_35px_rgba(11,27,77,.14)] backdrop-blur-[12px] max-[560px]:p-[9px]"
const chipTones = ["bg-[#dcebff]", "bg-sun/70", "bg-[#eef0f6]", "bg-[#c9defc]"]
const scrollbarThin =
  "[scrollbar-width:thin] [scrollbar-color:rgba(27,95,217,.5)_transparent]"
const index = "text-[13px] font-black text-brand"

function ColorIcon({
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
function Logo({
  light = false,
  compact = false,
}: {
  light?: boolean
  compact?: boolean
}) {
  return (
    <a
      href="#top"
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
    </a>
  )
}
function Eyebrow({
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
function SectionHeading({
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

export default function Page() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
  })
  const [hoverNav, setHoverNav] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [testimonial, setTestimonial] = useState(0)
  const [testimonialPaused, setTestimonialPaused] = useState(false)
  const goToTestimonial = (index: number) =>
    setTestimonial((index + testimonials.length) % testimonials.length)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [notice, setNotice] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [typedPlaceholder, setTypedPlaceholder] = useState("")
  const [newsletterNotice, setNewsletterNotice] = useState("")
  const filteredServices = useMemo(
    () =>
      quickServices.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )
  const currentTestimonial = testimonials[testimonial]
  const explorerRef = useRef<HTMLElement>(null)
  const testimonialRef = useRef<HTMLElement>(null)
  const [explorerVisible, setExplorerVisible] = useState(false)
  const [explorerPaused, setExplorerPaused] = useState(false)
  const explorerTabsRef = useRef<HTMLDivElement>(null)
  const [testimonialVisible, setTestimonialVisible] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCalendarOpen(false)
        setVideoOpen(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting
          if (entry.target === explorerRef.current) setExplorerVisible(visible)
          if (entry.target === testimonialRef.current)
            setTestimonialVisible(visible)
        })
      },
      { threshold: 0.2 },
    )
    if (explorerRef.current) observer.observe(explorerRef.current)
    if (testimonialRef.current) observer.observe(testimonialRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedPlaceholder(" a service...")
      return
    }
    if (searchFocused || query) return
    const phrases = quickServices
    let phrase = 0
    let chars = 0
    let deleting = false
    let timer: number
    const tick = () => {
      const full = " " + phrases[phrase]
      chars += deleting ? -1 : 1
      setTypedPlaceholder(full.slice(0, chars))
      let delay = deleting ? 32 : 75
      if (!deleting && chars === full.length) {
        deleting = true
        delay = 1500
      } else if (deleting && chars === 0) {
        deleting = false
        phrase = (phrase + 1) % phrases.length
        delay = 350
      }
      timer = window.setTimeout(tick, delay)
    }
    timer = window.setTimeout(tick, 400)
    return () => window.clearTimeout(timer)
  }, [searchFocused, query])

  useEffect(() => {
    const strip = explorerTabsRef.current
    if (!strip || strip.scrollWidth <= strip.clientWidth) return
    const tab = strip.children[categories.indexOf(activeCategory)] as
      HTMLElement | undefined
    if (!tab) return
    strip.scrollTo({
      left: tab.offsetLeft - (strip.clientWidth - tab.clientWidth) / 2,
      behavior: "smooth",
    })
  }, [activeCategory])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = calendarOpen || videoOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [calendarOpen, videoOpen])

  return (
    <main id="top" className="overflow-hidden">
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
            <a
              href="tel:+910000000000"
              className="inline-flex items-center gap-1.5 hover:text-sun"
            >
              <Phone size={13} /> +91 00000 00000
            </a>
            <a
              href="mailto:hello@aeoncorporate.com"
              className="inline-flex items-center gap-1.5 hover:text-sun"
            >
              <Mail size={13} /> hello@aeoncorporate.com
            </a>
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
            {navMenus.map(({ label, blurb, icon, links }, i) => (
              <div
                key={label}
                className="group relative"
                onMouseEnter={() => setHoverNav(label)}
                onFocus={() => setHoverNav(label)}
              >
                <a
                  href="#services"
                  className="relative inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] whitespace-nowrap font-bold text-mute transition-colors duration-200 group-focus-within:text-brand hover:text-brand"
                >
                  {hoverNav === label && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-[#dcebff]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative">{label}</span>
                  <ChevronDown
                    size={14}
                    className="relative transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180"
                  />
                </a>
                <div
                  className={cn(
                    "invisible absolute top-full w-[440px] translate-y-2 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                    i <= 1
                      ? "left-0"
                      : i >= 3
                        ? "right-0"
                        : "left-1/2 -translate-x-1/2",
                  )}
                >
                  <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_28px_70px_rgba(11,27,77,.18)]">
                    <div className="flex items-center gap-3 border-b border-line bg-[#f2f8ff] p-4">
                      <span className="grid size-14 place-items-center rounded-xl bg-white shadow-[0_6px_16px_rgba(11,27,77,.14)] ring-1 ring-line">
                        <ColorIcon name={icon} size={38} />
                      </span>
                      <div>
                        <b className="block text-[15px]">{label}</b>
                        <small className="block text-[12px] text-mute">
                          {blurb}
                        </small>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-1 p-2.5">
                      {links.map((link) => (
                        <a
                          key={link}
                          href="#explorer"
                          className="group/link flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-ink hover:bg-pale hover:text-brand"
                        >
                          <span className="truncate">{link}</span>
                          <ArrowUpRight
                            size={13}
                            className="shrink-0 -translate-x-1 text-brand opacity-0 transition group-hover/link:translate-x-0 group-hover/link:opacity-100"
                          />
                        </a>
                      ))}
                    </div>
                    <a
                      href="#services"
                      className="flex items-center justify-between bg-ink px-5 py-3 text-[13px] font-bold text-white transition hover:bg-brand"
                    >
                      View all services <ArrowRight size={15} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="tel:+910000000000"
              aria-label="Call Aeon Corporate"
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-white text-brand transition-colors hover:border-brand hover:bg-[#dcebff] max-[1024px]:hidden"
            >
              <Phone size={17} />
            </a>
            <a
              className={cn(
                btnBlue,
                "h-10 shrink-0 px-5 whitespace-nowrap max-[1024px]:hidden",
              )}
              href="#contact"
            >
              Get consultation <ArrowRight size={14} />
            </a>
            <button
              className="hidden size-10 items-center justify-center rounded-xl border border-line bg-white max-[1024px]:flex"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
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
                {navMenus.map(({ label, blurb, icon, links }) => (
                  <details key={label} className="group border-b border-line">
                    <summary className="flex cursor-pointer list-none items-center gap-3 px-2 py-3.5 [&::-webkit-details-marker]:hidden">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white shadow-[0_4px_12px_rgba(11,27,77,.12)] ring-1 ring-line">
                        <ColorIcon name={icon} size={36} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <b className="block text-[15px]">{label}</b>
                        <small className="block truncate text-[12px] text-mute">
                          {blurb}
                        </small>
                      </span>
                      <ChevronDown
                        size={18}
                        className="shrink-0 text-mute transition-transform duration-200 group-open:rotate-180"
                      />
                    </summary>
                    <div className="grid grid-cols-2 gap-x-3 pb-3 pl-[52px] max-[420px]:grid-cols-1">
                      {links.map((link) => (
                        <a
                          key={link}
                          href="#explorer"
                          onClick={() => setMenuOpen(false)}
                          className="rounded-lg px-2 py-2 text-[13px] text-mute hover:bg-pale hover:text-brand"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </details>
                ))}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href="tel:+910000000000"
                    className={cn(btnOutline, "gap-2")}
                  >
                    <Phone size={15} /> Call us
                  </a>
                  <a
                    href="mailto:hello@aeoncorporate.com"
                    className={cn(btnOutline, "gap-2")}
                  >
                    <Mail size={15} /> Email
                  </a>
                </div>
                <a
                  className={cn(btnBlue, "mt-2")}
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                >
                  Get consultation <ArrowRight size={15} />
                </a>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>

      <section className="relative flex min-h-[calc(100svh+50px)] items-center bg-[linear-gradient(135deg,#3b8cf5_0%,#1b5fd9_48%,#0a44b8_100%)] pt-[150px] pb-[150px] max-[900px]:block max-[900px]:min-h-0 max-[900px]:pt-[142px] max-[900px]:pb-[100px] max-[560px]:pt-[130px] max-[560px]:pb-[70px]">
        <div className="absolute inset-0 animate-drift bg-[radial-gradient(circle,rgba(255,255,255,.42)_1px,transparent_1.5px),radial-gradient(circle,rgba(255,217,61,.75)_1px,transparent_1.5px)] [background-position:0_0,42px_33px] [background-size:21px_21px,83px_83px] opacity-65 [mask-image:radial-gradient(ellipse_55%_75%_at_68%_45%,black_0%,transparent_75%)] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_72%_43%,rgba(255,255,255,.16),transparent_36%)] after:content-[''] motion-reduce:animate-none" />
        <HeroBackdrop />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-sky" />
        <div className="pointer-events-none absolute top-[245px] -right-[100px] h-[280px] w-[600px] -rotate-[20deg] rounded-full border border-white/25" />
        <div className="pointer-events-none absolute top-[280px] right-10 h-[190px] w-[450px] rotate-[28deg] rounded-full border border-sun/40" />
        <div
          className={cn(
            wrap,
            "relative z-[1] grid grid-cols-[0.95fr_1.05fr] items-center gap-[74px] max-[900px]:grid-cols-1 max-[900px]:gap-[45px]",
          )}
        >
          <div>
            <Eyebrow className="text-sun">
              CORPORATE SERVICES, REIMAGINED
            </Eyebrow>
            <h1 className="max-w-[640px] text-[clamp(44px,5.4vw,78px)] leading-[1.02] font-black tracking-[-0.04em] text-white animate-glow [paint-order:stroke_fill] [-webkit-text-stroke:0.07em_rgba(6,36,128,.95)] motion-reduce:animate-none max-[900px]:text-[clamp(46px,10vw,72px)] max-[560px]:text-[clamp(42px,13vw,60px)]">
              Your Business.
              <br />
              <span className="text-[#e3f0ff]">Without the</span>{" "}
              <HandDrawnFrame
                inline
                d={circlePath}
                strokeWidth={2.5}
                duration={4}
                strokeClassName="text-sun"
                className="inline-block px-4"
                svgClassName="-inset-x-5 -inset-y-4 h-[calc(100%+2rem)] w-[calc(100%+2.5rem)]"
              >
                <span className="text-white">Complexity.</span>
              </HandDrawnFrame>
            </h1>
          </div>
          <div className="relative flex items-center justify-center py-6 max-[900px]:py-4">
            {/* Whole illustration is shown (no cropping); cards sit on the frame edges, never on the subject. */}
            <div className="relative aspect-[4/3] h-[clamp(300px,52svh,460px)] max-w-full overflow-hidden rounded-[28px] border-[8px] border-white bg-white shadow-[0_30px_70px_rgba(11,27,77,.28)] max-[900px]:h-auto max-[900px]:w-full max-[900px]:max-w-[560px] max-[560px]:rounded-[20px] max-[560px]:border-[5px]">
              <img
                src="/illustrations/hero.jpg"
                alt="Illustration of a consultant presenting a compliance dashboard with a shield, calendar and documents"
                width={1400}
                height={1031}
                fetchPriority="high"
                className="size-full object-contain"
              />
            </div>

            <div
              className={cn(
                floatCard,
                "top-0 right-3 max-[560px]:right-0 max-[560px]:-top-1",
              )}
            >
              <span className="size-[9px] shrink-0 rounded-full bg-brand" />
              <div>
                <small className="block text-[11px] text-mute">
                  Compliance Overview
                </small>
                <strong className="mt-1 block text-xs">In Progress</strong>
              </div>
              <BarChart3 size={18} className="ml-2.5 text-brand" />
            </div>

            <div
              style={{ animationDelay: "-2s" }}
              className={cn(
                floatCard,
                "bottom-0 left-2 max-[560px]:left-0 max-[560px]:-bottom-1",
              )}
            >
              <span className="size-[9px] shrink-0 rounded-full bg-[#e6bd00]" />
              <div>
                <small className="block text-[11px] text-mute">
                  Registration
                </small>
                <strong className="mt-1 block text-xs">
                  Documents reviewed
                </strong>
              </div>
              <Check size={18} className="ml-2.5 text-brand" />
            </div>

            <div
              style={{ animationDelay: "-4s" }}
              className={cn(
                floatCard,
                "top-[7%] -left-20 block px-[18px] py-[13px] max-[1100px]:-left-8 max-[900px]:hidden",
              )}
            >
              <small className="block text-[11px] text-mute">
                Business growth
              </small>
              <strong className="mt-1 block text-xs">
                On track <span className="text-[#26a269]">↗</span>
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-[2] -mt-[60px] bg-[linear-gradient(to_bottom,transparent_60px,#cfe5ff_60px)] pb-[100px] max-[560px]:-mt-[40px] max-[560px]:bg-[linear-gradient(to_bottom,transparent_40px,#cfe5ff_40px)] max-[560px]:pb-[70px]">
        <div className="mx-auto w-[min(1080px,calc(100%_-_48px))] rounded-[28px] border border-line bg-white p-8 shadow-[0_30px_80px_rgba(11,27,77,.12)] max-[560px]:w-[calc(100%_-_32px)] max-[560px]:rounded-[22px] max-[560px]:p-5">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <Eyebrow className="mb-2.5">FIND YOUR NEXT STEP</Eyebrow>
              <h2 className="text-[clamp(24px,3vw,32px)] leading-tight font-bold tracking-[-0.03em]">
                What can we help you with?
              </h2>
            </div>
            <p className="max-w-[300px] text-[13px] leading-relaxed text-mute">
              Find the right registration, license, or compliance service.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-line bg-[#f2f8ff] p-2 transition focus-within:border-brand focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(27,95,217,.12)] max-[560px]:flex-col max-[560px]:items-stretch">
            <div className="flex h-12 flex-1 items-center gap-3 px-3.5 text-mute">
              <Search size={20} className="shrink-0" />
              <div className="relative min-w-0 flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  aria-label="Search services"
                  className="w-full bg-transparent text-[15px] text-ink outline-0"
                />
                {!query && !searchFocused && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 left-0 flex items-center gap-1 overflow-hidden text-[15px] whitespace-nowrap text-mute/80 max-[560px]:text-[14px]"
                  >
                    Search
                    <b className="font-semibold text-brand">
                      {typedPlaceholder}
                    </b>
                    <i className="h-[18px] w-0.5 animate-blink bg-brand not-italic" />
                  </span>
                )}
                {!query && searchFocused && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 left-0 flex items-center overflow-hidden text-[15px] text-mute/60 max-[560px]:text-[14px]"
                  >
                    <span className="truncate">
                      Type a service, e.g. GST
                      <span className="max-[560px]:hidden">
                        , trademark, FSSAI
                      </span>
                      ...
                    </span>
                  </span>
                )}
              </div>
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-line text-mute hover:text-ink"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              className={cn(
                btnBlue,
                "h-12 px-7 text-[13px] max-[560px]:w-full",
              )}
              onClick={() =>
                setNotice(
                  query
                    ? `Showing services related to “${query}”.`
                    : "Choose a service to get started.",
                )
              }
            >
              Find a service <ArrowRight size={15} />
            </button>
          </div>

          <p className="mt-6 mb-3 text-[13px] font-black tracking-[.16em] text-brand">
            {query ? "MATCHING SERVICES" : "RECOMMENDED SERVICES"}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {(query ? filteredServices : quickServices).map((item, i) => (
              <button
                key={item}
                onClick={() => setQuery(item)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-[13px] font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(11,27,77,.1)] motion-reduce:transition-none",
                  chipTones[i % chipTones.length],
                )}
              >
                {item}
              </button>
            ))}
            {!query && (
              <a
                href="#explorer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-brand motion-reduce:transition-none"
              >
                More <span aria-hidden="true">+</span>
              </a>
            )}
            {query && filteredServices.length === 0 && (
              <span className="py-2.5 text-[13px] text-mute">
                No exact matches yet — try another keyword.
              </span>
            )}
          </div>

          {notice && (
            <p className="mt-4 text-[13px] font-bold text-brand" role="status">
              {notice}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-5 text-[13px] text-mute">
            <span className="grid size-8 place-items-center rounded-full bg-sun text-ink">
              <Sparkles size={15} />
            </span>
            Not sure where to start?
            <a
              href="#contact"
              className="inline-flex items-center gap-1 py-2 font-bold text-brand hover:underline"
            >
              Talk to an expert <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      <section
        id="about"
        className={cn(
          wrap,
          "grid grid-cols-[1fr_1.05fr] items-center gap-[72px] py-[110px] max-[1024px]:gap-12 max-[900px]:grid-cols-1 max-[560px]:py-16",
        )}
      >
        <div className="relative mx-auto min-h-[560px] w-full max-w-[560px] max-[900px]:min-h-[480px] max-[560px]:min-h-[380px]">
          <div
            aria-hidden="true"
            className="absolute -top-5 -left-5 size-44 bg-[radial-gradient(circle,rgba(27,95,217,.45)_1.6px,transparent_2.2px)] [background-size:16px_16px] max-[560px]:size-28"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-6 left-6 size-40 rounded-full border border-brand/25 max-[560px]:size-24"
          />
          <div className="absolute top-0 right-10 bottom-14 left-0 overflow-hidden rounded-[32px_32px_32px_110px] shadow-[0_30px_70px_rgba(11,27,77,.16)] max-[560px]:right-6 max-[560px]:bottom-10 max-[560px]:rounded-[24px_24px_24px_70px]">
            <img
              src="/illustrations/about-team.jpg"
              alt="Illustration of three consultants collaborating over documents and a compliance checklist"
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 h-[210px] w-[44%] overflow-hidden rounded-[22px] border-[6px] border-white shadow-[0_24px_50px_rgba(11,27,77,.2)] max-[560px]:h-[130px] max-[560px]:border-4">
            <img
              src="/illustrations/about-documents.jpg"
              alt="Illustration of a signed document with a seal, pen and magnifying glass"
              loading="lazy"
              className="size-full animate-float object-cover"
            />
          </div>
          <div className="absolute top-8 -left-4 flex items-center gap-3 rounded-2xl bg-sun px-4 py-3 shadow-[0_18px_36px_rgba(11,27,77,.14)] max-[560px]:top-4 max-[560px]:-left-1 max-[560px]:px-3 max-[560px]:py-2.5">
            <strong className="text-[32px] leading-none font-extrabold max-[560px]:text-2xl">
              7
            </strong>
            <span className="text-xs leading-[1.3] font-bold">
              service areas
              <br />
              under one roof
            </span>
          </div>
          <div className="absolute bottom-24 -left-3 hidden items-center gap-2.5 rounded-2xl border border-line bg-white/95 px-3.5 py-3 shadow-[0_18px_36px_rgba(11,27,77,.14)] backdrop-blur min-[561px]:flex">
            <span className="grid size-8 place-items-center rounded-full bg-brand text-white">
              <Check size={16} />
            </span>
            <span className="text-xs leading-tight font-bold">
              Structured process
              <small className="block text-[11px] font-medium text-mute">
                Clear next steps
              </small>
            </span>
          </div>
        </div>

        <div>
          <Eyebrow>ABOUT AEON CORPORATE</Eyebrow>
          <h2 className="max-w-[560px] text-[clamp(30px,3.7vw,48px)] leading-[1.06] font-extrabold tracking-[-0.035em]">
            More Than Compliance. A{" "}
            <span className="bg-[linear-gradient(transparent_62%,#ffd93d_62%)] px-1">
              Partner
            </span>{" "}
            in Your Growth.
          </h2>
          <p className="mt-5 max-w-[540px] text-[15px] leading-[1.75] text-mute">
            Aeon Corporate helps startups, entrepreneurs, and established
            organizations navigate business registrations, licensing, taxation,
            intellectual property, and regulatory requirements.
          </p>
          <p className="mt-3 max-w-[540px] text-[15px] leading-[1.75] text-mute">
            With a structured, business-focused approach, we help clients
            understand their options, organize documentation, and move forward
            with greater clarity.
          </p>

          <div className="mt-7 grid gap-3">
            {[
              [
                "target",
                "Business-Focused Solutions",
                "Guidance shaped around your stage, industry, and goals.",
              ],
              [
                "expert",
                "Expert-Led Guidance",
                "Experienced professionals who explain every requirement clearly.",
              ],
              [
                "steps",
                "Simplified Processes",
                "Organized documentation and clear next steps, start to finish.",
              ],
            ].map(([Icon, title, description]) => {
              return (
                <div
                  key={title as string}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_14px_30px_rgba(27,95,217,.1)] motion-reduce:transition-none"
                >
                  <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#eaf3ff] transition-transform duration-200 group-hover:scale-105">
                    <ColorIcon name={Icon as string} size={44} />
                  </span>
                  <div className="min-w-0">
                    <b className="block text-[15px]">{title as string}</b>
                    <p className="mt-0.5 text-[13px] leading-snug text-mute">
                      {description as string}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="ml-auto shrink-0 text-brand opacity-60 transition group-hover:opacity-100"
                  />
                </div>
              )
            })}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a className={btnBlue} href="#services">
              Explore our services <ArrowRight size={16} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 py-2 text-[14px] font-bold text-brand hover:underline"
            >
              Talk to an expert <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="bg-sky py-28 max-[560px]:py-20">
        <div className={wrap}>
          <SectionHeading
            eyebrow="OUR SERVICES"
            title="Everything Your Business Needs. All in One Place."
            description="Explore a broad range of services designed to support every stage of your business journey."
          />
          <div className="mt-12 grid auto-rows-[minmax(200px,auto)] grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[560px]:mt-8 max-[560px]:flex max-[560px]:flex-col">
            {serviceCards.map(
              ({ icon, title, description, tone, className }, index) => {
                const featured = index === 0
                return (
                  <article
                    key={title}
                    className={cn(
                      "group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[22px] border border-line p-[26px] transition duration-[250ms] hover:-translate-y-[5px] hover:shadow-[0_18px_35px_rgba(27,95,217,.12)] motion-reduce:transition-none max-[560px]:min-h-[185px]",
                      tones[tone].card,
                      className,
                    )}
                  >
                    {featured && (
                      <>
                        <div
                          aria-hidden="true"
                          className="absolute -top-16 -right-16 size-64 rounded-full border border-white/20"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute -top-4 -right-4 size-40 rounded-full border border-white/20"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute right-6 bottom-6 size-28 bg-[radial-gradient(circle,rgba(255,255,255,.55)_1.4px,transparent_2px)] [background-size:14px_14px]"
                        />
                      </>
                    )}
                    <div
                      className={cn(
                        "relative grid place-items-center rounded-xl",
                        featured ? "size-[92px] rounded-3xl" : "size-[64px]",
                        "shadow-[0_8px_20px_rgba(11,27,77,.16)]",
                        tones[tone].icon,
                      )}
                    >
                      <ColorIcon name={icon} size={featured ? 66 : 48} />
                    </div>
                    <div className="relative">
                      <h3
                        className={cn(
                          "mt-[22px] font-bold tracking-[-0.02em]",
                          featured
                            ? "text-[clamp(26px,3vw,36px)] leading-tight"
                            : "text-xl leading-snug",
                        )}
                      >
                        {title}
                      </h3>
                      <p
                        className={cn(
                          "mt-2.5 max-w-[400px] leading-[1.65] opacity-[.7]",
                          featured ? "text-[15px]" : "text-[13px]",
                        )}
                      >
                        {description}
                      </p>
                      <a
                        href="#explorer"
                        className="mt-3 -mb-2 inline-flex items-center gap-[7px] py-2 text-[13px] font-extrabold"
                      >
                        Explore service{" "}
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-200 group-hover:translate-x-[3px]"
                        />
                      </a>
                    </div>
                  </article>
                )
              },
            )}
          </div>
        </div>
      </section>

      <section className="bg-royal [background:radial-gradient(circle_at_78%_45%,rgba(255,217,61,.16),transparent_36%),linear-gradient(135deg,#0a44b8,#0b3590)] py-14 text-white max-[560px]:py-16">
        <div
          className={cn(
            wrap,
            "grid grid-cols-[0.88fr_1.12fr] items-center gap-[75px] max-[900px]:grid-cols-1 max-[900px]:gap-[55px] max-[560px]:gap-[38px]",
          )}
        >
          <div>
            <SectionHeading
              light
              eyebrow="COMPLIANCE RESOURCES"
              title="Make Compliance a Clearer Process."
              description="Build a clearer picture of upcoming business milestones with a practical, easy-to-use compliance calendar."
            />
            <button
              className={cn(btnYellow, "mt-7")}
              onClick={() => setCalendarOpen(true)}
            >
              Explore compliance resources <ArrowRight size={16} />
            </button>
          </div>
          <ComplianceCalendar />
        </div>
      </section>

      <section
        id="approach"
        className="relative overflow-hidden bg-pale py-[120px] max-[560px]:py-20"
      >
        <div
          aria-hidden="true"
          className="absolute -top-10 -right-10 size-80 bg-[radial-gradient(circle,rgba(27,95,217,.3)_1.6px,transparent_2.2px)] [background-size:18px_18px] [mask-image:radial-gradient(circle,black,transparent_70%)]"
        />
        <div className={cn(wrap, "relative")}>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <SectionHeading
              eyebrow="OUR WORKING PROCESS"
              title="Your Journey, Clearly Mapped Out."
              description="A considered process that keeps requirements, documentation, and progress visible."
            />
            <a className={btnBlue} href="#contact">
              Start your application <ArrowRight size={16} />
            </a>
          </div>

          <ol className="relative mt-16 grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[560px]:mt-10 max-[560px]:grid-cols-1 max-[560px]:gap-4">
            <div
              aria-hidden="true"
              className="absolute top-[27px] right-[27px] left-[27px] h-0.5 rounded-full bg-[#cbd9f4] max-[900px]:hidden"
            />
            <motion.div
              aria-hidden="true"
              className="absolute top-[27px] right-[27px] left-[27px] h-0.5 origin-left rounded-full bg-[linear-gradient(90deg,#1b5fd9,#ffd93d)] max-[900px]:hidden"
              initial={reduceMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
            {processSteps.map(([num, title, description], i) => {
              const stepIcon = processIcons[i]
              return (
                <motion.li
                  key={num}
                  className="relative"
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.14 }}
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-16 place-items-center rounded-full border-4 bg-white shadow-[0_10px_24px_rgba(27,95,217,.22)]",
                      i % 2 === 1 ? "border-sun" : "border-brand",
                    )}
                  >
                    <ColorIcon name={stepIcon} size={42} />
                  </span>
                  <div className="group relative mt-5 overflow-hidden rounded-[24px] border border-line bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_22px_44px_rgba(27,95,217,.12)] motion-reduce:transition-none">
                    <span
                      aria-hidden="true"
                      className="absolute -top-3 right-3 text-[84px] leading-none font-black tracking-[-0.06em] text-brand/[.07] transition-colors duration-300 group-hover:text-brand/[.14]"
                    >
                      {num}
                    </span>
                    <p className="relative text-[11px] font-black tracking-[.18em] text-brand">
                      STEP {num}
                    </p>
                    <h3 className="relative mt-3 text-[19px] leading-[1.2] font-bold tracking-[-0.02em]">
                      {title}
                    </h3>
                    <p className="relative mt-2.5 text-[13px] leading-[1.65] text-mute">
                      {description}
                    </p>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[linear-gradient(90deg,#1b5fd9,#ffd93d)] transition-transform duration-300 group-hover:scale-x-100"
                    />
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </section>

      <section
        id="explorer"
        ref={explorerRef}
        className="relative overflow-hidden bg-ink [background:radial-gradient(circle_at_80%_20%,rgba(27,95,217,.3),transparent_32%),radial-gradient(circle_at_8%_90%,rgba(255,217,61,.08),transparent_30%),#0b1b4d] py-[110px] text-white max-[560px]:py-16"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,.07)_1px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)]"
        />
        <div className={cn(wrap, "relative")}>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <SectionHeading
              light
              eyebrow="SERVICE EXPLORER"
              title="One Destination for Your Business Requirements."
              description="Browse our service categories and find a focused place to start."
            />
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-[14px] font-bold text-white transition hover:border-sun hover:bg-sun hover:text-ink"
            >
              Not sure? Ask an expert <ArrowUpRight size={16} />
            </a>
          </div>

          <div
            className="mt-12 grid grid-cols-[0.78fr_1.22fr] gap-8 max-[1024px]:grid-cols-[0.9fr_1.1fr] max-[900px]:grid-cols-1 max-[900px]:gap-6 max-[560px]:mt-8"
            onMouseEnter={() => setExplorerPaused(true)}
            onMouseLeave={() => setExplorerPaused(false)}
          >
            <div
              ref={explorerTabsRef}
              role="tablist"
              aria-label="Service categories"
              className={cn(
                "flex flex-col gap-1.5 max-[900px]:snap-x max-[900px]:flex-row max-[900px]:overflow-x-auto max-[900px]:pb-3",
                scrollbarThin,
              )}
            >
              {categories.map((category, i) => {
                const active = activeCategory === category
                const categoryIcon = categoryIcons[i]
                return (
                  <button
                    key={category}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "relative flex items-center gap-3.5 overflow-hidden rounded-2xl px-4 py-3.5 text-left text-[15px] font-semibold transition-colors duration-300 max-[900px]:shrink-0 max-[900px]:snap-center max-[900px]:rounded-full max-[900px]:border max-[900px]:px-4 max-[900px]:py-2.5 max-[900px]:text-[14px] max-[900px]:whitespace-nowrap",
                      active
                        ? "text-white max-[900px]:border-transparent"
                        : "text-white/60 hover:text-white max-[900px]:border-white/20",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="explorer-active"
                        className="absolute inset-0 rounded-[inherit] bg-brand shadow-[0_14px_30px_rgba(27,95,217,.4)]"
                        transition={{
                          type: "spring",
                          stiffness: 340,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={cn(
                        "relative grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-300 max-[900px]:hidden",
                        "bg-white shadow-[0_4px_12px_rgba(0,0,0,.18)]",
                      )}
                    >
                      <ColorIcon name={categoryIcon} size={34} />
                    </span>
                    <span className="relative flex-1">{category}</span>
                    <ChevronRight
                      size={16}
                      className={cn(
                        "relative transition-all duration-300 max-[900px]:hidden",
                        active
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-40",
                      )}
                    />
                    {active && (
                      <span
                        key={`explorer-progress-${activeCategory}`}
                        aria-hidden="true"
                        onAnimationEnd={() =>
                          setActiveCategory(
                            categories[(i + 1) % categories.length],
                          )
                        }
                        style={{
                          animationDuration: "5s",
                          animationPlayState:
                            explorerPaused || !explorerVisible
                              ? "paused"
                              : "running",
                        }}
                        className="absolute inset-x-0 bottom-0 h-[3px] origin-left animate-progress bg-sun motion-reduce:animate-none"
                      />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="relative min-h-[420px] rounded-[28px] border border-white/10 bg-white/[.04] p-6 backdrop-blur-sm max-[560px]:min-h-0 max-[560px]:rounded-[22px] max-[560px]:p-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeCategory}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.07 } },
                    exit: { transition: { staggerChildren: 0.03 } },
                  }}
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      show: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: -8 },
                    }}
                    transition={{ duration: 0.3 }}
                    className="mb-5 flex flex-wrap items-center justify-between gap-3"
                  >
                    <h3 className="text-[22px] font-bold tracking-[-0.02em] max-[560px]:text-lg">
                      {activeCategory}
                    </h3>
                    <span className="rounded-full bg-sun px-3 py-1 text-xs font-extrabold text-ink">
                      {categoryServices[activeCategory].length} services
                    </span>
                  </motion.div>
                  <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
                    {categoryServices[activeCategory].map((item, i) => (
                      <motion.a
                        key={item.title}
                        href="#contact"
                        variants={{
                          hidden: { opacity: 0, y: 22, scale: 0.97 },
                          show: { opacity: 1, y: 0, scale: 1 },
                          exit: { opacity: 0, y: -10, scale: 0.98 },
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="group relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-[20px] border border-white/[.12] bg-white/[.06] p-5 transition duration-300 hover:-translate-y-1 hover:border-brand hover:bg-white/10 hover:shadow-[0_20px_40px_rgba(27,95,217,.25)] motion-reduce:transition-none max-[560px]:min-h-0 max-[560px]:gap-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="grid size-10 place-items-center rounded-xl bg-brand text-[13px] font-extrabold text-white">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="grid size-9 place-items-center rounded-full border border-white/20 text-sun transition group-hover:border-sun group-hover:bg-sun group-hover:text-ink">
                            <ArrowUpRight size={16} />
                          </span>
                        </div>
                        <div className="mt-5">
                          <h4 className="text-[17px] leading-snug font-bold">
                            {item.title}
                          </h4>
                          <p className="mt-1.5 text-[14px] leading-[1.6] text-white/60">
                            {item.description}
                          </p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section
        id="story"
        className={cn(
          wrap,
          "grid grid-cols-[1fr_1.1fr] items-center gap-16 py-[110px] max-[1024px]:gap-10 max-[900px]:grid-cols-1 max-[560px]:py-16",
        )}
      >
        <div className="max-[900px]:order-2">
          <Eyebrow>WHO WE ARE</Eyebrow>
          <h2 className="text-[clamp(30px,3.9vw,50px)] leading-[1.06] font-extrabold tracking-[-0.035em]">
            Clarity in Complexity.{" "}
            <span className="bg-[linear-gradient(transparent_62%,#ffd93d_62%)] px-1">
              Confidence
            </span>{" "}
            in Every Decision.
          </h2>
          <p className="mt-5 max-w-[500px] text-[15px] leading-[1.75] text-mute">
            Aeon Corporate pairs experienced guidance with a technology-enabled
            experience, so startups and established businesses can understand
            their options, organize documentation, and move forward with
            confidence.
          </p>

          <ul className="mt-7 grid gap-3">
            {[
              [
                "Business-Focused Guidance",
                "Advice shaped around your goals and stage.",
              ],
              [
                "Technology-Enabled Experience",
                "A smooth, digital-first way to work with us.",
              ],
              [
                "Clear and Structured Processes",
                "Defined steps from first enquiry to completion.",
              ],
            ].map(([title, description]) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-brand text-white shadow-[0_6px_14px_rgba(27,95,217,.3)]">
                  <Check size={15} />
                </span>
                <span>
                  <b className="block text-[15px]">{title}</b>
                  <span className="mt-0.5 block text-[13px] leading-[1.6] text-mute">
                    {description}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button className={btnBlue} onClick={() => setVideoOpen(true)}>
              <Play size={15} fill="currentColor" /> Watch our process
            </button>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 py-2 text-[14px] font-bold text-brand hover:underline"
            >
              Talk to an expert <ArrowRight size={15} />
            </a>
          </div>
        </div>

        <div className="relative max-[900px]:order-1">
          <div
            aria-hidden="true"
            className="absolute -top-5 -right-5 size-40 bg-[radial-gradient(circle,rgba(27,95,217,.45)_1.6px,transparent_2.2px)] [background-size:16px_16px] max-[560px]:size-24"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-5 -left-5 size-44 rounded-[32px] bg-sun max-[560px]:size-28 max-[560px]:rounded-3xl"
          />
          <div className="relative min-h-[460px] overflow-hidden rounded-[32px] shadow-[0_30px_70px_rgba(11,27,77,.2)] max-[900px]:min-h-[380px] max-[560px]:min-h-[300px] max-[560px]:rounded-[24px]">
            <img
              src="/illustrations/story-process.jpg"
              alt="Illustration of a team presenting a step-by-step process on a board"
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(11,27,77,.35))]" />
            <button
              onClick={() => setVideoOpen(true)}
              aria-label="Open brand story"
              className="group absolute top-1/2 left-1/2 grid size-[84px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand shadow-[0_0_0_12px_rgba(255,255,255,.22)] transition duration-300 hover:scale-110 max-[560px]:size-16"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-ping rounded-full bg-white/60 motion-reduce:animate-none"
              />
              <Play
                size={26}
                fill="currentColor"
                className="relative ml-1 transition-transform group-hover:scale-110"
              />
            </button>
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[13px] font-bold whitespace-nowrap text-white backdrop-blur-md">
              Watch our process
            </span>
          </div>
        </div>
      </section>

      <section
        className={cn(
          wrap,
          "grid grid-cols-[0.8fr_1.2fr] gap-16 pb-[120px] max-[1024px]:gap-10 max-[900px]:grid-cols-1 max-[560px]:pb-20",
        )}
      >
        <div className="self-start min-[901px]:sticky min-[901px]:top-28">
          <Eyebrow>THE AEON DIFFERENCE</Eyebrow>
          <h2 className="text-[clamp(30px,3.7vw,48px)] leading-[1.06] font-extrabold tracking-[-0.035em]">
            Better Clarity. Better Decisions.{" "}
            <span className="bg-[linear-gradient(transparent_62%,#ffd93d_62%)] px-1">
              Better Business.
            </span>
          </h2>
          <p className="mt-5 max-w-[440px] text-[15px] leading-[1.75] text-mute">
            A thoughtful experience designed to make complex requirements feel
            more manageable.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a className={btnBlue} href="#contact">
              Request a consultation <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
          {features.map(([title, description], i) => {
            const featureIcon = featureIcons[i]
            const tone = featureTones[i]
            return (
              <motion.article
                key={title}
                className={cn(
                  "group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[24px] border p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_rgba(11,27,77,.14)] motion-reduce:transition-none",
                  tone.card,
                  i === features.length - 1 &&
                    "col-span-2 max-[560px]:col-span-1",
                )}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: (i % 2) * 0.12 }}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -top-3 right-4 text-[88px] leading-none font-black tracking-[-0.06em]",
                    tone.number,
                  )}
                >
                  0{i + 1}
                </span>
                <span
                  className={cn(
                    "relative grid size-16 place-items-center rounded-2xl",
                    tone.icon,
                  )}
                >
                  <ColorIcon name={featureIcon} size={46} />
                </span>
                <div className="relative mt-8">
                  <h3 className="text-[19px] leading-[1.2] font-bold tracking-[-0.02em]">
                    {title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 max-w-[420px] text-[13px] leading-[1.65]",
                      tone.text,
                    )}
                  >
                    {description}
                  </p>
                </div>
              </motion.article>
            )
          })}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-line bg-[linear-gradient(180deg,#f2f8ff,#ffffff_55%,#f2f8ff)] py-16 max-[560px]:py-12">
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,#1b5fd9,transparent)] opacity-40"
        />
        <div className={cn(wrap, "text-center")}>
          <Eyebrow className="mb-3 justify-center">
            BUILT FOR AMBITIOUS TEAMS
          </Eyebrow>
          <h2 className="mx-auto max-w-[620px] text-[clamp(24px,3vw,34px)] leading-[1.15] font-extrabold tracking-[-0.03em]">
            Support for businesses across a{" "}
            <span className="bg-[linear-gradient(transparent_62%,#ffd93d_62%)] px-1">
              range of industries
            </span>
            .
          </h2>
        </div>

        <div className="group/marquee mt-10 grid gap-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] max-[560px]:mt-8 max-[560px]:gap-3">
          {[false, true].map((reverse) => (
            <div key={String(reverse)} className="overflow-hidden">
              <div
                className={cn(
                  "flex w-max gap-4 pr-4 group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none max-[560px]:gap-3 max-[560px]:pr-3",
                  reverse ? "animate-marquee-reverse" : "animate-marquee",
                )}
              >
                {[0, 1].flatMap((copy) =>
                  (reverse ? [...industries].reverse() : industries).map(
                    ({ label, icon: IndustryIcon }) => (
                      <span
                        key={`${copy}-${label}`}
                        aria-hidden={copy === 1}
                        className="inline-flex shrink-0 items-center gap-3 rounded-full border border-line bg-white py-2.5 pr-6 pl-2.5 text-[15px] font-bold whitespace-nowrap text-ink shadow-[0_8px_20px_rgba(11,27,77,.05)] transition duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_12px_26px_rgba(27,95,217,.14)] max-[560px]:text-[13px]"
                      >
                        <span className="grid size-11 place-items-center rounded-full bg-[#eaf3ff] max-[560px]:size-9">
                          <ColorIcon name={IndustryIcon} size={34} />
                        </span>
                        {label}
                      </span>
                    ),
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        ref={testimonialRef}
        className={cn(wrap, "py-[110px] max-[560px]:py-20")}
      >
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <SectionHeading
            eyebrow="CLIENT EXPERIENCES"
            title="Trust Built Through Better Experiences."
            description="Sample reviews shown for presentation until verified customer feedback is supplied."
          />
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-[#f2f8ff] px-4 py-2 text-xs font-bold text-mute">
            <i className="size-2 rounded-full bg-sun ring-2 ring-[#e6bd00]/40" />
            Sample content for presentation
          </span>
        </div>

        <div
          className="mt-12 grid grid-cols-[1.25fr_0.75fr] gap-4 max-[900px]:grid-cols-1 max-[560px]:mt-8"
          onMouseEnter={() => setTestimonialPaused(true)}
          onMouseLeave={() => setTestimonialPaused(false)}
        >
          <article className="relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-[28px] bg-brand p-10 text-white max-[560px]:min-h-[340px] max-[560px]:rounded-[22px] max-[560px]:p-6">
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 size-72 rounded-full border border-white/20"
            />
            <div
              aria-hidden="true"
              className="absolute -top-8 -right-8 size-44 rounded-full border border-white/20"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-10 -left-10 size-56 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative flex items-center justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/15">
                <Quote size={24} className="text-sun" />
              </span>
              <span className="flex gap-0.5 text-sun" aria-label="5 out of 5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={testimonial}
                className="relative"
                initial={{ opacity: 0, x: 36, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -36, filter: "blur(4px)" }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mt-8 mb-9 max-w-[620px] text-[clamp(20px,2.2vw,27px)] leading-[1.35] font-medium tracking-[-0.02em]">
                  “{currentTestimonial.quote}”
                </p>
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-full bg-sun text-[13px] font-black text-ink">
                    {currentTestimonial.initials}
                  </span>
                  <div>
                    <b className="block text-[15px]">
                      {currentTestimonial.name}
                    </b>
                    <small className="mt-0.5 block text-[13px] text-white/70">
                      {currentTestimonial.role}
                    </small>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="relative mt-8 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-white/70">
                {String(testimonial + 1).padStart(2, "0")} /{" "}
                {String(testimonials.length).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => goToTestimonial(testimonial - 1)}
                  aria-label="Previous testimonial"
                  className="grid size-11 place-items-center rounded-full border border-white/30 transition hover:bg-white hover:text-brand"
                >
                  <ArrowRight size={18} className="rotate-180" />
                </button>
                <button
                  onClick={() => goToTestimonial(testimonial + 1)}
                  aria-label="Next testimonial"
                  className="grid size-11 place-items-center rounded-full bg-sun text-ink transition hover:bg-white"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </article>

          <div className="grid gap-3">
            {testimonials.map((item, i) => {
              const active = i === testimonial
              return (
                <button
                  key={item.name}
                  onClick={() => goToTestimonial(i)}
                  aria-label={`Show review from ${item.name}`}
                  aria-current={active}
                  className={cn(
                    "relative overflow-hidden rounded-[20px] border p-5 text-left transition duration-300 motion-reduce:transition-none",
                    active
                      ? "border-brand bg-white shadow-[0_18px_40px_rgba(27,95,217,.14)]"
                      : "border-line bg-white/60 hover:border-brand/40 hover:bg-white",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-11 shrink-0 place-items-center rounded-full text-xs font-black transition-colors duration-300",
                        active
                          ? "bg-brand text-white"
                          : "bg-[#dcebff] text-brand",
                      )}
                    >
                      {item.initials}
                    </span>
                    <div className="min-w-0">
                      <b className="block text-[15px]">{item.name}</b>
                      <small className="block truncate text-[13px] text-mute">
                        {item.role}
                      </small>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-[13px] leading-[1.6] text-mute">
                    “{item.quote}”
                  </p>
                  {active && (
                    <span
                      key={`progress-${testimonial}`}
                      aria-hidden="true"
                      onAnimationEnd={() => goToTestimonial(testimonial + 1)}
                      style={{
                        animationPlayState:
                          testimonialPaused || !testimonialVisible
                            ? "paused"
                            : "running",
                      }}
                      className="absolute inset-x-0 bottom-0 h-1 origin-left animate-progress bg-[linear-gradient(90deg,#1b5fd9,#ffd93d)] motion-reduce:animate-none"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-sky py-[110px] max-[560px]:py-20">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <SectionHeading
              eyebrow="MEDIA & INSIGHTS"
              title="Insights for Businesses Moving Forward."
              description="Practical ideas for teams building with more structure, clarity, and confidence."
            />
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-[14px] font-bold text-ink transition hover:border-brand hover:text-brand"
            >
              Ask us a question <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="mt-12 grid grid-cols-[1.2fr_1fr] gap-5 max-[900px]:grid-cols-1 max-[560px]:mt-8 max-[560px]:gap-4">
            {articles.map((article, i) => {
              const featured = i === 0
              return (
                <motion.a
                  key={article.title}
                  href="#contact"
                  className={cn(
                    "group relative overflow-hidden rounded-[26px] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_54px_rgba(11,27,77,.16)] motion-reduce:transition-none max-[560px]:rounded-[20px]",
                    featured
                      ? "row-span-2 flex min-h-[520px] flex-col justify-end max-[900px]:row-span-1 max-[900px]:min-h-[440px]"
                      : "flex min-h-[250px] border border-line bg-white max-[560px]:flex-col",
                  )}
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                >
                  {featured ? (
                    <>
                      <img
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,27,77,.05)_30%,rgba(11,27,77,.88)_100%)]" />
                      <div className="relative p-8 text-white max-[560px]:p-5">
                        <span className="inline-block rounded-full bg-sun px-3 py-1.5 text-[11px] font-black tracking-[.12em] text-ink">
                          {article.category}
                        </span>
                        <h3 className="mt-4 max-w-[520px] text-[clamp(24px,2.6vw,32px)] leading-[1.15] font-bold tracking-[-0.02em]">
                          {article.title}
                        </h3>
                        <p className="mt-3 max-w-[460px] text-[14px] leading-[1.65] text-white/75">
                          {article.description}
                        </p>
                        <span className="mt-6 inline-flex items-center gap-3 text-[14px] font-bold">
                          Read article
                          <span className="grid size-10 place-items-center rounded-full bg-white text-brand transition group-hover:bg-sun group-hover:text-ink">
                            <ArrowUpRight size={18} />
                          </span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative w-[42%] shrink-0 overflow-hidden max-[560px]:h-[190px] max-[560px]:w-full">
                        <img
                          src={article.image}
                          alt={article.title}
                          loading="lazy"
                          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-6 max-[560px]:p-5">
                        <div>
                          <span className="inline-block rounded-full bg-[#dcebff] px-3 py-1.5 text-[11px] font-black tracking-[.1em] text-brand">
                            {article.category}
                          </span>
                          <h3 className="mt-3.5 text-[18px] leading-[1.25] font-bold tracking-[-0.02em]">
                            {article.title}
                          </h3>
                          <p className="mt-2 text-[13px] leading-[1.6] text-mute">
                            {article.description}
                          </p>
                        </div>
                        <span className="mt-5 inline-flex items-center gap-2.5 text-[13px] font-bold text-brand">
                          Read article
                          <span className="grid size-8 place-items-center rounded-full bg-[#dcebff] transition group-hover:bg-brand group-hover:text-white">
                            <ArrowUpRight size={15} />
                          </span>
                        </span>
                      </div>
                    </>
                  )}
                </motion.a>
              )
            })}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative overflow-hidden bg-[linear-gradient(135deg,#1b5fd9,#0a44b8)] py-[87px] text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle,white_1px,transparent_1.5px)] [background-size:21px_21px] opacity-[.33] [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />
        <div
          className={cn(
            wrap,
            "relative z-[1] flex items-center justify-between gap-[30px] max-[900px]:flex-col max-[900px]:items-start max-[560px]:gap-6",
          )}
        >
          <div>
            <Eyebrow className="text-sun">
              YOUR NEXT MILESTONE STARTS HERE
            </Eyebrow>
            <h2 className="max-w-[700px] text-[clamp(38px,5vw,68px)] leading-[.96] font-bold tracking-[-0.04em] text-white max-[560px]:text-[44px]">
              Ready for Your Next Business Milestone?
            </h2>
            <p className="mt-[17px] text-[13px] text-white/[.72]">
              Tell us what you need and discover the right next steps for your
              business.
            </p>
          </div>
          <div className="flex min-w-[205px] flex-col items-stretch gap-[9px] max-[900px]:w-full max-[900px]:flex-row max-[560px]:flex-col">
            <a className={btnYellow} href="mailto:hello@aeoncorporate.com">
              Request a consultation <ArrowRight size={16} />
            </a>
            <a className={btnWhite} href="#services">
              Explore services
            </a>
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-ink pt-16 pb-6 text-white max-[560px]:pt-12">
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,.07)_1px,transparent_1.5px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_60%)]"
        />
        <div className={cn(wrap, "relative")}>
          <div className="relative overflow-hidden rounded-[28px] bg-sun p-9 text-ink max-[560px]:rounded-[22px] max-[560px]:p-6">
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-16 size-72 rounded-full border border-ink/10"
            />
            <div
              aria-hidden="true"
              className="absolute -top-10 -right-2 size-44 rounded-full border border-ink/10"
            />
            <div className="relative grid grid-cols-[1.1fr_1fr] items-center gap-8 max-[900px]:grid-cols-1 max-[900px]:gap-6">
              <div>
                <Eyebrow className="text-ink">THE AEON BRIEF</Eyebrow>
                <h2 className="max-w-[520px] text-[clamp(24px,2.8vw,32px)] leading-[1.15] font-extrabold tracking-[-0.03em]">
                  Useful thinking for ambitious businesses.
                </h2>
                <p className="mt-3 max-w-[480px] text-[14px] leading-[1.6] text-ink/75">
                  Compliance updates and practical business insights, delivered
                  to your inbox.
                </p>
              </div>
              <div>
                <form
                  className="flex gap-2 rounded-2xl bg-white p-2 shadow-[0_14px_34px_rgba(11,27,77,.14)] max-[560px]:flex-col"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const form = e.currentTarget
                    if (!form.checkValidity()) {
                      form.reportValidity()
                      return
                    }
                    setNewsletterNotice(
                      "Demo mode: no subscription was saved because a newsletter backend isn't connected yet.",
                    )
                    form.reset()
                  }}
                >
                  <div className="flex h-12 min-w-0 flex-1 items-center gap-2.5 px-3">
                    <Mail size={18} className="shrink-0 text-mute" />
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      aria-label="Email address"
                      className="w-full min-w-0 bg-transparent text-[15px] outline-none placeholder:text-mute/80"
                    />
                  </div>
                  <button
                    className={cn(btnBlueFlat, "h-12 px-6 max-[560px]:w-full")}
                    type="submit"
                  >
                    Subscribe <ArrowRight size={15} />
                  </button>
                </form>
                {newsletterNotice && (
                  <p
                    className="mt-3 text-[13px] font-semibold text-ink"
                    role="status"
                  >
                    {newsletterNotice}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1.5fr_repeat(4,1fr)] gap-x-8 gap-y-12 pt-16 pb-12 max-[1100px]:grid-cols-[1.2fr_repeat(4,1fr)] max-[900px]:grid-cols-2 max-[900px]:pt-12 max-[560px]:gap-x-5 max-[560px]:pt-10">
            <div className="max-[900px]:col-span-2">
              <Logo light />
              <p className="mt-5 max-w-[300px] text-[14px] leading-[1.7] text-white/70">
                Technology-enabled guidance for businesses navigating
                complexity.
              </p>
              <div className="mt-5 flex gap-2">
                {["in", "x", "ig"].map((label) => (
                  <a
                    key={label}
                    href="#contact"
                    aria-label={`Aeon Corporate on ${label}`}
                    className="grid size-10 place-items-center rounded-full border border-white/20 text-[13px] font-bold transition hover:-translate-y-0.5 hover:border-sun hover:bg-sun hover:text-ink"
                  >
                    {label}
                  </a>
                ))}
              </div>
              <address className="mt-6 grid gap-3 not-italic max-[900px]:grid-cols-3 max-[900px]:gap-4 max-[640px]:grid-cols-1">
                {[
                  [
                    Mail,
                    "hello@aeoncorporate.com",
                    "mailto:hello@aeoncorporate.com",
                  ],
                  [Phone, "+91 00000 00000", "tel:+910000000000"],
                  [MapPin, "Office address placeholder, India", undefined],
                ].map(([Icon, text, href]) => {
                  const ContactIcon = Icon as typeof Mail
                  const content = (
                    <>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-sun">
                        <ContactIcon size={16} />
                      </span>
                      <span className="text-[14px] leading-snug text-white/85">
                        {text as string}
                      </span>
                    </>
                  )
                  return href ? (
                    <a
                      key={text as string}
                      href={href as string}
                      className="flex items-center gap-3 hover:text-sun"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={text as string}
                      className="flex items-center gap-3"
                    >
                      {content}
                    </div>
                  )
                })}
              </address>
            </div>
            {footerColumns.map(([title, ...links]) => (
              <div key={title}>
                <h3 className="mb-5 inline-block border-b-2 border-sun pb-2 text-[12px] font-extrabold tracking-[.14em] text-white uppercase">
                  {title}
                </h3>
                <ul className="grid gap-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#services"
                        className="group inline-flex items-start gap-1.5 text-[14px] leading-snug text-white/70 transition-colors hover:text-sun"
                      >
                        <ChevronRight
                          size={14}
                          className="mt-[3px] -ml-3.5 shrink-0 opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100"
                        />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <nav
            aria-label="Company and legal"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 py-6"
          >
            {footerLinks.map((link) => (
              <a
                key={link}
                href="#contact"
                className="text-[13px] font-semibold text-white/85 transition-colors hover:text-sun"
              >
                {link}
              </a>
            ))}
          </nav>
          <p className="rounded-2xl border border-white/10 bg-white/[.04] p-4 text-[12px] leading-[1.7] text-white/60">
            <b className="text-white/80">Disclaimer:</b> Aeon Corporate is a
            private advisory and facilitation service. It is not affiliated with
            any government body, and information on this site is general
            guidance, not legal advice. Outcomes depend on the relevant
            authorities.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[13px] text-white/60">
            <span>© 2026 Aeon Corporate. All rights reserved.</span>
            <a
              href="#top"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-semibold text-white/85 transition hover:border-sun hover:bg-sun hover:text-ink"
            >
              Back to top <ArrowUp size={14} />
            </a>
          </div>
        </div>
      </footer>

      <a
        className="fixed right-[22px] bottom-[22px] z-30 grid size-[43px] place-items-center rounded-full bg-[#27b95a] text-white shadow-[0_8px_18px_rgba(11,27,77,.2)] max-[560px]:right-3.5 max-[560px]:bottom-3.5"
        href="mailto:hello@aeoncorporate.com"
        aria-label="Email Aeon Corporate"
      >
        <Mail size={19} />
      </a>
      {calendarOpen && (
        <div className={modalBackdrop} onClick={() => setCalendarOpen(false)}>
          <div className={modalCard} onClick={(e) => e.stopPropagation()}>
            <button
              className={modalClose}
              onClick={() => setCalendarOpen(false)}
              aria-label="Close"
            >
              <X />
            </button>
            <Eyebrow>COMPLIANCE RESOURCES</Eyebrow>
            <h2 className={modalTitle}>
              Your compliance calendar is ready to explore.
            </h2>
            <p className={modalText}>
              Use this planning view as a starting point for organizing filings,
              documentation, and important business milestones.
            </p>
            <a
              className={btnBlue}
              href="#contact"
              onClick={() => setCalendarOpen(false)}
            >
              Talk to an expert <ArrowRight size={15} />
            </a>
          </div>
        </div>
      )}
      {videoOpen && (
        <div className={modalBackdrop} onClick={() => setVideoOpen(false)}>
          <div
            className={cn(modalCard, "text-center")}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={modalClose}
              onClick={() => setVideoOpen(false)}
              aria-label="Close"
            >
              <X />
            </button>
            <div className="relative mx-auto mb-[25px] grid size-[68px] place-items-center rounded-full bg-white text-brand shadow-[0_0_0_11px_rgba(27,95,217,.12)]">
              <Play fill="currentColor" size={19} />
            </div>
            <Eyebrow className="justify-center">THE AEON APPROACH</Eyebrow>
            <h2 className={modalTitle}>
              Clarity in complexity, built into every step.
            </h2>
            <p className={modalText}>
              Our brand story is being prepared. In the meantime, speak with our
              team to see how a structured, business-focused process can help
              you move forward.
            </p>
            <a
              className={btnBlue}
              href="#contact"
              onClick={() => setVideoOpen(false)}
            >
              Start a conversation <ArrowRight size={15} />
            </a>
          </div>
        </div>
      )}
    </main>
  )
}

const modalBackdrop =
  "fixed inset-0 z-[100] grid animate-modal-in place-items-center bg-ink/70 p-5 backdrop-blur-[8px]"
const modalCard =
  "relative w-[min(500px,100%)] animate-card-in rounded-[20px] bg-white p-[35px] shadow-[0_30px_90px_rgba(0,0,0,.3)]"
const modalClose =
  "absolute top-[13px] right-[13px] grid size-[31px] place-items-center rounded-full bg-[#f1f5ff]"
const modalTitle = "text-[32px] leading-none font-bold tracking-[-0.03em]"
const modalText = "mt-4 mb-6 text-[13px] leading-[1.7] text-mute"
