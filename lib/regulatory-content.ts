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
  benefits: string[]
  eligibility: string[]
  docs: string[]
  steps: string[]
  after: string[]
}

const PROFILES: Record<string, Profile> = {
  RBI: {
    authority: "the Reserve Bank of India (RBI)",
    law: "the Reserve Bank of India Act, 1934, the Payment and Settlement Systems Act, 2007 and the RBI's directions for the activity",
    what: "This is a licence, registration or compliance service for a business that lends, takes deposits or runs a payment service in India. Such businesses are regulated by the Reserve Bank of India.",
    benefits: [
      "Lets you carry on the regulated activity lawfully.",
      "Builds trust with customers, banks and investors.",
      "Gives access to the market and to partnerships that need a regulated entity.",
      "A clear compliance path from the start avoids problems later.",
    ],
    eligibility: [
      "Usually an Indian company registered under the Companies Act, with objects that cover the activity.",
      "Minimum capital (for example, Net Owned Fund), fit-and-proper directors, a business plan and a clean track record are checked. The limits are set by the RBI and are revised from time to time, so we confirm the current ones.",
      "Foreign investment, ownership and promoter conditions can apply.",
    ],
    docs: [
      "Certificate of incorporation, Memorandum and Articles of Association.",
      "KYC, CIBIL or credit reports and declarations of the directors and promoters.",
      "Net worth certificate, bank statements and audited financials of the company and the main promoters.",
      "Business plan, policies and the proposed structure.",
      "Office address proof and details of key personnel and the technology to be used.",
    ],
    steps: [
      "<strong>Assessment:</strong> we check whether the activity needs a licence and which one, and how ready your company is.",
      "<strong>Preparation:</strong> the company, capital, policies and the business plan are put in order.",
      "<strong>Application:</strong> the application and documents are filed on the RBI's online portal.",
      "<strong>Queries:</strong> we answer the RBI's questions and any request for more information.",
      "<strong>Approval:</strong> the in-principle or final approval and the certificate or authorisation are issued.",
    ],
    after: [
      "Regular returns and reports to the RBI, and an annual audit.",
      "Maintaining the capital and other prudential norms set for your category.",
      "Prior approval for certain changes, such as a change in control or management.",
      "Customer protection, KYC and grievance redressal norms.",
    ],
  },
  SEBI: {
    authority: "the Securities and Exchange Board of India (SEBI)",
    law: "the SEBI Act, 1992 and the regulations made under it for the activity",
    what: "This is a registration, approval or compliance service for businesses that work in the securities market, such as funds, merchant bankers and intermediaries, regulated by SEBI.",
    benefits: [
      "Lets you offer the regulated service lawfully.",
      "Gives investors and partners confidence in your firm.",
      "Opens up fundraising and investment opportunities.",
      "A clear compliance framework from day one.",
    ],
    eligibility: [
      "The applicant must have the legal form and net worth that the relevant SEBI regulation requires.",
      "Key people must meet the fit-and-proper criteria and have the qualifications or experience set for the role.",
      "Minimum capital, corpus, infrastructure and compliance officers are required for many categories. SEBI revises the limits, so we confirm the current ones.",
    ],
    docs: [
      "Constitutional documents of the applicant (trust deed, company or LLP papers).",
      "KYC and declarations of the sponsor, promoters, directors and key personnel.",
      "Net worth certificate and audited financials, where required.",
      "Business plan, policies and the proposed offer document, where the activity needs one.",
      "Proof of office, infrastructure and compliance arrangements.",
    ],
    steps: [
      "<strong>Structure:</strong> we advise on the right entity and category, and what SEBI will look for.",
      "<strong>Preparation:</strong> the entity, documents and policies are prepared.",
      "<strong>Application:</strong> the application is filed through SEBI's online process with the fee.",
      "<strong>Queries:</strong> we respond to SEBI's observations.",
      "<strong>Registration:</strong> the certificate of registration or approval is issued.",
    ],
    after: [
      "Periodic reports, audits and disclosures to SEBI and to investors.",
      "Compliance with the conduct, risk and investor protection rules for your category.",
      "Prior intimation or approval for certain changes.",
      "Maintaining the net worth and other conditions of registration.",
    ],
  },
  IRDA: {
    authority: "the Insurance Regulatory and Development Authority of India (IRDAI)",
    law: "the Insurance Act, 1938, the IRDA Act, 1999 and the IRDAI regulations for the activity",
    what: "This is a licence or registration for businesses that sell, distribute, assess or support insurance, which is regulated by the IRDAI.",
    benefits: [
      "Lets you carry on the insurance activity lawfully.",
      "Builds trust with customers and insurers.",
      "Enables tie-ups with insurance companies.",
      "A clear compliance path for returns and conduct.",
    ],
    eligibility: [
      "Usually a company or LLP with objects that cover the activity.",
      "Minimum capital or net worth, qualified principal officers and fit-and-proper directors are checked. The limits are set by the IRDAI and revised from time to time.",
      "Some categories need examinations or training for key persons.",
    ],
    docs: [
      "Incorporation papers and Memorandum and Articles of Association.",
      "KYC and declarations of directors, promoters and key persons.",
      "Net worth certificate, bank statements and audited financials.",
      "Business plan, organisation chart and details of the premises.",
      "Qualification and training certificates of the principal officer and other key persons.",
    ],
    steps: [
      "<strong>Assessment:</strong> we confirm the category and what the IRDAI expects.",
      "<strong>Preparation:</strong> the company, capital and key persons are put in order.",
      "<strong>Application:</strong> the application is filed on the IRDAI's online system.",
      "<strong>Queries:</strong> we answer the IRDAI's questions.",
      "<strong>Licence:</strong> the certificate of registration or licence is issued.",
    ],
    after: [
      "Regular returns and reports to the IRDAI.",
      "Renewal of the licence before it expires.",
      "Following the conduct, disclosure and grievance rules.",
      "Prior approval or intimation for specified changes.",
    ],
  },
  CDSCO: {
    authority: "the Central Drugs Standard Control Organisation (CDSCO) and the State Licensing Authority",
    law: "the Drugs and Cosmetics Act, 1940, the Drugs Rules, 1945, the Cosmetics Rules, 2020 and the Medical Devices Rules, 2017",
    what: "This is a licence, registration or no-objection certificate for businesses that make, sell, import or export drugs, cosmetics or medical devices in India.",
    benefits: [
      "Lets you make, sell or import the product lawfully.",
      "Assures customers and hospitals of the product's regulatory status.",
      "Needed for tenders, distribution and exports.",
      "Protects you from seizure and penalties for unlicensed activity.",
    ],
    eligibility: [
      "Proprietors, partnerships, companies and LLPs that carry on the activity.",
      "Premises, equipment, storage and qualified staff (such as a registered pharmacist or a competent technical person) must meet the rules for the licence.",
      "Whether the central or the state authority grants the licence depends on the activity and the product.",
    ],
    docs: [
      "Constitution documents of the firm or company, and PAN and identity proof of the owners or directors.",
      "Proof of the premises (ownership or rent) and a layout plan.",
      "Qualification and registration proof of the competent person or pharmacist, and their appointment letter.",
      "Details of the products, manufacturing or storage facility, and equipment list.",
      "For imports: manufacturer's authorisation and other product documents.",
    ],
    steps: [
      "<strong>Category check:</strong> we identify the exact licence or registration and the authority for it.",
      "<strong>Premises and staff:</strong> we guide you on what the premises and the staff must have.",
      "<strong>Application:</strong> the application and documents are filed on the relevant portal.",
      "<strong>Inspection:</strong> the authority may inspect; we tell you how to prepare.",
      "<strong>Grant:</strong> the licence, registration or NOC is issued.",
    ],
    after: [
      "Renewal or retention of the licence by the date set in the rules.",
      "Maintaining the premises, records and the qualified person.",
      "Following the quality, labelling and reporting requirements.",
      "Informing the authority about changes in premises, ownership or products.",
    ],
  },
  BIS: {
    authority: "the Bureau of Indian Standards (BIS)",
    law: "the Bureau of Indian Standards Act, 2016 and the schemes and rules made under it",
    what: "This is a certification or registration under a Bureau of Indian Standards scheme, which shows that a product or service meets the Indian standard that applies to it.",
    benefits: [
      "Lets you sell products that are required by law to carry the BIS mark.",
      "Shows buyers that the product meets the standard.",
      "Needed for many tenders and for large retail and e-commerce buyers.",
      "Protects against penalties for selling uncertified products.",
    ],
    eligibility: [
      "Manufacturers, and in some schemes importers, with a factory or an authorised manufacturer for the product.",
      "The product must fall under a standard and a scheme; for some products certification is compulsory.",
      "The factory needs the testing and quality control facilities the standard requires, or use of a recognised laboratory.",
    ],
    docs: [
      "Business registration papers and PAN or GST of the applicant.",
      "Factory details: address, layout, list of machinery and testing equipment.",
      "Product details, specifications and the Indian Standard applicable.",
      "Test reports from a BIS-recognised laboratory, where required.",
      "For foreign manufacturers or importers: authorised Indian representative details and other documents the scheme asks for.",
    ],
    steps: [
      "<strong>Standard check:</strong> we identify the standard and the scheme that apply to your product.",
      "<strong>Preparation:</strong> the factory, quality control and documents are readied.",
      "<strong>Application:</strong> the application is filed on the BIS portal.",
      "<strong>Testing and inspection:</strong> samples are tested and the factory may be inspected.",
      "<strong>Licence:</strong> the BIS licence or registration is granted.",
    ],
    after: [
      "Using the BIS mark and licence number as the licence terms require.",
      "Regular testing of samples and keeping records.",
      "Renewal of the licence before it ends, and payment of the marking fee.",
      "Surveillance inspections and informing BIS of changes.",
    ],
  },
  FEMA: {
    authority: "the Reserve Bank of India and the Authorised Dealer bank",
    law: "the Foreign Exchange Management Act, 1999 and the rules and regulations made under it",
    what: "This relates to foreign exchange rules for businesses with cross-border dealings, such as foreign companies setting up an office in India or Indian companies taking or making overseas investment.",
    benefits: [
      "Keeps foreign investment and remittances within the law.",
      "Avoids penalties and compounding for contraventions.",
      "Makes banking and reporting smoother.",
      "Gives foreign parents and investors confidence.",
    ],
    eligibility: [
      "Foreign companies and people who want to set up or run a business presence in India, and Indian businesses with foreign investment or overseas transactions.",
      "The permitted activities, the route (automatic or approval) and the reporting rules depend on the sector and type of transaction.",
      "A liaison, branch or project office has its own conditions on what it can do.",
    ],
    docs: [
      "Incorporation documents of the foreign entity, with the latest audited accounts.",
      "Identity and address proof of the persons involved, and a board resolution authorising the setup.",
      "Details of the proposed activity, the Indian address and the Authorised Dealer bank.",
      "Bank references and any other document the bank or the RBI asks for.",
    ],
    steps: [
      "<strong>Assessment:</strong> we check the route and the conditions for your case.",
      "<strong>Documents:</strong> papers from the foreign entity are collected and, where needed, apostilled or notarised.",
      "<strong>Application:</strong> the application is filed through the Authorised Dealer bank or the RBI.",
      "<strong>Approval:</strong> we follow up on queries until the approval or registration is granted.",
      "<strong>Reporting:</strong> we guide you on the filings that follow.",
    ],
    after: [
      "Annual activity and compliance certificates, and audited accounts of the office.",
      "Reporting of foreign investment and remittances in the prescribed forms and within the time limits.",
      "Staying within the permitted activities of the office.",
      "Tax registration and filings, such as PAN and GST, where they apply.",
    ],
  },
  "Legal Metrology": {
    authority: "the Legal Metrology Department of the state or the Controller of Legal Metrology",
    law: "the Legal Metrology Act, 2009 and the Legal Metrology (Packaged Commodities) Rules, 2011 and other rules under the Act",
    what: "This is a registration, licence or certificate for weights, measures and packaged goods, to make sure that the quantity and labelling that customers see are correct.",
    benefits: [
      "Lets you manufacture, repair, deal in, import or pack goods and measures lawfully.",
      "Avoids fines, seizure and prosecution for non-compliance.",
      "Builds buyer trust in your measures and packs.",
      "Needed by large retailers and e-commerce platforms.",
    ],
    eligibility: [
      "Manufacturers, dealers, repairers and importers of weights and measures, and those who pack or import packaged goods.",
      "Premises, verified standards and qualified staff are required for some licences.",
      "Labelling rules on packs, such as net quantity and declarations, must be met.",
    ],
    docs: [
      "Business registration papers, PAN and identity proof of the owners or directors.",
      "Proof of the premises, with a layout, where required.",
      "Details of the weights and measures or packaged commodities handled.",
      "Verification and calibration certificates of the standards and equipment.",
      "Importers: import-export code and the product details.",
    ],
    steps: [
      "<strong>Check:</strong> we confirm the licence or registration that applies to your activity.",
      "<strong>Preparation:</strong> the premises, standards and documents are put in order.",
      "<strong>Application:</strong> the application is filed with the department.",
      "<strong>Inspection:</strong> the department may inspect; we guide you on what to keep ready.",
      "<strong>Grant:</strong> the licence or certificate is issued.",
    ],
    after: [
      "Renewal of the licence before it expires.",
      "Periodic verification and stamping of weights and measures.",
      "Correct declarations on packaged goods.",
      "Keeping registers and being ready for inspection.",
    ],
  },
  Telecom: {
    authority: "the Department of Telecommunications (DoT), including its Wireless Planning and Coordination (WPC) wing",
    law: "the telecom laws of India and the conditions of the licence or authorisation concerned",
    what: "This is a licence, authorisation or clearance for telecom services, equipment and spectrum use, which is regulated by the Department of Telecommunications.",
    benefits: [
      "Lets you offer the telecom service or use the equipment lawfully.",
      "Builds trust with customers, operators and partners.",
      "Needed for import, installation and operation of many wireless products.",
      "Avoids penalties and seizure for unlicensed activity.",
    ],
    eligibility: [
      "Usually an Indian company registered under the Companies Act, with objects that cover the service.",
      "Foreign investment limits, net worth and other conditions depend on the licence type and category.",
      "Some clearances (such as for towers or wireless equipment) have their own conditions on location and equipment.",
    ],
    docs: [
      "Incorporation papers, Memorandum and Articles, and the shareholding structure.",
      "Net worth and audited financial statements, where the licence needs them.",
      "Identity, address and security-clearance details of the directors and key persons.",
      "A technical and business plan or product details, depending on the licence.",
      "Bank guarantee and fee details, where the licence requires them.",
    ],
    steps: [
      "<strong>Category check:</strong> we identify the licence or authorisation and its conditions.",
      "<strong>Preparation:</strong> the company, capital and documents are put in order.",
      "<strong>Application:</strong> the application is filed on the DoT's online portal.",
      "<strong>Examination:</strong> we answer DoT's queries and clarifications.",
      "<strong>Grant:</strong> the licence agreement is signed and the licence or clearance is issued.",
    ],
    after: [
      "Licence fee and other payments, and the returns the licence requires.",
      "Following the service, quality and security conditions of the licence.",
      "Renewal or validity conditions, as stated in the licence.",
      "Prior approval for change in shareholding or control.",
    ],
  },
}

