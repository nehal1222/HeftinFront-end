import type { AuthProfile, RightCode, Scope } from '@/types/auth'

export function hasRight(rights: RightCode[] | undefined | null, required: RightCode): boolean {
  return Array.isArray(rights) && rights.includes(required)
}

export function hasAnyRight(rights: RightCode[] | undefined | null, required: RightCode[]): boolean {
  return Array.isArray(rights) && required.some((right) => rights.includes(right))
}

export function hasAllRights(rights: RightCode[] | undefined | null, required: RightCode[]): boolean {
  return Array.isArray(rights) && required.every((right) => rights.includes(right))
}

export function isPlatformAdmin(profile: { is_platform_admin?: boolean } | null | undefined): boolean {
  return profile?.is_platform_admin === true
}

export function canAccessScope(
  profile: AuthProfile | null | undefined,
  resourceScope?: Scope | Scope[]
): boolean {
  if (!profile || !Array.isArray(profile.scopes)) return false
  if (isPlatformAdmin(profile) || profile.scopes.length === 0) return true
  if (!resourceScope) return false
  const requestedScopes = Array.isArray(resourceScope) ? resourceScope : [resourceScope]
  return requestedScopes.some((requested) =>
    profile.scopes.some((scope) => scope.type === requested.type && scope.id === requested.id)
  )
}

export function canAccess(
  profile: AuthProfile | null | undefined,
  requiredRight?: RightCode,
  resourceScope?: Scope | Scope[]
): boolean {
  if (!profile) return false
  if (isPlatformAdmin(profile)) return true
  if (!requiredRight) return true
  return hasRight(profile.rights, requiredRight) && canAccessScope(profile, resourceScope)
}

export function formatScopeNotice(scopes: Scope[]): string {
  if (!scopes || scopes.length === 0) return 'Organization-wide'
  const labels = scopes.map((scope) => {
    if (scope.type === 'batch') return `Batch ${scope.id.replace('batch_', '')}`
    if (scope.type === 'department') return `Dept ${scope.id.replace('dept_', '')}`
    return `${scope.type} ${scope.id}`
  })
  return `Showing ${labels.join(', ')} only`
}
