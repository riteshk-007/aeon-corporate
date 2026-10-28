import { cn } from "@/lib/utils"

/**
 * Renders HTML produced by <RichTextEditor>. The HTML must already have been
 * sanitised on the server (sanitizeRich) when it was saved.
 */
export function RichContent({ html, className }: { html: string; className?: string }) {
  if (!html) return null
  return <div className={cn("rich-content", className)} dangerouslySetInnerHTML={{ __html: html }} />
}
