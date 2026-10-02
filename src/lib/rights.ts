import type { AuthProfile, RightCode, Scope } from '@/types/auth'

export function hasRight(rights: RightCode[], required: RightCode): boolean {
  return rights.includes(required)
}

export function hasAnyRight(rights: RightCode[], required: RightCode[]): boolean {
  return required.some((right) => rights.includes(right))
}

export function hasAccess(profile: AuthProfile, required: RightCode): boolean {
  if (profile.is_platform_admin) return true
  return hasRight(profile.rights, required)
}

export function hasScope(profile: AuthProfile, requested?: Scope): boolean {
  if (profile.is_platform_admin || profile.scopes.length === 0) return true
  if (!requested) return false
  return profile.scopes.some((scope) => scope.type === requested.type && scope.id === requested.id)
}

export function canAccess(profile: AuthProfile, required: RightCode, scope?: Scope): boolean {
  return hasAccess(profile, required) && hasScope(profile, scope)
}