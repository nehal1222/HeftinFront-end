import api from '@/lib/axios'
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

export const roleService = {
  async getOrganizationCeiling(): Promise<RightItem[]> {
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
    const { data } = await api.get<Role[] | { data: Role[] }>('/roles')
    const rolesList = Array.isArray(data) ? data : data?.data
    return Array.isArray(rolesList) ? rolesList : []
  },

  async createRole(payload: CreateRolePayload): Promise<Role> {
    const body: CreateRolePayload = {
      ...payload,
      role_type: 'dynamic',
    }
    const { data } = await api.post<Role | { data: Role }>('/roles', body)
    return (data && typeof data === 'object' && 'data' in data && data.data !== null && 'id' in data.data)
      ? (data.data as Role)
      : (data as Role)
  },

  async updateRole(id: string, payload: UpdateRolePayload): Promise<Role> {
    const { data } = await api.put<Role | { data: Role }>(`/roles/${id}`, payload)
    return (data && typeof data === 'object' && 'data' in data && data.data !== null && 'id' in data.data)
      ? (data.data as Role)
      : (data as Role)
  },

  async deleteRole(id: string): Promise<void> {
    await api.delete(`/roles/${id}`)
  },
}
