/**
 * Automatic Google title and description for service pages. Used when the admin
 * leaves the SEO fields empty (and by the admin preview), so every page gets a
 * clear, unique, right-length snippet without extra work.
 */

/** Google shows roughly 60 characters; the site adds " | Aeon Corporate" (16). */
export const SEO_TITLE_MAX = 44
export const SEO_DESCRIPTION_MAX = 158

const cut = (text: string, max: number) => {
  if (text.length <= max) return text
  const slice = text.slice(0, max - 1)
  return `${slice.slice(0, slice.lastIndexOf(" ") > 60 ? slice.lastIndexOf(" ") : slice.length).replace(/[,;:\s]+$/, "")}…`
}

export function autoSeoTitle(title: string) {
  const t = title.trim()
  const inIndia = /\bindia\b/i.test(t) ? "" : " in India"
  const candidates = [`${t}${inIndia}: Process & Documents`, `${t}: Process & Documents`, `${t}${inIndia}`, t]
  return candidates.find((c) => c.length <= SEO_TITLE_MAX) ?? t
}

/**
 * `summary` is used only when a person wrote it (not the starter text), so
 * starter pages still get a distinct, keyword-rich description.
 */
export function autoSeoDescription(title: string, summary?: string) {
  const t = title.trim()
  const cta = " Get expert help from Aeon Corporate."
  const written = summary?.trim() ?? ""
  let d =
    written.length >= 60
      ? written
      : `Everything about ${t}${/\bindia\b/i.test(t) ? "" : " in India"}: who can apply, documents required, the step-by-step process and compliance after approval.`
  if (d.length + cta.length <= SEO_DESCRIPTION_MAX) d += cta
  return cut(d, SEO_DESCRIPTION_MAX)
}
