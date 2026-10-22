import type { AuthResponse } from "../../types/src/index"

const API_URL = (
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "/api" : "http://localhost:4000/api")
).replace(/\/$/, "")

let getAccessToken = () => null as string | null
let updateSession = (_session: AuthResponse) => {}
let expireSession = () => {}
let refreshPromise: Promise<AuthResponse | null> | null = null

export function configureApi(
  getToken: () => string | null,
  onSession: (session: AuthResponse) => void,
  onExpired: () => void,
) {
  getAccessToken = getToken
  updateSession = onSession
  expireSession = onExpired
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function refreshAccessToken(): Promise<AuthResponse | null> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) return null
        return (await response.json()) as AuthResponse
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const perform = (token: string | null) => {
    const headers = new Headers(init.headers)
    if (token) headers.set("Authorization", `Bearer ${token}`)
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }
    return fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      credentials: "include",
    })
  }

  let token = getAccessToken()
  let response = await perform(token)
  if (response.status === 401 && token && path !== "/auth/refresh") {
    const session = await refreshAccessToken()
    if (session) {
      updateSession(session)
      token = session.accessToken
      response = await perform(token)
    } else {
      expireSession()
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null
    throw new ApiError(body?.message ?? "The request could not be completed.", response.status)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
