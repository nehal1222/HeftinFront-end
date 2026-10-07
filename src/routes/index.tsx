import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { SessionErrorPage } from '@/pages/SessionErrorPage'
import { OnboardingRequestPage } from '@/pages/OnboardingRequestPage'
import { SuperAdminPage } from '@/pages/SuperAdminPage'
import { OrgAdminPage } from '@/pages/OrgAdminPage'
import { UnifiedAuthSuitePage } from '@/pages/UnifiedAuthSuitePage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ROUTES } from '@/lib/constants'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path="/unified" element={<UnifiedAuthSuitePage />} />
      <Route path="/auth-suite" element={<UnifiedAuthSuitePage />} />
      <Route path="/auth-samples" element={<UnifiedAuthSuitePage />} />
      <Route path="/session-lifecycle" element={<UnifiedAuthSuitePage />} />
      <Route path={ROUTES.REQUEST_ACCESS} element={<OnboardingRequestPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      <Route path={ROUTES.SESSION_ERROR} element={<SessionErrorPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.WORKSPACE} element={<DashboardPage />} />
        <Route path={ROUTES.DASHBOARD} element={<Navigate to={ROUTES.WORKSPACE} replace />} />
        <Route path={ROUTES.SUPER_ADMIN} element={<SuperAdminPage />} />
        <Route path={ROUTES.ORG_ADMIN} element={<OrgAdminPage />} />
      </Route>
      <Route path={ROUTES.DESIGN_SYSTEM} element={<DesignSystemPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  )
}
