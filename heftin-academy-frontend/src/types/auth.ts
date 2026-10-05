export type RightCode =
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.deactivate'
  | 'users.reset_password'
  | 'roles.view'
  | 'roles.create'
  | 'roles.edit'
  | 'roles.delete'
  | 'roles.rights.edit'
  | 'roles.assign'
  | 'org.profile.view'
  | 'org.profile.edit'
  | 'audit.view'
  | 'departments.view'
  | 'departments.create'
  | 'departments.edit'
  | 'batches.view'
  | 'batches.create'
  | 'batches.edit'

export const RIGHT_CODES: RightCode[] = [
  'users.view',
  'users.create',
  'users.edit',
  'users.deactivate',
  'users.reset_password',
  'roles.view',
  'roles.create',
  'roles.edit',
  'roles.delete',
  'roles.rights.edit',
  'roles.assign',
  'org.profile.view',
  'org.profile.edit',
  'audit.view',
  'departments.view',
  'departments.create',
  'departments.edit',
  'batches.view',
  'batches.create',
  'batches.edit',
]

export interface Scope {
  type: string
  id: string
}

export interface AuthProfile {
  account_id: string | null
  email?: string
  display_name?: string
  role?: string
  rights: RightCode[]
  scopes: Scope[]
  is_platform_admin: boolean
}

export type ProductArea = 'organization' | 'individual'

export interface RoleDefinition {
  id: string
  name: string
  rights: RightCode[]
  scopeLabel: string
  audience?: 'student' | 'staff'
}

export type LoginCredentials = {
  email: string
  password: string
}

export type AuthTokensResponse = {
  access_token?: unknown
  refresh_token?: unknown
  accessToken?: unknown
  refreshToken?: unknown
  access?: unknown
  refresh?: unknown
  tokens?: unknown
  data?: unknown
}

export type AuthMeResponse = {
  email?: unknown
  display_name?: unknown
  full_name?: unknown
  name?: unknown
  role?: unknown
  plan?: unknown
  subscription_plan?: unknown
  subscription?: unknown
  permissions?: unknown
  rights?: unknown
  entitlements?: unknown
  scopes?: unknown
  is_platform_admin?: unknown
  user?: unknown
  data?: unknown
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}