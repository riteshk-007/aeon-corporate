import type { ServiceInput } from "@/lib/services"
import { IP_CATEGORY_ICON } from "@/lib/ip-data"
import { buildIpContent } from "@/lib/ip-content"
import { COMPLIANCE_CATEGORY_ICON } from "@/lib/compliance-data"
import { buildComplianceContent } from "@/lib/compliance-content"
import { REGULATORY_CATEGORY_ICON } from "@/lib/regulatory-data"
import { buildRegulatoryContent } from "@/lib/regulatory-content"
import { ENVIRONMENTAL_CATEGORY_ICON } from "@/lib/environmental-data"
import { buildEnvironmentalContent } from "@/lib/environmental-content"

type Content = Pick<ServiceInput, "summary" | "highlights" | "sections" | "faqs" | "seoTitle" | "seoDescription">
type Key = ServiceInput["sections"][number]["key"]

const li = (items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`
const ol = (items: string[]) => `<ol>${items.map((i) => `<li>${i}</li>`).join("")}</ol>`
const sec = (key: Key, html: string) => ({ key, html })

/** What each ISO standard is about (only the ones we are sure of). */
const ISO_TOPIC: Record<string, string> = {
  "9001": "quality management systems",
  "14001": "environmental management systems",
  "22000": "food safety management systems",
  "50001": "energy management systems",
  "45001": "occupational health and safety management systems",
  "20000": "IT service management systems",
  "13485": "quality management systems for medical devices",
  "37001": "anti-bribery management systems",
  "27001": "information security management systems",
  "39001": "road traffic safety management systems",
  "21101": "adventure tourism safety management systems",
}

type Profile = {
  /** one-line meaning of the service group */
  what: (t: string) => string
  who: string[]
  docs: string[]
  steps: string[]
  after: string[]
  advantages: string[]
  authority: string
}

const PROFILES: Record<string, Profile> = {
  "Business Registration": {
    authority: "the Registrar of Companies, the Registrar of Firms or the relevant state authority",
    what: (t) => `${t} is the formal registration that gives your business a legal identity, so it can open bank accounts, sign contracts, pay taxes and grow with clear rules.`,
    who: ["Founders, partners or owners who want to start or formalise a business in India.", "The exact conditions (number of members, residency, capital) depend on the type of entity and are set by the law that governs it.", "A proposed business name that follows the naming rules, and a registered address in India."],
    docs: ["PAN card and identity proof of each owner, partner or director.", "Address proof (such as a bank statement or utility bill) and a passport-size photograph of each person.", "Proof of the business address, such as a rent agreement with a no-objection letter from the owner, or ownership proof.", "Any further document asked for in the specific form for this registration."],
    steps: ["<strong>Consultation:</strong> we understand your plan and confirm that this is the right structure.", "<strong>Document check:</strong> we review your documents and tell you what is missing.", "<strong>Name and application:</strong> the name is checked and the application is prepared and filed.", "<strong>Follow-up:</strong> we track the application and answer any query raised by the authority.", "<strong>Certificate:</strong> once approved, you receive the registration certificate and next-step guidance."],
    after: ["Open a business bank account in the name of the entity.", "Apply for tax registrations that apply to you, such as GST.", "Keep the books of accounts and file the periodic returns required for this type of entity.", "Keep your registered details (address, members, directors) up to date with the authority."],
    advantages: ["A legal identity for your business.", "Easier banking, contracts and tax compliance.", "Greater trust from customers, vendors and investors.", "A clear structure for ownership and responsibility."],
  },
  "NGO / Trust": {
    authority: "the Registrar of Societies or Trusts, the Registrar of Companies, the Income Tax Department or the Ministry of Home Affairs (for FCRA), depending on the service",
    what: (t) => `${t} supports non-profit organisations in India with registration, tax recognition or ongoing compliance, so they can work in a lawful and transparent way.`,
    who: ["Founders and trustees of a trust, society or Section 8 company working for a charitable or social purpose.", "Existing non-profits that need tax recognition, a compliance filing or accounting support.", "Eligibility, objects and conditions depend on the exact registration and are checked against the current rules."],
    docs: ["PAN, identity and address proof of the trustees, members or directors.", "The governing document, such as the trust deed, memorandum and rules, or memorandum and articles.", "Proof of the registered office address.", "Past accounts, registration certificates and activity reports, where the service is for an existing organisation."],
    steps: ["<strong>Consultation:</strong> we understand your objects and activities and suggest the right registration.", "<strong>Drafting:</strong> we prepare or review the deed, rules or application.", "<strong>Filing:</strong> the application is filed with the concerned authority or portal.", "<strong>Follow-up:</strong> we respond to queries and track the application.", "<strong>Certificate and guidance:</strong> you receive the registration or approval and a note on the compliance that follows."],
    after: ["Maintain proper books of accounts and records of meetings.", "File annual returns and statements as required for your type of organisation.", "Renew or re-apply for registrations that have an expiry.", "Use funds only for the objects stated in your governing document."],
    advantages: ["Legal recognition for your organisation.", "Eligibility to apply for tax benefits and grants, where the law allows.", "Better trust from donors and partners.", "Clear records and compliance from the start."],
  },
  "Global Incorporation": {
    authority: "the company registry or licensing authority of the country or free zone concerned",
    what: (t) => `${t} helps you set up a company outside India, with guidance on the structure, documents and local rules that apply.`,
    who: ["Indian and foreign founders, startups and companies who want a presence or a holding company abroad.", "Rules on directors, shareholders, local residents, capital and licences differ for each country or free zone and are confirmed at the start.", "Indian residents also have to follow Indian rules on overseas investment (FEMA) and tax reporting."],
    docs: ["Passport and address proof of each director and shareholder.", "Proposed company names and the business activity.", "Proof of the business address or the registered office details.", "Details of the owners' source of funds and other know-your-customer papers, where the registry or bank asks for them.", "Attested or notarised copies where the country requires them."],
    steps: ["<strong>Consultation:</strong> we understand why you need the entity and compare suitable locations and structures.", "<strong>Document collection:</strong> we tell you which papers are needed and how they must be attested.", "<strong>Name and filing:</strong> the name is checked and the incorporation is filed with the local registry or free zone.", "<strong>Certificate:</strong> the registry issues the incorporation documents.", "<strong>Next steps:</strong> guidance on a bank account, taxes and annual filings of that country."],
    after: ["Open a corporate bank account.", "Keep the registered address and a company secretary or agent where the law requires one.", "File annual returns and accounts in that country, and renew licences on time.", "Report overseas holdings and income as required in India."],
    advantages: ["A legal presence in a new market.", "Easier dealings with foreign clients, banks and partners.", "Possible tax and structuring benefits, depending on the country and your situation.", "A structure that can hold assets, IP or investments."],
  },
  "Industry Setup": {
    authority: "the state industries department, pollution control board, local bodies and the sector regulator concerned",
    what: (t) => `${t} covers the approvals, licences and planning needed to start and run this kind of unit in India.`,
    who: ["Entrepreneurs and companies planning a new plant, project or business in this sector.", "Existing units that need new approvals before expansion.", "The exact permissions depend on the location, scale, raw materials and process, and are mapped at the start."],
    docs: ["Identity, PAN and incorporation or registration papers of the business.", "Land or premises documents and the site plan.", "A project report with the products, capacity, machinery and investment.", "Environmental, fire, electricity and local approvals as applicable to the project."],
    steps: ["<strong>Feasibility discussion:</strong> we understand the project and list the approvals it will need.", "<strong>Planning:</strong> we help with the project report and the order in which approvals should be taken.", "<strong>Applications:</strong> the licences and registrations are prepared and filed.", "<strong>Follow-up:</strong> we track each application and respond to queries.", "<strong>Start-up guidance:</strong> you get a checklist of the compliances that apply once the unit starts."],
    after: ["Renew consents and licences before they expire.", "Keep records for inspections and audits.", "File returns and statements to the pollution, labour and tax authorities as required.", "Update the authorities when capacity, products or ownership change."],
    advantages: ["A clear list of approvals before you invest.", "Fewer delays from missing or wrong applications.", "A lawful start and fewer problems during inspections.", "A project report you can also use with banks and funders."],
  },
  "Government Licenses": {
    authority: "the department or board that issues this licence",
    what: (t) => `${t} is a licence or certificate issued by a government body or a notified agency that a business needs before it can lawfully carry on the related activity.`,
    who: ["Businesses that carry on the activity covered by this licence or that want the certification for sale, import or export.", "The conditions, fees and validity are set by the issuing authority and may change; we confirm them for your case.", "Premises and operations must meet the standards of the issuing authority."],
    docs: ["PAN, identity proof and business registration papers.", "Proof of the business premises, such as a rent agreement or ownership proof.", "Product, process or activity details asked for in the application.", "Test reports, inspection reports or no-objection certificates, where the authority requires them."],
    steps: ["<strong>Eligibility check:</strong> we confirm that you need this licence and which category applies.", "<strong>Document preparation:</strong> we collect and review the papers.", "<strong>Application:</strong> the application is filed with the authority or portal.", "<strong>Inspection or testing:</strong> where required, we guide you through it.", "<strong>Licence issued:</strong> you receive the licence or certificate and a renewal reminder note."],
    after: ["Display the licence where the law asks you to.", "Renew it before the validity ends.", "Inform the authority about changes in address, ownership or activity.", "Keep records ready for inspection."],
    advantages: ["Lawful operation of the activity.", "Protection from penalties for working without a licence.", "More trust from customers and business partners.", "Access to markets or tenders that need the certificate."],
  },
  "Government Registration": {
    authority: "the board, council, department or portal that runs this registration",
    what: (t) => `${t} is an official registration that lists your business with the concerned body, which may be required by law or may open benefits and market access.`,
    who: ["Businesses, professionals or organisations that fall under the scope of this registration.", "Some registrations are compulsory and others are voluntary; we tell you which applies to you.", "Conditions, thresholds and fees are set by the registering body and can change."],
    docs: ["PAN, Aadhaar or other identity proof of the owner or authorised person.", "Business registration papers (such as incorporation certificate or partnership deed).", "Address proof of the business and a bank account detail.", "Any specific papers asked for in the form of this registration."],
    steps: ["<strong>Check:</strong> we confirm that this registration applies to you and under which category.", "<strong>Documents:</strong> we prepare and review the papers.", "<strong>Filing:</strong> the application is filed on the official portal or with the office concerned.", "<strong>Follow-up:</strong> we track it and answer queries.", "<strong>Registration issued:</strong> you receive the registration number or certificate."],
    after: ["Keep the registration details safe and use them on invoices or documents where required.", "File returns, renewals or updates when due.", "Tell the authority about changes in the business.", "Keep supporting records for audits."],
    advantages: ["Lawful standing for the related activity.", "Eligibility for schemes, benefits or tenders, where they exist.", "Easier dealings with banks, buyers and government bodies.", "A verifiable record for your business."],
  },
  "ISO Certifications": {
    authority: "an accredited certification body (the certificate is not issued by the government)",
    what: (t) => `${t} shows that your organisation follows an internationally recognised management standard, checked by an independent certification body.`,
    who: ["Companies, firms and institutions of any size that want a recognised standard for their processes.", "Organisations that need the certificate for tenders, customers or exports.", "The scope of certification is set by your activities and locations."],
    docs: ["Business registration papers and PAN.", "Details of the scope: activities, locations and number of employees.", "Existing procedures, policies and records, if any.", "Organisation chart and list of key processes."],
    steps: ["<strong>Gap review:</strong> we compare your present practices with the standard.", "<strong>Documentation:</strong> policies, procedures and records are prepared.", "<strong>Implementation and training:</strong> your team puts the system into use.", "<strong>Internal audit and review:</strong> you check that it works before the outside audit.", "<strong>Certification audit:</strong> the accredited body audits and, if satisfied, issues the certificate."],
    after: ["Certificates are normally valid for a cycle of three years, with surveillance audits in between.", "Keep records and carry out internal audits and management reviews.", "Recertify before the cycle ends.", "Inform the certification body of major changes."],
    advantages: ["Recognition that you follow a global standard.", "Better organised processes and fewer errors.", "Helps with tenders and customer requirements.", "Builds trust with customers and partners."],
  },
  "Fssai & Eating License": {
    authority: "the Food Safety and Standards Authority of India (FSSAI) and the state food safety offices",
    what: (t) => `${t} is part of the food licensing and registration system that every food business in India has to follow.`,
    who: ["Food manufacturers, traders, restaurants, caterers, importers, e-commerce food sellers and other food business operators.", "The kind of registration or licence (basic, state or central) depends on turnover, the kind of business and the location.", "Premises must meet the hygiene and safety conditions of the law."],
    docs: ["PAN, identity proof and photograph of the owner or director.", "Proof of the business premises, with a no-objection letter if rented.", "Food safety management plan and list of food products, where required.", "Business constitution papers, and for some categories a layout plan, water report or other certificates."],
    steps: ["<strong>Category check:</strong> we confirm which type of licence or registration applies.", "<strong>Documents:</strong> we prepare and review the papers.", "<strong>Application:</strong> the application is filed on the FSSAI portal.", "<strong>Inspection:</strong> where the authority inspects, we guide you on what to keep ready.", "<strong>Licence issued:</strong> you receive the licence or registration certificate."],
    after: ["Display the licence number on your premises and on food packaging or bills as the law requires.", "Renew the licence before it expires.", "File the annual return where it applies to you.", "Follow the hygiene and labelling rules at all times."],
    advantages: ["Lawful food business.", "Protection from penalties for working without a licence.", "Customers and platforms trust a licensed seller.", "Needed for many tie-ups with retailers and online platforms."],
  },
}

/** Name of the standard in titles like "ISO 14001 EMS", "ISO 9001 2015", "ISO 27001 ISMS Certification". */
function isoNumber(title: string) {
  return /ISO\s*(\d{4,5})/i.exec(title)?.[1]
}

export function buildContent(category: string, title: string): Content {
  if (category in IP_CATEGORY_ICON) return buildIpContent(category, title)
  if (category in COMPLIANCE_CATEGORY_ICON) return buildComplianceContent(category, title)
  if (category in REGULATORY_CATEGORY_ICON) return buildRegulatoryContent(category, title)
  if (category in ENVIRONMENTAL_CATEGORY_ICON) return buildEnvironmentalContent(category, title)
  const p = PROFILES[category] ?? PROFILES["Government Registration"]
  const iso = category === "ISO Certifications" ? isoNumber(title) : undefined
  const topic = iso ? ISO_TOPIC[iso] : undefined

  const overview = `<p>${p.what(title)}</p>${
    topic
      ? `<p>ISO ${iso} is the international standard for <strong>${topic}</strong>. Certification means an independent body has checked that your organisation meets it.</p>`
      : ""
  }<p>The approval or certificate is given by ${p.authority}. Conditions, forms and fees are set by them and may change, so we check the current position for your case before we start.</p>`

  const summary = topic
    ? `ISO ${iso} certification for ${topic}: what it means, who needs it and how the process works.`
    : `What ${title} means, who can apply, the documents needed and how the process works.`

  return {
    summary,
    highlights: ["Eligibility check before you apply", "Document review by our team", "Application preparation and filing", "Follow-up until the work is complete"],
    sections: [
      sec("overview", overview),
      sec("advantages", li(p.advantages)),
      sec("eligibility", li(p.who)),
      sec("documents", `${li(p.docs)}<p>The exact list depends on your case. We confirm it after a short discussion.</p>`),
      sec("process", ol(p.steps)),
      sec("features", `<p>Points to remember after the work is done:</p>${li(p.after)}`),
      sec(
        "why-us",
        li([
          "<strong>Clear guidance:</strong> we explain each step in plain words.",
          "<strong>Document check:</strong> we review papers before submission to reduce errors and delays.",
          "<strong>One point of contact:</strong> you can ask your questions in one place.",
          "<strong>After the work:</strong> we tell you about renewals and compliance that follow.",
        ]),
      ),
    ],
    faqs: [
      { q: `Who can apply for ${title}?`, a: "It depends on the conditions set by the authority for this service. Share your details and we will confirm whether you are eligible and under which category." },
      { q: "Which documents are required?", a: "Usually identity and address proof, business papers and proof of the business address. The exact list depends on your case, and we confirm it before you file." },
      { q: "How long does it take?", a: "The time depends on how complete your documents are and how quickly the authority processes the application. After reviewing your details we can give you a realistic estimate." },
      { q: "What will Aeon do for me?", a: "We check your eligibility, review your documents, prepare and file the application, follow it up with the authority and guide you on what to do after approval." },
    ],
    seoTitle: `${title} in India`.slice(0, 70),
    seoDescription: summary.slice(0, 170),
  }
}
