import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import type { RightCode } from '@/types/auth'

type ProtectedRouteProps = {
  requiredRight?: RightCode
  platformAdminOnly?: boolean
  children: ReactNode
}

export function ProtectedRoute({
  requiredRight,
  platformAdminOnly,
  children,
}: ProtectedRouteProps) {
  const { hasRight, profile } = useAuth()
  const location = useLocation()

  if (platformAdminOnly && !profile.is_platform_admin) {
    return (
      <Navigate
        to={ROUTES.DASHBOARD}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (requiredRight && !hasRight(requiredRight)) {
    return (
      <Navigate
        to={ROUTES.DASHBOARD}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return children
}
