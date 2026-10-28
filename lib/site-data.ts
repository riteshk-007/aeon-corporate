// Shared site content used by the header, footer and pages.

export const categoryServices: Record<
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

export const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Partner With Us", href: "/partner-with-us" },
  { label: "Work at Aeon", href: "/work-at-aeon" },
  { label: "Career", href: "/career" },
  { label: "Client Reviews", href: "/reviews" },
  { label: "Contact Us", href: "/contact-us" },
]
export const companyHrefs: Record<string, string> = Object.fromEntries(
  companyLinks.map((c) => [c.label, c.href]),
)

export const footerColumns = [
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
export const footerLinks = [
  "About Us",
  "Privacy Policy",
  "Refund Policy",
  "Terms & Conditions",
  "Sitemap",
  "Contact Us",
]

export const navMenus = [
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
  {
    label: "Company",
    blurb: "About us, partners, careers and more",
    icon: "company",
    links: companyLinks.map((c) => c.label),
  },
]
