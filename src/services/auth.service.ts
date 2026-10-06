import api from '@/lib/axios'
import { clearAuthStorage, setTokens } from '@/lib/storage'
import type { SubscriptionPlan, UserRole } from '@/types/access'

export interface LoginPayload {
  email: string
  password?: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type?: string
}

export interface AuthUserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  plan?: SubscriptionPlan
  organization_id?: string
  organization_name?: string
  permissions?: string[]
}

export const authService = {
  /**
   * POST /api/v1/auth/login
   * Authenticates user against backend or returns tokens.
   */
  async login(payload: LoginPayload): Promise<AuthTokens> {
    const { data } = await api.post<AuthTokens>('/auth/login', payload)
    if (data.access_token && data.refresh_token) {
      setTokens(data.access_token, data.refresh_token)
    }
    return data
  },

  /**
   * POST /api/v1/auth/refresh
   * Refreshes JWT access token using the stored refresh token.
   */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    const { data } = await api.post<AuthTokens>('/auth/refresh', { refresh_token: refreshToken })
    if (data.access_token) {
      setTokens(data.access_token, data.refresh_token || refreshToken)
    }
    return data
  },

  /**
   * GET /api/v1/auth/me (BE-10)
   * Fetches the current authenticated user profile and permissions.
   */
  async getMe(): Promise<AuthUserProfile> {
    const { data } = await api.get<AuthUserProfile>('/auth/me')
    return data
  },

  /**
   * POST /api/v1/auth/logout (BE-09)
   * Invalidates token server-side and clears client storage.
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {
      // Gracefully continue even if backend endpoint is in development
    } finally {
      clearAuthStorage()
    }
  },

  /**
   * POST /api/v1/auth/forgot-password (PR #8)
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email })
    return data
  },

  /**
   * POST /api/v1/auth/reset-password (PR #8)
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/auth/reset-password', {
      token,
      new_password: newPassword,
    })
    return data
  },
}
