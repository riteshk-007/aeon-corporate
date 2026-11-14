import type { ServiceInput } from "@/lib/services"

/**
 * Services from the client's brief (Landing Page doc, 30.10.2026) that were not in the
 * menus yet. They are added to the existing header menus by prisma/apply-client-services.ts.
 */
type Content = Pick<ServiceInput, "summary" | "highlights" | "sections" | "faqs" | "seoTitle" | "seoDescription">
type Key = ServiceInput["sections"][number]["key"]

const li = (items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`
const ol = (items: string[]) => `<ol>${items.map((i) => `<li>${i}</li>`).join("")}</ol>`
const sec = (key: Key, html: string, title?: string, icon?: string) => ({ key, html, ...(title ? { title } : {}), ...(icon ? { icon } : {}) })

/** New menu categories and their page icon. */
export const ADVISORY_CATEGORY_ICON: Record<string, string> = {
  "Startup Support": "rocket",
  "Finance Advisory": "landmark",
  "AIF & Fund Support": "trending",
  "Cross-Border & GIFT IFSC": "globe",
}

/** Where each new service goes: header menu, category inside it, and the page titles. */
export const CLIENT_ADDITIONS: { top: string; category: string; titles: string[] }[] = [
  {
    top: "Startup",
    category: "Startup Support",
    titles: [
      "Startup Legal Support",
      "Cap Table Management",
      "Tax Structuring",
      "Regulatory Advisory",
      "ESOP & Advisor Equity",
      "Securities Valuation Support",
      "Financial Modelling",
      "Financial Process Outsourcing",
      "Legal Retainership Services",
      "Secretarial Retainership Services",
    ],
  },
  {
    top: "Compliance",
    category: "Secretarial",
    titles: [
      "Board and General Meeting Support",
      "Secretarial Support Outsourcing",
      "Dematerialisation of Shares and Debentures",
      "Transmission of Shares",
    ],
  },
  { top: "Compliance", category: "Accounting & CFO", titles: ["Accounting & Tax Compliance", "Payroll Management"] },
  { top: "Compliance", category: "Legal Services", titles: ["POSH Compliance"] },
  {
    top: "Compliance",
    category: "Finance Advisory",
    titles: [
      "Project Finance & Term Loan Structuring",
      "Working Capital Solutions",
      "Co-lending Arrangements",
      "Asset Finance and Operational Lease",
    ],
  },
  {
    top: "Regulatory",
    category: "SEBI",
    titles: [
      "Stock Broker License",
      "Asset Management Company Registration",
      "Investment Adviser Registration with SEBI",
      "Depository Participant SEBI Registration",
      "Compliance Test Report for AIF",
    ],
  },
  {
    top: "Regulatory",
    category: "IRDA",
    titles: [
      "Corporate Agency License",
      "Third Party Administrator (TPA) Licence",
      "IRDA Compliance for Insurance Company",
      "Insurance Broker Compliances",
      "Insurance Web Aggregator Compliances",
    ],
  },
  {
    top: "Regulatory",
    category: "AIF & Fund Support",
    titles: [
      "AIF Fund Structuring",
      "AIF Documentation",
      "AIF Application Process",
      "Due Diligence for Investors",
      "Investment Transaction Agreements",
      "Investment Transaction Advisory",
      "Fund Operations and Vendor Management",
      "Fund Tax and Regulatory Advisory",
      "Fund Governance and Legal Support",
      "Exit Due Diligence",
      "Exit Transaction Agreements",
      "Exit Transaction Advisory",
    ],
  },
  {
    top: "Regulatory",
    category: "Cross-Border & GIFT IFSC",
    titles: [
      "Choosing a Jurisdiction for Foreign Business",
      "Foreign Entity Incorporation and Local Setup",
      "Parent-Subsidiary Structuring and Transfer Pricing",
      "India Entry: Entity Incorporation and Setup",
      "India Entry: Tax, Legal and Accounting Advisory",
      "India Entry: Ongoing Compliance Support",
      "GIFT IFSC Setup Assistance",
      "GIFT City Regulatory & Tax Advisory",
      "GIFT IFSC Legal & Compliance Support",
    ],
  },
]

type Profile = {
  what: (t: string) => string
  who: string[]
  benefits: string[]
  docs: string[]
  steps: string[]
  after: string[]
}

const PROFILES: Record<string, Profile> = {
  "Startup Support": {
    what: (t) =>
      `${t} is part of Aeon's support for founders and early-stage companies. We look at where your business is today, explain the legal, tax and regulatory points that apply, and handle the paperwork so your team can stay focused on building the product and the customer base.`,
    who: ["Founders planning to incorporate or recently incorporated", "Startups preparing for a fundraise or an investor review", "Growing companies setting up internal policies and records", "Companies that want a dependable outsourced legal or finance desk"],
    benefits: ["Fewer surprises at due diligence time", "Clear records that investors and auditors can rely on", "Decisions taken with the tax and legal impact understood up front", "One team for legal, secretarial and finance questions"],
    docs: ["Incorporation documents (certificate, MoA, AoA or LLP agreement)", "Shareholding or partnership details", "Existing agreements with founders, investors, employees and vendors", "Recent financial statements, if any"],
    steps: ["Short call to understand the business and the goal", "Review of documents and current position", "Written recommendation with options and risks in plain language", "Drafting, filings and implementation as agreed", "Ongoing support on retainer, if you choose"],
    after: ["Keep the cap table, registers and minutes up to date", "Review agreements when the business model or team changes", "Plan compliance dates for the year in advance"],
  },
  "Finance Advisory": {
    what: (t) =>
      `${t} is part of Aeon's capital advisory for companies and financial institutions, from structuring the mandate to closing with the right lender across banks, NBFCs and alternative credit. We help you understand the options, prepare the information lenders ask for, and negotiate terms that fit your cash flows.`,
    who: ["Companies raising debt for a project, expansion or operations", "Businesses that need to restructure or refinance existing borrowing", "NBFCs and lenders looking at partnership or co-lending models", "Promoters who want an independent view before signing a term sheet"],
    benefits: ["A structure that matches the cash flows of the business", "Lender-ready information memorandum and projections", "Access to banks, NBFCs and alternative credit through one advisor", "Clear view of security, covenants and costs before you commit"],
    docs: ["Audited financial statements for the last 2 to 3 years", "Current year provisional figures and projections", "Details of existing borrowings and security", "Company KYC and project or business plan"],
    steps: ["Understand the requirement and the use of funds", "Review financials and existing debt", "Structure the facility and prepare the information pack", "Approach suitable lenders and compare offers", "Negotiate terms and support documentation until disbursement"],
    after: ["Track covenants and reporting dates agreed with the lender", "Review the structure when the business or interest rates change", "Plan renewals of working capital limits in time"],
  },
  "AIF & Fund Support": {
    what: (t) =>
      `${t} is part of Aeon's support for Alternative Investment Funds (AIFs), their managers and investors under the SEBI (Alternative Investment Funds) Regulations, 2012. Our support covers the fund's life cycle: setting up, investing, running the fund and exiting investments.`,
    who: ["Sponsors and managers planning a Category I, II or III AIF", "Registered AIFs and their investment managers", "Investors evaluating an investment by or in a fund", "Portfolio companies dealing with a fund investor"],
    benefits: ["Structure and documents aligned with SEBI's requirements", "Faster responses to SEBI and investor queries", "Clean records for audits and compliance test reports", "Support across fund setup, investment and exit"],
    docs: ["Details of the sponsor, manager and key team", "Proposed fund strategy, size and category", "Draft or existing private placement memorandum and fund documents", "KYC and net worth documents, as applicable"],
    steps: ["Discuss the fund strategy or the transaction", "Review documents and the regulatory position", "Prepare or review the structure and documents", "File with SEBI or close the transaction as applicable", "Ongoing support during the life of the fund"],
    after: ["Periodic reporting to SEBI and investors", "Compliance test report and audits as required", "Approvals and disclosures for material changes"],
  },
  "Cross-Border & GIFT IFSC": {
    what: (t) =>
      `${t} is part of Aeon's cross-border support for Indian businesses going abroad, foreign businesses entering India, and companies setting up at GIFT City (IFSC). We look at the corporate, tax, foreign exchange (FEMA) and regulatory points together so the structure works in practice.`,
    who: ["Indian companies setting up a subsidiary or office outside India", "Foreign companies entering India through a subsidiary, branch or office", "Businesses planning a unit or fund at GIFT IFSC", "Groups reviewing their parent-subsidiary structure"],
    benefits: ["The right jurisdiction and entity type for your plans", "FEMA, tax and transfer pricing considered from the start", "One coordinated team for setup and ongoing compliance", "Local professional support where needed"],
    docs: ["Details and KYC of the parent company and its directors", "Board resolution and business plan for the new entity", "Proof of address and other documents as required by the jurisdiction", "Existing group structure chart"],
    steps: ["Understand the business plan and the countries involved", "Compare jurisdictions, entity types and approvals", "Prepare documents and file for incorporation or approvals", "Set up bank, tax and regulatory registrations", "Support ongoing compliance and reporting"],
    after: ["Annual filings in each jurisdiction", "FEMA reporting such as ODI or FDI returns, as applicable", "Transfer pricing documentation for inter-company transactions"],
  },
}

