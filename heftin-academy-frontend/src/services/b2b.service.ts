import api from '@/lib/axios'
import type { B2BBatch, B2BEntitlement, B2BExam, B2BOrganization } from '@/types/b2b'

export const b2bService = {
  async getOrganization() {
    const { data } = await api.get<B2BOrganization>('/organization')
    return data
  },

  async listBatches() {
    const { data } = await api.get<B2BBatch[]>('/organization/batches')
    return data
  },

  async listExams() {
    const { data } = await api.get<B2BExam[]>('/organization/exams', { params: { exam: 'UPSC' } })
    return data
  },

  async listEntitlements() {
    const { data } = await api.get<B2BEntitlement[]>('/organization/entitlements')
    return data
  },
}
