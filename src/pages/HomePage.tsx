import { AppLayout } from '@/layouts/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { APP_NAME } from '@/lib/constants'

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
            This is the application shell content area. The shell provides
            navigation, header, profile, and a scrollable content region.
          </p>

          <Button className="mt-4">
            Continue
          </Button>
        </Card>
      </div>
    </AppLayout>
  )
}
