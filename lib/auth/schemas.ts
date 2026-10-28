import { z } from "zod"
import { isPermission, type Permission } from "@/lib/auth/permissions"
import { passwordProblems } from "@/lib/auth/password-policy"

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Email is too long")
  .pipe(z.email("Enter a valid email address"))

const nameSchema = z.string().trim().min(2, "Name is too short").max(80)

const permissionList = z
  .array(z.string())
  .max(100)
  .transform((list, ctx) => {
    const unique = [...new Set(list)]
    const bad = unique.filter((p) => !isPermission(p))
    if (bad.length) {
      ctx.addIssue({ code: "custom", message: `Unknown permission: ${bad[0]}` })
      return z.NEVER
    }
    return unique as Permission[]
  })

export const loginSchema = z.object({
  email: emailSchema,
  // Cap length so nobody can make the server hash megabytes of text.
  password: z.string().min(1, "Enter your password").max(128),
})

export const createUserSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: z.string().max(128),
    roleId: z.string().min(1, "Choose a role"),
    extraPermissions: permissionList.default([]),
    isSuperAdmin: z.boolean().default(false),
    mustChangePassword: z.boolean().default(true),
  })
  .superRefine((v, ctx) => {
    for (const message of passwordProblems(v.password, {
      email: v.email,
      name: v.name,
    })) {
      ctx.addIssue({ code: "custom", path: ["password"], message })
    }
  })

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  roleId: z.string().min(1).optional(),
  extraPermissions: permissionList.optional(),
  isActive: z.boolean().optional(),
  isSuperAdmin: z.boolean().optional(),
  /** Clears the 5-attempt lock. */
  unlock: z.boolean().optional(),
  /** Admin-set replacement password (forces a change at next sign in). */
  newPassword: z.string().max(128).optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().max(128),
})

export const roleSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(40),
  description: z.string().trim().max(200).optional().default(""),
  permissions: permissionList,
})
