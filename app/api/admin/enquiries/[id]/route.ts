import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { removeResume } from "@/lib/resume"
import { audit } from "@/lib/auth/audit"
import { apiAuth } from "@/lib/auth/guards"
import { ApiError, clientIp, readJson, route } from "@/lib/auth/request"

type Ctx = { params: Promise<{ id: string }> }

/** Opening the full details of a person's enquiry is logged (DPDP accountability). */
export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params
  const actor = await apiAuth(req, "enquiries:view")
  const lead = await db.lead.findUnique({ where: { id } })
  if (!lead) throw new ApiError(404, "Enquiry not found")
  await audit({
    actor,
    action: "lead.view",
    target: `${lead.kind}:${lead.id}`,
    ip: clientIp(req),
  })
  return NextResponse.json({ lead })
})

const patchSchema = z.object({ status: z.enum(["new", "contacted", "closed"]) })

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params
  const actor = await apiAuth(req, "enquiries:edit")
  const { status } = patchSchema.parse(await readJson(req))
  const lead = await db.lead
    .update({ where: { id }, data: { status } })
    .catch(() => null)
  if (!lead) throw new ApiError(404, "Enquiry not found")
  await audit({
    actor,
    action: "lead.status",
    target: `${lead.kind}:${lead.id}`,
    meta: { status },
    ip: clientIp(req),
  })
  return NextResponse.json({ ok: true })
})

/** Right to erasure: permanently removes the person's data. */
export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params
  const actor = await apiAuth(req, "enquiries:delete")
  const lead = await db.lead.delete({ where: { id } }).catch(() => null)
  if (!lead) throw new ApiError(404, "Enquiry not found")
  await removeResume(lead.details)
  await audit({
    actor,
    action: "lead.delete",
    target: `${lead.kind}:${lead.id}`,
    ip: clientIp(req),
  })
  return NextResponse.json({ ok: true })
})
