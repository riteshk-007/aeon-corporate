import { toast } from "sonner"

/** Tiny fetch helper for the admin panel (same-origin JSON). */
export type ApiResult<T = Record<string, unknown>> =
  | { ok: true; data: T }
  | {
      ok: false
      error: string
      status: number
      issues?: { path: string; message: string }[]
    }

export type ApiOptions = {
  /** toast shown when the call works */
  success?: string
  /** do not toast failures (the caller shows them itself) */
  silent?: boolean
}

/**
 * Calls the admin API. Failures show an error toast and successes can show a
 * success toast, so screens don't each re-invent messages.
 */
export async function api<T = Record<string, unknown>>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  body?: unknown,
  options: ApiOptions = {},
): Promise<ApiResult<T>> {
  const result = await request<T>(method, url, body)
  if (result.ok) {
    if (options.success) toast.success(options.success)
  } else if (!options.silent) {
    toast.error(result.error)
  }
  return result
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  body?: unknown,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers:
        body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "same-origin",
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) return { ok: true, data: data as T }
    return {
      ok: false,
      status: res.status,
      error: (data as { error?: string }).error ?? "Something went wrong",
      issues: (data as { issues?: { path: string; message: string }[] }).issues,
    }
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Network error. Check your connection.",
    }
  }
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Never"
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}
