import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Building2, CheckCircle2, KeyRound, Mail, Shield, Sparkles } from 'lucide-react'
import logoImg from '@/assets/logo.jpeg'
import { ROUTES } from '@/lib/constants'
import { DEMO_PERSONAS } from '@/lib/mockAuth'
import type { DemoPersona } from '@/lib/mockAuth'

interface AuthSample1Props {
  onSuccess: (info: { name: string; org: string; role: string; personaId: string }) => void
}

function getEnglishRightsDescription(persona: DemoPersona): string {
  if (persona.profile.is_platform_admin) {
    return 'Full platform administration across all organizations.'
  }
  const rights = persona.profile.rights || []
  if (rights.length === 0) {
    return 'Standard read-only workspace access.'
  }
  if (rights.length > 5) {
    return 'Full organization administration across users, roles, departments, and batches.'
  }

  const map: Record<string, string> = {
    'users.view': 'view users',
    'batches.view': 'view batches',
    'batches.create': 'create batches',
    'batches.edit': 'edit batches',
    'departments.view': 'view departments',
    'roles.view': 'view roles',
    'audit.view': 'view audit logs',
  }

  const human = rights.map((r) => map[r] || r.replace('.', ' '))
  if (human.length === 1) {
    return human[0].charAt(0).toUpperCase() + human[0].slice(1) + '.'
  }
  if (human.length === 2) {
    const text = `${human[0]} and ${human[1]}`
    return text.charAt(0).toUpperCase() + text.slice(1) + '.'
  }
  const last = human[human.length - 1]
  const rest = human.slice(0, -1)
  const text = `${rest.join(', ')}, and ${last}`
  return text.charAt(0).toUpperCase() + text.slice(1) + '.'
}

