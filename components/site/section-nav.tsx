"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type Tab = { id: string; title: string }

/**
 * Section links for a long page. Shown as a sticky pill bar on small screens and
 * as a vertical list beside the content on large screens; highlights the
 * section you are reading.
 */
export function SectionNav({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "")

  useEffect(() => {
    const els = tabs.map((t) => document.getElementById(t.id)).filter((e): e is HTMLElement => !!e)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-170px 0px -62% 0px", threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [tabs])

  // keep the active pill visible in the horizontal bar
  useEffect(() => {
    document.querySelector<HTMLElement>(`[data-tab="${active}"]`)?.scrollIntoView({ block: "nearest", inline: "center" })
  }, [active])

  return (
    <nav aria-label="On this page" className="min-w-0 sticky top-[76px] z-20 -mx-1 min-[1025px]:top-28 min-[1025px]:mx-0">
      <ul className="flex gap-1.5 overflow-x-auto rounded-2xl border border-line bg-white/95 p-1.5 shadow-[0_10px_30px_rgba(11,27,77,.08)] backdrop-blur [scrollbar-width:none] min-[1025px]:grid min-[1025px]:gap-0.5 min-[1025px]:p-2 [&::-webkit-scrollbar]:hidden">
        {tabs.map((t, i) => (
          <li key={t.id} className="shrink-0">
            <a
              href={`#${t.id}`}
              data-tab={t.id}
              aria-current={active === t.id ? "true" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[13px] font-bold whitespace-nowrap transition min-[1025px]:py-2.5",
                active === t.id ? "bg-brand text-white shadow-[0_6px_16px_rgba(27,95,217,.25)]" : "text-ink/75 hover:bg-pale hover:text-brand",
              )}
            >
              <span className={cn("hidden size-5 shrink-0 place-items-center rounded-full text-[10px] font-black min-[1025px]:grid", active === t.id ? "bg-white/20" : "bg-pale text-brand")}>{i + 1}</span>
              {t.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