const WHAT: Record<string, string> = {
  "NBFC Takeover": "An NBFC takeover is the purchase of an existing NBFC, together with its licence, by a new owner. It needs the RBI's prior approval for the change in control or management.",
  "NBFC for Sale": "Some companies that already hold an NBFC registration are offered for sale. A buyer has to check the company's compliance record and needs the RBI's approval for the change.",
  "FFMC License": "A Full-Fledged Money Changer (FFMC) licence allows a business to buy and sell foreign currency, issued by the RBI to eligible applicants.",
  "Microfinance Company Registration": "A microfinance institution (NBFC-MFI) lends small amounts to low-income households and has to meet the RBI's norms for such lenders.",
  "Housing Finance Company Registration": "A housing finance company lends for homes and is regulated by the Reserve Bank of India under the directions for housing finance companies.",
  "NBFC Account Aggregator License": "Account aggregators are a class of NBFCs that securely share a person's financial data between institutions, with the person's consent.",
  "Prepaid Wallet License": "A prepaid payment instrument (PPI) licence allows a company to issue digital wallets and similar instruments, as authorised by the RBI.",
  "Peer to Peer Lending License": "A peer-to-peer lending platform is an NBFC that connects lenders and borrowers online, and has to be registered with the RBI.",
  "Payment Bank License": "A payments bank accepts deposits up to a limit and offers payments and remittance services, with a licence from the RBI.",
  "Payment Gateway License": "Businesses that handle online payments for merchants need to follow the RBI's rules for payment aggregators and gateways.",
  "Mobile Wallet License": "A mobile wallet is a prepaid payment instrument. Issuing one needs an authorisation from the RBI under the payment systems law.",
  "TPAP License": "A Third Party Application Provider (TPAP) works with banks to offer UPI-based payment apps, under the rules of the NPCI and the RBI.",
  "Payment Aggregator License": "A payment aggregator collects payments from customers on behalf of merchants. Non-bank aggregators need an RBI authorisation.",
  "NBFC Marketing Services in India": "This covers marketing and customer acquisition for NBFCs, which has to follow the RBI's norms on fair practice and digital lending.",
  "NBFC Debt Recovery Advisory": "Advice on recovering dues in a manner that follows the RBI's fair practice code and the law on recovery.",
  "NBFC Asset Liability Management": "Asset-liability management (ALM) is how an NBFC manages the timing of its inflows and outflows to avoid liquidity problems, as per the RBI's guidelines.",
  "Mortgage Guarantee Company Registration": "A mortgage guarantee company protects lenders against default on housing loans, and is regulated by the RBI as an NBFC.",
  "NBFC Loan Portfolio Audit": "A loan portfolio audit reviews the quality of an NBFC's loans, its classification, provisions and compliance with the RBI's norms.",
  "NBFC Software": "NBFC software helps manage loans, collections and reporting. The system should support the RBI's reporting and data security requirements.",
  "Funding in NBFC": "Raising money for an NBFC, from equity or debt, has to follow the RBI's rules on foreign investment, ownership and borrowing.",
  "Alternative Investment Fund Registration": "An Alternative Investment Fund (AIF) is a privately pooled investment vehicle, registered with SEBI, that invests in assets such as startups, real estate or special situations.",
  "Mergers and Acquisitions": "Mergers and acquisitions combine or transfer businesses. For listed companies and intermediaries, SEBI's rules on disclosures and takeover must be followed.",
  "Recovery of Shares": "This is the process of claiming back shares, dividends or other benefits that are lying with a company, the investor protection fund or a depository.",
  "Merchant Banker License": "A merchant banker manages share issues, takeovers and similar corporate finance work, and needs a certificate of registration from SEBI.",
  "AMFI Registration": "An AMFI Registration Number (ARN) lets a person or firm distribute mutual fund products, after passing the required certification.",
  "Collective Investment Scheme": "A collective investment scheme pools money from investors for a common business. It is regulated by SEBI, and unregistered schemes are not allowed.",
  "Registration of Underwriters with SEBI": "An underwriter agrees to buy unsold shares in an issue, and needs registration with SEBI.",
  "PMS registration SEBI": "A portfolio manager manages investments for clients, and needs registration with SEBI under the Portfolio Managers Regulations.",
  "Insurance Repository Registration": "An insurance repository keeps insurance policies in electronic form. It needs registration with the IRDAI.",
  "REIT Registration": "A Real Estate Investment Trust (REIT) pools money to own income-producing property. It is registered with SEBI.",
  "SEBI AIF Compliance": "A registered AIF has to comply with SEBI's ongoing requirements: reports, valuation, investor disclosures and audits.",
  "Reverse Merger": "In a reverse merger, a larger or unlisted company merges into a smaller, often listed, company, with approvals from regulators and the court or Tribunal.",
  "Insurance Company License": "An insurance company needs a licence from the IRDAI, with the capital, promoters and plans the Insurance Act requires.",
  "Insurance Web Aggregator License": "A web aggregator shows and compares insurance products from different insurers on a website, and needs an IRDAI licence.",
  "Insurance Broker License": "An insurance broker advises clients and places their insurance with insurers, and needs an IRDAI licence.",
  "Insurance Surveyors and Loss Assessors Registration": "Surveyors and loss assessors examine insurance claims and estimate losses. They need a licence from the IRDAI.",
  "Insurance Marketing Firm": "An insurance marketing firm sells insurance products as a distributor, within the limits set by the IRDAI.",
  "Insurance Self-Network Platform": "A self-network platform allows insurers to sell products through a digital channel they run, under the IRDAI's rules.",
  "Drug License": "A drug licence is the permission to manufacture, sell, stock or distribute drugs, issued under the Drugs and Cosmetics Act, 1940.",
  "Retail Drug License": "A retail drug licence allows a pharmacy or chemist shop to sell drugs to the public, with a registered pharmacist in charge.",
  "Manufacturing Drug License": "A manufacturing licence allows a company to make drugs at a facility that meets the good manufacturing practice (GMP) rules.",
  "Wholesale Drug License": "A wholesale drug licence allows the sale of drugs to retailers and other licensed buyers, with proper storage and a competent person.",
  "Medical Device Registration": "Medical devices are regulated under the Medical Devices Rules, 2017, with registration or licensing depending on the risk class of the device.",
  "CDSCO Registration": "CDSCO registration covers the approvals that the central authority gives for drugs, devices and cosmetics, such as import registration.",
  "CDSCO Cosmetic Import Registration": "A cosmetic that is imported into India needs a registration certificate under the Cosmetics Rules, 2020.",
  "CDSCO Medical Device Import License": "Importing medical devices into India needs a licence from the CDSCO, with documents from the manufacturer.",
  "Cosmetic Manufacturing License": "A cosmetic manufacturing licence allows a company to make cosmetics in India, with a facility that meets the rules.",
  "In Vitro Diagnostic Device Manufacturing License": "A manufacturing licence for in vitro diagnostic (IVD) devices, such as test kits, is granted under the Medical Devices Rules, 2017.",
  "InVitro Diagnostic Device Import License": "Importing in vitro diagnostic devices needs a licence from the CDSCO under the Medical Devices Rules, 2017.",
  "Drug Export NOC": "A no-objection certificate (NOC) for the export of drugs is issued for certain drugs and conditions before they are exported.",
  "Dual-Use NOC": "A dual-use NOC is needed for exporting certain chemicals and products that can be used for both ordinary and restricted purposes.",
  "CDSCO Test License": "A test licence allows the manufacture or import of small quantities of drugs for examination, test or analysis.",
  "ADC NOC": "An NOC from the Assistant Drugs Controller is needed for certain drug activities, such as export of some preparations.",
  "CDSCO Drugs Import License": "Drugs imported into India need a registration certificate and an import licence under the Drugs Rules, 1945.",
  "Pharmacist Registration Renewal": "A registered pharmacist's registration has to be renewed with the state pharmacy council at the interval set by the rules.",
  "BIS Registration": "BIS registration under the Compulsory Registration Scheme (CRS) is required for notified electronics and similar products before they are sold in India.",
  "Eco Mark Scheme Certification": "The Eco Mark is a label for products that are environment-friendly across their life cycle, granted by the BIS.",
  "ISI Mark Certification": "The ISI mark shows that a product conforms to an Indian Standard under the BIS Product Certification Scheme.",
  "BIS CRS Registration": "The Compulsory Registration Scheme requires manufacturers of notified products, such as many electronic items, to be registered with the BIS before sale.",
  "BIS LAB Recognition Scheme": "The BIS Laboratory Recognition Scheme recognises laboratories that test products against Indian Standards.",
  "Hallmark Registration": "Hallmarking is the certification of the purity of gold and silver. Jewellers need BIS registration to sell hallmarked articles.",
  "Assaying and Hallmarking Centre": "An assaying and hallmarking centre tests and marks precious-metal articles, and needs recognition from the BIS.",
  "STQC Certification": "STQC provides testing and certification for IT and electronics products, including quality, security and conformity services.",
  "BIS CRS Certification for Power Banks": "Power banks are covered by the BIS Compulsory Registration Scheme and must carry the BIS registration before they are sold.",
  "AGMARK License": "AGMARK certifies the quality of agricultural commodities under the Agricultural Produce (Grading and Marking) Act, 1937.",
  "BIS Certification for Toys": "Toys sold in India must meet the Indian Standards for safety and carry the BIS mark under the Toys (Quality Control) Order.",
  "FMCS BIS Certification": "The Foreign Manufacturers Certification Scheme (FMCS) lets overseas manufacturers get BIS certification for their products sold in India.",
  "Development, Planning & Implementation of CSR Strategy": "This covers planning and carrying out a company's corporate social responsibility (CSR) programme, as required for companies that meet the Companies Act thresholds.",
  "FEMA Compliance": "FEMA compliance covers the filings, approvals and reporting that businesses with foreign investment or overseas dealings have to follow.",
  "Liaison Office Registration": "A liaison office lets a foreign company represent it in India and promote its business, without earning income in India.",
  "Branch Office Registration": "A branch office lets a foreign company carry on permitted activities in India, such as export, import and rendering services.",
  "Project Office Registration": "A project office is set up by a foreign company to carry out a specific project in India, with the permitted conditions.",
  "Legal Metrology Act Registration": "This is the registration that businesses need under the Legal Metrology Act, 2009, depending on whether they make, sell, repair or import measures and packaged goods.",
  "Model Approval Certificate for Weights and Measures": "A model approval certificate shows that the design of a weighing or measuring instrument has been approved before it is made.",
  "LMPC Importer License": "An importer of packaged commodities needs to register under the Legal Metrology (Packaged Commodities) Rules.",
  "Legal Metrology Dealer License": "A dealer licence allows the sale of weights and measures, and is granted by the state Legal Metrology Department.",
  "Legal Metrology Manufacturer License": "A manufacturer licence allows the making of weights and measures that meet the approved models and standards.",
  "Legal Metrology Repairer License": "A repairer licence allows the repair of weights and measures, and requires verified standards and a competent person.",
  "Packaged Commodity Registration": "Packers and importers of pre-packaged goods have to register and follow the rules on declarations such as net quantity and the maximum retail price.",
  "Legal Metrology License Renewal": "Legal metrology licences are valid for a period and have to be renewed before they expire.",
  "Legal Metrology Compliance & Audit": "This covers a review of your weights, measures and packaging against the Legal Metrology rules, to find and fix problems before an inspection.",
  "Legal Metrology Notice Resolution Services": "If you receive a notice from the Legal Metrology Department, this service helps you understand it and prepare a reply.",
  "LMPC Certificate": "A Legal Metrology Packaged Commodities (LMPC) certificate shows that a business is registered to pack or import packaged goods.",
  "UL VNO License": "A Unified License (Virtual Network Operator) lets a company offer telecom services using the network of a licensed network operator, without owning the network.",
  "WPC Import License": "Wireless equipment that uses radio frequencies needs an import licence or an equipment type approval from the WPC wing of the DoT.",
  "IPLC License": "An International Private Leased Circuit (IPLC) is a dedicated line between two countries, provided by licensed telecom operators.",
  "Non-Network License Services": "Some telecom services do not need your own network, such as services provided over the network of another licensee, under a separate authorisation.",
  "Network License": "A network licence allows a company to build and run a telecom network under the conditions of the licence.",
  "Access Service License Registration": "An access service licence lets a company provide voice and data services to subscribers in a service area.",
  "DPL/NDPL License": "Dedicated and non-dedicated point-to-point links (DPL and NDPL) connect locations using licensed spectrum or lines.",
  "Demonstration License": "A demonstration licence allows the temporary use of wireless equipment for tests, trials or exhibitions.",
  "FCC Certification": "FCC certification shows that electronic products meet the radio-frequency rules of the United States, and is often asked for in exports to that country.",
  "SACFA Clearance": "The Standing Advisory Committee on Radio Frequency Allocation (SACFA) clears the site and the frequency for towers and wireless installations.",
}