const STARTUP_LEGAL: Content = {
  summary:
    "End-to-end legal support for startups: founder and investor agreements, trademark, cap table, secretarial compliance, related party transactions and due diligence, on project or retainer basis.",
  highlights: ["Founder, investor and employee agreements", "Trademark and IP protection", "Cap table and ESOP records", "Monthly or annual retainer options"],
  sections: [
    sec(
      "overview",
      `<p>Startups move fast, and the legal work often gets pushed to later. That is usually when it becomes expensive: during a fundraise, an investor's due diligence or a dispute between founders. <strong>Startup Legal Support</strong> (also called <strong>Governance and Legal Support</strong>) from Aeon gives you a dependable legal desk from day one, so the basics are in place before they are needed.</p><p>We work as an extension of your team. You can engage us for a single task, such as a shareholders' agreement, or on a monthly or annual retainer that covers your day-to-day legal and secretarial needs. For contracts and other legal documents, see our <a href="/services/service-level-agreement">Contracts &amp; Agreements</a> and <a href="/services/legal-notice">Legal Services</a> pages.</p>`,
    ),
    sec(
      "advantages",
      li([
        "<strong>Trademark registration:</strong> protect your brand name and logo before you scale. See <a href=\"/services/trademark-registration\">Trademark Registration</a>.",
        "<strong>Cap table management:</strong> an accurate record of who owns what, updated for every allotment, transfer and ESOP grant.",
        "<strong>Secretarial and compliance retainer:</strong> board meetings, minutes, registers and ROC filings handled on a monthly or annual plan.",
        "<strong>Related party transactions:</strong> structuring and agreements for transactions between the company and its founders, directors or group entities, with the approvals the law requires.",
        "<strong>Legal retainer:</strong> contract drafting and review, vendor and customer agreements, employment documents and policies on call.",
        "<strong>Due diligence management:</strong> preparing the data room and answering investor or acquirer questions, and advising you on the findings.",
      ]),
      "What we cover",
      "sparkles",
    ),
    sec("eligibility", li(["Founders before or soon after incorporation", "Startups raising a seed or Series A round", "Companies issuing ESOPs or advisor equity", "Startups without an in-house legal or secretarial team"]), "Who it is for"),
    sec("documents", `${li(["Incorporation documents and current shareholding", "Existing founder, investor and employee agreements", "Term sheet, if a fundraise is under way", "Brand name and logo details for trademark filing"])}<p>The exact list depends on the work. We confirm it after a short discussion.</p>`),
    sec("process", ol(["Discovery call to understand the business, stage and priorities", "Legal health check of documents, registers and filings", "Plan of work and fee proposal, per task or on retainer", "Drafting, filings and negotiations as agreed", "Regular check-ins and support as the company grows"])),
    sec("features", li(["Single point of contact for legal and secretarial questions", "Clear timelines and status updates", "Documents written in plain language you can understand", "Flexible engagement: per task, monthly or annual"]), "How the engagement works"),
    sec(
      "why-us",
      li([
        "<strong>Experience across the startup journey:</strong> our team has advised early-stage startups, growth-stage companies and private equity funds.",
        "<strong>Legal and finance together:</strong> secretarial, tax and finance questions are answered by the same team.",
        "<strong>Founder-centric and cost-effective:</strong> professional advice without the cost structure of a large firm.",
      ]),
      "Why Aeon",
    ),
  ],
  faqs: [
    { q: "Can we hire Aeon for a single document?", a: "Yes. You can engage us for one task, such as a shareholders' agreement or a trademark filing, or choose a monthly or annual retainer." },
    { q: "What does the retainer include?", a: "It is agreed with you based on your needs. It usually covers contract review, routine legal queries, board and shareholder meetings, statutory registers and ROC filings." },
    { q: "Do you help during a fundraise?", a: "Yes. We help with the term sheet, investor agreements, the data room and due diligence questions, and the filings needed after the round closes." },
  ],
  seoTitle: "",
  seoDescription: "",
}

