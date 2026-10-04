import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import type { RightCode } from '@/types/auth'

type ProtectedRouteProps = {
  requiredRight?: RightCode
  children: ReactNode
}

export function ProtectedRoute({
  requiredRight,
  children,
}: ProtectedRouteProps) {
  const { hasRight } = useAuth()
  const location = useLocation()

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
