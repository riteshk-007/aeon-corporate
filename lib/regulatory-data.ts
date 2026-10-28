import { slugify } from "@/lib/rich-text"

/**
 * The "Regulatory" menu: categories and the pages (links) under each.
 * Edit them later in Admin > Menus & Pages; this is only the first data.
 */
export const REGULATORY_CATEGORIES: { label: string; links: string[] }[] = [
  {
    label: "RBI",
    links: [
      "NBFC Registration", "NBFC Takeover", "FFMC License", "Microfinance Company Registration",
      "Housing Finance Company Registration", "NBFC Account Aggregator License", "Prepaid Wallet License",
      "Peer to Peer Lending License", "Payment Bank License", "Payment Gateway License", "Mobile Wallet License",
      "TPAP License", "NBFC for Sale", "Payment Aggregator License", "NBFC Marketing Services in India",
      "NBFC Debt Recovery Advisory", "NBFC Asset Liability Management", "Mortgage Guarantee Company Registration",
      "NBFC Loan Portfolio Audit", "NBFC Software", "Funding in NBFC",
    ],
  },
  {
    label: "SEBI",
    links: [
      "Alternative Investment Fund Registration", "Mergers and Acquisitions", "Recovery of Shares",
      "Merchant Banker License", "AMFI Registration", "Collective Investment Scheme",
      "Registration of Underwriters with SEBI", "PMS registration SEBI", "Insurance Repository Registration",
      "REIT Registration", "SEBI AIF Compliance", "Reverse Merger",
    ],
  },
  {
    label: "IRDA",
    links: [
      "Insurance Company License", "Insurance Web Aggregator License", "Insurance Broker License",
      "Insurance Surveyors and Loss Assessors Registration", "Insurance Marketing Firm", "Insurance Self-Network Platform",
    ],
  },
  {
    label: "CDSCO",
    links: [
      "Drug License", "Retail Drug License", "Manufacturing Drug License", "Wholesale Drug License",
      "Medical Device Registration", "CDSCO Registration", "CDSCO Cosmetic Import Registration",
      "CDSCO Medical Device Import License", "Cosmetic Manufacturing License",
      "In Vitro Diagnostic Device Manufacturing License", "InVitro Diagnostic Device Import License", "Drug Export NOC",
      "Dual-Use NOC", "CDSCO Test License", "ADC NOC", "CDSCO Drugs Import License", "Pharmacist Registration Renewal",
    ],
  },
  {
    label: "BIS",
    links: [
      "BIS Registration", "Eco Mark Scheme Certification", "ISI Mark Certification", "BIS CRS Registration",
      "BIS LAB Recognition Scheme", "Hallmark Registration", "Assaying and Hallmarking Centre", "STQC Certification",
      "BIS CRS Certification for Power Banks", "AGMARK License", "BIS Certification for Toys", "FMCS BIS Certification",
      "Development, Planning & Implementation of CSR Strategy",
    ],
  },
  {
    label: "FEMA",
    links: ["FEMA Compliance", "Liaison Office Registration", "Branch Office Registration", "Project Office Registration"],
  },
  {
    label: "Legal Metrology",
    links: [
      "Legal Metrology Act Registration", "Model Approval Certificate for Weights and Measures", "LMPC Importer License",
      "Legal Metrology Dealer License", "Legal Metrology Manufacturer License", "Legal Metrology Repairer License",
      "Packaged Commodity Registration", "Legal Metrology License Renewal", "Legal Metrology Compliance & Audit",
      "Legal Metrology Notice Resolution Services", "LMPC Certificate",
    ],
  },
  {
    label: "Telecom",
    links: [
      "UL VNO License", "WPC Import License", "IPLC License", "Non-Network License Services", "Network License",
      "Access Service License Registration", "DPL/NDPL License", "Demonstration License", "FCC Certification",
      "SACFA Clearance",
    ],
  },
]

export const REGULATORY_CATEGORY_ICON: Record<string, string> = {
  RBI: "landmark",
  SEBI: "trending",
  IRDA: "shield-check",
  CDSCO: "pill",
  BIS: "award",
  FEMA: "globe",
  "Legal Metrology": "scale",
  Telecom: "phone",
}

/** Every link with its page address, kept unique against the slugs already taken. */
export function regulatoryPages(taken: Set<string>) {
  const used = new Set(taken)
  const out: { category: string; label: string; slug: string }[] = []
  for (const cat of REGULATORY_CATEGORIES) {
    for (const label of cat.links) {
      const base = slugify(label)
      let slug = base
      for (let i = 2; used.has(slug); i++) slug = `${base}-${i}`
      used.add(slug)
      out.push({ category: cat.label, label, slug })
    }
  }
  return out
}
