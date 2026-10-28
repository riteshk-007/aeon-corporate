import Link from "next/link"
import { db } from "@/lib/db"
import { requirePagePermission } from "@/lib/auth/guards"
import { Card, PageHeader, adminBtn, adminInput } from "@/components/admin/ui"
import { cn } from "@/lib/utils"
import { EnquiriesClient, type LeadRow } from "./enquiries-client"

export const metadata = { title: "Enquiries" }

const PAGE_SIZE = 25
const KINDS = [
  { key: "", label: "All" },
  { key: "contact", label: "Contact & services" },
  { key: "partner", label: "Partner" },
  { key: "career", label: "Career" },
  { key: "newsletter", label: "Newsletter" },
] as const
const STATUSES = ["new", "contacted", "closed"] as const

const maskEmail = (email: string | null) => {
  if (!email) return "–"
  const [user, domain] = email.split("@")
  return `${user.slice(0, 2)}${"•".repeat(Math.max(1, user.length - 2))}@${domain}`
}

/** Where the person came from: the service or job they asked about, else the page. */
function fromOf(details: unknown, source: string | null) {
  const d = (details ?? {}) as Record<string, string>
  if (d.service) return { label: d.service, hint: "Service page" }
  if (d.job) return { label: d.job, hint: "Job applied for" }
  return { label: source ?? "–", hint: "Page" }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; status?: string; q?: string; page?: string }>
}) {
  const user = await requirePagePermission("enquiries:view")
  const sp = await searchParams
  const kind = KINDS.some((k) => k.key === sp.kind) ? (sp.kind ?? "") : ""
  const status = (STATUSES as readonly string[]).includes(sp.status ?? "") ? sp.status : undefined
  const q = (sp.q ?? "").trim().slice(0, 80)
  const page = Math.max(1, Number(sp.page) || 1)

  const where = {
    ...(kind ? { kind } : {}),
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q } },
          ],
        }
      : {}),
  }

  const [leads, total, counts] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      select: {
        id: true, kind: true, name: true, email: true, status: true, marketingOptIn: true,
        createdAt: true, retainUntil: true, details: true, source: true,
      },
    }),
    db.lead.count({ where }),
    db.lead.groupBy({ by: ["status"], _count: true }),
  ])
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const count = (s: string) => counts.find((c) => c.status === s)?._count ?? 0

  // Only masked contact details reach the list; the full record is fetched
  // (and logged) when someone opens it.
  const rows: LeadRow[] = leads.map((l) => {
    const from = fromOf(l.details, l.source)
    return {
      id: l.id,
      kind: l.kind,
      name: l.name,
      emailMasked: maskEmail(l.email),
      status: l.status,
      marketingOptIn: l.marketingOptIn,
      createdAt: l.createdAt.toISOString(),
      retainUntil: l.retainUntil.toISOString(),
      from: from.label,
      fromHint: from.hint,
    }
  })

  const href = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    const next = { kind, status, q, page: String(page), ...over }
    for (const [k, v] of Object.entries(next)) if (v) p.set(k, v)
    const s = p.toString()
    return `/admin/enquiries${s ? `?${s}` : ""}`
  }

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Everything people send from the website forms. Each row shows which page or job it came from. Opening a record is logged."
      />

      <div className="mb-4 grid grid-cols-3 gap-3 max-[560px]:gap-2">
        {STATUSES.map((s) => (
          <Link key={s} href={href({ status: status === s ? undefined : s, page: "1" })} className={cn("rounded-2xl border bg-white p-4 transition hover:border-brand max-[560px]:p-3", status === s ? "border-brand ring-2 ring-brand/20" : "border-line")}>
            <span className="block text-[11px] font-black tracking-[.1em] text-mute uppercase max-[560px]:text-[10px]">{s}</span>
            <b className="text-[26px] tracking-[-0.03em] max-[560px]:text-[22px]">{count(s)}</b>
          </Link>
        ))}
      </div>

      <Card className="mb-4 grid gap-3 p-3">
        <div className="flex flex-wrap gap-1.5">
          {KINDS.map((k) => (
            <Link key={k.key} href={href({ kind: k.key || undefined, page: "1" })} aria-current={kind === k.key ? "page" : undefined} className={cn("rounded-lg px-3 py-2 text-[13px] font-bold transition", kind === k.key ? "bg-brand text-white" : "bg-pale text-ink hover:bg-sky")}>
              {k.label}
            </Link>
          ))}
        </div>
        <form method="get" className="flex flex-wrap gap-2">
          {kind && <input type="hidden" name="kind" value={kind} />}
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search name, email or mobile" aria-label="Search enquiries" className={cn(adminInput, "min-w-[200px] flex-1")} />
          <button type="submit" className={adminBtn.primary}>Search</button>
          {(q || status || kind) && <Link href="/admin/enquiries" className={adminBtn.ghost}>Clear</Link>}
        </form>
      </Card>

      <p className="mb-2 text-[12px] text-mute">{total} {total === 1 ? "enquiry" : "enquiries"} found. Handle with care (DPDP Act): use this data only to answer the enquiry, never share it outside the company, and delete a record when the person asks.</p>

      <EnquiriesClient
        leads={rows}
        canEdit={user.permissions.includes("enquiries:edit")}
        canDelete={user.permissions.includes("enquiries:delete")}
      />

      {pages > 1 && (
        <nav className="mt-5 flex items-center justify-between" aria-label="Pagination">
          <Link href={href({ page: String(page - 1) })} aria-disabled={page <= 1} className={cn(adminBtn.ghost, page <= 1 && "pointer-events-none opacity-40")}>Newer</Link>
          <span className="text-[13px] font-semibold text-mute">Page {page} of {pages}</span>
          <Link href={href({ page: String(page + 1) })} aria-disabled={page >= pages} className={cn(adminBtn.ghost, page >= pages && "pointer-events-none opacity-40")}>Older</Link>
        </nav>
      )}
    </>
  )
}
