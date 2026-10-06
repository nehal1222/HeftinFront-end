import { ArrowRight, Building2, GraduationCap, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

export function HomePage() {
  return (
    <main className="min-h-screen bg-surface px-4 py-8 font-sans text-foreground">
      <div className="mx-auto max-w-4xl">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-control bg-primary text-primary-foreground shadow-sm">
              <GraduationCap size={20} aria-hidden="true" />
            </div>
            <span className="font-display text-heading-sm font-semibold text-foreground-strong">
              Heftin Academy
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.REQUEST_ACCESS}
              className="rounded-control border border-border bg-surface-elevated px-3.5 py-1.5 text-caption font-semibold text-foreground-strong hover:border-primary transition-colors"
            >
              Request Access
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="rounded-control bg-primary px-4 py-1.5 text-caption font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Action Hero */}
        <section className="py-12 text-center">
          <span className="text-caption font-semibold uppercase tracking-wider text-primary">
            UPSC Preparation Portal
          </span>
          <h1 className="mt-2 font-display text-heading-lg font-semibold text-foreground-strong">
            Select Your Learning Workspace
          </h1>

          <div className="mx-auto mt-8 grid max-w-2xl gap-5 text-left sm:grid-cols-2">
            {/* Organizational Card */}
            <div className="flex flex-col justify-between rounded-card border border-border bg-surface-elevated p-6 shadow-sm transition-all hover:border-primary">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid size-8 place-items-center rounded-control bg-primary-soft text-primary-dark">
                    <Building2 size={18} />
                  </span>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-caption font-semibold text-muted">
                    Institutions
                  </span>
                </div>

                <h2 className="mt-3 font-display text-heading-xs font-semibold text-foreground-strong">
                  Organizational
                </h2>
                <p className="mt-1 text-caption text-muted">
                  Batch test series, mentor evaluations, and cohort schedules.
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <Link
                    to={`${ROUTES.LOGIN}?role=student`}
                    className="rounded-control border border-border bg-surface px-2.5 py-1 text-caption font-medium text-foreground-strong hover:border-primary hover:text-primary transition-colors"
                  >
                    Student
                  </Link>
                  <Link
                    to={`${ROUTES.LOGIN}?role=faculty`}
                    className="rounded-control border border-border bg-surface px-2.5 py-1 text-caption font-medium text-foreground-strong hover:border-primary hover:text-primary transition-colors"
                  >
                    Faculty
                  </Link>
                  <Link
                    to={`${ROUTES.LOGIN}?role=org_admin`}
                    className="rounded-control border border-border bg-surface px-2.5 py-1 text-caption font-medium text-foreground-strong hover:border-primary hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <Link
                  to={`${ROUTES.LOGIN}?role=student`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-control bg-primary py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
                >
                  Enter Workspace <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Individual Card */}
            <div className="flex flex-col justify-between rounded-card border border-border bg-surface-elevated p-6 shadow-sm transition-all hover:border-primary">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid size-8 place-items-center rounded-control bg-primary-soft text-primary-dark">
                    <User size={18} />
                  </span>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-caption font-semibold text-muted">
                    Self-Paced
                  </span>
                </div>

                <h2 className="mt-3 font-display text-heading-xs font-semibold text-foreground-strong">
                  Individual
                </h2>
                <p className="mt-1 text-caption text-muted">
                  Personal mock drills, study streaks, and performance tracking.
                </p>

                <div className="mt-4">
                  <span className="rounded-control border border-border bg-surface px-2.5 py-1 text-caption font-medium text-foreground-strong">
                    Independent Learner
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <Link
                  to={`${ROUTES.LOGIN}?role=individual`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-control bg-primary py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
                >
                  Enter Workspace <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Clean Footer */}
        <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-caption text-muted sm:flex-row">
          <p>Heftin Academy Platform &copy; 2026</p>
          <div className="flex items-center gap-4">
            <Link to={ROUTES.LOGIN} className="hover:text-primary">
              Sign In
            </Link>
            <Link to={ROUTES.REQUEST_ACCESS} className="hover:text-primary">
              Request Access
            </Link>
            <Link to={ROUTES.FORGOT_PASSWORD} className="hover:text-primary">
              Reset Password
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
