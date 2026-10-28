"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Lock, Plus, ShieldAlert, Trash2, Unlock } from "lucide-react"
import { api, formatDate } from "@/lib/admin-client"
import { Badge, Card, adminBtn, adminInput } from "@/components/admin/ui"
import { Modal } from "@/components/admin/modal"
import { PermissionMatrix } from "@/components/admin/permission-matrix"
import { PasswordField } from "@/components/admin/password-field"
import { passwordProblems } from "@/lib/auth/password-policy"
import { cn } from "@/lib/utils"

type RoleLite = { id: string; name: string; permissions: string[] }
type ClientUser = {
  id: string
  email: string
  name: string
  roleId: string
  role: { id: string; name: string }
  extraPermissions: string[]
  isSuperAdmin: boolean
  isActive: boolean
  mustChangePassword: boolean
  failedAttempts: number
  lockedUntil: string | null
  lastLoginAt: string | null
  createdAt: string
}
type Me = { id: string; isSuperAdmin: boolean; permissions: string[] }

const isLocked = (u: ClientUser) =>
  Boolean(u.lockedUntil && new Date(u.lockedUntil).getTime() > Date.now())

export function UsersClient({
  me,
  roles,
  users,
}: {
  me: Me
  roles: RoleLite[]
  users: ClientUser[]
}) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<ClientUser | null>(null)
  const can = (p: string) => me.isSuperAdmin || me.permissions.includes(p)
  const refresh = () => router.refresh()

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] font-semibold text-mute">
          {users.length} {users.length === 1 ? "person" : "people"}
        </p>
        {can("users:create") && (
          <button
            onClick={() => setCreating(true)}
            className={adminBtn.primary}
          >
            <Plus size={16} /> Add admin
          </button>
        )}
      </div>

      <Card className="overflow-hidden max-[760px]:hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead className="bg-pale text-[11px] font-black tracking-[.12em] text-mute uppercase">
              <tr>
                <th className="px-5 py-3.5">Person</th>
                <th className="px-3 py-3.5">Role</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Last sign in</th>
                <th className="px-5 py-3.5 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-pale/50">
                  <td className="px-5 py-3.5">
                    <b className="block text-[14px]">
                      {u.name}
                      {u.id === me.id && (
                        <span className="ml-2 text-[11px] text-mute">
                          (you)
                        </span>
                      )}
                    </b>
                    <span className="text-mute">{u.email}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {u.isSuperAdmin ? (
                        <Badge tone="navy">Super admin</Badge>
                      ) : (
                        <Badge tone="blue">{u.role.name}</Badge>
                      )}
                      {u.extraPermissions.length > 0 && (
                        <Badge tone="amber">
                          +{u.extraPermissions.length} extra
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {!u.isActive ? (
                        <Badge tone="gray">Inactive</Badge>
                      ) : isLocked(u) ? (
                        <Badge tone="red">Locked</Badge>
                      ) : (
                        <Badge tone="green">Active</Badge>
                      )}
                      {u.mustChangePassword && (
                        <Badge tone="amber">Must change password</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-mute">
                    {formatDate(u.lastLoginAt)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {can("users:edit") ? (
                      <button
                        onClick={() => setEditing(u)}
                        className={cn(adminBtn.ghost, "h-9")}
                      >
                        Manage
                      </button>
                    ) : (
                      <span className="text-mute">–</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Phones: one card per person */}
      <ul className="grid gap-3 min-[761px]:hidden">
        {users.map((u) => (
          <li key={u.id}>
            <Card className="grid gap-3 p-4">
              <div className="min-w-0">
                <b className="block text-[15px]">
                  {u.name}
                  {u.id === me.id && <span className="ml-2 text-[11px] font-normal text-mute">(you)</span>}
                </b>
                <span className="text-[13px] text-mute [overflow-wrap:anywhere]">{u.email}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {u.isSuperAdmin ? <Badge tone="navy">Super admin</Badge> : <Badge tone="blue">{u.role.name}</Badge>}
                {u.extraPermissions.length > 0 && <Badge tone="amber">+{u.extraPermissions.length} extra</Badge>}
                {!u.isActive ? <Badge tone="gray">Inactive</Badge> : isLocked(u) ? <Badge tone="red">Locked</Badge> : <Badge tone="green">Active</Badge>}
                {u.mustChangePassword && <Badge tone="amber">Must change password</Badge>}
              </div>
              <p className="text-[12px] text-mute">Last sign in: {formatDate(u.lastLoginAt)}</p>
              {can("users:edit") && (
                <button onClick={() => setEditing(u)} className={cn(adminBtn.ghost, "h-10 w-full")}>
                  Manage
                </button>
              )}
            </Card>
          </li>
        ))}
      </ul>

      <CreateUserModal
        open={creating}
        onClose={() => setCreating(false)}
        me={me}
        roles={roles}
        onDone={() => {
          setCreating(false)
          refresh()
        }}
      />
      {editing && (
        <EditUserModal
          key={editing.id + editing.email}
          user={users.find((u) => u.id === editing.id) ?? editing}
          me={me}
          roles={roles}
          onClose={() => setEditing(null)}
          onChanged={refresh}
          canDelete={can("users:delete")}
        />
      )}
    </>
  )
}

/* ---------------------------------------------------------------- create */

function CreateUserModal({
  open,
  onClose,
  me,
  roles,
  onDone,
}: {
  open: boolean
  onClose: () => void
  me: Me
  roles: RoleLite[]
  onDone: () => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "")
  const [extra, setExtra] = useState<string[]>([])
  const [superAdmin, setSuperAdmin] = useState(false)
  const [mustChange, setMustChange] = useState(true)
  const [busy, setBusy] = useState(false)

  const role = roles.find((r) => r.id === roleId)
  const allowed = useMemo(
    () => (me.isSuperAdmin ? undefined : new Set(me.permissions)),
    [me],
  )
  const weak = passwordProblems(password, { email, name }).length > 0

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const res = await api("POST", "/api/admin/users", {
      name,
      email,
      password,
      roleId,
      extraPermissions: extra,
      isSuperAdmin: superAdmin,
      mustChangePassword: mustChange,
    }, { success: "Admin created" })
    setBusy(false)
    if (!res.ok) return
    setName("")
    setEmail("")
    setPassword("")
    setExtra([])
    setSuperAdmin(false)
    onDone()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title="Add admin"
      description="They sign in with this email and password. Share the password through a secure channel."
    >
      <form onSubmit={submit} className="grid gap-5">
        <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
          <label className="grid gap-1.5 text-[13px] font-bold">
            Full name
            <input
              className={adminInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
          <label className="grid gap-1.5 text-[13px] font-bold">
            Email (their login ID)
            <input
              type="email"
              className={adminInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
        </div>

        <PasswordField
          value={password}
          onChange={setPassword}
          email={email}
          name={name}
        />

        <label className="grid gap-1.5 text-[13px] font-bold">
          Role
          <select
            className={adminInput}
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-2">
          <div>
            <b className="text-[13px]">Extra page access</b>
            <p className="text-[12px] text-mute">
              Give just this person more pages than their role has. Locked ticks
              come from the role.
            </p>
          </div>
          <PermissionMatrix
            value={extra}
            onChange={setExtra}
            inherited={role?.permissions ?? []}
            allowed={allowed}
          />
        </div>

        <div className="grid gap-2.5 text-[13px] font-semibold">
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              className="size-4 accent-[#1b5fd9]"
              checked={mustChange}
              onChange={(e) => setMustChange(e.target.checked)}
            />
            Make them choose a new password at first sign in (recommended)
          </label>
          {me.isSuperAdmin && (
            <label className="flex items-center gap-2.5 text-red-700">
              <input
                type="checkbox"
                className="size-4 accent-red-600"
                checked={superAdmin}
                onChange={(e) => setSuperAdmin(e.target.checked)}
              />
              Super admin (full access to everything, including other admins)
            </label>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2.5">
          <button type="button" onClick={onClose} className={adminBtn.ghost}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || weak || !name || !email}
            className={adminBtn.primary}
          >
            {busy ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            Create admin
          </button>
        </div>
      </form>
    </Modal>
  )
}

/* ------------------------------------------------------------------ edit */

function EditUserModal({
  user,
  me,
  roles,
  onClose,
  onChanged,
  canDelete,
}: {
  user: ClientUser
  me: Me
  roles: RoleLite[]
  onClose: () => void
  onChanged: () => void
  canDelete: boolean
}) {
  const [name, setName] = useState(user.name)
  const [roleId, setRoleId] = useState(user.roleId)
  const [extra, setExtra] = useState<string[]>(user.extraPermissions)
  const [isActive, setIsActive] = useState(user.isActive)
  const [superAdmin, setSuperAdmin] = useState(user.isSuperAdmin)
  const [newPassword, setNewPassword] = useState("")
  const [busy, setBusy] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isSelf = user.id === me.id
  const targetIsSuper = user.isSuperAdmin
  const readOnly = targetIsSuper && !me.isSuperAdmin
  const role = roles.find((r) => r.id === roleId)
  const allowed = useMemo(
    () => (me.isSuperAdmin ? undefined : new Set(me.permissions)),
    [me],
  )

  const run = async (
    key: string,
    method: "PATCH" | "DELETE",
    body: unknown,
    okText: string,
    after?: () => void,
  ) => {
    setBusy(key)
    const res = await api(method, `/api/admin/users/${user.id}`, body, {
      success: okText,
    })
    setBusy(null)
    if (!res.ok) return
    onChanged()
    after?.()
  }

  const save = () =>
    run(
      "save",
      "PATCH",
      isSelf
        ? { name }
        : {
            name,
            roleId,
            extraPermissions: extra,
            isActive,
            ...(me.isSuperAdmin ? { isSuperAdmin: superAdmin } : {}),
          },
      "Saved",
    )

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={user.name}
      description={user.email}
    >
      <div className="grid gap-5">
        {readOnly && (
          <p className="rounded-xl bg-amber-50 p-3 text-[13px] font-semibold text-amber-800">
            Only a super admin can change this account.
          </p>
        )}
        {isSelf && (
          <p className="rounded-xl bg-pale p-3 text-[13px] font-semibold text-mute">
            You cannot change your own role or access. Ask another admin.
          </p>
        )}

        {isLocked(user) && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5">
            <span className="flex items-center gap-2 text-[13px] font-bold text-red-700">
              <Lock size={16} /> Locked after too many failed sign-ins
            </span>
            <button
              onClick={() =>
                run("unlock", "PATCH", { unlock: true }, "Account unlocked")
              }
              disabled={busy !== null || readOnly}
              className={adminBtn.ghost}
            >
              {busy === "unlock" ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Unlock size={15} />
              )}
              Unlock now
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
          <label className="grid gap-1.5 text-[13px] font-bold">
            Full name
            <input
              className={adminInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={readOnly}
            />
          </label>
          <label className="grid gap-1.5 text-[13px] font-bold">
            Role
            <select
              className={adminInput}
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              disabled={isSelf || readOnly}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-2">
          <div>
            <b className="text-[13px]">Extra page access</b>
            <p className="text-[12px] text-mute">
              Tick a page to give {user.name.split(" ")[0]} access without
              changing their role.
            </p>
          </div>
          <PermissionMatrix
            value={extra}
            onChange={setExtra}
            inherited={superAdmin ? [] : (role?.permissions ?? [])}
            allowed={allowed}
            disabled={isSelf || readOnly || superAdmin}
          />
          {superAdmin && (
            <p className="text-[12px] font-semibold text-mute">
              Super admins can open every page, so these ticks do not matter.
            </p>
          )}
        </div>

        <div className="grid gap-2.5 text-[13px] font-semibold">
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              className="size-4 accent-[#1b5fd9]"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSelf || readOnly}
            />
            Account is active (untick to block sign in immediately)
          </label>
          {me.isSuperAdmin && !isSelf && (
            <label className="flex items-center gap-2.5 text-red-700">
              <input
                type="checkbox"
                className="size-4 accent-red-600"
                checked={superAdmin}
                onChange={(e) => setSuperAdmin(e.target.checked)}
              />
              Super admin
            </label>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={busy !== null || readOnly}
            className={adminBtn.primary}
          >
            {busy === "save" && <Loader2 size={16} className="animate-spin" />}{" "}
            Save changes
          </button>
        </div>

        {!isSelf && !readOnly && (
          <div className="grid gap-3 rounded-2xl border border-line p-4">
            <b className="text-[14px]">Reset password</b>
            <PasswordField
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              email={user.email}
              name={user.name}
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] text-mute">
                They are signed out everywhere and must choose a new password at
                next sign in.
              </p>
              <button
                onClick={() =>
                  run("pw", "PATCH", { newPassword }, "Password reset", () =>
                    setNewPassword(""),
                  )
                }
                disabled={
                  busy !== null ||
                  !newPassword ||
                  passwordProblems(newPassword, {
                    email: user.email,
                    name: user.name,
                  }).length > 0
                }
                className={adminBtn.ghost}
              >
                {busy === "pw" && (
                  <Loader2 size={15} className="animate-spin" />
                )}{" "}
                Set password
              </button>
            </div>
          </div>
        )}

        {canDelete && !isSelf && !readOnly && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50/60 p-4">
            <span className="flex items-center gap-2 text-[13px] font-bold text-red-700">
              <ShieldAlert size={16} /> Delete this admin permanently
            </span>
            {confirmDelete ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className={adminBtn.ghost}
                >
                  Keep
                </button>
                <button
                  onClick={() =>
                    run("del", "DELETE", undefined, "Deleted", onClose)
                  }
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
                onClick={() => setConfirmDelete(true)}
                className={adminBtn.danger}
              >
                <Trash2 size={15} /> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
