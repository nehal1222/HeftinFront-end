import type { RightCode } from '@/types/auth'

export const RIGHTS = {
  USERS_VIEW: 'users.view',
  ROLES_VIEW: 'roles.view',
  PLATFORM_VIEW: 'platform.view',
} as const satisfies Record<string, RightCode>

export function hasRight(rights: readonly RightCode[], required: RightCode): boolean {
  return rights.includes(required)
}
