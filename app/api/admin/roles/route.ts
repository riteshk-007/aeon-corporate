import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { audit } from "@/lib/auth/audit"
import { apiAuth, assertCanGrant } from "@/lib/auth/guards"
import { roleSchema } from "@/lib/auth/schemas"
import { ApiError, clientIp, readJson, route } from "@/lib/auth/request"

export const GET = route(async (req: Request) => {
  await apiAuth(req, "roles:view")
  const roles = await db.role.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { users: true } } },
  })
  return NextResponse.json({ roles })
})

export const POST = route(async (req: Request) => {
  const actor = await apiAuth(req, "roles:create")
  const body = roleSchema.parse(await readJson(req))
  assertCanGrant(actor, body.permissions)

  if (await db.role.findUnique({ where: { name: body.name } })) {
    throw new ApiError(409, "A role with this name already exists")
  }
  const role = await db.role.create({
    data: {
      name: body.name,
      description: body.description || null,
      permissions: body.permissions,
    },
  })
  await audit({
    actor,
    action: "role.create",
    target: role.name,
    meta: { permissions: role.permissions },
    ip: clientIp(req),
  })
  return NextResponse.json({ role }, { status: 201 })
})
