import type { AuthProfile, RightCode } from '@/types/auth'

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
