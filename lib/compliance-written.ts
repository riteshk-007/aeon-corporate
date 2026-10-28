import type { ServiceInput } from "@/lib/services"

type Page = Omit<ServiceInput, "heroImageUrl" | "icon"> & { slug: string; icon?: string; autoContent?: boolean }
const sec = (key: ServiceInput["sections"][number]["key"], html: string, title?: string, icon?: string) => ({
  key,
  html,
  ...(title ? { title } : {}),
  ...(icon ? { icon } : {}),
})

/**
 * Hand-written Compliance pages: general information (no fees, no promised
 * timelines). Dates and thresholds change, so each should be checked by a
 * qualified professional and then edited in the admin panel.
 */
export const COMPLIANCE_WRITTEN: Page[] = [
  {
    slug: "annual-compliance-of-a-pvt-ltd-company",
    title: "Annual Compliance of a Pvt. Ltd. Company",
    category: "Secretarial",
    icon: "scroll",
    summary: "Every private limited company must meet a set of yearly requirements under the Companies Act, 2013, even if it had no business. Here is what they are and how we help you stay on track.",
    highlights: ["Yearly compliance calendar for your company", "Financial statements and annual return filed with the ROC", "Board and general meeting support", "Director KYC and auditor filings"],
    sections: [
      sec("overview", `<p>A private limited company is a separate legal entity, and the law expects it to keep its records with the <strong>Registrar of Companies (ROC)</strong> up to date every year. This is called <strong>annual compliance</strong>.</p><p>It includes holding meetings, finalising and filing the accounts, filing the annual return, and meeting a few tax and director-related requirements. The duty applies <strong>even when the company has had no business or income</strong> during the year.</p>`),
      sec("advantages", `<ul><li><strong>Avoid late fees and penalties</strong> that grow with every day of delay.</li><li><strong>Protect directors:</strong> directors can be disqualified if a company does not file its financial statements or annual returns for three consecutive financial years.</li><li><strong>Keep the company in good standing</strong> for banks, investors, buyers and tenders.</li><li><strong>Clean records</strong> make audits, funding and exit much smoother.</li></ul>`, "Why it matters", "thumbs-up"),
      sec("eligibility", `<ul><li>Applies to <strong>every private limited company</strong> registered in India, including companies with no turnover and companies that are not yet in operation.</li><li>A few relaxations are available for small companies, One Person Companies and eligible startups; we check which apply to you.</li><li>The company's directors are responsible for making sure the filings are made.</li></ul>`, "Applicability", "clipboard-check"),
      sec("documents", `<ul><li>Books of accounts, bank statements and the trial balance for the financial year.</li><li>Draft financial statements: balance sheet, profit and loss account, notes and cash flow, where applicable.</li><li>Auditor's details and appointment papers, and the audit report.</li><li>Minutes of board meetings and the general meeting, and the notice and attendance records.</li><li>Directors' details, DSC and KYC information; shareholding details of the members.</li></ul>`, "Documents required"),
      sec("process", `<ol><li><strong>Plan the calendar:</strong> we list all the yearly requirements and their due dates for your company.</li><li><strong>Close the books:</strong> accounts are finalised and the auditor is appointed or reappointed.</li><li><strong>Hold the meetings:</strong> board meetings are held as required, and the annual general meeting (AGM) is held with notice and minutes.</li><li><strong>File the forms:</strong> the financial statements (Form AOC-4) and the annual return (Form MGT-7) are filed with the ROC, along with the auditor appointment form (Form ADT-1) where it applies.</li><li><strong>File the tax return:</strong> the income tax return and tax audit report, if applicable, are filed.</li><li><strong>Keep the records:</strong> statutory registers are updated and filing receipts are kept.</li></ol>`, "Filing procedure", "list-ordered"),
      sec("features", `<table><thead><tr><th>Requirement</th><th>Usual time limit</th></tr></thead><tbody><tr><td>Board meetings</td><td>At least four a year, with the gap rules in the Act (some relaxations for small companies, OPCs and startups)</td></tr><tr><td>Annual General Meeting (AGM)</td><td>Within six months of the end of the financial year (the first AGM within nine months of the end of the first year)</td></tr><tr><td>Financial statements (Form AOC-4)</td><td>Within 30 days of the AGM</td></tr><tr><td>Annual return (Form MGT-7)</td><td>Within 60 days of the AGM</td></tr><tr><td>Auditor appointment (Form ADT-1)</td><td>Within 15 days of the appointment</td></tr><tr><td>Director KYC (Form DIR-3 KYC)</td><td>Every year, by 30 September</td></tr><tr><td>Return of deposits (Form DPT-3)</td><td>Every year, by 30 June</td></tr><tr><td>Income tax return</td><td>Due date set each year by the Income Tax Department; commonly 31 October for companies that need an audit</td></tr></tbody></table><p>Late filing attracts additional fees, and continued default can attract penalties on the company and its officers. Due dates can be extended or changed by the authorities, so we confirm them each year.</p>`, "Due dates, forms & penalties", "clock"),
      sec("why-us", `<ul><li><strong>Calendar and reminders:</strong> we tell you about every due date well before it arrives.</li><li><strong>One team for ROC and tax:</strong> company filings and the tax return are planned together.</li><li><strong>Catch-up filing:</strong> if some years were missed, we help you plan the filings and the cost of late fees.</li><li><strong>Plain-language guidance</strong> for founders who are not from an accounts background.</li></ul>`, "How Aeon helps", "shield-check"),
    ],
    faqs: [
      { q: "Do I need to file if my company had no business?", a: "Yes. A company has to file its financial statements and annual return every year even if it had no business, no income or no bank activity." },
      { q: "What happens if I miss the due date?", a: "Additional fees apply for each filing, and continued default can lead to penalties on the company and its directors, and to disqualification of directors after three consecutive years of default." },
      { q: "Is an audit compulsory for a private limited company?", a: "In general, yes: a company has to appoint an auditor and have its accounts audited each year. Some small companies and OPCs have relaxations in other areas, so we check your case." },
      { q: "Can missed years be filed now?", a: "Yes. Past years can be filed with late fees. We help you plan the order of filings and the cost." },
    ],
    seoTitle: "Annual Compliance of a Private Limited Company",
    seoDescription: "Yearly compliance of a private limited company in India: meetings, AOC-4, MGT-7, director KYC, due dates and penalties.",
    isPublished: true,
  },
  {
    slug: "winding-up-of-private-limited-company",
    title: "Winding Up of Private Limited Company",
    category: "Secretarial",
    icon: "scroll",
    summary: "Winding up is the legal process of closing a company and ending its existence. Know the reasons, the routes available, the documents and the steps.",
    highlights: ["Choice of the right closing route for your company", "Resolutions, declarations and notices", "Coordination with the liquidator and the authorities", "Filings until the company is dissolved"],
    sections: [
      sec("overview", `<p>Winding up (also called <strong>liquidation</strong>) is the process of legally closing a company. Its assets are sold, its debts are paid and whatever remains is shared among the members. After the process, the company is <strong>dissolved</strong> and ceases to exist.</p><p>A company can be closed in different ways, depending on whether it can pay its debts, whether it is still carrying on business, and who starts the process. Closing a company only by stopping business, or by leaving it without filings, does not end its legal duties.</p>`),
      sec("advantages", `<ul><li><strong>Ends legal duties:</strong> annual filings and tax compliance stop once the company is dissolved.</li><li><strong>Clears liabilities in an orderly way:</strong> creditors are paid in the order set by the law.</li><li><strong>Protects directors</strong> from the risk of disqualification and penalties that come from an inactive but unclosed company.</li><li><strong>Lets members receive what is left</strong> after debts are paid.</li><li><strong>Brings clarity</strong> for the people who deal with the company.</li></ul>`, "Why it matters", "thumbs-up"),
      sec("eligibility", `<p>Reasons why companies are closed include:</p><ul><li>The business has been completed or is no longer profitable.</li><li>The members or directors do not want to continue.</li><li>The company cannot pay its debts.</li><li>The company is inactive and not carrying on business.</li><li>The Tribunal orders winding up on one of the grounds in the Companies Act (for example, fraud, or default in filing financial statements or annual returns for a long period).</li></ul><p>Which route is open to you depends on these facts, so we check your case before choosing.</p>`, "When and why a company is closed", "clipboard-check"),
      sec("documents", `<ul><li>Certificate of incorporation, Memorandum and Articles of Association.</li><li>Latest audited financial statements, statement of affairs and the list of assets and liabilities.</li><li>Board and shareholder resolutions approving the closing, and a declaration of solvency where the route requires one.</li><li>Details of creditors and debtors, and no-dues or clearance from lenders where applicable.</li><li>Tax records, GST and other registrations, and bank account details.</li><li>Identity and DSC details of the directors, members and the liquidator.</li></ul>`, "Documents required", "file-text"),
      sec("process", `<ol><li><strong>Choose the route:</strong> voluntary liquidation of a solvent company, striking off the name from the register, or winding up by the Tribunal.</li><li><strong>Clear the position:</strong> accounts are finalised, tax and statutory dues are cleared or provided for.</li><li><strong>Approvals:</strong> the board and the members pass the resolutions, and a declaration of solvency is made where the route needs one.</li><li><strong>Appoint a liquidator:</strong> a qualified professional is appointed where the route requires one, and creditors and the authorities are informed.</li><li><strong>Realise and pay:</strong> assets are sold, debts are paid in the order set by the law and the balance is distributed.</li><li><strong>File and dissolve:</strong> the final report and forms are filed, and the authority records the dissolution of the company.</li></ol>`, "Procedure", "list-ordered"),
      sec("features", `<ul><li>Each route has its own time limits and forms, set by the Companies Act, 2013, the Insolvency and Bankruptcy Code, 2016 and the rules made under them.</li><li>A company that is struck off or dissolved cannot trade, and its bank accounts and registrations should be closed.</li><li>Liabilities of directors for acts done before the closing can continue as the law provides.</li><li>Tax clearance and closure of GST, PF, ESI and other registrations should be completed separately.</li></ul>`, "Time limits & points to note", "clock"),
      sec("types", `<table><thead><tr><th>Route</th><th>Who starts it</th><th>Suitable when</th></tr></thead><tbody><tr><td>Voluntary liquidation</td><td>The members and directors</td><td>The company can pay its debts and wants to close in an orderly way</td></tr><tr><td>Striking off the name</td><td>The company, or the Registrar</td><td>The company is not carrying on business and has little or no liability</td></tr><tr><td>Winding up by the Tribunal</td><td>The company, a creditor or another person with standing</td><td>The company cannot pay its debts, or another ground in the Act applies</td></tr></tbody></table>`),
      sec("why-us", `<ul><li><strong>Right route first:</strong> we explain the options and the cost in plain terms before you decide.</li><li><strong>Complete paperwork:</strong> resolutions, declarations, notices and forms are prepared and checked.</li><li><strong>Coordination:</strong> we work with your accountant, the liquidator and the authorities.</li><li><strong>Closure checklist:</strong> bank, tax and other registrations are closed so no loose ends remain.</li></ul>`, "How Aeon helps", "shield-check"),
    ],
    faqs: [
      { q: "Is stopping business the same as closing the company?", a: "No. Until the company is formally closed, it must keep filing returns and meeting its legal duties, even if it is inactive." },
      { q: "Can a company with debts be wound up?", a: "Yes, but the route differs. A company that cannot pay its debts may have to be wound up through the insolvency process or by the Tribunal rather than by a simple voluntary liquidation." },
      { q: "What happens to the assets?", a: "They are sold or distributed after the debts are paid, and the balance goes to the members as per their rights." },
      { q: "Can a struck-off company be revived?", a: "In some cases yes, by applying to the Tribunal within the time allowed by the law." },
    ],
    seoTitle: "Winding Up of a Private Limited Company",
    seoDescription: "How to wind up a private limited company in India: reasons, routes, documents and the step-by-step procedure.",
    isPublished: true,
  },
  {
    slug: "service-level-agreement",
    title: "Service Level Agreement",
    category: "Contracts & Agreements",
    icon: "file-pen",
    summary: "A Service Level Agreement (SLA) sets out the services a provider will deliver, the standards to be met and what happens if they are not.",
    highlights: ["Clear scope and measurable service levels", "Drafting based on your deal", "Review of the other side's draft", "Stamping and execution guidance"],
    sections: [
      sec("overview", `<p>A <strong>Service Level Agreement (SLA)</strong> is a contract between a service provider and a customer. It states the services to be delivered, the standard or level of service expected, how performance will be measured, and the remedies if the standard is not met.</p><p>It turns the vague promise of "good service" into clear, measurable terms that both sides can check and enforce.</p>`),
      sec("advantages", `<ul><li><strong>Clear expectations</strong> on both sides, so there are fewer disputes.</li><li><strong>Measurable standards</strong> such as response time, resolution time and availability.</li><li><strong>Defined remedies</strong> such as service credits, penalties or the right to terminate.</li><li><strong>Better relationship:</strong> regular reviews keep the service on track.</li></ul>`, "Why it matters", "thumbs-up"),
      sec("eligibility", `<ul><li>Any business or person that provides or receives a service on a continuing basis: IT and support, outsourcing, maintenance, logistics, cloud and software, professional services.</li><li>Both parties must be able to contract and agree freely.</li><li>An SLA can be a stand-alone contract or part of a larger master services agreement.</li></ul>`, "Who needs it", "clipboard-check"),
      sec("documents", `<ul><li>Identity and address proof of both parties; company papers for entities and an authorisation of the signatory.</li><li>The main contract or proposal, if the SLA forms part of it.</li><li>Details of the services, the service levels expected and how they will be measured.</li><li>Price, payment terms, term of the contract and notice period.</li><li>Any security, data protection or confidentiality requirements.</li></ul>`, "Documents required", "file-text"),
      sec("process", `<ol><li><strong>Understand the deal:</strong> services, standards, price and the risks you want covered.</li><li><strong>Draft:</strong> a first draft is prepared in plain language.</li><li><strong>Negotiate:</strong> changes are made after comments from both sides.</li><li><strong>Stamp and sign:</strong> the final document is stamped as required by the state and signed.</li><li><strong>Manage:</strong> a schedule of reviews and reports is agreed so the SLA actually gets used.</li></ol>`, "Procedure", "list-ordered"),
      sec("features", `<p>A good SLA usually covers the following:</p><ul><li>Description of the services and what is excluded.</li><li>Service levels and how they are measured, for example uptime or response time.</li><li>Reporting and review meetings.</li><li>Payment terms and, if the levels are missed, service credits or penalties.</li><li>Roles of both parties and the escalation path.</li><li>Confidentiality, data protection, liability and insurance.</li><li>Term, renewal, termination and exit support.</li><li>Dispute resolution and governing law.</li></ul>`, "What an SLA should contain", "sparkles"),
      sec("types", `<table><thead><tr><th>Type</th><th>Meaning</th></tr></thead><tbody><tr><td>Customer-based SLA</td><td>One agreement with one customer covering all the services they receive</td></tr><tr><td>Service-based SLA</td><td>One agreement for one service, which applies to all customers who use it</td></tr><tr><td>Multi-level SLA</td><td>Layered agreements: corporate level, customer level and service level</td></tr></tbody></table>`),
      sec("why-us", `<ul><li><strong>Plain-language drafting</strong> that both sides can follow.</li><li><strong>Measurable terms:</strong> we help you choose service levels that can be checked.</li><li><strong>Balanced risk:</strong> the remedies are realistic and enforceable.</li><li><strong>Stamping guidance</strong> for the state where you sign.</li></ul>`, "How Aeon helps", "shield-check"),
    ],
    faqs: [
      { q: "What is the purpose of an SLA?", a: "It records what service will be provided, the standard that applies, how it will be measured and what happens if the standard is not met." },
      { q: "What should an SLA include?", a: "The scope of services, service levels, reporting, payment terms, remedies, confidentiality, term and termination, and how disputes are resolved." },
      { q: "Does an SLA have to be stamped?", a: "Stamp duty depends on the state and the type and value of the document. We guide you on what applies to yours." },
    ],
    seoTitle: "Service Level Agreement (SLA) Drafting",
    seoDescription: "What a Service Level Agreement is, what it should contain and how it is drafted, reviewed and signed.",
    isPublished: true,
  },
  {
    slug: "due-diligence",
    title: "Due Diligence",
    category: "Accounting & CFO",
    icon: "calculator",
    summary: "Due diligence is a careful review of a business, deal or asset before you invest, buy or merge, so that you know the facts and risks.",
    highlights: ["Scope agreed with you before we start", "Financial, legal and tax review", "Clear findings and risk rating", "Written report with next steps"],
    sections: [
      sec("overview", `<p><strong>Due diligence</strong> is an investigation or review done before a deal, such as buying a company, investing, merging or lending. It checks that what the other side says is true, and that you understand the risks and the value of what you are getting.</p><p>The result is a report that helps you decide whether to go ahead, at what price, and on what conditions.</p>`),
      sec("advantages", `<ul><li><strong>Fewer surprises:</strong> hidden debts, disputes and compliance gaps come to light before you commit.</li><li><strong>Better price and terms:</strong> findings help you negotiate or add protections to the agreement.</li><li><strong>Confidence for investors and lenders.</strong></li><li><strong>A plan for the first months</strong> after the deal, based on what was found.</li></ul>`, "Why it matters", "thumbs-up"),
      sec("eligibility", `<ul><li>Investors, buyers, lenders and acquirers who want to check a target before a deal.</li><li>Sellers who want to prepare their business for investors (sell-side due diligence).</li><li>Mergers, acquisitions, joint ventures, fundraising, and large contracts.</li></ul>`, "When it is needed", "clipboard-check"),
      sec("documents", `<ul><li>Incorporation papers, constitutional documents and statutory registers.</li><li>Financial statements, tax returns, GST returns and audit reports for the past years.</li><li>Material contracts, loan and security documents, and lease and property papers.</li><li>Licences, approvals and registrations; intellectual property records.</li><li>Employee details, policies, and any pending or past litigation and notices.</li></ul>`, "Documents requested", "file-text"),
      sec("process", `<ol><li><strong>Scope:</strong> we agree on the areas to review, the period and the depth.</li><li><strong>Request list:</strong> a list of documents and questions is sent to the other side.</li><li><strong>Review:</strong> the documents and answers are examined by area.</li><li><strong>Findings:</strong> issues are rated by risk and discussed with you.</li><li><strong>Report:</strong> you receive a written report with findings and suggested protections or next steps.</li></ol>`, "Procedure", "list-ordered"),
      sec("features", `<ul><li>The review depends on the information that the other side provides, so gaps in the records should be noted in the report.</li><li>Confidentiality of the information is protected through a non-disclosure agreement.</li><li>Findings should be updated close to completion of the deal.</li><li>Reports are for the party that engaged us and the stated purpose.</li></ul>`, "Points to note", "clock"),
      sec("types", `<table><thead><tr><th>Type</th><th>What is checked</th></tr></thead><tbody><tr><td>Financial</td><td>Accounts, revenue, margins, cash flow, debts and quality of earnings</td></tr><tr><td>Legal</td><td>Ownership, contracts, litigation, licences and compliance</td></tr><tr><td>Tax</td><td>Tax filings, notices, exposure and structure</td></tr><tr><td>Commercial</td><td>Market, customers, competition and plans</td></tr><tr><td>Operational</td><td>Processes, suppliers, assets and systems</td></tr><tr><td>HR</td><td>Employees, contracts, benefits and labour law compliance</td></tr><tr><td>IT and data</td><td>Systems, security and data protection</td></tr></tbody></table>`),
      sec("why-us", `<ul><li><strong>Focused scope:</strong> we review what matters for your deal, not everything.</li><li><strong>Clear report:</strong> findings are explained in plain words with a risk rating.</li><li><strong>Practical advice:</strong> suggestions for price, conditions and protections in the agreement.</li></ul>`, "How Aeon helps", "shield-check"),
    ],
    faqs: [
      { q: "When should due diligence be done?", a: "Before you sign binding agreements or pay the main amount, so that the findings can still affect the price and the terms." },
      { q: "What is the difference between due diligence and an audit?", a: "An audit checks the accuracy of financial statements for a past period. Due diligence is wider: it also looks at legal, tax, commercial and other risks, for a specific deal." },
      { q: "Can the seller do it too?", a: "Yes. Sell-side due diligence prepares the business for investors by finding and fixing problems in advance." },
    ],
    seoTitle: "Due Diligence Services in India",
    seoDescription: "What due diligence is, the types, the documents and the process, for investments, acquisitions and funding.",
    isPublished: true,
  },
]
