import api from '@/lib/axios'
import { getAccessToken } from '@/lib/storage'
import { developmentAuthService } from '@/services/development-auth.service'
import type {
  CreateRolePayload,
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
    name: 'Faculty Evaluator',
    description: 'Academic evaluator responsible for batch assessment and progress review',
    role_type: 'dynamic',
    is_system: false,
    users_count: 5,
    rights: ['study_material.view', 'performance.view', 'batches.view'],
  },
]

let devRolesStore: Role[] = [...INITIAL_DEVELOPMENT_ROLES]

function formatRightItem(input: string | Partial<RightItem>): RightItem {
  if (typeof input === 'string') {
    const meta = RIGHT_METADATA_MAP[input]
    if (meta) {
      return {
        code: input,
        label: meta.label,
        module: meta.module,
        description: meta.description,
      }
    }

    const parts = input.split('.')
    const mod = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1).replace(/_/g, ' ') : 'General'
    const action = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1).replace(/_/g, ' ') : input
    return {
      code: input,
      label: `${action} ${mod}`,
      module: mod,
      description: `Permission to ${input.replace('.', ' ')}`,
    }
  }

  const code = input.code || ''
  const meta = RIGHT_METADATA_MAP[code]
  return {
    code,
    label: input.label || meta?.label || code,
    module: input.module || meta?.module || 'General',
    description: input.description || meta?.description,
  }
}

function isPermittedCeilingRight(code: string): boolean {
  if (!code) return false
  return (
    !code.startsWith('platform.') &&
    !code.startsWith('exams.') &&
    !code.startsWith('exam.') &&
    !code.startsWith('evaluations.') &&
    !code.startsWith('evaluation.')
  )
}

function isDevelopmentSession(): boolean {
  return developmentAuthService.isAccessToken(getAccessToken())
}

function normalizeRole(raw: unknown): Role {
  if (!raw || typeof raw !== 'object') {
    return {
      id: '',
      name: '',
      role_type: 'dynamic',
      rights: [],
    }
  }

  const r = raw as Record<string, unknown>
  const rightsList = new Set<string>()

  if (Array.isArray(r.rights)) {
    for (const item of r.rights) {
      if (typeof item === 'string') {
        rightsList.add(item)
      } else if (item && typeof item === 'object') {
        if ('code' in item && typeof item.code === 'string') {
          rightsList.add(item.code)
        } else if ('rights' in item && Array.isArray(item.rights)) {
          for (const sub of item.rights) {
            if (typeof sub === 'string') rightsList.add(sub)
            else if (sub && typeof sub === 'object' && 'code' in sub && typeof sub.code === 'string') {
              rightsList.add(sub.code)
            }
          }
        }
      }
    }
  }

  const roleName = String(r.display_name || r.name || '')
  const roleType: Role['role_type'] =
    r.role_type === 'org_admin'
      ? 'org_admin'
      : r.role_type === 'student' || r.audience === 'student'
        ? 'student'
        : 'dynamic'

  return {
    id: String(r.id || ''),
    name: roleName,
    description: r.description ? String(r.description) : undefined,
    role_type: roleType,
    rights: Array.from(rightsList),
    is_system: Boolean(r.is_system),
    users_count: typeof r.users_count === 'number'
      ? r.users_count
      : typeof r.user_count === 'number'
        ? r.user_count
        : 0,
    created_at: r.created_at ? String(r.created_at) : undefined,
    updated_at: r.updated_at ? String(r.updated_at) : undefined,
  }
}