export function AuthSample1_EnterpriseSSO({ onSuccess }: AuthSample1Props) {
  const [activePersona, setActivePersona] = useState<DemoPersona>(DEMO_PERSONAS[1]) // Teacher by default
  const [email, setEmail] = useState('rohit@dpa.edu')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Domain discovery logic
  const domain = email.includes('@') ? email.split('@')[1].toLowerCase() : ''
  const isRecognizedOrg = domain === 'dpa.edu' || domain === 'heftin.com'
  const detectedOrgName =
    domain === 'dpa.edu'
      ? 'Delhi Public Academy'
      : domain === 'heftin.com'
      ? 'Heftin Platform Central'
      : 'Institutional Tenant'

  function applyPreset(persona: DemoPersona) {
    setActivePersona(persona)
    setEmail(persona.profile.email ?? '')
    setPassword('password123')
  }

  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault()
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
        org: detectedOrgName,
        role: activePersona.label,
        personaId: activePersona.id,
      })
    }, 600)
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Split-Screen Executive Command Center */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Command Showcase (Primary Color #00828e) */}
          <div className="flex flex-col justify-between border-b border-border bg-primary p-5 text-white sm:p-6 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div>
              {/* Top Brand & Status Badge */}
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-white text-primary">
                    <Shield size={15} />
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] font-bold uppercase text-border">
                      Heftin Academy
                    </span>
                    <strong className="block text-xs font-bold text-white">
                      Identity Portal
                    </strong>
                  </div>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold uppercase text-primary">
                  IAM
                </span>
              </div>

              {/* Single Sign-On */}
              <div className="mt-3.5">
                <h3 className="text-xs font-bold text-white">
                  Single Sign-On
                </h3>
                <p className="mt-1 text-[11px] text-white/90 leading-tight">
                  Federated authentication with domain discovery and server-managed rights.
                </p>
              </div>

              {/* Visual Flow Diagram */}
              <div className="mt-3 space-y-1.5 rounded-xl border border-white/20 bg-white/10 p-2.5 text-[11px]">
                <div className="flex items-center justify-between font-mono text-[9px] text-border uppercase font-bold">
                  <span>IAM Auth Flow</span>
                  <span>Scope Bound</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span className="grid size-4 place-items-center rounded-full bg-white text-[9px] font-bold text-primary">1</span>
                  <span>Enter email <code>(@dpa.edu)</code></span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span className="grid size-4 place-items-center rounded-full bg-white text-[9px] font-bold text-primary">2</span>
                  <span>SAML or credentials</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span className="grid size-4 place-items-center rounded-full bg-white text-[9px] font-bold text-primary">3</span>
                  <span className="truncate">Role: <strong>{activePersona.label}</strong></span>
                </div>
              </div>

              {/* Effective Rights in Single Line English */}
              <div className="mt-3 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[11px] text-white">
                <span className="font-semibold text-border mr-1.5">Permissions:</span>
                <span>{getEnglishRightsDescription(activePersona)}</span>
              </div>
            </div>

            {/* Quick Access Account Selector */}
            <div className="mt-4 border-t border-white/20 pt-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-white flex items-center gap-1">
                  <Sparkles size={11} className="text-white" />
                  Quick Sign-In:
                </span>
                <span className="text-[9px] text-border">4 Personas</span>
              </div>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                {DEMO_PERSONAS.map((p) => {
                  const isSelected = activePersona.id === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`rounded-lg border px-1.5 py-1 text-center transition-all ${
                        isSelected
                          ? 'border-white bg-white text-primary font-bold shadow-xs'
                          : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <span className="block text-[10px] truncate">{p.label}</span>
                      <span className={`block text-[8px] truncate ${isSelected ? 'text-primary' : 'text-white/80'}`}>
                        {p.name.split(' ')[0]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Clean Enterprise Sign-In Card (Pure White #ffffff) */}
          <div className="flex flex-col justify-center bg-white p-5 sm:p-7 lg:col-span-7">
            {/* Institution Brand */}
            <div className="flex items-center gap-2.5">
              <div className="size-8 overflow-hidden rounded-lg border border-border shadow-xs">
                <img src={logoImg} alt="Heftin" className="size-full object-cover" />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                  Institutional Portal
                </span>
                <h2 className="text-sm font-bold text-error">
                  Sign In
                </h2>
              </div>
            </div>

            {/* Detected Institution Badge */}
            {isRecognizedOrg && (
              <div className="mt-3.5 flex items-center justify-between gap-2.5 rounded-xl border border-border bg-white p-2.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-primary text-white">
                    <Building2 size={13} />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-error">{detectedOrgName}</strong>
                    <span className="block text-[9px] font-semibold text-primary">
                      Tenant Verified · SAML Active
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-0.5 rounded-full border border-border bg-white px-1.5 py-0.5 text-[9px] font-bold text-primary">
                  <CheckCircle2 size={10} /> Verified
                </span>
              </div>
            )}

            {/* 1-Click Institutional SSO Action */}
            <div className="mt-3.5">
              <button
                type="button"
                onClick={() => handleLogin()}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-white py-2 text-[11px] font-bold text-error shadow-xs transition-all hover:border-primary hover:bg-border/10"
              >
                <div className="grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-white">
                  G
                </div>
                <span>Continue with Google Workspace / SAML SSO</span>
              </button>
            </div>

            <div className="my-3 flex items-center gap-2 text-xs text-border">
              <div className="h-px flex-1 bg-border" />
              <span className="font-semibold text-error/60 text-[10px] uppercase tracking-wider">
                or with credentials
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Standard Credentials Form */}
            <form onSubmit={handleLogin} noValidate className="space-y-3">
              <div>
                <label
                  htmlFor="sso-email"
                  className="mb-1 block text-[11px] font-bold text-error"
                >
                  Work Email
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-primary">
                    <Mail size={13} />
                  </span>
                  <input
                    type="email"
                    id="sso-email"
                    placeholder="you@institution.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-white py-2 pl-8 pr-3 text-xs text-error outline-none transition-colors focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label
                    htmlFor="sso-password"
                    className="block text-[11px] font-bold text-error"
                  >
                    Password
                  </label>
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-primary">
                    <KeyRound size={13} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="sso-password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-white py-2 pl-8 pr-14 text-xs text-error outline-none transition-colors focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 text-[10px] font-bold text-primary"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:opacity-90"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In to Workspace'}</span>
                <ArrowRight size={13} />
              </button>
            </form>

            {/* Footnote on Provisioning */}
            <div className="mt-3.5 border-t border-border pt-2.5 text-center">
              <p className="text-[10px] text-error/80">
                New member?{' '}
                <Link to="/signup" className="font-bold text-primary underline">
                  Activate invite token
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
