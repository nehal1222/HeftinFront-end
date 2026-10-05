import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Compass, GraduationCap, KeyRound, Mail, Sparkles, Users } from 'lucide-react'
import { DEMO_PERSONAS } from '@/lib/mockAuth'
import type { DemoPersona } from '@/lib/mockAuth'

interface AuthSample3Props {
  onSuccess: (info: { name: string; org: string; role: string; personaId: string }) => void
}

export function AuthSample3_UniversalScopeChooser({ onSuccess }: AuthSample3Props) {
  const [step, setStep] = useState<'credentials' | 'scope_selection'>('scope_selection') // show rich scope cards by default for immediate visual impact!
  const [email, setEmail] = useState('rohit@dpa.edu')
  const [password, setPassword] = useState('password123')
  const [activePersona, setActivePersona] = useState<DemoPersona>(DEMO_PERSONAS[1])
  const [selectedScopeId, setSelectedScopeId] = useState('batch_101')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cohortCards = [
    {
      id: 'batch_101',
      title: 'Batch 101 — Grade 11 Physics',
      subtitle: 'Assigned Teaching Cohort',
      students: '38 Enrolled Students',
      type: 'batch',
      icon: GraduationCap,
      badge: 'Primary Teaching Scope',
      rights: ['batches.view', 'users.view (Batch-Scoped)'],
    },
    {
      id: 'batch_102',
      title: 'Batch 102 — Grade 12 Advanced Physics',
      subtitle: 'Secondary Teaching Cohort',
      students: '42 Enrolled Students',
      type: 'batch',
      icon: GraduationCap,
      badge: 'Elective Scope',
      rights: ['batches.view', 'users.view (Batch-Scoped)'],
    },
    {
      id: 'dept_science',
      title: 'Department of Physical Sciences',
      subtitle: 'Department Faculty Observer',
      students: '6 Faculty · 80 Students',
      type: 'department',
      icon: Users,
      badge: 'Department Scope',
      rights: ['departments.view', 'batches.view'],
    },
  ]

  function applyPreset(persona: DemoPersona) {
    setActivePersona(persona)
    setEmail(persona.profile.email ?? '')
  }

  function handleCredentialSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep('scope_selection')
    }, 400)
  }

  function finalizeLogin() {
    try {
      localStorage.setItem('heftin-phase1-persona', activePersona.id)
    } catch {
      // ignore storage error
    }

    onSuccess({
      name: activePersona.name,
      org: 'Delhi Public Academy',
      role: activePersona.label,
      personaId: activePersona.id,
    })
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Interactive LMS Cohort Chooser */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-lg bg-primary text-white">
              <Compass size={18} />
            </div>
            <div>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                Multi-Cohort Architecture
              </span>
              <strong className="block text-sm font-bold text-error">
                Cohort Scope & Session Selector
              </strong>
            </div>
          </div>
          <span className="rounded-full border border-border bg-white px-2.5 py-0.5 text-[10px] font-bold text-error">
            Session Isolation
          </span>
        </div>

        {/* Explainer banner */}
        <div className="mt-4 rounded-xl border border-border bg-border/10 p-3 text-xs text-error">
          <strong className="text-primary font-bold">Session Scope Isolation:</strong> When faculty manage multiple cohorts, selecting an active session ensures student grading, attendance, and exam submissions remain strictly isolated.
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialSubmit} noValidate className="mt-5 space-y-4">
            <div>
              <label htmlFor="cohort-email" className="mb-1 block text-xs font-bold text-error">
                Account Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-primary">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  id="cohort-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-xs text-error outline-none transition-colors focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="cohort-password" className="mb-1 block text-xs font-bold text-error">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-primary">
                  <KeyRound size={16} />
                </span>
                <input
                  type="password"
                  id="cohort-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-xs text-error outline-none transition-colors focus:border-primary"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md transition-all hover:opacity-90"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Authenticate & Choose Cohort →'}</span>
            </button>
          </form>
        ) : (
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-primary">Authenticated Member: {activePersona.name} ({activePersona.label})</span>
                <h3 className="text-base font-bold text-error">Select Your Active Cohort / Session Scope</h3>
              </div>
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Change Login
              </button>
            </div>

            {/* VISUAL COHORT CARDS GRID - Interactive Scope Selector */}
            <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {cohortCards.map((cohort) => {
                const isSelected = selectedScopeId === cohort.id
                const IconComponent = cohort.icon
                return (
                  <button
                    key={cohort.id}
                    type="button"
                    onClick={() => setSelectedScopeId(cohort.id)}
                    className={`flex flex-col justify-between rounded-xl border-2 p-4 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-md'
                        : 'border-border bg-white text-error hover:border-primary/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className={`grid size-8 place-items-center rounded-lg ${isSelected ? 'bg-white text-primary' : 'bg-border/30 text-primary'}`}>
                          <IconComponent size={16} />
                        </div>
                        {isSelected ? (
                          <div className="grid size-5 place-items-center rounded-full bg-white text-primary">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        ) : (
                          <span className="rounded-full border border-border px-2 py-0.5 text-[9px] font-bold text-error">
                            {cohort.type}
                          </span>
                        )}
                      </div>

                      <strong className="mt-3 block text-xs font-bold leading-tight">
                        {cohort.title}
                      </strong>
                      <span className={`mt-1 block text-[10px] ${isSelected ? 'text-white/80' : 'text-primary font-semibold'}`}>
                        {cohort.students}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-border/20 pt-2.5">
                      <span className={`block font-mono text-[9px] ${isSelected ? 'text-white/70' : 'text-error/70'}`}>
                        Active Scope: {cohort.id}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Active Scope Summary Banner */}
            <div className="mt-4 rounded-xl border border-border bg-white p-3 text-xs text-error">
              <div className="flex items-center justify-between">
                <span className="font-bold text-error">Active Session Scope: <code>{selectedScopeId}</code></span>
                <span className="text-[10px] font-bold text-primary">Strict Scope Boundary Active</span>
              </div>
              <p className="mt-1 text-[11px] text-error/80">
                You will only be able to view, grade, and communicate with members explicitly enrolled in this scope.
              </p>
            </div>

            {/* Final Action Button */}
            <button
              type="button"
              onClick={finalizeLogin}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md transition-all hover:opacity-90"
            >
              <span>Enter Workspace in {selectedScopeId} →</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* The 4 Organization Roles (Phase 1) Simulation Deck */}
        <div className="mt-6 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-error">
              <Sparkles size={13} className="text-primary" />
              The 4 Organization Roles (Phase 1)
            </span>
            <span className="text-[10px] text-primary font-mono font-bold">1-Click Test</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
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
            First-time account?{' '}
            <Link to="/signup" className="font-bold text-primary underline">
              Redeem Institution Invite Token
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
