import { useState, type ReactNode } from 'react'
import { createAccessProfile } from '@/lib/access'
import { getStoredUser, setStoredUser, setTokens, clearAuthStorage } from '@/lib/storage'
import { AuthContext } from '@/contexts/auth-context'
import type { AccessProfile, SubscriptionPlan, UserRole } from '@/types/access'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccessProfile | null>(() => getStoredUser())

  function login(details: { displayName: string; email: string; role: UserRole; plan: SubscriptionPlan }) {
    const profile = createAccessProfile(details.displayName, details.email, details.role, details.plan)
    setTokens('demo-access-token', 'demo-refresh-token')
    setStoredUser(profile)
    setUser(profile)
  }

  function logout() {
    clearAuthStorage()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout }}>{children}</AuthContext.Provider>
}
