import type { ServiceInput } from "@/lib/services"

type Page = Omit<ServiceInput, "heroImageUrl" | "icon"> & { slug: string; icon?: string; autoContent?: boolean }
const sec = (key: ServiceInput["sections"][number]["key"], html: string) => ({ key, html })

/**
 * Hand-written IP pages (general information: no fees, no promised timelines).
 * They should be checked by an IP professional and then edited in the admin panel.
 */
export const IP_WRITTEN: Page[] = [
  {
    slug: "trademark-registration",
    title: "Trademark Registration",
    category: "Trademarks India",
    icon: "badge",
    summary: "Protect your brand name, logo or slogan by registering it as a trademark in India, and get the exclusive right to use it for your goods or services.",
    highlights: ["Trademark search before you file", "Right class selection for your goods or services", "Application filing and tracking", "Help with objections and hearings"],
    sections: [
      sec("overview", `<p>A <strong>trademark</strong> is a word, name, logo, slogan, shape or other sign that tells customers who a product or service comes from. In India, trademarks are registered under the <strong>Trade Marks Act, 1999</strong> with the Trade Marks Registry.</p><p>Registration is not compulsory, but it gives you the exclusive right to use the mark for the goods or services you register it for, and the right to take legal action if someone copies it. Without registration you can still rely on a common-law claim of passing off, but it is harder to prove.</p>`),
      sec("advantages", `<ul><li><strong>Exclusive right:</strong> only you can use the registered mark for those goods or services.</li><li><strong>Legal protection:</strong> you can act against copying and misleading use.</li><li><strong>Business asset:</strong> a registered mark can be sold, licensed or franchised.</li><li><strong>Customer trust:</strong> a registered brand looks more reliable to customers, banks and investors.</li><li><strong>Use of the ® symbol</strong> once the mark is registered.</li></ul>`),
      sec("eligibility", `<ul><li>Any individual, proprietor, partnership, company, LLP, trust or society can apply.</li><li>The mark should be <strong>distinctive</strong>. Names that only describe the product, or that are common or against the law, can be refused.</li><li>The mark should not be identical or confusingly similar to an earlier mark for similar goods or services.</li><li>The mark can already be in use, or you can apply on a "proposed to be used" basis.</li><li>Protection is given class by class, so every class you need has to be covered.</li></ul>`),
      sec("documents", `<ul><li>Identity and address proof of the applicant; for a company or LLP, the incorporation certificate.</li><li>The brand name, or the logo in a clear image file.</li><li>The list of goods or services, and the class for each.</li><li>The date the mark was first used, if it is already in use, with a proof of use.</li><li>Signed authorisation for our team to file on your behalf (Form TM-48).</li><li>Startup or MSME certificate, if you are claiming any fee concession that applies to you.</li></ul>`),
      sec("process", `<ol><li><strong>Trademark search:</strong> we check the register for identical or similar marks.</li><li><strong>Class selection:</strong> we choose the right class or classes for your goods or services.</li><li><strong>Filing:</strong> the application is prepared and filed with the Registry.</li><li><strong>Examination:</strong> the Registry examines the application. If it raises an objection, a reply is filed and a hearing may follow.</li><li><strong>Publication:</strong> the accepted mark is published in the Trade Marks Journal, and others get time to oppose it.</li><li><strong>Registration:</strong> if there is no opposition, or the opposition fails, the registration certificate is issued.</li></ol>`),
      sec("features", `<ul><li>A registered trademark is valid for <strong>ten years</strong> from the date of application and can be renewed for further periods of ten years.</li><li>Use <strong>TM</strong> while the application is pending and <strong>®</strong> only after registration.</li><li>Keep using the mark; a mark that is not used for a long period can be removed from the register.</li><li>Watch for similar marks that others file, and oppose them in time.</li><li>Tell the Registry when you change address or transfer the mark.</li></ul>`),
      sec("types", `<table><thead><tr><th>Type of mark</th><th>What it protects</th><th>Example</th></tr></thead><tbody><tr><td>Wordmark</td><td>The words or letters themselves, in any style</td><td>A brand name</td></tr><tr><td>Logo (device mark)</td><td>The design or picture</td><td>A symbol or monogram</td></tr><tr><td>Combined mark</td><td>Words and logo together</td><td>A name with its logo</td></tr><tr><td>Slogan</td><td>A tagline, if distinctive</td><td>An advertising line</td></tr><tr><td>Shape, colour, sound</td><td>Non-traditional marks that are distinctive</td><td>A bottle shape</td></tr><tr><td>Collective / certification mark</td><td>A mark used by a group or to certify quality</td><td>A quality mark</td></tr></tbody></table>`),
      sec("why-us", `<ul><li><strong>Search first:</strong> we tell you the risk before you spend on the brand.</li><li><strong>Correct classes:</strong> a wrong class can leave your goods unprotected, so we choose carefully.</li><li><strong>Objections and hearings:</strong> we prepare the replies and guide you for the hearing.</li><li><strong>Deadlines:</strong> we keep track of the dates for opposition and renewal.</li></ul>`),
    ],
    faqs: [
      { q: "Is trademark registration compulsory?", a: "No, but registration gives you a much stronger legal position and the right to use the ® symbol." },
      { q: "How long does a trademark last?", a: "A registered trademark is valid for ten years from the date of application and can be renewed for further periods of ten years." },
      { q: "Can I use ® as soon as I apply?", a: "No. Use TM while the application is pending and ® only once the mark is registered." },
      { q: "Can I register my logo and my name separately?", a: "Yes. A wordmark protects the name in any style; a logo mark protects the design. Many brands register both." },
      { q: "What if the Registry raises an objection?", a: "A reply with arguments and documents is filed within the time given, and a hearing may follow. We help with both." },
    ],
    seoTitle: "Trademark Registration in India",
    seoDescription: "How trademark registration works in India: eligibility, documents, the step-by-step process and what to do after registration.",
    isPublished: true,
  },
  {
    slug: "patent-registration",
    title: "Patent Registration",
    category: "Patent",
    icon: "lightbulb",
    summary: "Protect a new invention by applying for a patent in India. A patent gives you the exclusive right over the invention for a limited time.",
    highlights: ["Prior-art search and assessment", "Careful drafting of the specification and claims", "Filing and tracking at the Patent Office", "Replies to examination reports"],
    sections: [
      sec("overview", `<p>A <strong>patent</strong> is a legal right given to the inventor to stop others from making, using, selling or importing a patented invention without permission. In India, patents are granted under the <strong>Patents Act, 1970</strong> by the Indian Patent Office.</p><p>In return for this right, the inventor has to describe the invention fully, so that the public can use it freely after the patent ends.</p>`),
      sec("advantages", `<ul><li><strong>Exclusive right</strong> over the invention for the patent term.</li><li><strong>Valuable asset:</strong> a patent can be licensed, sold or used to attract investors.</li><li><strong>Stronger market position:</strong> competitors cannot copy the protected invention.</li><li><strong>Recognition</strong> of the inventor and the company as an innovator.</li></ul>`),
      sec("eligibility", `<p>An invention can be patented if it is:</p><ul><li><strong>New</strong> (not public anywhere before the filing date).</li><li><strong>Inventive</strong> (not obvious to a person skilled in that field).</li><li><strong>Capable of industrial application.</strong></li></ul><p>Some things cannot be patented in India, such as discoveries, abstract ideas, mathematical or business methods, and certain computer programs as such. We check your invention against these rules. Do not publish or sell the invention before filing.</p>`),
      sec("documents", `<ul><li>Identity and address proof of the applicant and the inventors; incorporation papers for a company.</li><li>A description of the invention with drawings, examples and the claims to be protected.</li><li>Declaration of inventorship, and proof of the right to apply (for example an assignment from the inventor).</li><li>If a priority is claimed from an earlier foreign application, the details and a certified copy.</li><li>Signed authorisation for our team to file on your behalf.</li></ul>`),
      sec("process", `<ol><li><strong>Search and assessment:</strong> a prior-art search to judge whether the invention is likely to be patentable.</li><li><strong>Drafting:</strong> the specification and claims are written with care, because they decide the scope of protection.</li><li><strong>Filing:</strong> a provisional application (to secure an early date) or a complete application is filed.</li><li><strong>Publication:</strong> the application is published, normally after eighteen months from the filing or priority date.</li><li><strong>Request for examination:</strong> the applicant must request examination within the time allowed by the rules.</li><li><strong>Examination and reply:</strong> the examiner issues a report; we help you reply and, if needed, attend a hearing.</li><li><strong>Grant:</strong> when the objections are resolved, the patent is granted.</li></ol>`),
      sec("features", `<ul><li>A patent lasts <strong>twenty years</strong> from the filing date, if the renewal fee is paid every year.</li><li>Others can oppose the application before grant, or the patent within one year after grant is published.</li><li>Patent rights are limited to the country. To protect the invention abroad, file in other countries or through the PCT route within the time allowed.</li><li>A granted patent can be assigned or licensed in writing.</li></ul>`),
      sec("types", `<table><thead><tr><th>Type of application</th><th>When it is used</th></tr></thead><tbody><tr><td>Provisional</td><td>To secure an early filing date while the invention is still being developed. A complete specification must follow within the time allowed.</td></tr><tr><td>Complete (ordinary)</td><td>The full application with the claims, ready for examination.</td></tr><tr><td>Convention</td><td>Claims priority from an earlier application filed in another country.</td></tr><tr><td>PCT national phase</td><td>Enters India after an international application under the Patent Cooperation Treaty.</td></tr><tr><td>Patent of addition</td><td>Protects an improvement of an invention that already has a patent or application.</td></tr></tbody></table>`),
      sec("why-us", `<ul><li><strong>Honest assessment:</strong> we tell you early if the invention is unlikely to be patentable.</li><li><strong>Careful claims:</strong> the claims decide how strong the patent is, so they are drafted and reviewed with care.</li><li><strong>Deadlines:</strong> we track examination, reply and renewal dates.</li></ul>`),
    ],
    faqs: [
      { q: "How long does a patent last?", a: "Twenty years from the filing date, provided the renewal fee is paid every year." },
      { q: "Can I patent my idea?", a: "A patent protects an invention that is new, inventive and capable of industrial application, not a mere idea. We assess your case first." },
      { q: "Should I disclose my invention before filing?", a: "No. Public disclosure before the filing date can make the invention unpatentable. Keep it confidential until you file." },
      { q: "Is my patent valid in other countries?", a: "No. A patent is limited to the country that grants it. Filing abroad has to be done within the time allowed." },
    ],
    seoTitle: "Patent Registration in India",
    seoDescription: "How to get a patent in India: eligibility, documents, the step-by-step process, term and what to do after filing.",
    isPublished: true,
  },
  {
    slug: "copyright-registration",
    title: "Copyright Registration",
    category: "Copyright",
    icon: "file-check",
    summary: "Register your creative work with the Copyright Office to get an official record of ownership that helps in any dispute.",
    highlights: ["Check of what can be registered", "Application preparation and filing", "Replies to objections or queries", "Certificate of registration"],
    sections: [
      sec("overview", `<p><strong>Copyright</strong> protects original literary, dramatic, musical and artistic works, cinematograph films, sound recordings and computer software, under the <strong>Copyright Act, 1957</strong>.</p><p>Copyright comes into existence automatically when the work is created. Registration is optional, but it gives you an official entry in the Register of Copyrights, which is strong evidence of ownership if the work is copied.</p>`),
      sec("advantages", `<ul><li>An <strong>official record</strong> of your authorship and ownership.</li><li><strong>Evidence</strong> in a dispute, and a help when asking platforms to remove copied content.</li><li>Makes <strong>licensing or selling</strong> the work easier.</li><li>Adds value to your business and to funding discussions.</li></ul>`),
      sec("eligibility", `<ul><li>The work must be <strong>original</strong> and made by the author's own skill and effort.</li><li>The author, the owner, a person who has been assigned the rights, or a licensee can apply.</li><li>Ideas, facts and names cannot be copyrighted, only the way they are expressed.</li><li>Works of any category can be registered: books, articles, music, artwork, photographs, films, software and more.</li></ul>`),
      sec("documents", `<ul><li>Identity and address proof of the applicant and the author.</li><li>Copies of the work. For software or very large works, a specified part is enough.</li><li>A no-objection certificate (NOC) from the author, if the applicant is not the author.</li><li>Details of the work: title, language, year of creation and publication status.</li><li>For a company, its incorporation papers and an authorisation to file.</li></ul>`),
      sec("process", `<ol><li><strong>Check:</strong> we confirm the category of the work and who should apply.</li><li><strong>Application:</strong> the application is prepared and filed, and a diary number is issued.</li><li><strong>Waiting period:</strong> a period is kept open so that anyone with an objection can raise it.</li><li><strong>Examination:</strong> the Registrar scrutinises the file and may ask for clarifications, which we help answer.</li><li><strong>Registration:</strong> the work is entered in the Register of Copyrights and the certificate is issued.</li></ol>`),
      sec("features", `<ul><li>For literary, dramatic, musical and artistic works, copyright lasts for the author's lifetime plus <strong>sixty years</strong>. Other works, such as films and sound recordings, have their own term counted from publication.</li><li>Put any assignment or licence in writing, stating the rights, the period and the territory.</li><li>Keep proof of creation, such as drafts and dates.</li><li>Use a copyright notice on the work.</li></ul>`),
      sec("why-us", `<ul><li><strong>Right category:</strong> we pick the correct class of work and applicant.</li><li><strong>Clean paperwork:</strong> we check forms, NOCs and copies before filing.</li><li><strong>Objections:</strong> we prepare replies if the Registrar or a third party raises any.</li></ul>`),
    ],
    faqs: [
      { q: "Is copyright registration compulsory?", a: "No. Copyright exists once the work is created. Registration gives an official record that is helpful as evidence." },
      { q: "Can I register software?", a: "Yes. Computer programs are protected as literary works, and a specified part of the source code is usually enough for registration." },
      { q: "Can I copyright a name or an idea?", a: "No. Copyright protects the expression of a work, not ideas, facts or names. A brand name is better protected as a trademark." },
    ],
    seoTitle: "Copyright Registration in India",
    seoDescription: "How to register copyright in India: what can be registered, documents, the process and how long copyright lasts.",
    isPublished: true,
  },
]
