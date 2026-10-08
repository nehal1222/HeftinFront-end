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
    const { data } = await api.post<AuthTokenResponse>(
      '/auth/login',
      payload,
    )

    return data
  },

  async refresh(payload: RefreshRequest) {
    const { data } = await api.post<RefreshResponse>(
      '/auth/refresh',
      payload,
    )

    return data
  },

  async logout() {
    // The backend does not expose /auth/logout yet.
    // Clear the local session until that endpoint is available.
    clearAuthStorage()
  },

  async forgotPassword(payload: ForgotPasswordRequest) {
    // Keep mocked until the backend password-reset endpoint
    // is available on the checked-out backend.
    void payload

    return {
      message: 'If the account exists, password reset instructions have been sent.',
    }
  },

  async resetPassword(payload: ResetPasswordRequest) {
    // Keep mocked until the backend password-reset endpoint
    // is available on the checked-out backend.
    void payload

    return {
      message: 'Password reset successfully.',
    }
  },
}
