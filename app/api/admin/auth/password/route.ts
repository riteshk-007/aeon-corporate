import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { audit } from "@/lib/auth/audit"
import { apiAuth } from "@/lib/auth/guards"
import { destroyUserSessions } from "@/lib/auth/session"
import {
  hashPassword,
  passwordProblems,
  verifyPassword,
} from "@/lib/auth/password"
import { changePasswordSchema } from "@/lib/auth/schemas"
import { ApiError, clientIp, readJson, route } from "@/lib/auth/request"

/** Change your own password. Other devices are signed out. */
export const POST = route(async (req: Request) => {
  const actor = await apiAuth(req, undefined, { allowPasswordChange: true })
  const { currentPassword, newPassword } = changePasswordSchema.parse(
    await readJson(req),
  )

  const user = await db.user.findUniqueOrThrow({ where: { id: actor.id } })
  if (!(await verifyPassword(user.passwordHash, currentPassword))) {
    throw new ApiError(400, "Current password is incorrect")
  }
  const problems = passwordProblems(newPassword, {
    email: user.email,
    name: user.name,
  })
  if (problems.length)
    throw new ApiError(422, problems[0], { issues: problems })
  if (await verifyPassword(user.passwordHash, newPassword)) {
    throw new ApiError(422, "Choose a password you have not used before")
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(newPassword),
      passwordChangedAt: new Date(),
      mustChangePassword: false,
    },
  })
  await destroyUserSessions(user.id, actor.sessionId)
  await audit({ actor, action: "auth.password_changed", ip: clientIp(req) })
  return NextResponse.json({ ok: true })
})
