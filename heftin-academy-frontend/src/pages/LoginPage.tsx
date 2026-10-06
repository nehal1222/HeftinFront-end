import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Building2, Eye, EyeOff, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import type { SubscriptionPlan, UserRole } from '@/types/access'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const requestedRole = searchParams.get('role') as UserRole
  const initialCategory = requestedRole === 'individual' ? 'individual' : 'organizational'

  const [category, setCategory] = useState<'organizational' | 'individual'>(initialCategory)
  const [role, setRole] = useState<UserRole>(() => {
    if (requestedRole && ['student', 'faculty', 'org_admin', 'super_admin', 'individual'].includes(requestedRole)) {
      return requestedRole
    }
    return 'student'
  })
  const [displayName, setDisplayName] = useState(() => (role === 'individual' ? 'Ananya Sharma' : 'Arjun Kumar'))
  const [email, setEmail] = useState(() => (role === 'individual' ? 'ananya.learner@gmail.com' : 'student@dpa.edu'))
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [plan, setPlan] = useState<SubscriptionPlan>(() => (category === 'individual' ? 'scholar' : 'institution'))
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to={ROUTES.WORKSPACE} replace />

  function switchCategory(nextCategory: 'organizational' | 'individual') {
    setCategory(nextCategory)
    if (nextCategory === 'individual') {
      setRole('individual')
      setDisplayName('Ananya Sharma')
      setEmail('ananya.learner@gmail.com')
      setPlan('scholar')
    } else {
      setRole('student')
      setDisplayName('Arjun Kumar')
      setEmail('student@dpa.edu')
      setPlan('institution')
    }
  }

  function pickDemoRole(selectedRole: UserRole) {
    setRole(selectedRole)
    if (selectedRole === 'student') {
      setDisplayName('Arjun Kumar')
      setEmail('student@dpa.edu')
      setPlan('institution')
    } else if (selectedRole === 'faculty') {
      setDisplayName('Dr. Meera Patel')
      setEmail('dr.meera@dpa.edu')
      setPlan('institution')
    } else if (selectedRole === 'org_admin') {
      setDisplayName('Vikram Malhotra')
      setEmail('admin@dpa.edu')
      setPlan('institution')
    } else if (selectedRole === 'super_admin') {
      setDisplayName('Platform Administrator')
      setEmail('lead@heftin.com')
      setPlan('pro')
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    try {
      await login({ displayName, email, role, plan, password })
      const destination = (location.state as { from?: string } | null)?.from ?? ROUTES.WORKSPACE
      navigate(destination, { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-12 text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 grid size-12 place-items-center rounded-control bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck size={26} aria-hidden="true" />
          </div>
          <h1 className="font-display text-heading-md text-foreground-strong">Heftin Academy</h1>
          <p className="mt-1 text-body-sm text-muted">Sign in to your learning dashboard</p>
        </div>

        <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
          {/* Segmented Category Switcher */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-control border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => switchCategory('organizational')}
              className={`flex items-center justify-center gap-2 rounded-control py-2 text-body-sm font-semibold transition-colors ${
                category === 'organizational'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Building2 size={15} aria-hidden="true" />
              Organizational
            </button>
            <button
              type="button"
              onClick={() => switchCategory('individual')}
              className={`flex items-center justify-center gap-2 rounded-control py-2 text-body-sm font-semibold transition-colors ${
                category === 'individual'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <User size={15} aria-hidden="true" />
              Individual
            </button>
          </div>

          {/* Quick Account Fill */}
          <div className="mb-5 rounded-control border border-border bg-surface p-3">
            <span className="text-caption font-semibold uppercase tracking-wider text-muted">
              {category === 'organizational' ? 'Quick Switch Role:' : 'Account Profile:'}
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {category === 'organizational' ? (
                <>
                  <button
                    type="button"
                    onClick={() => pickDemoRole('student')}
                    className={`rounded-control px-2.5 py-1 text-caption font-semibold transition-colors ${
                      role === 'student' ? 'bg-primary text-primary-foreground' : 'border border-border text-muted hover:text-foreground'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => pickDemoRole('faculty')}
                    className={`rounded-control px-2.5 py-1 text-caption font-semibold transition-colors ${
                      role === 'faculty' ? 'bg-primary text-primary-foreground' : 'border border-border text-muted hover:text-foreground'
                    }`}
                  >
                    Faculty
                  </button>
                  <button
                    type="button"
                    onClick={() => pickDemoRole('org_admin')}
                    className={`rounded-control px-2.5 py-1 text-caption font-semibold transition-colors ${
                      role === 'org_admin' ? 'bg-primary text-primary-foreground' : 'border border-border text-muted hover:text-foreground'
                    }`}
                  >
                    Org Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => pickDemoRole('super_admin')}
                    className={`rounded-control px-2.5 py-1 text-caption font-semibold transition-colors ${
                      role === 'super_admin' ? 'bg-primary text-primary-foreground' : 'border border-border text-muted hover:text-foreground'
                    }`}
                  >
                    Platform Admin
                  </button>
                </>
              ) : (
                <span className="text-body-sm font-medium text-foreground-strong">
                  Personal Learner · Ananya Sharma
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-body-sm font-medium text-foreground-strong">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-body-sm font-medium text-foreground-strong">
                  Password
                </label>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-caption font-semibold text-primary hover:text-primary-dark"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-control border border-border bg-surface py-2.5 pl-3 pr-10 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center text-caption text-muted">
            <Link to={ROUTES.REQUEST_ACCESS} className="hover:text-primary">
              Need institutional access? Request onboarding
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to={ROUTES.HOME} className="text-caption font-semibold text-muted hover:text-primary">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
