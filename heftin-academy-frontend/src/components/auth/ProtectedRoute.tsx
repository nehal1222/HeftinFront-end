import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AsyncState } from '@/components/ui/AsyncState'
import { Forbidden } from '@/components/auth/Forbidden'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'
import type { RightCode } from '@/types/auth'
import { hasRight, isPlatformAdmin } from '@/lib/rights'

interface ProtectedRouteProps {
  requiredRight?: RightCode
  platformAdminOnly?: boolean
  permission?: string
  children?: React.ReactNode
}

export function ProtectedRoute({ requiredRight, platformAdminOnly, permission, children }: ProtectedRouteProps) {
  const { isAuthenticated, status, user } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <main className="grid min-h-screen place-items-center bg-surface px-page">
        <AsyncState state="loading" title="Checking your session" />
      </main>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />
  }

  // Check platform admin only routes (e.g. /platform/organizations)
  if (platformAdminOnly && !isPlatformAdmin(user)) {
    return <Forbidden message="This platform administration area is restricted to SuperAdmins." />
  }

  // Check required right
  if (requiredRight && !hasRight(user.rights, requiredRight) && !isPlatformAdmin(user)) {
    return <Forbidden requiredRight={requiredRight} />
  }

  // Legacy permission fallback if needed
  if (
    permission &&
    !user.permissions?.includes(permission as import('@/types/access').PermissionCode) &&
    !user.rights?.includes(permission as RightCode) &&
    !isPlatformAdmin(user)
  ) {
    return <Forbidden requiredRight={permission} />
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
