import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AsyncState } from '@/components/ui/AsyncState'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { AppLayout } from '@/layouts/AppLayout'
import { ROUTES } from '@/lib/constants'

type ProtectedRouteProps = {
  allowedPermissions?: string[]
}

export function ProtectedRoute({
  allowedPermissions,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

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
      return (
        <AppLayout>
          <div className="flex flex-col items-center">
            <AsyncState state="forbidden" />
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.DASHBOARD)}
            >
              Go to dashboard
            </Button>
          </div>
        </AppLayout>
      )
    }
  }

  return <Outlet />
}
