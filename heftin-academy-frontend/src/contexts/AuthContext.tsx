import { useState, type ReactNode } from 'react'
import { createAccessProfile } from '@/lib/access'
import { getStoredUser, setStoredUser, setTokens } from '@/lib/storage'
import { AuthContext } from '@/contexts/auth-context'
import { authService } from '@/services/auth.service'
import type { AccessProfile, SubscriptionPlan, UserRole } from '@/types/access'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccessProfile | null>(() => getStoredUser())

  async function login(details: { displayName: string; email: string; role: UserRole; plan: SubscriptionPlan; password?: string }) {
    try {
      await authService.login({ email: details.email, password: details.password || 'Test@1234' })
      try {
        const me = await authService.getMe()
        if (me) {
          const profile = createAccessProfile(me.name || details.displayName, me.email || details.email, me.role || details.role, details.plan)
          setStoredUser(profile)
          setUser(profile)
          return
        }
      } catch {
        // /auth/me not available yet (BE-10), continue with hydrated profile
      }
    } catch {
      // Backend offline or login failed - continue with local demo access
    }

    const profile = createAccessProfile(details.displayName, details.email, details.role, details.plan)
    setTokens('demo-access-token', 'demo-refresh-token')
    setStoredUser(profile)
    setUser(profile)
  }

  async function logout() {
    await authService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout }}>{children}</AuthContext.Provider>
}
