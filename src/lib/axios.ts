import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { ROUTES, SESSION_KEYS, STORAGE_KEYS } from '@/lib/constants'
import { clearAuthStorage, getAccessToken, getRefreshToken, setTokens } from '@/lib/storage'
import type { RefreshResponse } from '@/types/auth'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean
  }
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _authRetry?: boolean
  skipAuth?: boolean
}

type FlexibleRefreshResponse = Partial<RefreshResponse> & {
  accessToken?: string
  refreshToken?: string
  data?: FlexibleRefreshResponse
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

let refreshRequest: Promise<string> | null = null

api.interceptors.request.use((config) => {
  const customConfig = config as InternalAxiosRequestConfig & { skipAuth?: boolean }

  if (customConfig.skipAuth) {
    if (config.headers && config.headers.Authorization) {
      delete config.headers.Authorization
    }
    return config
  }

  const accessToken = getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const url = originalRequest?.url ?? ''
    const isAuthEndpoint = /(?:^|\/)auth\/(?:login|refresh)(?:\/|$)/.test(url)
    const isPublicEndpoint = Boolean(originalRequest?.skipAuth)

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._authRetry ||
      isAuthEndpoint ||
      isPublicEndpoint
    ) {
      return Promise.reject(error)
    }

    originalRequest._authRetry = true

    try {
      const accessToken = await getRefreshedAccessToken()
      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      return api(originalRequest)
    } catch {
      try {
        clearAuthStorage()
      } catch {
        try {
          localStorage.removeItem(STORAGE_KEYS.USER)
        } catch {
          // Continue to login even when browser storage is unavailable.
        }
      }

      if (window.location.pathname !== ROUTES.LOGIN) {
        const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`

        try {
          sessionStorage.setItem(SESSION_KEYS.SESSION_EXPIRED, 'true')
        } catch {
          // Continue to login even when session storage is unavailable.
        }

        window.location.replace(
          `${ROUTES.LOGIN}?returnTo=${encodeURIComponent(returnTo)}`,
        )
      }

      return Promise.reject(error)
    }
  },
)

function getRefreshedAccessToken() {
  if (refreshRequest) return refreshRequest

  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return Promise.reject(new Error('No refresh token is available.'))
  }

  refreshRequest = api
    .post<FlexibleRefreshResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    .then(({ data }) => {
      const payload = data.data ?? data
      const accessToken = payload.access_token ?? payload.accessToken
      const nextRefreshToken = payload.refresh_token ?? payload.refreshToken ?? refreshToken

      if (!accessToken) {
        throw new Error('Refresh response did not include an access token.')
      }

      setTokens(accessToken, nextRefreshToken)
      return accessToken
    })
    .finally(() => {
      refreshRequest = null
    })

  return refreshRequest
}

type ApiErrorBody = {
  message?: unknown
  detail?: unknown
  errors?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getMessage(value: unknown): string | undefined {
  if (typeof value === 'string') return value.trim() || undefined
  if (!Array.isArray(value)) {
    if (isRecord(value)) return getMessage(value.message) ?? getMessage(value.msg)
    return undefined
  }

  const messages = value.map(getMessage).filter((message): message is string => Boolean(message))
  return messages.length ? messages.join('; ') : undefined
}

function addFieldError(
  fieldErrors: Record<string, string>,
  field: string,
  value: unknown,
) {
  const message = getMessage(value)
  if (message) fieldErrors[field] = fieldErrors[field] ? `${fieldErrors[field]}; ${message}` : message
}

function addValidationErrors(fieldErrors: Record<string, string>, value: unknown) {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!isRecord(item)) continue
      const location = Array.isArray(item.loc) ? item.loc : []
      const field = [...location].reverse().find(
        (part): part is string =>
          typeof part === 'string' && !['body', 'query', 'path', 'header'].includes(part),
      )
      if (field) addFieldError(fieldErrors, field, item.msg ?? item.message)
    }
    return
  }

  if (!isRecord(value)) return
  for (const [field, message] of Object.entries(value)) {
    addFieldError(fieldErrors, field.split('.').at(-1) ?? field, message)
  }
}

export function getFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return {}

  const body = error.response?.data
  if (!body || !isRecord(body)) return {}

  const fieldErrors: Record<string, string> = {}
  addValidationErrors(fieldErrors, body.errors)
  if (isRecord(body.detail) && body.detail.errors !== undefined) {
    addValidationErrors(fieldErrors, body.detail.errors)
  } else {
    addValidationErrors(fieldErrors, body.detail)
  }
  return fieldErrors
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data
    if (isRecord(body)) {
      return getMessage(body.message) ?? getMessage(body.detail) ?? fallback
    }
    return fallback
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

export default api
