import { createContext } from 'react'
import type { AuthProfile, DemoPersonaId, RightCode } from '@/types/auth'

export type AuthContextValue = {
  profile: AuthProfile
  personaId: DemoPersonaId
  setPersona: (personaId: DemoPersonaId) => void
  hasRight: (right: RightCode) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)
