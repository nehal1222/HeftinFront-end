import api from '@/lib/axios'
import type { B2BBatch, B2BEntitlement, B2BExam, B2BOrganization } from '@/types/b2b'

export const b2bService = {
  async getOrganization(): Promise<B2BOrganization | null> {
    try {
      const { data } = await api.get<B2BOrganization>('/organization')
      return data
    } catch {
      return null
    }
  },

  async listBatches(): Promise<B2BBatch[]> {
    try {
      const { data } = await api.get<B2BBatch[]>('/organization/batches')
      return Array.isArray(data) ? data : []
    } catch {
      return []
    }
  },

  async listExams(): Promise<B2BExam[]> {
    try {
      const { data } = await api.get<B2BExam[]>('/organization/exams', { params: { exam: 'UPSC' } })
      return Array.isArray(data) ? data : []
    } catch {
      return []
    }
  },

  async listEntitlements(): Promise<B2BEntitlement[]> {
    try {
      const { data } = await api.get<B2BEntitlement[]>('/organization/entitlements')
      return Array.isArray(data) ? data : []
    } catch {
      return []
    }
  },

  async requestOnboarding(payload: Record<string, unknown>) {
    const body = {
      name: String(payload.name || payload.contact_person || payload.admin_name || 'Institutional Partner').trim(),
      email: String(payload.email || payload.admin_email || '').trim(),
      message: String(payload.message || payload.requirements || 'Institutional onboarding inquiry').trim(),
      company_name: String(payload.organization_name || payload.company_name || payload.institute_name || '').trim() || null,
      category: 'enterprise',
      phone: payload.phone ? String(payload.phone).trim() : null,
      expected_students: typeof payload.expected_students === 'number' ? payload.expected_students : null,
      consent: true,
      consent_version: '2026-10',
    }

    const { data } = await api.post('/contact/', body, {
      skipAuth: true,
    })
    return data
  },
}
