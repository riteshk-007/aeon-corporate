import type { ServiceInput } from "@/lib/services"
import { CATEGORY_ICON, startupPages } from "@/lib/startup-data"
import { IP_CATEGORY_ICON, ipPages } from "@/lib/ip-data"
import { IP_WRITTEN } from "@/lib/ip-written"
import { COMPLIANCE_CATEGORY_ICON, compliancePages } from "@/lib/compliance-data"
import { COMPLIANCE_WRITTEN } from "@/lib/compliance-written"
import { REGULATORY_CATEGORY_ICON, regulatoryPages } from "@/lib/regulatory-data"
import { REGULATORY_WRITTEN } from "@/lib/regulatory-written"
import { ENVIRONMENTAL_CATEGORY_ICON, environmentalPages } from "@/lib/environmental-data"
import { ENVIRONMENTAL_WRITTEN } from "@/lib/environmental-written"
import { buildContent } from "@/lib/startup-content"

type Starter = Omit<ServiceInput, "heroImageUrl" | "icon"> & { slug: string; autoContent?: boolean; icon?: string }

const sec = (key: ServiceInput["sections"][number]["key"], html: string) => ({ key, html })

/**
 * Pages with real starter content. They are general information (no prices, no
 * promised timelines, no client numbers) and should be checked by a
 * professional and then edited in Admin > Menus > Page content.
 */
