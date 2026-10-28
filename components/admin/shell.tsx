"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Briefcase, ChevronsUpDown, PanelTop, Inbox, KeyRound, LayoutDashboard, LogOut,
  ScrollText, ShieldCheck, Users,
} from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/site/ui"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar"
import { api } from "@/lib/admin-client"
import type { NavItem } from "@/lib/admin-nav"

const icons: Record<NavItem["icon"], typeof Users> = {
  dashboard: LayoutDashboard,
  navigation: PanelTop,
  careers: Briefcase,
  enquiries: Inbox,
  users: Users,
  roles: ShieldCheck,
  audit: ScrollText,
}

type ShellProps = {
  user: { name: string; email: string; roleName: string; isSuperAdmin: boolean }
  groups: { title: string; items: NavItem[] }[]
  children: React.ReactNode
}

/** Keeps a working session signed in: renews the token quietly (7-day sessions). */
function SessionKeeper() {
  const router = useRouter()
  useEffect(() => {
    let last = 0
    const renew = async () => {
      if (Date.now() - last < 10 * 60_000) return
      last = Date.now()
      const res = await api("POST", "/api/admin/auth/refresh", {})
      if (!res.ok && res.status === 401) {
        toast.error("Your session has ended. Please sign in again.")
        router.replace("/admin/login")
        router.refresh()
      }
    }
    void renew()
    const timer = setInterval(renew, 30 * 60_000)
    const onVisible = () => document.visibilityState === "visible" && void renew()
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [router])
  return null
}

function NavLinks({ groups }: { groups: ShellProps["groups"] }) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel className="text-[11px] font-black tracking-[.16em] text-white/40 uppercase">
            {group.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = icons[item.icon]
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={isActive(item.href)}
                      onClick={() => setOpenMobile(false)}
                      render={<Link href={item.href} />}
                      className="h-auto min-h-11 py-2 text-[14px] font-semibold text-white/75 hover:text-white data-active:bg-white/12 data-active:text-white"
                    >
                      <Icon />
                      <span className="grid min-w-0 leading-tight">
                        <span className="truncate">{item.label}</span>
                        <small className="text-[11px] leading-snug font-medium text-white/45 group-data-[collapsible=icon]:hidden">{item.hint}</small>
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}

export function AdminShell({ user, groups, children }: ShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [busy, setBusy] = useState(false)

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const current =
    groups
      .flatMap((g) => g.items)
      .filter((i) => (i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href)))
      .sort((a, b) => b.href.length - a.href.length)[0]?.label ??
    (pathname.startsWith("/admin/account") ? "My account" : "Admin")

  const logout = async () => {
    setBusy(true)
    const t = toast.loading("Signing out…")
    await api("POST", "/api/admin/auth/logout", {})
    toast.dismiss(t)
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader className="px-4 pt-5 pb-3 group-data-[collapsible=icon]:px-2">
            <Logo light />
          </SidebarHeader>
          <SidebarContent className="px-1">
            <NavLinks groups={groups} />
          </SidebarContent>
          <SidebarFooter className="border-t border-white/10 p-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="h-12 text-white hover:text-white data-popup-open:bg-white/10"
                  />
                }
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sun text-[12px] font-black text-ink">
                  {initials}
                </span>
                <span className="grid min-w-0 flex-1 text-left leading-tight">
                  <b className="truncate text-[13px]">{user.name}</b>
                  <small className="truncate text-[11px] text-white/55">
                    {user.isSuperAdmin ? "Super admin" : user.roleName}
                  </small>
                </span>
                <ChevronsUpDown className="ml-auto size-4 text-white/50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-60">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="grid">
                    <span className="truncate text-sm font-semibold text-foreground">{user.name}</span>
                    <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/admin/account" />}>
                  <KeyRound /> Account &amp; password
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" disabled={busy} onClick={logout}>
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="min-w-0 bg-[#f4f7ff]">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-white/85 px-4 backdrop-blur-xl">
            <SidebarTrigger aria-label="Toggle menu" className="-ml-1" />
            <Separator orientation="vertical" className="mx-1 h-5" />
            <h2 className="truncate text-[14px] font-bold text-ink">{current}</h2>
            <span className="ml-auto hidden text-[12px] font-semibold text-mute sm:inline">
              {user.isSuperAdmin ? "Super admin" : user.roleName}
            </span>
          </header>
          <main className="mx-auto w-full max-w-[1200px] min-w-0 px-6 py-8 max-[560px]:px-4 max-[560px]:py-5">
            {children}
          </main>
        </SidebarInset>
        <SessionKeeper />
        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  )
}