export const roleService = {
  async getOrganizationCeiling(): Promise<RightItem[]> {
    if (isDevelopmentSession()) {
      return DEVELOPMENT_CEILING_CODES.map((code) => formatRightItem(code))
    }

    let rawRights: Array<string | Partial<RightItem> | Record<string, unknown>> = []
    try {
      const { data } = await api.get<unknown>('/rights/')
      const payload = (data && typeof data === 'object' && 'data' in data && data.data !== null) ? data.data : data
      if (Array.isArray(payload)) {
        rawRights = payload
      }
    } catch {
      try {
        const { data } = await api.get<unknown>('/organization/rights')
        const payload = (data && typeof data === 'object' && 'data' in data && data.data !== null) ? data.data : data
        if (Array.isArray(payload)) {
          rawRights = payload
        } else if (payload && typeof payload === 'object' && 'rights' in payload && Array.isArray((payload as { rights?: unknown }).rights)) {
          rawRights = (payload as { rights: unknown[] }).rights as Array<string | Partial<RightItem>>
        }
      } catch {
        rawRights = []
      }
    }

    const mapped = rawRights.map((item) => {
      if (typeof item === 'string') return formatRightItem(item)
      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>
        if (obj.is_platform === true) return null
        const code = String(obj.code || '')
        const label = String(obj.display_name || obj.label || code)
        const module = String(obj.module || (code.includes('.') ? code.split('.')[0] : 'General'))
        const description = obj.description ? String(obj.description) : undefined
        return {
          code,
          label,
          module: module.charAt(0).toUpperCase() + module.slice(1),
          description,
        }
      }
      return null
    }).filter((item): item is RightItem => item !== null && isPermittedCeilingRight(item.code))

    return mapped
  },

  async getRoles(): Promise<Role[]> {
    if (isDevelopmentSession()) {
      return [...devRolesStore]
    }

    const { data } = await api.get<unknown>('/roles/')
    const raw = (data && typeof data === 'object' && 'data' in data && data.data) ? (data as any).data : data
    const rolesList = Array.isArray(raw)
      ? raw
      : (raw && typeof raw === 'object' && 'items' in raw && Array.isArray((raw as any).items))
      ? (raw as any).items
      : []
    return rolesList.map(normalizeRole)
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

    let snakeName = payload.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]+/g, '_')
      .replace(/^[^a-z]+/, '')
      .replace(/_+$/, '')
      .slice(0, 50)
    if (!snakeName) {
      snakeName = `role_${Date.now()}`
    }

    const modulesFromRights: Array<{ module: string; level: string | null; custom_module_id: null }> = []
    const seenModules = new Set<string>()
    for (const code of validRights) {
      const mod = code.split('.')[0]
      if (mod && !seenModules.has(mod)) {
        seenModules.add(mod)
        modulesFromRights.push({ module: mod, level: null, custom_module_id: null })
      }
    }

    const body = {
      name: snakeName,
      display_name: payload.display_name?.trim() || payload.name.trim(),
      audience: payload.audience || 'staff',
      description: payload.description?.trim() || null,
      modules: modulesFromRights,
      scopes: [],
    }

    const { data } = await api.post<unknown>('/roles/', body)
    const rawResult = (data && typeof data === 'object' && 'data' in data && data.data !== null) ? data.data : data
    return normalizeRole(rawResult)
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

    const displayName = (payload.display_name?.trim() || payload.name?.trim()) ?? ''
    const body = {
      display_name: displayName,
      description: payload.description !== undefined ? payload.description?.trim() || null : null,
    }

    const { data } = await api.put<unknown>(`/roles/${id}`, body)

    if (validRights) {
      const modulesFromRights: Array<{ module: string; level: string | null; custom_module_id: null }> = []
      const seen = new Set<string>()
      for (const code of validRights) {
        const mod = code.split('.')[0]
        if (mod && !seen.has(mod)) {
          seen.add(mod)
          modulesFromRights.push({ module: mod, level: null, custom_module_id: null })
        }
      }
      try {
        await api.put(`/roles/${id}/modules`, { modules: modulesFromRights })
      } catch {
        void 0
      }
    }

    const rawResult = (data && typeof data === 'object' && 'data' in data && data.data !== null) ? data.data : data
    return normalizeRole(rawResult)
  },

  async deleteRole(id: string): Promise<void> {
    if (isDevelopmentSession()) {
      devRolesStore = devRolesStore.filter((r) => r.id !== id)
      return
    }

    await api.delete(`/roles/${id}`)
  },
}