const WRITTEN: Starter[] = [
  {
    slug: "company-registration",
    title: "Company Registration",
    category: "Business Registration",
    summary:
      "Register a private limited company in India: a separate legal entity with limited liability for its shareholders, suited to startups and growing businesses.",
    highlights: [
      "Name selection guidance and approval support",
      "DSC and DIN assistance for directors",
      "SPICe+ incorporation filing with MoA and AoA",
      "PAN and TAN with the certificate of incorporation",
    ],
    sections: [
      sec("overview", `<p>A private limited company is registered under the <strong>Companies Act, 2013</strong> with the Registrar of Companies (ROC). It is a separate legal entity: it can own property, enter contracts and sue or be sued in its own name. The liability of each shareholder is limited to the unpaid amount on the shares they hold.</p><p>It is a popular structure for businesses that want to raise funds over time. Its shares cannot be offered to the general public, and the Articles of Association can place limits on how shares are transferred.</p>`),
      sec("advantages", `<ul><li><strong>Limited liability:</strong> the personal assets of the owners are generally separate from the company's debts.</li><li><strong>Separate legal identity:</strong> the company continues even if directors or shareholders change.</li><li><strong>Easier to raise investment:</strong> shares can be issued to investors, subject to the law.</li><li><strong>Credibility:</strong> banks, customers and partners often prefer to deal with a registered company.</li><li><strong>Perpetual succession:</strong> the business is not affected by the death or exit of a founder.</li></ul>`),
      sec("eligibility", `<ul><li>At least <strong>two shareholders</strong> (maximum 200).</li><li>At least <strong>two directors</strong>; one of them must be a resident of India (stayed in India for 182 days or more in the previous year).</li><li>A unique company name that does not resemble an existing company or trademark.</li><li>A registered office address in India.</li><li>Directors need a Digital Signature Certificate (DSC) and a Director Identification Number (DIN).</li><li>There is no minimum paid-up capital requirement in law.</li></ul>`),
      sec("documents", `<h3>For directors and shareholders</h3><ul><li>PAN card (passport for foreign nationals).</li><li>Identity proof, such as Aadhaar, driving licence or voter ID.</li><li>Address proof, such as a bank statement or utility bill (not older than two months).</li><li>Passport-size photograph and specimen signature.</li><li>Consent to act as a director or subscriber.</li></ul><h3>For the registered office</h3><ul><li>Rent agreement or ownership proof, such as a sale deed.</li><li>No-objection certificate (NOC) from the owner, if rented.</li><li>A recent utility bill of the premises.</li></ul>`),
      sec("process", `<ol><li><strong>DSC and DIN:</strong> the directors obtain digital signatures and director identification numbers.</li><li><strong>Name approval:</strong> proposed names are checked and submitted through the SPICe+ form on the MCA portal.</li><li><strong>SPICe+ filing:</strong> company details, subscriber and director details are filed with the integrated incorporation form.</li><li><strong>MoA and AoA:</strong> the Memorandum and Articles of Association are filed as e-MoA (INC-33) and e-AoA (INC-34).</li><li><strong>Certificate of incorporation:</strong> on approval, the ROC issues the certificate along with the company's PAN and TAN.</li></ol>`),
      sec("features", `<p>After incorporation a company must keep up with the following:</p><ul><li>Appoint the first auditor within 30 days of incorporation.</li><li>File a declaration for commencement of business (Form INC-20A) within the time allowed by law.</li><li>Hold board meetings and an annual general meeting, and maintain statutory registers.</li><li>File audited financial statements (AOC-4) and the annual return (MGT-7) with the ROC every year.</li><li>File income tax returns and keep books of accounts.</li><li>Complete director KYC every year.</li></ul>`),
      sec("types", `<table><thead><tr><th>Feature</th><th>Private Limited</th><th>One Person Company</th><th>LLP</th><th>Partnership Firm</th><th>Sole Proprietorship</th></tr></thead><tbody><tr><td>Governing law</td><td>Companies Act, 2013</td><td>Companies Act, 2013</td><td>LLP Act, 2008</td><td>Partnership Act, 1932</td><td>No specific act</td></tr><tr><td>Owners</td><td>2 to 200</td><td>1</td><td>2 or more</td><td>2 or more</td><td>1</td></tr><tr><td>Separate legal entity</td><td>Yes</td><td>Yes</td><td>Yes</td><td>No</td><td>No</td></tr><tr><td>Liability</td><td>Limited</td><td>Limited</td><td>Limited</td><td>Unlimited</td><td>Unlimited</td></tr><tr><td>Registration</td><td>Mandatory</td><td>Mandatory</td><td>Mandatory</td><td>Optional</td><td>Not required</td></tr></tbody></table><p>Rules change from time to time, so we confirm the current position for your case.</p>`),
      sec("why-us", `<ul><li><strong>Guidance before you file:</strong> we help you choose the right structure for your plans.</li><li><strong>Document check:</strong> we review documents before submission to reduce rejections.</li><li><strong>End-to-end filing:</strong> DSC, DIN, name approval, SPICe+, MoA and AoA.</li><li><strong>After incorporation:</strong> we can help with first auditor, commencement filing and annual compliance.</li></ul>`),
    ],
    faqs: [
      { q: "How many people do I need to start a private limited company?", a: "At least two directors and two shareholders. One person can hold both roles, and at least one director must be a resident of India." },
      { q: "Is there a minimum capital requirement?", a: "No minimum paid-up capital is required by law. The amount you start with is up to you." },
      { q: "Can a foreign national or NRI be a director?", a: "Yes, subject to the law, as long as at least one director is an Indian resident. Speak to us about your case." },
      { q: "Is annual compliance mandatory?", a: "Yes. Every company must file financial statements and an annual return with the ROC and file income tax returns, even if there was no business." },
    ],
    seoTitle: "Company Registration in India (Private Limited)",
    seoDescription: "Register a private limited company in India: eligibility, documents, process and compliance after incorporation.",
    isPublished: true,
  },
  {
    slug: "llp-registration",
    title: "LLP Registration",
    category: "Business Registration",
    summary: "A Limited Liability Partnership (LLP) combines the flexibility of a partnership with limited liability for its partners.",
    highlights: ["Choice of partners and designated partners", "DSC and DPIN assistance", "Name reservation and FiLLiP filing", "LLP agreement drafting and filing"],
    sections: [
      sec("overview", `<p>An LLP is registered under the <strong>Limited Liability Partnership Act, 2008</strong>. It is a separate legal entity, and each partner's liability is generally limited to the amount they agree to contribute. It is often chosen by professionals and small businesses that want limited liability with simpler management than a company.</p>`),
      sec("advantages", `<ul><li><strong>Limited liability</strong> for partners.</li><li><strong>Separate legal entity</strong> that can own property and enter contracts.</li><li><strong>Flexible management</strong> set by the LLP agreement.</li><li><strong>No minimum contribution</strong> required by law.</li><li><strong>Lower compliance</strong> than a company in many cases.</li></ul>`),
      sec("eligibility", `<ul><li>At least <strong>two partners</strong>, and at least two designated partners.</li><li>At least one designated partner must be a resident of India.</li><li>A unique LLP name approved by the Registrar.</li><li>A registered office address in India.</li><li>Designated partners need a DSC and a DPIN or DIN.</li></ul>`),
      sec("documents", `<ul><li>PAN and identity proof of every partner.</li><li>Address proof and passport-size photograph of every partner.</li><li>Proof of the registered office, such as a rent agreement with NOC or ownership proof.</li><li>Consent of each partner to act as partner or designated partner.</li></ul>`),
      sec("process", `<ol><li><strong>DSC and DPIN:</strong> designated partners obtain a digital signature and an identification number.</li><li><strong>Name reservation:</strong> the proposed LLP name is applied for.</li><li><strong>Incorporation:</strong> the FiLLiP form is filed with the Registrar.</li><li><strong>Certificate:</strong> the Registrar issues the certificate of incorporation.</li><li><strong>LLP agreement:</strong> the agreement is drafted and filed within 30 days of incorporation.</li></ol>`),
      sec("features", `<ul><li>File the annual return (Form 11) and the statement of account and solvency (Form 8) every year.</li><li>Maintain books of accounts.</li><li>An audit is needed only when turnover or contribution crosses the limits set by law.</li><li>File income tax returns.</li><li>Keep partner and address details up to date with the Registrar.</li></ul>`),
      sec("why-us", `<ul><li><strong>Right structure:</strong> we compare an LLP with a company for your plans.</li><li><strong>LLP agreement:</strong> drafted to match how you want to run the business.</li><li><strong>Annual filings:</strong> we can help you keep the LLP compliant.</li></ul>`),
    ],
    faqs: [
      { q: "What is the difference between an LLP and a private limited company?", a: "Both give limited liability. An LLP is run under an agreement between partners and usually has simpler compliance, while a company is governed by the Companies Act and is more common when raising equity funding." },
      { q: "Does an LLP have to file returns if there was no business?", a: "Yes. The annual return and statement of account must be filed every year even when there was no activity." },
    ],
    seoTitle: "LLP Registration in India",
    seoDescription: "How to register a Limited Liability Partnership in India: eligibility, documents, process and annual compliance.",
    isPublished: true,
  },
  {
    slug: "one-person-company-registration",
    title: "One Person Company Registration",
    category: "Business Registration",
    summary: "A One Person Company (OPC) lets a single owner run a company with limited liability.",
    highlights: ["Nominee selection guidance", "DSC and DIN assistance", "Name approval and SPICe+ filing", "PAN and TAN with the certificate"],
    sections: [
      sec("overview", `<p>A One Person Company is a company with <strong>only one member</strong>, registered under the Companies Act, 2013. It gives a sole founder a separate legal entity and limited liability, without needing a second shareholder.</p>`),
      sec("advantages", `<ul><li>Run a company on your own with <strong>limited liability</strong>.</li><li><strong>Separate legal identity</strong> from the owner.</li><li>A named <strong>nominee</strong> keeps the company going if the owner is unable to.</li><li>Simpler compliance than a private limited company in several areas.</li></ul>`),
      sec("eligibility", `<ul><li>One member (shareholder) and at least one director; the member can be the director.</li><li>A nominee must be named and must give consent.</li><li>Eligibility of the member (resident or non-resident) is set by the Companies (Incorporation) Rules, which have been amended over time. We confirm the current position for you.</li><li>An OPC cannot carry on certain businesses, such as non-banking financial investment activities.</li></ul>`),
      sec("documents", `<ul><li>PAN, identity proof, address proof and photograph of the member and the nominee.</li><li>Specimen signature and consent letters.</li><li>Proof of the registered office address, with NOC if rented.</li></ul>`),
      sec("process", `<ol><li><strong>DSC and DIN</strong> for the director.</li><li><strong>Name approval</strong> through the SPICe+ form.</li><li><strong>SPICe+ filing</strong> with e-MoA and e-AoA, naming the nominee.</li><li><strong>Certificate of incorporation</strong> with PAN and TAN.</li></ol>`),
      sec("features", `<ul><li>Appoint an auditor and file financial statements and the annual return with the ROC every year.</li><li>Hold board meetings as required and keep statutory records.</li><li>File income tax returns.</li><li>An OPC can be converted into a private limited company when more owners join.</li></ul>`),
      sec("why-us", `<ul><li><strong>Fit check:</strong> we tell you honestly whether an OPC or another structure suits you.</li><li><strong>End-to-end filing</strong> and a document check before submission.</li></ul>`),
    ],
    faqs: [{ q: "Can an OPC have more than one owner later?", a: "An OPC can be converted into a private limited company when you need more shareholders. Ask us about the conditions and filings." }],
    seoTitle: "One Person Company (OPC) Registration",
    seoDescription: "Understand One Person Company registration in India: eligibility, documents, process and compliance.",
    isPublished: true,
  },
]

