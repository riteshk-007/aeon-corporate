import type { ModuleKey, Permission } from "@/lib/auth/permissions"

export type NavItem = {
  href: string
  label: string
  /** one short line under the label, so a new admin knows what the page is for */
  hint: string
  /** lucide icon name, resolved in the (client) shell */
  icon: "dashboard" | "navigation" | "careers" | "enquiries" | "users" | "roles" | "audit"
  module: ModuleKey
}

export const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        hint: "Summary and recent activity",
        icon: "dashboard",
        module: "dashboard",
      },
    ],
  },
  {
    title: "Website",
    items: [
      {
        href: "/admin/navigation",
        label: "Menus & Pages",
        hint: "Header menus and each service page",
        icon: "navigation",
        module: "navigation",
      },
      {
        href: "/admin/careers",
        label: "Careers",
        hint: "Job openings shown on the site",
        icon: "careers",
        module: "careers",
      },
    ],
  },
  {
    title: "Leads",
    items: [
      {
        href: "/admin/enquiries",
        label: "Enquiries",
        hint: "Messages from the website forms",
        icon: "enquiries",
        module: "enquiries",
      },
    ],
  },
  {
    title: "Team & Security",
    items: [
      {
        href: "/admin/users",
        label: "Admin Users",
        hint: "Add or remove people",
        icon: "users",
        module: "users",
      },
      {
        href: "/admin/roles",
        label: "Roles & Access",
        hint: "Choose what each person can open",
        icon: "roles",
        module: "roles",
      },
      {
        href: "/admin/audit",
        label: "Audit Log",
        hint: "Who did what, and when",
        icon: "audit",
        module: "audit",
      },
    ],
  },
]

/** Only the pages this person is allowed to open. */
export function navFor(permissions: Permission[]) {
  const allowed = new Set<string>(permissions)
  return NAV_GROUPS.map((group) => ({
    title: group.title,
    items: group.items.filter((item) => allowed.has(`${item.module}:view`)),
  })).filter((group) => group.items.length > 0)
}
