import { useAuth } from '@/contexts/useAuth'
import { AppLayout } from '@/layouts/AppLayout'
import { APP_NAME } from '@/lib/constants'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <AppLayout>
      <section className="mx-auto flex min-h-full max-w-5xl flex-col rounded-3xl border border-border bg-card p-8 shadow-xl sm:p-12">
        <div className="flex flex-1 flex-col justify-center py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Dashboard</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Welcome, {user?.full_name || 'User'}
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Your Heftin Academy account is ready. Your learning workspace will appear here.
          </p>
          <p className="mt-6 text-sm font-medium text-primary">{APP_NAME}</p>
        </div>
      </section>
    </AppLayout>
  )
}
