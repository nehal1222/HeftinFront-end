import { Navigate, Route, Routes } from 'react-router-dom'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { LoginPage } from '@/pages/LoginPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { ROUTES } from '@/lib/constants'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTES.HOME} element={<LoginPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        </Route>
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
      </Route>
      <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  )
}
