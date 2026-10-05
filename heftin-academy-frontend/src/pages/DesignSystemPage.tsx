import { useState } from 'react'
import { ArrowLeft, Check, Code2, Copy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { AsyncState } from '@/components/ui/AsyncState'
import type { AsyncStateKind } from '@/lib/async-state'

const TOKENS_CSS_CONTENT = `/* Sprint 1 design system - Tailwind v4 + CSS design tokens. */

:root {
  --primary: #00828e;
  --border: #cce6e8;
  --error: #001a1c;
  --white: #ffffff;
}

@theme {
  --color-*: initial;
  --color-white: #ffffff;
  --color-transparent: transparent;
  --color-current: currentColor;

  --color-primary: #00828e;
  --color-border: #cce6e8;
  --color-error: #001a1c;

  --color-primary-shade-1: #00828e;
  --color-primary-shade-2: #001a1c;
  --color-primary-shade-3: #001a1c;
  --color-primary-shade-4: #001a1c;
  --color-primary-shade-5: #001a1c;
  --color-primary-tint-1: #00828e;
  --color-primary-tint-2: #00828e;
  --color-primary-tint-3: #cce6e8;
  --color-primary-tint-4: #cce6e8;
  --color-primary-tint-5: #cce6e8;

  --color-ink: #001a1c;
  --color-muted: #001a1c;
  --color-surface: #ffffff;
  --color-on-primary: #ffffff;

  --font-display: "Jost", sans-serif;
  --font-serif: "Source Serif 4", serif;
  --font-sans: "Inter", system-ui, sans-serif;
  --font-auth: "Roboto", sans-serif;

  --text-eyebrow: 0.625rem;
  --text-body-sm: 0.75rem;
  --text-body: 0.8125rem;
  --text-heading-sm: 1.125rem;
  --text-heading-md: 1.375rem;
  --text-heading-lg: 1.75rem;
  --tracking-tight: -0.01em;

  --spacing: 0.25rem;
  --spacing-section: 2.5rem;
  --spacing-page: 3rem;

  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1.125rem;
  --radius-full: 999px;

  --breakpoint-sm: 35rem;
  --breakpoint-md: 40rem;
  --breakpoint-lg: 56.25rem;
  --breakpoint-xl: 75rem;
}`

const CORE_COLORS = [
  { token: '--primary', hex: '#00828e', role: 'Brand primary, buttons, highlights, active tabs', bg: 'var(--primary)', color: 'var(--white)', border: 'transparent' },
  { token: '--border', hex: '#cce6e8', role: 'Card borders, dividers, subtle background tints', bg: 'var(--border)', color: 'var(--error)', border: 'var(--border)' },
  { token: '--error', hex: '#001a1c', role: 'Error alerts, dark typography, headings, high contrast', bg: 'var(--error)', color: 'var(--white)', border: 'transparent' },
  { token: '--white', hex: '#ffffff', role: 'Card surfaces, app canvas, high-contrast button text', bg: 'var(--white)', color: 'var(--error)', border: 'var(--border)' },
] as const

const RADIUS_SWATCHES = [
  ['radius-sm', 'rounded-sm'],
  ['radius-md', 'rounded-md'],
  ['radius-lg', 'rounded-lg'],
  ['radius-card', 'rounded-card'],
  ['radius-control', 'rounded-control'],
  ['radius-full', 'rounded-full'],
] as const

const SPACING_SWATCHES = ['p-1', 'p-2', 'p-4', 'p-6', 'p-8', 'p-section', 'p-page']

export function DesignSystemPage() {
  const [activeState, setActiveState] = useState<AsyncStateKind>('loading')
  const [retryCount, setRetryCount] = useState(0)
  const [copied, setCopied] = useState(false)

  function handleCopyTokens() {
    navigator.clipboard.writeText(TOKENS_CSS_CONTENT).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 p-page font-sans text-foreground">
      <header>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-primary-dark">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>
          <div className="flex items-center gap-3">
            <Link to={ROUTES.WORKSPACE} className="rounded-control border border-border bg-surface px-3 py-1.5 text-body-sm font-semibold text-foreground-strong hover:border-primary hover:text-primary transition-colors">
              Workspace
            </Link>
            <Link to={ROUTES.LOGIN} className="rounded-control bg-primary px-3 py-1.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors">
              Sign In
            </Link>
          </div>
        </div>
        <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Design System Tokens</p>
        <h1 className="mt-1 font-display text-heading-lg font-light tracking-tight text-foreground-strong">Design Tokens &amp; Themes</h1>
        <p className="mt-2 max-w-2xl text-body-sm text-muted">
          Strictly configured in <code className="rounded-sm bg-border px-1.5 py-0.5 font-mono text-error">src/styles/tokens.css</code> and <code className="rounded-sm bg-border px-1.5 py-0.5 font-mono text-error">src/index.css</code> with exactly 4 core colors:
          <code className="ml-1 rounded-sm bg-border px-1.5 py-0.5 font-mono text-error">--primary: #00828e</code>,
          <code className="ml-1 rounded-sm bg-border px-1.5 py-0.5 font-mono text-error">--border: #cce6e8</code>,
          <code className="ml-1 rounded-sm bg-border px-1.5 py-0.5 font-mono text-error">--error: #001a1c</code>,
          <code className="ml-1 rounded-sm bg-border px-1.5 py-0.5 font-mono text-error">--white: #ffffff</code>.
        </p>
      </header>

      {/* Raw tokens.css File Viewer Card */}
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-lg bg-primary text-white">
              <Code2 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase text-primary">Active Design Tokens Source</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-bold text-primary">Tailwind v4 Theme</span>
              </div>
              <h2 className="text-base font-bold text-error">src/styles/tokens.css</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyTokens}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-bold text-primary hover:border-primary transition-all shadow-xs"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy tokens.css</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-error/80 mb-3">
          Authoritative CSS variables &amp; Tailwind v4 theme definitions powering the strict 4-color palette, typography scale, radii, and responsive breakpoints.
        </p>
        <div className="overflow-hidden rounded-xl border border-border bg-[#001a1c] p-4 text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 text-[11px] font-mono text-border">
            <span>tokens.css</span>
            <span>62 lines · 1.48 KB</span>
          </div>
          <pre className="overflow-x-auto font-mono text-xs text-white leading-relaxed">
            <code>{TOKENS_CSS_CONTENT}</code>
          </pre>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-heading-sm tracking-tight text-foreground-strong">Strict 4-Color Palette</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_COLORS.map(({ token, hex, role, bg, color, border }) => (
            <div key={token} className="flex flex-col overflow-hidden rounded-card border border-border bg-white shadow-sm">
              <div
                className="flex h-24 flex-col justify-between p-3"
                style={{ background: bg, color, borderBottom: `1px solid ${border}` }}
              >
                <span className="font-mono text-sm font-bold">{token}</span>
                <span className="font-mono text-xs font-semibold uppercase">{hex}</span>
              </div>
              <div className="p-3">
                <p className="text-caption font-medium text-error">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-heading-sm tracking-tight text-foreground-strong">Typography Scale</h2>
        <div className="flex flex-col gap-3 rounded-card border border-border bg-white p-card shadow-sm">
          <p className="font-display text-heading-lg font-light tracking-tight text-error">Display / Heading lg — Jost 300</p>
          <p className="font-display text-heading-md font-normal tracking-tight text-error">Heading md — Jost 400</p>
          <p className="font-serif text-heading-sm font-semibold tracking-tight text-error">Heading sm — Source Serif 4</p>
          <p className="font-sans text-body text-error">Body — Inter default UI copy size (1rem).</p>
          <p className="font-sans text-body-sm text-error">Body sm — Inter secondary text.</p>
          <p className="font-auth text-body-sm text-error">Auth copy — Roboto font role.</p>
          <p className="font-mono text-caption text-error">Monospace — Code and tokens scale.</p>
          <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">Eyebrow label</p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-heading-sm tracking-tight text-foreground-strong">Radius & Shape</h2>
        <div className="flex flex-wrap gap-4">
          {RADIUS_SWATCHES.map(([name, className]) => (
            <div key={name} className="flex flex-col items-center gap-1.5">
              <div className={`h-14 w-14 border border-border bg-primary ${className}`} />
              <span className="font-mono text-caption text-error">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-heading-sm tracking-tight text-foreground-strong">Spacing Scale</h2>
        <div className="flex flex-wrap items-end gap-4">
          {SPACING_SWATCHES.map((className) => (
            <div key={className} className="flex flex-col items-center gap-1.5">
              <div className={`rounded-control bg-border ${className}`}>
                <div className="h-4 w-4 rounded-sm bg-primary" />
              </div>
              <span className="font-mono text-caption text-error">{className}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-heading-sm tracking-tight text-foreground-strong">Breakpoints (Responsive)</h2>
        <div className="rounded-card border border-border bg-white p-card text-body-sm shadow-sm">
          <p className="sm:hidden font-semibold text-primary">Below sm (&lt; 640px / 40rem)</p>
          <p className="hidden sm:block md:hidden font-semibold text-primary">sm (640px+ / 40rem)</p>
          <p className="hidden md:block lg:hidden font-semibold text-primary">md (768px+ / 48rem)</p>
          <p className="hidden lg:block xl:hidden font-semibold text-primary">lg (1024px+ / 64rem)</p>
          <p className="hidden xl:block font-semibold text-primary">xl (1280px+ / 80rem)</p>
          <p className="mt-2 text-caption text-error">Resize your browser window to test the active responsive breakpoint in real-time.</p>
        </div>
      </section>
      <section>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
              [HAC01-FE-11] Error, Loading & Session Handling
            </span>
            <h2 className="font-display text-heading-sm tracking-tight text-foreground-strong">
              Shared Async States & Session Lifecycle
            </h2>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-primary">
            Auth + Dashboard Pattern
          </span>
        </div>

        <div className="rounded-card border border-border bg-white p-5 shadow-sm">
          <p className="text-body-sm text-error/80 mb-4">
            Unified pattern used across login, auth guards, and dashboard pages. Handles all 6 lifecycle events without leaving a broken shell.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {(['loading', 'empty', 'error', 'forbidden', 'notFound'] as AsyncStateKind[]).map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => setActiveState(kind)}
                className={`rounded-control border px-3 py-1.5 text-xs font-bold transition-all ${
                  activeState === kind
                    ? 'border-primary bg-primary text-white shadow-xs'
                    : 'border-border bg-white text-error hover:border-primary/50'
                }`}
              >
                {kind}
              </button>
            ))}

            <Link
              to="/login?expired=true"
              className="rounded-control border border-primary/40 bg-border/20 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all ml-auto"
            >
              Simulate Session Expired →
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-border/10 p-6 min-h-[220px] flex items-center justify-center">
            <AsyncState
              state={activeState}
              onRetry={
                activeState === 'error'
                  ? () => setRetryCount((c) => c + 1)
                  : undefined
              }
              description={
                activeState === 'error' && retryCount > 0
                  ? `Simulated retry clicked ${retryCount} time(s). Everything re-evaluated safely.`
                  : undefined
              }
            />
          </div>
        </div>
      </section>
    </main>
  )
}