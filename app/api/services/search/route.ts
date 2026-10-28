import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const runtime = "nodejs"

/** Public search over published service pages (title, category, summary). */
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 60)
  if (q.length < 2) return NextResponse.json({ results: [] })
  try {
    const rows = await db.service.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { slug: true, title: true, category: true },
      take: 60,
    })
    const n = q.toLowerCase()
    const rank = (t: string) => {
      const l = t.toLowerCase()
      return l === n ? 0 : l.startsWith(n) ? 1 : l.includes(n) ? 2 : 3
    }
    const results = rows
      .sort((a, b) => rank(a.title) - rank(b.title) || a.title.localeCompare(b.title))
      .slice(0, 8)
    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, max-age=30, s-maxage=60" } },
    )
  } catch {
    return NextResponse.json({ results: [] })
  }
}
