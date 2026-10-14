import api from '@/lib/axios'
import type { ContactInquiry, ContactResponse } from '@/types/contact'

export const contactService = {
  async submitContact(payload: ContactInquiry): Promise<ContactResponse> {
    const { data } = await api.post<ContactResponse>('/contact', payload, {
      skipAuth: true,
    })
    return data
  },

  async getStatus(): Promise<{ available: boolean; supportEmail: string }> {
    const { data } = await api.get<{ available: boolean; supportEmail: string }>('/contact/status', {
      skipAuth: true,
    })
    return data
  },
}
