import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { ROUTES } from '@/lib/constants'

export function AppRouter() {
  return (
    <Routes>
      {/* Protected app routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.DASHBOARD} replace />}
        />

        <Route
          path={ROUTES.DASHBOARD}
          element={<HomePage />}
        />

        <Route
          path={ROUTES.DESIGN_SYSTEM}
          element={<DesignSystemPage />}
        />
      </Route>

      {/* Public-only auth routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route
          path={ROUTES.LOGIN}
          element={<LoginPage />}
        />

        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={<ForgotPasswordPage />}
        />

        <Route
          path={ROUTES.RESET_PASSWORD}
          element={<ResetPasswordPage />}
        />
      </Route>

      {/* Unknown routes */}
      <Route
        path={ROUTES.NOT_FOUND}
        element={<Navigate to={ROUTES.DASHBOARD} replace />}
      />
    </Routes>
  )

}
