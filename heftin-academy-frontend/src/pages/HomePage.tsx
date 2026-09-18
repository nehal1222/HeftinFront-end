import { APP_NAME, ROUTES } from '@/lib/constants'
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_OPTIONS } from '@/lib/access'
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const highlights = [
  'Front-door onboarding request for prospective client organizations',
  'Role-based access with org ceilings and scoped permissions',
  'Batch operations, exam lifecycle, and AI review controls',
]

export function HomePage() {
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
            <Link to={ROUTES.LOGIN} className="rounded-control border border-border bg-surface-elevated px-4 py-2 text-body-sm font-semibold text-foreground-strong transition-colors hover:border-primary hover:text-primary-dark">
              Sign in
            </Link>
            <Link to={ROUTES.REQUEST_ACCESS} className="rounded-control bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark">
              Request access
            </Link>
          </div>
        </header>

        <section className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">Organization-first architecture</p>
            <h1 className="mt-3 max-w-2xl font-display text-display font-light tracking-tight text-foreground-strong">
              A secure exam platform built for client organizations and their cohorts.
            </h1>
            <p className="mt-5 max-w-xl text-body text-muted">
              This frontend reflects the Phase 1 proposal: onboarding front door, org-level rights ceilings,
              role-based access, and a clear separation between public requests, super admin review, and org-managed work.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={ROUTES.REQUEST_ACCESS} className="inline-flex items-center gap-2 rounded-control bg-primary px-5 py-3 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark">
                Request access for your organization <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-2 rounded-control border border-border bg-surface-elevated px-5 py-3 text-body-sm font-semibold text-foreground-strong transition-colors hover:border-primary hover:text-primary-dark">
                Open demo login
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

          <aside className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm">
            <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Sprint 1 coverage</p>
            <div className="mt-5 space-y-4">
              <FeatureRow icon={Sparkles} title="Onboarding request" description="Prospective clients submit a request; it never creates a login." />
              <FeatureRow icon={LockKeyhole} title="Rights ceiling" description="Super Admin decides the org’s available rights and bundle." />
              <FeatureRow icon={ShieldCheck} title="Scoped roles" description="Dynamic roles, batches, departments, and assignment scopes remain visible only inside the org." />
            </div>
          </aside>
        </section>

        <section className="border-t border-border py-10" aria-labelledby="profiles-heading">
          <div className="max-w-2xl">
            <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">Five access paths</p>
            <h2 id="profiles-heading" className="mt-2 font-display text-heading-lg text-foreground-strong">Choose a profile to preview its workspace.</h2>
            <p className="mt-3 text-body text-muted">Every profile opens the same secure demo login, with the right role selected before you enter the workspace.</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {ROLE_OPTIONS.map((role) => (
              <Link key={role} to={`${ROUTES.LOGIN}?role=${role}`} className="group rounded-card border border-border bg-surface-elevated p-4 transition-colors hover:border-primary hover:bg-primary-soft">
                <p className="text-body-sm font-semibold text-foreground-strong group-hover:text-primary-dark">{ROLE_LABELS[role]}</p>
                <p className="mt-2 text-caption leading-relaxed text-muted">{ROLE_DESCRIPTIONS[role]}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-caption font-semibold text-primary group-hover:text-primary-dark">Preview workspace <ArrowRight size={13} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>
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
