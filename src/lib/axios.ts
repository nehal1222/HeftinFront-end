import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@/lib/storage'

type ApiErrorResponse = {
  code?: string
  message?: string
  fields?: Record<string, string> | null
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (
    accessToken &&
    config.url !== '/auth/login' &&
    config.url !== '/auth/refresh'
  ) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url === '/auth/login' ||
      originalRequest.url === '/auth/refresh'
    ) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      clearAuthStorage()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const { data } = await api.post<{
        access_token: string
        refresh_token: string
        token_type: string
      }>('/auth/refresh', {
        refresh_token: refreshToken,
      })

      setTokens(data.access_token, data.refresh_token)

      originalRequest.headers.Authorization = `Bearer ${data.access_token}`

      return api(originalRequest)
    } catch (refreshError) {
      clearAuthStorage()
      return Promise.reject(refreshError)
    }
  },
)

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
) {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<ApiErrorResponse>

    return ax.response?.data?.message || ax.message || fallback
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export default api
