const COLOR_SWATCHES = [
  ['primary', 'bg-primary'],
  ['primary-shade-1', 'bg-primary-shade-1'],
  ['primary-shade-2', 'bg-primary-shade-2'],
  ['primary-shade-3', 'bg-primary-shade-3'],
  ['primary-shade-4', 'bg-primary-shade-4'],
  ['primary-shade-5', 'bg-primary-shade-5'],
  ['primary-tint-1', 'bg-primary-tint-1'],
  ['primary-tint-2', 'bg-primary-tint-2'],
  ['primary-tint-3', 'bg-primary-tint-3'],
  ['primary-tint-4', 'bg-primary-tint-4'],
  ['primary-tint-5', 'bg-primary-tint-5'],
] as const

const RADIUS_SWATCHES = [
  ['radius-sm', 'rounded-sm'],
  ['radius-md', 'rounded-md'],
  ['radius-lg', 'rounded-lg'],
  ['radius-full', 'rounded-full'],
] as const

const SPACING_SWATCHES = ['p-1', 'p-2', 'p-4', 'p-6', 'p-8', 'p-page']

export function DesignSystemPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 p-page font-sans text-foreground">
      <header>
        <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Sprint 1 - Design System</p>
        <h1 className="mt-1 font-display text-heading-lg font-light tracking-tight text-foreground-strong">Tokens</h1>
        <p className="mt-2 max-w-2xl text-body-sm text-muted">
          This page demonstrates the shared Tailwind tokens from <code className="rounded-sm bg-primary-tint-5 px-1.5 py-0.5">@theme</code>.
        </p>
      </header>

      <section>
        <h2 className="mb-3 font-display text-heading-sm tracking-tight">Color</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {COLOR_SWATCHES.map(([name, className]) => (
            <div key={name} className="flex flex-col gap-1.5">
              <div className={`h-14 rounded-lg border border-border ${className}`} />
              <span className="font-mono text-body-sm text-muted">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-heading-sm tracking-tight">Typography</h2>
        <div className="flex flex-col gap-2.5 rounded-lg border border-border bg-surface-elevated p-card">
          <p className="font-display text-heading-lg font-light">Heading / lg</p>
          <p className="font-display text-heading-md">Heading / md</p>
          <p className="font-display text-heading-sm">Heading / sm</p>
          <p className="text-body">Body copy</p>
          <p className="text-body-sm text-muted">Muted body copy</p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-heading-sm tracking-tight">Radius and spacing</h2>
        <div className="flex flex-wrap items-end gap-4">
          {RADIUS_SWATCHES.map(([name, className]) => (
            <div key={name} className="flex flex-col items-center gap-1.5">
              <div className={`h-14 w-14 bg-primary ${className}`} />
              <span className="font-mono text-body-sm text-muted">{name}</span>
            </div>
          ))}
          {SPACING_SWATCHES.map((className) => (
            <div key={className} className="flex flex-col items-center gap-1.5">
              <div className={`rounded-sm bg-primary-tint-5 ${className}`}>
                <div className="h-4 w-4 rounded-sm bg-primary" />
              </div>
              <span className="font-mono text-body-sm text-muted">{className}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}