const STEPS: Record<string, string[]> = {
  "NBFC Registration": ["<strong>Eligibility:</strong> we check your company's structure, capital and promoters against the RBI's requirements.", "<strong>Company set-up:</strong> a company with NBFC objects is incorporated or adapted, and the capital is brought in.", "<strong>Documents:</strong> KYC, net worth, business plan and policies are prepared.", "<strong>Application:</strong> the application is filed with the RBI online, and queries are answered.", "<strong>Certificate of Registration:</strong> after the RBI's approval, the certificate is issued and you begin business as per its terms."],
  "Alternative Investment Fund Registration": ["<strong>Structure:</strong> choose the category and the legal form (trust, company or LLP).", "<strong>Set-up:</strong> the fund entity, the sponsor and the manager are put in place.", "<strong>Documents:</strong> the contribution agreement, private placement memorandum and declarations are prepared.", "<strong>Application:</strong> the application is filed with SEBI through its online portal, with the fee.", "<strong>Registration:</strong> SEBI grants the registration and the fund can raise commitments."],
  "UL VNO License": ["<strong>Eligibility:</strong> we confirm the category (national, circle or service area) and your company's readiness.", "<strong>Agreement with a network operator:</strong> a tie-up with a licensed network service operator is arranged.", "<strong>Application:</strong> the application and documents are filed on the DoT's online portal.", "<strong>Examination:</strong> DoT examines the application and may ask for more information.", "<strong>Licence:</strong> the letter of intent is issued, the guarantee and fee are paid, and the licence agreement is signed."],
}

