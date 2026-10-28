import { PartnerContent } from "@/components/pages/partner-content"
import { JsonLd } from "@/components/site/json-ld"
import { breadcrumbLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Partner With Us: Grow Your Business and Brand",
  description:
    "Partner with Aeon Corporate. Advocates, CAs, company secretaries, tax experts and investors can join us to set up or scale businesses with industry experts.",
  path: "/partner-with-us",
  image: "/illustrations/about-team.jpg",
  keywords: [
    "partner with Aeon Corporate",
    "CA partnership",
    "company secretary partner",
    "business consultant partnership India",
  ],
})

export default function PartnerPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Partner With Us", path: "/partner-with-us" },
        ])}
      />
      <PartnerContent />
    </>
  )
}
