import { createContext } from 'react'
import type { AccessProfile, SubscriptionPlan, UserRole } from '@/types/access'

export type AuthContextValue = {
  user: AccessProfile | null
  isAuthenticated: boolean
  login: (details: { displayName: string; email: string; role: UserRole; plan: SubscriptionPlan; password?: string }) => Promise<void> | void
  logout: () => Promise<void> | void
  switchRole: (role: UserRole) => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