export function buildAdvisoryContent(category: string, title: string): Content {
  if (title === "Startup Legal Support") return STARTUP_LEGAL
  const p = PROFILES[category]
  return {
    summary: `${title}: what it covers, who it is for, the documents needed and how Aeon works with you.`,
    highlights: ["Requirement assessment by our team", "Options and risks explained clearly", "Documentation and filings handled", "Support until the work is complete"],
    sections: [
      sec("overview", `<p>${p.what(title)}</p><p>Every case is different. We confirm the current legal and regulatory position for your situation before we start.</p>`),
      sec("advantages", li(p.benefits), "Benefits", "thumbs-up"),
      sec("eligibility", li(p.who), "Who it is for", "clipboard-check"),
      sec("documents", `${li(p.docs)}<p>The exact list depends on your case. We confirm it after a short discussion.</p>`, "Documents required"),
      sec("process", ol(p.steps), "How we work"),
      sec("features", li(p.after), "Points to keep in mind", "clock"),
      sec(
        "why-us",
        li([
          "<strong>Experienced team:</strong> professionals with corporate and practice experience in corporate laws, finance and regulatory matters.",
          "<strong>Plain language:</strong> we explain options and risks in words you can act on.",
          "<strong>One partner:</strong> legal, secretarial, tax and finance questions handled together.",
        ]),
        "How Aeon helps",
      ),
    ],
    faqs: [
      { q: `Who should consider ${title}?`, a: "It depends on your business and your plans. Share a few details through the enquiry form and we will tell you whether it fits and what is involved." },
      { q: "How are fees decided?", a: "After understanding the scope, we share a written proposal with the scope of work and professional fees before we begin." },
      { q: "How long does it take?", a: "It depends on the scope, the documents available and any approvals involved. We give you a realistic timeline after reviewing your details." },
    ],
    seoTitle: "",
    seoDescription: "",
  }
}
