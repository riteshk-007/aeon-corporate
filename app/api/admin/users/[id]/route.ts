import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { audit } from "@/lib/auth/audit"
import { apiAuth, assertCanGrant } from "@/lib/auth/guards"
import { hashPassword, passwordProblems } from "@/lib/auth/password"
import { updateUserSchema } from "@/lib/auth/schemas"
import { destroyUserSessions } from "@/lib/auth/session"
import { clearFailures } from "@/lib/auth/login-guard"
import { publicUserSelect } from "@/lib/auth/users"
import { ApiError, clientIp, readJson, route } from "@/lib/auth/request"

type Ctx = { params: Promise<{ id: string }> }

async function otherActiveSuperAdmins(excludeId: string) {
  return db.user.count({
    where: { isSuperAdmin: true, isActive: true, id: { not: excludeId } },
  })
}

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params
  const actor = await apiAuth(req, "users:edit")
  const body = updateUserSchema.parse(await readJson(req))

  const target = await db.user.findUnique({
    where: { id },
    include: { role: true },
  })
  if (!target) throw new ApiError(404, "User not found")
  if (target.isSuperAdmin && !actor.isSuperAdmin) {
    throw new ApiError(403, "Only a super admin can change a super admin")
  }

  const isSelf = target.id === actor.id
  const sensitive =
    body.roleId !== undefined ||
    body.extraPermissions !== undefined ||
    body.isActive !== undefined ||
    body.isSuperAdmin !== undefined ||
    body.newPassword !== undefined
  if (isSelf && sensitive) {
    throw new ApiError(
      403,
      "You cannot change your own access. Ask another admin.",
    )
  }

  const data: Record<string, unknown> = {}
  const changes: string[] = []
  let revokeSessions = false

  if (body.name !== undefined) {
    data.name = body.name
    changes.push("name")
  }

  if (body.roleId !== undefined || body.extraPermissions !== undefined) {
    const role = body.roleId
      ? await db.role.findUnique({ where: { id: body.roleId } })
      : target.role
    if (!role) throw new ApiError(422, "That role does not exist")
    const extra = body.extraPermissions ?? target.extraPermissions
    assertCanGrant(actor, [...role.permissions, ...extra])
    if (body.roleId !== undefined) data.roleId = role.id
    if (body.extraPermissions !== undefined) data.extraPermissions = extra
    changes.push("access")
  }

  if (
    body.isSuperAdmin !== undefined &&
    body.isSuperAdmin !== target.isSuperAdmin
  ) {
    if (!actor.isSuperAdmin)
      throw new ApiError(403, "Only a super admin can do this")
    if (!body.isSuperAdmin && (await otherActiveSuperAdmins(target.id)) === 0) {
      throw new ApiError(409, "There must be at least one active super admin")
    }
    data.isSuperAdmin = body.isSuperAdmin
    changes.push("super admin")
  }

  if (body.isActive !== undefined && body.isActive !== target.isActive) {
    if (
      !body.isActive &&
      target.isSuperAdmin &&
      (await otherActiveSuperAdmins(target.id)) === 0
    ) {
      throw new ApiError(409, "There must be at least one active super admin")
    }
    data.isActive = body.isActive
    if (!body.isActive) revokeSessions = true
    changes.push(body.isActive ? "activated" : "deactivated")
  }

  if (body.unlock) {
    data.failedAttempts = 0
    data.lockedUntil = null
    await clearFailures(target.email)
    changes.push("unlocked")
  }

  if (body.newPassword !== undefined) {
    const problems = passwordProblems(body.newPassword, {
      email: target.email,
      name: target.name,
    })
    if (problems.length)
      throw new ApiError(422, problems[0], { issues: problems })
    data.passwordHash = await hashPassword(body.newPassword)
    data.passwordChangedAt = new Date()
    data.mustChangePassword = true
    revokeSessions = true
    changes.push("password reset")
  }

  if (!changes.length) return NextResponse.json({ ok: true, unchanged: true })

  const user = await db.user.update({
    where: { id },
    data,
    select: publicUserSelect,
  })
  if (revokeSessions) await destroyUserSessions(id)
  await audit({
    actor,
    action: "user.update",
    target: target.email,
    meta: { changes },
    ip: clientIp(req),
  })
  return NextResponse.json({ user })
})

export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params
  const actor = await apiAuth(req, "users:delete")
  if (id === actor.id)
    throw new ApiError(403, "You cannot delete your own account")

  const target = await db.user.findUnique({ where: { id } })
  if (!target) throw new ApiError(404, "User not found")
  if (target.isSuperAdmin) {
    if (!actor.isSuperAdmin)
      throw new ApiError(403, "Only a super admin can delete a super admin")
    if ((await otherActiveSuperAdmins(id)) === 0) {
      throw new ApiError(409, "There must be at least one active super admin")
    }
  }
  await db.user.delete({ where: { id } })
  await audit({
    actor,
    action: "user.delete",
    target: target.email,
    ip: clientIp(req),
  })
  return NextResponse.json({ ok: true })
})
