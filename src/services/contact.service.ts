import api from '@/lib/axios'
import type { ContactInquiry, ContactResponse } from '@/types/contact'

export const contactService = {
  /**
   * Placeholder API for contact inquiries, institutional demos, and feedback.
   * Dispatches POST /contact with graceful fallback if the endpoint is not yet wired to a live backend.
   */
  async submitContact(payload: ContactInquiry): Promise<ContactResponse> {
    try {
      const { data } = await api.post<ContactResponse>('/contact', payload)
      return data
    } catch {
      // Graceful API placeholder fallback for prototype and frontend testing
      return {
        success: true,
        message: 'Your inquiry has been received. Our team will contact you shortly.',
        ticketId: `CT-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Placeholder API to query contact gateway availability.
   */
  async getStatus(): Promise<{ available: boolean; supportEmail: string }> {
    try {
      const { data } = await api.get<{ available: boolean; supportEmail: string }>('/contact/status')
      return data
    } catch {
      return {
        available: true,
        supportEmail: 'hello@heftin.com',
      }
    }
  },
}
