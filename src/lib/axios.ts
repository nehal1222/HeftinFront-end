import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import { clearAuthStorage, getAccessToken, getRefreshToken, setTokens } from '@/lib/storage'

type RetryConfig = InternalAxiosRequestConfig & { _authRetry?: boolean }
type RefreshResponse = {
  access_token?: string
  refresh_token?: string
  accessToken?: string
  refreshToken?: string
  data?: RefreshResponse
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
    const url = originalRequest?.url ?? ''
    const isAuthEndpoint = /(?:^|\/)auth\/(?:login|refresh)(?:\/|$)/.test(url)

    if (error.response?.status !== 401 || !originalRequest || originalRequest._authRetry || isAuthEndpoint) {
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
          // Keep redirecting even when browser storage is blocked.
        }
      }
      if (window.location.pathname !== ROUTES.LOGIN) window.location.replace(ROUTES.LOGIN)
      return Promise.reject(error)
    }
  },
)

function getRefreshedAccessToken() {
  if (refreshRequest) return refreshRequest
  const refreshToken = getRefreshToken()
  if (!refreshToken) return Promise.reject(new Error('No refresh token is available.'))

  refreshRequest = api.post<RefreshResponse>('/auth/refresh', { refresh_token: refreshToken })
    .then(({ data }) => {
      const payload = data.data ?? data
      const accessToken = payload.access_token ?? payload.accessToken
      const nextRefreshToken = payload.refresh_token ?? payload.refreshToken ?? refreshToken
      if (!accessToken) throw new Error('Refresh response did not include an access token.')
      setTokens(accessToken, nextRefreshToken)
      return accessToken
    })
    .finally(() => {
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
