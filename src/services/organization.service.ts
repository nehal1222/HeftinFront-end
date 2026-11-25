import api from '@/lib/axios'
import { developmentAuthService } from '@/services/development-auth.service'
import type {
  CeilingIn,
  CeilingOut,
  OrgCreate,
  OrganizationOut,
} from '@/types/organization'

let devOrgsStore: OrganizationOut[] = [
  {
    id: 'org-heftin-demo',
    account_id: 'acc-heftin-demo',
    name: 'Heftin Academy Test Organization',
    slug: 'heftin-demo',
    org_type: 'academic',
    is_active: true,
    ceiling_revision: 1,
    modules: { standard: 4, custom: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const organizationService = {
  async listOrgs(): Promise<OrganizationOut[]> {
    if (developmentAuthService.isEnabled()) {
      return [...devOrgsStore]
    }

    const { data } = await api.get<
      OrganizationOut[] | { total?: number; items?: OrganizationOut[]; data?: OrganizationOut[] }
    >('/orgs/')
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data)
      ? data.data
      : []
    return list
  },

  async getOrg(orgId: string): Promise<OrganizationOut> {
    if (developmentAuthService.isEnabled()) {
      const org = devOrgsStore.find((o) => o.id === orgId)
      if (!org) throw new Error('Organization not found')
      return org
    }

    const { data } = await api.get<OrganizationOut | { data: OrganizationOut }>(`/orgs/${orgId}`)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as OrganizationOut) : (data as OrganizationOut)
  },

  async createOrg(payload: OrgCreate): Promise<OrganizationOut> {
    if (developmentAuthService.isEnabled()) {
      const newOrg: OrganizationOut = {
        id: `org-${Date.now()}`,
        account_id: `acc-${Date.now()}`,
        name: payload.name.trim(),
        slug: payload.slug.trim(),
        org_type: payload.org_type,
        is_active: true,
        ceiling_revision: 1,
        modules: { standard: 0, custom: 0 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      devOrgsStore = [newOrg, ...devOrgsStore]
      return newOrg
    }

    const { data } = await api.post<OrganizationOut | { data: OrganizationOut }>('/orgs/', payload)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as OrganizationOut) : (data as OrganizationOut)
  },

  async activateOrg(orgId: string): Promise<OrganizationOut> {
    if (developmentAuthService.isEnabled()) {
      const org = devOrgsStore.find((o) => o.id === orgId)
      if (!org) throw new Error('Organization not found')
      const updated = { ...org, is_active: true, updated_at: new Date().toISOString() }
      devOrgsStore = devOrgsStore.map((o) => (o.id === orgId ? updated : o))
      return updated
    }

    const { data } = await api.patch<OrganizationOut | { data: OrganizationOut }>(`/orgs/${orgId}/activate`)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as OrganizationOut) : (data as OrganizationOut)
  },

  async deactivateOrg(orgId: string): Promise<OrganizationOut> {
    if (developmentAuthService.isEnabled()) {
      const org = devOrgsStore.find((o) => o.id === orgId)
      if (!org) throw new Error('Organization not found')
      const updated = { ...org, is_active: false, updated_at: new Date().toISOString() }
      devOrgsStore = devOrgsStore.map((o) => (o.id === orgId ? updated : o))
      return updated
    }

    const { data } = await api.patch<OrganizationOut | { data: OrganizationOut }>(`/orgs/${orgId}/deactivate`)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as OrganizationOut) : (data as OrganizationOut)
  },

  async getCeiling(orgId: string): Promise<CeilingOut> {
    if (developmentAuthService.isEnabled()) {
      return {
        revision: 1,
        subjects: [],
        capabilities: [],
        modules: ['exams', 'study_material', 'performance', 'users', 'roles', 'batches', 'evaluations'],
      }
    }

    const { data } = await api.get<any>(`/orgs/${orgId}/modules`)
    const raw = (data && typeof data === 'object' && 'data' in data && data.data) ? data.data : data
    const subjects = Array.isArray(raw?.subjects) ? raw.subjects : []
    const capabilities = Array.isArray(raw?.capabilities) ? raw.capabilities : []
    const moduleCodes = Array.isArray(raw?.modules)
      ? raw.modules
      : [...subjects, ...capabilities].map((m: any) => (typeof m === 'string' ? m : m.code)).filter(Boolean)

    return {
      revision: typeof raw?.revision === 'number' ? raw.revision : 0,
      subjects,
      capabilities,
      modules: moduleCodes,
    }
  },

  async replaceCeiling(orgId: string, payload: CeilingIn): Promise<CeilingOut> {
    if (developmentAuthService.isEnabled()) {
      const org = devOrgsStore.find((o) => o.id === orgId)
      if (org) {
        org.ceiling_revision = payload.expected_revision + 1
        org.modules.standard = payload.modules.length
      }
      return {
        revision: payload.expected_revision + 1,
        subjects: [],
        capabilities: [],
        modules: payload.modules,
      }
    }

    const { data } = await api.put<any>(`/orgs/${orgId}/modules`, payload)
    const raw = (data && typeof data === 'object' && 'data' in data && data.data) ? data.data : data
    const subjects = Array.isArray(raw?.subjects) ? raw.subjects : []
    const capabilities = Array.isArray(raw?.capabilities) ? raw.capabilities : []
    const moduleCodes = Array.isArray(raw?.modules)
      ? raw.modules
      : [...subjects, ...capabilities].map((m: any) => (typeof m === 'string' ? m : m.code)).filter(Boolean)

    return {
      revision: typeof raw?.revision === 'number' ? raw.revision : payload.expected_revision + 1,
      subjects,
      capabilities,
      modules: moduleCodes,
    }
  },
}
