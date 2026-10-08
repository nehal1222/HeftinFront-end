import api from '@/lib/axios'
import { clearAuthStorage, getAccessToken } from '@/lib/storage'
import { developmentAuthService } from '@/services/development-auth.service'
import type {
  AuthTokenResponse,
  AuthMeResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshRequest,
  RefreshResponse,
  ResetPasswordRequest,
} from '@/types/auth'

export const authService = {
  async login(payload: LoginRequest) {
    const developmentResponse = developmentAuthService.login(payload)
    if (developmentResponse) return developmentResponse

    const { data } = await api.post<AuthTokenResponse>(
      '/auth/login',
      payload,
    )

    return data
  },

  async refresh(payload: RefreshRequest) {
    const developmentResponse = developmentAuthService.refresh(payload.refresh_token)
    if (developmentResponse) return developmentResponse

    const { data } = await api.post<RefreshResponse>(
      '/auth/refresh',
      payload,
    )

    return data
  },

  async logout() {
    const isDevelopmentSession = developmentAuthService.isAccessToken(getAccessToken())

    try {
      if (!isDevelopmentSession) await api.post('/auth/logout')
    } catch {
      // Local logout must still complete when the backend is unavailable.
    } finally {
      clearAuthStorage()
    }
  },

  async getMe() {
    const developmentUser = developmentAuthService.getMe(getAccessToken())
    if (developmentUser) return developmentUser

    const { data } = await api.get<AuthMeResponse>('/auth/me')
    return data
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
