/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearAuthStorage,
  getAccessToken,
} from '@/lib/storage'

type AuthContextValue = {
  isAuthenticated: boolean
  isLoading: boolean
  user: unknown | null
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Placeholder until FE-12 adds the real token -> /auth/me session check.
  const [isLoading] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(getAccessToken()),
  )

  const [user] = useState<unknown | null>(null)

  function signOut() {
    clearAuthStorage()
    setIsAuthenticated(false)
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      signOut,
    }),
    [isAuthenticated, isLoading, user],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}