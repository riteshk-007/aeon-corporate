import { createHmac } from "node:crypto"
import { NextResponse, after } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { notifyAdmin } from "@/lib/mail"
import { keyFromUrl, storageConfigured } from "@/lib/storage"
import {
  ApiError,
  assertSameOrigin,
  clientIp,
  readJson,
  route,
} from "@/lib/auth/request"
import {
  PRIVACY_VERSION,
  RETENTION_DAYS,
  TERMS_VERSION,
} from "@/lib/legal"

export const runtime = "nodejs"

const text = (max: number) => z.string().trim().max(max)
const phone = text(20).refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a valid mobile number")

const base = {
  consent: z.literal(true, { error: "Please tick the consent box to continue" }),
  marketingOptIn: z.boolean().optional().default(false),
  source: text(120).optional(),
  company_website: z.string().optional(), // honeypot
}

const schema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.enum(["contact", "partner", "career"]),
    name: text(120).min(2, "Name is required"),
    email: z.email("Enter a valid email address").max(200),
    phone,
    state: text(80).optional(),
    message: text(2000).optional(),
    details: z.record(z.string().max(60), text(500)).optional(),
    ...base,
  }),
  z.object({
    kind: z.literal("newsletter"),
    email: z.email("Enter a valid email address").max(200),
    ...base,
  }),
])

// Simple in-memory per-IP limit (per server instance): 8 submissions / 10 min.
const hits = new Map<string, number[]>()
function rateLimit(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  if (recent.length >= 8) throw new ApiError(429, "Too many requests. Please try again later.")
  recent.push(now)
  hits.set(ip, recent)
}

function hashIp(ip: string) {
  const secret = process.env.APP_SECRET
  if (!secret) return null
  return createHmac("sha256", secret).update(ip).digest("hex")
}

export const POST = route(async (req: Request) => {
  assertSameOrigin(req)
  const ip = clientIp(req)
  rateLimit(ip)
  const input = schema.parse(await readJson(req))

  // Bots fill the honeypot: pretend success, store nothing.
  if (input.company_website) return NextResponse.json({ ok: true })

  if (!process.env.DATABASE_URL) {
    throw new ApiError(503, "We can't take enquiries right now. Please email us instead.")
  }

  // A resume link is accepted only if it points at a file we stored ourselves.
  if (input.kind !== "newsletter" && input.details?.resumeUrl) {
    const ok = storageConfigured() && keyFromUrl(input.details.resumeUrl)
    if (!ok) {
      delete input.details.resumeUrl
      delete input.details.resumeName
    }
  }

  const days = RETENTION_DAYS[input.kind]
  const common = {
    kind: input.kind,
    email: input.email.toLowerCase(),
    source: input.source,
    marketingOptIn: input.kind === "newsletter" ? true : input.marketingOptIn,
    consentPrivacyVersion: PRIVACY_VERSION,
    consentTermsVersion: TERMS_VERSION,
    consentIpHash: hashIp(ip),
    retainUntil: new Date(Date.now() + days * 86_400_000),
  }

  if (input.kind === "newsletter") {
    await db.lead.create({ data: common })
  } else {
    await db.lead.create({
      data: {
        ...common,
        name: input.name,
        phone: input.phone,
        state: input.state || null,
        message: input.message || null,
        details: input.details,
      },
    })
  }

  // Tell the team by email after the response is sent; the enquiry is already saved.
  const kindLabel = { contact: "Contact enquiry", partner: "Partner enquiry", career: "Job application", newsletter: "Newsletter signup" }[input.kind]
  const d = input.kind === "newsletter" ? {} : (input.details ?? {})
  const who = input.kind === "newsletter" ? input.email : input.name
  after(() =>
    notifyAdmin(
      `New ${kindLabel.toLowerCase()}: ${d.service || d.job || who}`,
      `${kindLabel} received on the Aeon Corporate website.`,
      [
        ["Type", kindLabel],
        ["Service / role", d.service || d.job],
        ["Name", input.kind === "newsletter" ? undefined : input.name],
        ["Email", input.email],
        ["Mobile", input.kind === "newsletter" ? undefined : input.phone],
        ["State", input.kind === "newsletter" ? undefined : input.state],
        ...Object.entries(d)
          .filter(([k]) => k !== "service" && k !== "job" && k !== "resumeUrl")
          .map(([k, v]): [string, string] => [k, v]),
        ["Resume", d.resumeUrl],
        ["Message", input.kind === "newsletter" ? undefined : input.message],
        ["Page", input.source],
        ["Consent", "Given on the form (policy version " + PRIVACY_VERSION + ")"],
        ["Updates opt-in", common.marketingOptIn ? "Yes" : "No"],
      ],
      input.email,
      d.resumeUrl,
      d.resumeName,
    ),
  )
  return NextResponse.json({ ok: true }, { status: 201 })
})
