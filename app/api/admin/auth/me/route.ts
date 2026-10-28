import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth/session"
import { ApiError, route } from "@/lib/auth/request"

export const GET = route(async () => {
  const user = await getAuthUser()
  if (!user) throw new ApiError(401, "Please sign in")
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.roleName,
      isSuperAdmin: user.isSuperAdmin,
      mustChangePassword: user.mustChangePassword,
      permissions: user.permissions,
    },
  })
})
