import { Navigate, Route, Routes } from 'react-router-dom'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { PlatformPage } from '@/pages/PlatformPage'
import { RolesPage } from '@/pages/RolesPage'
import { UsersPage } from '@/pages/UsersPage'
import { ROUTES } from '@/lib/constants'
import { RIGHTS } from '@/lib/rights'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route
          path={ROUTES.USERS}
          element={
            <ProtectedRoute requiredRight={RIGHTS.USERS_VIEW}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ROLES}
          element={
            <ProtectedRoute requiredRight={RIGHTS.ROLES_VIEW}>
              <RolesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PLATFORM}
          element={
            <ProtectedRoute requiredRight={RIGHTS.PLATFORM_VIEW}>
              <PlatformPage />
            </ProtectedRoute>
          }
        />
        <Route path={ROUTES.DESIGN_SYSTEM} element={<DesignSystemPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
