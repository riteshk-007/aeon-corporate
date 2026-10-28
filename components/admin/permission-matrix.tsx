"use client"

import { Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { MODULES, type ActionKey } from "@/lib/auth/permissions"

const ACTIONS: ActionKey[] = ["view", "create", "edit", "delete"]

/**
 * Page-by-page access grid: one row per admin page, one column per action.
 * `inherited` are permissions that come from the role (shown locked).
 * `allowed` limits what the signed-in admin may hand out.
 */
export function PermissionMatrix({
  value,
  onChange,
  inherited = [],
  allowed,
  disabled,
}: {
  value: string[]
  onChange: (next: string[]) => void
  inherited?: string[]
  allowed?: Set<string>
  disabled?: boolean
}) {
  const own = new Set(value)
  const fromRole = new Set(inherited)

  const toggle = (module: string, action: ActionKey) => {
    const key = `${module}:${action}`
    const next = new Set(own)
    if (next.has(key)) {
      next.delete(key)
      // Removing "view" also removes the actions that depend on it.
      if (action === "view") {
        for (const a of ACTIONS) next.delete(`${module}:${a}`)
      }
    } else {
      next.add(key)
      // Any action needs the page to be viewable.
      if (action !== "view" && !fromRole.has(`${module}:view`)) {
        next.add(`${module}:view`)
      }
    }
    onChange([...next])
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[520px] text-left text-[13px]">
        <thead className="bg-pale text-[11px] font-black tracking-[.12em] text-mute uppercase">
          <tr>
            <th className="px-4 py-3">Page</th>
            {ACTIONS.map((a) => (
              <th key={a} className="w-[80px] px-2 py-3 text-center">
                {a}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {MODULES.map((m) => (
            <tr key={m.key}>
              <td className="px-4 py-3">
                <b className="block text-[13px]">{m.label}</b>
                <small className="text-[12px] text-mute">{m.description}</small>
              </td>
              {ACTIONS.map((a) => {
                if (!(m.actions as readonly string[]).includes(a)) {
                  return (
                    <td key={a} className="px-2 py-3 text-center text-mute/40">
                      –
                    </td>
                  )
                }
                const key = `${m.key}:${a}`
                const locked = fromRole.has(key)
                const on = locked || own.has(key)
                const canGrant = !allowed || allowed.has(key)
                const off = disabled || locked || (!canGrant && !on)
                return (
                  <td key={a} className="px-2 py-3 text-center">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      aria-label={`${m.label}: ${a}`}
                      disabled={off}
                      onClick={() => toggle(m.key, a)}
                      className={cn(
                        "mx-auto grid size-7 place-items-center rounded-lg border transition",
                        on
                          ? locked
                            ? "border-line bg-[#dcebff] text-brand"
                            : "border-brand bg-brand text-white"
                          : "border-line bg-white text-transparent hover:border-brand",
                        off && !on && "cursor-not-allowed bg-pale opacity-60",
                        locked && "cursor-default",
                      )}
                    >
                      {locked ? <Lock size={12} /> : <Check size={15} />}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
