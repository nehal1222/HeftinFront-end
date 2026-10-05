import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Code2, Globe2, KeyRound, Layers, Mail, Sparkles } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { DEMO_PERSONAS } from '@/lib/mockAuth'
import type { DemoPersona } from '@/lib/mockAuth'

interface AuthSample2Props {
  onSuccess: (info: { name: string; org: string; role: string; personaId: string }) => void
}

export function AuthSample2_WorkspacePortal({ onSuccess }: AuthSample2Props) {
  const [activePersona, setActivePersona] = useState<DemoPersona>(DEMO_PERSONAS[1])
  const [workspaceSlug, setWorkspaceSlug] = useState('dpa-academy')
  const [email, setEmail] = useState('rohit@dpa.edu')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [showInspector, setShowInspector] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function applyPreset(persona: DemoPersona) {
    setActivePersona(persona)
    setEmail(persona.profile.email ?? '')
    if (persona.id === 'platform_admin') {
      setWorkspaceSlug('heftin-platform')
    } else {
      setWorkspaceSlug('dpa-academy')
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      localStorage.setItem('heftin-phase1-persona', activePersona.id)
    } catch {
      // ignore storage error
    }

    setTimeout(() => {
      setIsSubmitting(false)
      onSuccess({
        name: activePersona.name,
        org: workspaceSlug === 'heftin-platform' ? 'Heftin Platform Central' : 'Delhi Public Academy',
        role: activePersona.label,
        personaId: activePersona.id,
      })
    }, 600)
  }

  return (
    <div className="w-full max-w-xl">
      {/* Subdomain Gateway Card */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8">
        {/* Header with Subdomain badge */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-lg bg-primary text-white">
              <Layers size={18} />
            </div>
            <div>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                Subdomain Architecture
              </span>
              <strong className="block text-sm font-bold text-error">
                Multi-Tenant Workspace Gateway
              </strong>
            </div>
          </div>
          <span className="rounded-full border border-border bg-white px-2.5 py-0.5 text-[10px] font-bold text-error">
            Domain Isolation
          </span>
        </div>

        {/* 2-Step Visual Progress Stepper */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-border/10 p-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-primary">
            <CheckCircle2 size={14} />
            <span>1. Tenant Identified</span>
          </div>
          <div className="h-px w-8 bg-border" />
          <div className="flex items-center gap-1.5 font-bold text-error">
            <span className="grid size-4 place-items-center rounded-full bg-primary text-[10px] text-white">2</span>
            <span>Member Credentials</span>
          </div>
        </div>

        {/* PROMINENT SUBDOMAIN URL BAR */}
        <div className="mt-5 rounded-xl border-2 border-primary/40 bg-white p-3.5 shadow-sm">
          <label htmlFor="workspace-subdomain" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
            Organization Workspace Subdomain
          </label>
          <div className="mt-1.5 flex items-center rounded-lg border border-border bg-white px-3 py-2 text-xs">
            <span className="font-mono text-error/60 font-semibold select-none">https://</span>
            <input
              type="text"
              id="workspace-subdomain"
              value={workspaceSlug}
              onChange={(e) => setWorkspaceSlug(e.target.value)}
              placeholder="your-institution"
              className="mx-1 flex-1 font-mono font-bold text-primary outline-none"
            />
            <span className="font-mono text-error/60 font-semibold select-none">.heftin.edu</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 font-medium text-primary">
              <Globe2 size={12} /> Tenant: {workspaceSlug === 'heftin-platform' ? 'Platform HQ' : 'Delhi Public Academy'}
            </span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
              ● Active & Scoped
            </span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} noValidate className="mt-5 space-y-4">
          <div>
            <label htmlFor="workspace-email" className="mb-1 block text-xs font-bold text-error">
              Member Institutional Email
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-primary">
                <Mail size={16} />
              </span>
              <input
                type="email"
                id="workspace-email"
                placeholder="member@dpa.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-xs text-error outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="workspace-password" className="block text-xs font-bold text-error">
                Password
              </label>
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-[11px] font-bold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-primary">
                <KeyRound size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="workspace-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-16 text-xs text-error outline-none transition-colors focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[11px] font-bold text-primary"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md transition-all hover:opacity-90"
          >
            <span>{isSubmitting ? 'Validating Workspace Access...' : 'Sign in to ' + workspaceSlug}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* /auth/me Contract Inspector Drawer */}
        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowInspector(!showInspector)}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <Code2 size={14} />
              <span>{showInspector ? 'Hide /auth/me JSON Payload' : 'Inspect Server /auth/me Response'}</span>
            </button>
            <span className="text-[10px] text-error/60 font-mono">Backend Contract</span>
          </div>

          {showInspector && (
            <div className="mt-3 rounded-xl border border-border bg-border/10 p-3 font-mono text-[11px] text-error">
              <div className="mb-1 text-[10px] font-bold text-primary uppercase">Authoritative Server Response:</div>
              <pre className="overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    account_id: activePersona.profile.account_id,
                    role: activePersona.profile.role,
                    rights: activePersona.profile.rights,
                    scopes: activePersona.profile.scopes,
                    is_platform_admin: activePersona.profile.is_platform_admin,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>

        {/* The 4 Organization Roles (Phase 1) Simulation Deck */}
        <div className="mt-5 rounded-xl border border-border bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-error">
              <Sparkles size={13} className="text-primary" />
              The 4 Organization Roles (Phase 1)
            </span>
            <span className="text-[10px] font-mono text-primary font-bold">1-Click Test</span>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DEMO_PERSONAS.map((p) => {
              const isSelected = activePersona.id === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`rounded-lg border p-2 text-center transition-all ${
                    isSelected
                      ? 'border-primary bg-primary text-white font-bold'
                      : 'border-border bg-white text-error hover:border-primary/50'
                  }`}
                >
                  <span className="block text-xs truncate">{p.label}</span>
                  <span className={`block text-[9px] truncate ${isSelected ? 'text-white/80' : 'text-primary'}`}>
                    {p.name.split(' ')[0]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-4 text-center">
          <p className="text-xs text-error">
            Claim a seat on this workspace?{' '}
            <Link to="/signup" className="font-bold text-primary underline">
              Redeem Workspace Code
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
