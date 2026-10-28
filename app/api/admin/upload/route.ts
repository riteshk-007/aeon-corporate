import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { audit } from "@/lib/auth/audit"
import { apiAuth } from "@/lib/auth/guards"
import { ApiError, clientIp, route } from "@/lib/auth/request"
import { EXT, putObject, storageConfigured } from "@/lib/storage"
import type { Permission } from "@/lib/auth/permissions"

export const runtime = "nodejs"

const MAX_BYTES = 5 * 1024 * 1024
const SCOPES: Record<string, { permission: Permission; field: "jobId" | "serviceId" }> = {
  job: { permission: "careers:edit", field: "jobId" },
  service: { permission: "pages:edit", field: "serviceId" },
}

/** Identify an image by its first bytes, not by what the browser claims. */
function sniff(buf: Buffer): string | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg"
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "image/png"
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP")
    return "image/webp"
  if (buf.subarray(0, 3).toString() === "GIF") return "image/gif"
  return null
}

export const POST = route(async (req: Request) => {
  // auth first, then parse the (large) body
  const scopeHeader = new URL(req.url).searchParams.get("scope") ?? ""
  const scope = SCOPES[scopeHeader]
  if (!scope) throw new ApiError(400, "Unknown upload scope")
  const actor = await apiAuth(req, scope.permission, { multipart: true })

  if (!storageConfigured()) {
    throw new ApiError(503, "Image storage (Cloudflare R2) is not configured yet")
  }
  const declared = Number(req.headers.get("content-length") ?? 0)
  if (declared > MAX_BYTES + 64 * 1024) throw new ApiError(413, "Image is too large (max 5 MB)")

  const data = await req.formData()
  const file = data.get("file")
  if (!(file instanceof File)) throw new ApiError(400, "No file received")
  if (file.size > MAX_BYTES) throw new ApiError(413, "Image is too large (max 5 MB)")

  const buf = Buffer.from(await file.arrayBuffer())
  const mime = sniff(buf)
  if (!mime || !EXT[mime]) throw new ApiError(415, "Only JPG, PNG, WebP or GIF images are allowed")

  const ownerId = (data.get("ownerId") as string | null) || null
  const { key, url } = await putObject({ folder: `${scopeHeader}s`, body: buf, mime })
  await db.asset.create({
    data: { key, url, mime, size: buf.length, [scope.field]: ownerId, uploadedBy: actor.id },
  })
  await audit({ actor, action: "asset.upload", target: key, ip: clientIp(req) })
  return NextResponse.json({ url }, { status: 201 })
})
