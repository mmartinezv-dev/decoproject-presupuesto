import { useAuthStore } from '../auth/useAuthStore'

const BASE = '/api'

export interface ApiError extends Error {
  status: number
}

function createApiError(status: number, message: string): ApiError {
  const err = new Error(message) as ApiError
  err.name = 'ApiError'
  err.status = status
  return err
}

async function silentRefresh(auth: ReturnType<typeof useAuthStore>): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/auth/refresh`, { method: 'POST', credentials: 'include' })
    if (res.ok) {
      const { accessToken } = await res.json()
      auth.setToken(accessToken)
      return true
    }
  } catch { /* ignore */ }
  return false
}

export async function httpClient<T>(url: string, opts?: RequestInit, isRetry = false): Promise<T> {
  const auth = useAuthStore()
  const token = auth.getToken()

  const isFormData = opts?.body instanceof FormData
  const res = await fetch(`${BASE}${url}`, {
    credentials: 'include',
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...opts,
  })

  if (res.status === 401 && !isRetry) {
    const refreshed = await silentRefresh(auth)
    if (refreshed) return httpClient<T>(url, opts, true)
    auth.logout()
    window.location.href = '/login'
    throw createApiError(401, 'No autorizado')
  }

  if (res.status === 401) {
    auth.logout()
    window.location.href = '/login'
    throw createApiError(401, 'No autorizado')
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw createApiError(res.status, body || `HTTP ${res.status}`)
  }

  const text = await res.text()
  return text ? (JSON.parse(text) as T) : (null as T)
}

export const http = {
  get:    <T>(url: string)                     => httpClient<T>(url),
  post:   <T>(url: string, data: unknown)      => httpClient<T>(url, { method: 'POST',   body: JSON.stringify(data) }),
  put:    <T>(url: string, data: unknown)      => httpClient<T>(url, { method: 'PUT',    body: JSON.stringify(data) }),
  del:    <T>(url: string)                     => httpClient<T>(url, { method: 'DELETE' }),
  upload: <T>(url: string, fd: FormData)       => httpClient<T>(url, { method: 'POST',   body: fd }),
}
