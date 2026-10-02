import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AsyncState } from '@/components/ui/AsyncState'
import { Forbidden } from '@/components/auth/Forbidden'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import type { RightCode } from '@/types/auth'

type ProtectedRouteProps = {
  requiredRight?: RightCode
  scopeAwareList?: boolean
  platformAdminOnly?: boolean
  children?: ReactNode
}

export function ProtectedRoute({ requiredRight, scopeAwareList = false, platformAdminOnly = false, children }: ProtectedRouteProps) {
  const { profile, status, hasRight } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <main className="grid min-h-screen place-items-center bg-surface px-page"><AsyncState state="loading" title="Loading access..." description="Restoring your Phase 1 session." /></main>
  }

  if (status !== 'authenticated' || !profile) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />
  }

  const rightDenied = Boolean(requiredRight && !profile.is_platform_admin && !hasRight(requiredRight))
  const scopeDenied = scopeAwareList && !profile.is_platform_admin && profile.scopes.length === 0 && profile.role !== 'org_admin'
  if (platformAdminOnly ? !profile.is_platform_admin : rightDenied || scopeDenied) {
    return <Forbidden />
  }

  return children ? <>{children}</> : <Outlet />
}