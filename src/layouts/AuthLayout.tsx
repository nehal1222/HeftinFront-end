import { Link, Outlet, useLocation } from 'react-router-dom'
import { APP_NAME, ROUTES } from '@/lib/constants'

export function AuthLayout() {
  const { pathname } = useLocation()
  const cardClass = pathname === ROUTES.FORGOT_PASSWORD
    ? 'forgot-password-card'
    : pathname === ROUTES.RESET_PASSWORD
      ? 'reset-password-card'
      : pathname === ROUTES.HOME || pathname === ROUTES.LOGIN
        ? 'login-form-card'
        : ''

  return (
    <main className="login-page">
      <div className="login-background" aria-hidden="true">
        <span className="login-background-circle login-background-circle-one" />
        <span className="login-background-circle login-background-circle-two" />
        <span className="login-background-circle login-background-circle-three" />
      </div>
      <section className={`login-card ${cardClass}`} aria-label={`${APP_NAME} account`}>
        <Link className="login-brand" to={ROUTES.HOME} aria-label={`${APP_NAME} home`}>
          <img className="login-brand-mark" src="/heftin-logo.png" alt="" />
          <span>{APP_NAME}</span>
        </Link>
        <Outlet />
      </section>
    </main>
  )
}