import Link from "next/link"
import { JsonLd } from "@/components/site/json-ld"
import { LegalLayout, type LegalSection } from "@/components/site/legal-layout"
import { LEGAL } from "@/lib/legal"
import { breadcrumbLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description:
    "The terms that apply when you use the Aeon Corporate website and our business registration, compliance and advisory services.",
  path: "/terms-and-conditions",
})

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Accepting these terms",
    body: (
      <p>
        By using this website or asking us for a service, you agree to these
        Terms &amp; Conditions and our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>. If you do not agree,
        please do not use the website. If you use it for a business, you confirm
        you have authority to bind that business.
      </p>
    ),
  },
  {
    id: "what-we-do",
    title: "What we do (and do not do)",
    body: (
      <>
        <p>
          {LEGAL.companyName} is a private advisory and facilitation service that
          helps with business registration, licensing, tax, intellectual
          property, regulatory and environmental compliance.
        </p>
        <ul>
          <li>
            We are <strong>not</strong> a government body and are not affiliated
            with any government authority.
          </li>
          <li>
            Content on the website is general information, not legal, tax or
            financial advice for your specific situation.
          </li>
          <li>
            Approvals, registrations and licences are granted by the relevant
            authorities. We do not control their decisions or timelines, and we
            cannot guarantee any outcome.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "your-responsibilities",
    title: "Your responsibilities",
    body: (
      <ul>
        <li>Give us accurate, complete and up-to-date information and documents.</li>
        <li>Respond to requests promptly so work is not delayed.</li>
        <li>Use only genuine documents and have the right to share them with us.</li>
        <li>Keep any login details we give you confidential.</li>
      </ul>
    ),
  },
  {
    id: "fees",
    title: "Fees, payments and refunds",
    body: (
      <p>
        Fees are as quoted or agreed in writing for each service. Government
        fees, stamp duty and third-party charges are separate unless we say
        otherwise. Work begins once the agreed formalities are complete. Any
        refund depends on the stage of work and what the authorities have already
        processed, and is described in your service agreement or our refund terms.
      </p>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party professionals and links",
    body: (
      <p>
        Some services are delivered by in-house professionals or independent
        accounting, law or technical firms. Those firms are responsible for their
        own professional work. The website may link to other sites; we are not
        responsible for their content or privacy practices.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <ul>
        <li>Do not misuse the website, probe its security or try to access admin areas.</li>
        <li>Do not submit false, misleading or unlawful information.</li>
        <li>Do not copy or republish our content without written permission.</li>
        <li>Do not send spam or harmful code through our forms.</li>
      </ul>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <p>
        The website&apos;s text, design, logos and illustrations belong to{" "}
        {LEGAL.companyName} or its licensors and are protected by law. You may
        view and share pages for personal or internal business use, but you may
        not reproduce or sell them. Your own documents and information stay yours.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limits on our liability",
    body: (
      <>
        <p>
          We take care with our work, but to the extent the law allows, we are not
          liable for indirect or consequential loss, delays caused by
          authorities, or outcomes that depend on information you did not give us
          accurately.
        </p>
        <p>
          Our total liability for any claim connected with a service is limited to
          the fees you paid us for that service. Nothing here limits liability
          that the law does not allow us to limit.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Your personal data",
    body: (
      <p>
        We handle personal data as described in our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>, in line with the
        Digital Personal Data Protection Act, 2023. You can withdraw consent or
        ask us to correct or erase your data at any time.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to the website and these terms",
    body: (
      <p>
        We may change the website, our services or these terms from time to time.
        The date at the top shows the current version. Continuing to use the
        website after a change means you accept the updated terms.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and contact",
    body: (
      <>
        <p>
          These terms are governed by the laws of India. Courts at{" "}
          {LEGAL.jurisdictionCity} have jurisdiction, subject to any dispute
          resolution method agreed in your service agreement.
        </p>
        <p>
          Questions? Email{" "}
          <a href="mailto:hello@aeoncorporate.com">hello@aeoncorporate.com</a> or
          write to {LEGAL.address}.
        </p>
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms-and-conditions" },
        ])}
      />
      <LegalLayout
        current="terms"
        eyebrow="LEGAL"
        title="Terms & Conditions"
        intro="Please read these terms before using the Aeon Corporate website or our services. They explain what we do, what we expect from you, and how we limit our responsibility."
        sections={sections}
      />
    </>
  )
}
