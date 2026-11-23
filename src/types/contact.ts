export type ContactCategory = 'request_access' | 'demo' | 'support' | 'general'
export type InquiryCategory = 'institutional' | 'general' | 'partnership' | 'support' | ContactCategory
export type ContactStatus = 'new' | 'contacted' | 'closed'
export type ContactOutcome = 'approved' | 'rejected' | 'none'

export interface ContactIn {
  name: string
  email: string
  message: string
  category?: ContactCategory
  phone?: string | null
  company_name?: string | null
  subject?: string | null
  org_type?: string | null
  city?: string | null
  expected_students?: number | null
  exam_families?: string[] | null
  consent?: boolean
  consent_version?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  website?: string | null
}

export interface ContactAccepted {
  message: string
}

export interface ContactInquiry {
  name: string
  email: string
  phone?: string
  organization?: string
  company_name?: string
  category: InquiryCategory
  subject?: string
  message: string
  consent: boolean
  consent_version?: string
  honeypot?: string
  website?: string
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
  company_name?: string
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
  company_name: string | null
  organization?: string | null
  category: string
  status: ContactStatus | string
  created_at: string
}

export interface LeadDetail extends LeadSummary {
  subject: string | null
  message: string | null
  org_type?: string | null
  city?: string | null
  expected_students?: number | null
  exam_families?: string[] | null
  internal_notes?: string | null
  outcome?: ContactOutcome | string | null
  created_account_id?: string | null
  closed_at?: string | null
  erased_at?: string | null
  updated_at: string
}

export interface ContactUpdate {
  status?: ContactStatus | null
  internal_notes?: string | null
  outcome?: ContactOutcome | null
}

export interface PrivacyNoticeOut {
  title: string
  body: string
  effective_date: string
}
