export function hasRight(rights, required) {
  return Array.isArray(rights) && rights.includes(required)
}

export function hasAnyRight(rights, required) {
  return Array.isArray(rights) && required.some((right) => rights.includes(right))
}

export function isPlatformAdmin(profile) {
  return profile?.is_platform_admin === true
}

export function canAccessScope(profile, resourceScope) {
  if (!profile || !Array.isArray(profile.scopes)) return false
  if (isPlatformAdmin(profile) || profile.scopes.length === 0) return true
  if (!resourceScope) return false
  const requestedScopes = Array.isArray(resourceScope) ? resourceScope : [resourceScope]
  return requestedScopes.some((requested) => profile.scopes.some((scope) => scope.type === requested.type && scope.id === requested.id))
}

export function canAccess(profile, requiredRight, resourceScope) {
  if (!profile) return false
  if (isPlatformAdmin(profile)) return true
  return hasRight(profile.rights, requiredRight) && canAccessScope(profile, resourceScope)
}