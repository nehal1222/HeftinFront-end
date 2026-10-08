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
  setStoredUser,
  setTokens,
} from '@/lib/storage'
import type { AuthUser, LoginRequest, RightCode } from '@/types/auth'
import { AuthContext } from '@/contexts/auth-context'
import { hasRight as userHasRight } from '@/lib/rights'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const accessToken = getAccessToken()
    const storedUser = getStoredUser()

    if (accessToken && storedUser) {
      setUser(storedUser)
    } else {
      clearAuthStorage()
      setUser(null)
    }

    setIsLoading(false)
  }, [])

  const login = useCallback(async (payload: LoginRequest, rememberMe = true) => {
    const response = await authService.login(payload)
    const sessionUser: AuthUser = {
      ...response.user,
      roles: response.roles ?? [],
      rights: response.rights ?? [],
    }

    setTokens(
      response.access_token,
      response.refresh_token,
      rememberMe,
    )

    setStoredUser(sessionUser, rememberMe)
    setUser(sessionUser)

    return response
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const hasRight = useCallback(
    (right: RightCode) => userHasRight(user?.rights ?? [], right),
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      hasRight,
    }),
    [user, isLoading, login, logout, hasRight],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
