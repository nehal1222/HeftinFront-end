import api from '@/lib/axios'
import { clearAuthStorage } from '@/lib/storage'
import type {
  AuthTokenResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshRequest,
  RefreshResponse,
  ResetPasswordRequest,
} from '@/types/auth'

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await api.post<AuthTokenResponse>('/auth/login', payload)
    return data
  },

  async refresh(payload: RefreshRequest) {
    const { data } = await api.post<RefreshResponse>('/auth/refresh', payload)
    return data
  },

  async logout() {
    clearAuthStorage()
  },

  async forgotPassword(payload: ForgotPasswordRequest) {
    void payload
    // Mock until the backend endpoint is available.
  },

  async resetPassword(payload: ResetPasswordRequest) {
    void payload
    // Mock until the backend endpoint is available.
  },
}
