/**
 * Rebuilds the header menu from the client's "AEON Service drop down" document and makes sure every
 * link has a service page. Existing pages are matched by title and left as they are.
 *
 *   pnpm exec tsx prisma/apply-dropdown.ts
 */
import "dotenv/config"
import { db } from "../lib/db"
import { saveMenu } from "../lib/menu"
import { sanitizeRich, slugify } from "../lib/rich-text"
import { buildContent } from "../lib/startup-content"
import { ADVISORY_CATEGORY_ICON } from "../lib/advisory-content"
import { REGULATORY_CATEGORY_ICON } from "../lib/regulatory-data"

type Group = { label: string; category: string; page?: string; items: string[] }
type Top = { label: string; href: string; groups: Group[] }

const SS = "Startup Support"
const FA = "Finance Advisory"
const AIF = "AIF & Fund Support"
const XB = "Cross-Border & GIFT IFSC"

const tops: Top[] = [
  { label: "About Us", href: "/about", groups: [] },
  {
    label: "Services",
    href: "",
    groups: [
      { label: "Legal Support", category: SS, items: ["Contracts and Agreements", "Gift Deed", "Residential Rental Agreement", "Commercial Rental Agreement", "Fundraising and M&A", "Shareholder's Agreement", "Share Purchase Agreement", "Joint Venture Agreement", "Franchise Agreement", "Intellectual Property Rights", "POSH Compliance"] },
      { label: "Corporate Laws and Secretarial", category: SS, items: ["Incorporation & Registration", "Recurring Compliance", "Event Based Compliances", "FEMA Compliance", "Secretarial Support Outsourcing", "Board and General Meeting Support and Documentation", "Company Secretarial Services", "Secretarial Audit & Due Diligence", "Dematerialisation of Shares & Debentures", "Transmission of Shares and Debentures"] },
      { label: "Finance & Accounts", category: SS, items: ["Accounting & Tax Compliance", "Payroll Management & Outsourcing", "MIS and Budgeting", "Due Diligence Support", "Financial Modelling", "Financial Process Outsourcing", "Due Diligence", "Business Plan", "Virtual CFO Services"] },
      { label: "SEBI", category: "SEBI", items: ["Alternative Investment Fund Registration", "Portfolio Manager Registration With SEBI", "Stock Broker License & Registration Services", "Reverse Merger in India", "Asset Management Company Registration", "Investment Advisors Registration with SEBI", "Depository Participant SEBI Registration", "Alternative Asset Advisory & Structuring", "AIF Compliance Test Report"] },
      { label: "IRDAI", category: "IRDA", items: ["Insurer License in India: Advisory and Facilitation Support", "Insurance Broker License: Advisory and Facilitation Support", "Insurance Web Aggregator License", "Corporate Agency License", "Insurance Marketing Firm Licence", "Third Party Administrator (TPA) Licence", "IRDA Compliance for Insurance Company", "Insurance Broker Compliances", "Insurance Web Aggregator Compliances"] },
      { label: "AIF Registration", category: AIF, page: "AIF Registration", items: ["Fund Structuring & Strategic Advisory", "AIF Documentation & Legal Framework", "AIF Application & SEBI Registration Support"] },
      { label: "AIF Investment Support", category: AIF, items: ["Investment Due Diligence for Investors", "Investment Transaction Agreements & Documentation", "Investment Transaction Advisory"] },
      { label: "AIF Lifecycle & Compliance Support", category: AIF, items: ["Fund Operations & Vendor Management", "Tax & Regulatory Compliances and Advisory", "Governance & Legal Support"] },
      { label: "AIF Exit Support", category: AIF, items: ["Exit Due Diligence", "Exit Transaction Agreements", "Exit Transaction Advisory"] },
      { label: "Setting Up of Foreign Business", category: XB, items: ["Foreign Entity Incorporation and Local Setup", "Parent-Subsidiary Structuring and Transfer Pricing"] },
      { label: "India Entry Services", category: XB, page: "India Entry Services", items: ["Entity Incorporation and Setup in India", "Indian Subsidiary Company Incorporation", "Legal, Accounting and Tax Advisory in India", "Ongoing Compliance and Regulatory Support in India"] },
      { label: "GIFT City IFSC Setup", category: XB, items: ["GIFT IFSC Setup Assistance", "GIFT City Regulatory & Tax Advisory", "GIFT City Legal & Compliance Support"] },
    ],
  },
  {
    label: "Startup",
    href: "",
    groups: [
      { label: "Start Your Business", category: SS, page: "Start Your Business", items: ["Start Your Business: Planning, Structuring and Incorporation", "Indian Subsidiary Company Registration", "Startup India Registration", "MSME Registration"] },
      { label: "Virtual CFO Support", category: SS, page: "Virtual CFO Support", items: ["Financial Modelling", "Financial Process Outsourcing", "Business Plan", "ISO Certifications"] },
      { label: "Startup Legal Support", category: SS, page: "Startup Legal Support", items: ["Trademark Registration", "Cap Table Management", "Secretarial and Compliances: Monthly/Annual Retainership", "Related Party Transaction Structuring and Agreements", "Legal Retainership: Monthly/Annual", "Due Diligence Management and Advisory"] },
      { label: "Tax and Regulatory", category: SS, items: ["Tax Structuring", "Regulatory Advisory", "ESOP & Advisor Equity", "Securities Valuation Support"] },
    ],
  },
  {
    label: "Finance Advisory",
    href: "",
    groups: [{ label: "Finance Advisory", category: FA, items: ["Project Finance & Term Loans Structuring", "Working Capital Solutions", "Co-lending Arrangements", "Asset Finance and Operational Lease"] }],
  },
  { label: "Contact Us", href: "/contact-us", groups: [] },
  {
    label: "More",
    href: "",
    groups: [{ label: "More", category: SS, items: [] }],
  },
]

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
const ICON: Record<string, string> = { ...ADVISORY_CATEGORY_ICON, ...REGULATORY_CATEGORY_ICON }
/** Old titles the existing pages carry, so the new link reuses them. */
const ALIAS: Record<string, string> = {
  "Intellectual Property Rights": "Trademark Registration",
  "Incorporation & Registration": "Company Registration",
  "ISO Certifications": "ISO Registration",
  "Event Based Compliances": "Event Based Compliances in a Company",
  "Board and General Meeting Support and Documentation": "Board and General Meeting Support",
  "Secretarial Audit & Due Diligence": "Secretarial Audit",
  "Alternative Asset Advisory & Structuring": "Alternative Asset Services",
  "Portfolio Manager Registration With SEBI": "PMS registration SEBI",
  "Investment Advisors Registration with SEBI": "Investment Adviser Registration with SEBI",
  "AIF Compliance Test Report": "Compliance Test Report for AIF",
  "Cap Table Management": "Cap Table Management",
  "Financial Process Outsourcing": "Financial Process Outsourcing",
}

