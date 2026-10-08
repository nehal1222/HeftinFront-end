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
import type { AuthUser, LoginRequest } from '@/types/auth'
import { AuthContext } from '@/contexts/auth-context'

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

    setTokens(
      response.access_token,
      response.refresh_token,
      rememberMe,
    )

    setStoredUser(response.user, rememberMe)
    setUser(response.user)

    return response
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
