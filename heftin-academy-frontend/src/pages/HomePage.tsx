import { useState } from 'react'
import { APP_NAME, ROUTES } from '@/lib/constants'
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/lib/access'
import { ArrowRight, Building2, CheckCircle2, LockKeyhole, ShieldCheck, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { UserRole } from '@/types/access'

const ORGANIZATIONAL_ROLES: UserRole[] = ['student', 'faculty', 'org_admin', 'super_admin']
const INDIVIDUAL_ROLES: UserRole[] = ['individual']

const highlights = [
  'Front-door onboarding request for prospective client organizations',
  'Two clear categories: Organizational (cohorts, batches, ceilings) and Individual (self-paced)',
  'Role-based access with org ceilings, scoped permissions, and live auth endpoint wiring',
]

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'organizational' | 'individual'>('all')

  const visibleRoles =
    activeCategory === 'all'
      ? [...ORGANIZATIONAL_ROLES, ...INDIVIDUAL_ROLES]
      : activeCategory === 'organizational'
      ? ORGANIZATIONAL_ROLES
      : INDIVIDUAL_ROLES

  return (
    <main className="min-h-screen bg-surface px-page py-section text-foreground">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-control bg-primary text-primary-foreground">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">Heftin Academy</p>
              <p className="font-display text-heading-sm text-foreground-strong">{APP_NAME}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.DESIGN_SYSTEM}
              className="text-body-sm font-semibold text-muted transition-colors hover:text-primary"
            >
              Design tokens
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="rounded-control border border-border bg-surface-elevated px-4 py-2 text-body-sm font-semibold text-foreground-strong transition-colors hover:border-primary hover:text-primary-dark"
            >
              Sign in
            </Link>
            <Link
              to={ROUTES.REQUEST_ACCESS}
              className="rounded-control bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              Request access
            </Link>
          </div>
        </header>

        <section className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">Two Dedicated Categories</p>
            <h1 className="mt-3 max-w-2xl font-display text-display font-light tracking-tight text-foreground-strong">
              A secure exam platform built for institutions, cohorts, and individual learners.
            </h1>
            <p className="mt-5 max-w-xl text-body text-muted">
              Heftin unifies organizational learning operations (cohort batches, faculty grading, admin ceiling enforcement)
              with dedicated self-paced individual test prep in one coherent ecosystem.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`${ROUTES.LOGIN}?role=student`}
                className="inline-flex items-center gap-2 rounded-control bg-primary px-5 py-3 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
              >
                Sign in to workspace <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                to={ROUTES.REQUEST_ACCESS}
                className="inline-flex items-center gap-2 rounded-control border border-border bg-surface-elevated px-5 py-3 text-body-sm font-semibold text-foreground-strong transition-colors hover:border-primary hover:text-primary-dark"
              >
                Request organizational access
              </Link>
            </div>

            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body-sm text-foreground-strong">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-4 rounded-card border border-border bg-surface-elevated p-6 shadow-sm">
            <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Categories Overview</p>

            <div className="rounded-control border border-border bg-surface p-4">
              <div className="flex items-center gap-2 text-body-sm font-semibold text-foreground-strong">
                <Building2 size={16} className="text-primary" aria-hidden="true" />
                Organizational Category
              </div>
              <p className="mt-1 text-caption text-muted">
                Institutions, coaching academies, batches, faculty paper evaluations, and organizational entitlement limits.
              </p>
            </div>

            <div className="rounded-control border border-border bg-surface p-4">
              <div className="flex items-center gap-2 text-body-sm font-semibold text-foreground-strong">
                <User size={16} className="text-primary" aria-hidden="true" />
                Individual Category
              </div>
              <p className="mt-1 text-caption text-muted">
                Self-paced learning, personal test series drills, progress tracking, and individual tier plans.
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <FeatureRow
                icon={LockKeyhole}
                title="Server-Authoritative Auth"
                description="Token exchange and rights computation verified without client-side assumptions."
              />
            </div>
          </aside>
        </section>

        {/* ACCESS PROFILES WITH 2 CATEGORY FILTER */}
        <section className="border-t border-border py-10" aria-labelledby="profiles-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">Access Categories</p>
              <h2 id="profiles-heading" className="mt-2 font-display text-heading-lg text-foreground-strong">
                Choose a profile to preview its workspace.
              </h2>
              <p className="mt-2 text-body text-muted">
                Every profile opens the authenticated dashboard shell with scoped permissions and capabilities.
              </p>
            </div>

            <div className="inline-flex rounded-control border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`rounded-control px-3 py-1.5 text-caption font-semibold transition-colors ${
                  activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted hover:text-foreground'
                }`}
              >
                All (5)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('organizational')}
                className={`flex items-center gap-1.5 rounded-control px-3 py-1.5 text-caption font-semibold transition-colors ${
                  activeCategory === 'organizational'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <Building2 size={13} aria-hidden="true" />
                Organizational (4)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('individual')}
                className={`flex items-center gap-1.5 rounded-control px-3 py-1.5 text-caption font-semibold transition-colors ${
                  activeCategory === 'individual'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <User size={13} aria-hidden="true" />
                Individual (1)
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {visibleRoles.map((role) => {
              const isInd = role === 'individual'
              return (
                <Link
                  key={role}
                  to={`${ROUTES.LOGIN}?role=${role}`}
                  className="group rounded-card border border-border bg-surface-elevated p-4 transition-colors hover:border-primary hover:bg-primary-soft"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-surface px-2.5 py-0.5 text-eyebrow font-bold uppercase text-muted">
                      {isInd ? 'Individual' : 'Organizational'}
                    </span>
                    {isInd ? (
                      <User size={15} className="text-primary" aria-hidden="true" />
                    ) : (
                      <Building2 size={15} className="text-primary" aria-hidden="true" />
                    )}
                  </div>
                  <p className="mt-3 text-body-sm font-semibold text-foreground-strong group-hover:text-primary-dark">
                    {ROLE_LABELS[role]}
                  </p>
                  <p className="mt-2 text-caption leading-relaxed text-muted">{ROLE_DESCRIPTIONS[role]}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-caption font-semibold text-primary group-hover:text-primary-dark">
                    Preview workspace <ArrowRight size={13} aria-hidden="true" />
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* FOOTER NAVIGATION */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-caption text-muted sm:flex-row">
          <p>Heftin Academy Platform &copy; 2026. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to={ROUTES.DESIGN_SYSTEM} className="hover:text-primary">
              Design tokens
            </Link>
            <Link to={ROUTES.REQUEST_ACCESS} className="hover:text-primary">
              Request onboarding
            </Link>
            <Link to={ROUTES.FORGOT_PASSWORD} className="hover:text-primary">
              Password recovery
            </Link>
            <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}

function FeatureRow({ icon: Icon, title, description }: { icon: typeof ShieldCheck; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-control border border-border bg-surface p-3">
      <span className="mt-0.5 grid size-8 place-items-center rounded-control bg-primary-soft text-primary-dark">
        <Icon size={16} aria-hidden="true" />
      </span>
      <div>
        <p className="text-body-sm font-semibold text-foreground-strong">{title}</p>
        <p className="mt-1 text-caption text-muted">{description}</p>
      </div>
    </div>
  )
}