async function main() {
  const existing = await db.service.findMany({ select: { id: true, slug: true, title: true, isPublished: true } })
  const byTitle = new Map(existing.map((s) => [norm(s.title), s]))
  const used = new Set(existing.map((s) => s.slug))
  let created = 0
  const hrefOf = new Map<string, string>()

  async function pageFor(title: string, category: string) {
    const key = norm(title)
    if (hrefOf.has(key)) return hrefOf.get(key)!
    const hit = byTitle.get(norm(ALIAS[title] ?? title)) ?? byTitle.get(key)
    if (hit) {
      if (!hit.isPublished) await db.service.update({ where: { id: hit.id }, data: { isPublished: true } })
      const h = `/services/${hit.slug}`
      hrefOf.set(key, h)
      return h
    }
    let slug = slugify(title)
    for (let i = 2; used.has(slug); i++) slug = `${slugify(title)}-${i}`
    used.add(slug)
    const cat = category in ICON || category in REGULATORY_CATEGORY_ICON ? category : SS
    const content = buildContent(cat, title)
    await db.service.create({
      data: {
        slug,
        title,
        category: cat,
        icon: ICON[cat] ?? "",
        summary: content.summary,
        highlights: content.highlights,
        sections: content.sections.map((x) => ({ ...x, html: sanitizeRich(x.html) })),
        faqs: content.faqs,
        seoTitle: "",
        seoDescription: "",
        isPublished: true,
        autoContent: true,
      },
    })
    created++
    const h = `/services/${slug}`
    hrefOf.set(key, h)
    return h
  }

  const tree: Parameters<typeof saveMenu>[0] = []
  for (const t of tops) {
    const categories = []
    for (const g of t.groups) {
      const links = []
      for (const item of g.items) links.push({ label: item, href: await pageFor(item, g.category) })
      const href = g.page ? await pageFor(g.page, g.category) : ""
      categories.push({ label: g.label, href, links })
    }
    tree.push({ label: t.label, href: t.href, categories })
  }
  // "More": the company pages
  const more = tree.find((t) => t.label === "More")!
  more.categories = [
    {
      label: "More",
      href: "",
      links: [
        { label: "Partner With Us", href: "/partner-with-us" },
        { label: "Work at Aeon", href: "/work-at-aeon" },
        { label: "Career", href: "/career" },
        { label: "Client Reviews", href: "/reviews" },
      ],
    },
  ]
  await saveMenu(tree)
  console.log(`Menu saved: ${tree.map((t) => `${t.label}(${t.categories.reduce((n, c) => n + c.links.length, 0)})`).join(", ")}. ${created} new pages.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
