export type LoginRequest = {
  login: string
  password: string
}

export type ForgotPasswordRequest = {
  email: string
}

export type ResetPasswordRequest = {
  token: string
  password: string
  password_confirmation: string
}

export type AuthTokenResponse = {
  access_token?: string
  refresh_token?: string
}