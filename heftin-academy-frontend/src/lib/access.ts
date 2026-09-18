import type {
  AccessProfile,
  EntitlementCode,
  NavigationItem,
  PermissionCode,
  SubscriptionPlan,
  UserRole,
} from '@/types/access'

export const ROLE_LABELS: Record<UserRole, string> = {
  individual: 'Individual learner',
  super_admin: 'Heftin Super Admin',
  org_admin: 'Organization login',
  faculty: 'Organization Faculty',
  student: 'Student',
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  student: 'Exams, learning, microtasks, and knowledge practice.',
  individual: 'Personal learning access that expands with the plan.',
  faculty: 'Create material and guide learner assignments.',
  org_admin: 'Organization login for managing people, rights, and workspace access.',
  super_admin: 'Control Heftin, organizations, plans, and all capabilities.',
}

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  free: 'Free',
  scholar: 'Scholar',
  pro: 'Pro',
  institution: 'Institution',
}

export const ROLE_OPTIONS: UserRole[] = ['student', 'individual', 'faculty', 'org_admin', 'super_admin']
export const PLAN_OPTIONS: SubscriptionPlan[] = ['free', 'scholar', 'pro', 'institution']

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'overview', label: 'Overview', description: 'Your command center', group: 'learn', permission: 'dashboard.view', entitlement: 'learning' },
  { id: 'exams', label: 'UPSC Exams', description: 'Take and review UPSC exams', group: 'learn', permission: 'exams.take', entitlement: 'exams' },
  { id: 'learning', label: 'Learning', description: 'Courses and study material', group: 'learn', permission: 'learning.view', entitlement: 'learning' },
  { id: 'microtasks', label: 'Microtasks', description: 'Focused practice and knowledge work', group: 'learn', permission: 'microtasks.use', entitlement: 'microtasks' },
  { id: 'knowledge', label: 'Knowledge base', description: 'Reference material', group: 'learn', permission: 'knowledge.view', entitlement: 'knowledge' },
  { id: 'analytics', label: 'Analytics', description: 'Progress and performance', group: 'learn', permission: 'analytics.view', entitlement: 'analytics' },
  { id: 'content', label: 'Content studio', description: 'Build learning material', group: 'manage', permission: 'content.manage', entitlement: 'content' },
  { id: 'assignments', label: 'Assignments', description: 'Set and review work', group: 'manage', permission: 'assignments.manage', entitlement: 'assignments' },
  { id: 'people', label: 'People and rights', description: 'Users and access', group: 'manage', permission: 'users.manage', entitlement: 'users' },
  { id: 'organization', label: 'Organization', description: 'Workspace settings', group: 'platform', permission: 'org.manage', entitlement: 'org-settings' },
  { id: 'subscriptions', label: 'Subscriptions', description: 'Plans and entitlements', group: 'platform', permission: 'plans.manage', entitlement: 'subscriptions' },
]

const ALL_PERMISSIONS: PermissionCode[] = NAVIGATION_ITEMS.map((item) => item.permission)
const ALL_ENTITLEMENTS: EntitlementCode[] = NAVIGATION_ITEMS.map((item) => item.entitlement)

const ROLE_PERMISSIONS: Record<UserRole, PermissionCode[]> = {
  individual: ['dashboard.view', 'exams.take', 'learning.view', 'microtasks.use', 'knowledge.view', 'analytics.view'],
  super_admin: ALL_PERMISSIONS,
  org_admin: ['dashboard.view', 'exams.take', 'learning.view', 'microtasks.use', 'knowledge.view', 'analytics.view', 'content.manage', 'assignments.manage', 'users.manage', 'org.manage'],
  faculty: ['dashboard.view', 'exams.take', 'learning.view', 'microtasks.use', 'knowledge.view', 'analytics.view', 'content.manage', 'assignments.manage'],
  student: ['dashboard.view', 'exams.take', 'learning.view', 'microtasks.use', 'knowledge.view'],
}

const ROLE_ENTITLEMENTS: Record<UserRole, EntitlementCode[]> = {
  individual: ['exams', 'learning', 'microtasks', 'knowledge', 'analytics'],
  super_admin: ALL_ENTITLEMENTS,
  org_admin: ['exams', 'learning', 'microtasks', 'knowledge', 'analytics', 'content', 'assignments', 'users', 'org-settings'],
  faculty: ['exams', 'learning', 'microtasks', 'knowledge', 'analytics', 'content', 'assignments'],
  student: ['exams', 'learning', 'microtasks', 'knowledge'],
}

const PLAN_ENTITLEMENTS: Record<SubscriptionPlan, EntitlementCode[]> = {
  free: ['exams', 'learning'],
  scholar: ['exams', 'learning', 'microtasks', 'knowledge'],
  pro: ['exams', 'learning', 'microtasks', 'knowledge', 'analytics'],
  institution: ALL_ENTITLEMENTS,
}

export function createAccessProfile(displayName: string, email: string, role: UserRole, plan: SubscriptionPlan): AccessProfile {
  const roleEntitlements = ROLE_ENTITLEMENTS[role]
  const allowedByPlan = role === 'super_admin' ? ALL_ENTITLEMENTS : PLAN_ENTITLEMENTS[plan]

  return {
    displayName,
    email,
    role,
    plan,
    permissions: ROLE_PERMISSIONS[role],
    entitlements: ALL_ENTITLEMENTS.filter((item) => roleEntitlements.includes(item) && allowedByPlan.includes(item)),
  }
}

export function canAccess(profile: AccessProfile, item: NavigationItem) {
  return profile.permissions.includes(item.permission) && profile.entitlements.includes(item.entitlement)
}

export function getVisibleNavigation(profile: AccessProfile) {
  return NAVIGATION_ITEMS.filter((item) => canAccess(profile, item))
}
