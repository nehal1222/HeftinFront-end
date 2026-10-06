import { ArrowLeft, Building2, CheckCircle2, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

const roles = [
  { name: 'Org Admin', rights: '70 / 70', scope: 'Whole org' },
  { name: 'HOD', rights: '18 / 70', scope: 'Department scoped' },
  { name: 'Faculty Manager', rights: '12 / 70', scope: 'Batch scoped' },
  { name: 'Student', rights: '6 / 70', scope: 'Learner access' },
]

const people = [
  { name: 'Priya Nair', role: 'HOD', department: 'Polity' },
  { name: 'Rohit Mehta', role: 'Faculty', department: 'History' },
  { name: 'Ananya Sharma', role: 'Student', department: 'General Studies' },
]

export function OrgAdminPage() {
  return (
    <main className="min-h-screen bg-surface px-page py-section text-foreground">
      <div className="mx-auto max-w-6xl">
        <Link to={ROUTES.WORKSPACE} className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-primary-dark">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to workspace
        </Link>

        <header className="mt-8 rounded-card border border-border bg-surface-elevated p-card">
          <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">Organization workspace</p>
          <h1 className="mt-2 font-display text-display font-light tracking-tight text-foreground-strong">Org administration</h1>
          <p className="mt-3 max-w-3xl text-body text-muted">
            Manage roles, rights, users, departments, and batches within the organization ceiling defined by the platform.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Departments" value="4" />
          <StatCard label="Batches" value="6" />
          <StatCard label="Faculty" value="12" />
          <StatCard label="Students" value="148" />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-card border border-border bg-surface-elevated p-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Access model</p>
                <h2 className="mt-1 font-display text-heading-md text-foreground-strong">Roles and rights ceiling</h2>
              </div>
              <span className="rounded-full bg-primary-soft px-3 py-1 text-caption font-semibold text-primary-dark">70 of 70</span>
            </div>

            <div className="mt-5 space-y-3">
              {roles.map((role) => (
                <div key={role.name} className="flex items-center justify-between gap-3 rounded-control border border-border bg-surface p-3">
                  <div>
                    <p className="text-body-sm font-semibold text-foreground-strong">{role.name}</p>
                    <p className="mt-1 text-caption text-muted">{role.scope}</p>
                  </div>
                  <span className="rounded-full bg-primary-soft px-2 py-1 text-caption font-semibold text-primary-dark">{role.rights}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-card border border-border bg-surface-elevated p-card">
            <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Org health</p>
            <h2 className="mt-1 font-display text-heading-md text-foreground-strong">Quick controls</h2>
            <div className="mt-5 space-y-3">
              <ControlRow icon={Building2} label="Departments" detail="4 active units" />
              <ControlRow icon={Users} label="User assignments" detail="Manage staff and learners" />
              <ControlRow icon={ShieldCheck} label="Student role" detail="Edit student rights within ceiling" />
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-card border border-border bg-surface-elevated p-card">
          <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">People</p>
          <h2 className="mt-1 font-display text-heading-md text-foreground-strong">Current org directory</h2>
          <div className="mt-5 space-y-3">
            {people.map((person) => (
              <div key={person.name} className="flex flex-col gap-3 rounded-control border border-border bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-body-sm font-semibold text-foreground-strong">{person.name}</p>
                  <p className="mt-1 text-caption text-muted">{person.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary-soft px-2 py-1 text-caption font-semibold text-primary-dark">{person.role}</span>
                  <CheckCircle2 size={15} className="text-primary" aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>
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

function ControlRow({ icon: Icon, label, detail }: { icon: typeof Building2; label: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 rounded-control border border-border bg-surface p-3">
      <span className="grid size-8 place-items-center rounded-control bg-primary-soft text-primary-dark">
        <Icon size={16} aria-hidden="true" />
      </span>
      <div>
        <p className="text-body-sm font-semibold text-foreground-strong">{label}</p>
        <p className="text-caption text-muted">{detail}</p>
      </div>
    </div>
  )
}
