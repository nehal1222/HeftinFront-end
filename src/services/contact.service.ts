import api from '@/lib/axios'
import type { ContactInquiry, ContactResponse } from '@/types/contact'

export const contactService = {
  /**
   * Dispatches a public inquiry (demo request, institutional licensing, or support).
   * Passes skipAuth: true so anonymous calls never attach stale tokens or trigger 401 refresh loops.
   */
  async submitContact(payload: ContactInquiry): Promise<ContactResponse> {
    const { data } = await api.post<ContactResponse>('/contact', payload, {
      skipAuth: true,
    })
    return data
  },

  /**
   * Checks gateway reachability and returns official support channels.
   */
  async getStatus(): Promise<{ available: boolean; supportEmail: string }> {
    const { data } = await api.get<{ available: boolean; supportEmail: string }>('/contact/status', {
      skipAuth: true,
    })
    return data
  },
}
