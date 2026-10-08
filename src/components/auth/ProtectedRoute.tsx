import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AsyncState } from '@/components/ui/AsyncState'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/useAuth'
import { AppLayout } from '@/layouts/AppLayout'
import { ROUTES } from '@/lib/constants'
import type { RightCode } from '@/types/auth'

type ProtectedRouteProps = {
  children?: ReactNode
  requiredRight?: RightCode
}

export function ProtectedRoute({ children, requiredRight }: ProtectedRouteProps) {
  const { hasRight, isAuthenticated, isLoading, sessionError } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (isLoading) {
    return <AsyncState state="loading" />
  }

  if (sessionError) {
    return <Navigate to={ROUTES.SESSION_ERROR} replace />
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

  if (requiredRight && !hasRight(requiredRight)) {
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

  return children ?? <Outlet />
}
