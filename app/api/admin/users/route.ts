import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { audit } from "@/lib/auth/audit"
import { apiAuth, assertCanGrant } from "@/lib/auth/guards"
import { hashPassword } from "@/lib/auth/password"
import { createUserSchema } from "@/lib/auth/schemas"
import { publicUserSelect } from "@/lib/auth/users"
import { ApiError, clientIp, readJson, route } from "@/lib/auth/request"

export const GET = route(async (req: Request) => {
  await apiAuth(req, "users:view")
  const users = await db.user.findMany({
    select: publicUserSelect,
    orderBy: { createdAt: "asc" },
  })
  return NextResponse.json({ users })
})

/**
 * Register a new admin. This is the only way accounts are created:
 * there is no public sign-up, and the caller needs "users:create".
 */
export const POST = route(async (req: Request) => {
  const actor = await apiAuth(req, "users:create")
  const body = createUserSchema.parse(await readJson(req))

  if (body.isSuperAdmin && !actor.isSuperAdmin) {
    throw new ApiError(403, "Only a super admin can create another super admin")
  }
  const role = await db.role.findUnique({ where: { id: body.roleId } })
  if (!role) throw new ApiError(422, "That role does not exist")
  assertCanGrant(actor, [...role.permissions, ...body.extraPermissions])

  if (await db.user.findUnique({ where: { email: body.email } })) {
    throw new ApiError(409, "An account with this email already exists")
  }

  const user = await db.user.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash: await hashPassword(body.password),
      roleId: role.id,
      extraPermissions: body.extraPermissions,
      isSuperAdmin: body.isSuperAdmin,
      mustChangePassword: body.mustChangePassword,
      createdById: actor.id,
    },
    select: publicUserSelect,
  })
  await audit({
    actor,
    action: "user.create",
    target: user.email,
    meta: { role: role.name, extraPermissions: body.extraPermissions },
    ip: clientIp(req),
  })
  return NextResponse.json({ user }, { status: 201 })
})
