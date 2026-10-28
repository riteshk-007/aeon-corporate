"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowDown, ArrowUp, ChevronRight, FilePenLine, ListPlus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge, Card, Spinner, adminInput } from "@/components/admin/ui"
import { api } from "@/lib/admin-client"
import { SITE_PAGES, isSafeHref } from "@/lib/site-pages"
import { cn } from "@/lib/utils"

type PageOption = { path: string; name: string; id?: string }
type MenuLink = { label: string; href: string }
type Category = { label: string; href: string; links: MenuLink[] }
type Top = { label: string; href: string; categories: Category[] }

const CUSTOM = "__custom__"

function move<T>(list: T[], i: number, dir: -1 | 1) {
  const j = i + dir
  if (j < 0 || j >= list.length) return list
  const next = [...list]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

/** Pick which page a link opens from a list; "Other" lets you type any link. */
function PagePicker({
  value,
  onChange,
  disabled,
  label,
  services,
}: {
  services: PageOption[]
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  label: string
}) {
  const known = SITE_PAGES.some((p) => p.path === value) || services.some((p) => p.path === value)
  const [custom, setCustom] = useState(value !== "" && !known)
  const selected = custom ? CUSTOM : value
  return (
    <div className="grid min-w-0 gap-1.5">
      <select
        aria-label={label}
        disabled={disabled}
        value={selected}
        className={adminInput}
        onChange={(e) => {
          if (e.target.value === CUSTOM) {
            setCustom(true)
            onChange("")
          } else {
            setCustom(false)
            onChange(e.target.value)
          }
        }}
      >
        <option value="">No link</option>
        <optgroup label="Site pages">
          {SITE_PAGES.map((p) => (
            <option key={p.path} value={p.path}>
              {p.name}
            </option>
          ))}
        </optgroup>
        {services.length > 0 && (
          <optgroup label="Service pages">
            {services.map((p) => (
              <option key={p.path} value={p.path}>
                {p.name}
              </option>
            ))}
          </optgroup>
        )}
        <option value={CUSTOM}>Other link (type it)…</option>
      </select>
      {custom && (
        <Input
          aria-label={`${label} (custom)`}
          disabled={disabled}
          value={value}
          placeholder="/about#team  or  https://example.com"
          aria-invalid={value.trim() !== "" && !isSafeHref(value.trim())}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

export function MenuEditor({
  initial,
  canEdit,
  services: initialServices,
  canEditPages,
  canCreatePages,
}: {
  initial: Top[]
  canEdit: boolean
  services: PageOption[]
  canEditPages: boolean
  canCreatePages: boolean
}) {
  const router = useRouter()
  const [tops, setTops] = useState<Top[]>(initial)
  const [ti, setTi] = useState(0)
  const [ci, setCi] = useState(0)
  const [bulk, setBulk] = useState("")
  const [services, setServices] = useState(initialServices)
  const [opening, setOpening] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const ro = !canEdit

  const topIdx = Math.min(ti, Math.max(tops.length - 1, 0))
  const top = tops[topIdx]
  const catIdx = top ? Math.min(ci, Math.max(top.categories.length - 1, 0)) : 0
  const cat = top?.categories[catIdx]

  const change = (fn: (t: Top[]) => void) => {
    setTops((prev) => {
      const next = structuredClone(prev)
      fn(next)
      return next
    })
    setDirty(true)
  }

  const problems = useMemo(() => {
    const out = new Set<string>()
    tops.forEach((t) => {
      if (!t.label.trim()) out.add("A menu has no name")
      t.categories.forEach((c) => {
        if (!c.label.trim()) out.add(`A category in "${t.label}" has no name`)
        c.links.forEach((l) => {
          if (!l.label.trim()) out.add(`A link in "${c.label}" has no name`)
          if (l.href.trim() && !isSafeHref(l.href.trim())) out.add(`"${l.label}" has an invalid link`)
        })
      })
    })
    return [...out]
  }, [tops])

  const save = async () => {
    setSaving(true)
    const res = await api("PUT", "/api/admin/menu", { tops }, { success: "Menu saved. It is live on the website now." })
    setSaving(false)
    if (!res.ok) return
    setDirty(false)
    router.refresh()
  }

  /** Open the content editor of a link's page; makes the page first when the link has none. */
  const openPage = async (ci2: number, li: number) => {
    const link = tops[topIdx].categories[ci2].links[li]
    const key = `${ci2}-${li}`
    if (dirty) return void toast.info("Save the menu first, then open the page.")
    setOpening(key)
    let target = services.find((p) => p.path === link.href)
    if (!target?.id) {
      if (!link.label.trim()) { setOpening(null); return void toast.error("Give the link a name first") }
      const made = await api<{ service: { id: string; slug: string } }>("POST", "/api/admin/services", {
        title: link.label.trim(),
        category: tops[topIdx].categories[ci2].label,
        icon: "", summary: "", highlights: [], sections: [], faqs: [], heroImageUrl: null,
        seoTitle: "", seoDescription: "", isPublished: false,
      })
      if (!made.ok) return void setOpening(null)
      const path = `/services/${made.data.service.slug}`
      target = { path, name: link.label, id: made.data.service.id }
      setServices((all) => [...all, target!])
      // Point the link at its new page and save, so nothing is lost on the next screen.
      const nextTops = structuredClone(tops)
      nextTops[topIdx].categories[ci2].links[li].href = path
      const saved = await api("PUT", "/api/admin/menu", { tops: nextTops })
      if (!saved.ok) return void setOpening(null)
    }
    router.push(`/admin/navigation/content/${target.id}`)
  }

  const addBulk = () => {
    const names = bulk.split("\n").map((s) => s.trim()).filter(Boolean)
    if (!names.length || !cat) return
    change((t) => {
      t[topIdx].categories[catIdx].links.push(...names.map((label) => ({ label, href: "/contact-us" })))
    })
    setBulk("")
  }

  return (
    <div className="grid gap-5">
      {/* 1. Which header menu */}
      <Card className="p-4">
        <p className="mb-2 text-[12px] font-black tracking-[.12em] text-mute uppercase">1. Header menus</p>
        <div className="flex flex-wrap items-center gap-2">
          {tops.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setTi(i); setCi(0) }}
              aria-pressed={i === topIdx}
              className={cn("rounded-lg px-4 py-2 text-[14px] font-bold transition", i === topIdx ? "bg-brand text-white" : "bg-pale text-ink hover:bg-sky")}
            >
              {t.label || "Untitled"}
            </button>
          ))}
          {!ro && tops.length < 8 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                change((t) => { t.push({ label: "New menu", href: "", categories: [] }) })
                setTi(tops.length)
                setCi(0)
              }}
            >
              <Plus /> Add menu
            </Button>
          )}
        </div>
      </Card>

      {!top ? (
        <Card className="p-8 text-center text-[14px] text-mute">
          No menu yet. Click “Add menu”. Until then the website shows its built-in menu.
        </Card>
      ) : (
        <>
          {/* Menu name + where clicking it goes */}
          <Card className="grid gap-4 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="grid gap-1.5 text-[13px] font-bold">
              Menu name
              <Input value={top.label} disabled={ro} maxLength={80} onChange={(e) => change((t) => { t[topIdx].label = e.target.value })} />
            </label>
            <div className="grid gap-1.5 text-[13px] font-bold">
              When someone clicks the menu name, open
              <PagePicker services={services} key={`top-${topIdx}`} label="Menu page" value={top.href} disabled={ro} onChange={(v) => change((t) => { t[topIdx].href = v })} />
            </div>
            {!ro && (
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" aria-label="Move menu left" disabled={topIdx === 0} onClick={() => { change((t) => { const m = move(t, topIdx, -1); t.splice(0, t.length, ...m) }); setTi(topIdx - 1) }}><ArrowUp className="-rotate-90" /></Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Move menu right" disabled={topIdx === tops.length - 1} onClick={() => { change((t) => { const m = move(t, topIdx, 1); t.splice(0, t.length, ...m) }); setTi(topIdx + 1) }}><ArrowDown className="-rotate-90" /></Button>
                <Button type="button" variant="destructive" size="icon" aria-label="Delete this menu" onClick={() => { change((t) => { t.splice(topIdx, 1) }); setTi(0); setCi(0) }}><Trash2 /></Button>
              </div>
            )}
          </Card>

          {/* 2 + 3. Same layout as the website dropdown */}
          <Card className="overflow-hidden">
            <div className="grid min-h-[360px] md:grid-cols-[270px_1fr]">
              {/* Left: categories */}
              <div className="border-b border-line bg-[#f6faff] p-3 md:border-r md:border-b-0">
                <p className="mb-2 px-1 text-[12px] font-black tracking-[.12em] text-mute uppercase">2. Categories (left side)</p>
                <ul className="grid gap-1">
                  {top.categories.map((c, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setCi(i)}
                        aria-pressed={i === catIdx}
                        className={cn("flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-[14px] font-semibold transition", i === catIdx ? "bg-brand text-white shadow-[0_8px_18px_rgba(27,95,217,.25)]" : "text-ink hover:bg-pale")}
                      >
                        <span className="truncate">{c.label || "Untitled"}</span>
                        <ChevronRight size={15} className="shrink-0 opacity-70" />
                      </button>
                    </li>
                  ))}
                </ul>
                {!ro && top.categories.length < 20 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() => {
                      change((t) => { t[topIdx].categories.push({ label: "New category", href: "", links: [] }) })
                      setCi(top.categories.length)
                    }}
                  >
                    <Plus /> Add category
                  </Button>
                )}
              </div>

              {/* Right: links of the chosen category */}
              <div className="p-4 sm:p-5">
                {!cat ? (
                  <p className="text-[14px] text-mute">Add a category on the left to start adding links.</p>
                ) : (
                  <div className="grid gap-4">
                    <div className="flex flex-wrap items-end gap-3">
                      <label className="grid min-w-[200px] flex-1 gap-1.5 text-[13px] font-bold">
                        Category name
                        <Input value={cat.label} disabled={ro} maxLength={80} onChange={(e) => change((t) => { t[topIdx].categories[catIdx].label = e.target.value })} />
                      </label>
                      {!ro && (
                        <div className="flex gap-1">
                          <Button type="button" variant="ghost" size="icon" aria-label="Move category up" disabled={catIdx === 0} onClick={() => { change((t) => { t[topIdx].categories = move(t[topIdx].categories, catIdx, -1) }); setCi(catIdx - 1) }}><ArrowUp /></Button>
                          <Button type="button" variant="ghost" size="icon" aria-label="Move category down" disabled={catIdx === top.categories.length - 1} onClick={() => { change((t) => { t[topIdx].categories = move(t[topIdx].categories, catIdx, 1) }); setCi(catIdx + 1) }}><ArrowDown /></Button>
                          <Button type="button" variant="destructive" size="icon" aria-label="Delete this category" onClick={() => { change((t) => { t[topIdx].categories.splice(catIdx, 1) }); setCi(0) }}><Trash2 /></Button>
                        </div>
                      )}
                    </div>

                    <p className="text-[12px] font-black tracking-[.12em] text-mute uppercase">3. Links shown on the right</p>
                    <ul className="grid gap-2">
                      {cat.links.map((l, li) => (
                        <li key={li} className="grid gap-2 rounded-xl bg-[#f8fbff] p-2.5 ring-1 ring-line sm:grid-cols-[1fr_1fr_auto] sm:items-start">
                          <Input aria-label="Link name" placeholder="Link name (what people read)" value={l.label} disabled={ro} maxLength={80} onChange={(e) => change((t) => { t[topIdx].categories[catIdx].links[li].label = e.target.value })} />
                          <PagePicker services={services} key={`l-${topIdx}-${catIdx}-${li}`} label="Page this link opens" value={l.href} disabled={ro} onChange={(v) => change((t) => { t[topIdx].categories[catIdx].links[li].href = v })} />
                          <div className="flex flex-wrap items-center gap-0.5">
                          {canEditPages && (
                            <Button type="button" variant="outline" size="sm" disabled={opening === `${catIdx}-${li}`} onClick={() => openPage(catIdx, li)}>
                              {opening === `${catIdx}-${li}` ? <Spinner /> : <FilePenLine />} Page content
                            </Button>
                          )}
                          {!ro && (
                            <div className="flex gap-0.5">
                              <Button type="button" variant="ghost" size="icon-sm" aria-label="Move link up" disabled={li === 0} onClick={() => change((t) => { t[topIdx].categories[catIdx].links = move(t[topIdx].categories[catIdx].links, li, -1) })}><ArrowUp /></Button>
                              <Button type="button" variant="ghost" size="icon-sm" aria-label="Move link down" disabled={li === cat.links.length - 1} onClick={() => change((t) => { t[topIdx].categories[catIdx].links = move(t[topIdx].categories[catIdx].links, li, 1) })}><ArrowDown /></Button>
                              <Button type="button" variant="ghost" size="icon-sm" aria-label="Delete link" className="text-destructive" onClick={() => change((t) => { t[topIdx].categories[catIdx].links.splice(li, 1) })}><Trash2 /></Button>
                            </div>
                          )}
                          </div>
                        </li>
                      ))}
                      {cat.links.length === 0 && <li className="text-[13px] text-mute">No links yet.</li>}
                    </ul>

                    {!ro && cat.links.length < 150 && (
                      <div className="grid gap-3 rounded-xl border border-dashed border-line p-3">
                        <Button type="button" variant="outline" className="w-fit" onClick={() => change((t) => { t[topIdx].categories[catIdx].links.push({ label: "", href: "" }) })}>
                          <Plus /> Add one link
                        </Button>
                        <div className="grid gap-2">
                          <label htmlFor="bulk" className="text-[13px] font-bold">Add many links at once <span className="font-normal text-mute">(one name per line; they open Contact Us until you change them)</span></label>
                          <Textarea id="bulk" rows={3} value={bulk} onChange={(e) => setBulk(e.target.value)} placeholder={"Trademark Registration\nTrademark Renewal"} />
                          <Button type="button" variant="secondary" className="w-fit" disabled={!bulk.trim()} onClick={addBulk}><ListPlus /> Add these links</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </>
      )}

      {problems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-900">
          <b>Fix these before saving:</b>
          <ul className="mt-1 list-disc pl-5">{problems.slice(0, 5).map((p) => (<li key={p}>{p}</li>))}</ul>
        </Card>
      )}

      {!ro && (
        <div className="sticky bottom-3 z-20 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white/95 p-3 shadow-[0_10px_30px_rgba(11,27,77,.12)] backdrop-blur">
          <Button type="button" size="lg" disabled={saving || !dirty || problems.length > 0} onClick={save}>
            {saving && <Spinner />} {saving ? "Saving…" : "Save menu"}
          </Button>
          {dirty ? <Badge tone="amber">Not saved yet</Badge> : <Badge tone="green">Saved</Badge>}
          <span className="text-[12px] text-mute">After saving, the website header updates right away.</span>
        </div>
      )}
    </div>
  )
}
