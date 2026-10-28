import { db } from "@/lib/db"
import { deleteObjects } from "@/lib/storage"
import { imageKeysIn } from "@/lib/rich-text"

/** Which record owns an uploaded file. */
export type AssetOwner = { field: "jobId" | "serviceId"; id: string }

/**
 * Keep Cloudflare R2 in step with what a saved page really uses: attach newly
 * used images to the owner, and delete images that are no longer used.
 * `urls` = every image URL the saved record refers to (body HTML, hero image...).
 */
export async function syncAssets(owner: AssetOwner, html: string, extraUrls: (string | null | undefined)[] = []) {
  const used = new Set(imageKeysIn(html))
  const base = (process.env.R2_PUBLIC_URL ?? "").replace(/\/+$/, "")
  for (const url of extraUrls) {
    if (url && base && url.startsWith(`${base}/`)) used.add(decodeURIComponent(url.slice(base.length + 1)))
  }
  const keys = [...used]
  if (keys.length) {
    await db.asset.updateMany({
      where: { key: { in: keys }, jobId: null, serviceId: null },
      data: { [owner.field]: owner.id },
    })
  }
  const stale = await db.asset.findMany({
    where: { [owner.field]: owner.id, key: { notIn: keys } },
    select: { id: true, key: true },
  })
  if (stale.length) {
    await deleteObjects(stale.map((a) => a.key))
    await db.asset.deleteMany({ where: { id: { in: stale.map((a) => a.id) } } })
  }
}

/** Remove every stored file of a record (used when it is deleted). */
export async function deleteOwnerAssets(owner: AssetOwner) {
  const assets = await db.asset.findMany({ where: { [owner.field]: owner.id }, select: { id: true, key: true } })
  await deleteObjects(assets.map((a) => a.key))
  await db.asset.deleteMany({ where: { [owner.field]: owner.id } })
}
