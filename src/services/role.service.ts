import api from '@/lib/axios'
import type {
  CreateRolePayload,
  OrganizationCeilingResponse,
  RightItem,
  Role,
  UpdateRolePayload,
} from '@/types/roles'

const RIGHT_METADATA_MAP: Record<string, { label: string; module: string; description: string }> = {
  'exams.view': {
    label: 'View Exams',
    module: 'Exams',
    description: 'Browse, search, and view scheduled exams and question papers',
  },
  'exams.create': {
    label: 'Create Exams',
    module: 'Exams',
    description: 'Create new exam configurations, blueprints, and question items',
  },
  'exams.edit': {
    label: 'Edit Exams',
    module: 'Exams',
    description: 'Modify draft exams, sections, and question weightings',
  },
  'exams.publish': {
    label: 'Publish Exams',
    module: 'Exams',
    description: 'Publish finalized exams to candidate batches',
  },
  'evaluations.review': {
    label: 'Review Evaluations',
    module: 'Evaluations',
    description: 'Inspect preliminary evaluations, scoring criteria, and answer keys',
  },
  'evaluations.assign': {
    label: 'Assign Evaluators',
    module: 'Evaluations',
    description: 'Distribute candidate response copies to faculty evaluators',
  },
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

const DEFAULT_CEILING_CODES = [
  'exams.view',
  'exams.create',
  'exams.edit',
  'exams.publish',
  'evaluations.review',
  'evaluations.assign',
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

const INITIAL_ROLES: Role[] = [
  {
    id: 'role-org-admin',
    name: 'Organization Admin',
    description: 'Full administrative rights granted across the organization ceiling',
    role_type: 'system',
    rights: [...DEFAULT_CEILING_CODES],
    is_system: true,
    users_count: 1,
    created_at: '2026-09-01T00:00:00.000Z',
    updated_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'role-exam-coordinator',
    name: 'Exam Coordinator',
    description: 'Delegated extra admin for exam scheduling, blueprints, and evaluation assignments',
    role_type: 'extra_admin',
    rights: [
      'exams.view',
      'exams.create',
      'exams.edit',
      'exams.publish',
      'evaluations.review',
      'evaluations.assign',
      'batches.view',
    ],
    is_system: false,
    users_count: 2,
    created_at: '2026-09-10T09:30:00.000Z',
    updated_at: '2026-09-15T14:20:00.000Z',
  },
  {
    id: 'role-senior-faculty',
    name: 'Senior Faculty',
    description: 'Academic evaluator with access to questions, study notes, and batch analytics',
    role_type: 'dynamic',
    rights: [
      'exams.view',
      'exams.create',
      'evaluations.review',
      'batches.view',
      'study_material.view',
      'study_material.manage',
      'performance.view',
    ],
    is_system: false,
    users_count: 5,
    created_at: '2026-09-12T11:00:00.000Z',
    updated_at: '2026-09-18T16:45:00.000Z',
  },
  {
    id: 'role-student',
    name: 'Student Learner',
    description: 'Default student role with learner access to tests, materials, and reports',
    role_type: 'system',
    rights: [
      'exams.view',
      'study_material.view',
      'performance.view',
    ],
    is_system: true,
    users_count: 120,
    created_at: '2026-09-01T00:00:00.000Z',
    updated_at: '2026-09-01T00:00:00.000Z',
  },
]

let memoryRoles: Role[] = [...INITIAL_ROLES]

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

export const roleService = {
  async getOrganizationCeiling(): Promise<RightItem[]> {
    try {
      const { data } = await api.get<OrganizationCeilingResponse | { data: OrganizationCeilingResponse } | string[] | { rights: string[] }>('/organization/rights')
      const payload = (data && 'data' in data && typeof data.data === 'object' && data.data !== null) ? data.data : data

      let rawRights: Array<string | Partial<RightItem>> = []
      if (Array.isArray(payload)) {
        rawRights = payload
      } else if (payload && typeof payload === 'object' && 'rights' in payload && Array.isArray(payload.rights)) {
        rawRights = payload.rights
      }

      if (rawRights.length > 0) {
        return rawRights.map(formatRightItem)
      }
      return DEFAULT_CEILING_CODES.map((code) => formatRightItem(code))
    } catch {
      return DEFAULT_CEILING_CODES.map((code) => formatRightItem(code))
    }
  },

  async getRoles(): Promise<Role[]> {
    try {
      const { data } = await api.get<Role[] | { data: Role[] }>('/roles')
      const rolesList = Array.isArray(data) ? data : data?.data
      if (Array.isArray(rolesList) && rolesList.length > 0) {
        return rolesList
      }
      return [...memoryRoles]
    } catch {
      return [...memoryRoles]
    }
  },

  async createRole(payload: CreateRolePayload): Promise<Role> {
    try {
      const { data } = await api.post<Role | { data: Role }>('/roles', payload)
      const created = (data && 'data' in data && typeof data.data === 'object' && data.data !== null && 'id' in data.data)
        ? (data.data as Role)
        : (data as Role)
      memoryRoles = [created, ...memoryRoles]
      return created
    } catch (error) {
      if (!api.defaults.baseURL || (error as { response?: { status?: number } })?.response?.status === 404) {
        const ceiling = await this.getOrganizationCeiling()
        const ceilingCodes = new Set(ceiling.map((r) => r.code))
        const invalidCodes = payload.rights.filter((c) => !ceilingCodes.has(c))

        if (invalidCodes.length > 0) {
          const customError = new Error(`right_denied: Code '${invalidCodes[0]}' is outside the organization ceiling.`)
          Object.assign(customError, {
            response: {
              status: 422,
              data: {
                message: `right_denied: Code '${invalidCodes[0]}' is not permitted by the organization rights ceiling.`,
                detail: `right_denied: Cannot attach '${invalidCodes[0]}'. It violates the organization rights ceiling.`,
              },
            },
          })
          throw customError
        }

        const newRole: Role = {
          id: `role-${Date.now()}`,
          name: payload.name.trim(),
          description: payload.description?.trim(),
          role_type: payload.role_type,
          rights: [...payload.rights],
          is_system: false,
          users_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        memoryRoles = [newRole, ...memoryRoles]
        return newRole
      }
      throw error
    }
  },

  async updateRole(id: string, payload: UpdateRolePayload): Promise<Role> {
    try {
      const { data } = await api.put<Role | { data: Role }>(`/roles/${id}`, payload)
      const updated = (data && 'data' in data && typeof data.data === 'object' && data.data !== null && 'id' in data.data)
        ? (data.data as Role)
        : (data as Role)
      memoryRoles = memoryRoles.map((r) => (r.id === id ? updated : r))
      return updated
    } catch (error) {
      if (!api.defaults.baseURL || (error as { response?: { status?: number } })?.response?.status === 404) {
        if (payload.rights) {
          const ceiling = await this.getOrganizationCeiling()
          const ceilingCodes = new Set(ceiling.map((r) => r.code))
          const invalidCodes = payload.rights.filter((c) => !ceilingCodes.has(c))

          if (invalidCodes.length > 0) {
            const customError = new Error(`right_denied: Code '${invalidCodes[0]}' is outside the organization ceiling.`)
            Object.assign(customError, {
              response: {
                status: 422,
                data: {
                  message: `right_denied: Code '${invalidCodes[0]}' is not permitted by the organization rights ceiling.`,
                  detail: `right_denied: Cannot attach '${invalidCodes[0]}'. It violates the organization rights ceiling.`,
                },
              },
            })
            throw customError
          }
        }

        const target = memoryRoles.find((r) => r.id === id)
        if (!target) {
          throw new Error('Role not found')
        }

        const updatedRole: Role = {
          ...target,
          name: payload.name !== undefined ? payload.name.trim() : target.name,
          description: payload.description !== undefined ? payload.description?.trim() : target.description,
          rights: payload.rights ? [...payload.rights] : target.rights,
          updated_at: new Date().toISOString(),
        }
        memoryRoles = memoryRoles.map((r) => (r.id === id ? updatedRole : r))
        return updatedRole
      }
      throw error
    }
  },

  async deleteRole(id: string): Promise<void> {
    try {
      await api.delete(`/roles/${id}`)
      memoryRoles = memoryRoles.filter((r) => r.id !== id)
    } catch (error) {
      if (!api.defaults.baseURL || (error as { response?: { status?: number } })?.response?.status === 404) {
        const target = memoryRoles.find((r) => r.id === id)
        if (target?.is_system) {
          const customError = new Error('right_denied: System roles cannot be deleted.')
          Object.assign(customError, {
            response: {
              status: 403,
              data: {
                message: 'right_denied: System roles are fixed and cannot be removed.',
              },
            },
          })
          throw customError
        }
        memoryRoles = memoryRoles.filter((r) => r.id !== id)
        return
      }
      throw error
    }
  },
}
