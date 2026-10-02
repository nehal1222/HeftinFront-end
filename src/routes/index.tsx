
import { Navigate, Route, Routes } from 'react-router-dom'
import { AsyncState } from '@/components/ui/AsyncState'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { ROUTES } from '@/lib/constants'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route element={<PublicOnlyRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute requiredRight="users.view" scopeAwareList />}>
        <Route path={ROUTES.PEOPLE} element={<DashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute requiredRight="roles.view" />}>
        <Route path={ROUTES.ROLES} element={<DashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute requiredRight="departments.view" scopeAwareList />}>
        <Route path={ROUTES.DEPARTMENTS} element={<DashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute requiredRight="batches.view" scopeAwareList />}>
        <Route path={ROUTES.BATCHES} element={<DashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute requiredRight="audit.view" />}>
        <Route path={ROUTES.AUDIT} element={<DashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute platformAdminOnly />}>
        <Route path={ROUTES.PLATFORM_ORGANIZATIONS} element={<DashboardPage />} />
        <Route path={`${ROUTES.PLATFORM_ORGANIZATIONS}/:organizationId/rights`} element={<DashboardPage />} />
        <Route path={ROUTES.PLATFORM_RIGHTS} element={<DashboardPage />} />
      </Route>
      <Route path={ROUTES.DESIGN_SYSTEM} element={<DesignSystemPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<main className="grid min-h-screen place-items-center bg-surface px-page"><AsyncState state="notFound" /></main>} />
    </Routes>
  )
}

