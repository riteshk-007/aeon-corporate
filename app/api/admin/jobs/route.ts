import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { audit } from "@/lib/auth/audit"
import { apiAuth } from "@/lib/auth/guards"
import { clientIp, readJson, route } from "@/lib/auth/request"
import { cleanJob, jobSchema, syncJobAssets, uniqueSlug } from "@/lib/jobs"

export const runtime = "nodejs"

export const POST = route(async (req: Request) => {
  const actor = await apiAuth(req, "careers:create")
  const data = cleanJob(jobSchema.parse(await readJson(req, 400_000)))
  const job = await db.job.create({
    data: { ...data, slug: await uniqueSlug(data.title) },
  })
  await syncJobAssets(job.id, job.descriptionHtml)
  await audit({ actor, action: "job.create", target: job.title, ip: clientIp(req) })
  return NextResponse.json({ job: { id: job.id } }, { status: 201 })
})
