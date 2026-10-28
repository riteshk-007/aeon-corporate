/**
 * Creates the built-in roles and the FIRST super admin.
 *
 *   ADMIN_EMAIL=you@company.com ADMIN_PASSWORD='a-strong-password' pnpm db:seed
 *
 * It is safe to run again: roles are updated in place and a super admin is
 * only created when none exists yet. Every other admin is created from the
 * admin panel (or POST /api/admin/users), never from a public sign-up page.
 */
import "dotenv/config"
import { db } from "../lib/db"
import { saveMenu } from "../lib/menu"
import { STARTER_MENU } from "../lib/menu-starter"
import { starterServices } from "../lib/service-starter"
import { sanitizeRich } from "../lib/rich-text"
import { DEFAULT_ROLES } from "../lib/auth/permissions"
import { hashPassword, passwordProblems } from "../lib/auth/password"

async function main() {
  for (const role of DEFAULT_ROLES) {
    await db.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: {
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isSystem: true,
      },
    })
  }
  // Built-in roles gain any permission added later (never loses what you customised).
  for (const role of DEFAULT_ROLES) {
    const current = await db.role.findUnique({ where: { name: role.name } })
    if (!current) continue
    const merged = [...new Set([...current.permissions, ...role.permissions])]
    if (merged.length !== current.permissions.length) {
      await db.role.update({ where: { name: role.name }, data: { permissions: merged } })
    }
  }
  if ((await db.menuItem.count()) === 0) {
    await saveMenu(STARTER_MENU)
    console.log("Starter header menu created (edit it under Admin > Menus).")
  }
  // A page for every Startup menu link (written ones are published, the rest are empty drafts).
  for (const page of starterServices()) {
    const exists = await db.service.findUnique({ where: { slug: page.slug }, select: { id: true } })
    if (exists) continue
    await db.service.create({
      data: { ...page, sections: page.sections.map((x) => ({ ...x, html: sanitizeRich(x.html) })), heroImageUrl: null },
    })
  }
  console.log(`Roles ready: ${DEFAULT_ROLES.map((r) => r.name).join(", ")}`)

  const existing = await db.user.count({ where: { isSuperAdmin: true } })
  if (existing > 0) {
    console.log("A super admin already exists, nothing else to do.")
    return
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME?.trim() || "Super Admin"
  if (!email || !password) {
    console.log(
      "No super admin yet. Run again with ADMIN_EMAIL and ADMIN_PASSWORD set.",
    )
    return
  }
  const problems = passwordProblems(password, { email, name })
  if (problems.length) {
    console.error(
      "ADMIN_PASSWORD is not strong enough:\n - " + problems.join("\n - "),
    )
    process.exitCode = 1
    return
  }

  const adminRole = await db.role.findUniqueOrThrow({
    where: { name: "Admin" },
  })
  await db.user.create({
    data: {
      email,
      name,
      passwordHash: await hashPassword(password),
      roleId: adminRole.id,
      isSuperAdmin: true,
      // Keep the temporary password short-lived: change it after first sign in.
      mustChangePassword: true,
    },
  })
  console.log(
    `Super admin created: ${email} (must change password on first sign in)`,
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
