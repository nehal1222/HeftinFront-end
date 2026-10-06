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
]

const RADIUS_SWATCHES = [
  { name: 'radius-sm', className: 'rounded-sm' },
  { name: 'radius-md', className: 'rounded-md' },
  { name: 'radius-lg', className: 'rounded-lg' },
  { name: 'radius-full', className: 'rounded-full' },
]

const SPACING_SWATCHES = ['p-1', 'p-2', 'p-4', 'p-6', 'p-8', 'p-section', 'p-page']

export default function DesignSystemPage() {
  return (
    <div className="flex flex-col gap-8 text-ink font-sans">
      <section>
        <span className="text-eyebrow font-bold uppercase tracking-wider text-muted">Sprint 1 - Design System</span>
        <h1 className="font-display text-heading-lg font-light tracking-tight mt-1">Tokens</h1>
        <p className="text-body-sm text-muted mt-2 max-w-xl">
          Tailwind is configured via <code className="bg-primary-tint-5 px-1.5 py-0.5 rounded-sm">@theme</code> in{' '}
          <code className="bg-primary-tint-5 px-1.5 py-0.5 rounded-sm">styles/tokens.css</code>. Everything on this
          page is built from token utility classes - no raw hex, no inline styles.
        </p>
      </section>

      <section>
        <h2 className="font-display text-heading-sm font-normal tracking-tight mb-3">Color</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {COLOR_SWATCHES.map((swatch) => (
            <div key={swatch.name} className="flex flex-col gap-1.5 border border-border rounded-lg p-2.5 bg-white">
              <div
                className="h-14 rounded-md"
                style={{
                  backgroundColor: swatch.bg,
                  border: swatch.border ? '1px solid var(--border)' : 'none',
                }}
              />
              <strong className="text-xs font-bold text-error">{swatch.name}</strong>
              <span className="text-[11px] font-mono text-primary font-semibold">{swatch.hex}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-heading-sm font-normal tracking-tight mb-3">Typography</h2>
        <div className="flex flex-col gap-2.5 bg-surface border border-border rounded-lg p-5">
          <p className="font-display text-heading-lg font-light tracking-tight">Heading / lg - Jost 300</p>
          <p className="font-display text-heading-md font-normal tracking-tight">Heading / md - Jost 400</p>
          <p className="font-serif text-heading-sm font-semibold tracking-tight">Heading / sm - Source Serif 4</p>
          <p className="font-sans text-body">Body - Inter 13px, the default UI copy size.</p>
          <p className="font-sans text-body-sm text-muted">Body / sm - Inter 12px, muted secondary text.</p>
          <p className="font-sans text-eyebrow font-bold uppercase tracking-wider text-muted">Eyebrow label</p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-heading-sm font-normal tracking-tight mb-3">Radius</h2>
        <div className="flex flex-wrap gap-3">
          {RADIUS_SWATCHES.map((swatch) => (
            <div key={swatch.name} className="flex flex-col items-center gap-1.5">
              <div className={`h-14 w-14 bg-primary ${swatch.className}`} />
              <span className="text-body-sm text-muted font-mono">{swatch.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-heading-sm font-normal tracking-tight mb-3">Spacing</h2>
        <div className="flex flex-wrap items-end gap-3">
          {SPACING_SWATCHES.map((className) => (
            <div key={className} className="flex flex-col items-center gap-1.5">
              <div className={`bg-primary-tint-5 rounded-sm ${className}`}>
                <div className="bg-primary rounded-sm h-4 w-4" />
              </div>
              <span className="text-body-sm text-muted font-mono">{className}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-heading-sm font-normal tracking-tight mb-3">Breakpoints</h2>
        <div className="bg-surface border border-border rounded-lg p-5 text-body-sm">
          <p className="sm:hidden">Below sm (&lt; 560px)</p>
          <p className="hidden sm:block md:hidden">sm (560px+)</p>
          <p className="hidden md:block lg:hidden">md (640px+)</p>
          <p className="hidden lg:block xl:hidden">lg (900px+)</p>
          <p className="hidden xl:block">xl (1200px+)</p>
          <p className="text-muted mt-2">Resize the window - this line reflects the active token breakpoint.</p>
        </div>
      </section>
    </div>
  )
}