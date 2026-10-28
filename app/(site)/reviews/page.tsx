import { ReviewsContent } from "@/components/pages/reviews-content"
import { JsonLd } from "@/components/site/json-ld"
import { breadcrumbLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Client Reviews: What Businesses Say About Us",
  description:
    "Read what founders and teams say about working with Aeon Corporate on company registration, GST, trademark, ISO, licences and compliance.",
  path: "/reviews",
  keywords: [
    "Aeon Corporate reviews",
    "company registration reviews",
    "compliance services reviews",
  ],
})

export default function ReviewsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Reviews", path: "/reviews" },
        ])}
      />
      <ReviewsContent />
    </>
  )
}
