import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'
import { UsersPage } from '@/pages/UsersPage'
import { RolesPage } from '@/pages/RolesPage'
import { PlatformPage } from '@/pages/PlatformPage'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { ROUTES } from '@/lib/constants'
import { RIGHTS } from '@/lib/rights'

export function AppRouter() {
  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={<Navigate to={ROUTES.DASHBOARD} replace />}
      />

      <Route
        path={ROUTES.DASHBOARD}
        element={<HomePage />}
      />

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
          <ProtectedRoute platformAdminOnly>
            <PlatformPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.DESIGN_SYSTEM}
        element={<DesignSystemPage />}
      />

      <Route
        path={ROUTES.LOGIN}
        element={<LoginPage />}
      />

      <Route
        path={ROUTES.NOT_FOUND}
        element={<Navigate to={ROUTES.DASHBOARD} replace />}
      />
    </Routes>
  )
}
