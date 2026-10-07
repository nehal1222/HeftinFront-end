import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AsyncState } from '@/components/ui/AsyncState'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/lib/constants'

type ProtectedRouteProps = {
  allowedPermissions?: string[]
}

export function ProtectedRoute({
  allowedPermissions,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <AsyncState state="loading" />
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`

    return (
      <Navigate
        to={`${ROUTES.LOGIN}?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    )
  }

  if (allowedPermissions?.length) {
    const rights = Array.isArray(
      (user as { rights?: unknown } | null)?.rights,
    )
      ? ((user as { rights: unknown[] }).rights as string[])
      : []

    const hasRequiredRight = allowedPermissions.some((right) =>
      rights.includes(right),
    )

    if (!hasRequiredRight) {
      return <AsyncState state="forbidden" />
    }
  }

  return <Outlet />
}