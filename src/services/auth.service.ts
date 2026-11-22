import api from '@/lib/axios'
import { clearAuthStorage, getAccessToken } from '@/lib/storage'
import { developmentAuthService } from '@/services/development-auth.service'
import {
  normalizeAuthTokenResponse,
  normalizeSessionUser,
} from '@/lib/auth-envelope'
import type {
  AuthTokenResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshRequest,
  RefreshResponse,
  ResetPasswordRequest,
} from '@/types/auth'

export const authService = {
  async login(payload: LoginRequest): Promise<AuthTokenResponse> {
    const developmentResponse = developmentAuthService.login(payload)
    if (developmentResponse) return normalizeAuthTokenResponse(developmentResponse)
    if (developmentAuthService.isEnabled()) {
      throw new Error('The test email or password is incorrect.')
    }

    const { data } = await api.post('/auth/login', payload)
    return normalizeAuthTokenResponse(data)
  },

  async refresh(payload: RefreshRequest): Promise<RefreshResponse> {
    const developmentResponse = developmentAuthService.refresh(payload.refresh_token)
    if (developmentResponse) return developmentResponse

    const { data } = await api.post<RefreshResponse>(
      '/auth/refresh',
      payload,
    )

    return data
  },

  async logout(): Promise<void> {
    const isDevelopmentSession = developmentAuthService.isAccessToken(getAccessToken())

    try {
      if (!isDevelopmentSession) await api.post('/auth/logout')
    } catch {
      void 0
    } finally {
      clearAuthStorage()
    }
  },

  async getMe() {
    const developmentUser = developmentAuthService.getMe(getAccessToken())
    if (developmentUser) return normalizeSessionUser(developmentUser)

    const { data } = await api.get('/auth/me')
    return normalizeSessionUser(data)
  },

  async forgotPassword(payload: ForgotPasswordRequest) {
    const { data } = await api.post<{ message: string }>('/auth/forgot-password', payload)
    return data
  },

  async resetPassword(payload: ResetPasswordRequest) {
    const { data } = await api.post<{ message: string }>('/auth/reset-password', payload)
    return data
  },
}
