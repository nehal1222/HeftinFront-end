export type UserStatus = 'active' | 'inactive' | 'suspended'

export type RoleBrief = {
  id: string
  name: string
  display_name: string
}

export type UserSummary = {
  id: string
  email: string
  display_name: string
  employee_id: string | null
  status: UserStatus | string
  role: RoleBrief | null
}

export type UserDetail = {
  id: string
  email: string
  display_name: string
  mobile: string | null
  employee_id: string | null
  status: UserStatus | string
  must_change_password: boolean
  password_change_due_at: string | null
  role: RoleBrief | null
  created_at: string
  updated_at: string
}

export type UserCreate = {
  display_name: string
  email: string
  password: string
  mobile?: string | null
  employee_id?: string | null
  role_id?: string | null
}

export type UserUpdate = {
  display_name: string
  email: string
  mobile?: string | null
  employee_id?: string | null
}

export type PasswordIn = {
  password: string
}

export type RoleAssignIn = {
  role_id: string
}

export type UserListParams = {
  search?: string
  status?: UserStatus | string
  role_id?: string
  skip?: number
  limit?: number
}
