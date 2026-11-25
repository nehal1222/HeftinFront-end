import api from '@/lib/axios'
import { developmentAuthService } from '@/services/development-auth.service'
import type {
  PasswordIn,
  RoleAssignIn,
  RoleBrief,
  UserCreate,
  UserDetail,
  UserListParams,
  UserSummary,
  UserUpdate,
} from '@/types/user'

let devUsersStore: UserDetail[] = [
  {
    id: 'dev-org-admin',
    email: 'admin@example.com',
    display_name: 'Admin Demo',
    mobile: '+919876543210',
    employee_id: 'EMP-ADM-01',
    status: 'active',
    must_change_password: false,
    password_change_due_at: null,
    role: {
      id: 'role-org-admin',
      name: 'org_admin',
      display_name: 'Organization Admin',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev-student',
    email: 'student@example.com',
    display_name: 'Student Demo',
    mobile: null,
    employee_id: null,
    status: 'active',
    must_change_password: false,
    password_change_due_at: null,
    role: {
      id: 'role-student',
      name: 'student',
      display_name: 'Student',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev-faculty',
    email: 'faculty@example.com',
    display_name: 'Faculty Evaluator Demo',
    mobile: null,
    employee_id: 'EMP-FAC-02',
    status: 'active',
    must_change_password: false,
    password_change_due_at: null,
    role: {
      id: 'role-faculty',
      name: 'faculty',
      display_name: 'Faculty Evaluator',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const userService = {
  async listUsers(params?: UserListParams): Promise<UserSummary[]> {
    if (developmentAuthService.isEnabled()) {
      let filtered = [...devUsersStore]
      if (params?.search) {
        const q = params.search.toLowerCase()
        filtered = filtered.filter(
          (u) =>
            u.display_name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.employee_id && u.employee_id.toLowerCase().includes(q)),
        )
      }
      if (params?.status) {
        filtered = filtered.filter((u) => u.status === params.status)
      }
      if (params?.role_id) {
        filtered = filtered.filter((u) => u.role?.id === params.role_id)
      }
      return filtered.map((u) => ({
        id: u.id,
        email: u.email,
        display_name: u.display_name,
        employee_id: u.employee_id,
        status: u.status,
        role: u.role,
      }))
    }

    const { data } = await api.get<
      UserSummary[] | { total?: number; items?: UserSummary[]; data?: UserSummary[] }
    >('/users/', { params })

    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data)
      ? data.data
      : []

    return list
  },

  async getUser(id: string): Promise<UserDetail> {
    if (developmentAuthService.isEnabled()) {
      const user = devUsersStore.find((u) => u.id === id)
      if (!user) throw new Error('User not found')
      return user
    }

    const { data } = await api.get<UserDetail | { data: UserDetail }>(`/users/${id}`)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as UserDetail) : (data as UserDetail)
  },

  async createUser(payload: UserCreate): Promise<UserDetail> {
    if (developmentAuthService.isEnabled()) {
      const newUser: UserDetail = {
        id: `user-${Date.now()}`,
        email: payload.email.trim(),
        display_name: payload.display_name.trim(),
        mobile: payload.mobile ?? null,
        employee_id: payload.employee_id ?? null,
        status: 'active',
        must_change_password: false,
        password_change_due_at: null,
        role: payload.role_id ? { id: payload.role_id, name: 'dynamic', display_name: 'Assigned Role' } : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      devUsersStore = [newUser, ...devUsersStore]
      return newUser
    }

    const { data } = await api.post<UserDetail | { data: UserDetail }>('/users/', payload)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as UserDetail) : (data as UserDetail)
  },

  async updateUser(id: string, payload: UserUpdate): Promise<UserDetail> {
    if (developmentAuthService.isEnabled()) {
      const user = devUsersStore.find((u) => u.id === id)
      if (!user) throw new Error('User not found')
      const updated: UserDetail = {
        ...user,
        display_name: payload.display_name.trim(),
        email: payload.email.trim(),
        mobile: payload.mobile ?? null,
        employee_id: payload.employee_id ?? null,
        updated_at: new Date().toISOString(),
      }
      devUsersStore = devUsersStore.map((u) => (u.id === id ? updated : u))
      return updated
    }

    const { data } = await api.put<UserDetail | { data: UserDetail }>(`/users/${id}`, payload)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as UserDetail) : (data as UserDetail)
  },

  async activateUser(id: string): Promise<UserDetail> {
    if (developmentAuthService.isEnabled()) {
      const user = devUsersStore.find((u) => u.id === id)
      if (!user) throw new Error('User not found')
      const updated: UserDetail = { ...user, status: 'active', updated_at: new Date().toISOString() }
      devUsersStore = devUsersStore.map((u) => (u.id === id ? updated : u))
      return updated
    }

    const { data } = await api.patch<UserDetail | { data: UserDetail }>(`/users/${id}/activate`)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as UserDetail) : (data as UserDetail)
  },

  async deactivateUser(id: string): Promise<UserDetail> {
    if (developmentAuthService.isEnabled()) {
      const user = devUsersStore.find((u) => u.id === id)
      if (!user) throw new Error('User not found')
      const updated: UserDetail = { ...user, status: 'inactive', updated_at: new Date().toISOString() }
      devUsersStore = devUsersStore.map((u) => (u.id === id ? updated : u))
      return updated
    }

    const { data } = await api.patch<UserDetail | { data: UserDetail }>(`/users/${id}/deactivate`)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as UserDetail) : (data as UserDetail)
  },

  async setPassword(id: string, password: string): Promise<void> {
    const payload: PasswordIn = { password }
    if (developmentAuthService.isEnabled()) {
      return
    }

    await api.put(`/users/${id}/password`, payload)
  },

  async sendResetLink(id: string): Promise<void> {
    if (developmentAuthService.isEnabled()) {
      return
    }

    await api.post(`/users/${id}/reset-password`)
  },

  async getUserRole(id: string): Promise<RoleBrief | null> {
    if (developmentAuthService.isEnabled()) {
      const user = devUsersStore.find((u) => u.id === id)
      return user?.role ?? null
    }

    const { data } = await api.get<RoleBrief | { data: RoleBrief } | null>(`/users/${id}/role`)
    if (!data) return null
    return (typeof data === 'object' && 'data' in data) ? (data.data as RoleBrief) : (data as RoleBrief)
  },

  async assignRole(id: string, roleId: string): Promise<void> {
    const payload: RoleAssignIn = { role_id: roleId }
    if (developmentAuthService.isEnabled()) {
      const user = devUsersStore.find((u) => u.id === id)
      if (user) {
        user.role = { id: roleId, name: 'dynamic', display_name: 'Dynamic Role' }
      }
      return
    }

    await api.put(`/users/${id}/role`, payload)
  },

  async revokeRole(id: string): Promise<void> {
    if (developmentAuthService.isEnabled()) {
      const user = devUsersStore.find((u) => u.id === id)
      if (user) {
        user.role = null
      }
      return
    }

    await api.delete(`/users/${id}/role`)
  },
}
