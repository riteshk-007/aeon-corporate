import { slugify } from "@/lib/rich-text"

/**
 * The Startup menu: categories and the pages (links) under each.
 * Edit them later in Admin > Menus; this is only the first data.
 */
export const STARTUP_CATEGORIES: { label: string; links: string[] }[] = [
  {
    label: "Business Registration",
    links: [
      "Company Registration",
      "LLP Registration",
      "Public Limited Company Registration",
      "One Person Company Registration",
      "Partnership Firm Registration",
      "Sole Proprietorship Registration",
      "Nidhi Company Registration",
      "Producer Company Registration",
      "Indian Subsidiary Company Registration",
      "Startup India Registration",
    ],
  },
  {
    label: "NGO / Trust",
    links: [
      "NGO Registration",
      "80G and 12A Registration",
      "Section 8 Company Registration",
      "Society Registration",
      "FCRA Registration",
      "12AA Registration",
      "Trust Registration",
      "12AB Registration",
      "Strike off Section 8 Companies",
      "NGO CSR-1 Filing",
      "NGO CSR Consultancy",
      "NGO Income Tax Advisory",
      "NGO Accounting",
      "NGO Project Report",
      "Trust Annual Compliance",
      "NGO Darpan Registration",
      "80G Registration",
    ],
  },
  {
    label: "Global Incorporation",
    links: [
      "Company Registration USA", "Company Registration Mauritius", "Company Registration Dubai",
      "Company Registration Sri Lanka", "Company Registration France", "Company Registration Singapore",
      "Company Registration Hong Kong", "Company Registration UK", "Company Registration Luxembourg",
      "Company Registration Indonesia", "Company Registration Poland", "Company Registration Germany",
      "Company Registration Japan", "Company Registration Egypt", "Company Registration Canada",
      "Company Registration Meydan", "Company Registration Russia", "Company Registration Ireland",
      "Company Registration Australia", "Company Registration New Zealand", "Company Registration Brazil",
      "Company Registration Ras Al Khaimah", "Company Registration Sharjah", "Company Registration Ajman",
      "Company Registration South Africa", "Company Registration Vietnam", "Company Setup IFZA",
      "Company Registration Oman", "Company Registration Panama", "Company Registration South Korea",
      "Company Registration in Bahrain", "Company Registration Brunei", "Company Registration Myanmar",
      "Company Registration Philippines", "Company Registration Switzerland", "Company Registration Azerbaijan",
      "Company Registration in Malaysia", "Company Registration in Romania", "Company Registration Cayman Islands",
      "Company Registration in Bangladesh", "Company Registration BVI", "Company Registration Saudi Arabia",
      "Company Registration Costa Rica", "Salalah Free Zone Company Formation", "Duqm Free Zone Company Setup",
      "DIFC Free Zone Company Setup", "ADGM Free Zone Company Setup", "KEZAD Free Zone Company Setup",
      "Company Registration In Georgia", "Company Registration Finland", "Company Registration Gibraltar",
      "Company Registration Belgium",
    ],
  },
  {
    label: "Industry Setup",
    links: [
      "Clinical Establishment Registration", "Carbon Black Manufacturing", "Green Hydrogen Plant",
      "Green Ammonia Plant", "Synthetic Rubber Business", "Paper and Paperboard Packaging Industry",
      "Fermentation Industry", "Renewable energy business", "Fire Equipment Plant Setup", "Virtual Office Space",
      "Copper Lead and Zinc Smelting Plant Setup", "Sports Goods Manufacturing India", "Metal Recycling Plant Setup",
    ],
  },
  {
    label: "Government Licenses",
    links: [
      "Shop & Establishment License", "CE Certification", "PSARA License", "Trade License", "Health Trade License",
      "Factory License", "FDA Certification", "GMP Certification", "AYUSH License", "WPC Certification",
      "PESO Certification", "CAPEXIL Certificate", "TEC Certification", "CLRA Registration and Licensing",
      "REACH Registration", "NASSCOM Membership", "IP-1 License in India", "FIFP Approval for Telecom",
      "Homologation Certificate in India", "Vehicle Type Approval Certificate in India", "IMEI Number Registration",
      "IMEI Certificate for Import of Mobile Handsets", "GJEPC Certificate", "RDSO Vendor Registration",
      "Khadi Board Registration",
    ],
  },
  {
    label: "Government Registration",
    links: [
      "MSME Registration", "IEC Registration", "EPF Registration", "RERA Registration", "NSIC Registration",
      "ESI Registration", "FIEO Registration", "Building NOC", "RERA Registration for Agents",
      "RERA Registration For Promoters", "APEDA Registration", "RNI Registration", "BEE Certification",
      "Spice Board Registration", "Barcode Registration", "World Manufacturer Identifier (WMI) Code",
      "Sanitary Import Permit", "NPOP Certification", "Coconut Board Registration", "Drone Registration",
      "IEC Code Renewal", "Political Party Registration", "MSME Return Filing",
      "Financial Intelligence Unit Registration", "GSP Certificate", "GACC Registration", "NABL Accreditation",
    ],
  },
  {
    label: "ISO Certifications",
    links: [
      "ISO Registration", "ISO 14001 EMS", "ISO 22000 FSMS", "ISO 9001 2015", "ISO 50001 Certification",
      "ISO 45001 certification", "ISO 20000 Certification", "ISO 31000 Certification", "ISO 13485 Certification",
      "ISO 21101:2014 Certification", "ISO 37001:2016 Certification", "ISO 27001 ISMS Certification",
      "ISO 16001 Certification", "ISO 39001 Certification", "ISO 2768-1 Certification",
    ],
  },
  {
    label: "Fssai & Eating License",
    links: [
      "FSSAI License", "FSSAI License Renewal", "FSSAI State License", "Eating House License",
      "FSSAI Central License", "FSSAI Annual Return", "FSSAI Product Approval", "Food Recycling License",
      "FPO Mark Certification",
    ],
  },
]

/** Every link with its page address, made unique across the whole menu. */
export function startupPages() {
  const used = new Set<string>()
  const out: { category: string; label: string; slug: string }[] = []
  for (const cat of STARTUP_CATEGORIES) {
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

/** Default page icon for each Startup category (the admin can change it per page). */
export const CATEGORY_ICON: Record<string, string> = {
  "Business Registration": "building",
  "NGO / Trust": "heart-handshake",
  "Global Incorporation": "globe",
  "Industry Setup": "factory",
  "Government Licenses": "stamp",
  "Government Registration": "landmark",
  "ISO Certifications": "award",
  "Fssai & Eating License": "food",
}
