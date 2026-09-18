export type UserRole = 'individual' | 'super_admin' | 'org_admin' | 'faculty' | 'student'

export type SubscriptionPlan = 'free' | 'scholar' | 'pro' | 'institution'

export type PermissionCode =
  | 'dashboard.view'
  | 'exams.take'
  | 'learning.view'
  | 'microtasks.use'
  | 'knowledge.view'
  | 'analytics.view'
  | 'content.manage'
  | 'assignments.manage'
  | 'users.manage'
  | 'org.manage'
  | 'plans.manage'

export type EntitlementCode =
  | 'exams'
  | 'learning'
  | 'microtasks'
  | 'knowledge'
  | 'analytics'
  | 'content'
  | 'assignments'
  | 'users'
  | 'org-settings'
  | 'subscriptions'

export type AccessProfile = {
  displayName: string
  email: string
  role: UserRole
  plan: SubscriptionPlan
  permissions: PermissionCode[]
  entitlements: EntitlementCode[]
}

export type NavigationItem = {
  id: string
  label: string
  description: string
  group: 'learn' | 'manage' | 'platform'
  permission: PermissionCode
  entitlement: EntitlementCode
}
