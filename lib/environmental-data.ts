import { slugify } from "@/lib/rich-text"

/**
 * The "Environmental" menu: categories and the pages (links) under each.
 * Edit them later in Admin > Menus & Pages; this is only the first data.
 */
export const ENVIRONMENTAL_CATEGORIES: { label: string; links: string[] }[] = [
  {
    label: "Pollution NOC",
    links: [
      "Fire Department NOC", "Delhi Pollution Control Committee", "Uttar Pradesh Pollution Control Board",
      "NOC Pollution Control Board", "CGWA-Water Boring", "E-waste License for Dismantling",
      "License for charging station in UP", "Phase II Soil and Groundwater Investigations",
      "Consent for Establishment (CFE) from SPCB",
    ],
  },
  {
    label: "E-Waste Management",
    links: [
      "EPR Registration", "Refurbisher Authorization and License", "PRO Authorization", "Plastic Waste Authorization",
      "E-Waste Recycling Authorization", "EPR Authorization for E-waste", "EPR Post Compliance (E-Waste)",
      "Authorization for Export of E-waste", "EPR Target Fulfilment", "EPR Authorization For Battery Waste",
      "EPR Credits From Plastic Waste Recyclers", "EPR for Importers", "EPR Credits", "E-waste Recycling license",
      "EPR Registration for Producers and Brand Owners", "EPR Fulfillment in E-Waste Management", "EPR Compliance",
      "legacy waste management", "Battery EPR Credits", "Agricultural Waste Management",
      "EPR Credits Bid Management Services", "EPR for Non-ferrous Metals",
    ],
  },
  {
    label: "Plastic Waste Management",
    links: [
      "EPR Authorization for Plastic waste Management", "EPR Post Compliance – Plastic Waste",
      "Plastic Waste Recycling Plant & PWM", "Plastic Waste Processors Authorisation",
      "EPR Fulfilment For Plastic Waste Management",
    ],
  },
  {
    label: "Hazardous Waste Management",
    links: [
      "Solid Waste Management Authorization", "Hazardous Waste Management Authorization",
      "Authorization for Import of Hazardous Waste", "Authorization for Export of Hazardous Waste",
      "Bio Medical Waste Recycling Plant", "Hazardous Waste Export Authorisation", "Land Waste Management",
      "Hazardous Waste Management and Compliance Assurance", "Industrial Waste Management",
    ],
  },
  {
    label: "Battery Waste Management",
    links: [
      "New Lead Acid Battery Import License", "Lithium-Ion Battery Import License",
      "Registration for Lead Acid Battery Recycling", "Registration for Scrap Battery Import",
    ],
  },
  {
    label: "Environmental Licensing",
    links: [
      "Authorized Vehicle Scrapping Facility (AVSF)", "TSDF Facility Services", "iCAT Certification",
      "MSTC License for Scrap", "Carbon Credit Accounting", "LEED Zero Carbon Certification",
      "LEED Zero Water Certification", "Green Building Certification", "PEFC Certification", "FSC Certification",
      "Vriksh Certification", "Carbon Footprint Calculation Consulting", "CPCB Certification",
      "Vehicle Scrapping License", "LEED Certification Services", "CPCB Certificate for Compostable Products",
      "Forest Clearance Certificate", "Wildlife Clearance Certificate", "PIMS Registration",
    ],
  },
  {
    label: "Environmental Advisory",
    links: [
      "Environment, Social and Governance (ESG) Strategies", "Construction and Demolition (C&D) Waste Recycling",
      "Risk Assessment", "Supply Chain and Human Rights and Environmental Due Diligence",
      "Carbon Credit Trading Scheme", "Environmental Due Diligence Services",
    ],
  },
  {
    label: "EIA",
    links: [
      "State Pollution Control Board (SPCB) - NOC", "Environmental Auditing", "Environmental Clearance",
      "Environmental Impact Assessment (EIA)", "Hydrogeological survey report", "Half-Yearly Environmental Compliance",
      "Social Impact Assessment", "Wildlife Conservation Plan", "Environmental Management Plan Report",
      "Consent for Operation (CFO)", "Soil Testing", "CDP Reporting",
    ],
  },
  {
    label: "Environmental Industry",
    links: [
      "ESDD in Food Processing Industry", "ESDD in Tobacco Industry", "ESDD in Aerospace Industry",
      "ESDD in Renewable Energy Industry", "ESDD in Financial & Banking Sector", "ESDD in Dairy Industry",
      "ESDD in the Sugar Industry", "ESDD in Iron and Steel Industry",
      "ESDD in Agricultural Equipment Manufacturing Industry", "ESDD in Solar Energy Industry",
      "ESDD in Furniture and Fixtures Industry",
    ],
  },
]

export const ENVIRONMENTAL_CATEGORY_ICON: Record<string, string> = {
  "Pollution NOC": "shield-check",
  "E-Waste Management": "cpu",
  "Plastic Waste Management": "recycle",
  "Hazardous Waste Management": "flame",
  "Battery Waste Management": "zap",
  "Environmental Licensing": "leaf",
  "Environmental Advisory": "lightbulb",
  EIA: "clipboard-list",
  "Environmental Industry": "factory",
}

/** Every link with its page address, kept unique against the slugs already taken. */
export function environmentalPages(taken: Set<string>) {
  const used = new Set(taken)
  const out: { category: string; label: string; slug: string }[] = []
  for (const cat of ENVIRONMENTAL_CATEGORIES) {
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
