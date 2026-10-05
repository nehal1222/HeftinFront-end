import type { AuthProfile, RightCode, RoleDefinition } from '@/types/auth'

export const DEMO_PROFILES: Record<string, AuthProfile> = {
  org_admin: {
    account_id: 'acc_org_admin',
    role: 'org_admin',
    rights: [
      'users.view',
      'users.create',
      'users.edit',
      'roles.view',
      'roles.create',
      'roles.edit',
      'roles.rights.edit',
      'roles.assign',
      'org.profile.view',
      'org.profile.edit',
      'departments.view',
      'departments.create',
      'departments.edit',
      'batches.view',
      'batches.create',
      'batches.edit',
      'audit.view',
    ],
    scopes: [],
    is_platform_admin: false,
    display_name: 'Nehal Sinha',
    email: 'orgadmin@dpa.edu',
  },
  teacher: {
    account_id: 'acc_teacher',
    role: 'Teacher',
    rights: ['users.view', 'batches.view'],
    scopes: [{ type: 'batch', id: 'batch_101' }],
    is_platform_admin: false,
    display_name: 'Rohit Mehta',
    email: 'rohit@dpa.edu',
  },
  platform_admin: {
    account_id: null,
    rights: [],
    scopes: [],
    is_platform_admin: true,
    display_name: 'Heftin Platform Admin',
    email: 'admin@heftin.com',
  },
  hod: {
    account_id: 'acc_hod',
    role: 'HOD',
    rights: ['users.view', 'roles.view', 'departments.view', 'batches.view', 'batches.create'],
    scopes: [{ type: 'department', id: 'dept_101' }],
    is_platform_admin: false,
    display_name: 'Priya Nair',
    email: 'priya@dpa.edu',
  },
  student: {
    account_id: 'acc_student',
    role: 'Student',
    rights: ['batches.view'],
    scopes: [{ type: 'batch', id: 'batch_101' }],
    is_platform_admin: false,
    display_name: 'Sana Iqbal',
    email: 'sana@dpa.edu',
  },
}

export interface DemoPersona {
  id: string
  label: string
  profile: AuthProfile
  name: string
  scopeDescription: string
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'student',
    label: 'Student',
    profile: DEMO_PROFILES.student,
    name: 'Sana Iqbal',
    scopeDescription: 'Batch 101 Enrolled Learner',
  },
  {
    id: 'teacher',
    label: 'Faculty',
    profile: DEMO_PROFILES.teacher,
    name: 'Prof. Rohit Mehta',
    scopeDescription: 'Batch 101 & Physics Faculty',
  },
  {
    id: 'org_admin',
    label: 'Organization Admin',
    profile: DEMO_PROFILES.org_admin,
    name: 'Nehal Sinha',
    scopeDescription: 'Organization-wide management',
  },
  {
    id: 'platform_admin',
    label: 'Heftin Super Admin',
    profile: DEMO_PROFILES.platform_admin,
    name: 'Heftin Platform Central',
    scopeDescription: 'Platform-level administrator (account_id: null)',
  },
]

export interface DemoOrganization {
  id: string
  name: string
  status: string
  city: string
  peopleCount: number
  roleCount: number
  departmentCount: number
  batchCount: number
  rightsCount?: number
  updatedAt: string
}

export const DEMO_ORGANIZATION: DemoOrganization = {
  id: 'org_001',
  name: 'Delhi Public Academy',
  status: 'Active',
  city: 'New Delhi',
  peopleCount: 248,
  roleCount: 8,
  departmentCount: 4,
  batchCount: 6,
  rightsCount: 17,
  updatedAt: 'Today, 9:42 AM',
}

export const ORGANIZATION_CEILING: RightCode[] = [
  'users.view',
  'users.create',
  'users.edit',
  'users.deactivate',
  'users.reset_password',
  'roles.view',
  'roles.create',
  'roles.edit',
  'roles.delete',
  'roles.rights.edit',
  'roles.assign',
  'org.profile.view',
  'org.profile.edit',
  'audit.view',
  'departments.view',
  'departments.create',
  'departments.edit',
  'batches.view',
  'batches.create',
  'batches.edit',
]

