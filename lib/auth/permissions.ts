/**
 * Page-level access control.
 *
 * Every admin "page" is a module. A permission is "module:action". A person's
 * access = their role's permissions + any extra permissions granted to them
 * individually (super admins can do everything).
 */

export const MODULES = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Overview of the site and admin activity.",
    actions: ["view"],
  },
  {
    key: "pages",
    label: "Service Pages",
    description: "Edit the content of each service page (opened from Menus & Pages).",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    key: "navigation",
    label: "Menus & Pages",
    description: "Header dropdown menus, their links and the page behind each link.",
    actions: ["view", "edit"],
  },
  {
    key: "careers",
    label: "Careers",
    description: "Job openings and applications.",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    key: "enquiries",
    label: "Enquiries",
    description: "Leads from contact and partner forms.",
    actions: ["view", "edit", "delete"],
  },
  {
    key: "users",
    label: "Admin Users",
    description: "Create and manage admin accounts.",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    key: "roles",
    label: "Roles & Access",
    description: "Define roles and page access.",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    key: "audit",
    label: "Audit Log",
    description: "Who did what, and when.",
    actions: ["view"],
  },
] as const

export type ModuleKey = (typeof MODULES)[number]["key"]
export type ActionKey = "view" | "create" | "edit" | "delete"
export type Permission = `${ModuleKey}:${ActionKey}`

export const ALL_PERMISSIONS: Permission[] = MODULES.flatMap((m) =>
  m.actions.map((a) => `${m.key}:${a}` as Permission),
)

const valid = new Set<string>(ALL_PERMISSIONS)
export const isPermission = (value: string): value is Permission =>
  valid.has(value)

type Access = {
  isSuperAdmin: boolean
  role: { permissions: string[] }
  extraPermissions: string[]
}

/** Everything this person is allowed to do. */
export function effectivePermissions(user: Access): Set<Permission> {
  if (user.isSuperAdmin) return new Set(ALL_PERMISSIONS)
  const all = [...user.role.permissions, ...user.extraPermissions]
  return new Set(all.filter(isPermission))
}

export function can(user: Access, permission: Permission): boolean {
  return effectivePermissions(user).has(permission)
}

/** Default roles created by the seed script. */
export const DEFAULT_ROLES: {
  name: string
  description: string
  permissions: Permission[]
}[] = [
  {
    name: "Admin",
    description: "Full access to content, leads and admin users.",
    permissions: ALL_PERMISSIONS.filter((p) => !p.startsWith("roles:delete")),
  },
  {
    name: "Editor",
    description: "Manage menus, service pages and careers.",
    permissions: [
      "dashboard:view",
      "navigation:view",
      "navigation:edit",
      ...(["pages", "careers"] as const).flatMap((m) =>
        (["view", "create", "edit", "delete"] as const).map(
          (a) => `${m}:${a}` as Permission,
        ),
      ),
    ],
  },
  {
    name: "Support",
    description: "Read and handle enquiries.",
    permissions: ["dashboard:view", "enquiries:view", "enquiries:edit"],
  },
]
