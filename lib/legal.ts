/**
 * Legal details used by the Privacy Policy, Terms, consent checkboxes and the
 * data-retention job. Items marked FILL IN must be replaced with real company
 * details before launch, and the policy text should be reviewed by a lawyer.
 */

/** Bump these whenever the text changes: each consent stores the version the person accepted. */
export const PRIVACY_VERSION = "2026-10-25"
export const TERMS_VERSION = "2026-10-25"
export const LEGAL_UPDATED = "25 October 2026"

export const LEGAL = {
  /** FILL IN: registered legal name of the company that runs this website. */
  companyName: "Aeon Corporate",
  /** FILL IN: registered office address. */
  address: "Registered office address, City, State, India",
  privacyEmail: "privacy@aeoncorporate.com",
  /** FILL IN: the person you appoint to answer privacy complaints. */
  grievanceOfficer: {
    name: "Grievance Officer (name to be added)",
    email: "grievance@aeoncorporate.com",
    phone: "+91 00000 00000",
    responseTime: "We acknowledge within 48 hours and aim to resolve within 30 days.",
  },
  /** FILL IN: city whose courts handle disputes. */
  jurisdictionCity: "New Delhi",
} as const

/** How long each kind of personal data is kept before it is deleted automatically. */
export const RETENTION_DAYS = {
  contact: 730, // 24 months after the enquiry
  partner: 730,
  career: 365, // 12 months for job applications
  newsletter: 1095, // 36 months, or until you unsubscribe
  auditLog: 365, // admin activity log
} as const

export type LeadKind = "contact" | "partner" | "career" | "newsletter"

export const retentionLabel = (days: number) =>
  days % 365 === 0
    ? `${days / 365} year${days === 365 ? "" : "s"}`
    : `${Math.round(days / 30)} months`
