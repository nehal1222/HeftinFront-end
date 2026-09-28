import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

type AppLayoutProps = {
  children: ReactNode
  nav?: ReactNode
  profile?: ReactNode
  className?: string
}

export function AppLayout({
  children,
  nav,
  profile,
  className,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-surface text-foreground">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="border-b border-border p-4">
          <h1 className="text-lg font-semibold text-foreground-strong">
            Heftin Academy
          </h1>
        </div>

        <nav className="flex-1 p-4">
          {nav ?? (
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              Dashboard
            </Button>
          )}
        </nav>

        <div className="border-t border-border p-4">
          {profile ?? (
            <Card className="p-3">
              <p className="text-sm font-medium text-foreground">
                User Profile
              </p>
            </Card>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <h2 className="text-base font-semibold text-foreground-strong">
            Dashboard
          </h2>

          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              aria-label="Open navigation"
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