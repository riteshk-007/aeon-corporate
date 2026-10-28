"use client"

import { ListChecks } from "lucide-react"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { RichContent } from "@/components/editor/rich-content"
import { cn } from "@/lib/utils"

/** Button that opens a pop-up with the whole step-by-step process of a service. */
export function StepsDialog({
  title,
  html,
  className,
  children = "View all steps",
}: {
  title: string
  html: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-brand/30 bg-white px-5 text-[14px] font-bold text-brand transition hover:bg-pale",
          className,
        )}
      >
        <ListChecks size={16} /> {children}
      </DialogTrigger>
      <DialogContent className="max-h-[88dvh] gap-0 overflow-y-auto rounded-2xl p-6 sm:max-w-[680px] max-[560px]:p-4">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-[22px] font-extrabold tracking-[-0.02em]">{title}: step by step</DialogTitle>
          <DialogDescription className="text-[13px]">
            The usual steps from the first call to the finished work.
          </DialogDescription>
        </DialogHeader>
        <RichContent
          html={html}
          className="mt-5 text-[15px] [&_ol]:!list-none [&_ol>li]:!list-none [&_ol]:pl-0 [&_ol]:[counter-reset:step] [&_ol>li]:relative [&_ol>li]:rounded-2xl [&_ol>li]:border [&_ol>li]:border-line [&_ol>li]:bg-[#f8fbff] [&_ol>li]:py-3 [&_ol>li]:pr-4 [&_ol>li]:pl-14 [&_ol>li]:[counter-increment:step] [&_ol>li]:before:absolute [&_ol>li]:before:top-3 [&_ol>li]:before:left-3.5 [&_ol>li]:before:grid [&_ol>li]:before:size-8 [&_ol>li]:before:place-items-center [&_ol>li]:before:rounded-full [&_ol>li]:before:bg-brand [&_ol>li]:before:text-[13px] [&_ol>li]:before:font-black [&_ol>li]:before:text-white [&_ol>li]:before:content-[counter(step)]"
        />
      </DialogContent>
    </Dialog>
  )
}
