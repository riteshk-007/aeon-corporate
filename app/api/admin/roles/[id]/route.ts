import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { audit } from "@/lib/auth/audit"
import { apiAuth, assertCanGrant } from "@/lib/auth/guards"
import { roleSchema } from "@/lib/auth/schemas"
import { ApiError, clientIp, readJson, route } from "@/lib/auth/request"

type Ctx = { params: Promise<{ id: string }> }

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params
  const actor = await apiAuth(req, "roles:edit")
  const body = roleSchema.parse(await readJson(req))

  const role = await db.role.findUnique({ where: { id } })
  if (!role) throw new ApiError(404, "Role not found")

  // You can only edit a role that does not exceed your own access.
  assertCanGrant(actor, role.permissions)
  assertCanGrant(actor, body.permissions)

  if (role.isSystem && body.name !== role.name) {
    throw new ApiError(422, "Built-in roles cannot be renamed")
  }
  const clash = await db.role.findFirst({
    where: { name: body.name, id: { not: id } },
  })
  if (clash) throw new ApiError(409, "A role with this name already exists")

  const updated = await db.role.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description || null,
      permissions: body.permissions,
    },
  })
  await audit({
    actor,
    action: "role.update",
    target: updated.name,
    meta: { permissions: updated.permissions },
    ip: clientIp(req),
  })
  return NextResponse.json({ role: updated })
})

export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params
  const actor = await apiAuth(req, "roles:delete")
  const role = await db.role.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } },
  })
  if (!role) throw new ApiError(404, "Role not found")
  if (role.isSystem) throw new ApiError(403, "Built-in roles cannot be deleted")
  if (role._count.users > 0) {
    throw new ApiError(
      409,
      "Move the people in this role to another role first",
    )
  }
  await db.role.delete({ where: { id } })
  await audit({
    actor,
    action: "role.delete",
    target: role.name,
    ip: clientIp(req),
  })
  return NextResponse.json({ ok: true })
})
