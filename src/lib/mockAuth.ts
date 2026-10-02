import type { AuthProfile, DemoPersonaId, RightCode } from '@/types/auth'

export type DemoPersona = {
  id: DemoPersonaId
  label: string
  name: string
  profile: AuthProfile
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'org_admin',
    label: 'Organization Admin',
    name: 'Nehal Sinha',
    profile: {
      account_id: 'acc_org_admin',
      role: 'org_admin',
      rights: [
        'users.view', 'users.create', 'users.edit',
        'roles.view', 'roles.create', 'roles.edit', 'roles.rights.edit', 'roles.assign',
        'org.profile.view', 'org.profile.edit', 'departments.view', 'departments.create',
        'departments.edit', 'batches.view', 'batches.create', 'batches.edit', 'audit.view',
      ],
      scopes: [],
      is_platform_admin: false,
    },
  },
  {
    id: 'teacher',
    label: 'Teacher',
    name: 'Aarav Sharma',
    profile: {
      account_id: 'acc_teacher',
      role: 'Teacher',
      rights: ['users.view', 'batches.view'],
      scopes: [{ type: 'batch', id: 'batch_101' }],
      is_platform_admin: false,
    },
  },
  {
    id: 'student',
    label: 'Student',
    name: 'Sana Iqbal',
    profile: {
      account_id: 'acc_student',
      role: 'Student',
      rights: ['batches.view'],
      scopes: [{ type: 'batch', id: 'batch_101' }],
      is_platform_admin: false,
    },
  },
  {
    id: 'platform_admin',
    label: 'SuperAdmin',
    name: 'Heftin Platform Admin',
    profile: {
      account_id: null,
      rights: [],
      scopes: [],
      is_platform_admin: true,
    },
  },
]

export const DEMO_ORGANIZATION = {
  id: 'org_001',
  name: 'Delhi Public Academy',
  city: 'New Delhi',
  status: 'Active',
  peopleCount: 248,
  roleCount: 8,
  departmentCount: 4,
  batchCount: 6,
}

export const DEMO_PEOPLE = [
  { id: 'user_001', name: 'Sana Iqbal', role: 'Student', department: 'Mathematics', departmentId: 'dept_101', batch: 'Batch 101', batchId: 'batch_101', status: 'Active' },
  { id: 'user_002', name: 'Aarav Sharma', role: 'Teacher', department: 'Mathematics', departmentId: 'dept_101', batch: 'Batch 101', batchId: 'batch_101', status: 'Active' },
  { id: 'user_003', name: 'Karan Shah', role: 'Student', department: 'Science', departmentId: 'dept_102', batch: 'Batch 102', batchId: 'batch_102', status: 'Active' },
]

export const DEMO_ROLES = [
  { id: 'org_admin', name: 'Org Admin', rights: DEMO_PERSONAS[0].profile.rights, scope: 'Organization-wide' },
  { id: 'hod', name: 'HOD', rights: ['users.view', 'roles.view', 'departments.view', 'batches.view'], scope: 'Department-scoped' },
  { id: 'subject_head', name: 'Subject Head', rights: ['departments.view', 'batches.view'], scope: 'Department-scoped' },
  { id: 'teacher', name: 'Teacher', rights: ['users.view', 'batches.view'], scope: 'Batch-scoped' },
  { id: 'student', name: 'Student', rights: ['batches.view'], scope: 'Batch-scoped' },
]

export const DEMO_DEPARTMENTS = [
  { id: 'dept_101', name: 'Mathematics', head: 'Aarav Sharma', peopleCount: 62 },
  { id: 'dept_102', name: 'Science', head: 'Rohit Mehta', peopleCount: 71 },
  { id: 'dept_103', name: 'Humanities', head: 'Priya Nair', peopleCount: 58 },
]

export const DEMO_BATCHES = [
  { id: 'batch_101', name: 'Batch 101', departmentId: 'dept_101', department: 'Mathematics', teacher: 'Aarav Sharma', peopleCount: 36 },
  { id: 'batch_102', name: 'Batch 102', departmentId: 'dept_102', department: 'Science', teacher: 'Rohit Mehta', peopleCount: 42 },
  { id: 'batch_103', name: 'Batch 103', departmentId: 'dept_103', department: 'Humanities', teacher: 'Priya Nair', peopleCount: 31 },
]

export const DEMO_RIGHTS_CEILING: RightCode[] = [
  'users.view', 'users.create', 'users.edit', 'users.deactivate', 'users.reset_password',
  'roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'roles.rights.edit', 'roles.assign',
  'org.profile.view', 'org.profile.edit', 'audit.view',
  'departments.view', 'departments.create', 'departments.edit',
  'batches.view', 'batches.create', 'batches.edit',
]

export function getDemoPersona(id: DemoPersonaId) {
  return DEMO_PERSONAS.find((persona) => persona.id === id) ?? null
}