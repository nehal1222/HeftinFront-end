import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Building2, Check, LockKeyhole, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { PLAN_LABELS, ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/lib/access'
import { ROUTES } from '@/lib/constants'
import type { SubscriptionPlan, UserRole } from '@/types/access'

const ORGANIZATIONAL_ROLES: UserRole[] = ['student', 'faculty', 'org_admin', 'super_admin']
const INDIVIDUAL_ROLES: UserRole[] = ['individual']

const INDIVIDUAL_PLANS: SubscriptionPlan[] = ['free', 'scholar', 'pro']
const ORGANIZATIONAL_PLANS: SubscriptionPlan[] = ['institution', 'pro']

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const requestedRole = searchParams.get('role') as UserRole
  const initialCategory = requestedRole === 'individual' ? 'individual' : 'organizational'

  const [category, setCategory] = useState<'organizational' | 'individual'>(initialCategory)
  const [role, setRole] = useState<UserRole>(() => {
    if (requestedRole && (ORGANIZATIONAL_ROLES.includes(requestedRole) || INDIVIDUAL_ROLES.includes(requestedRole))) {
      return requestedRole
    }
    return 'student'
  })
  const [displayName, setDisplayName] = useState(() => (role === 'individual' ? 'Ananya Sharma' : 'Arjun Kumar'))
  const [email, setEmail] = useState(() => (role === 'individual' ? 'ananya.learner@gmail.com' : 'student@dpa.edu'))
  const [password, setPassword] = useState('••••••••')
  const [plan, setPlan] = useState<SubscriptionPlan>(() => (category === 'individual' ? 'scholar' : 'institution'))

  if (isAuthenticated) return <Navigate to={ROUTES.WORKSPACE} replace />

  function handleCategorySwitch(nextCategory: 'organizational' | 'individual') {
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

  function handleRoleSelect(selectedRole: UserRole) {
    setRole(selectedRole)
    if (selectedRole === 'student') {
      setDisplayName('Arjun Kumar')
      setEmail('student@dpa.edu')
    } else if (selectedRole === 'faculty') {
      setDisplayName('Dr. Meera Patel')
      setEmail('dr.meera@dpa.edu')
    } else if (selectedRole === 'org_admin') {
      setDisplayName('Vikram Malhotra')
      setEmail('admin@dpa.edu')
    } else if (selectedRole === 'super_admin') {
      setDisplayName('Heftin Platform Lead')
      setEmail('lead@heftin.com')
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    login({ displayName, email, role, plan, password })
    const destination = (location.state as { from?: string } | null)?.from ?? ROUTES.WORKSPACE
    navigate(destination, { replace: true })
  }

  const currentRoles = category === 'organizational' ? ORGANIZATIONAL_ROLES : INDIVIDUAL_ROLES
  const currentPlans = category === 'organizational' ? ORGANIZATIONAL_PLANS : INDIVIDUAL_PLANS

  return (
    <main className="min-h-screen bg-surface px-page py-section font-sans text-foreground">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <div className="mb-8 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-control bg-primary text-primary-foreground">
              <ShieldCheck size={21} aria-hidden="true" />
            </div>
            <span className="font-display text-heading-sm text-foreground-strong">Heftin Academy</span>
          </div>

          <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">Two Access Categories</p>
          <h1 className="mt-3 max-w-lg font-display text-display font-light tracking-tight text-foreground-strong">
            Sign in to your learning workspace.
          </h1>
          <p className="mt-4 max-w-lg text-body text-muted">
            Heftin supports both institutional academy operations and dedicated self-paced individual learners.
          </p>

          <div className="mt-8 space-y-3">
            <div className="rounded-card border border-border bg-surface-elevated p-4">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-primary" aria-hidden="true" />
                <span className="text-body-sm font-semibold text-foreground-strong">Organizational Category</span>
              </div>
              <p className="mt-1 text-caption text-muted">
                Cohort batches, faculty grading, institutional ceilings, and admin privileges.
              </p>
            </div>

            <div className="rounded-card border border-border bg-surface-elevated p-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-primary" aria-hidden="true" />
                <span className="text-body-sm font-semibold text-foreground-strong">Individual Category</span>
              </div>
              <p className="mt-1 text-caption text-muted">
                Self-paced learning, personal test series drills, and individual subscription tiers.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-primary-dark">
              Back to home <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to={ROUTES.REQUEST_ACCESS} className="inline-flex items-center gap-2 text-body-sm font-semibold text-muted hover:text-primary">
              Need organizational access? Request onboarding
            </Link>
          </div>
        </section>

        <form onSubmit={submit} className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Authentication Portal</p>
            <h2 className="mt-1 font-display text-heading-md text-foreground-strong">Select account category</h2>
            <p className="mt-2 text-body-sm text-muted">Choose between organizational and individual access.</p>
          </div>

          {/* TWO CATEGORIES SWITCHER */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-control border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => handleCategorySwitch('organizational')}
              className={`flex items-center justify-center gap-2 rounded-control px-3 py-2.5 text-body-sm font-semibold transition-colors ${
                category === 'organizational'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:bg-primary-soft hover:text-primary-dark'
              }`}
            >
              <Building2 size={16} aria-hidden="true" />
              Organizational
            </button>
            <button
              type="button"
              onClick={() => handleCategorySwitch('individual')}
              className={`flex items-center justify-center gap-2 rounded-control px-3 py-2.5 text-body-sm font-semibold transition-colors ${
                category === 'individual'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:bg-primary-soft hover:text-primary-dark'
              }`}
            >
              <User size={16} aria-hidden="true" />
              Individual
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-body-sm font-medium text-foreground-strong">
              Name
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                required
                className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
              />
            </label>

            <label className="block text-body-sm font-medium text-foreground-strong">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
              />
            </label>

            <label className="block text-body-sm font-medium text-foreground-strong">
              <div className="flex items-center justify-between">
                <span>Password</span>
                <Link to={ROUTES.FORGOT_PASSWORD} className="text-caption font-semibold text-primary hover:text-primary-dark">
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                  <LockKeyhole size={15} aria-hidden="true" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-control border border-border bg-surface py-2.5 pl-9 pr-3 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                />
              </div>
            </label>

            <fieldset>
              <legend className="text-body-sm font-medium text-foreground-strong">
                {category === 'organizational' ? 'Organizational role' : 'Individual profile'}
              </legend>
              <div className={`mt-2 grid gap-2 ${category === 'organizational' ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                {currentRoles.map((option) => {
                  const selected = role === option
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleRoleSelect(option)}
                      className={`flex min-h-20 items-start gap-2 rounded-control border p-3 text-left transition-colors ${
                        selected
                          ? 'border-primary bg-primary-soft'
                          : 'border-border bg-surface hover:border-primary-tint-3'
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border ${
                          selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                        }`}
                      >
                        {selected && <Check size={11} aria-hidden="true" />}
                      </span>
                      <span>
                        <span className="block text-body-sm font-semibold text-foreground-strong">
                          {ROLE_LABELS[option]}
                        </span>
                        <span className="mt-1 block text-caption leading-relaxed text-muted">
                          {ROLE_DESCRIPTIONS[option]}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <label className="block text-body-sm font-medium text-foreground-strong">
              Subscription plan
              <select
                value={plan}
                onChange={(event) => setPlan(event.target.value as SubscriptionPlan)}
                className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
              >
                {currentPlans.map((option) => (
                  <option key={option} value={option}>
                    {PLAN_LABELS[option]} plan
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-control bg-primary px-4 py-3 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            Continue to workspace <ArrowRight size={17} aria-hidden="true" />
          </button>
        </form>
      </div>
    </main>
  )
}
