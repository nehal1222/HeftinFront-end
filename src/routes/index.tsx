import { Navigate, Route, Routes } from 'react-router-dom'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ContactPage } from '@/pages/ContactPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OrgAdminPage } from '@/pages/OrgAdminPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { SessionErrorPage } from '@/pages/SessionErrorPage'
import { SignupPage } from '@/pages/SignupPage'
import { SuperAdminPage } from '@/pages/SuperAdminPage'
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
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path="/unified" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="/auth-suite" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="/auth-samples" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="/session-lifecycle" element={<Navigate to={ROUTES.SESSION_ERROR} replace />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      <Route path={ROUTES.REQUEST_ACCESS} element={<SignupPage defaultMode="b2b" />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.SESSION_ERROR} element={<SessionErrorPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.WORKSPACE} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
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
        <Route
          path={ROUTES.SUPER_ADMIN}
          element={
            <ProtectedRoute requiredRight={RIGHTS.PLATFORM_VIEW}>
              <SuperAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORG_ADMIN}
          element={
            <ProtectedRoute requiredRight={RIGHTS.ROLES_VIEW}>
              <OrgAdminPage />
            </ProtectedRoute>
          }
        />
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
