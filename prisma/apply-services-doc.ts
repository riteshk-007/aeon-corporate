/**
 * Imports the client's written page content (SERVICES_16.11.2026.docx, parsed to JSON) into the service pages.
 *   DOC_PAGES=<path to pages.json> pnpm exec tsx prisma/apply-services-doc.ts
 * Each doc page is matched to the header menu link with the same name, so the page that opens from the menu gets the text.
 */
import "dotenv/config"
import fs from "node:fs"
import { db } from "../lib/db"
import { getMenu } from "../lib/menu"
import { sanitizeRich } from "../lib/rich-text"

type Ln = { st: string; t: string }
type Page = { h: number; cand: string[]; secs: Record<string, Ln[]> }
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const norm = (s: string) => s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim()
const tok = (s: string) => new Set(norm(s).replace(/\b(services?|in india|advisory|and facilitation support|support|for startups|the|a)\b/g, " ").split(" ").filter(Boolean))
const jac = (a: Set<string>, b: Set<string>) => { let i = 0; a.forEach((x) => b.has(x) && i++); return i / (a.size + b.size - i || 1) }

const DROP = /^(suggested (cta|closing)|secondary cta|primary cta|cta\b|call to action:|suggested cta buttons|supporting tagline label)/i
const buttons = (t: string) => /\S {2,}\S/.test(t) && t.length < 130
const strip = (t: string) => t.replace(/^(headline|subheadline|supporting tagline|tagline)\s*:\s*/i, "")
const clean = (ls: Ln[]) => ls.filter((l) => l.t && !DROP.test(l.t) && !buttons(l.t)).map((l) => ({ ...l, t: strip(l.t) }))
const isNum = (t: string) => /^\d{1,2}\s*[.)]\s+\S/.test(t)
const unnum = (t: string) => t.replace(/^\d{1,2}\s*[.)]\s+/, "")

/** Button labels the client wrote ("Suggested CTA: A | B", or a line of two labels). */
function btnsOf(ls: Ln[]) {
  const out: string[] = []
  const add = (v: string) => v.split(/s*|s*|s{2,}/).map((x) => x.trim()).filter((x) => x.length > 2 && x.length < 40).forEach((x) => !out.includes(x) && out.push(x))
  ls.forEach((l, i) => {
    const m = /^(?:suggested |primary |secondary )?(?:cta(?: buttons?)?|call to action)s*:s*(.*)$/i.exec(l.t)
    if (m) add(m[1] || ls[i + 1]?.t || "")
    else if (buttons(l.t) && !/[.!?]$/.test(l.t)) add(l.t)
  })
  const t = out.slice(0, 2).join("|")
  return t.length <= 60 ? t : out[0] ?? ""
}

function blocks(ls0: Ln[]) {
  const ls = clean(ls0)
  let out = ""
  let items: string[] = []
  let listMode = false
  const flush = () => { if (items.length) out += `<ul>${items.join("")}</ul>`; items = [] }
  for (const { st, t } of ls) {
    const label = /^[-•–]\s*(.+)$/.exec(t)
    const body = label ? label[1] : t
    const kv = /^([^:.]{3,80}):\s+(.+)$/.exec(body)
    if (st.startsWith("Heading") && t.length < 140) { flush(); listMode = false; out += `<h3>${esc(t)}</h3>`; continue }
    if (isNum(t) && t.length <= 110) { flush(); listMode = false; out += `<h4>${esc(unnum(t))}</h4>`; continue }
    if (t.endsWith(":") && t.length < 120) { flush(); out += `<p><strong>${esc(t)}</strong></p>`; listMode = true; continue }
    if (label || kv) { items.push(kv ? `<li><strong>${esc(kv[1])}:</strong> ${esc(kv[2])}</li>` : `<li>${esc(body)}</li>`); continue }
    if (listMode && t.length <= 170) { items.push(`<li>${esc(t)}</li>`); continue }
    flush(); listMode = false; out += `<p>${esc(t)}</p>`
  }
  flush()
  return out
}

/** Steps: a short line starts a step, the lines after it are its description. */
function steps(ls0: Ln[], tag: "ol" | "ul") {
  const ls = clean(ls0)
  const intro: string[] = []
  const list: { t: string; d: string[] }[] = []
  for (const { st, t } of ls) {
    const title = isNum(t) ? t.length <= 130 : t.length <= 82 && !/[.!?:]$/.test(t) && !st.startsWith("Heading")
    if (st.startsWith("Heading") && !list.length) { intro.push(`<h3>${esc(t)}</h3>`); continue }
    if (title) list.push({ t: unnum(t), d: [] })
    else if (!list.length) intro.push(`<p>${esc(t)}</p>`)
    else list[list.length - 1].d.push(t)
  }
  let closing = ""
  const last = list[list.length - 1]
  if (last && last.d.length > 1) closing = `<p>${esc(last.d.pop()!)}</p>`
  const li = list.map((x) => `<li><strong>${esc(x.t)}</strong>${x.d.length ? `<br>${esc(x.d.join(" "))}` : ""}</li>`).join("")
  return intro.join("") + (li ? `<${tag}>${li}</${tag}>` : "") + closing
}

