
import { useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

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
                <X size={16} />
              </Button>
            </div>

            <nav className="flex-1 p-4">
              {nav ?? (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setMobileNavOpen(false)}
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
        </div>
      )}

      {/* Main application area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <h2 className="text-base font-semibold text-foreground-strong">
            Dashboard
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
