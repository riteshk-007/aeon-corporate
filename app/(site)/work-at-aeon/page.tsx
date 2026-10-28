import { WorkContent } from "@/components/pages/work-content"
import { JsonLd } from "@/components/site/json-ld"
import { breadcrumbLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Work at Aeon: Culture, Learning & Benefits",
  description:
    "Discover life at Aeon Corporate: an inclusive culture, continuous learning, community exposure and benefits that help you grow your career.",
  path: "/work-at-aeon",
  image: "/illustrations/story-process.jpg",
  keywords: [
    "work at Aeon Corporate",
    "company culture",
    "jobs in compliance consulting",
  ],
})

export default function WorkPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work at Aeon", path: "/work-at-aeon" },
        ])}
      />
      <WorkContent />
    </>
  )
}
