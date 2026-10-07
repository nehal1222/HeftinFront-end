import type { AuthProfile, RightCode } from '@/types/auth'

export const RIGHTS = {
  USERS_VIEW: 'users.view',
  ROLES_VIEW: 'roles.view',
} as const satisfies Record<string, RightCode>

export function hasRight(
  rights: RightCode[],
  required: RightCode,
): boolean {
  return rights.includes(required)
}

export function canAccess(
  profile: AuthProfile,
  required: RightCode,
): boolean {
  if (profile.is_platform_admin) return true

  return hasRight(profile.rights, required)
}
