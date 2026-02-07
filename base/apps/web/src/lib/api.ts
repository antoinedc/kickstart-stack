import type { ErrorCode } from '@{{PROJECT_NAME}}/shared'

// Relative URLs — Caddy reverse proxy routes /api/* to the backend
const API_URL = ''

interface RequestOptions extends RequestInit {
  token?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: ErrorCode | string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new ApiError(
      error.message || 'Request failed',
      response.status,
      error.code || error.error
    )
  }

  return response.json()
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { token }),

  post: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  put: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'DELETE', token }),
}
