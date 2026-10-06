import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
