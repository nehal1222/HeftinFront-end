import { APP_NAME } from '@/lib/constants'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-section px-page">
      <p className="text-sm font-medium uppercase tracking-wide text-primary">Heftin Academy</p>
      <h1 className="text-3xl font-semibold text-foreground-strong">{APP_NAME}</h1>
      <p className="text-muted">
        Basic frontend structure is ready. Pull <code className="text-foreground">dev</code>, read{' '}
        <code className="text-foreground">README.md</code> and{' '}
        <code className="text-foreground">AGENTS.md</code>, then create a feature branch. This is an
        e-examination portal (prelims + mains). Full schema and AI add-ons are a team plan.
      </p>
      <Link
        to="/design-system"
        className="w-fit rounded-control bg-primary px-control py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark"
      >
        View design tokens
      </Link>
    </main>
  )
}
