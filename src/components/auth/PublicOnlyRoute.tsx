import { Navigate, Outlet } from 'react-router-dom'
import { AsyncState } from '@/components/ui/AsyncState'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/lib/constants'

export function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <AsyncState state="loading" />
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}
