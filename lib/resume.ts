import { deleteObjects, keyFromUrl, storageConfigured } from "./storage"

/** Deletes the uploaded resume (if any) that an enquiry points to, so erasure removes it from R2 too. */
export async function removeResume(details: unknown) {
  const url = (details as Record<string, unknown> | null)?.resumeUrl
  if (typeof url !== "string" || !storageConfigured()) return
  const key = keyFromUrl(url)
  if (key) await deleteObjects([key]).catch((e) => console.error("[resume] delete failed:", e.message))
}
