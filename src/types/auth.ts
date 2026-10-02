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

export interface Scope {
  type: string
  id: string
}

export interface AuthProfile {
  account_id: string | null
  role?: string
  rights: RightCode[]
  scopes: Scope[]
  is_platform_admin: boolean
}

export type DemoPersonaId = 'org_admin' | 'teacher' | 'student' | 'platform_admin'