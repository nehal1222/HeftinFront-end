import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { OnboardingRequestPage } from '@/pages/OnboardingRequestPage'
import { SuperAdminPage } from '@/pages/SuperAdminPage'
import { OrgAdminPage } from '@/pages/OrgAdminPage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ROUTES } from '@/lib/constants'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.REQUEST_ACCESS} element={<OnboardingRequestPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.WORKSPACE} element={<DashboardPage />} />
        <Route path={ROUTES.SUPER_ADMIN} element={<SuperAdminPage />} />
        <Route path={ROUTES.ORG_ADMIN} element={<OrgAdminPage />} />
      </Route>
      <Route path={ROUTES.DESIGN_SYSTEM} element={<DesignSystemPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  )
}
