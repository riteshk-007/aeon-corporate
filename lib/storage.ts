import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { randomUUID } from "node:crypto"

/**
 * Cloudflare R2 (S3-compatible) storage. Keys live in .env, never in code:
 * R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL.
 */
export const storageConfigured = () =>
  Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      bucketName() &&
      process.env.R2_PUBLIC_URL,
  )

let client: S3Client | undefined
function s3() {
  if (!storageConfigured()) throw new Error("R2 storage is not configured")
  client ??= new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
  return client
}

/** Accepts R2_BUCKET or R2_BUCKET_NAME. */
const bucketName = () => process.env.R2_BUCKET || process.env.R2_BUCKET_NAME
const publicBase = () => process.env.R2_PUBLIC_URL!.replace(/\/+$/, "")

/** Optional UPLOAD_FOLDER: every file goes under this folder in the bucket (e.g. "aeon"). */
const prefix = () => (process.env.UPLOAD_FOLDER ?? "").trim().replace(/^\/+|\/+$/g, "")

export const publicUrl = (key: string) => `${publicBase()}/${key}`

/** Key back from a public URL, or null if the URL is not ours. */
export function keyFromUrl(url: string) {
  const base = `${publicBase()}/`
  return url.startsWith(base) ? decodeURIComponent(url.slice(base.length)) : null
}

export const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
}

export async function putObject(opts: {
  folder: string
  body: Buffer
  mime: string
}) {
  const ext = EXT[opts.mime]
  if (!ext) throw new Error("Unsupported file type")
  const key = [prefix(), opts.folder, `${randomUUID()}.${ext}`].filter(Boolean).join("/")
  await s3().send(
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: key,
      Body: opts.body,
      ContentType: opts.mime,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  )
  return { key, url: publicUrl(key) }
}

export async function deleteObjects(keys: string[]) {
  if (keys.length === 0) return
  if (!storageConfigured()) return
  if (keys.length === 1) {
    await s3().send(
      new DeleteObjectCommand({ Bucket: bucketName(), Key: keys[0] }),
    )
    return
  }
  await s3().send(
    new DeleteObjectsCommand({
      Bucket: bucketName(),
      Delete: { Objects: keys.map((Key) => ({ Key })), Quiet: true },
    }),
  )
}
