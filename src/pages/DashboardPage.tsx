import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { APP_NAME, ROUTES } from '@/lib/constants'
import { clearAuthStorage } from '@/lib/storage'

export function DashboardPage() {
  const navigate = useNavigate()

  function handleSignOut() {
    clearAuthStorage()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <main className="min-h-screen bg-surface px-5 py-8 text-foreground sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col rounded-3xl border border-border bg-card p-8 shadow-xl sm:p-12">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold tracking-tight text-primary">{APP_NAME}</h1>
          <Button onClick={handleSignOut}>Sign out</Button>
        </header>
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Dashboard</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">You’re signed in</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Your Heftin Academy account is ready. Your learning workspace will appear here.
          </p>
        </div>
      </section>
    </main>
  )
}
