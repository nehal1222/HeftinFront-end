import type {
  AuthAccess,
  AuthRole,
  AuthSessionData,
  AuthTokenResponse,
  AuthUser,
  RightCode,
} from '@/types/auth'

export function extractRightCodes(rights: unknown): RightCode[] {
  if (!rights) return []
  if (Array.isArray(rights)) {
    return rights.filter((r): r is string => typeof r === 'string')
  }
  if (typeof rights === 'object' && rights !== null) {
    const codes = new Set<string>()
    for (const val of Object.values(rights)) {
      if (Array.isArray(val)) {
        for (const item of val) {
          if (typeof item === 'string') codes.add(item)
        }
      } else if (
        typeof val === 'object' &&
        val !== null &&
        'rights' in val &&
        Array.isArray((val as { rights?: unknown }).rights)
      ) {
        for (const item of (val as { rights: unknown[] }).rights) {
          if (typeof item === 'string') codes.add(item)
        }
      }
    }
    return Array.from(codes)
  }
  return []
}

function resolveAccess(access: unknown, roleName?: string, rights?: RightCode[]): AuthAccess {
  if (access && typeof access === 'object') {
    const a = access as Record<string, unknown>
    return {
      heftin_admin: Boolean(a.heftin_admin),
      org_admin: Boolean(a.org_admin),
      student: Boolean(a.student),
      user: typeof a.user === 'boolean' ? a.user : true,
    }
  }

  const isHeftinAdmin =
    roleName === 'heftin_admin' ||
    roleName === 'super_admin' ||
    Boolean(rights?.includes('platform.view'))
  const isOrgAdmin =
    roleName === 'org_admin' ||
    roleName === 'organization_admin'
  const isStudent = roleName === 'student'

  return {
    heftin_admin: isHeftinAdmin,
    org_admin: isOrgAdmin,
    student: isStudent,
    user: true,
  }
}

export function normalizeSessionUser(payload: unknown, fallback?: AuthUser | null): AuthUser {
  const root = payload as Record<string, unknown> | null
  const envelopeData =
    root && typeof root === 'object' && 'data' in root
      ? (root.data as Record<string, unknown>)
      : null
  const source = envelopeData ?? root ?? {}

  const userData = (
    source.user && typeof source.user === 'object' ? source.user : source
  ) as Record<string, unknown>
  const roleData = (
    source.role && typeof source.role === 'object' ? source.role : null
  ) as AuthRole | null
  const organizationData = (
    userData.organization ??
    userData.current_organization ??
    source.organization ??
    source.current_organization ??
    fallback?.organization ??
    null
  ) as AuthUser['organization']

  const rawRights = source.rights ?? userData.rights ?? fallback?.rights
  const flattenedRights = extractRightCodes(rawRights)

  const roleName =
    roleData?.name ??
    (Array.isArray(userData.roles)
      ? String(userData.roles[0])
      : typeof userData.role === 'string'
        ? userData.role
        : fallback?.roles?.[0] ?? 'user')

  const rolesList = Array.isArray(userData.roles)
    ? userData.roles.map(String)
    : roleData?.name
      ? [roleData.name]
      : fallback?.roles ?? [roleName]

  const access = resolveAccess(
    source.access ?? userData.access ?? fallback?.access,
    roleName,
    flattenedRights,
  )

  return {
    id: String(userData.id ?? fallback?.id ?? ''),
    email: String(userData.email ?? fallback?.email ?? ''),
    mobile: userData.mobile ? String(userData.mobile) : (fallback?.mobile ?? null),
    full_name: String(
      userData.full_name ??
        userData.name ??
        fallback?.full_name ??
        userData.email ??
        '',
    ),
    status: String(userData.status ?? fallback?.status ?? 'active'),
    employee_id: userData.employee_id
      ? String(userData.employee_id)
      : (fallback?.employee_id ?? null),
    must_change_password: Boolean(
      userData.must_change_password ?? fallback?.must_change_password ?? false,
    ),
    password_change_due_at: userData.password_change_due_at
      ? String(userData.password_change_due_at)
      : (fallback?.password_change_due_at ?? null),
    role: roleData ?? fallback?.role ?? null,
    roles: rolesList,
    scopes: (source.scopes ?? fallback?.scopes ?? null) as AuthUser['scopes'],
    subjects: (source.subjects ?? fallback?.subjects ?? null) as AuthUser['subjects'],
    access,
    rights: flattenedRights,
    organization: organizationData,
    current_organization: organizationData,
  }
}

export function normalizeAuthTokenResponse(rawResponse: unknown): AuthTokenResponse {
  const root = rawResponse as Record<string, unknown>
  const envelopeData =
    root && typeof root === 'object' && 'data' in root
      ? (root.data as Record<string, unknown>)
      : null
  const source = envelopeData ?? root ?? {}

  const tokenObj = (
    source.token && typeof source.token === 'object' ? source.token : source
  ) as Record<string, unknown>
  const accessToken = String(tokenObj.access_token ?? root.access_token ?? '')
  const refreshToken = String(tokenObj.refresh_token ?? root.refresh_token ?? '')
  const tokenType = String(tokenObj.token_type ?? root.token_type ?? 'bearer')
  const expiresIn =
    typeof tokenObj.expires_in === 'number' ? tokenObj.expires_in : undefined

  const sessionUser = normalizeSessionUser(rawResponse)

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: tokenType,
    expires_in: expiresIn,
    user: sessionUser,
    role: sessionUser.role,
    scopes: sessionUser.scopes,
    subjects: sessionUser.subjects,
    access: sessionUser.access,
    current_organization: sessionUser.organization,
    roles: sessionUser.roles,
    rights: sessionUser.rights,
    ...(envelopeData ? { data: envelopeData as unknown as AuthSessionData } : {}),
  }
}
