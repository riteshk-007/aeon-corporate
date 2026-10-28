"use client"

import { Fragment, useState } from "react"
import { useRouter } from "next/navigation"
import { Badge, Card, Spinner, adminBtn } from "@/components/admin/ui"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { api, formatDate } from "@/lib/admin-client"

export type LeadRow = {
  id: string
  kind: string
  name: string | null
  emailMasked: string
  status: string
  marketingOptIn: boolean
  createdAt: string
  retainUntil: string
  from: string
  fromHint: string
}

type Full = {
  email: string | null
  phone: string | null
  state: string | null
  message: string | null
  details: Record<string, string> | null
  consentAt: string
  consentPrivacyVersion: string
  consentTermsVersion: string
  source: string | null
}

const statusTone = { new: "blue", contacted: "amber", closed: "gray" } as const
const KIND_LABEL: Record<string, string> = {
  contact: "Contact", partner: "Partner", career: "Career", newsletter: "Newsletter",
}
const DETAIL_LABEL: Record<string, string> = {
  service: "Service page", callTime: "Best time to call", city: "City", resumeUrl: "Resume (file)", resumeName: "Resume file name", job: "Job applied for", jobId: "Job ID", experience: "Experience", occupation: "Occupation",
}

function Info({ label, value, wide }: { label: string; value: string | null; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-[11px] font-black tracking-[.1em] text-mute uppercase">{label}</dt>
      <dd className="mt-0.5 [overflow-wrap:anywhere]">
        {value && /^https:\/\//.test(value) ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="font-bold text-brand hover:underline">Open file</a>
        ) : (
          value || "–"
        )}
      </dd>
    </div>
  )
}

export function EnquiriesClient({
  leads,
  canEdit,
  canDelete,
}: {
  leads: LeadRow[]
  canEdit: boolean
  canDelete: boolean
}) {
  const router = useRouter()
  const [openId, setOpenId] = useState<string | null>(null)
  const [full, setFull] = useState<Full | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const open = async (id: string) => {
    if (openId === id) {
      setOpenId(null)
      setFull(null)
      return
    }
    setLoadingId(id)
    const res = await api<{ lead: Full }>("GET", `/api/admin/enquiries/${id}`)
    setLoadingId(null)
    if (!res.ok) return
    setOpenId(id)
    setFull(res.data.lead)
  }

  const setStatus = async (id: string, status: string) => {
    const res = await api("PATCH", `/api/admin/enquiries/${id}`, { status }, { success: `Marked ${status}` })
    if (!res.ok) return
    router.refresh()
  }

  const remove = async (id: string) => {
    const res = await api("DELETE", `/api/admin/enquiries/${id}`, undefined, { success: "Enquiry deleted" })
    if (!res.ok) return
    setOpenId(null)
    setFull(null)
    router.refresh()
  }

  const detail = (l: LeadRow) =>
    openId === l.id && full ? (
      <div className="rounded-xl bg-pale/50 p-4">
        <dl className="grid gap-3 text-[13px] sm:grid-cols-2">
          <Info label="Email" value={full.email} />
          <Info label="Mobile" value={full.phone} />
          <Info label="State" value={full.state} />
          <Info label="Came from page" value={full.source} />
          {full.details && Object.entries(full.details).map(([k, v]) => <Info key={k} label={DETAIL_LABEL[k] ?? k} value={v} />)}
          <Info label="Message" value={full.message} wide />
          <Info
            label="Consent"
            wide
            value={`Given ${formatDate(full.consentAt)} (Privacy ${full.consentPrivacyVersion}, Terms ${full.consentTermsVersion})${l.marketingOptIn ? "; agreed to updates" : "; no marketing"}. Kept until ${formatDate(l.retainUntil)}.`}
          />
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          {canEdit &&
            (["new", "contacted", "closed"] as const)
              .filter((s) => s !== l.status)
              .map((s) => (
                <button key={s} type="button" onClick={() => setStatus(l.id, s)} className={adminBtn.ghost}>Mark {s}</button>
              ))}
          {canDelete && (
            <button type="button" onClick={() => setDeleteId(l.id)} className={adminBtn.danger}>Delete (erase data)</button>
          )}
        </div>
      </div>
    ) : null

  const viewBtn = (l: LeadRow) => (
    <button type="button" disabled={loadingId === l.id} onClick={() => open(l.id)} className={adminBtn.ghost}>
      {loadingId === l.id && <Spinner />}
      {openId === l.id ? "Hide" : "View"}
    </button>
  )

  if (leads.length === 0) {
    return <Card className="p-10 text-center text-[14px] text-mute">No enquiries match. When someone sends a form on the website, it appears here.</Card>
  }

  return (
    <>
      {/* Large screens: table */}
      <Card className="overflow-hidden max-[760px]:hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead className="bg-pale text-[11px] font-black tracking-[.12em] text-mute uppercase">
              <tr>
                <th className="px-5 py-3.5">Received</th>
                <th className="px-3 py-3.5">Type</th>
                <th className="px-3 py-3.5">Name</th>
                <th className="px-3 py-3.5">About / from</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leads.map((l) => (
                <Fragment key={l.id}>
                  <tr className="align-top hover:bg-pale/50">
                    <td className="px-5 py-3 whitespace-nowrap text-mute">{formatDate(l.createdAt)}</td>
                    <td className="px-3 py-3"><Badge tone="navy">{KIND_LABEL[l.kind] ?? l.kind}</Badge></td>
                    <td className="px-3 py-3"><b className="block">{l.name ?? "–"}</b><span className="font-mono text-[11px] text-mute">{l.emailMasked}</span></td>
                    <td className="max-w-[240px] px-3 py-3"><span className="block truncate font-semibold" title={l.from}>{l.from}</span><span className="text-[11px] text-mute">{l.fromHint}</span></td>
                    <td className="px-3 py-3"><Badge tone={statusTone[l.status as keyof typeof statusTone] ?? "gray"}>{l.status}</Badge></td>
                    <td className="px-5 py-3 text-right">{viewBtn(l)}</td>
                  </tr>
                  {openId === l.id && full && (
                    <tr><td colSpan={6} className="px-5 pb-4">{detail(l)}</td></tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Phones: one card per enquiry */}
      <ul className="grid gap-3 min-[761px]:hidden">
        {leads.map((l) => (
          <li key={l.id}>
            <Card className="grid gap-3 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge tone="navy">{KIND_LABEL[l.kind] ?? l.kind}</Badge>
                <Badge tone={statusTone[l.status as keyof typeof statusTone] ?? "gray"}>{l.status}</Badge>
              </div>
              <div className="min-w-0">
                <b className="block text-[15px]">{l.name ?? "Newsletter signup"}</b>
                <span className="font-mono text-[11px] text-mute">{l.emailMasked}</span>
              </div>
              <p className="text-[13px]"><span className="text-mute">{l.fromHint}: </span><b className="[overflow-wrap:anywhere]">{l.from}</b></p>
              <p className="text-[12px] text-mute">{formatDate(l.createdAt)}</p>
              {viewBtn(l)}
              {detail(l)}
            </Card>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Erase this person's data?"
        description="This permanently deletes the enquiry and cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteId) void remove(deleteId)
          setDeleteId(null)
        }}
      />
    </>
  )
}
