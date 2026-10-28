import type { ServiceInput } from "@/lib/services"

type Content = Pick<ServiceInput, "summary" | "highlights" | "sections" | "faqs" | "seoTitle" | "seoDescription">
type Key = ServiceInput["sections"][number]["key"]

const li = (items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`
const ol = (items: string[]) => `<ol>${items.map((i) => `<li>${i}</li>`).join("")}</ol>`
const sec = (key: Key, html: string) => ({ key, html })

type Profile = {
  authority: string
  law: string
  what: string
  who: string[]
  docs: string[]
  steps: string[]
  after: string[]
  advantages: string[]
}

const PROFILES: Record<string, Profile> = {
  "Trademarks India": {
    authority: "the Trade Marks Registry (office of the Controller General of Patents, Designs and Trade Marks)",
    law: "the Trade Marks Act, 1999",
    what: "A trademark is a name, logo, slogan or other sign that tells customers who a product or service comes from. In India it is protected under the Trade Marks Act, 1999.",
    who: [
      "Any individual, proprietorship, partnership, company, LLP, trust or society that uses, or plans to use, a mark for goods or services.",
      "A mark that is distinctive and not too similar to an existing mark has the best chance. Marks that only describe the product, or that are against the law, can be refused.",
      "A clear list of the goods or services, because protection is given class by class.",
    ],
    docs: [
      "Identity and address proof of the applicant; for a company or LLP, the incorporation certificate.",
      "The brand name, or the logo in a clear image file.",
      "The list of goods or services and the class (category) for each.",
      "Date from which the mark has been used, if it is already in use.",
      "Signed authorisation for our team to file on your behalf (Form TM-48).",
    ],
    steps: [
      "<strong>Search:</strong> we check the register for identical or similar marks before you invest in the brand.",
      "<strong>Class selection:</strong> we identify the right class or classes for your goods or services.",
      "<strong>Filing:</strong> the application is prepared and filed with the Registry.",
      "<strong>Examination:</strong> the Registry examines it and may raise an objection, which we help you answer.",
      "<strong>Publication and registration:</strong> the mark is published in the Trade Marks Journal; if nobody opposes, the registration certificate is issued.",
    ],
    after: [
      "A registered trademark is valid for ten years and can be renewed for further periods of ten years.",
      "Use the TM symbol while the application is pending, and the ® symbol only after the mark is registered.",
      "Keep using the mark, and watch for similar marks that others may file.",
      "Record any change of owner or address with the Registry.",
    ],
    advantages: [
      "The exclusive right to use the mark for the registered goods or services.",
      "The right to take legal action against copying or misuse.",
      "An asset that can be sold, licensed or franchised.",
      "More trust from customers, banks and investors.",
    ],
  },
  "International TM": {
    authority: "the trademark office of the country concerned, or WIPO under the Madrid system for member countries",
    law: "the trademark law of each country and, for the Madrid route, the Madrid Protocol",
    what: "A trademark is protected only in the country where it is registered. To protect your brand abroad you apply in each country you care about, either directly with its trademark office or through the Madrid system of WIPO.",
    who: [
      "Indian and foreign businesses that sell, export, license or plan to expand in other countries.",
      "Rules differ by country: some protect the first to file, others the first to use, and some countries need a local attorney.",
      "The Madrid route needs a basic Indian application or registration, and is open to countries that are members of the Madrid system.",
    ],
    docs: [
      "Applicant name, address and nationality, with identity or incorporation papers.",
      "The mark (word or a clear image of the logo) and the list of goods or services.",
      "Details of the Indian application or registration, if the Madrid route is used.",
      "A power of attorney and any translation or other paper that the country requires.",
    ],
    steps: [
      "<strong>Plan:</strong> we help you choose the countries and the filing route (direct filing or Madrid).",
      "<strong>Search:</strong> a search is done in the chosen country where possible.",
      "<strong>Filing:</strong> the application is prepared, translated if needed, and filed.",
      "<strong>Examination:</strong> we handle replies to objections raised by the foreign office, through a local attorney where required.",
      "<strong>Registration:</strong> once accepted and published, the registration certificate is issued.",
    ],
    after: [
      "Protection runs for a fixed term in each country (commonly ten years) and must be renewed.",
      "Some countries need proof of use after a few years.",
      "Keep your local contact details up to date.",
      "Watch for conflicting filings in the countries that matter to you.",
    ],
    advantages: [
      "Protection for your brand in the markets where you sell.",
      "A stronger position against copying abroad.",
      "Helps with export, licensing and franchising deals.",
      "Reduces the risk that someone else registers your brand first in that country.",
    ],
  },
  Designs: {
    authority: "the Designs Wing of the Patent Office (Controller of Designs)",
    law: "the Designs Act, 2000",
    what: "A design is the shape, pattern, configuration or ornament of an article that looks appealing to the eye. A registered design protects how a product looks, not how it works.",
    who: [
      "Manufacturers, designers and brand owners with a new and original design for an article.",
      "The design must not have been published or used anywhere before the filing date, and must not be a mere mechanical device or a trademark.",
    ],
    docs: [
      "Applicant identity and address proof; incorporation papers for a company.",
      "Clear representations of the design (drawings or images) from the necessary views.",
      "The article it is applied to and a short statement of novelty.",
      "Signed authorisation for our team to file for you.",
    ],
    steps: [
      "<strong>Novelty check:</strong> we help you check that the design has not been disclosed before.",
      "<strong>Preparation:</strong> the representations and statement are prepared.",
      "<strong>Filing:</strong> the application is filed with the Design Office.",
      "<strong>Examination:</strong> any objection is answered.",
      "<strong>Registration:</strong> the design is registered and a certificate is issued.",
    ],
    after: [
      "A design is registered for ten years, and the term can be extended once by five more years.",
      "Mark the article with the design registration number where appropriate.",
      "Keep fees paid on time so the registration stays in force.",
    ],
    advantages: [
      "Protects the look of your product from copying.",
      "Adds value to the product and to your brand.",
      "Helps in taking legal action against imitations.",
    ],
  },
  GI: {
    authority: "the Geographical Indications Registry (Chennai)",
    law: "the Geographical Indications of Goods (Registration and Protection) Act, 1999",
    what: "A geographical indication (GI) identifies goods that come from a place and have a quality, reputation or characteristic linked to that place, such as certain crafts, foods and farm produce.",
    who: [
      "An association of persons, producers, organisation or authority that represents the interests of the producers of the goods.",
      "The goods must have a clear link to a defined area, with a quality or reputation due to that origin.",
    ],
    docs: [
      "Details and constitution of the applicant association or body.",
      "A statement of case: how the goods are linked to the area and what makes them special.",
      "A map of the area, the standards or inspection method, and the production process.",
      "Historical or other proof of reputation and origin.",
    ],
    steps: [
      "<strong>Assessment:</strong> we check whether the goods and the applicant qualify.",
      "<strong>Application:</strong> the statement of case and papers are prepared and filed.",
      "<strong>Examination:</strong> the Registry examines it, and a consultative group may be consulted.",
      "<strong>Publication:</strong> it is published in the GI Journal for objections.",
      "<strong>Registration:</strong> if there is no successful objection, it is registered.",
    ],
    after: [
      "A GI is registered for ten years and can be renewed.",
      "Producers who want to use it apply to be registered as authorised users.",
      "Keep quality standards and take action against misuse.",
    ],
    advantages: [
      "Protects the name of the goods and the producers' community.",
      "Stops others from using the name for goods from elsewhere.",
      "Builds trust and value for the origin.",
    ],
  },
  Advisory: {
    authority: "the Patent Office and the relevant courts, for the records and rights that are reviewed",
    law: "the intellectual property laws that apply to the assets reviewed",
    what: "Advisory services help you understand what your intellectual property is worth, whether it is strong and safe, and what risks come with buying, selling or funding it.",
    who: [
      "Businesses planning an investment, acquisition, sale or licence that involves patents or other IP.",
      "Founders and companies that want to know how strong and valuable their IP assets are.",
    ],
    docs: [
      "A list of the IP assets and their registration or application details.",
      "Ownership papers: assignments, licences and agreements.",
      "Product and technical details related to the IP.",
      "Any earlier search, opinion or legal notice.",
    ],
    steps: [
      "<strong>Scope:</strong> we agree on the assets and what you want to know.",
      "<strong>Review:</strong> records, ownership and, where relevant, the technology are reviewed.",
      "<strong>Analysis:</strong> strengths, gaps and risks are identified.",
      "<strong>Report:</strong> you receive a written report with findings and suggested next steps.",
    ],
    after: [
      "Act on the findings, for example fix ownership gaps or file missing applications.",
      "Update the review before major deals or at regular intervals.",
    ],
    advantages: [
      "Clear view of the strength and value of your IP.",
      "Fewer surprises in deals and funding.",
      "Better decisions on what to protect, sell or license.",
    ],
  },
  "TM Watch": {
    authority: "the Trade Marks Registry and its published journal",
    law: "the Trade Marks Act, 1999",
    what: "A trademark watch keeps an eye on new trademark applications and publications, so you find out early if someone files a mark that is the same or confusingly similar to yours.",
    who: [
      "Owners of registered or pending trademarks who want to protect them.",
      "Businesses with a valuable brand that others may try to copy.",
    ],
    docs: [
      "Your trademark details: the mark, class and registration or application number.",
      "A list of similar names or variations you want us to watch for.",
    ],
    steps: [
      "<strong>Set up:</strong> we record your marks and the variations to watch.",
      "<strong>Monitoring:</strong> new filings and journal publications are checked on a regular basis.",
      "<strong>Alerts:</strong> you are told about any mark that may conflict with yours.",
      "<strong>Action:</strong> if needed, we guide you on a notice or an opposition within the time allowed.",
    ],
    after: [
      "An opposition against a published mark must be filed within the period set by the law, which is generally four months from publication.",
      "Keep your own marks renewed and in use.",
    ],
    advantages: [
      "Early warning about copycat filings.",
      "Time to oppose before a conflicting mark is registered.",
      "Helps keep your brand clear and valuable.",
    ],
  },
  Copyright: {
    authority: "the Copyright Office",
    law: "the Copyright Act, 1957",
    what: "Copyright protects original literary, dramatic, musical and artistic works, films, sound recordings and software. It arises automatically when the work is created; registration gives you an official record that helps prove ownership.",
    who: [
      "Authors, artists, photographers, musicians, filmmakers, software developers and publishers.",
      "Businesses that own or commission creative content, designs or software.",
      "The work must be original and fixed in some form.",
    ],
    docs: [
      "Identity and address proof of the applicant and the author.",
      "Copies of the work (or a specified portion, for software or very large works).",
      "A no-objection certificate from the author, where the applicant is not the author.",
      "Details of the work: title, language, year of creation, and publication status.",
    ],
    steps: [
      "<strong>Check:</strong> we confirm what can be registered and in whose name.",
      "<strong>Application:</strong> the application is prepared and filed to get a diary number.",
      "<strong>Waiting period:</strong> a period is kept open for any objection from others.",
      "<strong>Scrutiny:</strong> the Registrar examines it and may ask for clarifications, which we help answer.",
      "<strong>Registration:</strong> the entry is made in the Register of Copyrights and the certificate is issued.",
    ],
    after: [
      "Copyright in most works lasts for the author's life plus sixty years; other works have their own terms.",
      "Use the copyright notice on your work and keep proof of creation.",
      "Put assignments and licences in writing.",
    ],
    advantages: [
      "An official record of ownership of your work.",
      "Stronger evidence in a dispute or in a takedown request.",
      "Helps in licensing, sale or funding.",
    ],
  },
  Patent: {
    authority: "the Indian Patent Office (Controller General of Patents, Designs and Trade Marks)",
    law: "the Patents Act, 1970",
    what: "A patent gives the inventor the exclusive right to make, use and sell a new invention for a limited time, in return for disclosing it to the public.",
    who: [
      "Inventors, startups, research bodies and companies with a new invention that is not obvious and can be used in industry.",
      "Some things cannot be patented in India, such as mere discoveries, abstract ideas and certain software or business methods as such.",
      "The invention must not be publicly disclosed before filing, so keep it confidential until the application is filed.",
    ],
    docs: [
      "Identity and address proof of the applicant and the inventors; incorporation papers for a company.",
      "A description of the invention with drawings, examples and the claims you want protected.",
      "A declaration of inventorship and a proof of the right to apply (such as an assignment).",
      "Signed authorisation for our team to file for you.",
    ],
    steps: [
      "<strong>Search and assessment:</strong> a prior-art search to judge whether the invention is likely to be patentable.",
      "<strong>Drafting:</strong> the specification and claims are written carefully.",
      "<strong>Filing:</strong> a provisional or complete application is filed.",
      "<strong>Publication and examination:</strong> the application is published, and a request for examination starts the examination.",
      "<strong>Reply and grant:</strong> we answer the examination report, and if the objections are resolved, the patent is granted.",
    ],
    after: [
      "A patent lasts twenty years from the filing date, if renewal fees are paid every year.",
      "Others may oppose before or after grant within the periods set by the law.",
      "Patent rights are limited to the country, so consider filings abroad within the time allowed.",
    ],
    advantages: [
      "The exclusive right over your invention for the patent term.",
      "A valuable asset that can be licensed or sold.",
      "A stronger position with investors and partners.",
      "The right to stop others from copying the invention.",
    ],
  },
}

/** One-line meaning for each page, where it differs from the group text. */
const WHAT: Record<string, string> = {
  "Trademark Objection": "After you file, the Registry examines the application and may raise an objection (examination report), for example because the mark looks like an existing mark or is not distinctive. A written reply with supporting documents has to be filed within the time given in the report.",
  "Trademark Assignment": "Assignment is the transfer of ownership of a trademark from its owner to another person. It is done in writing and the change is recorded with the Trade Marks Registry.",
  "Trademark Rectification": "Rectification is an application to correct or remove an entry in the trademark register, for example when a mark was registered by mistake or has not been used.",
  "Intellectual Property Dispute": "IP disputes include infringement, passing off and cancellation of registrations. They are handled through notices, negotiation and, where needed, the Registry or the courts.",
  "Trademark Renewal": "A registered trademark is valid for ten years. It has to be renewed before the term ends to keep the protection, and a lapsed mark can be restored within the time the law allows.",
  "Trademark Classes Finder": "Trademarks are registered by class, using the international Nice classification of 45 classes (34 for goods and 11 for services). Choosing the right class decides what your registration protects.",
  "Trademark Hearing": "If an objection cannot be resolved on paper, the Registry may call a hearing, where the applicant or their representative explains why the mark should be accepted.",
  "Trademark Opposition": "Once a mark is published in the Trade Marks Journal, others can oppose it within the time allowed. An opposition can be filed against someone else's mark, or defended if your own mark is opposed.",
  "Trademark Search": "A trademark search checks the register for identical or similar marks, so you know the risk before you file or launch a brand.",
  "Brand Name Registration": "Registering your brand name as a trademark protects the name customers use to find you, for the goods or services you register it for.",
  "Logo Registration": "Registering your logo protects its design as a device mark, so others cannot use a copy or a confusingly similar logo.",
  "Wordmark Registration": "A wordmark protects the words or letters themselves, in any style or font, which gives wider protection than a particular logo design.",
  "IP Risk Assessment Reports": "An IP risk assessment reviews your brand names, logos, domains and creative work for gaps and for the risk of infringing someone else's rights.",
  "International Trademark Registration": "International registration lets you protect a trademark in several countries with one application through the Madrid system, based on an Indian application or registration.",
  "Design Registration Renewal": "A registered design lasts ten years and the term can be extended once by five years. The extension has to be applied for before the first term ends.",
  "Registration OF Geographical Indication (GI)": "Registration of a geographical indication protects the name of goods that are linked to a place, such as a craft, food or farm product, and lets authorised producers use it.",
  "GI Enforcement Service": "Enforcement means taking action against people who misuse a registered GI, through notices and legal proceedings under the GI Act.",
  "Patent Due Diligence": "Patent due diligence reviews a patent or application for validity, ownership, scope and risk, usually before an investment, acquisition or licence.",
  "IP Valuation Services": "IP valuation estimates the money value of your trademarks, patents, copyrights and other IP, for sale, licensing, funding or accounting.",
  "Trademark Watch Services": "A trademark watch monitors new applications and publications and alerts you to marks that are similar to yours, so you can act in time.",
  "Trademark Monitoring": "Trademark monitoring keeps track of new filings and, where possible, misuse of your brand in the market, and tells you when action may be needed.",
  "Copyright Disclaimer": "A disclaimer is a statement that you do not claim exclusive rights over a part of the work, for example material taken from the public domain or from another source. The Registrar may ask for one during registration.",
  "Copyright Objection": "During copyright registration a third party may object, or the Registrar may raise queries. A written reply with supporting proof is filed, and a hearing may follow.",
  "Copyright Assignment": "Assignment transfers copyright to another person. It must be in writing and should state the rights, the period and the territory; if these are not stated, the law assumes five years and India.",
  "Indian Patent Search": "A patent search looks through published patents and other documents to see whether your idea is new, and what already exists in your field.",
  "Patent Opposition": "A patent can be opposed before grant (after publication) or within the period allowed after grant. An opposition can be filed against someone else's patent or defended if your own is opposed.",
  "Patent Revocation": "Revocation is a legal action to cancel a granted patent on grounds set by the Patents Act, such as lack of novelty or wrongful grant.",
}

/** Steps that fit a specific service better than the group steps. */
const STEPS: Record<string, string[]> = {
  "Trademark Objection": ["<strong>Review:</strong> we read the examination report and the grounds raised.", "<strong>Strategy:</strong> we decide how to answer: arguments, proof of use, or changes to the application.", "<strong>Reply:</strong> a written reply with supporting documents is prepared and filed in time.", "<strong>Hearing, if called:</strong> we guide you for the hearing.", "<strong>Outcome:</strong> the mark is accepted for publication, or further steps are advised."],
  "Trademark Assignment": ["<strong>Review:</strong> we check who owns the mark and the registration status.", "<strong>Agreement:</strong> a written assignment deed is prepared.", "<strong>Recording:</strong> the change of ownership is applied for with the Registry.", "<strong>Confirmation:</strong> the register is updated with the new owner."],
  "Trademark Rectification": ["<strong>Review:</strong> we check the entry and the grounds for correction or removal.", "<strong>Application:</strong> the rectification application and supporting papers are filed.", "<strong>Proceedings:</strong> the other side may reply, and evidence and a hearing may follow.", "<strong>Order:</strong> the Registry decides and the register is updated."],
  "Intellectual Property Dispute": ["<strong>Facts and records:</strong> we collect the proof of your rights and of the other side's use.", "<strong>Notice:</strong> a legal notice or reply is prepared.", "<strong>Talks:</strong> settlement or a licence is explored where it makes sense.", "<strong>Proceedings:</strong> if needed, the matter is taken to the Registry or court with a lawyer."],
  "Trademark Renewal": ["<strong>Check:</strong> we confirm the expiry date and the status of the registration.", "<strong>Filing:</strong> the renewal application is prepared and filed before the term ends.", "<strong>Fee and follow-up:</strong> the renewal fee is paid and the file is tracked.", "<strong>Confirmation:</strong> the renewal is recorded and a reminder is set for the next term."],
  "Trademark Classes Finder": ["<strong>Describe:</strong> you tell us what you sell or offer.", "<strong>Match:</strong> we match it to the right class or classes of the Nice classification.", "<strong>Wording:</strong> we draft the description of goods or services for the application.", "<strong>Advice:</strong> we tell you if related classes should be added."],
  "Trademark Hearing": ["<strong>Notice:</strong> we read the hearing notice and the points raised.", "<strong>Preparation:</strong> arguments, case law and documents are prepared.", "<strong>Hearing:</strong> the case is put before the Registrar.", "<strong>Order:</strong> we explain the order and the next step."],
  "Trademark Opposition": ["<strong>Review:</strong> we check the published mark, or the opposition against your mark, and the time left.", "<strong>Filing:</strong> the notice of opposition or the counter-statement is prepared and filed.", "<strong>Evidence:</strong> evidence is filed by both sides in the stages set by the rules.", "<strong>Hearing and decision:</strong> the Registrar hears the matter and decides."],
  "Trademark Search": ["<strong>Details:</strong> you share the name or logo and the goods or services.", "<strong>Search:</strong> the register is searched for identical and similar marks, including similar sound and look.", "<strong>Report:</strong> you receive the results and our view of the risk.", "<strong>Advice:</strong> we tell you whether to go ahead, change the mark, or choose other classes."],
  "Design Registration Renewal": ["<strong>Check:</strong> we confirm the date of registration and the term left.", "<strong>Application:</strong> the extension application is prepared and filed in time.", "<strong>Fee and follow-up:</strong> the fee is paid and the file tracked.", "<strong>Confirmation:</strong> the extension is recorded."],
  "GI Enforcement Service": ["<strong>Evidence:</strong> we collect proof of the misuse.", "<strong>Notice:</strong> a legal notice is sent to the person using the name.", "<strong>Action:</strong> if the misuse continues, proceedings are started under the GI Act.", "<strong>Follow-up:</strong> we advise on keeping watch for repeat misuse."],
  "Copyright Disclaimer": ["<strong>Review:</strong> we check which parts of the work you do not claim.", "<strong>Statement:</strong> a clear disclaimer is prepared.", "<strong>Filing:</strong> it is submitted with the application or in reply to the Registrar's query.", "<strong>Outcome:</strong> registration continues with the disclaimer on record."],
  "Copyright Objection": ["<strong>Review:</strong> we read the objection or query and the time left.", "<strong>Reply:</strong> a written reply with proof of authorship and originality is prepared and filed.", "<strong>Hearing:</strong> if called, we guide you for it.", "<strong>Outcome:</strong> the Registrar decides whether to proceed with registration."],
  "Copyright Assignment": ["<strong>Review:</strong> we confirm who owns the rights.", "<strong>Deed:</strong> a written assignment stating the rights, period and territory is prepared.", "<strong>Signing:</strong> both sides sign it as the law requires.", "<strong>Recording:</strong> the assignment is recorded where it applies to a registered work."],
  "Indian Patent Search": ["<strong>Understand:</strong> we discuss your invention and the key features.", "<strong>Search:</strong> published patents and other documents are searched.", "<strong>Report:</strong> you receive the closest documents and our reading of them.", "<strong>Advice:</strong> we tell you whether to file, change the claims, or stop."],
  "Patent Opposition": ["<strong>Review:</strong> we check the patent or application, the grounds and the time left.", "<strong>Filing:</strong> the representation or notice of opposition is prepared and filed.", "<strong>Evidence and reply:</strong> the other side replies and evidence is exchanged.", "<strong>Hearing and decision:</strong> the Controller hears the matter and decides."],
  "Patent Revocation": ["<strong>Review:</strong> we check the patent and the grounds for revocation.", "<strong>Preparation:</strong> the petition and evidence are prepared with a patent lawyer.", "<strong>Filing:</strong> the petition is filed before the competent authority.", "<strong>Proceedings:</strong> the matter is heard and decided."],
  "Patent Due Diligence": ["<strong>Scope:</strong> we agree on the patents and the questions to answer.", "<strong>Review:</strong> ownership, status, scope and validity are checked.", "<strong>Analysis:</strong> risks and gaps are identified.", "<strong>Report:</strong> you receive a written report."],
  "IP Valuation Services": ["<strong>Scope:</strong> we agree on the assets and the purpose of the valuation.", "<strong>Information:</strong> we collect details about the IP, its use and income.", "<strong>Method:</strong> a suitable valuation method is applied.", "<strong>Report:</strong> you receive a written valuation report."],
  "IP Risk Assessment Reports": ["<strong>Scope:</strong> we list your brands, domains and creative work.", "<strong>Review:</strong> searches and checks are done for conflicts and gaps.", "<strong>Analysis:</strong> risks are rated.", "<strong>Report:</strong> you receive a written report with advice."],
}

/** Services that work on something already filed or registered: different papers are needed. */
const POST_FILING = new Set([
  "Trademark Objection", "Trademark Assignment", "Trademark Rectification", "Trademark Renewal", "Trademark Hearing",
  "Trademark Opposition", "Design Registration Renewal", "GI Enforcement Service", "Copyright Disclaimer",
  "Copyright Objection", "Copyright Assignment", "Patent Opposition", "Patent Revocation", "Intellectual Property Dispute",
])
const POST_FILING_DOCS = [
  "Identity and address proof of the owner or applicant.",
  "The application or registration number and the certificate or filing receipt.",
  "Any notice, report, hearing letter or opposition received.",
  "The proof of use or of ownership, where relevant.",
  "Signed authorisation for our team to act for you.",
]

/** Authority of the country page, when it is a country trademark page. */
const COUNTRY_OFFICE: Record<string, string> = {
  USA: "the United States Patent and Trademark Office (USPTO)",
  UK: "the UK Intellectual Property Office (UKIPO)",
  Singapore: "the Intellectual Property Office of Singapore (IPOS)",
  Japan: "the Japan Patent Office (JPO)",
  France: "the French National Institute of Industrial Property (INPI)",
  Germany: "the German Patent and Trade Mark Office (DPMA)",
  Luxembourg: "the Benelux Office for Intellectual Property (BOIP)",
  Indonesia: "the Directorate General of Intellectual Property of Indonesia",
  Poland: "the Patent Office of the Republic of Poland",
  Dubai: "the UAE Ministry of Economy",
  Mauritius: "the Industrial Property Office of Mauritius",
  "Sri Lanka": "the National Intellectual Property Office of Sri Lanka",
  Egypt: "the trademark office of Egypt",
}

function country(title: string) {
  const m = /^(?:Trademark Registration (.+)|(.+) Trademark Registration)$/.exec(title)
  const name = (m?.[1] ?? m?.[2] ?? "").trim()
  return COUNTRY_OFFICE[name] ? name : ""
}

export function buildIpContent(category: string, title: string): Content {
  const p = PROFILES[category]
  const c = category === "International TM" ? country(title) : ""
  const office = c ? COUNTRY_OFFICE[c] : p.authority

  const what =
    WHAT[title] ??
    (c
      ? `Registering your trademark in ${c} gives you protection for your brand in that country, under its own trademark law.`
      : p.what)

  const overview = `<p>${what}</p><p>This is governed by ${p.law}, and the application is handled by ${office}. Fees, forms and time limits are set by them and can change, so we check the current position for your case before we start.</p>`

  const summary = `${title}: what it means, who can apply, the documents needed and how the process works.`

  return {
    summary,
    highlights: ["Eligibility check before you file", "Document review by our team", "Application preparation and filing", "Support until the work is complete"],
    sections: [
      sec("overview", overview),
      sec("advantages", li(p.advantages)),
      sec("eligibility", li(p.who)),
      sec("documents", `${li(POST_FILING.has(title) ? POST_FILING_DOCS : p.docs)}<p>The exact list depends on your case. We confirm it after a short discussion.</p>`),
      sec("process", ol(STEPS[title] ?? p.steps)),
      sec("features", `<p>Points to remember:</p>${li(p.after)}`),
      sec(
        "why-us",
        li([
          "<strong>Clear guidance:</strong> we explain each step in plain words.",
          "<strong>Careful drafting:</strong> applications and replies are prepared and checked before they are filed.",
          "<strong>One point of contact:</strong> ask your questions in one place.",
          "<strong>After the filing:</strong> we tell you about deadlines, renewals and what to watch for.",
        ]),
      ),
    ],
    faqs: [
      { q: `Who can apply for ${title}?`, a: "It depends on the conditions in the law for this service. Share your details and we will confirm whether you qualify and how to proceed." },
      { q: "Which documents are required?", a: "Usually identity and address proof of the applicant and the details of the mark, work or invention. The exact list depends on your case, and we confirm it before you file." },
      { q: "How long does it take?", a: "The time depends on how complete your papers are, any objections, and how quickly the office processes the file. After reviewing your details we can give you a realistic estimate." },
      { q: "What will Aeon do for me?", a: "We check eligibility, prepare and file the application, respond to objections, track the file and tell you about the deadlines that follow." },
    ],
    seoTitle: `${title} in India`.slice(0, 70),
    seoDescription: summary.slice(0, 170),
  }
}
