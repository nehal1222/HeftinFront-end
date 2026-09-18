export type B2BOrganization = {
  id: string
  name: string
  examFocus: 'UPSC'
  learnerCount: number
  facultyCount: number
  batchCount: number
  status: 'active' | 'pending' | 'suspended'
}

export type B2BBatch = {
  id: string
  name: string
  learnerCount: number
  facultyName: string
  nextExam: string
  progress: number
}

export type B2BExam = {
  id: string
  title: string
  batchName: string
  status: 'draft' | 'scheduled' | 'live' | 'completed'
  scheduledFor: string
  submissions: number
}

export type B2BEntitlement = {
  code: string
  label: string
  enabled: boolean
  source: 'Heftin pack'
}
