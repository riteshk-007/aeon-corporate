"use client"

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

/** Pop-up window (shadcn Dialog): scrolls on small screens, closes on Esc / outside click. */
export function Modal({
  open,
  onClose,
  title,
  description,
  wide,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className={cn(
          "max-h-[92dvh] gap-0 overflow-y-auto rounded-2xl p-6 max-[560px]:p-4",
          wide ? "sm:max-w-[820px]" : "sm:max-w-[560px]",
        )}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-[20px] font-extrabold tracking-[-0.02em]">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-[13px]">{description}</DialogDescription>
          ) : (
            <DialogDescription className="sr-only">{title}</DialogDescription>
          )}
        </DialogHeader>
        <div className="mt-5">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
