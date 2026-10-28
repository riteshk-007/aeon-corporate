import { redirect } from "next/navigation"
import { getAuthUser, type AuthUser } from "@/lib/auth/session"
import { ApiError, assertSameOrigin } from "@/lib/auth/request"
import type { Permission } from "@/lib/auth/permissions"

/** For server components and layouts under /admin. */
export async function requireUser(
  options: { allowPasswordChange?: boolean } = {},
) {
  const user = await getAuthUser()
  if (!user) redirect("/admin/login")
  if (user.mustChangePassword && !options.allowPasswordChange) {
    redirect("/admin/account?change=required")
  }
  return user
}

/** Page-level access: signed in AND allowed to view this module. */
export async function requirePagePermission(permission: Permission) {
  const user = await requireUser()
  if (!user.permissions.includes(permission)) redirect("/admin/forbidden")
  return user
}

/** For route handlers: origin check + session + (optional) permission. */
export async function apiAuth(
  req: Request,
  permission?: Permission,
  options: { allowPasswordChange?: boolean; multipart?: boolean } = {},
): Promise<AuthUser> {
  assertSameOrigin(req, { multipart: options.multipart })
  const user = await getAuthUser()
  if (!user) throw new ApiError(401, "Please sign in")
  if (user.mustChangePassword && !options.allowPasswordChange) {
    throw new ApiError(403, "Change your password first", {
      code: "PASSWORD_CHANGE_REQUIRED",
    })
  }
  if (permission && !user.permissions.includes(permission)) {
    throw new ApiError(403, "You do not have access to do this")
  }
  return user
}

/** Nobody can hand out more access than they hold themselves. */
export function assertCanGrant(actor: AuthUser, permissions: string[]) {
  if (actor.isSuperAdmin) return
  const mine = new Set<string>(actor.permissions)
  const denied = permissions.filter((p) => !mine.has(p))
  if (denied.length) {
    throw new ApiError(403, "You can only grant access you have yourself", {
      denied,
    })
  }
}
