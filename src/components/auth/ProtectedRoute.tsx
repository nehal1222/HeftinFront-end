import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { getAccessToken } from '@/lib/storage'

export function ProtectedRoute() {
  const location = useLocation()
  const accessToken = getAccessToken()

  if (!accessToken) {
    const returnUrl = `${location.pathname}${location.search}${location.hash}`

    return (
      <Navigate
        to={`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`}
        replace
      />
    )
  }

  return <Outlet />
}