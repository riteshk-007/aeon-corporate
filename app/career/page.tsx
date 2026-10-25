import { CareerContent } from "@/components/pages/career-content"
import { JsonLd } from "@/components/site/json-ld"
import { breadcrumbLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Careers: Open Positions",
  description:
    "Explore current openings at Aeon Corporate across compliance, IP and trademark, business development and content. Apply online and grow your career with us.",
  path: "/career",
  image: "/illustrations/story-process.jpg",
  keywords: [
    "Aeon Corporate careers",
    "compliance jobs",
    "trademark executive jobs",
    "business development jobs",
  ],
})

export default function CareerPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work at Aeon", path: "/work-at-aeon" },
          { name: "Careers", path: "/career" },
        ])}
      />
      <CareerContent />
    </>
  )
}
