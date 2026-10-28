"use client"

import { createContext, useContext, useMemo } from "react"
import type { MenuTop } from "@/lib/menu"

const MenuContext = createContext<MenuTop[]>([])

export function MenuLinksProvider({
  menu,
  children,
}: {
  menu: MenuTop[]
  children: React.ReactNode
}) {
  return <MenuContext.Provider value={menu}>{children}</MenuContext.Provider>
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()

/**
 * Resolves home-page cards to real pages from the admin-edited menu:
 * `service(title)` finds a menu link by name, `section(name)` the first page of a menu group.
 */
export function useMenuLinks() {
  const menu = useContext(MenuContext)
  return useMemo(() => {
    const all = menu.flatMap((t) => t.categories.flatMap((c) => c.links))
    return {
      service(title: string, fallback = "/contact-us") {
        const n = norm(title)
        const hit =
          all.find((l) => norm(l.label) === n) ??
          all.find((l) => norm(l.label).includes(n) || n.includes(norm(l.label)))
        return hit?.href ?? fallback
      },
      section(name: string, fallback = "/contact-us") {
        const n = norm(name)
        const top = menu.find((t) => norm(t.label) === n)
        return top?.categories[0]?.links[0]?.href ?? top?.href ?? fallback
      },
    }
  }, [menu])
}
