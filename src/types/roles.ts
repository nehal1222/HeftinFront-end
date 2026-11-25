export type RoleType = 'org_admin' | 'dynamic' | 'student'

export type RightItem = {
  code: string
  label: string
  module: string
  description?: string
}

export type Role = {
  id: string
  name: string
  description?: string
  role_type: RoleType
  rights: string[]
  is_system?: boolean
  users_count?: number
  created_at?: string
  updated_at?: string
}

export type RoleModuleIn = {
  module: string
  level?: string | null
  custom_module_id?: string | null
}

export type ScopeIn = {
  scope_type: string
  scope_id?: string | null
}

export type RoleCreate = {
  name: string
  display_name: string
  description?: string | null
  audience: 'staff' | 'student'
  modules?: RoleModuleIn[]
  scopes?: ScopeIn[]
}

export type RoleUpdate = {
  display_name: string
  description?: string | null
}

export type RoleModulesIn = {
  modules: RoleModuleIn[]
}

export type CreateRolePayload = {
  name: string
  display_name?: string
  description?: string | null
  audience?: 'staff' | 'student'
  role_type?: 'dynamic'
  rights: string[]
}

export type UpdateRolePayload = {
  name?: string
  display_name?: string
  description?: string | null
  rights?: string[]
}

export type OrganizationCeilingResponse = {
  account_id?: string
  organization_name?: string
  rights: RightItem[] | string[]
}

export type RoleTemplate = {
  id: string
  title: string
  name: string
  description: string
  recommendedRights: string[]
}
