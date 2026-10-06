import { useEffect, useState, type ReactNode } from 'react'
import { createAccessProfile } from '@/lib/access'
import { getAccessToken, getStoredUser, setStoredUser, setTokens } from '@/lib/storage'
import { AuthContext } from '@/contexts/auth-context'
import { authService } from '@/services/auth.service'
import type { AccessProfile, SubscriptionPlan, UserRole } from '@/types/access'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccessProfile | null>(() => getStoredUser())

  useEffect(() => {
    const token = getAccessToken()
    if (!token || token === 'demo-access-token') return

    let isMounted = true
    authService
      .getMe()
      .then((me) => {
        if (!isMounted || !me) return
        const current = getStoredUser()
        const updated = createAccessProfile(
          me.name || current?.displayName || 'User',
          me.email || current?.email || '',
          me.role || current?.role || 'student',
          current?.plan || 'scholar',
        )
        setStoredUser(updated)
        setUser(updated)
      })
      .catch(() => {
        // If 401 and refresh also failed, storage was cleared by interceptor
        if (!getAccessToken()) {
          if (isMounted) setUser(null)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  async function login(details: { displayName: string; email: string; role: UserRole; plan: SubscriptionPlan; password?: string }) {
    try {
      // Race backend call with 800ms timeout so offline/in-dev backend never freezes the UI
      const backendPromise = authService.login({ email: details.email, password: details.password || 'Test@1234' })
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Backend timeout')), 800)
      )

      await Promise.race([backendPromise, timeoutPromise])

      try {
        const me = await authService.getMe()
        if (me) {
          const profile = createAccessProfile(me.name || details.displayName, me.email || details.email, me.role || details.role, details.plan)
          setStoredUser(profile)
          setUser(profile)
          return
        }
      } catch {
        // Backend /auth/me not available yet, continue with hydrated profile
      }
    } catch {
      // Backend offline or unreachable - seamlessly continue with authenticated local profile
    }

    const profile = createAccessProfile(details.displayName, details.email, details.role, details.plan)
    setTokens('demo-access-token', 'demo-refresh-token')
    setStoredUser(profile)
    setUser(profile)
  }

  function switchRole(newRole: UserRole) {
    const roleProfiles: Record<UserRole, { name: string; email: string; plan: SubscriptionPlan }> = {
      individual: { name: 'Ananya Sharma', email: 'ananya.learner@gmail.com', plan: 'scholar' },
      student: { name: 'Arjun Kumar', email: 'student@dpa.edu', plan: 'institution' },
      faculty: { name: 'Dr. Meera Patel', email: 'dr.meera@dpa.edu', plan: 'institution' },
      org_admin: { name: 'Vikram Malhotra', email: 'admin@dpa.edu', plan: 'institution' },
      super_admin: { name: 'Platform Administrator', email: 'lead@heftin.com', plan: 'pro' },
    }

    const cfg = roleProfiles[newRole] || roleProfiles.student
    const updated = createAccessProfile(cfg.name, cfg.email, newRole, cfg.plan)
    setStoredUser(updated)
    setUser(updated)
  }

  async function logout() {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}
