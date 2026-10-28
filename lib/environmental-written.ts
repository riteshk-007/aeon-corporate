import type { ServiceInput } from "@/lib/services"

type Page = Omit<ServiceInput, "heroImageUrl" | "icon"> & { slug: string; icon?: string; autoContent?: boolean }
const sec = (key: ServiceInput["sections"][number]["key"], html: string, title?: string, icon?: string) => ({
  key,
  html,
  ...(title ? { title } : {}),
  ...(icon ? { icon } : {}),
})

/**
 * Hand-written Environmental pages: general information (no fees, no promised
 * timelines). Rules, targets and fees are revised by the authorities, so each
 * should be checked by a qualified professional and then edited in admin.
 */
export const ENVIRONMENTAL_WRITTEN: Page[] = [
  {
    slug: "pro-authorization",
    title: "PRO Authorization",
    category: "E-Waste Management",
    icon: "cpu",
    summary: "A Producer Responsibility Organisation (PRO) helps producers meet their e-waste duties. Learn who can apply for PRO authorisation, the documents and the process.",
    highlights: ["Eligibility check against CPCB requirements", "Application on the EPR portal", "Replies to queries from the authority", "Guidance on PRO duties after authorisation"],
    sections: [
      sec("overview", `<p>Under the <strong>E-Waste (Management) Rules</strong>, producers of electrical and electronic equipment are responsible for collecting and recycling the waste their products create. This is called <strong>Extended Producer Responsibility (EPR)</strong>.</p><p>A <strong>Producer Responsibility Organisation (PRO)</strong> is an organisation that takes up this duty on behalf of producers. It arranges collection, channels the waste to authorised recyclers, and helps the producers prove that they met their targets. A PRO needs <strong>authorisation from the Central Pollution Control Board (CPCB)</strong> before it can work.</p>`),
      sec("advantages", `<ul><li><strong>Lawful business model:</strong> a PRO can offer EPR services to many producers once authorised.</li><li><strong>Easier compliance for producers,</strong> who can hand over collection and recycling to a specialist.</li><li><strong>Credibility:</strong> producers prefer a PRO that is authorised and tracked on the official portal.</li><li><strong>Part of the circular economy,</strong> with growing demand as targets rise.</li></ul>`, "Benefits", "thumbs-up"),
      sec("eligibility", `<ul><li>The applicant should be a <strong>legally registered entity</strong> such as a company or LLP, with the activity in its objects.</li><li>It should have the <strong>capacity and arrangements</strong> to collect and channelise e-waste: tie-ups with authorised recyclers and collection centres.</li><li>The CPCB sets <strong>conditions on experience, financial strength and infrastructure</strong>; they are revised from time to time, so we confirm the current ones.</li><li>The PRO must have a system to track the waste and to give producers and the authority the records they need.</li></ul>`, "Applicability", "clipboard-check"),
      sec("documents", `<ul><li>Certificate of incorporation, PAN and GST of the applicant; identity proof of the directors.</li><li>Memorandum and Articles, or the LLP agreement, showing the objects.</li><li>Financial statements and proof of net worth, where the conditions ask for it.</li><li>Agreements or letters of intent with authorised recyclers, dismantlers and collection centres.</li><li>Details of the collection and tracking system, and of the people who will run it.</li><li>Board resolution, authorised signatory details and an undertaking as required by the CPCB.</li></ul>`, "Documents required", "file-text"),
      sec("process", `<ol><li><strong>Eligibility check:</strong> we compare your set-up with the CPCB's requirements and tell you what is missing.</li><li><strong>Tie-ups:</strong> agreements with authorised recyclers and collection partners are arranged and documented.</li><li><strong>Application:</strong> the application is prepared and filed on the CPCB's EPR portal, with the fee and documents.</li><li><strong>Scrutiny:</strong> the CPCB examines it; we answer queries and supply further documents.</li><li><strong>Authorisation:</strong> on approval, the PRO authorisation is issued with its conditions and validity.</li></ol>`, "Application procedure", "list-ordered"),
      sec("features", `<ul><li>The authorisation has a <strong>validity period</strong> and has to be renewed before it ends.</li><li>PROs must keep <strong>records of the waste collected and channelised</strong> and the producers they act for, and report them on the portal.</li><li>The PRO must help producers meet <strong>annual EPR targets</strong> and issue the records they need.</li><li>Follow the conditions on <strong>handling, storage, transport and recycling</strong> of e-waste, and work only with authorised partners.</li><li>Changes in management, partners or address have to be informed to the authority.</li></ul>`, "Compliance & renewals", "clock"),
      sec("why-us", `<ul><li><strong>Realistic assessment:</strong> we tell you early if the set-up needs more work.</li><li><strong>Complete file:</strong> the application and agreements are prepared to the authority's checklist.</li><li><strong>Query handling:</strong> we respond until the authorisation is granted.</li><li><strong>After approval:</strong> returns, renewals and record-keeping guidance.</li></ul>`, "How Aeon helps", "shield-check"),
    ],
    faqs: [
      { q: "What is a PRO?", a: "A Producer Responsibility Organisation takes up the EPR duty of producers and helps them collect and recycle e-waste and prove that they met their targets." },
      { q: "Who authorises a PRO?", a: "A PRO is authorised by the Central Pollution Control Board through its EPR portal." },
      { q: "Does a producer have to use a PRO?", a: "No. A producer can meet its EPR duties itself, through a PRO or through authorised recyclers, as the rules allow." },
      { q: "How long is the authorisation valid?", a: "It is valid for the period stated in the authorisation and has to be renewed before it ends." },
    ],
    seoTitle: "PRO Authorization (E-Waste) in India",
    seoDescription: "How to get PRO authorisation from the CPCB under the E-Waste Rules: eligibility, documents, the process and compliance.",
    isPublished: true,
  },
  {
    slug: "fire-department-noc",
    title: "Fire Department NOC",
    category: "Pollution NOC",
    icon: "shield-check",
    summary: "A Fire Department NOC certifies that a building has the fire safety arrangements the law requires. Know who needs it, the documents and the steps.",
    highlights: ["Check of whether your building needs an NOC", "Preparation of the fire safety documents", "Application and follow-up with the fire service", "Support for the inspection and renewal"],
    sections: [
      sec("overview", `<p>A <strong>Fire Department NOC (No-Objection Certificate)</strong> is a certificate from the state fire service that states that a building or premises has the fire prevention and fire-fighting arrangements that the law requires, based on the National Building Code and the state's fire rules.</p><p>Many other approvals, such as a trade licence, a pollution consent, an occupancy certificate or an insurance cover, depend on having a valid fire NOC.</p>`),
      sec("advantages", `<ul><li><strong>Safety:</strong> the review and inspection reduce the risk of fire and make evacuation safer.</li><li><strong>Legal compliance:</strong> operating a building that needs an NOC without one can lead to notices, fines and sealing.</li><li><strong>Other approvals:</strong> the NOC is needed for trade licences, occupancy or completion certificates and some insurance and bank requirements.</li><li><strong>Trust</strong> from tenants, customers and staff.</li></ul>`, "Benefits", "thumbs-up"),
      sec("eligibility", `<p>The need for an NOC depends on the <strong>type of building, its use and its height or area</strong>, as set by the state's fire rules. In general, it is needed for:</p><ul><li>High-rise buildings above the height set by the state.</li><li>Business, commercial and mercantile buildings such as offices, shops and malls.</li><li>Educational, institutional, hospital and assembly buildings such as schools, hotels and cinemas.</li><li>Industrial, storage and hazardous-use buildings.</li><li>Residential complexes that cross the size or height limits.</li></ul><p>The limits and categories differ from state to state, so we check the rules for your location.</p>`, "Applicability", "clipboard-check"),
      sec("documents", `<ul><li>Identity and address proof of the owner or occupier, and ownership or lease papers of the premises.</li><li>Approved building plan, layout and the sanction from the local authority.</li><li>Fire safety plan showing exits, extinguishers, hydrants, alarms and sprinklers.</li><li>Completion or structural stability certificate, and electrical safety certificate.</li><li>Certificates for the fire-fighting equipment installed, and for the water storage and pumps.</li><li>Photographs of the premises, and an architect's or fire consultant's certificate where required.</li></ul>`, "Documents required", "file-text"),
      sec("process", `<ol><li><strong>Applicability:</strong> we confirm whether the building needs a provisional NOC, a final NOC or both.</li><li><strong>Plan review:</strong> the fire safety plan and arrangements are checked against the rules.</li><li><strong>Application:</strong> the application and documents are filed online or with the fire office of your area, with the fee.</li><li><strong>Inspection:</strong> a fire officer inspects the premises and the installed equipment.</li><li><strong>Corrections:</strong> any shortfall pointed out is fixed and reported.</li><li><strong>NOC issued:</strong> the certificate is granted, and the premises can be used as per its conditions.</li></ol>`, "Application procedure", "list-ordered"),
      sec("features", `<ul><li>A <strong>provisional NOC</strong> is often given at the planning stage, and a <strong>final NOC</strong> after the fire safety measures are installed.</li><li>The NOC is valid for a period set by the state and has to be <strong>renewed</strong> before it expires; late renewal may attract a fee.</li><li>Keep extinguishers, alarms and hydrants in working condition, and hold regular fire drills and records.</li><li>Inform the fire service of any change in use, area or layout.</li><li>Fees and penalties are set by the state, so we confirm them for your location.</li></ul>`, "Validity, renewal & penalties", "clock"),
      sec("why-us", `<ul><li><strong>Right category:</strong> we tell you which NOC your building needs and when.</li><li><strong>Checklist before inspection:</strong> we help you close gaps so that the inspection goes smoothly.</li><li><strong>Follow-up:</strong> we track the file with the fire office and answer queries.</li><li><strong>Renewal reminders</strong> so that the NOC does not lapse.</li></ul>`, "How Aeon helps", "shield-check"),
    ],
    faqs: [
      { q: "Is a Fire NOC compulsory?", a: "For buildings in the categories listed in the state's fire rules, yes. The categories depend on use, height and area, and differ from state to state." },
      { q: "What is the difference between a provisional and a final NOC?", a: "A provisional NOC is given at the planning or construction stage, and a final NOC is given after the fire safety arrangements are installed and inspected." },
      { q: "How long is the NOC valid?", a: "The validity is set by the state, and it has to be renewed before it ends. We confirm the period for your location." },
      { q: "What if my building fails the inspection?", a: "The officer lists the gaps. You fix them and request a re-inspection before the NOC is issued." },
    ],
    seoTitle: "Fire Department NOC in India",
    seoDescription: "Fire NOC explained: who needs it, documents, the procedure, validity and renewal.",
    isPublished: true,
  },
  {
    slug: "esdd-in-furniture-and-fixtures-industry",
    title: "ESDD in Furniture and Fixtures Industry",
    category: "Environmental Industry",
    icon: "factory",
    summary: "Environmental and Social Due Diligence (ESDD) reviews how a furniture and fixtures business affects the environment and people, and how well it manages those risks.",
    highlights: ["Review of permits, processes and records", "Site visit and interviews where the scope allows", "Risk rating against legal and lender standards", "Corrective action plan"],
    sections: [
      sec("overview", `<p><strong>Environmental and Social Due Diligence (ESDD)</strong> is a structured review of how a business or project affects the environment and the people connected with it, and whether it manages those risks properly. Lenders, investors and buyers use it before they fund, buy or partner with a business.</p><p>In the <strong>furniture and fixtures industry</strong>, the main questions are where the wood and other materials come from, how adhesives, coatings and finishes are used and emitted, how waste and dust are handled, and how workers are protected.</p>`),
      sec("advantages", `<ul><li><strong>Informed decisions</strong> for lenders and investors, with risks identified early.</li><li><strong>Lower risk of surprises</strong> such as pollution notices, accidents or sourcing problems.</li><li><strong>A clear action plan</strong> to improve practices and meet lender and buyer expectations.</li><li><strong>Better access to finance and export markets</strong> that ask for responsible sourcing and ESG information.</li></ul>`, "Benefits", "thumbs-up"),
      sec("eligibility", `<ul><li>Furniture and fixture manufacturers, carpenters' workshops with larger units, wood panel and board makers, and suppliers of components.</li><li>Lenders, investors and buyers who want to review such a business before funding, acquiring or sourcing from it.</li><li>The scope depends on the stage (planning, funding, operation or sale), the size and the standard the lender follows.</li></ul>`, "Applicability", "clipboard-check"),
      sec("documents", `<ul><li>Company registration, ownership and organisation chart.</li><li>Pollution Control Board consents, factory licence, fire NOC and other permits.</li><li>Sourcing records for wood and board, with proof of legal origin and any certification (such as FSC or PEFC).</li><li>Records on chemicals used: adhesives, paints, varnishes and preservatives, with safety data sheets.</li><li>Data on energy, water, waste, dust and emissions; waste disposal records.</li><li>Workforce details, health and safety records, accident logs, wage and contract records, and grievance systems.</li></ul>`, "Documents required", "file-text"),
      sec("process", `<ol><li><strong>Scope:</strong> we agree on the purpose, the sites and the standard to follow.</li><li><strong>Document review:</strong> permits, sourcing papers, policies and records are reviewed.</li><li><strong>Site visit and interviews:</strong> where the scope allows, we visit the site and speak to management and workers.</li><li><strong>Assessment:</strong> we compare practices with the law and the lender's standard and rate the risks.</li><li><strong>Report:</strong> you receive findings and a corrective action plan with priorities.</li></ol>`, "Review procedure", "list-ordered"),
      sec("features", `<table><thead><tr><th>Area</th><th>What is looked at</th></tr></thead><tbody><tr><td>Raw material sourcing</td><td>Legal origin of wood, certification, avoidance of illegal logging and protected species</td></tr><tr><td>Chemicals and emissions</td><td>Formaldehyde and VOCs from boards, adhesives and finishes; storage and ventilation</td></tr><tr><td>Waste and dust</td><td>Wood dust control, offcuts, solvent and paint waste, and disposal routes</td></tr><tr><td>Energy and water</td><td>Use of power and fuel, boilers and dryers, water use in processes</td></tr><tr><td>Worker health and safety</td><td>Machine guarding, dust and chemical exposure, fire safety, protective equipment, training</td></tr><tr><td>Labour practices</td><td>Wages, working hours, contracts, child and forced labour risks, grievance systems</td></tr><tr><td>Community and permits</td><td>Noise, odour, transport impact, and status of consents and licences</td></tr></tbody></table><p>Findings depend on the information and access provided for the review.</p>`, "Areas reviewed", "table"),
      sec("why-us", `<ul><li><strong>Sector-aware:</strong> the review focuses on the real risks of wood and furniture manufacturing.</li><li><strong>Clear report:</strong> issues are rated by risk and explained in plain words.</li><li><strong>Practical actions:</strong> a plan the business can carry out in stages.</li><li><strong>Lender-ready:</strong> structure and language that lenders and buyers are used to reading.</li></ul>`, "How Aeon helps", "shield-check"),
    ],
    faqs: [
      { q: "What is ESDD?", a: "Environmental and Social Due Diligence is a review of a business's environmental and social risks and how it manages them, usually before funding or a deal." },
      { q: "Who asks for an ESDD?", a: "Banks, development lenders, investors and large buyers often ask for it, especially for manufacturing businesses." },
      { q: "Is the ESDD a legal certificate?", a: "No. It is an assessment report. It does not replace legal consents or licences, but it shows how well the business meets them." },
      { q: "Does the business have to fix everything?", a: "The report ranks the issues by risk, and agrees a plan with the business. Lenders usually expect high-risk items to be fixed first." },
    ],
    seoTitle: "ESDD in the Furniture and Fixtures Industry",
    seoDescription: "Environmental and Social Due Diligence for furniture and fixtures businesses: what is reviewed, documents and the process.",
    isPublished: true,
  },
]