export function buildRegulatoryContent(category: string, title: string): Content {
  const p = PROFILES[category]
  const what = WHAT[title] ?? p.what
  const overview = `<p>${what}</p><p>It falls under ${p.law}, and is dealt with by ${p.authority}. Conditions, forms, capital limits and fees are set by the regulator and are revised from time to time, so we check the current position for your case before we start.</p>`
  const summary = `${title}: who can apply, the documents needed, the application process and the compliance that follows.`

  return {
    summary,
    highlights: ["Eligibility check before you apply", "Application and documents prepared", "Replies to the regulator's queries", "Guidance on the compliance that follows"],
    sections: [
      sec("overview", overview),
      sec("advantages", li(p.benefits), "Benefits", "thumbs-up"),
      sec("eligibility", li(p.eligibility), "Eligibility criteria", "clipboard-check"),
      sec("documents", `${li(p.docs)}<p>The exact list depends on your case. We confirm it after a short discussion.</p>`, "Documents required"),
      sec("process", ol(STEPS[title] ?? p.steps), "Application process"),
      sec("features", li(p.after), "Compliance after approval", "clock"),
      sec(
        "why-us",
        li([
          "<strong>Regulator-ready files:</strong> applications are prepared with the regulator's checklist in mind.",
          "<strong>Query handling:</strong> we answer the regulator's questions so the file keeps moving.",
          "<strong>Plain language:</strong> we explain the capital, people and policy requirements before you invest.",
          "<strong>After approval:</strong> we tell you about the returns and renewals that follow.",
        ]),
        "How Aeon helps",
      ),
    ],
    faqs: [
      { q: `Who can apply for ${title}?`, a: "It depends on the regulator's conditions for this licence, such as the type of entity, capital and the people involved. Share your details and we will confirm whether you qualify." },
      { q: "Which documents are required?", a: "Usually the company papers, KYC and net worth of the promoters, a business plan and proof of premises. The exact list depends on the case, and we confirm it before you file." },
      { q: "How long does approval take?", a: "It depends on the regulator's processing, the completeness of your file and any queries. After reviewing your details we can give you a realistic estimate." },
      { q: "What happens after approval?", a: "You have to follow ongoing conditions such as returns, audits, renewals and prior approvals for certain changes. We guide you on these." },
    ],
    seoTitle: `${title} in India`.slice(0, 70),
    seoDescription: summary.slice(0, 170),
  }
}
