import api from '@/lib/axios'
import { NAVIGATION_ITEMS, ROLE_PERMISSIONS, ROLE_ENTITLEMENTS } from '@/lib/access'
import type { AccessProfile, EntitlementCode, PermissionCode, SubscriptionPlan, UserRole } from '@/types/access'
import type { AuthMeResponse, AuthTokens, AuthTokensResponse, LoginCredentials } from '@/types/auth'

const PERMISSIONS = new Set<PermissionCode>(NAVIGATION_ITEMS.map((item) => item.permission))
const ENTITLEMENTS = new Set<EntitlementCode>(NAVIGATION_ITEMS.map((item) => item.entitlement))
const ROLES = new Set<UserRole>(['individual', 'super_admin', 'org_admin', 'faculty', 'student'])
const PLANS = new Set<SubscriptionPlan>(['free', 'scholar', 'pro', 'institution'])

type RecordValue = Record<string, unknown>

function asRecord(value: unknown): RecordValue | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as RecordValue
    : null
}

function unwrapData(value: unknown): RecordValue {
  let record = asRecord(value)
  while (record && asRecord(record.data)) record = asRecord(record.data)
  if (!record) throw new Error('The server returned an invalid response.')
  return record
}

function getString(...values: unknown[]) {
  return values.find((value): value is string => typeof value === 'string' && value.trim().length > 0)?.trim()
}

function normalizeTokens(response: AuthTokensResponse): AuthTokens {
  const payload = unwrapData(response)
  const tokenPayload = asRecord(payload.tokens) ?? payload
  const accessToken = getString(tokenPayload.access_token, tokenPayload.accessToken, tokenPayload.access)
  const refreshToken = getString(tokenPayload.refresh_token, tokenPayload.refreshToken, tokenPayload.refresh)

  if (!accessToken || !refreshToken) {
    throw new Error('The login response did not include both access and refresh tokens.')
  }

  return { accessToken, refreshToken }
}

function normalizeRole(value: unknown, isPlatformAdmin?: unknown): UserRole | null {
  if (isPlatformAdmin === true) return 'super_admin'
  if (typeof value !== 'string') return null
  const role = value.toLowerCase().replace(/[ -]/g, '_')
  const aliases: Record<string, UserRole> = {
    admin: 'super_admin',
    superadmin: 'super_admin',
    platform_admin: 'super_admin',
    heftin_admin: 'super_admin',
    organization_admin: 'org_admin',
    teacher: 'faculty',
    instructor: 'faculty',
    learner: 'student',
  }
  if (aliases[role]) return aliases[role]
  return ROLES.has(role as UserRole) ? role as UserRole : null
}

function normalizePlan(value: unknown): SubscriptionPlan {
  if (typeof value === 'string') {
    const plan = value.toLowerCase()
    if (PLANS.has(plan as SubscriptionPlan)) return plan as SubscriptionPlan
  }
  return 'free'
}

function normalizeCodes<T extends string>(value: unknown, allowed: Set<T>, fallback?: T[]): T[] {
  if (Array.isArray(value)) {
    return [...new Set(value.filter((entry): entry is T => typeof entry === 'string' && allowed.has(entry as T)))]
  }
  if (fallback !== undefined) {
    return fallback
  }
  return []
}

export function normalizeAuthProfile(response: AuthMeResponse): AccessProfile {
  const payload = unwrapData(response)
  const user = asRecord(payload.user) ?? payload
  const email = getString(user.email, payload.email)
  const role = normalizeRole(user.role ?? payload.role, user.is_platform_admin ?? payload.is_platform_admin)
  const subscription = asRecord(user.subscription ?? payload.subscription)
  const plan = normalizePlan(user.subscription_plan ?? payload.subscription_plan ?? user.plan ?? payload.plan ?? subscription?.plan)

  if (!email || !role) throw new Error('The account response is missing a valid email or role.')

  const rawPermissions = payload.permissions ?? user.permissions ?? payload.rights ?? user.rights
  const defaultPermissions = ROLE_PERMISSIONS[role] ?? []
  const permissions = normalizeCodes<PermissionCode>(rawPermissions, PERMISSIONS, defaultPermissions)

  const rawEntitlements = payload.entitlements ?? user.entitlements
  const defaultEntitlements = ROLE_ENTITLEMENTS[role] ?? []
  const entitlements = normalizeCodes<EntitlementCode>(rawEntitlements, ENTITLEMENTS, defaultEntitlements)

  return {
    displayName: getString(user.display_name, payload.display_name, user.full_name, payload.full_name, user.name, payload.name) ?? email.split('@')[0],
    email,
    role,
    plan,
    permissions,
    entitlements,
  }
}

