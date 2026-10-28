import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { audit } from "@/lib/auth/audit"
import { apiAuth } from "@/lib/auth/guards"
import { ApiError, clientIp, readJson, route } from "@/lib/auth/request"
import {
  cleanJob,
  deleteJobAssets,
  jobSchema,
  syncJobAssets,
  uniqueSlug,
} from "@/lib/jobs"

export const runtime = "nodejs"

type Ctx = { params: Promise<{ id: string }> }

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params
  const actor = await apiAuth(req, "careers:edit")
  const data = cleanJob(jobSchema.parse(await readJson(req, 400_000)))
  const existing = await db.job.findUnique({ where: { id } })
  if (!existing) throw new ApiError(404, "Job not found")

  const job = await db.job.update({
    where: { id },
    data: {
      ...data,
      slug:
        data.title === existing.title ? existing.slug : await uniqueSlug(data.title, id),
    },
  })
  await syncJobAssets(id, job.descriptionHtml)
  await audit({ actor, action: "job.update", target: job.title, ip: clientIp(req) })
  return NextResponse.json({ ok: true })
})

/** Deleting a job also deletes its images from Cloudflare R2. */
export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params
  const actor = await apiAuth(req, "careers:delete")
  const job = await db.job.findUnique({ where: { id } })
  if (!job) throw new ApiError(404, "Job not found")
  await deleteJobAssets(id)
  await db.job.delete({ where: { id } })
  await audit({ actor, action: "job.delete", target: job.title, ip: clientIp(req) })
  return NextResponse.json({ ok: true })
})
