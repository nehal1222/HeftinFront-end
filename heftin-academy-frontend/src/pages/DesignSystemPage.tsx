const COLOR_SWATCHES = [
  { name: 'primary', hex: '#00828e', bg: '#00828e' },
  { name: 'shade-1', hex: '#006f79', bg: '#006f79' },
  { name: 'shade-2', hex: '#005b63', bg: '#005b63' },
  { name: 'shade-3', hex: '#00484e', bg: '#00484e' },
  { name: 'shade-4', hex: '#003439', bg: '#003439' },
  { name: 'shade-5 (error)', hex: '#001a1c', bg: '#001a1c' },
  { name: 'tint-1', hex: '#1a8f99', bg: '#1a8f99' },
  { name: 'tint-2', hex: '#40a1aa', bg: '#40a1aa' },
  { name: 'tint-3', hex: '#66b4bb', bg: '#66b4bb' },
  { name: 'tint-4', hex: '#99cdd2', bg: '#99cdd2' },
  { name: 'tint-5 (border)', hex: '#cce6e8', bg: '#cce6e8' },
  { name: 'white (surface)', hex: '#ffffff', bg: '#ffffff', border: true },
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
        <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Design System</p>
        <h1 className="mt-1 font-display text-heading-lg font-light tracking-tight text-foreground-strong">Tokens</h1>
        <p className="mt-2 max-w-2xl text-body-sm text-muted">
          This page demonstrates the authoritative design token colors from <code className="rounded-sm bg-primary-tint-5 px-1.5 py-0.5">@theme</code>.
        </p>
      </header>

      <section>
        <h2 className="mb-3 font-display text-heading-sm tracking-tight">Color</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {COLOR_SWATCHES.map((swatch) => (
            <div key={swatch.name} className="flex flex-col gap-1.5 rounded-lg border border-border bg-white p-2.5">
              <div
                className="h-14 rounded-md"
                style={{
                  backgroundColor: swatch.bg,
                  border: 'border' in swatch && swatch.border ? '1px solid var(--border)' : 'none',
                }}
              />
              <strong className="text-xs font-bold text-foreground-strong">{swatch.name}</strong>
              <span className="font-mono text-[11px] font-semibold text-primary">{swatch.hex}</span>
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