import { useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AppNavigation } from '@/navigation/AppNavigation'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/useAuth'

type AppLayoutProps = {
  children: ReactNode
  nav?: ReactNode
  profile?: ReactNode
  className?: string
}

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.USERS]: 'Users',
  [ROUTES.ROLES]: 'Roles',
  [ROUTES.PLATFORM]: 'Platform',
  [ROUTES.DESIGN_SYSTEM]: 'Design System',
}

export function AppLayout({
  children,
  nav,
  profile,
  className,
}: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Heftin Academy'
  const navigation = nav ?? <AppNavigation />

  async function handleLogout() {
    await logout()
  }

  const defaultProfile = (
    <Card className="space-y-3 p-3">
      <div>
        <p className="text-sm font-medium text-foreground">
          {user?.full_name || 'User'}
        </p>

        <p className="truncate text-xs text-muted">
          {user?.email || ''}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => void handleLogout()}
      >
        Sign out
      </Button>
    </Card>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="border-b border-border p-4">
          <h1 className="text-lg font-semibold text-foreground-strong">
            Heftin Academy
          </h1>
        </div>

        <nav className="flex-1 p-4">
          {navigation}
        </nav>

        <div className="border-t border-border p-4">
          {profile ?? defaultProfile}
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />

          <aside className="relative z-10 flex h-full w-64 flex-col border-r border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h1 className="text-lg font-semibold text-foreground-strong">
                Heftin Academy
              </h1>

              <Button
                variant="ghost"
                size="sm"
                aria-label="Close navigation"
                onClick={() => setMobileNavOpen(false)}
              >
                X
              </Button>
            </div>

            <nav className="flex-1 p-4">
              {navigation}
            </nav>

            <div className="border-t border-border p-4">
              {profile ?? defaultProfile}
            </div>
          </aside>
        </div>
      )}

      {/* Main application area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <h2 className="text-base font-semibold text-foreground-strong">
            {pageTitle}
          </h2>

          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              aria-label="Open navigation"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(true)}
            >
              Menu
            </Button>
          </div>
        </header>

        <main
          className={cn(
            'min-h-0 flex-1 overflow-y-auto p-4 md:p-6',
            className,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
