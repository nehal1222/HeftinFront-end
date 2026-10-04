export type RightCode =
  | 'users.view'
  | 'roles.view'

export interface AuthProfile {
  id: string
  name: string
  role: string
  rights: RightCode[]
  is_platform_admin: boolean
}

export type DemoPersonaId =
  | 'student'
  | 'faculty'
  | 'org_admin'
  | 'super_admin'
