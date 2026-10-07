import { useEffect, useState, type ReactNode } from 'react'
import { createAccessProfile } from '@/lib/access'
import { clearAuthStorage, getAccessToken, setStoredUser } from '@/lib/storage'
import { AuthContext } from '@/contexts/auth-context'
import { authService } from '@/services/auth.service'
import type { AccessProfile } from '@/types/access'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccessProfile | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)

  async function hydrateSession() {
    const token = getAccessToken()

    if (!token) {
      setUser(null)
      setIsLoadingSession(false)
      return
    }

    setIsLoadingSession(true)
    setSessionError(null)

    try {
      const me = await authService.getMe()

      const profile = createAccessProfile(
        me.name,
        me.email,
        me.role,
        me.plan || 'scholar',
      )

      setStoredUser(profile)
      setUser(profile)
    } catch {
      clearAuthStorage()
      setUser(null)
      setSessionError(
        'Your session has expired or is invalid. Please sign in again.',
      )
    } finally {
      setIsLoadingSession(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get('simulate_session_error') === 'true') {
      setSessionError(
        'Session verification failed: Authentication token is invalid.',
      )
      setIsLoadingSession(false)
      return
    }

    hydrateSession()
  }, [])

  function triggerSessionError(customMessage?: string) {
    setSessionError(
      customMessage ||
        'Session verification failed: Authentication token has expired or is invalid.',
    )
  }

  function clearSessionError() {
    setSessionError(null)
  }

  async function retrySession() {
    await hydrateSession()
  }

  async function login(details: { email: string; password: string }) {
    setSessionError(null)

    // Step 1: authenticate with the backend.
    await authService.login({
      email: details.email.trim(),
      password: details.password,
    })

    // Step 2: get the authenticated user's real profile.
    const me = await authService.getMe()

    // Step 3: build the frontend access profile from backend data.
    const profile = createAccessProfile(
      me.name,
      me.email,
      me.role,
      me.plan || 'scholar',
    )

    setStoredUser(profile)
    setUser(profile)
  }

  async function logout() {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoadingSession,
        sessionError,
        retrySession,
        triggerSessionError,
        clearSessionError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
