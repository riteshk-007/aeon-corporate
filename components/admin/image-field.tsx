"use client"

import { useRef, useState } from "react"
import { ImagePlus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/admin/ui"

/** Single-image picker that uploads to Cloudflare R2 through /api/admin/upload. */
export function ImageField({
  value,
  onChange,
  scope,
  ownerId,
  label,
}: {
  value: string | null
  onChange: (url: string | null) => void
  scope: string
  ownerId?: string
  label: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const upload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return void toast.error("Image is too large (max 5 MB)")
    setBusy(true)
    const body = new FormData()
    body.append("file", file)
    if (ownerId) body.append("ownerId", ownerId)
    try {
      const res = await fetch(`/api/admin/upload?scope=${encodeURIComponent(scope)}`, {
        method: "POST",
        body,
        credentials: "same-origin",
      })
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!res.ok || !json.url) return void toast.error(json.error ?? "Upload failed")
      onChange(json.url)
      toast.success("Image uploaded")
    } catch {
      toast.error("Network error while uploading")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-2">
      <span className="text-[13px] font-bold text-ink">{label}</span>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="max-h-48 w-full max-w-sm rounded-xl border border-line object-cover" />
      ) : (
        <p className="text-[13px] text-mute">No image yet. JPG, PNG, WebP or GIF, up to 5 MB.</p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={busy} onClick={() => ref.current?.click()}>
          {busy ? <Spinner /> : <ImagePlus />} {value ? "Replace image" : "Upload image"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" className="text-destructive" onClick={() => onChange(null)}>
            <Trash2 /> Remove
          </Button>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          e.target.value = ""
          if (f) void upload(f)
        }}
      />
    </div>
  )
}
