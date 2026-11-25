export type LoginRequest = {
  login: string
  password: string
}

export type ForgotPasswordRequest = {
  email: string
}

export type LogoutRequest = {
  refresh_token: string
}

export type ResetPasswordRequest = {
  token: string
  new_password: string
  password?: string
  password_confirmation?: string
}

export type ChangePasswordRequest = {
  current_password: string
  new_password: string
}

export type RightCode = string

export type AuthAccess = {
  heftin_admin: boolean
  org_admin: boolean
  student: boolean
  user: boolean
}

export type AuthRole = {
  id: string
  name: string
  display_name: string
  description?: string | null
  audience?: string | null
}

export type AuthOrganization = {
  id: string
  name: string
  slug?: string
  status?: string
}

export type AuthUserData = {
  id: string
  email: string
  mobile: string | null
  full_name: string
  status: string
  employee_id?: string | null
  must_change_password: boolean
  password_change_due_at: string | null
  organization: AuthOrganization | null
}

export type AuthModuleRights = {
  module?: string
  level?: number | string | null
  custom_module?: string | null
  rights: RightCode[]
}

export type AuthRightsEnvelope =
  | Record<string, AuthModuleRights | RightCode[]>
  | RightCode[]

export type AuthTokenData = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in?: number
}

export type AuthSessionData = {
  user: AuthUserData
  role: AuthRole | null
  scopes: Record<string, unknown> | unknown[] | null
  subjects: string[] | Array<{ id: string; name: string }> | null
  access: AuthAccess
  rights: AuthRightsEnvelope
  token?: AuthTokenData
}

export type AuthResponseEnvelope<T = AuthSessionData> = {
  success: boolean
  message: string
  data: T
}

export type AuthUser = {
  id: string
  email: string
  mobile: string | null
  full_name: string
  status: string
  employee_id?: string | null
  must_change_password: boolean
  password_change_due_at: string | null
  role: AuthRole | null
  roles: string[]
  scopes: Record<string, unknown> | unknown[] | null
  subjects: string[] | Array<{ id: string; name: string }> | null
  access: AuthAccess
  rights: RightCode[]
  organization?: AuthOrganization | null
  current_organization?: AuthOrganization | null
}

export type AuthMeResponse =
  | AuthResponseEnvelope<AuthSessionData>
  | (Partial<AuthUser> & {
      id?: string
      email?: string
      name?: string
      roles?: string[]
      rights?: RightCode[] | AuthRightsEnvelope
      access?: Partial<AuthAccess>
      role?: AuthRole | null
      scopes?: Record<string, unknown> | unknown[] | null
      subjects?: string[] | Array<{ id: string; name: string }> | null
      current_organization?: AuthOrganization | null
      organization?: AuthOrganization | null
      data?: AuthSessionData
    })

export type AuthTokenResponse = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in?: number
  user: AuthUser
  role?: AuthRole | null
  scopes?: Record<string, unknown> | unknown[] | null
  subjects?: string[] | Array<{ id: string; name: string }> | null
  access?: AuthAccess
  current_organization?: AuthOrganization | null
  roles: string[]
  rights: RightCode[]
  data?: AuthSessionData
}

export type RefreshRequest = {
  refresh_token: string
}

export type RefreshResponse = {
  access_token: string
  refresh_token: string
  token_type: string
}
