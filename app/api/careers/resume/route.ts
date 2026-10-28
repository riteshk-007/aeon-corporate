import { NextResponse } from "next/server"
import { ApiError, assertSameOrigin, clientIp, route } from "@/lib/auth/request"
import { putObject, storageConfigured } from "@/lib/storage"

export const runtime = "nodejs"

const MAX_BYTES = 5 * 1024 * 1024

/** Real file type from the first bytes (not from the name or what the browser claims). */
function sniff(buf: Buffer): string | null {
  if (buf.length < 12) return null
  if (buf.subarray(0, 5).toString() === "%PDF-") return "application/pdf"
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg"
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png"
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "image/webp"
  return null
}

// In-memory per-IP limit: 5 uploads / 10 min.
const hits = new Map<string, number[]>()
function rateLimit(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  if (recent.length >= 5) throw new ApiError(429, "Too many uploads. Please try again later.")
  recent.push(now)
  hits.set(ip, recent)
}

/** Job applicants attach a resume (PDF or image, max 5 MB). The link is saved with the application. */
export const POST = route(async (req: Request) => {
  assertSameOrigin(req, { multipart: true })
  rateLimit(clientIp(req))
  if (!storageConfigured()) throw new ApiError(503, "File upload is not available right now. Please paste a resume link in the note instead.")
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES + 64 * 1024) throw new ApiError(413, "File is too large (max 5 MB)")
  const data = await req.formData()
  const file = data.get("file")
  if (!(file instanceof File)) throw new ApiError(400, "No file received")
  if (file.size > MAX_BYTES) throw new ApiError(413, "File is too large (max 5 MB)")
  const buf = Buffer.from(await file.arrayBuffer())
  const mime = sniff(buf)
  if (!mime) throw new ApiError(415, "Only PDF, JPG, PNG or WebP files are allowed")
  const { url } = await putObject({ folder: "resumes", body: buf, mime })
  return NextResponse.json({ url, name: file.name.slice(0, 80) }, { status: 201 })
})
