import axios, { type AxiosError, type AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

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
