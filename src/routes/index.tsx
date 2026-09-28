import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { ROUTES } from '@/lib/constants'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.DESIGN_SYSTEM} element={<DesignSystemPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  )
}
