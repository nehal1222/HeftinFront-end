import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { ROUTES } from '@/lib/constants'
import { clearAuthStorage, getAccessToken, getRefreshToken, setTokens } from '@/lib/storage'

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }
type RefreshResponse = {
  access_token?: string
  refresh_token?: string
  accessToken?: string
  refreshToken?: string
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
  const accessToken = getAccessToken()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined
    const isAuthEndpoint = /(?:^|\/)auth\/(?:login|refresh)(?:\/|$)/.test(originalRequest?.url ?? '')

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const accessToken = await refreshAccessToken()
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch {
      try {
        clearAuthStorage()
      } catch {
        // The login redirect still needs to run if browser storage is unavailable.
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:expired'))
        const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')
        const loginUrl = `${base}${ROUTES.LOGIN}?expired=true`
        if (!window.location.search.includes('expired=true')) {
          window.location.replace(loginUrl)
        }
      }
      return Promise.reject(error)
    }
  },
)

function refreshAccessToken() {
  if (refreshRequest) return refreshRequest

  const refreshToken = getRefreshToken()
  if (!refreshToken) return Promise.reject(new Error('No refresh token available'))

  refreshRequest = axios.post<RefreshResponse>(
    `${api.defaults.baseURL ?? ''}/auth/refresh`,
    { refresh_token: refreshToken },
    { timeout: 30000, headers: { 'Content-Type': 'application/json' } },
  ).then(({ data }) => {
    const accessToken = data.access_token ?? data.accessToken
    if (!accessToken) throw new Error('Refresh response did not contain an access token')
    setTokens(accessToken, data.refresh_token ?? data.refreshToken ?? refreshToken)
    return accessToken
  }).finally(() => {
    refreshRequest = null
  })

  return refreshRequest
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<{ message?: string; detail?: string }>
    return ax.response?.data?.message || ax.response?.data?.detail || ax.message || fallback
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

export default api
