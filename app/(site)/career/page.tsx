import { CareerContent, type PublicJob } from "@/components/pages/career-content"
import { JsonLd } from "@/components/site/json-ld"
import { db } from "@/lib/db"
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

// Openings come from the admin panel, so this page is rendered per request.
export const dynamic = "force-dynamic"

async function loadJobs(): Promise<PublicJob[]> {
  if (!process.env.DATABASE_URL) return []
  try {
    const jobs = await db.job.findMany({
      where: { isOpen: true },
      orderBy: { createdAt: "desc" },
    })
    return jobs.map((j) => ({
      id: j.id,
      icon: j.icon,
      title: j.title,
      openings: j.openings,
      location: j.location,
      type: j.type,
      skills: j.skills,
      summary: j.summary,
      descriptionHtml: j.descriptionHtml,
    }))
  } catch (error) {
    console.error("[career] could not load jobs", error)
    return []
  }
}

export default async function CareerPage() {
  const openings = await loadJobs()
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work at Aeon", path: "/work-at-aeon" },
          { name: "Careers", path: "/career" },
        ])}
      />
      <CareerContent openings={openings} />
    </>
  )
}
