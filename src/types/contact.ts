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

export interface LeadSummary {
  id: string
  name: string
  email: string
  phone: string | null
  organization: string | null
  status: string
  created_at: string
}

export interface LeadDetail extends LeadSummary {
  category: string
  message: string
  notes?: string | null
  updated_at: string
}

export interface ContactUpdate {
  status?: string
  notes?: string | null
}

export interface PrivacyNoticeOut {
  title: string
  body: string
  effective_date: string
}
