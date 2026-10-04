import { AppLayout } from '@/layouts/AppLayout'
import { AppNavigation } from '@/navigation/AppNavigation'

export function RolesPage() {
  return (
    <AppLayout nav={<AppNavigation />}>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold text-foreground-strong">
          Roles
        </h1>

        <p className="mt-2 text-sm text-muted">
          Role management will be implemented in a future task.
        </p>
      </div>
    </AppLayout>
  )
}
