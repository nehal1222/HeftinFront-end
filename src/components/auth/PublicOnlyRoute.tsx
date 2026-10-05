import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { getAccessToken } from '@/lib/storage'

export function PublicOnlyRoute() {
  return getAccessToken() ? <Navigate to={ROUTES.HOME} replace /> : <Outlet />
}