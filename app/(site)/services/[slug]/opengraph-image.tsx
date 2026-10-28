import { ImageResponse } from "next/og"
import { db } from "@/lib/db"

export const alt = "Aeon Corporate service"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const revalidate = 3600

/** Branded share picture (Google Discover, WhatsApp, LinkedIn) made from the page title. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let title = "Business registration, compliance and advisory"
  let category = ""
  try {
    if (process.env.DATABASE_URL) {
      const s = await db.service.findUnique({ where: { slug }, select: { title: true, category: true, isPublished: true } })
      if (s?.isPublished) {
        title = s.title
        category = s.category
      }
    }
  } catch {}

  const fontSize = title.length > 60 ? 54 : title.length > 36 ? 66 : 80
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #1b5fd9 0%, #0a44b8 60%, #0b1b4d 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 700 }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#ffd93d" }} />
          Aeon Corporate
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {category ? (
            <div style={{ fontSize: 28, fontWeight: 700, color: "#ffd93d", letterSpacing: 4, textTransform: "uppercase", marginBottom: 18 }}>
              {category}
            </div>
          ) : null}
          <div style={{ fontSize, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>{title}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,.8)" }}>
          Eligibility · Documents · Process · Expert help
        </div>
      </div>
    ),
    size,
  )
}
