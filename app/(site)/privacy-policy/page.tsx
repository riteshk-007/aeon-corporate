import Link from "next/link"
import { JsonLd } from "@/components/site/json-ld"
import { LegalLayout, type LegalSection } from "@/components/site/legal-layout"
import { LEGAL, RETENTION_DAYS, retentionLabel } from "@/lib/legal"
import { breadcrumbLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Aeon Corporate collects, uses, stores and protects your personal data under India's Digital Personal Data Protection Act, 2023, and how you can exercise your rights.",
  path: "/privacy-policy",
})

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          <strong>{LEGAL.companyName}</strong> (&quot;Aeon&quot;, &quot;we&quot;,
          &quot;us&quot;) runs this website and decides why and how your
          personal data is used. Under India&apos;s Digital Personal Data
          Protection Act, 2023 (&quot;DPDP Act&quot;) we are the{" "}
          <strong>Data Fiduciary</strong>, and you are the{" "}
          <strong>Data Principal</strong>.
        </p>
        <p>
          Registered office: {LEGAL.address}. Privacy contact:{" "}
          <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
        </p>
      </>
    ),
  },
  {
    id: "data-we-collect",
    title: "Personal data we collect",
    body: (
      <>
        <p>We only ask for what we need for the request you make:</p>
        <ul>
          <li>
            <strong>Contact and consultation forms:</strong> name, email, mobile
            number, state, and the message you write.
          </li>
          <li>
            <strong>Partner enquiries:</strong> the above plus your occupation.
          </li>
          <li>
            <strong>Job applications:</strong> name, email, mobile number,
            experience, the role, and the cover note or resume link you share.
          </li>
          <li>
            <strong>Newsletter:</strong> your email address.
          </li>
          <li>
            <strong>Consent record:</strong> the time you agreed, the version of
            this policy and our Terms you agreed to, the page you used, and a
            one-way scrambled (hashed) form of your IP address. We do not store
            your raw IP address with your enquiry.
          </li>
          <li>
            <strong>Our staff (admin panel):</strong> name, work email, role, and
            sign-in activity (time and IP address) to keep the system secure.
          </li>
        </ul>
        <p>
          Please do not send us sensitive information such as passwords, bank
          card numbers or government ID numbers through the website forms. If a
          service needs documents, we will tell you the safe way to share them.
        </p>
      </>
    ),
  },
  {
    id: "why-we-use-it",
    title: "Why we use your data",
    body: (
      <>
        <p>
          We use your data <strong>only for the purpose you gave it for</strong>,
          and only after you tick the consent box on the form:
        </p>
        <ul>
          <li>To reply to your enquiry and arrange a consultation.</li>
          <li>To assess a partnership request.</li>
          <li>To consider your job application and contact you about it.</li>
          <li>
            To send compliance updates and insights, <strong>only</strong> if you
            separately opt in to the newsletter or tick the optional updates box.
          </li>
          <li>To keep the website and admin system secure and to prevent abuse.</li>
        </ul>
        <p>
          We do not sell your data and we do not use it for any other purpose
          without asking you again.
        </p>
      </>
    ),
  },
  {
    id: "consent",
    title: "Your consent and withdrawing it",
    body: (
      <>
        <p>
          Our forms use an unticked checkbox that you must tick yourself. The
          wording tells you what we will do with your data. Optional things, like
          newsletters, have their own separate, optional checkbox. Saying no to
          optional things never affects your enquiry.
        </p>
        <p>
          You can withdraw consent at any time by writing to{" "}
          <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
          Withdrawal is as easy as giving consent. After withdrawal we stop using
          your data and delete it, unless the law requires us to keep it. This
          does not affect what we did lawfully before you withdrew.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>Your data is shared only as far as needed, with:</p>
        <ul>
          <li>
            <strong>Our service providers (processors)</strong> such as hosting,
            database and email delivery providers, who may handle data only on our
            instructions and under confidentiality duties.
          </li>
          <li>
            <strong>Professionals who deliver your service</strong> (for example
            chartered accountants, company secretaries or lawyers), when you ask
            us to take on a matter.
          </li>
          <li>
            <strong>Authorities or courts</strong> where the law requires it.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <p>We keep personal data only as long as needed for its purpose:</p>
        <ul>
          <li>Contact and partner enquiries: {retentionLabel(RETENTION_DAYS.contact)}.</li>
          <li>Job applications: {retentionLabel(RETENTION_DAYS.career)}.</li>
          <li>
            Newsletter email: until you unsubscribe, or {retentionLabel(RETENTION_DAYS.newsletter)}.
          </li>
          <li>Admin activity log: up to {retentionLabel(RETENTION_DAYS.auditLog)}, and in any case only the latest 500 entries.</li>
        </ul>
        <p>
          After that, the data is deleted automatically. If you become a client,
          records connected to your service are kept for the period the law
          requires, and are covered by your service agreement.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <>
        <ul>
          <li>Encryption in transit (HTTPS) for the website and admin panel.</li>
          <li>
            Admin accounts use strong passwords stored as one-way hashes, lock
            after repeated failed sign-ins, and each person sees only the pages
            their role allows.
          </li>
          <li>
            Opening a person&apos;s enquiry details and deleting data is recorded
            in an audit log.
          </li>
          <li>Personal data is not published and is not placed in public code.</li>
        </ul>
        <p>
          If a personal data breach affects you, we will inform you and the Data
          Protection Board of India as required by law.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights as a Data Principal",
    body: (
      <>
        <p>Under the DPDP Act you can ask us to:</p>
        <ul>
          <li>
            <strong>Access:</strong> give you a summary of the personal data we
            hold about you and how we use it.
          </li>
          <li>
            <strong>Correct or update:</strong> fix inaccurate or incomplete data.
          </li>
          <li>
            <strong>Erase:</strong> delete your data when it is no longer needed
            or you withdraw consent.
          </li>
          <li>
            <strong>Grievance redressal:</strong> answer a complaint about how we
            handle your data.
          </li>
          <li>
            <strong>Nominate:</strong> name someone who can exercise these rights
            for you if you die or cannot act yourself.
          </li>
        </ul>
        <p>
          Email <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>{" "}
          from the address you used with us so we can verify it is you. We reply
          within a reasonable time and aim for 30 days.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        This website is for adults and businesses. We do not knowingly collect
        data from anyone under 18. If you are under 18, a parent or legal
        guardian must give verifiable consent and contact us for you. If we learn
        we hold a child&apos;s data without that consent, we delete it.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        The public website does not use advertising or tracking cookies. The admin
        panel uses one essential, secure cookie to keep our staff signed in. If we
        add analytics later, we will ask for your consent first and update this
        policy.
      </p>
    ),
  },
  {
    id: "transfers",
    title: "Where your data is stored",
    body: (
      <p>
        Your data is stored on servers provided by our hosting and database
        partners. We only transfer data outside India where the DPDP Act and
        government notifications allow it, and we choose partners that protect it
        with appropriate safeguards.
      </p>
    ),
  },
  {
    id: "grievance",
    title: "Grievance Officer and complaints",
    body: (
      <>
        <p>If you have a privacy concern, please contact our Grievance Officer first:</p>
        <ul>
          <li>Name: {LEGAL.grievanceOfficer.name}</li>
          <li>
            Email:{" "}
            <a href={`mailto:${LEGAL.grievanceOfficer.email}`}>{LEGAL.grievanceOfficer.email}</a>
          </li>
          <li>Phone: {LEGAL.grievanceOfficer.phone}</li>
          <li>{LEGAL.grievanceOfficer.responseTime}</li>
        </ul>
        <p>
          If you are not satisfied with our response, you may complain to the{" "}
          <strong>Data Protection Board of India</strong>.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy. The date at the top shows the latest version.
        If a change affects how we use data you already gave us, we will ask for
        your consent again. Read our{" "}
        <Link href="/terms-and-conditions">Terms &amp; Conditions</Link> too.
      </p>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />
      <LegalLayout
        current="privacy"
        eyebrow="PRIVACY"
        title="Privacy Policy"
        intro="We respect your privacy. This page explains in plain language what personal data we collect, why, how long we keep it, and the rights you have under India's Digital Personal Data Protection Act, 2023."
        sections={sections}
      />
    </>
  )
}
