import { AboutContent } from "@/components/about/about-content"
import { JsonLd } from "@/components/site/json-ld"
import { breadcrumbLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "About Us: Corporate and Business Advisors",
  description:
    "Aeon Corporate is an AI and tech-enabled corporate and business advisory platform for legal, regulatory, compliance and finance support, led by Dev Kumar Panda.",
  path: "/about",
  image: "/illustrations/about-team.jpg",
  keywords: ["about Aeon Corporate", "corporate and business advisors India", "Dev Kumar Panda"],
})

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
        ])}
      />
      <AboutContent />
    </>
  )
}
