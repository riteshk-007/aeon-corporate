import type { ServiceInput } from "@/lib/services"

type Content = Pick<ServiceInput, "summary" | "highlights" | "sections" | "faqs" | "seoTitle" | "seoDescription">
type Key = ServiceInput["sections"][number]["key"]

const li = (items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`
const ol = (items: string[]) => `<ol>${items.map((i) => `<li>${i}</li>`).join("")}</ol>`
const sec = (key: Key, html: string, title?: string, icon?: string) => ({ key, html, ...(title ? { title } : {}), ...(icon ? { icon } : {}) })

type Profile = {
  authority: string
  law: string
  what: string
  matters: string[]
  applies: string[]
  docs: string[]
  steps: string[]
  rules: string[]
}

const PROFILES: Record<string, Profile> = {
  Secretarial: {
    authority: "the Registrar of Companies (Ministry of Corporate Affairs)",
    law: "the Companies Act, 2013 (or the LLP Act, 2008 for an LLP) and the rules made under it",
    what: "This is a company-law (secretarial) requirement. It keeps the records your company or LLP holds with the Registrar of Companies correct, complete and up to date.",
    matters: [
      "Keeps your public record with the Registrar accurate, which banks, investors and buyers check.",
      "Avoids late fees, additional fees and penalties for delay or default.",
      "Protects directors and partners from personal consequences of non-compliance.",
      "Keeps the company or LLP in good standing, so that it can raise funds, bid and transact.",
    ],
    applies: [
      "Companies and LLPs registered in India, depending on the type of entity and the event or period involved.",
      "Many event-based filings have to be made within a fixed number of days of the event; we confirm the time limit for your case.",
      "Directors, partners and authorised signatories need a valid Digital Signature Certificate (DSC).",
    ],
    docs: [
      "Company or LLP details: CIN or LLPIN, PAN and registered office address.",
      "Board or shareholder resolutions, minutes and notices relating to the event.",
      "Identity, address proof and DSC details of the directors or partners involved.",
      "The earlier filings, charters and registers that the change relates to.",
      "Any consent or declaration forms that the law requires for the event.",
    ],
    steps: [
      "<strong>Review:</strong> we check which form and which time limit apply to your case.",
      "<strong>Approvals:</strong> board or shareholder resolutions and notices are drafted, and meetings held where needed.",
      "<strong>Preparation:</strong> the form and attachments are prepared and checked.",
      "<strong>Filing:</strong> the form is signed with DSC and filed on the MCA portal with the fee.",
      "<strong>Confirmation:</strong> we track the approval, share the challan and acknowledgement, and update your registers.",
    ],
    rules: [
      "Every form has a due date, often counted from the event or from the annual general meeting.",
      "Late filing attracts additional fees, and continued default can attract penalties on the company and its officers.",
      "Keep minutes, statutory registers and filing receipts safely; they are checked in audits and due diligence.",
      "Rules, forms and fees are amended from time to time, so we confirm the current position before filing.",
    ],
  },
  "Tax Filing/Compliance": {
    authority: "the Income Tax Department, the GST authorities or the state tax department, depending on the filing",
    law: "the Income-tax Act, the GST laws or the relevant state law",
    what: "This is a tax filing or registration that a person or business has to complete with the tax authorities, with correct figures and on time.",
    matters: [
      "Avoids late fees, interest and penalties.",
      "Keeps your tax record clean for bank loans, tenders and visas.",
      "Helps you claim the credits and deductions you are entitled to.",
      "Reduces the chance of notices and mismatch queries later.",
    ],
    applies: [
      "Businesses, professionals and individuals who fall under the tax or registration involved.",
      "Thresholds, rates and forms depend on the type of taxpayer, turnover and state, and are published by the authorities.",
      "A valid PAN and, where relevant, GSTIN or TAN is needed.",
    ],
    docs: [
      "PAN, and GSTIN or TAN where applicable; login access to the relevant portal.",
      "Sales and purchase invoices, expense details and bank statements for the period.",
      "Earlier returns, challans and tax certificates (for example TDS certificates).",
      "Business registration papers and the address proof of the place of business.",
    ],
    steps: [
      "<strong>Data collection:</strong> we collect invoices, statements and earlier returns for the period.",
      "<strong>Reconciliation:</strong> figures are matched with your books and with what the portal shows.",
      "<strong>Preparation:</strong> the return or application is prepared, and you review it.",
      "<strong>Filing:</strong> it is filed on the official portal and the acknowledgement is shared.",
      "<strong>Follow-up:</strong> we track refunds or notices and guide you on the next step.",
    ],
    rules: [
      "Due dates are set by the authorities and are sometimes extended; we remind you before each one.",
      "Late filing can attract late fees and interest, and some mistakes can lead to penalties.",
      "Keep invoices and records for the period the law requires.",
      "Rates, limits and forms change often, so we confirm the current rules at the time of filing.",
    ],
  },
  "Accounting & CFO": {
    authority: "your own board and, for audits, the standards of the profession and the law that requires the audit",
    law: "the accounting standards, audit rules and agreements that apply to the engagement",
    what: "This is a finance, accounting or audit service that gives you reliable numbers and clear reporting, so that you and your investors can make decisions with confidence.",
    matters: [
      "Gives you accurate books and timely reports.",
      "Makes tax filings, audits and fundraising easier.",
      "Highlights cash flow problems and risks early.",
      "Builds confidence with lenders, investors and buyers.",
    ],
    applies: [
      "Startups, growing companies and established businesses that need finance support or an audit.",
      "Some audits are required by law for businesses above certain limits; others are taken voluntarily or because a bank or investor asks for them.",
      "The scope is agreed at the start so that both sides know what will be delivered.",
    ],
    docs: [
      "Books of accounts, ledgers and trial balance.",
      "Bank statements, invoices, expense proofs and payroll details.",
      "Earlier financial statements, tax returns and audit reports.",
      "Key contracts, loan papers and any specific information the engagement needs.",
    ],
    steps: [
      "<strong>Scope:</strong> we agree on the work, the period and the output you need.",
      "<strong>Information:</strong> we collect the records and access we need.",
      "<strong>Work:</strong> the books are written up, reviewed or audited as agreed.",
      "<strong>Review:</strong> findings are discussed with you before they are final.",
      "<strong>Report:</strong> you receive the report or reports and suggestions for next steps.",
    ],
    rules: [
      "Statutory audits and filings have their own due dates; other work is planned with you.",
      "Information you share is kept confidential.",
      "Findings depend on the records provided, so complete and timely records matter.",
      "Where the law requires a chartered accountant to sign a report, it is signed by a qualified professional.",
    ],
  },
  "Contracts & Agreements": {
    authority: "the state stamp and registration offices, where stamping or registration is required",
    law: "the Indian Contract Act, 1872, the Registration Act, 1908, the stamp law of the state and other laws that apply to the document",
    what: "This is a legal document that sets out the rights and duties of the people involved, so that the deal is clear and can be enforced.",
    matters: [
      "Puts the terms in writing and reduces the chance of disputes.",
      "Gives you a document that a court or authority can rely on.",
      "Covers risks such as delay, non-payment or exit.",
      "Helps you meet the stamp duty and registration rules.",
    ],
    applies: [
      "Individuals and businesses entering into the arrangement described by the document.",
      "Whether the document needs stamp duty or registration, and how much, depends on its type, value and the state.",
      "All parties must be competent to contract and must agree freely.",
    ],
    docs: [
      "Identity and address proof of every party; company or LLP papers for entities.",
      "Details of the deal: property, shares, rent, price, period, payment terms.",
      "Ownership or title papers where property or shares are involved.",
      "Earlier agreements, board resolutions or approvals, where relevant.",
    ],
    steps: [
      "<strong>Requirements:</strong> we understand the deal and the points that matter to you.",
      "<strong>Drafting:</strong> a first draft is prepared in clear language.",
      "<strong>Changes:</strong> you and the other side comment, and the draft is revised.",
      "<strong>Stamping and signing:</strong> the final document is stamped as required and signed.",
      "<strong>Registration, if needed:</strong> where the law requires registration, it is done before the registrar.",
    ],
    rules: [
      "Stamp duty and registration charges are fixed by the state and can differ for each type of document.",
      "A document that is not properly stamped, or not registered where required, may not be accepted as evidence.",
      "A lease for more than eleven months is commonly registered, depending on the state.",
      "Keep original signed copies in a safe place.",
    ],
  },
  "Legal Services": {
    authority: "the court, tribunal or authority that handles the matter",
    law: "the law that applies to the matter, for example the Negotiable Instruments Act, the Consumer Protection Act, the RERA, or the Indian Succession Act",
    what: "This is a legal service that helps you take, answer or settle a legal step in a clear and orderly way, from a notice to a petition or a certificate.",
    matters: [
      "Puts your claim or reply in the correct legal form.",
      "Often settles a dispute without a long court case.",
      "Preserves your rights and keeps you within the time limits.",
      "Gives you a clear record of what was sent, said and decided.",
    ],
    applies: [
      "Anyone who has a legal right to claim, or who has received a notice and needs to reply.",
      "Time limits matter in legal matters; the time left depends on the date of the event or notice.",
      "Court appearances need a practising advocate; we coordinate with one if your matter needs it.",
    ],
    docs: [
      "Identity and address proof of the person taking the step.",
      "Agreements, invoices, cheques, bank memos, letters, messages or emails connected with the matter.",
      "Any notice or order already received, and proof of how it was delivered.",
      "A clear summary of the facts, with dates.",
    ],
    steps: [
      "<strong>Facts:</strong> we listen to what happened and collect the papers.",
      "<strong>Assessment:</strong> we tell you the options, the time limits and the likely next steps.",
      "<strong>Drafting:</strong> the notice, reply, petition or document is prepared for your approval.",
      "<strong>Sending or filing:</strong> it is sent or filed in the required manner and proof is kept.",
      "<strong>Next steps:</strong> we guide you on settlement or further proceedings.",
    ],
    rules: [
      "Many legal steps have strict time limits counted from the event or from a notice.",
      "The outcome depends on the facts, the proof and the decision of the authority or court; no result can be promised.",
      "Keep original documents and all communication safe.",
      "This is general guidance and not a substitute for an advocate's advice on your own facts.",
    ],
  },
  "Convert Your Business": {
    authority: "the Registrar of Companies and the other authorities where the business is registered",
    law: "the Companies Act, 2013, the LLP Act, 2008, the Partnership Act, 1932 and the rules under them",
    what: "This is a change of the legal form of your business, for example from a proprietorship or partnership to a company, so that it can grow with limited liability and a clearer structure.",
    matters: [
      "Moves the business into a structure that suits its size and plans.",
      "Can give limited liability and make it easier to raise funds.",
      "Keeps the business history, licences and contracts moving to the new form.",
      "Can improve credibility with customers, banks and investors.",
    ],
    applies: [
      "Owners of proprietorships, partnerships, LLPs, OPCs and companies that want to change form.",
      "The conditions depend on the form you start from and the one you move to, such as number of members, capital and approvals.",
      "Tax, contracts, licences and employees need to be looked at before converting.",
    ],
    docs: [
      "Registration papers of the existing business: partnership deed, LLP or company documents, GST and PAN.",
      "Latest financial statements and details of assets and liabilities.",
      "Identity, address proof and DSC of the proposed directors or members.",
      "Resolutions, consents and no-objection letters from members, creditors or lenders where required.",
    ],
    steps: [
      "<strong>Planning:</strong> we compare the options and check tax and contract effects.",
      "<strong>Approvals:</strong> the resolutions, consents and agreements needed are drafted and signed.",
      "<strong>Filing:</strong> the conversion forms and documents are filed with the Registrar.",
      "<strong>Certificate:</strong> on approval, the new certificate of incorporation or registration is issued.",
      "<strong>After conversion:</strong> PAN, GST, bank accounts, licences and contracts are updated to the new form.",
    ],
    rules: [
      "Conversion is not complete until the registrations and licences are updated.",
      "Filings have time limits after the approvals are passed.",
      "Annual compliance of the new form begins from the date of conversion.",
      "Conditions are set by law and may change, so we confirm them before you start.",
    ],
  },
}

/** One-line meaning for pages where the group text is too general. */
const WHAT: Record<string, string> = {
  "Winding Up of Private Limited Company": "Winding up is the legal process of closing a company: its assets are sold, its debts paid, and what is left is shared among the members, after which the company ceases to exist.",
  "Closing a Limited Liability Partnership": "Closing an LLP means either striking off its name from the register when it is not carrying on business, or winding it up under the LLP law, so that it ends lawfully.",
  "Annual Compliance of a Pvt. Ltd. Company": "Every private limited company has to file its financial statements and annual return with the Registrar every year and meet other yearly requirements, even if it had no business.",
  "Annual Filing for LLP": "Every LLP has to file an annual return (Form 11) and a statement of account and solvency (Form 8) each year, even if it had no activity.",
  "Event Based Compliances in a Company": "Apart from yearly filings, a company has to file forms when certain events happen, such as a change in directors, capital, address or charges.",
  "Change in Object Clause": "The object clause of the Memorandum states what the company may do. Changing it needs a special resolution and filings with the Registrar.",
  "Appointment and Resignation of Directors": "When a director is appointed or resigns, the company and the director have to file forms with the Registrar and update the company's records.",
  "Change in Name Clause": "A company that wants to change its name needs name approval, a special resolution, and filings with the Registrar, followed by updates to PAN, bank and other records.",
  "Removal of Director": "A director can be removed by the members as provided in the Companies Act, following the notice, hearing and filing steps.",
  "Nidhi Company Compliance": "Nidhi companies, which take deposits from and lend to their members, have specific rules and filings in addition to ordinary company compliance.",
  "Section 8 Company Compliance": "A Section 8 company is a non-profit company. It has to file the usual yearly returns and also follow the conditions of its licence.",
  "NBFC Compliance": "Non-banking financial companies have to follow the Reserve Bank of India's rules along with company law, including regular returns and reports.",
  "Change in Registered Office": "A company can move its registered office within the same city, to another city in the same state, or to another state. Each has its own approvals and filings.",
  "Change in Share Capital": "A company that wants to increase its authorised capital or issue more shares has to pass resolutions, alter its Memorandum and file the forms with the Registrar.",
  "Revival of Struck Off Companies": "If a company's name has been struck off the register, it can be revived by applying to the Tribunal within the time allowed by the law.",
  "MCA Compliance": "MCA compliance covers all the filings a company or LLP has to make with the Ministry of Corporate Affairs, on the yearly calendar and when events happen.",
  "Change in Directors": "A change in directors, whether by appointment, resignation or removal, must be reported to the Registrar and recorded in the company's registers.",
  "Change in LLP Agreement": "An LLP's agreement can be changed by the partners. The changed terms have to be filed with the Registrar within the time allowed.",
  "Liquidation of Company": "Liquidation is the process of closing a company by selling assets, paying creditors and distributing what remains, under the Insolvency and Bankruptcy Code or the Companies Act.",
  "AGR-Return Filing": "This is the filing of the AGR return with the Registrar. The exact form and period depend on the company's case, and we confirm them before we start.",
  "Form AOC-4": "Form AOC-4 is the form in which a company files its financial statements with the Registrar of Companies each year.",
  "Form MGT-7": "Form MGT-7 is the form in which a company files its annual return with the Registrar, giving details of members, directors and shareholding.",
  "SPICe+ Form": "SPICe+ is the integrated web form for incorporating a company, with name reservation and several registrations offered through one filing.",
  "AGILE PRO S": "AGILE PRO-S is the form linked to SPICe+ that allows a new company to apply for registrations such as GST, EPFO, ESIC and a bank account along with incorporation.",
  "Payment Gateway Compliance": "Companies that run payment gateways or aggregators have to follow the Reserve Bank of India's directions along with company law.",
  "Insurance Broker Compliance": "Insurance brokers have to follow the IRDAI regulations in addition to company law, including returns, reports and capital conditions.",
  "NBFC Account Aggregator Compliance": "Account aggregators are a class of non-banking financial companies regulated by the Reserve Bank of India, with specific returns and conduct rules.",
  "Insurance Web Aggregator Compliance": "Insurance web aggregators work under the IRDAI regulations, which set conditions for operation, reporting and conduct.",
  "GST Registration": "GST registration is the process of getting a GST number (GSTIN) so that a business can collect tax, claim input credit and file GST returns.",
  "GST Return Filing": "Registered businesses have to file periodic GST returns (such as GSTR-1 and GSTR-3B) showing sales, purchases and tax paid.",
  "TDS Return Filing": "Anyone who deducts tax at source has to deposit it and file quarterly TDS returns, and give the deductees their TDS certificates.",
  "Professional Tax Registration": "Professional tax is a state tax on employment and professions. Employers and professionals register under their state law and file returns.",
  "Income Tax Return Filing": "An income tax return reports your income and tax for the year to the Income Tax Department, and is needed even to claim a refund in many cases.",
  "GST Advisory Services": "GST advisory helps you understand how GST applies to your business, from rates and place of supply to input credit and compliance.",
  "GST Annual Return Filing": "Registered taxpayers above the prescribed limits file an annual GST return (GSTR-9), and some also a reconciliation statement.",
  "GST LUT Form": "A Letter of Undertaking (LUT) lets exporters supply goods or services without paying IGST at the time of export, subject to the conditions.",
  "GST Compliance Services": "GST compliance covers registration, returns, reconciliation of input credit and replies to notices, on a regular basis.",
  "Income Tax Compliance": "Income tax compliance covers advance tax, TDS, returns, audits and replies to notices that a person or business has to manage during the year.",
  "Income Tax Advisory": "Income tax advisory helps you plan and structure your affairs lawfully, understand deductions, and avoid costly mistakes.",
  "XBRL Filing": "Some companies have to file their financial statements with the Registrar in XBRL, a structured data format, along with the usual forms.",
  "GST Registration for NRI": "Non-resident taxable persons who supply goods or services in India may need a GST registration under the rules for non-residents.",
  "ITR for NRI": "Non-resident Indians have to file an income tax return in India if their Indian income is above the limit or in other cases the law requires.",
  "Due Diligence": "Due diligence is a careful review of a business, deal or asset, usually before an investment, purchase or merger, to check its facts and risks.",
  "Business Plan": "A business plan sets out what your business does, the market, the plan and the finances, and is used for planning, loans and fundraising.",
  "Virtual CFO Services": "A virtual CFO gives you senior finance guidance and reporting remotely, without the cost of a full-time chief financial officer.",
  "Fractional CFO Services": "A fractional CFO works with you for a part of the week or month to guide finance strategy, cash flow, reporting and fundraising.",
  "Tax Audit": "A tax audit is an audit of accounts by a chartered accountant required under the Income-tax Act when turnover or receipts cross the limits set by the law.",
  "Forensic Audit": "A forensic audit investigates financial records to find fraud, misuse or irregular transactions and to gather evidence.",
  "Bookkeeping Services": "Bookkeeping is the regular recording of your business transactions, so that your accounts are accurate and ready for tax and reporting.",
  "Fundraising Services": "Fundraising support helps you prepare the documents, valuation, investor material and legal steps needed to raise money.",
  "Term sheet": "A term sheet is a short, generally non-binding document that outlines the main terms of an investment before the detailed agreements are signed.",
  "MIS Reporting": "MIS reports give management regular, easy-to-read figures on sales, costs, profit and cash, to support decisions.",
  "Service Level Agreement": "A Service Level Agreement (SLA) is a contract between a service provider and a customer that sets out the services, the standards to be met and what happens if they are not.",
  "Share Purchase Agreement": "A share purchase agreement records the sale and purchase of shares of a company, including the price, conditions, warranties and the transfer.",
  "Franchise Agreement": "A franchise agreement allows one party to use another's brand and business system on agreed terms, such as fees, territory and standards.",
  "Sale Deed Registration": "A sale deed transfers ownership of immovable property from the seller to the buyer, and has to be stamped and registered to be effective in law.",
  "Gift Deed": "A gift deed transfers property or assets as a gift, without payment, from the giver to the receiver, and is stamped and registered where required.",
  "Residential Rental Agreement": "A residential rental agreement records the terms on which a home is let, such as rent, deposit, period and the rights and duties of both sides.",
  "Commercial Rental Agreement": "A commercial rental agreement records the terms on which a shop, office or other business premises is let.",
  "Relinquishment Deed": "A relinquishment deed is used when a co-owner or heir gives up their share in a property in favour of another co-owner or heir.",
  "Probate of Will": "Probate is a court's certificate that a will is genuine and that the executor has the authority to deal with the estate.",
  "Shareholder’s Agreement": "A shareholders' agreement sets out how the owners of a company will manage it, including voting, transfers, exit and dispute rules.",
  "Joint Venture Agreement": "A joint venture agreement records how two or more parties will work together on a project or business, including contributions, profits and control.",
  "Legal Notice": "A legal notice is a formal written communication that states a claim or grievance and asks the other side to act within a stated time before legal action is taken.",
  "RERA Complaint": "A RERA complaint is filed with the state Real Estate Regulatory Authority by a home buyer or other allottee against a promoter or agent for violations of the RERA.",
  "Cheque Bounce Notice": "When a cheque is returned unpaid, the payee can send a demand notice under Section 138 of the Negotiable Instruments Act within the time allowed after receiving the bank's return memo.",
  "Caveat Petition": "A caveat is filed in court to make sure that no order is passed against you in a matter without hearing you first.",
  "Legal Heir Certificate": "A legal heir certificate is an official paper that lists the legal heirs of a person who has died, used for claims and transfers.",
  "Succession Certificate in India": "A succession certificate is issued by a court to the heirs of a person who died without a will, to collect debts and securities of the deceased.",
  "Lease Agreement Drafting": "This is the drafting of a lease agreement that records the terms, period, rent and conditions on which property is leased.",
  "Will Drafting": "A will states how you want your property to be shared after your death. A properly drafted and witnessed will reduces disputes among heirs.",
  "Power of Attorney (POA)": "A power of attorney gives another person the authority to act for you in the matters stated in the document.",
  "Legal Notice for Defamation": "A defamation notice is sent to a person who has made false statements that harm your reputation, asking for withdrawal or apology before legal action.",
  "Online Dispute Resolution": "Online dispute resolution settles disputes through mediation or arbitration on digital platforms, usually faster and cheaper than a court case.",
  "Company Dispute Resolution": "This covers disputes between shareholders, directors and the company, which may be settled by talks, mediation or before the National Company Law Tribunal.",
  "Consumer Dispute Resolution": "A consumer who has a complaint about goods or services can seek a remedy before the Consumer Commission under the Consumer Protection Act, 2019.",
  "POSH Compliance Services": "The law on prevention of sexual harassment at the workplace requires employers to set up an Internal Committee, hold awareness sessions and file annual reports.",
  "Secretarial Audit": "A secretarial audit is a check by a company secretary in practice that the company is following the laws and rules that apply to it, and it is mandatory for certain companies.",
  "Sole Proprietorship to Pvt. Ltd. Company": "A proprietor can convert the business into a private limited company to get limited liability and a stronger structure for growth.",
  "Conversion of Pvt. Ltd. to Public Limited": "A private company can become a public company by changing its articles and following the steps in the Companies Act.",
  "Conversion of LLP to Private Company": "An LLP can be converted into a private limited company by following the steps set by the law and filing with the Registrar.",
  "Partnership Firm into Pvt. Ltd. Company": "A partnership firm can be registered as a private limited company, with the partners becoming its first members and directors as agreed.",
  "Conversion of a One Person Company to Private Limited Company": "An OPC can be converted into a private limited company when it needs more members or has outgrown the OPC structure.",
}

/** Steps that fit specific work better than the group steps. */
const STEPS: Record<string, string[]> = {
  "Annual Compliance of a Pvt. Ltd. Company": ["<strong>Calendar:</strong> we list the yearly requirements and their due dates.", "<strong>Accounts and audit:</strong> the financial statements are finalised and audited.", "<strong>Meetings:</strong> board meetings and the annual general meeting are held and minuted.", "<strong>Filing:</strong> Form AOC-4 and Form MGT-7 are filed, along with auditor and director filings.", "<strong>Records:</strong> statutory registers are updated and filing receipts are kept."],
  "Annual Filing for LLP": ["<strong>Accounts:</strong> the statement of account and solvency is prepared and signed by the designated partners.", "<strong>Form 8:</strong> the Statement of Account and Solvency is filed.", "<strong>Form 11:</strong> the Annual Return is filed with partner and contribution details.", "<strong>Audit, if applicable:</strong> accounts are audited where the LLP crosses the limits in the law.", "<strong>Records:</strong> receipts and updated records are kept."],
  "Winding Up of Private Limited Company": ["<strong>Choice of route:</strong> we compare voluntary liquidation, strike-off and winding up by the Tribunal for your case.", "<strong>Resolutions and declaration:</strong> the board and members pass the resolutions and, where needed, a declaration of solvency.", "<strong>Appointing a liquidator:</strong> a liquidator or professional is appointed and creditors are informed.", "<strong>Settling affairs:</strong> assets are sold, debts are paid and the surplus is shared.", "<strong>Filing and dissolution:</strong> the final report and forms are filed and the company is dissolved."],
  "Closing a Limited Liability Partnership": ["<strong>Choice of route:</strong> strike-off or winding up, depending on whether the LLP has operated and its liabilities.", "<strong>Clearing liabilities:</strong> dues, taxes and accounts are settled.", "<strong>Approvals:</strong> partner consent and the required declarations are prepared.", "<strong>Filing:</strong> the application is filed with the Registrar.", "<strong>Notice and removal:</strong> after the notice period, the LLP's name is struck off if there is no objection."],
  "Liquidation of Company": ["<strong>Solvency and route:</strong> we check whether the company can pay its debts and pick the route.", "<strong>Resolutions:</strong> members and creditors approve as the law requires.", "<strong>Liquidator:</strong> a licensed insolvency professional takes charge.", "<strong>Realisation and payment:</strong> assets are sold and creditors are paid in the order set by the law.", "<strong>Dissolution:</strong> the Tribunal or authority passes the order and the company is dissolved."],
  "Change in Registered Office": ["<strong>Type of move:</strong> within the same city, another city of the state, or another state.", "<strong>Resolutions:</strong> board and, where needed, special resolutions are passed.", "<strong>Filing:</strong> the forms (such as INC-22 or the regional director's approval) are filed.", "<strong>Notice:</strong> where required, creditors and others are informed or an advertisement is published.", "<strong>Updates:</strong> PAN, GST, bank and licences are updated to the new address."],
  "Change in Share Capital": ["<strong>Plan:</strong> the new capital and the share structure are decided.", "<strong>Approvals:</strong> board and shareholders' resolutions are passed and the Memorandum is altered.", "<strong>Notice and meeting:</strong> a general meeting is called as required.", "<strong>Filing:</strong> the forms and the revised Memorandum are filed with the Registrar.", "<strong>Records:</strong> the share registers and certificates are updated."],
  "GST Registration": ["<strong>Eligibility:</strong> we confirm whether registration is needed and which type.", "<strong>Documents:</strong> the papers and the business address proof are collected.", "<strong>Application:</strong> the application is filed on the GST portal.", "<strong>Verification:</strong> we reply to any query raised by the officer.", "<strong>GSTIN:</strong> the registration certificate is issued and you are guided on invoicing and returns."],
  "GST Return Filing": ["<strong>Data:</strong> sales and purchase data for the period is collected.", "<strong>Reconciliation:</strong> input credit is matched with what is shown on the portal.", "<strong>Preparation:</strong> the returns, such as GSTR-1 and GSTR-3B, are prepared for your approval.", "<strong>Payment and filing:</strong> tax is paid and the returns are filed.", "<strong>Follow-up:</strong> we track notices or mismatches."],
  "TDS Return Filing": ["<strong>Deductions:</strong> the tax deducted for the quarter is collected and checked.", "<strong>Payment check:</strong> deposits and challans are matched.", "<strong>Return:</strong> the quarterly return is prepared and filed.", "<strong>Certificates:</strong> TDS certificates are issued to the deductees.", "<strong>Corrections:</strong> any default notice or mismatch is corrected."],
  "Income Tax Return Filing": ["<strong>Income details:</strong> salary, business, capital gains and other income are collected.", "<strong>Documents:</strong> Form 16, TDS certificates, bank interest and investment proofs are matched with Form 26AS and the AIS.", "<strong>Computation:</strong> tax is calculated and the right form is chosen.", "<strong>Filing and verification:</strong> the return is filed and e-verified.", "<strong>Refund or notice:</strong> we track the refund or any notice."],
  "Cheque Bounce Notice": ["<strong>Review:</strong> we check the cheque, the bank's return memo and the dates.", "<strong>Notice:</strong> a demand notice is sent within the time allowed after you receive the return memo.", "<strong>Waiting period:</strong> the drawer is given the time allowed by the law to pay.", "<strong>Complaint:</strong> if the amount is not paid, a complaint can be filed in the court within the time allowed.", "<strong>Follow-up:</strong> an advocate attends the proceedings."],
  "Legal Notice": ["<strong>Facts:</strong> we collect the papers and the sequence of events.", "<strong>Drafting:</strong> the notice states the claim and the time to comply.", "<strong>Sending:</strong> it is sent by a method that gives proof of delivery.", "<strong>Reply:</strong> the reply is studied and talks or the next legal step are considered."],
  "Will Drafting": ["<strong>Details:</strong> we note your assets, family and wishes.", "<strong>Drafting:</strong> a clear will is drafted, naming an executor.", "<strong>Signing:</strong> it is signed by you in the presence of two witnesses, as the law requires.", "<strong>Registration (optional):</strong> you may register it, and keep it in a safe place."],
  "Residential Rental Agreement": ["<strong>Terms:</strong> rent, deposit, period, notice and maintenance are agreed.", "<strong>Drafting:</strong> the agreement is prepared.", "<strong>Stamping:</strong> it is stamped as per state rules.", "<strong>Signing:</strong> both sides and witnesses sign, and registration is done where needed."],
  "Sale Deed Registration": ["<strong>Title check:</strong> ownership and encumbrances are checked.", "<strong>Drafting:</strong> the sale deed is prepared.", "<strong>Stamp duty:</strong> stamp duty and registration fee are paid as per state rules.", "<strong>Registration:</strong> both sides appear before the sub-registrar with witnesses.", "<strong>Mutation:</strong> the property records are updated in the buyer's name."],
}

/** Page heading overrides: compliance pages talk about applicability, due dates and penalties. */
const TITLES = {
  advantages: "Why it matters",
  eligibility: "Applicability",
  documents: "Documents required",
  process: "Filing procedure",
  features: "Due dates, forms & penalties",
  why: "How Aeon helps",
} as const

export function buildComplianceContent(category: string, title: string): Content {
  const p = PROFILES[category]
  const what = WHAT[title] ?? p.what
  const overview = `<p>${what}</p><p>It falls under ${p.law}, and is dealt with by ${p.authority}. Forms, time limits and fees are set by them and may change, so we check the current position for your case before we start.</p>`
  const summary = `${title}: who it applies to, the documents needed, the filing procedure and the due dates to watch.`
  const procedure = category === "Contracts & Agreements" || category === "Legal Services" || category === "Accounting & CFO" ? "Procedure" : TITLES.process

  return {
    summary,
    highlights: ["Check of what applies to you", "Preparation of forms and documents", "Filing or execution on your behalf", "Reminders for what comes next"],
    sections: [
      sec("overview", overview),
      sec("advantages", li(p.matters), TITLES.advantages, "thumbs-up"),
      sec("eligibility", li(p.applies), TITLES.eligibility, "clipboard-check"),
      sec("documents", `${li(p.docs)}<p>The exact list depends on your case. We confirm it after a short discussion.</p>`, TITLES.documents),
      sec("process", ol(STEPS[title] ?? p.steps), procedure),
      sec("features", li(p.rules), TITLES.features, "clock"),
      sec(
        "why-us",
        li([
          "<strong>Calendar and reminders:</strong> we tell you about due dates before they arrive.",
          "<strong>Careful preparation:</strong> forms and documents are checked before they are filed or signed.",
          "<strong>Plain language:</strong> we explain what is needed and why.",
          "<strong>Follow-up:</strong> we track the filing until it is complete and tell you what comes next.",
        ]),
        TITLES.why,
      ),
    ],
    faqs: [
      { q: `Who needs ${title}?`, a: "It depends on the type of business or person and the facts. Share your details and we will confirm whether it applies to you." },
      { q: "What happens if I miss the due date?", a: "Late filing usually attracts additional fees or interest, and continued default can lead to penalties. The amounts depend on the filing and the delay, so it is best to file on time." },
      { q: "Which documents are required?", a: "The documents depend on the case. We give you a checklist after a short discussion and review what you send before we file." },
      { q: "What will Aeon do for me?", a: "We check what applies, prepare the forms and documents, file or execute them, track the outcome and remind you about what follows." },
    ],
    seoTitle: `${title} in India`.slice(0, 70),
    seoDescription: summary.slice(0, 170),
  }
}
