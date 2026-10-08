import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { getAccessToken } from '@/lib/storage'

export function ProtectedRoute() {
  const location = useLocation()
  return getAccessToken()
    ? <Outlet />
    : <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
}
