import { hash, verify } from "@node-rs/argon2"
import { z } from "zod"
import {
  passwordProblems,
  type PasswordContext,
} from "@/lib/auth/password-policy"

export { passwordProblems, PASSWORD_RULES } from "@/lib/auth/password-policy"
export type { PasswordContext } from "@/lib/auth/password-policy"

/** Argon2id with OWASP-recommended cost settings. Server only. */
const OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 }

export const hashPassword = (password: string) => hash(password, OPTIONS)

export async function verifyPassword(storedHash: string, password: string) {
  try {
    return await verify(storedHash, password)
  } catch {
    return false
  }
}

let dummy: Promise<string> | undefined
/**
 * Verified against when the email is unknown, so "no such user" and
 * "wrong password" take the same time and cannot be told apart.
 */
export const dummyHash = () =>
  (dummy ??= hashPassword("not-a-real-password-Aeon#0"))

export const passwordSchema = (ctx: PasswordContext = {}) =>
  z.string().superRefine((value, issue) => {
    for (const message of passwordProblems(value, ctx)) {
      issue.addIssue({ code: "custom", message })
    }
  })
