import nodemailer, { type Transporter } from "nodemailer"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { keyFromUrl, storageConfigured } from "@/lib/storage"

type Row = [label: string, value: string | null | undefined]

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

// One connection pool for the whole server process.
let transport: Transporter | null | undefined

function getTransport() {
  if (transport !== undefined) return transport
  const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) return (transport = null)
  const port = Number(process.env.SMTP_PORT) || 587
  transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  })
  return transport
}

// Colours are fixed (never inherited) so the text stays readable in light and dark mail apps:
// light card, dark text; dark-mode rules below keep a dark card with light text.
const C = {
  page: "#eef3fb",
  card: "#ffffff",
  ink: "#0b1b4d",
  mute: "#4a5a7a",
  line: "#d6e2f5",
  tint: "#f3f8ff",
  brand: "#1b5fd9",
  sun: "#ffd93d",
}

function layout(opts: { title: string; intro: string; rows: [string, string][]; fileNote?: string; ctaUrl?: string }) {
  const rows = opts.rows
    .map(
      ([k, v]) => `<tr>
<td class="k" width="34%" style="padding:11px 14px;border-bottom:1px solid ${C.line};background:${C.tint};color:${C.mute};font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;vertical-align:top">${esc(k)}</td>
<td class="v" style="padding:11px 14px;border-bottom:1px solid ${C.line};color:${C.ink};font-size:15px;line-height:1.55;vertical-align:top;white-space:pre-wrap;word-break:break-word">${esc(v)}</td>
</tr>`,
    )
    .join("")
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${esc(opts.title)}</title>
<style>
@media (prefers-color-scheme: dark){
 .page{background:#0b1226 !important}
 .card{background:#121c3a !important}
 .head{background:#ffffff !important}
 .k{background:#1a2650 !important;color:#b9c6e6 !important;border-color:#2b3a6e !important}
 .v,.t{color:#f1f5ff !important;border-color:#2b3a6e !important}
 .m{color:#b9c6e6 !important}
}
@media (max-width:620px){ .k,.v{display:block !important;width:auto !important} }
</style></head>
<body class="page" style="margin:0;padding:0;background:${C.page}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="page" style="background:${C.page}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" class="card" style="width:100%;max-width:600px;background:${C.card};border-radius:16px;overflow:hidden;border:1px solid ${C.line}">
<tr><td class="head" style="background:#ffffff;padding:22px 28px;border-bottom:4px solid ${C.sun}">
<img src="cid:aeon-logo" alt="Aeon Corporate" height="44" style="display:block;height:44px;width:auto;border:0">
</td></tr>
<tr><td style="padding:26px 28px 6px">
<p style="margin:0 0 6px;color:${C.brand};font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase">New on your website</p>
<h1 class="t" style="margin:0;color:${C.ink};font-size:22px;line-height:1.3">${esc(opts.title)}</h1>
<p class="m" style="margin:10px 0 0;color:${C.mute};font-size:14px;line-height:1.6">${esc(opts.intro)}</p>
</td></tr>
<tr><td style="padding:18px 28px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.line};border-radius:12px;overflow:hidden;border-collapse:separate">${rows}</table>
</td></tr>
${opts.fileNote ? `<tr><td style="padding:0 28px 6px"><p class="m" style="margin:0;padding:12px 14px;background:${C.tint};border-radius:10px;color:${C.mute};font-size:13px;line-height:1.6">${esc(opts.fileNote)}</p></td></tr>` : ""}
<tr><td style="padding:14px 28px 26px">
${opts.ctaUrl ? `<a href="${esc(opts.ctaUrl)}" style="display:inline-block;background:${C.brand};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px">Open enquiries in admin</a>` : ""}
<p class="m" style="margin:16px 0 0;color:${C.mute};font-size:12px;line-height:1.6">This message contains personal data collected with consent. Please keep it within the team and do not forward it. Use Reply to answer the sender directly.</p>
</td></tr>
</table>
<p class="m" style="margin:14px 0 0;color:${C.mute};font-size:12px">Aeon Corporate &middot; automatic notification</p>
</td></tr></table></body></html>`
}

/** Sends the team a notice about a new enquiry. Never throws: a mail problem must not lose the lead. */
export async function notifyAdmin(
  subject: string,
  intro: string,
  rows: Row[],
  replyTo?: string | null,
  attachmentUrl?: string | null,
  attachmentName?: string | null,
) {
  const to = process.env.ADMIN_EMAIL
  const mailer = getTransport()
  if (!to || !mailer) return false
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER!
  const shown = rows.filter((r): r is [string, string] => !!r[1])
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "")

  const attachments: NonNullable<Parameters<Transporter["sendMail"]>[0]["attachments"]> = []
  try {
    attachments.push({
      filename: "aeon-logo.png",
      content: await readFile(path.join(process.cwd(), "public", "brand", "aeon-logo.png")),
      cid: "aeon-logo",
      contentDisposition: "inline",
    })
  } catch {}
  // Only files we stored ourselves (R2) are attached, never an address typed by a visitor.
  let attached = false
  if (attachmentUrl && storageConfigured() && keyFromUrl(attachmentUrl)) {
    const ext = attachmentUrl.split(".").pop()?.toLowerCase() ?? "pdf"
    const safe = (attachmentName ?? "resume").replace(/[^\w. -]+/g, "").slice(0, 60) || "resume"
    attachments.push({ filename: /\.\w{2,4}$/.test(safe) ? safe : `${safe}.${ext}`, path: attachmentUrl })
    attached = true
  }

  const html = layout({
    title: subject,
    intro,
    rows: shown,
    fileNote: attached ? "The uploaded file is attached to this email." : undefined,
    ctaUrl: site.startsWith("https://") ? `${site}/admin/enquiries` : undefined,
  })
  const text = `${subject}\n${intro}\n\n${shown.map(([k, v]) => `${k}: ${v}`).join("\n")}`
  try {
    await mailer.sendMail({ from: `Aeon Corporate <${from}>`, to, replyTo: replyTo || undefined, subject, text, html, attachments })
    return true
  } catch (error) {
    console.error("[mail] could not send admin notice:", (error as Error).message)
    return false
  }
}
