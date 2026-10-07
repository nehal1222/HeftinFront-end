import { STORAGE_KEYS } from '@/lib/constants'

function getStoredValue(key: string) {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key)
}

export function getAccessToken() {
  return getStoredValue(STORAGE_KEYS.ACCESS_TOKEN)
}

export function getRefreshToken() {
  return getStoredValue(STORAGE_KEYS.REFRESH_TOKEN)
}

export function setTokens(accessToken: string, refreshToken?: string, rememberMe = true) {
  clearAuthStorage()
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  if (refreshToken) storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
}

export function clearAuthStorage() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  }
  localStorage.removeItem(STORAGE_KEYS.USER)
  sessionStorage.removeItem(STORAGE_KEYS.USER)
}
