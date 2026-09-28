import { Card } from '@/components/ui/Card'
import { AppLayout } from '@/layouts/AppLayout'
import { APP_NAME } from '@/lib/constants'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Heftin Academy
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-foreground-strong">
            {APP_NAME}
          </h1>
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-foreground-strong">
            Dashboard
          </h2>

          <p className="mt-2 text-sm text-muted">
            Basic frontend structure is ready. Pull <code className="text-foreground">dev</code>, read{' '}
            <code className="text-foreground">README.md</code> and{' '}
            <code className="text-foreground">AGENTS.md</code>, then create a feature branch. This is an
            e-examination portal (prelims + mains). Full schema and AI add-ons are a team plan.
          </p>

          <Link
            to="/design-system"
            className="mt-4 inline-flex rounded-control bg-primary px-control py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            View design tokens
          </Link>
        </Card>
      </div>
    </AppLayout>
  )
}
