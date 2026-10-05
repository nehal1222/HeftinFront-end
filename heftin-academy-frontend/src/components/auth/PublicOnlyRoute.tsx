import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AsyncState } from '@/components/ui/AsyncState'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

export function PublicOnlyRoute() {
  const { isAuthenticated, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <main className="grid min-h-screen place-items-center bg-surface px-page"><AsyncState state="loading" title="Checking your session" /></main>
  }

  if (isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={from ?? ROUTES.WORKSPACE} replace />
  }
  return <Outlet />
}