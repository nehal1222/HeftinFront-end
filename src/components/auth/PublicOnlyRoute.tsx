import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { getAccessToken } from '@/lib/storage'

export function PublicOnlyRoute() {
  const location = useLocation()
  return getAccessToken()
    ? <Navigate to={{ pathname: ROUTES.DASHBOARD, search: location.search, hash: location.hash }} replace />
    : <Outlet />
}