import { ArrowLeft, Clock3, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

const requests = [
  { org: 'Apex Coaching', city: 'Delhi', exam: 'UPSC', status: 'new', note: 'Request from founder for 1,200 learners' },
  { org: 'Sarthi Institute', city: 'Lucknow', exam: 'SSC', status: 'in_review', note: 'Bundle review pending' },
  { org: 'Dharma Academy', city: 'Bengaluru', exam: 'NEET', status: 'approved', note: 'Org admin created and rights granted' },
]

export function SuperAdminPage() {
  return (
    <main className="min-h-screen bg-surface px-page py-section text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3">
          <Link to={ROUTES.WORKSPACE} className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-primary-dark">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to workspace
          </Link>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-caption font-semibold text-primary-dark">Heftin Super Admin</span>
        </div>

        <header className="mt-8 rounded-card border border-border bg-surface-elevated p-card">
          <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">Platform control</p>
          <h1 className="mt-2 font-display text-display font-light tracking-tight text-foreground-strong">Onboarding queue</h1>
          <p className="mt-3 max-w-3xl text-body text-muted">
            Review new org requests, approve the account, create the org admin, and grant rights from the platform ceiling.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Pending" value="3" />
          <StatCard label="Approved this week" value="12" />
          <StatCard label="Active orgs" value="42" />
        </section>

        <section className="mt-8 rounded-card border border-border bg-surface-elevated p-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Queue</p>
              <h2 className="mt-1 font-display text-heading-md text-foreground-strong">New organization requests</h2>
            </div>
            <button type="button" className="rounded-control bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark">
              Approve selected
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {requests.map((request) => (
              <article key={request.org} className="rounded-control border border-border bg-surface p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 grid size-10 place-items-center rounded-control bg-primary-soft text-primary-dark">
                      <Users size={17} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-body-sm font-semibold text-foreground-strong">{request.org}</p>
                      <p className="mt-1 text-caption text-muted">{request.city} • {request.exam}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusPill label={request.status} />
                    <button type="button" className="rounded-control border border-border bg-surface-elevated px-3 py-2 text-caption font-semibold text-foreground-strong hover:border-primary hover:text-primary-dark">
                      Review
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 rounded-control border border-border bg-surface-elevated px-3 py-2">
                  <p className="text-caption text-muted">{request.note}</p>
                  <div className="flex items-center gap-2 text-caption text-muted">
                    <Clock3 size={14} aria-hidden="true" />
                    1h ago
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <article className="rounded-card border border-border bg-surface-elevated p-card">
            <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Platform setup</p>
            <h2 className="mt-1 font-display text-heading-md text-foreground-strong">Rights catalog</h2>
            <div className="mt-5 space-y-3">
              {['users.manage', 'roles.manage', 'tests.schedule', 'evaluations.review', 'reports.export'].map((right) => (
                <div key={right} className="flex items-center justify-between gap-3 rounded-control border border-border bg-surface p-3">
                  <span className="text-body-sm font-medium text-foreground-strong">{right}</span>
                  <span className="rounded-full bg-primary-soft px-2 py-1 text-caption font-semibold text-primary-dark">Active</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-card border border-border bg-surface-elevated p-card">
            <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Approval flow</p>
            <h2 className="mt-1 font-display text-heading-md text-foreground-strong">Create org + org admin</h2>
            <div className="mt-5 space-y-4">
              <Step label="1" title="Review request" text="Validate org profile and expected student volume." />
              <Step label="2" title="Create org account" text="Create the tenant root and organization record." />
              <Step label="3" title="Grant bundle" text="Apply the standard rights ceiling and assign the Org Admin." />
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-surface-elevated p-card">
      <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 font-display text-heading-lg text-foreground-strong">{value}</p>
    </div>
  )
}

function StatusPill({ label }: { label: string }) {
  const tone = label === 'approved' ? 'bg-primary-soft text-primary-dark' : label === 'in_review' ? 'bg-primary-soft text-primary-dark' : 'bg-amber-100 text-amber-800'
  return <span className={`rounded-full px-2 py-1 text-caption font-semibold ${tone}`}>{label}</span>
}

function Step({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-control border border-border bg-surface p-3">
      <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground text-body-sm font-semibold">{label}</span>
      <div>
        <p className="text-body-sm font-semibold text-foreground-strong">{title}</p>
        <p className="mt-1 text-caption text-muted">{text}</p>
      </div>
    </div>
  )
}
