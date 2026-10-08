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
  isAuthenticated: boolean
  login: (payload: LoginRequest, rememberMe?: boolean) => Promise<AuthTokenResponse>
  logout: () => Promise<void>
  hasRight: (right: RightCode) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)