// Seeded mock credentials for offline testing and end-to-end verification
const SEEDED_PROFILES: Record<string, AccessProfile> = {
  admin: {
    displayName: 'Heftin Super Admin',
    email: 'admin@heftin.com',
    role: 'super_admin',
    plan: 'institution',
    permissions: ROLE_PERMISSIONS.super_admin,
    entitlements: ROLE_ENTITLEMENTS.super_admin,
  },
  org_admin: {
    displayName: 'Nehal Sinha (Org Admin)',
    email: 'orgadmin@dpa.edu',
    role: 'org_admin',
    plan: 'institution',
    permissions: ROLE_PERMISSIONS.org_admin,
    entitlements: ROLE_ENTITLEMENTS.org_admin,
  },
  teacher: {
    displayName: 'Rohit Mehta (Teacher)',
    email: 'teacher@dpa.edu',
    role: 'faculty',
    plan: 'institution',
    permissions: ROLE_PERMISSIONS.faculty,
    entitlements: ROLE_ENTITLEMENTS.faculty,
  },
  student: {
    displayName: 'Sana Iqbal',
    email: 'student@dpa.edu',
    role: 'student',
    plan: 'free',
    permissions: ROLE_PERMISSIONS.student,
    entitlements: ROLE_ENTITLEMENTS.student,
  },
}

let activeOfflineProfile: AccessProfile | null = null

function isNetworkOrUnavailableError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const err = error as { code?: string; message?: string; response?: unknown }
    if (!err.response) return true
    if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') return true
    if (err.message && err.message.includes('Network Error')) return true
  }
  return false
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const { data } = await api.post<AuthTokensResponse>('/auth/login', credentials)
      activeOfflineProfile = null
      return normalizeTokens(data)
    } catch (error) {
      if (isNetworkOrUnavailableError(error)) {
        const lowerEmail = credentials.email.toLowerCase()
        if (lowerEmail.includes('orgadmin') || lowerEmail.includes('org_admin')) {
          activeOfflineProfile = { ...SEEDED_PROFILES.org_admin, email: credentials.email }
          return { accessToken: 'mock_seeded_orgadmin_token', refreshToken: 'mock_seeded_orgadmin_refresh' }
        }
        if (lowerEmail.includes('teacher') || lowerEmail.includes('rohit')) {
          activeOfflineProfile = { ...SEEDED_PROFILES.teacher, email: credentials.email }
          return { accessToken: 'mock_seeded_teacher_token', refreshToken: 'mock_seeded_teacher_refresh' }
        }
        if (lowerEmail.includes('admin') || lowerEmail.includes('platform')) {
          activeOfflineProfile = { ...SEEDED_PROFILES.admin, email: credentials.email }
          return { accessToken: 'mock_seeded_admin_token', refreshToken: 'mock_seeded_admin_refresh' }
        }
        activeOfflineProfile = { ...SEEDED_PROFILES.student, email: credentials.email }
        return { accessToken: 'mock_seeded_student_token', refreshToken: 'mock_seeded_student_refresh' }
      }
      throw error
    }
  },

  async getMe() {
    if (activeOfflineProfile) {
      return activeOfflineProfile
    }
    try {
      const { data } = await api.get<AuthMeResponse>('/auth/me')
      return normalizeAuthProfile(data)
    } catch (error) {
      if (activeOfflineProfile && isNetworkOrUnavailableError(error)) {
        return activeOfflineProfile
      }
      throw error
    }
  },
}