function faqs(ls0: Ln[]) {
  const out: { q: string; a: string }[] = []
  for (const { t } of clean(ls0)) {
    if (t.endsWith("?") && t.length <= 200) out.push({ q: t, a: "" })
    else if (out.length) out[out.length - 1].a += (out[out.length - 1].a ? "\n" : "") + t
  }
  return out.filter((f) => f.a).slice(0, 30).map((f) => ({ q: f.q, a: f.a.length > 1500 ? f.a.slice(0, f.a.lastIndexOf(".", 1490) + 1) || f.a.slice(0, 1500) : f.a }))
}

async function main() {
  const pages: Page[] = JSON.parse(fs.readFileSync(process.env.DOC_PAGES!, "utf8"))
  const menu = await getMenu()
  const targets: { label: string; href: string }[] = []
  for (const t of menu) for (const c of t.categories) { if (c.href.startsWith("/services/")) targets.push({ label: c.label, href: c.href }); for (const l of c.links) if (l.href.startsWith("/services/")) targets.push(l) }
  const OVERRIDE: Record<number, string> = {
    9: "Intellectual Property Rights", 11: "Incorporation & Registration", 17: "Secretarial Audit & Due Diligence",
    26: "Due Diligence", 47: "AIF Registration", 48: "AIF Investment Support", 49: "AIF Lifecycle & Compliance Support", 50: "AIF Exit Support",
    64: "Financial Modelling", 65: "Financial Process Outsourcing", 66: "Business Plan", 70: "Secretarial and Compliances: Monthly/Annual Retainership", 71: "Legal Retainership: Monthly/Annual",
    61: "", 57: "GIFT IFSC Setup Assistance", 60: "Start Your Business: Planning, Structuring and Incorporation", 44: "IRDA Compliance for Insurance Company",
  }
  // pages 64-66 belong to the Virtual CFO group (separate pages), 24/25/27 to Finance & Accounts
  const done = new Set<string>()
  let ok = 0
  for (let n = 0; n < pages.length; n++) {
    const p = pages[n]
    let want = OVERRIDE[n]
    if (want === "") continue
    let tgt: { label: string; href: string } | undefined
    if (n >= 64 && n <= 66) {
      tgt = targets.find((x) => x.href.includes("for-startups") && norm(x.label) === norm(want))
    } else {
      if (!want) { let best = 0; for (const c of p.cand.slice(0, 4)) { if (c.length > 110) continue; for (const x of targets) { const sc = jac(tok(c), tok(x.label)); if (sc > best) { best = sc; want = x.label } } } }
      const cands = targets.filter((x) => norm(x.label) === norm(want!)); tgt = cands[0] ?? targets.find((x) => jac(tok(x.label), tok(want!)) >= 0.99)
    }
    if (!tgt) { console.log("NO MATCH", n, want, p.cand[0]); continue }
    const slug = tgt.href.replace("/services/", "")
    if (done.has(slug)) { console.log("dup", n, slug); continue }
    done.add(slug)
    const s = p.secs
    const hero = clean(s.hero ?? [])
    let hi = 0
    if (hero.length >= 3 && hero[0].t.length < 28) hi = 1
    const headline = hero[hi]?.t ?? ""
    const rest = hero.filter((_, i) => i !== hi && i !== 0 || (hi === 0 && i !== 0))
    const para = [...hero].sort((a, b) => b.t.length - a.t.length)[0]?.t ?? ""
    const tagline = hero.find((l, i) => i > hi && l.t.length < 110 && l.t !== para)?.t
    const summary = para.length > 420 ? para.slice(0, para.lastIndexOf(" ", 400)) + "…" : para
    void rest
    const secList: { key: string; html: string; title?: string }[] = [
      { key: "hero", title: btnsOf(s.hero ?? []) || undefined, html: `<p>${esc(headline)}</p>${tagline ? `<p>${esc(tagline)}</p>` : ""}` },
      { key: "overview", html: blocks(s.overview ?? []) },
      { key: "services", html: blocks(s.services ?? []) },
      { key: "process", html: steps(s.how ?? [], "ol") },
      { key: "why-us", html: steps(s.why ?? [], "ul") },
      { key: "cta", title: btnsOf(s.cta ?? []) || undefined, html: blocks((s.cta ?? []).slice(0, -1).concat((s.cta ?? []).slice(-1).filter((l) => /[.!?]$/.test(l.t)))) },
    ].filter((x) => x.html && !x.html.includes("<p></p>"))
    const labels = [...(secList.find((x) => x.key === "services")?.html.matchAll(/<li><strong>([^<:]{3,60}):/g) ?? [])].map((m) => m[1].replace(/&amp;/g, "&"))
    const heads = [...(secList.find((x) => x.key === "services")?.html.matchAll(/<h4>([^<]{3,60})<\/h4>/g) ?? [])].map((m) => m[1].replace(/&amp;/g, "&"))
    const highlights = (heads.length >= 2 ? heads : labels).slice(0, 4)
    const faq = faqs(s.faq ?? [])
    const data: Record<string, unknown> = {
      summary: summary.slice(0, 500),
      sections: secList.map((x) => ({ key: x.key, html: sanitizeRich(x.html), ...(x.title ? { title: x.title } : {}) })),
      faqs: faq,
      seoDescription: summary.slice(0, 155),
      autoContent: false,
      isPublished: true,
    }
    if (highlights.length >= 2) data.highlights = highlights
    await db.service.update({ where: { slug }, data })
    ok++
    console.log("ok", n, slug, "| sections", secList.map((x) => x.key).join(","), "| faqs", faq.length, "| hi", highlights.length)
  }
  console.log("updated", ok)
}
main().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => db.$disconnect())
