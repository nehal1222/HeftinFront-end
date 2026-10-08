import type { RightCode } from '@/types/auth'

export const RIGHTS = {
  EXAMS_VIEW: 'exams.view',
  STUDY_MATERIAL_VIEW: 'study_material.view',
  PERFORMANCE_VIEW: 'performance.view',
  BATCHES_VIEW: 'batches.view',
  EVALUATIONS_REVIEW: 'evaluations.review',
  USERS_VIEW: 'users.view',
  ROLES_VIEW: 'roles.view',
  PLATFORM_VIEW: 'platform.view',
} as const satisfies Record<string, RightCode>

export function hasRight(rights: readonly RightCode[], required: RightCode): boolean {
  return rights.includes(required)
}
