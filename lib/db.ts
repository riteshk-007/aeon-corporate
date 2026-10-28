import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/lib/generated/prisma/client"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env first.")
  }
  // DATABASE_POOL_MAX lets small hosts / serverless keep the pool tiny.
  const max = Number(process.env.DATABASE_POOL_MAX) || undefined
  // `?schema=name` in DATABASE_URL puts our tables in their own schema (useful when
  // the database is shared); the pg driver itself doesn't understand that option.
  let schema: string | undefined
  let url = connectionString
  try {
    const parsed = new URL(connectionString)
    schema = parsed.searchParams.get("schema") ?? undefined
    parsed.searchParams.delete("schema")
    url = parsed.toString()
  } catch {}
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url, max }, schema ? { schema } : undefined),
  })
}

function client() {
  const existing = globalForPrisma.prisma
  if (existing) return existing
  const created = createClient()
  // One pool per process (also survives hot reloads in development).
  globalForPrisma.prisma = created
  return created
}

/**
 * Shared Prisma client. It connects on first use, so the site can still be
 * built (and the public pages served) before a database is configured.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const instance = client() as unknown as Record<string | symbol, unknown>
    const value = instance[property]
    return typeof value === "function" ? value.bind(instance) : value
  },
})
