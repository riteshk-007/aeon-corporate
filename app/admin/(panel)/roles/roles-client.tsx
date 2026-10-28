"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2, Users } from "lucide-react"
import { api } from "@/lib/admin-client"
import { Badge, Card, adminBtn, adminInput } from "@/components/admin/ui"
import { Modal } from "@/components/admin/modal"
import { PermissionMatrix } from "@/components/admin/permission-matrix"
import { MODULES } from "@/lib/auth/permissions"
import { cn } from "@/lib/utils"

type ClientRole = {
  id: string
  name: string
  description: string
  isSystem: boolean
  permissions: string[]
  users: number
}
type Me = { isSuperAdmin: boolean; permissions: string[] }

export function RolesClient({ me, roles }: { me: Me; roles: ClientRole[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<ClientRole | "new" | null>(null)
  const can = (p: string) => me.isSuperAdmin || me.permissions.includes(p)

  return (
    <>
      <div className="mb-4 flex justify-end">
        {can("roles:create") && (
          <button
            onClick={() => setEditing("new")}
            className={adminBtn.primary}
          >
            <Plus size={16} /> New role
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
        {roles.map((r) => {
          const pages = MODULES.filter((m) =>
            r.permissions.some((p) => p.startsWith(`${m.key}:`)),
          )
          return (
            <Card key={r.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[18px] font-extrabold tracking-[-0.02em]">
                  {r.name}
                </h3>
                {r.isSystem && <Badge tone="navy">Built-in</Badge>}
              </div>
              <p className="mt-1.5 min-h-[40px] text-[13px] leading-[1.6] text-mute">
                {r.description || "No description"}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {pages.slice(0, 6).map((m) => (
                  <Badge key={m.key} tone="blue">
                    {m.label}
                  </Badge>
                ))}
                {pages.length > 6 && (
                  <Badge tone="gray">+{pages.length - 6} more</Badge>
                )}
                {pages.length === 0 && <Badge tone="gray">No pages</Badge>}
              </div>
              <div className="mt-auto flex items-center justify-between pt-5">
                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-mute">
                  <Users size={15} /> {r.users}{" "}
                  {r.users === 1 ? "person" : "people"}
                </span>
                {can("roles:edit") && (
                  <button
                    onClick={() => setEditing(r)}
                    className={cn(adminBtn.ghost, "h-9")}
                  >
                    Edit
                  </button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {editing && (
        <RoleModal
          key={editing === "new" ? "new" : editing.id}
          role={editing === "new" ? null : editing}
          me={me}
          canDelete={can("roles:delete")}
          onClose={() => setEditing(null)}
          onDone={() => {
            setEditing(null)
            router.refresh()
          }}
        />
      )}
    </>
  )
}

function RoleModal({
  role,
  me,
  canDelete,
  onClose,
  onDone,
}: {
  role: ClientRole | null
  me: Me
  canDelete: boolean
  onClose: () => void
  onDone: () => void
}) {
  const [name, setName] = useState(role?.name ?? "")
  const [description, setDescription] = useState(role?.description ?? "")
  const [permissions, setPermissions] = useState<string[]>(
    role?.permissions ?? [],
  )
  const [busy, setBusy] = useState<"save" | "del" | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const allowed = useMemo(
    () => (me.isSuperAdmin ? undefined : new Set(me.permissions)),
    [me],
  )

  // You can only edit a role that does not exceed your own access.
  const exceeds =
    !me.isSuperAdmin &&
    (role?.permissions ?? []).some((p) => !me.permissions.includes(p))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy("save")
    const body = { name, description, permissions }
    const res = role
      ? await api("PATCH", `/api/admin/roles/${role.id}`, body, { success: "Role saved" })
      : await api("POST", "/api/admin/roles", body, { success: "Role created" })
    setBusy(null)
    if (!res.ok) return
    onDone()
  }

  const remove = async () => {
    if (!role) return
    setBusy("del")
    const res = await api("DELETE", `/api/admin/roles/${role.id}`, undefined, {
      success: "Role deleted",
    })
    setBusy(null)
    if (!res.ok) return
    onDone()
  }

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={role ? `Edit ${role.name}` : "New role"}
      description="Tick the pages and actions this role can use. Viewing a page is required for anything else on it."
    >
      <form onSubmit={save} className="grid gap-5">
        {exceeds && (
          <p className="rounded-xl bg-amber-50 p-3 text-[13px] font-semibold text-amber-800">
            This role has access you do not have, so only a more senior admin
            can edit it.
          </p>
        )}
        <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
          <label className="grid gap-1.5 text-[13px] font-bold">
            Role name
            <input
              className={adminInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={role?.isSystem || exceeds}
              maxLength={40}
            />
          </label>
          <label className="grid gap-1.5 text-[13px] font-bold">
            Description
            <input
              className={adminInput}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={exceeds}
              maxLength={200}
            />
          </label>
        </div>

        <PermissionMatrix
          value={permissions}
          onChange={setPermissions}
          allowed={allowed}
          disabled={exceeds}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            {role &&
              !role.isSystem &&
              canDelete &&
              !exceeds &&
              (confirmDelete ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className={adminBtn.ghost}
                  >
                    Keep
                  </button>
                  <button
                    type="button"
                    onClick={remove}
                    disabled={busy !== null}
                    className={adminBtn.danger}
                  >
                    {busy === "del" ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                    Yes, delete
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className={adminBtn.danger}
                >
                  <Trash2 size={15} /> Delete role
                </button>
              ))}
          </div>
          <div className="flex gap-2.5">
            <button type="button" onClick={onClose} className={adminBtn.ghost}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy !== null || exceeds || !name}
              className={adminBtn.primary}
            >
              {busy === "save" && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {role ? "Save role" : "Create role"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
