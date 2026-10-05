import { useEffect, useState, type ReactNode } from 'react'
import { authService } from '@/services/auth.service'
import { getAccessToken, getRefreshToken, setStoredUser, setTokens, clearAuthStorage } from '@/lib/storage'
import { AuthContext } from '@/contexts/auth-context'
import type { AccessProfile } from '@/types/access'
import type { AuthStatus } from '@/contexts/auth-context'
import type { LoginCredentials } from '@/types/auth'

function clearStoredAuth() {
  try {
    clearAuthStorage()
  } catch {
    // Authentication state must still be cleared when browser storage is unavailable.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccessProfile | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    let active = true

    if (!getAccessToken() && !getRefreshToken()) {
      clearStoredAuth()
      setStatus('unauthenticated')
      return () => {
        active = false
      }
    }

    authService.getMe().then((profile) => {
      if (!active) return
      setStoredUser(profile)
      setUser(profile)
      setStatus('authenticated')
    }).catch(() => {
      if (!active) return
      clearStoredAuth()
      setUser(null)
      setStatus('unauthenticated')
    })

    const handleAuthExpired = () => {
      clearStoredAuth()
      setUser(null)
      setStatus('unauthenticated')
    }

    window.addEventListener('auth:expired', handleAuthExpired)

    return () => {
      active = false
      window.removeEventListener('auth:expired', handleAuthExpired)
    }
  }, [])

  async function login(credentials: LoginCredentials) {
    try {
      const tokens = await authService.login(credentials)
      setTokens(tokens.accessToken, tokens.refreshToken)
      const profile = await authService.getMe()
      setStoredUser(profile)
      setUser(profile)
      setStatus('authenticated')
    } catch (error) {
      clearStoredAuth()
      setUser(null)
      setStatus('unauthenticated')
      throw error
    }
  }

  function logout() {
    clearStoredAuth()
    setUser(null)
    setStatus('unauthenticated')
  }

  return <AuthContext.Provider value={{ user, status, isAuthenticated: status === 'authenticated' && Boolean(user), login, logout }}>{children}</AuthContext.Provider>
}
