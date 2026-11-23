import api from '@/lib/axios'
import type {
  ContactAccepted,
  ContactIn,
  ContactInquiry,
  ContactResponse,
  ContactUpdate,
  LeadDetail,
  LeadSummary,
  PrivacyNoticeOut,
} from '@/types/contact'

export const contactService = {
  async submitContact(payload: ContactInquiry | ContactIn): Promise<ContactResponse> {
    const categoryMap: Record<string, 'request_access' | 'demo' | 'support' | 'general'> = {
      institutional: 'request_access',
      partnership: 'demo',
      support: 'support',
      general: 'general',
      request_access: 'request_access',
      demo: 'demo',
    }

    const categoryKey = ('category' in payload && payload.category) ? String(payload.category).toLowerCase() : 'general'
    const mappedCategory = categoryMap[categoryKey] ?? 'general'

    const company = ('company_name' in payload && payload.company_name)
      ? payload.company_name
      : ('organization' in payload && payload.organization)
        ? payload.organization
        : null

    const honeypotVal = ('website' in payload && payload.website)
      ? payload.website
      : ('honeypot' in payload && payload.honeypot)
        ? payload.honeypot
        : null

    const body: ContactIn = {
      name: payload.name.trim(),
      email: payload.email.trim(),
      message: payload.message.trim(),
      category: mappedCategory,
      phone: payload.phone?.trim() || null,
      company_name: company?.trim() || null,
      subject: payload.subject?.trim() || null,
      consent: Boolean(payload.consent),
      consent_version: payload.consent_version ?? '2026-v1',
      utm_source: payload.utm_source ?? null,
      utm_medium: payload.utm_medium ?? null,
      utm_campaign: payload.utm_campaign ?? null,
      website: honeypotVal?.trim() || null,
    }

    const { data } = await api.post<ContactAccepted | ContactResponse>('/contact/', body, {
      skipAuth: true,
    })

    const message = (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string')
      ? data.message
      : 'Thank you for contacting us! Your inquiry has been received.'

    return {
      success: true,
      message,
    }
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
