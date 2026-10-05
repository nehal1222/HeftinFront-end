import type { ReactNode } from 'react'
import type { AuthProfile, RightCode, Scope } from '@/types/auth'
import { canAccess } from '@/lib/rights'
import { Forbidden } from '@/components/auth/Forbidden'

interface RequireRightProps {
  auth: { profile: AuthProfile } | AuthProfile
  right?: RightCode
  scope?: Scope | Scope[]
  fallback?: ReactNode
  children: ReactNode
}

export function RequireRight({ auth, right, scope, fallback, children }: RequireRightProps) {
  const profile = 'profile' in auth ? auth.profile : auth
  const authorized = canAccess(profile, right, scope)

  if (!authorized) {
    if (fallback) return <>{fallback}</>
    return <Forbidden requiredRight={right} />
  }

  return <>{children}</>
}

export default RequireRight
