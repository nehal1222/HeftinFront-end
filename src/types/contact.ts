export type ContactInquiry = {
  name: string
  email: string
  phone?: string
  organization?: string
  subject?: string
  message: string
  category?: 'general' | 'institutional' | 'support' | 'partnership'
}

export type ContactResponse = {
  success: boolean
  message: string
  ticketId?: string
  timestamp?: string
}