/**
 * Every Startup menu link gets a page. Pages written by hand above are final
 * text; the rest get clearly-marked starter text (autoContent) built from the
 * service group. Starter pages stay out of Google until someone edits them.
 */
export function starterServices(): Starter[] {
  const written = new Map([...WRITTEN, ...IP_WRITTEN, ...COMPLIANCE_WRITTEN, ...REGULATORY_WRITTEN, ...ENVIRONMENTAL_WRITTEN].map((w) => [w.slug, w]))
  const icons: Record<string, string> = { ...CATEGORY_ICON, ...IP_CATEGORY_ICON, ...COMPLIANCE_CATEGORY_ICON, ...REGULATORY_CATEGORY_ICON, ...ENVIRONMENTAL_CATEGORY_ICON }
  const start = startupPages()
  const ip = ipPages(new Set(start.map((p) => p.slug)))
  const compliance = compliancePages(new Set([...start, ...ip].map((p) => p.slug)))
  const regulatory = regulatoryPages(new Set([...start, ...ip, ...compliance].map((p) => p.slug)))
  const environmental = environmentalPages(new Set([...start, ...ip, ...compliance, ...regulatory].map((p) => p.slug)))
  const all = [...start, ...ip, ...compliance, ...regulatory, ...environmental]
  return all.map<Starter>((p) => {
    const hit = written.get(p.slug)
    if (hit) return { ...hit, icon: hit.icon ?? icons[p.category] ?? "" }
    return {
      slug: p.slug,
      title: p.label,
      category: p.category,
      icon: icons[p.category] ?? "",
      ...buildContent(p.category, p.label),
      isPublished: true,
      autoContent: true,
    }
  })
}
