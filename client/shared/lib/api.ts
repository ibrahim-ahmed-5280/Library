import type { User } from '../types'

let accessToken: string | null = null
let refreshing: Promise<{ accessToken: string; user: User }> | null = null
export function setAccessToken(token: string | null) {
  accessToken = token
}
export class RequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}
async function parse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T
  const data = await response
    .json()
    .catch(() => ({ message: 'The API is unavailable. Check that the server is running.' }))
  if (!response.ok) throw new RequestError(response.status, data.message ?? 'Request failed')
  return data
}
export async function refreshSession() {
  if (!refreshing)
    refreshing = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .then(parse<{ accessToken: string; user: User }>)
      .then((data) => {
        accessToken = data.accessToken
        return data
      })
      .finally(() => {
        refreshing = null
      })
  return refreshing
}
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const request = () =>
    fetch(`/api${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    })
  let response: Response
  try {
    response = await request()
  } catch {
    throw new RequestError(
      503,
      'Cannot reach the server. Please check your connection and try again.',
    )
  }
  if (response.status === 401 && accessToken && !path.startsWith('/auth/')) {
    try {
      await refreshSession()
      response = await request()
    } catch {
      accessToken = null
      throw new RequestError(401, 'Your session has expired. Please sign in again.')
    }
  }
  if (response.ok && response.headers.get('content-type')?.includes('text/csv'))
    return (await response.blob()) as T
  return parse<T>(response)
}
export const body = (data: unknown) => JSON.stringify(data)
