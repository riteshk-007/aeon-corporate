/**
 * Password rules. Pure functions only, so the SAME checks run in the browser
 * (live strength hints) and on the server (the real enforcement).
 */

const COMMON = new Set([
  "password",
  "passw0rd",
  "p@ssw0rd",
  "qwerty",
  "qwertyuiop",
  "letmein",
  "welcome",
  "admin",
  "administrator",
  "iloveyou",
  "monkey",
  "dragon",
  "football",
  "abc123",
  "123456",
  "1234567",
  "12345678",
  "123456789",
  "1234567890",
  "111111",
  "000000",
  "aeon",
  "aeoncorporate",
  "corporate",
  "changeme",
  "secret",
  "login",
  "master",
])

export type PasswordContext = { email?: string; name?: string }

export const PASSWORD_RULES = [
  "At least 12 characters",
  "An uppercase and a lowercase letter",
  "A number",
  "A symbol such as ! @ # $ %",
  "No spaces, and nothing guessable (your name, email or common passwords)",
] as const

/** Returns a list of problems; an empty list means the password is strong enough. */
export function passwordProblems(
  password: string,
  ctx: PasswordContext = {},
): string[] {
  const problems: string[] = []
  if (password.length < 12) problems.push("Use at least 12 characters")
  if (password.length > 128) problems.push("Use at most 128 characters")
  if (!/[a-z]/.test(password)) problems.push("Add a lowercase letter")
  if (!/[A-Z]/.test(password)) problems.push("Add an uppercase letter")
  if (!/\d/.test(password)) problems.push("Add a number")
  if (!/[^A-Za-z0-9\s]/.test(password))
    problems.push("Add a symbol (for example ! @ # $ %)")
  if (/\s/.test(password)) problems.push("Remove spaces")
  if (/(.)\1{3,}/.test(password))
    problems.push("Avoid repeating the same character 4+ times")

  const flat = password.toLowerCase().replace(/[^a-z0-9]/g, "")
  if (
    [...COMMON].some((w) => flat === w || (w.length >= 6 && flat.includes(w)))
  ) {
    problems.push("This password is too common")
  }
  const local = ctx.email
    ?.split("@")[0]
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, "")
  if (local && local.length >= 3 && flat.includes(local)) {
    problems.push("Do not include your email name")
  }
  for (const part of (ctx.name ?? "").toLowerCase().split(/\s+/)) {
    const clean = part.replace(/[^a-z0-9]/g, "")
    if (clean.length >= 3 && flat.includes(clean)) {
      problems.push("Do not include your name")
      break
    }
  }
  return problems
}

/** A strong random password that always satisfies the rules above. */
export function generatePassword(length = 18): string {
  const sets = [
    "ABCDEFGHJKLMNPQRSTUVWXYZ",
    "abcdefghijkmnopqrstuvwxyz",
    "23456789",
    "!@#$%^&*-_=+?",
  ]
  const all = sets.join("")
  const pick = (chars: string) => {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    return chars[buf[0] % chars.length]
  }
  for (let attempt = 0; attempt < 20; attempt++) {
    const chars = sets.map(pick)
    while (chars.length < length) chars.push(pick(all))
    // Fisher–Yates shuffle with crypto randomness
    for (let i = chars.length - 1; i > 0; i--) {
      const buf = new Uint32Array(1)
      crypto.getRandomValues(buf)
      const j = buf[0] % (i + 1)
      ;[chars[i], chars[j]] = [chars[j], chars[i]]
    }
    const candidate = chars.join("")
    if (passwordProblems(candidate).length === 0) return candidate
  }
  throw new Error("Could not generate a password")
}
