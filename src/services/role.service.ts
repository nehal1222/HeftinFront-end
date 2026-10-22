import api from '@/lib/axios'
import { getAccessToken } from '@/lib/storage'
import { developmentAuthService } from '@/services/development-auth.service'
import type {
  CreateRolePayload,
  OrganizationCeilingResponse,
  RightItem,
  Role,
  UpdateRolePayload,
} from '@/types/roles'

const RIGHT_METADATA_MAP: Record<string, { label: string; module: string; description: string }> = {
  'users.view': {
    label: 'View Users',
    module: 'Users',
    description: 'Access the list of organization learners, staff, and faculty',
  },
  'users.create': {
    label: 'Create Users',
    module: 'Users',
    description: 'Invite and provision new faculty and student profiles',
  },
  'users.edit': {
    label: 'Edit Users',
    module: 'Users',
    description: 'Update user profiles, batch memberships, and statuses',
  },
  'roles.view': {
    label: 'View Roles',
    module: 'Roles',
    description: 'View organization roles, extra admins, and rights allocations',
  },
  'roles.manage': {
    label: 'Manage Roles',
    module: 'Roles',
    description: 'Create, edit, and delete dynamic roles and assign ceiling rights',
  },
  'batches.view': {
    label: 'View Batches',
    module: 'Batches',
    description: 'Inspect student cohorts, academic batches, and schedules',
  },
  'batches.manage': {
    label: 'Manage Batches',
    module: 'Batches',
    description: 'Create, modify, and assign student cohorts and faculty mentors',
  },
  'study_material.view': {
    label: 'View Study Material',
    module: 'Study Material',
    description: 'Browse curriculum modules, reference documents, and notes',
  },
  'study_material.manage': {
    label: 'Manage Study Material',
    module: 'Study Material',
    description: 'Upload, categorize, and publish academic reference resources',
  },
  'performance.view': {
    label: 'View Performance',
    module: 'Performance',
    description: 'Analyze learner scorecards, percentile ranks, and progress metrics',
  },
  'performance.export': {
    label: 'Export Analytics',
    module: 'Performance',
    description: 'Download consolidated performance reports and scorecard spreadsheets',
  },
}

const DEVELOPMENT_CEILING_CODES = [
  'users.view',
  'users.create',
  'users.edit',
  'roles.view',
  'roles.manage',
  'batches.view',
  'batches.manage',
  'study_material.view',
  'study_material.manage',
  'performance.view',
  'performance.export',
]

const INITIAL_DEVELOPMENT_ROLES: Role[] = [
  {
    id: 'role-org-admin',
    name: 'Org Admin',
    description: 'Full administrative ceiling across organization staff, batches, and learners',
    role_type: 'org_admin',
    is_system: true,
    users_count: 1,
    rights: [...DEVELOPMENT_CEILING_CODES],
  },
  {
    id: 'role-student',
    name: 'Student',
    description: 'Enrolled learner with access to curriculum and study materials',
    role_type: 'student',
    is_system: true,
    users_count: 42,
    rights: ['study_material.view', 'performance.view'],
  },
  {
    id: 'role-faculty',
    name: 'Faculty',
    description: 'Academic faculty member responsible for curriculum preparation, student mentoring, and resources',
    role_type: 'dynamic',
    is_system: false,
    users_count: 6,
    rights: [
      'batches.view',
      'study_material.view',
      'study_material.manage',
      'performance.view',
    ],
  },
  {
    id: 'role-hod',
    name: 'Head of Department (HOD)',
    description: 'Department head overseeing academic departments, learner cohorts, and performance analytics',
    role_type: 'dynamic',
    is_system: false,
    users_count: 2,
    rights: [
      'users.view',
      'batches.view',
      'batches.manage',
      'study_material.view',
      'study_material.manage',
      'performance.view',
      'performance.export',
    ],
  },
  {
    id: 'role-teacher',
    name: 'Teacher',
    description: 'Classroom educator managing academic cohorts and study resources',
    role_type: 'dynamic',
    is_system: false,
    users_count: 14,
    rights: [
      'batches.view',
      'study_material.view',
      'performance.view',
    ],
  },
]

let devRolesStore: Role[] = [...INITIAL_DEVELOPMENT_ROLES]

