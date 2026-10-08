import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authService } from '@/services/auth.service'
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  isPersistentSession,
  setStoredUser,
  setTokens,
} from '@/lib/storage'
import type { AuthMeResponse, AuthUser, LoginRequest, RightCode } from '@/types/auth'
import { AuthContext } from '@/contexts/auth-context'
import { hasRight as userHasRight } from '@/lib/rights'

type AuthProviderProps = {
  children: ReactNode
}

function normalizeUser(me: AuthMeResponse, fallback?: AuthUser | null): AuthUser {
  return {
    id: me.id ?? fallback?.id ?? '',
    email: me.email ?? fallback?.email ?? '',
    mobile: me.mobile ?? fallback?.mobile ?? null,
    full_name: me.full_name ?? me.name ?? fallback?.full_name ?? me.email,
    status: me.status ?? fallback?.status ?? 'active',
    must_change_password: me.must_change_password ?? fallback?.must_change_password ?? false,
    roles: me.roles,
    rights: me.rights,
    current_organization: me.current_organization ?? null,
  }
}

function assertAccessToken(accessToken: unknown): asserts accessToken is string {
  if (typeof accessToken !== 'string' || !accessToken.trim()) {
    throw new Error('Sign-in failed because the server did not return an access token.')
  }
}

function assertAuthMe(me: AuthMeResponse) {
  if (
    !me ||
    typeof me.id !== 'string' ||
    typeof me.email !== 'string' ||
    !Array.isArray(me.roles) ||
    !Array.isArray(me.rights)
  ) {
    throw new Error('Sign-in failed because the account profile is incomplete.')
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)

  const hydrateSession = useCallback(async () => {
    const accessToken = getAccessToken()
    const storedUser = getStoredUser()

    if (!accessToken) {
      clearAuthStorage()
      setUser(null)
      setSessionError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setSessionError(null)

    try {
      const me = await authService.getMe()
      assertAuthMe(me)
      const sessionUser = normalizeUser(me, storedUser)
      setStoredUser(sessionUser, isPersistentSession())
      setUser(sessionUser)
    } catch {
      clearAuthStorage()
      setUser(null)
      setSessionError('Your session has expired or is invalid. Please sign in again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (import.meta.env.DEV && params.get('simulate_session_error') === 'true') {
      setSessionError('Session verification failed: authentication token is invalid.')
      setIsLoading(false)
      return
    }

    void hydrateSession()
  }, [hydrateSession])

  const login = useCallback(async (payload: LoginRequest, rememberMe = true) => {
    const response = await authService.login(payload)
    assertAccessToken(response.access_token)

    setTokens(
      response.access_token,
      response.refresh_token,
      rememberMe,
    )

    try {
      const me = await authService.getMe()
      assertAuthMe(me)
      const sessionUser = normalizeUser(me)

      setStoredUser(sessionUser, rememberMe)
      setUser(sessionUser)
      setSessionError(null)
    } catch (error) {
      clearAuthStorage()
      setUser(null)
      throw error
    }

    return response
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setSessionError(null)
    }
  }, [])

  const triggerSessionError = useCallback((message?: string) => {
    setSessionError(
      message ?? 'Session verification failed: authentication token has expired or is invalid.',
    )
  }, [])

  const clearSessionError = useCallback(() => setSessionError(null), [])

  const hasRight = useCallback(
    (right: RightCode) => userHasRight(user?.rights ?? [], right),
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isLoadingSession: isLoading,
      isAuthenticated: Boolean(user),
      sessionError,
      login,
      logout,
      hasRight,
      retrySession: hydrateSession,
      triggerSessionError,
      clearSessionError,
    }),
    [
      user,
      isLoading,
      sessionError,
      login,
      logout,
      hasRight,
      hydrateSession,
      triggerSessionError,
      clearSessionError,
    ],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
