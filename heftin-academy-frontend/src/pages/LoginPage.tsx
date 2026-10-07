import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Building2, Eye, EyeOff, GraduationCap, User } from 'lucide-react'
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

  function pickRole(selectedRole: UserRole) {
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
      setDisplayName('Platform Admin')
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
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8 text-foreground font-sans">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-control bg-primary text-primary-foreground shadow-sm">
            <GraduationCap size={20} aria-hidden="true" />
          </div>
          <span className="font-display text-heading-sm font-semibold text-foreground-strong">
            Heftin Academy
          </span>
        </div>

        <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm">
          <h1 className="font-display text-heading-sm font-semibold text-foreground-strong">
            Sign In
          </h1>

          {/* Category Toggle */}
          <div className="mt-4">
            <span className="block text-caption font-semibold text-muted uppercase tracking-wider">
              Category
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-control border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => switchCategory('organizational')}
                className={`flex items-center justify-center gap-1.5 rounded-control py-1.5 text-caption font-semibold transition-colors ${
                  category === 'organizational'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <Building2 size={13} aria-hidden="true" />
                Organizational
              </button>
              <button
                type="button"
                onClick={() => switchCategory('individual')}
                className={`flex items-center justify-center gap-1.5 rounded-control py-1.5 text-caption font-semibold transition-colors ${
                  category === 'individual'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <User size={13} aria-hidden="true" />
                Individual
              </button>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="mt-4">
            <span className="block text-caption font-semibold text-muted uppercase tracking-wider">
              {category === 'organizational' ? 'Role' : 'Profile'}
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {category === 'organizational' ? (
                <>
                  <button
                    type="button"
                    onClick={() => pickRole('student')}
                    className={`rounded-control px-2.5 py-1 text-caption font-medium transition-colors ${
                      role === 'student'
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'border border-border bg-surface text-muted hover:text-foreground'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => pickRole('faculty')}
                    className={`rounded-control px-2.5 py-1 text-caption font-medium transition-colors ${
                      role === 'faculty'
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'border border-border bg-surface text-muted hover:text-foreground'
                    }`}
                  >
                    Faculty
                  </button>
                  <button
                    type="button"
                    onClick={() => pickRole('org_admin')}
                    className={`rounded-control px-2.5 py-1 text-caption font-medium transition-colors ${
                      role === 'org_admin'
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'border border-border bg-surface text-muted hover:text-foreground'
                    }`}
                  >
                    Admin
                  </button>
                </>
              ) : (
                <span className="rounded-control border border-border bg-surface px-2.5 py-1 text-caption font-medium text-foreground-strong">
                  Personal Learner
                </span>
              )}
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <div>
              <label htmlFor="login-email" className="block text-caption font-semibold text-foreground-strong">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-caption font-semibold text-foreground-strong">
                  Password
                </label>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-caption font-medium text-primary hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative mt-1">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-control border border-border bg-surface py-2 pl-3 pr-9 text-body-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </form>

          <div className="mt-5 border-t border-border pt-3 text-center">
            <Link
              to={ROUTES.REQUEST_ACCESS}
              className="text-caption font-medium text-muted hover:text-primary transition-colors"
            >
              Request Institutional Onboarding
            </Link>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-center">
          <Link
            to={ROUTES.HOME}
            className="text-caption font-medium text-muted hover:text-foreground"
          >
            Back to Home
          </Link>
          <span className="text-muted text-caption">&middot;</span>
          <Link
            to="/unified"
            className="text-caption font-semibold text-primary hover:underline"
          >
            All-in-One Suite &rarr;
          </Link>
        </div>
      </div>
    </main>
  )
}