export const MOCK_ROLE_GRANTABLE_RIGHTS: RightCode[] = [...DEMO_PROFILES.org_admin.rights]
export const MOCK_STUDENT_GRANTABLE_RIGHTS: RightCode[] = ['batches.view']

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: 'org_admin',
    name: 'Org Admin',
    rights: DEMO_PROFILES.org_admin.rights,
    scopeLabel: 'Organization-wide',
    audience: 'staff',
  },
  {
    id: 'hod',
    name: 'HOD',
    rights: ['users.view', 'roles.view', 'departments.view', 'batches.view', 'batches.create'],
    scopeLabel: 'Department-scoped',
    audience: 'staff',
  },
  {
    id: 'subject_head',
    name: 'Subject Head',
    rights: ['users.view', 'departments.view', 'batches.view'],
    scopeLabel: 'Department-scoped',
    audience: 'staff',
  },
  {
    id: 'teacher',
    name: 'Teacher',
    rights: DEMO_PROFILES.teacher.rights,
    scopeLabel: 'Batch-scoped',
    audience: 'staff',
  },
  {
    id: 'student',
    name: 'Student',
    rights: ['batches.view'],
    scopeLabel: 'Batch-scoped',
    audience: 'student',
  },
]

export interface PersonItem {
  id: string
  name: string
  email: string
  role: string
  department: string
  departmentId: string
  batch: string
  batchId: string
  status: string
}

export const PEOPLE: PersonItem[] = [
  {
    id: 'p1',
    name: 'Aarav Sharma',
    email: 'aarav@dpa.edu',
    role: 'Teacher',
    department: 'Mathematics',
    departmentId: 'dept_101',
    batch: 'Batch 101',
    batchId: 'batch_101',
    status: 'Active',
  },
  {
    id: 'p2',
    name: 'Rohit Mehta',
    email: 'rohit@dpa.edu',
    role: 'Teacher',
    department: 'Science',
    departmentId: 'dept_102',
    batch: 'Batch 102',
    batchId: 'batch_102',
    status: 'Active',
  },
  {
    id: 'p3',
    name: 'Priya Nair',
    email: 'priya@dpa.edu',
    role: 'HOD',
    department: 'Humanities',
    departmentId: 'dept_103',
    batch: 'Batch 101',
    batchId: 'batch_101',
    status: 'Active',
  },
  {
    id: 'p4',
    name: 'Sana Iqbal',
    email: 'sana@dpa.edu',
    role: 'Student',
    department: 'Mathematics',
    departmentId: 'dept_101',
    batch: 'Batch 101',
    batchId: 'batch_101',
    status: 'Active',
  },
  {
    id: 'p5',
    name: 'Karan Shah',
    email: 'karan@dpa.edu',
    role: 'Student',
    department: 'Science',
    departmentId: 'dept_102',
    batch: 'Batch 102',
    batchId: 'batch_102',
    status: 'Active',
  },
]

export interface DepartmentItem {
  id: string
  name: string
  head: string
  people: number
}

export const DEPARTMENTS: DepartmentItem[] = [
  { id: 'dept_101', name: 'Mathematics', head: 'Aarav Sharma', people: 62 },
  { id: 'dept_102', name: 'Science', head: 'Rohit Mehta', people: 71 },
  { id: 'dept_103', name: 'Humanities', head: 'Priya Nair', people: 58 },
  { id: 'dept_104', name: 'Languages', head: 'Meera Kapoor', people: 57 },
]

export interface BatchItem {
  id: string
  name: string
  department: string
  departmentId: string
  teacher: string
  people: number
  status: string
}

export const BATCHES: BatchItem[] = [
  {
    id: 'batch_101',
    name: 'Batch 101',
    department: 'Mathematics',
    departmentId: 'dept_101',
    teacher: 'Aarav Sharma',
    people: 36,
    status: 'Active',
  },
  {
    id: 'batch_102',
    name: 'Batch 102',
    department: 'Science',
    departmentId: 'dept_102',
    teacher: 'Rohit Mehta',
    people: 42,
    status: 'Active',
  },
  {
    id: 'batch_103',
    name: 'Batch 103',
    department: 'Humanities',
    departmentId: 'dept_103',
    teacher: 'Priya Nair',
    people: 31,
    status: 'Active',
  },
]

export interface ActivityItem {
  action: string
  detail: string
  time: string
}

export const RECENT_ACTIVITY: ActivityItem[] = [
  { action: 'Batch 101 updated', detail: 'Aarav Sharma changed the batch schedule', time: '9:42 AM' },
  { action: 'Teacher invited', detail: 'Meera Kapoor joined Languages', time: 'Yesterday' },
  { action: 'Role rights updated', detail: 'Subject Head rights were reviewed', time: 'Sep 30' },
]
