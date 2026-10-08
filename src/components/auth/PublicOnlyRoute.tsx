import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/useAuth'
import { ROUTES } from '@/lib/constants'

export function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth()
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

  if (isAuthenticated) {
    return (
      <Navigate
        to={{ pathname: ROUTES.DASHBOARD, search: location.search, hash: location.hash }}
        replace
      />
    )
  }

  return <Outlet />
}
