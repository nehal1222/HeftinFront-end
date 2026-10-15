export type InquiryCategory = 'institutional' | 'general' | 'partnership' | 'support'

export interface ContactInquiry {
  name: string
  email: string
  phone?: string
  organization?: string
  category: InquiryCategory
  subject?: string
  message: string
  consent: boolean
  honeypot?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

export interface ContactResponse {
  success: boolean
  message: string
  inquiry_id?: string
  created_at?: string
  ticketId?: string
}

export interface ContactFieldErrors {
  name?: string
  email?: string
  phone?: string
  organization?: string
  category?: string
  message?: string
  consent?: string
  [key: string]: string | undefined
}
