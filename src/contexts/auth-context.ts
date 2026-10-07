import { createContext } from 'react'
import type { AccessProfile } from '@/types/access'

export type AuthContextValue = {
  user: AccessProfile | null
  isAuthenticated: boolean
  isLoadingSession: boolean
  sessionError: string | null
  retrySession: () => Promise<void>
  triggerSessionError: (customMessage?: string) => void
  clearSessionError: () => void
  login: (details: {
    email: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)