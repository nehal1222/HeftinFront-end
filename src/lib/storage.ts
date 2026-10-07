import { STORAGE_KEYS } from '@/lib/constants'
import type { AuthUser } from '@/types/auth'

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
}

export function getStoredUser(): AuthUser | null {
  const value = localStorage.getItem(STORAGE_KEYS.USER)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as AuthUser
  } catch {
    localStorage.removeItem(STORAGE_KEYS.USER)
    return null
  }
}

export function setStoredUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export function clearAuthStorage() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}
