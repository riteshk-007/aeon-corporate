import { ContactContent } from "@/components/pages/contact-content"
import { JsonLd } from "@/components/site/json-ld"
import { SITE_NAME, SITE_URL, breadcrumbLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Contact Us: Talk to Compliance & Business Experts",
  description:
    "Get in touch with Aeon Corporate for business registration, compliance, tax filing and regulatory support. Send a message or call our team.",
  path: "/contact-us",
  keywords: [
    "contact Aeon Corporate",
    "business consultant India",
    "compliance consultation",
  ],
})

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Contact Us", path: "/contact-us" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: `Contact ${SITE_NAME}`,
            url: `${SITE_URL}/contact-us`,
          },
        ]}
      />
      <ContactContent />
    </>
  )
}
