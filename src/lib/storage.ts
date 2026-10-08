import { STORAGE_KEYS } from '@/lib/constants'
import type { AuthUser } from '@/types/auth'

function getStoredValue(key: string) {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key)
}

export function getAccessToken() {
  return getStoredValue(STORAGE_KEYS.ACCESS_TOKEN)
}

export function getRefreshToken() {
  return getStoredValue(STORAGE_KEYS.REFRESH_TOKEN)
}

export function setTokens(accessToken: string, refreshToken?: string, rememberMe?: boolean) {
  const persistSession = rememberMe ?? Boolean(
    localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
    localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  )
  clearAuthStorage()
  const storage = persistSession ? localStorage : sessionStorage
  storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  if (refreshToken) storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
}

export function getStoredUser(): AuthUser | null {
  const value = getStoredValue(STORAGE_KEYS.USER)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as AuthUser
  } catch {
    localStorage.removeItem(STORAGE_KEYS.USER)
    sessionStorage.removeItem(STORAGE_KEYS.USER)
    return null
  }
}

export function setStoredUser(user: AuthUser, rememberMe = true) {
  localStorage.removeItem(STORAGE_KEYS.USER)
  sessionStorage.removeItem(STORAGE_KEYS.USER)
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export function clearAuthStorage() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  }
  localStorage.removeItem(STORAGE_KEYS.USER)
  sessionStorage.removeItem(STORAGE_KEYS.USER)
}
