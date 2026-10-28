"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, Field, Spinner, adminInput } from "@/components/admin/ui"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { api } from "@/lib/admin-client"

export type JobFormValue = {
  title: string
  location: string
  type: string
  openings: number
  icon: string
  skills: string[]
  summary: string
  descriptionHtml: string
  isOpen: boolean
}

export const emptyJob: JobFormValue = {
  title: "",
  location: "Head Office",
  type: "Full-time",
  openings: 1,
  icon: "briefcase",
  skills: [],
  summary: "",
  descriptionHtml: "",
  isOpen: true,
}

const ICONS = ["briefcase", "accountant", "trademark", "chip", "bank", "workflow", "bulb", "target"]
const TYPES = ["Full-time", "Part-time", "Internship", "Contract"]

export function JobForm({
  id,
  initial,
  canDelete,
}: {
  id?: string
  initial: JobFormValue
  canDelete: boolean
}) {
  const router = useRouter()
  const [v, setV] = useState(initial)
  const [skills, setSkills] = useState(initial.skills.join(", "))
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const set = <K extends keyof JobFormValue>(k: K, val: JobFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const body = {
      ...v,
      openings: Number(v.openings) || 1,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    }
    const res = id
      ? await api("PATCH", `/api/admin/jobs/${id}`, body, { success: "Job saved" })
      : await api("POST", "/api/admin/jobs", body, { success: "Job created" })
    setBusy(false)
    if (!res.ok) return
    router.push("/admin/careers")
    router.refresh()
  }

  const remove = async () => {
    if (!id) return
    setBusy(true)
    const res = await api("DELETE", `/api/admin/jobs/${id}`, undefined, { success: "Job deleted" })
    setBusy(false)
    if (!res.ok) return
    router.push("/admin/careers")
    router.refresh()
  }

  return (
    <form onSubmit={save} className="grid gap-5">
      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        <Field id="job-title" label="Job title" required className="sm:col-span-2">
          <Input id="job-title" required minLength={3} maxLength={120} value={v.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Compliance Executive" />
        </Field>
        <Field id="job-location" label="Location" required>
          <Input id="job-location" required maxLength={80} value={v.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <Field id="job-type" label="Type">
          <select id="job-type" value={v.type} onChange={(e) => set("type", e.target.value)} className={adminInput}>
            {TYPES.map((t) => (<option key={t}>{t}</option>))}
          </select>
        </Field>
        <Field id="job-openings" label="Number of openings">
          <Input id="job-openings" type="number" min={1} max={99} value={v.openings} onChange={(e) => set("openings", Number(e.target.value))} />
        </Field>
        <Field id="job-icon" label="Icon">
          <select id="job-icon" value={v.icon} onChange={(e) => set("icon", e.target.value)} className={adminInput}>
            {ICONS.map((t) => (<option key={t}>{t}</option>))}
          </select>
        </Field>
        <Field id="job-skills" label="Key skills" hint="Separate with commas" className="sm:col-span-2">
          <Input id="job-skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="GST, ROC filings, MS Office" />
        </Field>
        <Field id="job-summary" label="Short summary" hint={`${v.summary.length}/300 characters, shown on the job card`} className="sm:col-span-2">
          <Textarea id="job-summary" maxLength={300} rows={2} value={v.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>
        <div className="flex items-center gap-3 sm:col-span-2">
          <Switch id="job-open" checked={v.isOpen} onCheckedChange={(c) => set("isOpen", c)} />
          <Label htmlFor="job-open" className="text-[14px] font-semibold">
            Open for applications <span className="font-normal text-mute">(off hides it from the website)</span>
          </Label>
        </div>
      </Card>

      <Card className="p-5">
        <Label htmlFor="job-desc" className="mb-2 text-[13px] font-bold text-ink">Job description</Label>
        <RichTextEditor
          id="job-desc"
          aria-label="Job description"
          value={v.descriptionHtml}
          onChange={(html) => set("descriptionHtml", html)}
          upload={{ scope: "job", ownerId: id }}
          placeholder="Responsibilities, requirements, benefits…"
          minHeight={320}
        />
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={busy}>
          {busy && <Spinner />} {busy ? "Saving…" : id ? "Save changes" : "Create job"}
        </Button>
        <Button type="button" size="lg" variant="outline" onClick={() => router.push("/admin/careers")}>Cancel</Button>
        {id && canDelete && (
          <Button type="button" size="lg" variant="destructive" disabled={busy} onClick={() => setConfirmOpen(true)} className="ml-auto">
            Delete job
          </Button>
        )}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this job?"
        description="The job and all its images (also removed from Cloudflare R2) will be deleted. This cannot be undone."
        onConfirm={() => { setConfirmOpen(false); void remove() }}
      />
    </form>
  )
}
