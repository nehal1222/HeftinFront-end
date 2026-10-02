import { STORAGE_KEYS } from '@/lib/constants'
import type { AuthProfile, DemoPersonaId } from '@/types/auth'

type DemoSession = { personaId: DemoPersonaId; profile: AuthProfile }

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

export function clearAuthStorage() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}

export function getStoredDemoSession(): DemoSession | null {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.USER)
    if (!value) return null
    const parsed = JSON.parse(value) as Partial<DemoSession>
    if (!parsed.personaId || !parsed.profile || !Array.isArray(parsed.profile.rights) || !Array.isArray(parsed.profile.scopes)) return null
    return parsed as DemoSession
  } catch {
    return null
  }
}

export function setStoredDemoSession(session: DemoSession) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(session))
}
