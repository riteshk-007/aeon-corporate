import { slugify } from "@/lib/rich-text"

/**
 * The "Compliance" menu: categories and the pages (links) under each.
 * Edit them later in Admin > Menus & Pages; this is only the first data.
 */
export const COMPLIANCE_CATEGORIES: { label: string; links: string[] }[] = [
  {
    label: "Secretarial",
    links: [
      "Winding Up of Private Limited Company", "Closing a Limited Liability Partnership",
      "Annual Compliance of a Pvt. Ltd. Company", "Annual Filing for LLP", "Event Based Compliances in a Company",
      "Change in Object Clause", "Appointment and Resignation of Directors", "Change in Name Clause",
      "Removal of Director", "Nidhi Company Compliance", "Section 8 Company Compliance", "NBFC Compliance",
      "Change in Registered Office", "Change in Share Capital", "Revival of Struck Off Companies", "MCA Compliance",
      "Change in Directors", "Change in LLP Agreement", "Liquidation of Company", "AGR-Return Filing", "Form AOC-4",
      "Form MGT-7", "SPICe+ Form", "AGILE PRO S", "Payment Gateway Compliance", "Insurance Broker Compliance",
      "NBFC Account Aggregator Compliance", "Insurance Web Aggregator Compliance",
    ],
  },
  {
    label: "Tax Filing/Compliance",
    links: [
      "GST Registration", "GST Return Filing", "TDS Return Filing", "Professional Tax Registration",
      "Income Tax Return Filing", "GST Advisory Services", "GST Annual Return Filing", "GST LUT Form",
      "GST Compliance Services", "Income Tax Compliance", "Income Tax Advisory", "XBRL Filing",
      "GST Registration for NRI", "CA Consultation Services", "Company Secretarial Services",
      "Income Tax Notice Management Software", "GST notice management software", "ITR for NRI",
      "Green Bonds & Sustainable Finance Advisory", "MCA Compliance for Insurance Company",
      "Money Changer Compliance", "GST Consultant",
    ],
  },
  {
    label: "Accounting & CFO",
    links: [
      "Due Diligence", "Business Plan", "Virtual CFO Services", "Accounts Payable Service",
      "Accounts Receivable Services", "Tax Audit", "Forensic Audit", "Bookkeeping Services", "Fundraising Services",
      "Term sheet", "Manufacturing Audit", "Technical Audit", "Factory Sanitation Audit", "M2M Communications",
      "Ethical Audits", "Insurance Audit", "Fractional CFO Services", "MIS Reporting",
    ],
  },
  {
    label: "Contracts & Agreements",
    links: [
      "Service Level Agreement", "Share Purchase Agreement", "Franchise Agreement", "Sale Deed Registration",
      "Gift Deed", "Residential Rental Agreement", "Commercial Rental Agreement", "Relinquishment Deed",
      "Probate of Will", "Shareholder’s Agreement", "Joint Venture Agreement",
    ],
  },
  {
    label: "Legal Services",
    links: [
      "Legal Notice", "RERA Complaint", "Cheque Bounce Notice", "Caveat Petition", "Legal Heir Certificate",
      "Section 8-Demand Notice", "Succession Certificate in India", "Lease Agreement Drafting", "Will Drafting",
      "Power of Attorney (POA)", "Legal Notice for Defamation", "Online Dispute Resolution",
      "Online Legal India Services", "Company Dispute Resolution", "Consumer Dispute Resolution",
      "POSH Compliance Services",
    ],
  },
  {
    label: "Convert Your Business",
    links: [
      "Secretarial Audit", "Sole Proprietorship to Pvt. Ltd. Company", "Conversion of Pvt. Ltd. to Public Limited",
      "Conversion of LLP to Private Company", "Partnership Firm into Pvt. Ltd. Company",
      "Conversion of a One Person Company to Private Limited Company",
    ],
  },
]

export const COMPLIANCE_CATEGORY_ICON: Record<string, string> = {
  Secretarial: "scroll",
  "Tax Filing/Compliance": "percent",
  "Accounting & CFO": "calculator",
  "Contracts & Agreements": "file-pen",
  "Legal Services": "scale",
  "Convert Your Business": "trending",
}

/** Every link with its page address, kept unique against the slugs already taken. */
export function compliancePages(taken: Set<string>) {
  const used = new Set(taken)
  const out: { category: string; label: string; slug: string }[] = []
  for (const cat of COMPLIANCE_CATEGORIES) {
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
