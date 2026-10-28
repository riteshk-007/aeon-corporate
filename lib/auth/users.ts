import type { Prisma } from "@/lib/generated/prisma/client"

/** Fields that are safe to return to the browser (never the password hash). */
export const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  roleId: true,
  role: { select: { id: true, name: true } },
  extraPermissions: true,
  isSuperAdmin: true,
  isActive: true,
  mustChangePassword: true,
  failedAttempts: true,
  lockedUntil: true,
  lastLoginAt: true,
  createdAt: true,
} satisfies Prisma.UserSelect

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof publicUserSelect
}>
