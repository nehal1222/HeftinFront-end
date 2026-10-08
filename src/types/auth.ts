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

export type AuthUser = {
  id: string
  email: string
  mobile: string | null
  full_name: string
  status: string
  must_change_password: boolean
}

export type AuthTokenResponse = {
  access_token: string
  refresh_token: string
  token_type: string
  user: AuthUser
  current_organization: Record<string, unknown> | null
  roles: string[]
  rights: string[]
}

export type RefreshRequest = {
  refresh_token: string
}

export type RefreshResponse = {
  access_token: string
  refresh_token: string
  token_type: string
}
