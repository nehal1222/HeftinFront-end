import { AppLayout } from '@/layouts/AppLayout'

export function PlatformPage() {
  return (
    <AppLayout>
      <section className="mx-auto max-w-4xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground-strong">
            Platform
          </h1>
          <p className="mt-1 text-sm text-muted">
            Platform administration tools.
          </p>
        </div>
      </section>
    </AppLayout>
  )
}
