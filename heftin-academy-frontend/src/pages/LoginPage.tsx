import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { PLAN_LABELS, PLAN_OPTIONS, ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_OPTIONS } from '@/lib/access'
import { ROUTES } from '@/lib/constants'
import type { SubscriptionPlan, UserRole } from '@/types/access'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [displayName, setDisplayName] = useState('Ananya Sharma')
  const [email, setEmail] = useState('ananya@example.com')
  const [role, setRole] = useState<UserRole>('student')
  const [plan, setPlan] = useState<SubscriptionPlan>('scholar')

  if (isAuthenticated) return <Navigate to={ROUTES.WORKSPACE} replace />

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    login({ displayName, email, role, plan })
    const destination = (location.state as { from?: string } | null)?.from ?? ROUTES.WORKSPACE
    navigate(destination, { replace: true })
  }

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
          <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">One workspace, many paths</p>
          <h1 className="mt-3 max-w-lg font-display text-display font-light tracking-tight text-foreground-strong">Sign in to the right learning experience.</h1>
          <p className="mt-4 max-w-lg text-body text-muted">Your role, permissions, organization pack, and subscription plan decide which workspaces and microtasks you can see.</p>
          <Link to={ROUTES.HOME} className="mt-8 inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-primary-dark">
            Back to home <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>

        <form onSubmit={submit} className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Demo sign in</p>
            <h2 className="mt-1 font-display text-heading-md text-foreground-strong">Choose an access profile</h2>
            <p className="mt-2 text-body-sm text-muted">Student is the default. Backend authentication can replace this profile selector later.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-body-sm font-medium text-foreground-strong">
              Name
              <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft" />
            </label>
            <label className="block text-body-sm font-medium text-foreground-strong">
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft" />
            </label>
            <fieldset>
              <legend className="text-body-sm font-medium text-foreground-strong">Role and workspace</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {ROLE_OPTIONS.map((option) => {
                  const selected = role === option
                  return <button key={option} type="button" onClick={() => setRole(option)} className={`flex min-h-20 items-start gap-2 rounded-control border p-3 text-left transition-colors ${selected ? 'border-primary bg-primary-soft' : 'border-border bg-surface hover:border-primary-tint-3'}`}><span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border ${selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{selected && <Check size={11} aria-hidden="true" />}</span><span><span className="block text-body-sm font-semibold text-foreground-strong">{ROLE_LABELS[option]}</span><span className="mt-1 block text-caption leading-relaxed text-muted">{ROLE_DESCRIPTIONS[option]}</span></span></button>
                })}
              </div>
            </fieldset>
            <label className="block text-body-sm font-medium text-foreground-strong">
              Subscription plan
              <select value={plan} onChange={(event) => setPlan(event.target.value as SubscriptionPlan)} className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft">
                {PLAN_OPTIONS.map((option) => <option key={option} value={option}>{PLAN_LABELS[option]} plan</option>)}
              </select>
            </label>
          </div>

          <button type="submit" className="mt-7 flex w-full items-center justify-center gap-2 rounded-control bg-primary px-4 py-3 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark">
            Continue to workspace <ArrowRight size={17} aria-hidden="true" />
          </button>
        </form>
      </div>
    </main>
  )
}
