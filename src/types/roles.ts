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

export type CreateRolePayload = {
  name: string
  description?: string
  role_type?: 'dynamic'
  rights: string[]
}

export type UpdateRolePayload = {
  name?: string
  description?: string
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