function formatRightItem(item: string | Partial<RightItem>): RightItem {
  if (typeof item === 'string') {
    const meta = RIGHT_METADATA_MAP[item]
    const parts = item.split('.')
    const moduleName = meta?.module || (parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'General')
    const label = meta?.label || item
    const description = meta?.description || ''

    return {
      code: item,
      label,
      module: moduleName,
      description,
    }
  }

  const code = item.code || ''
  const meta = RIGHT_METADATA_MAP[code]
  return {
    code,
    label: item.label || meta?.label || code,
    module: item.module || meta?.module || 'General',
    description: item.description || meta?.description || '',
  }
}

function isPermittedCeilingRight(code: string): boolean {
  return (
    !code.startsWith('exams.') &&
    !code.startsWith('exam.') &&
    !code.startsWith('evaluations.') &&
    !code.startsWith('evaluation.')
  )
}

function isDevelopmentSession(): boolean {
  return developmentAuthService.isAccessToken(getAccessToken())
}

export const roleService = {
  async getOrganizationCeiling(): Promise<RightItem[]> {
    if (isDevelopmentSession()) {
      return DEVELOPMENT_CEILING_CODES.map((code) => formatRightItem(code))
    }

    const { data } = await api.get<OrganizationCeilingResponse | { data: OrganizationCeilingResponse } | string[] | { rights: string[] }>('/organization/rights')
    const payload = (data && typeof data === 'object' && 'data' in data && data.data !== null) ? data.data : data

    let rawRights: Array<string | Partial<RightItem>> = []
    if (Array.isArray(payload)) {
      rawRights = payload
    } else if (payload && typeof payload === 'object' && 'rights' in payload && Array.isArray(payload.rights)) {
      rawRights = payload.rights
    }

    return rawRights.map(formatRightItem).filter((item) => isPermittedCeilingRight(item.code))
  },

  async getRoles(): Promise<Role[]> {
    if (isDevelopmentSession()) {
      return [...devRolesStore]
    }

    const { data } = await api.get<Role[] | { data: Role[] }>('/roles')
    const rolesList = Array.isArray(data) ? data : data?.data
    return Array.isArray(rolesList) ? rolesList : []
  },

  async createRole(payload: CreateRolePayload): Promise<Role> {
    const validRights = payload.rights.filter((r) => isPermittedCeilingRight(r))

    if (isDevelopmentSession()) {
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name: payload.name.trim(),
        description: payload.description?.trim(),
        role_type: 'dynamic',
        is_system: false,
        users_count: 0,
        rights: validRights,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      devRolesStore = [newRole, ...devRolesStore]
      return newRole
    }

    const body: CreateRolePayload = {
      ...payload,
      rights: validRights,
      role_type: 'dynamic',
    }
    const { data } = await api.post<Role | { data: Role }>('/roles', body)
    return (data && typeof data === 'object' && 'data' in data && data.data !== null && 'id' in data.data)
      ? (data.data as Role)
      : (data as Role)
  },

  async updateRole(id: string, payload: UpdateRolePayload): Promise<Role> {
    const validRights = payload.rights ? payload.rights.filter((r) => isPermittedCeilingRight(r)) : undefined

    if (isDevelopmentSession()) {
      const existing = devRolesStore.find((r) => r.id === id)
      if (!existing) {
        throw new Error('Role not found')
      }
      const updated: Role = {
        ...existing,
        name: payload.name !== undefined ? payload.name.trim() : existing.name,
        description: payload.description !== undefined ? payload.description.trim() : existing.description,
        rights: validRights !== undefined ? validRights : existing.rights,
        updated_at: new Date().toISOString(),
      }
      devRolesStore = devRolesStore.map((r) => (r.id === id ? updated : r))
      return updated
    }

    const body: UpdateRolePayload = {
      ...payload,
      rights: validRights,
    }
    const { data } = await api.put<Role | { data: Role }>(`/roles/${id}`, body)
    return (data && typeof data === 'object' && 'data' in data && data.data !== null && 'id' in data.data)
      ? (data.data as Role)
      : (data as Role)
  },

  async deleteRole(id: string): Promise<void> {
    if (isDevelopmentSession()) {
      devRolesStore = devRolesStore.filter((r) => r.id !== id)
      return
    }

    await api.delete(`/roles/${id}`)
  },
}
