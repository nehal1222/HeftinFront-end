import api from '@/lib/axios'
import type {
  ContactInquiry,
  ContactResponse,
  ContactUpdate,
  LeadDetail,
  LeadSummary,
  PrivacyNoticeOut,
} from '@/types/contact'

export const contactService = {
  async submitContact(payload: ContactInquiry): Promise<ContactResponse> {
    const { data } = await api.post<ContactResponse>('/contact/', payload, {
      skipAuth: true,
    })
    return data
  },

  async listLeads(params?: Record<string, unknown>): Promise<LeadSummary[]> {
    const { data } = await api.get<LeadSummary[] | { data: LeadSummary[] }>('/contact/', { params })
    const list = Array.isArray(data) ? data : data?.data
    return Array.isArray(list) ? list : []
  },

  async getLead(leadId: string): Promise<LeadDetail> {
    const { data } = await api.get<LeadDetail | { data: LeadDetail }>(`/contact/${leadId}`)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as LeadDetail) : (data as LeadDetail)
  },

  async updateLead(leadId: string, payload: ContactUpdate): Promise<LeadDetail> {
    const { data } = await api.patch<LeadDetail | { data: LeadDetail }>(`/contact/${leadId}`, payload)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as LeadDetail) : (data as LeadDetail)
  },

  async eraseLead(leadId: string): Promise<void> {
    await api.post(`/contact/${leadId}/erase`)
  },

  async getNotice(): Promise<PrivacyNoticeOut> {
    const { data } = await api.get<PrivacyNoticeOut | { data: PrivacyNoticeOut }>('/contact/notice', {
      skipAuth: true,
    })
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as PrivacyNoticeOut) : (data as PrivacyNoticeOut)
  },

  async getStatus(): Promise<{ available: boolean; supportEmail: string }> {
    return {
      available: true,
      supportEmail: 'support@heftin.com',
    }
  },
}
