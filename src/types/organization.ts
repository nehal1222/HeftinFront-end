export type OrgType = 'enterprise' | 'academic' | 'individual' | 'trial' | string

export type ModuleCounts = {
  standard: number
  custom: number
}

export type OrganizationOut = {
  id: string
  account_id: string
  name: string
  slug: string
  org_type: OrgType
  is_active: boolean
  ceiling_revision: number
  modules: ModuleCounts
  created_at: string
  updated_at: string
}

export type OrgAdminIn = {
  email: string
  display_name: string
  password: string
}

export type OrgCreate = {
  name: string
  slug: string
  org_type: OrgType
  org_admin: OrgAdminIn
}

export type CeilingIn = {
  expected_revision: number
  modules: string[]
}

export type CeilingOut = {
  revision: number
  modules: string[]
}
