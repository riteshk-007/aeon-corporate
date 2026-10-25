import { AboutContent } from "@/components/about/about-content"
import { JsonLd } from "@/components/site/json-ld"
import { breadcrumbLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "About Us: A Technology-Enabled Business Partner",
  description:
    "Aeon Corporate is a technology-enabled partner for registrations, licensing, tax, intellectual property, regulatory and environmental compliance.",
  path: "/about",
  image: "/illustrations/about-team.jpg",
  keywords: ["about Aeon Corporate", "business compliance partner India"],
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
