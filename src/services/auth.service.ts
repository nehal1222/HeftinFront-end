import api from '@/lib/axios'
import type {
  AuthTokenResponse,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
} from '@/types/auth'

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await api.post<AuthTokenResponse>('/auth/login', payload)
    return data
  },

  async forgotPassword(payload: ForgotPasswordRequest) {
    await api.post('/auth/forgot-password', payload)
  },

  async resetPassword(payload: ResetPasswordRequest) {
    await api.post('/auth/reset-password', payload)
  },
}