import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/useAuth'
import { ROUTES } from '@/lib/constants'
import type { RightCode } from '@/types/auth'

type ProtectedRouteProps = {
  children?: ReactNode
  requiredRight?: RightCode
}

export function ProtectedRoute({ children, requiredRight }: ProtectedRouteProps) {
  const { hasRight, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-sm text-muted">
          Loading...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`

    return (
      <Navigate
        to={`${ROUTES.LOGIN}?from=${encodeURIComponent(from)}`}
        replace
      />
    )
  }

  if (requiredRight && !hasRight(requiredRight)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return children ?? <Outlet />
}
