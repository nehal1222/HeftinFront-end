import { createContext } from 'react'
import type {
  AuthTokenResponse,
  AuthUser,
  LoginRequest,
  RightCode,
} from '@/types/auth'

export type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  isLoadingSession: boolean
  isAuthenticated: boolean
  sessionError: string | null
  login: (payload: LoginRequest, rememberMe?: boolean) => Promise<AuthTokenResponse>
  logout: () => Promise<void>
  hasRight: (right: RightCode) => boolean
  retrySession: () => Promise<void>
  triggerSessionError: (message?: string) => void
  clearSessionError: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)
