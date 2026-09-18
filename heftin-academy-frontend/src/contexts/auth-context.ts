import { createContext } from 'react'
import type { AccessProfile, SubscriptionPlan, UserRole } from '@/types/access'

export type AuthContextValue = {
  user: AccessProfile | null
  isAuthenticated: boolean
  login: (details: { displayName: string; email: string; role: UserRole; plan: SubscriptionPlan }) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
