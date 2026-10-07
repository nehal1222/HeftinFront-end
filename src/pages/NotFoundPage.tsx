import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ROUTES } from '@/lib/constants'

export function NotFoundPage() {
  return (
    <AuthLayout>
      <Card className="p-6 text-center">
        <p className="text-sm font-medium text-primary">
          Heftin Academy
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-foreground-strong">
          404
        </h1>

        <p className="mt-2 text-sm text-muted">
          The page you are looking for could not be found.
        </p>

        <div className="mt-6">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center justify-center rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            Go home
          </Link>
        </div>
      </Card>
    </AuthLayout>
  )
}