import { Navigate, Route, Routes } from 'react-router-dom'
import { AsyncState } from '@/components/ui/AsyncState'
import { HomePage } from '@/pages/HomePage'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { Phase1Page } from '@/pages/Phase1Page'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { AuthSamplesHubPage } from '@/pages/AuthSamplesHubPage'
import { OnboardingRequestPage } from '@/pages/OnboardingRequestPage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute'
import { ROUTES } from '@/lib/constants'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.REQUEST_ACCESS} element={<OnboardingRequestPage />} />
      <Route path="/auth-samples" element={<AuthSamplesHubPage />} />
      <Route path="/samples" element={<AuthSamplesHubPage />} />
      <Route element={<PublicOnlyRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      </Route>

      {/* Phase 1 Organization & Access-Control Architecture (Design Samples 1-4) */}
      <Route path="/dashboard" element={<Phase1Page />} />
      <Route path="/workspace" element={<Phase1Page />} />
      <Route path="/roles" element={<Phase1Page />} />
      <Route path="/roles/:roleId" element={<Phase1Page />} />
      <Route path="/people" element={<Phase1Page />} />
      <Route path="/departments" element={<Phase1Page />} />
      <Route path="/batches" element={<Phase1Page />} />
      <Route path="/audit" element={<Phase1Page />} />
      <Route path="/organization" element={<Phase1Page />} />
      <Route path="/platform/organizations" element={<Phase1Page />} />
      <Route path="/platform/organizations/:id/rights" element={<Phase1Page />} />
      <Route path="/platform/rights" element={<Phase1Page />} />
      <Route path="/design-samples" element={<Navigate to="/dashboard" replace />} />

      {/* Learning & Exam Practice Studio */}
      <Route
        path="/practice-dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path={ROUTES.DESIGN_SYSTEM} element={<DesignSystemPage />} />
      <Route path="/tokens" element={<DesignSystemPage />} />
      <Route path="/design-tokens" element={<DesignSystemPage />} />
      <Route
        path={ROUTES.NOT_FOUND}
        element={
          <main className="min-h-screen bg-surface px-page py-section">
            <AsyncState state="notFound" />
          </main>
        }
      />
    </Routes>
  )
}

