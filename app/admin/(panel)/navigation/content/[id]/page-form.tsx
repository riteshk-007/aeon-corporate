"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ExternalLink, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge, Card, Field, Spinner } from "@/components/admin/ui"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { ImageField } from "@/components/admin/image-field"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { api } from "@/lib/admin-client"
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, autoSeoDescription, autoSeoTitle } from "@/lib/seo-auto"
import { SECTION_DEFS, sectionLook, type Section } from "@/lib/service-sections"
import { IconPicker } from "@/components/admin/icon-picker"
import { cn } from "@/lib/utils"

export type PageFormValue = {
  title: string
  category: string
  icon: string
  summary: string
  highlights: string[]
  sections: Section[]
  faqs: { q: string; a: string }[]
  heroImageUrl: string | null
  seoTitle: string
  seoDescription: string
  isPublished: boolean
}

export function PageForm({
  id,
  slug,
  initial,
  canDelete,
  autoContent = false,
}: {
  autoContent?: boolean
  id: string
  slug: string
  initial: PageFormValue
  canDelete: boolean
}) {
  const router = useRouter()
  const [v, setV] = useState(initial)
  const [highlights, setHighlights] = useState(initial.highlights.join("\n"))
  const [tab, setTab] = useState<(typeof SECTION_DEFS)[number]["key"]>("overview")
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const set = <K extends keyof PageFormValue>(k: K, val: PageFormValue[K]) => setV((p) => ({ ...p, [k]: val }))

  const def = SECTION_DEFS.find((d) => d.key === tab)!
  const html = (key: string) => v.sections.find((s) => s.key === key)?.html ?? ""
  const cur = (key: string) => v.sections.find((s) => s.key === key)
  /** Update one section (heading, icon or text) without touching the others. */
  const patchSection = (key: (typeof SECTION_DEFS)[number]["key"], patch: Partial<Section>) =>
    set("sections", [...v.sections.filter((s) => s.key !== key), { key, html: cur(key)?.html ?? "", title: cur(key)?.title, icon: cur(key)?.icon, ...patch }])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const body = {
      ...v,
      highlights: highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      faqs: v.faqs.filter((f) => f.q.trim() && f.a.trim()),
    }
    const res = await api("PATCH", `/api/admin/services/${id}`, body, {
      success: v.isPublished ? "Saved. The page is live." : "Saved as draft (not public yet).",
    })
    setBusy(false)
    if (!res.ok) return
    router.refresh()
  }

  const remove = async () => {
    setBusy(true)
    const res = await api("DELETE", `/api/admin/services/${id}`, undefined, { success: "Page deleted" })
    setBusy(false)
    if (!res.ok) return
    router.push("/admin/navigation")
    router.refresh()
  }

  return (
    <form onSubmit={save} className="grid gap-5">
      {autoContent && (
        <Card className="border-amber-200 bg-amber-50 p-4 text-[13px] leading-[1.6] text-amber-900">
          <b>Starter text.</b> This page has automatic starter text that is the same style for every service. Please read it, correct it for this exact service, and save. Until you save it, Google is told not to list this page.
        </Card>
      )}
      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        <Field id="pg-title" label="Page title" required className="sm:col-span-2">
          <Input id="pg-title" required minLength={3} maxLength={120} value={v.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field id="pg-cat" label="Group (category)">
          <Input id="pg-cat" maxLength={80} value={v.category} onChange={(e) => set("category", e.target.value)} />
        </Field>
        <Field id="pg-slug" label="Page address" hint="Fixed once the page is published">
          <Input id="pg-slug" readOnly value={`/services/${slug}`} />
        </Field>
        <div className="sm:col-span-2">
          <IconPicker label="Page icon (shown beside the title)" value={v.icon} onChange={(k) => set("icon", k)} fallback="briefcase" />
        </div>
        <Field id="pg-sum" label="Short summary" hint={`${v.summary.length}/400. Shown under the title.`} className="sm:col-span-2">
          <Textarea id="pg-sum" rows={3} maxLength={400} value={v.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>
        <Field id="pg-high" label="What is included" hint="One point per line. Shown as ticks beside the title." className="sm:col-span-2">
          <Textarea id="pg-high" rows={4} value={highlights} onChange={(e) => setHighlights(e.target.value)} placeholder={"DIN, PAN and SPICe+ filing\nName approval support"} />
        </Field>
        <div className="sm:col-span-2">
          <ImageField label="Overview picture (optional)" scope="service" ownerId={id} value={v.heroImageUrl} onChange={(u) => set("heroImageUrl", u)} />
        </div>
      </Card>

      {/* Sections: one editor at a time, same tabs the visitor sees */}
      <Card className="grid gap-3 p-5">
        <b className="text-[14px]">Page sections</b>
        <div role="tablist" aria-label="Sections" className="flex flex-wrap gap-1.5">
          {SECTION_DEFS.map((d) => {
            const filled = html(d.key).trim() !== ""
            return (
              <button
                key={d.key}
                type="button"
                role="tab"
                aria-selected={tab === d.key}
                onClick={() => setTab(d.key)}
                className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-bold transition", tab === d.key ? "bg-brand text-white" : "bg-pale text-ink hover:bg-sky")}
              >
                {sectionLook({ key: d.key, title: cur(d.key)?.title, icon: cur(d.key)?.icon }).title}
                <span aria-label={filled ? "has content" : "empty"} className={cn("size-1.5 rounded-full", filled ? "bg-emerald-400" : "bg-ink/25")} />
              </button>
            )
          })}
        </div>
        <p className="text-[12px] text-mute">
          <b>{def.title}:</b> {def.hint} A section left empty is hidden on the website. Images are stored in Cloudflare R2.
        </p>
        <div className="grid gap-4 rounded-xl border border-line bg-[#f8fbff] p-3 sm:grid-cols-2">
          <Field id="sec-title" label="Section heading" hint={`Leave empty to use "${def.title}"`}>
            <Input id="sec-title" maxLength={60} value={cur(tab)?.title ?? ""} placeholder={def.title} onChange={(e) => patchSection(tab, { title: e.target.value })} />
          </Field>
          <IconPicker key={tab} label="Section icon" value={cur(tab)?.icon ?? ""} fallback={def.icon} onChange={(k) => patchSection(tab, { icon: k })} />
        </div>
        <RichTextEditor
          key={tab}
          aria-label={def.title}
          value={html(tab)}
          onChange={(h) => patchSection(tab, { html: h })}
          upload={{ scope: "service", ownerId: id }}
          placeholder={`Write the "${def.title}" section…`}
          minHeight={340}
        />
      </Card>

      <Card className="grid gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <b className="text-[14px]">Questions &amp; answers (FAQ)</b>
          <Button type="button" variant="outline" size="sm" disabled={v.faqs.length >= 30} onClick={() => set("faqs", [...v.faqs, { q: "", a: "" }])}><Plus /> Add question</Button>
        </div>
        {v.faqs.length === 0 && <p className="text-[13px] text-mute">No questions yet.</p>}
        {v.faqs.map((f, i) => (
          <div key={i} className="grid gap-2 rounded-xl bg-[#f8fbff] p-3 ring-1 ring-line sm:grid-cols-[1fr_2fr_auto] sm:items-start">
            <Input aria-label={`Question ${i + 1}`} placeholder="Question" maxLength={200} value={f.q} onChange={(e) => set("faqs", v.faqs.map((x, k) => (k === i ? { ...x, q: e.target.value } : x)))} />
            <Textarea aria-label={`Answer ${i + 1}`} rows={2} placeholder="Answer" maxLength={1500} value={f.a} onChange={(e) => set("faqs", v.faqs.map((x, k) => (k === i ? { ...x, a: e.target.value } : x)))} />
            <Button type="button" variant="ghost" size="icon-sm" className="text-destructive" aria-label={`Remove question ${i + 1}`} onClick={() => set("faqs", v.faqs.filter((_, k) => k !== i))}><Trash2 /></Button>
          </div>
        ))}
      </Card>

      <Card className="grid gap-4 p-5">
        <div>
          <b className="text-[14px]">Google search (SEO)</b>
          <p className="mt-1 text-[12px] text-mute">
            You can leave both fields empty: a good title and description are made automatically from the page name. Fill them in only if you want your own words.
          </p>
        </div>
        <Field id="pg-seo-t" label="Search title" hint={`${v.seoTitle.length}/${SEO_TITLE_MAX} characters. Empty = automatic.`}>
          <Input id="pg-seo-t" maxLength={70} value={v.seoTitle} placeholder={autoSeoTitle(v.title)} onChange={(e) => set("seoTitle", e.target.value)} />
        </Field>
        <Field id="pg-seo-d" label="Search description" hint={`${v.seoDescription.length}/${SEO_DESCRIPTION_MAX} characters. Empty = automatic.`}>
          <Textarea id="pg-seo-d" rows={2} maxLength={170} value={v.seoDescription} placeholder={autoSeoDescription(v.title, v.summary)} onChange={(e) => set("seoDescription", e.target.value)} />
        </Field>
        <div className="rounded-xl border border-line bg-white p-4" aria-label="How it looks on Google">
          <span className="text-[11px] font-black tracking-[.1em] text-mute uppercase">Preview on Google</span>
          <p className="mt-2 truncate text-[12px] text-mute">{(process.env.NEXT_PUBLIC_SITE_URL ?? "https://aeoncorporate.com").replace(/^https?:\/\//, "")} › services › {slug}</p>
          <p className="mt-0.5 text-[18px] leading-snug text-[#1a0dab] [overflow-wrap:anywhere]">{(v.seoTitle.trim() || autoSeoTitle(v.title)) + " | Aeon Corporate"}</p>
          <p className="mt-1 text-[13px] leading-[1.5] text-[#4d5156] [overflow-wrap:anywhere]">{v.seoDescription.trim() || autoSeoDescription(v.title, v.summary)}</p>
          {(v.seoTitle.trim() === "" || v.seoDescription.trim() === "") && <Badge tone="blue">Made automatically</Badge>}
        </div>
      </Card>

      <Card className="flex flex-wrap items-center gap-3 p-5">
        <Switch id="pg-pub" checked={v.isPublished} onCheckedChange={(c) => set("isPublished", c)} />
        <Label htmlFor="pg-pub" className="text-[14px] font-semibold">
          Published <span className="font-normal text-mute">(off = draft; its menu link opens Contact Us)</span>
        </Label>
        {v.isPublished ? <Badge tone="green">Live</Badge> : <Badge tone="gray">Draft</Badge>}
        {v.isPublished && (
          <a href={`/services/${slug}`} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
            View on site <ExternalLink size={14} />
          </a>
        )}
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={busy}>{busy && <Spinner />} {busy ? "Saving…" : "Save page"}</Button>
        <Button type="button" size="lg" variant="outline" onClick={() => router.push("/admin/navigation")}>Back to menus</Button>
        {canDelete && (<Button type="button" size="lg" variant="destructive" disabled={busy} className="ml-auto" onClick={() => setConfirmOpen(true)}>Delete page</Button>)}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this page?"
        description="The page and its images (also removed from Cloudflare R2) will be deleted. Its menu link will open Contact Us."
        onConfirm={() => { setConfirmOpen(false); void remove() }}
      />
    </form>
  )
}
