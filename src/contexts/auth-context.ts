import { createContext } from 'react'
import type { AuthProfile, DemoPersonaId, RightCode, Scope } from '@/types/auth'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type AuthContextValue = {
  profile: AuthProfile | null
  personaId: DemoPersonaId | null
  status: AuthStatus
  login: (personaId: DemoPersonaId) => Promise<void>
  logout: () => void
  hasRight: (right: RightCode) => boolean
  canAccess: (right: RightCode, scope?: Scope) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)