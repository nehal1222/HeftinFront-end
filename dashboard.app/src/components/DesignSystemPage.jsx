/* Sprint 1 sample page — proves the Tailwind + @theme token setup works.
   Every class below is a token class (bg-primary, text-muted, rounded-lg, ...),
   not a raw hex value or inline style. See styles/tokens.css for the @theme
   block these classes resolve to. */

const COLOR_SWATCHES = [
  { name: 'primary', className: 'bg-primary' },
  { name: 'primary-shade-1', className: 'bg-primary-shade-1' },
  { name: 'primary-shade-2', className: 'bg-primary-shade-2' },
  { name: 'primary-shade-3', className: 'bg-primary-shade-3' },
  { name: 'primary-shade-4', className: 'bg-primary-shade-4' },
  { name: 'primary-shade-5', className: 'bg-primary-shade-5' },
  { name: 'primary-tint-1', className: 'bg-primary-tint-1' },
  { name: 'primary-tint-2', className: 'bg-primary-tint-2' },
  { name: 'primary-tint-3', className: 'bg-primary-tint-3' },
  { name: 'primary-tint-4', className: 'bg-primary-tint-4' },
  { name: 'primary-tint-5', className: 'bg-primary-tint-5' },
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
        <span className="text-eyebrow font-bold uppercase tracking-wider text-muted">
          Sprint 1 · Design System
        </span>
        <h1 className="font-display text-heading-lg font-light tracking-tight mt-1">Tokens</h1>
        <p className="text-body-sm text-muted mt-2 max-w-xl">
          Tailwind is configured via <code className="bg-primary-tint-5 px-1.5 py-0.5 rounded-sm">@theme</code> in{' '}
          <code className="bg-primary-tint-5 px-1.5 py-0.5 rounded-sm">styles/tokens.css</code>. Everything on this
          page is built from token utility classes — no raw hex, no inline styles.
        </p>
      </section>

      {/* ---------- Color ---------- */}
      <section>
        <h2 className="font-display text-heading-sm font-normal tracking-tight mb-3">Color</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {COLOR_SWATCHES.map((swatch) => (
            <div key={swatch.name} className="flex flex-col gap-1.5">
              <div className={`h-14 rounded-lg border border-border ${swatch.className}`} />
              <span className="text-body-sm text-muted font-mono">{swatch.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Typography ---------- */}
      <section>
        <h2 className="font-display text-heading-sm font-normal tracking-tight mb-3">Typography</h2>
        <div className="flex flex-col gap-2.5 bg-surface border border-border rounded-lg p-5">
          <p className="font-display text-heading-lg font-light tracking-tight">Heading / lg — Jost 300</p>
          <p className="font-display text-heading-md font-normal tracking-tight">Heading / md — Jost 400</p>
          <p className="font-serif text-heading-sm font-semibold tracking-tight">Heading / sm — Source Serif 4</p>
          <p className="font-sans text-body">Body — Inter 13px, the default UI copy size.</p>
          <p className="font-sans text-body-sm text-muted">Body / sm — Inter 12px, muted secondary text.</p>
          <p className="font-sans text-eyebrow font-bold uppercase tracking-wider text-muted">
            Eyebrow label
          </p>
        </div>
      </section>

      {/* ---------- Radius ---------- */}
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

      {/* ---------- Spacing ---------- */}
      <section>
        <h2 className="font-display text-heading-sm font-normal tracking-tight mb-3">Spacing</h2>
        <div className="flex flex-wrap items-end gap-3">
          {SPACING_SWATCHES.map((cls) => (
            <div key={cls} className="flex flex-col items-center gap-1.5">
              <div className={`bg-primary-tint-5 rounded-sm ${cls}`}>
                <div className="bg-primary rounded-sm h-4 w-4" />
              </div>
              <span className="text-body-sm text-muted font-mono">{cls}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Breakpoints ---------- */}
      <section>
        <h2 className="font-display text-heading-sm font-normal tracking-tight mb-3">Breakpoints</h2>
        <div className="bg-surface border border-border rounded-lg p-5 text-body-sm">
          <p className="sm:hidden">Below sm (&lt; 560px)</p>
          <p className="hidden sm:block md:hidden">sm (560px+)</p>
          <p className="hidden md:block lg:hidden">md (640px+)</p>
          <p className="hidden lg:block xl:hidden">lg (900px+)</p>
          <p className="hidden xl:block">xl (1200px+)</p>
          <p className="text-muted mt-2">Resize the window — this line reflects the active token breakpoint.</p>
        </div>
      </section>
    </div>
  )
}
