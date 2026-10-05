import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import { AuthSample2_WorkspacePortal } from '@/components/auth/AuthSample2_WorkspacePortal'
import { AuthSample3_UniversalScopeChooser } from '@/components/auth/AuthSample3_UniversalScopeChooser'
import logoImg from '@/assets/logo.jpeg'

interface AccessProfile {
  id: string
  title: string
  name: string
  email: string
  scope: string
  category: 'organization' | 'student'
  permissionsLine: string
  isPlatformAdmin?: boolean
}

const ACCESS_PROFILES: AccessProfile[] = [
  {
    id: 'org_admin',
    title: 'Organization Admin',
    name: 'Nehal Sinha',
    email: 'orgadmin@dpa.edu',
    scope: 'Delhi Public Academy · Enterprise Tenant',
    category: 'organization',
    permissionsLine: 'Permissions: View and create users, manage roles and permissions, configure org profile.',
    isPlatformAdmin: false,
  },
  {
    id: 'hod',
    title: 'Head of Department',
    name: 'Dr. Priya Nair',
    email: 'priya@dpa.edu',
    scope: 'Science & Engineering Dept',
    category: 'organization',
    permissionsLine: 'Permissions: View users, view departments, and manage department batches.',
    isPlatformAdmin: false,
  },
  {
    id: 'teacher',
    title: 'Faculty / Educator',
    name: 'Prof. Rohit Mehta',
    email: 'rohit@dpa.edu',
    scope: 'Batch 101 Faculty & Evaluator',
    category: 'organization',
    permissionsLine: 'Permissions: View users and manage assigned batch exams.',
    isPlatformAdmin: false,
  },
  {
    id: 'student',
    title: 'Student / Aspirant',
    name: 'Sana Iqbal',
    email: 'sana@dpa.edu',
    scope: 'Batch 101 · Roll #849',
    category: 'student',
    permissionsLine: 'Permissions: View assigned batch exams and rank results.',
    isPlatformAdmin: false,
  },
  {
    id: 'platform_admin',
    title: 'Platform SuperAdmin',
    name: 'Heftin Platform Central',
    email: 'admin@heftin.com',
    scope: 'Central Multi-Tenant Governance',
    category: 'organization',
    permissionsLine: 'Permissions: Full platform administration across all organizations.',
    isPlatformAdmin: true,
  },
]

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const sampleParam = searchParams.get('sample')
  const [activeLayout, setActiveLayout] = useState<'1' | '2' | '3'>(
    sampleParam === '2' ? '2' : sampleParam === '3' ? '3' : '1'
  )

  const isLoggedOut = searchParams.get('logged_out') === 'true'
  const isSessionExpired =
    searchParams.get('expired') === 'true' ||
    Boolean((location.state as { sessionExpired?: boolean } | null)?.sessionExpired)

  const initialMode = searchParams.get('mode') === 'student' ? 'student' : 'organization'
  const [accountMode, setAccountMode] = useState<'organization' | 'student'>(initialMode)

  const defaultProfile = initialMode === 'student'
    ? ACCESS_PROFILES.find((p) => p.id === 'student')!
    : ACCESS_PROFILES[0]

  const [selectedProfile, setSelectedProfile] = useState<AccessProfile>(defaultProfile)
  const [email, setEmail] = useState(defaultProfile.email)
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  if (isAuthenticated && !showWelcome) {
    return <Navigate to={ROUTES.WORKSPACE} replace />
  }

  function handleSelectProfile(profile: AccessProfile) {
    setSelectedProfile(profile)
    setEmail(profile.email)
    setPassword('password123')
  }

  function handleModeChange(mode: 'organization' | 'student') {
    setAccountMode(mode)
    const matching = ACCESS_PROFILES.find((p) => p.category === mode)
    if (matching) {
      handleSelectProfile(matching)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      localStorage.setItem('heftin-phase1-persona', selectedProfile.id)
    } catch {
      // Storage fallback
    }

    login({
      email: selectedProfile.email,
      password: password || 'password123',
    }).catch(() => {
      // Demo offline fallback
    })

    setShowWelcome(true)

    setTimeout(() => {
      const destination = selectedProfile.isPlatformAdmin
        ? '/platform/organizations'
        : (location.state as { from?: string } | null)?.from ?? '/dashboard'
      navigate(destination, { replace: true })
    }, 900)
  }

  function handleSampleSuccess(info: { name: string; org: string; role: string; personaId: string }) {
    try {
      localStorage.setItem('heftin-phase1-persona', info.personaId)
    } catch {
      // Storage fallback
    }

    setShowWelcome(true)
    setTimeout(() => {
      const destination = info.personaId === 'platform_admin' ? '/platform/organizations' : '/dashboard'
      navigate(destination, { replace: true })
    }, 900)
  }

  const displayedProfiles = ACCESS_PROFILES.filter((p) => p.category === accountMode)

  return (
    <div className="min-h-screen bg-white text-error font-sans antialiased">
      {/* Lead Review Layout Switcher Toolbar */}
      <div className="border-b border-border bg-[#f8fcfe] px-4 py-2">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase text-primary tracking-wider">
              Layout Options:
            </span>
            <div className="flex rounded-lg border border-border bg-white p-0.5">
              <button
                type="button"
                onClick={() => setActiveLayout('1')}
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-all ${
                  activeLayout === '1' ? 'bg-primary text-white shadow-xs' : 'text-error hover:text-primary'
                }`}
              >
                Executive Split-Screen
              </button>
              <button
                type="button"
                onClick={() => setActiveLayout('2')}
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-all ${
                  activeLayout === '2' ? 'bg-primary text-white shadow-xs' : 'text-error hover:text-primary'
                }`}
              >
                Subdomain Gateway
              </button>
              <button
                type="button"
                onClick={() => setActiveLayout('3')}
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-all ${
                  activeLayout === '3' ? 'bg-primary text-white shadow-xs' : 'text-error hover:text-primary'
                }`}
              >
                Cohort Chooser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Brand Stripe */}
      <div className="border-b border-border bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-8 overflow-hidden rounded-lg border border-border">
              <img src={logoImg} alt="Heftin Academy" className="size-full object-cover" />
            </div>
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-primary">
                Enterprise Identity
              </span>
              <strong className="block text-sm font-bold text-error">Heftin Academy</strong>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <Link to="/" className="text-error/70 hover:text-primary transition-colors">
              ← Home
            </Link>
            <span className="text-border">·</span>
            <Link
              to="/signup"
              className="rounded-lg border border-border px-3 py-1.5 text-primary hover:border-primary transition-colors"
            >
              Activate / Sign Up →
            </Link>
          </div>
        </div>
      </div>

      {/* RENDER LAYOUT 2 IF SELECTED */}
      {activeLayout === '2' && (
        <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12 flex justify-center">
          <AuthSample2_WorkspacePortal onSuccess={handleSampleSuccess} />
        </main>
      )}

      {/* RENDER LAYOUT 3 IF SELECTED */}
      {activeLayout === '3' && (
        <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12 flex justify-center">
          <AuthSample3_UniversalScopeChooser onSuccess={handleSampleSuccess} />
        </main>
      )}

      {/* RENDER LAYOUT 1 (DEFAULT BROAD TWO-COLUMN WITH STATED PERMISSIONS) */}
      {activeLayout === '1' && (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Context, Security & Architecture */}
            <section className="lg:col-span-5 lg:sticky lg:top-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs">
                <span className="size-2 rounded-full bg-primary" />
                <span className="font-mono text-[10px] font-bold uppercase text-primary">
                  Phase 1 Access Architecture
                </span>
              </div>

              <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-error tracking-tight">
                Sign in to your learning &amp; exam workspace.
              </h1>

              <p className="mt-3 text-xs sm:text-sm text-error/80 leading-relaxed">
                Heftin Academy enforces zero-trust dynamic roles bounded by organization rights ceilings.
                Every tool and cohort is authorized through server-computed permissions.
              </p>

              {/* Architecture Highlights */}
              <div className="mt-6 space-y-3">
                <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={18} className="text-primary shrink-0" />
                    <strong className="text-xs font-bold text-error">Immutable Rights Ceiling</strong>
                  </div>
                  <p className="mt-1 text-[11px] text-error/80 leading-relaxed pl-7">
                    Custom roles cannot self-escalate or grant rights beyond the organization boundary.
                  </p>
                </div>

                <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
                  <GraduationCap size={18} className="text-primary shrink-0" />
                  <strong className="text-xs font-bold text-error">Cohort &amp; Batch Isolation</strong>
                </div>
                <p className="mt-1 text-[11px] text-error/80 leading-relaxed pl-7">
                  Faculty and students only access test series assigned to their designated batch.
                </p>
              </div>

              <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles size={18} className="text-primary shrink-0" />
                  <strong className="text-xs font-bold text-error">Single-Line English Permissions</strong>
                </div>
                <p className="mt-1 text-[11px] text-error/80 leading-relaxed pl-7">
                  Granular permission codes mapped to plain English summaries for clarity.
                </p>
              </div>

              {/* Quick Switch Links */}
              <div className="mt-8 border-t border-border pt-5 flex items-center justify-between text-xs">
                <Link to="/" className="text-primary font-bold hover:underline">
                  ← Return to Homepage
                </Link>
                <Link to="/signup" className="text-error font-semibold hover:text-primary">
                  Activate an invite token →
                </Link>
              </div>
            </section>

            {/* Right Column: Interactive Role Selector & Sign In Form */}
            <section className="lg:col-span-7">
              {/* Feedback Banners */}
              {isLoggedOut && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-primary/40 bg-white p-3.5 shadow-xs">
                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                  <span className="text-xs font-semibold text-error">
                    You have been securely logged out. Select an access profile below to sign back in.
                  </span>
                </div>
              )}

              {isSessionExpired && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 shadow-xs">
                  <Shield size={18} className="text-primary shrink-0" />
                  <span className="text-xs font-semibold text-error">
                    Your session has expired. Please authenticate to resume your workspace.
                  </span>
                </div>
              )}

              <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
                {/* Account Mode Switcher */}
                <div className="flex rounded-xl border border-border p-1 bg-white mb-6">
                  <button
                    type="button"
                    onClick={() => handleModeChange('organization')}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                      accountMode === 'organization'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-error hover:text-primary'
                    }`}
                  >
                    🏢 Organization Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('student')}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                      accountMode === 'student'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-error hover:text-primary'
                    }`}
                  >
                    🎓 Student Access
                  </button>
                </div>

                {/* Profiles Header */}
                <div className="mb-4">
                  <h2 className="text-sm font-bold text-error">
                    {accountMode === 'organization' ? 'Choose Access Profile' : 'Student Access Profile'}
                  </h2>
                  <p className="text-[11px] text-error/70">
                    Permissions are stated in plain English for each role.
                  </p>
                </div>

                {/* Profile Selection Cards Deck */}
                <div className="space-y-2.5 mb-6">
                  {displayedProfiles.map((p) => {
                    const isSelected = selectedProfile.id === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectProfile(p)}
                        className={`w-full rounded-xl border p-3.5 text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-white ring-1 ring-primary shadow-xs'
                            : 'border-border bg-white hover:border-primary/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`grid size-5 place-items-center rounded-full border ${
                                isSelected ? 'border-primary bg-primary text-white' : 'border-border bg-white'
                              }`}
                            >
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                            <div>
                              <strong className="block text-xs font-bold text-error">{p.title}</strong>
                              <span className="block text-[11px] text-primary font-medium">{p.name} · {p.scope}</span>
                            </div>
                          </div>
                          <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-error/70">
                            {p.category}
                          </span>
                        </div>

                        {/* Stated Permissions Line in Single-Line English */}
                        <div className="mt-2.5 rounded-lg border border-border bg-[#f8fcfe] px-2.5 py-1.5 text-[11px] text-error flex items-center gap-1.5">
                          <span className="font-bold text-primary shrink-0">Permissions:</span>
                          <span className="truncate">{p.permissionsLine.replace('Permissions: ', '')}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Verified Identity Form */}
                <form onSubmit={handleSubmit} noValidate className="border-t border-border pt-5 space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-xs font-bold text-error mb-1">
                      {accountMode === 'organization' ? 'Institutional Email' : 'Student Email / Roll Number'}
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-primary">
                        <Mail size={16} />
                      </span>
                      <input
                        type="text"
                        id="login-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-xs text-error font-medium outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="login-password" className="text-xs font-bold text-error">
                        Password
                      </label>
                      <span className="text-[11px] text-primary font-semibold">Demo: password123</span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-primary">
                        <Lock size={16} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-10 text-xs text-error outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-error/60 hover:text-primary"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Verified Scope Indicator */}
                  <div className="flex items-center justify-between rounded-lg border border-border bg-[#f8fcfe] px-3 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-primary" />
                      <span className="font-semibold text-error">{selectedProfile.scope}</span>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-primary uppercase">Authorized</span>
                  </div>

                  {/* Single Line Effective Permissions Summary */}
                  <div className="rounded-xl border border-primary/30 bg-white p-3 text-xs text-error">
                    <strong className="block text-[11px] text-primary uppercase tracking-wider mb-0.5 font-bold">
                      Effective Session Permissions
                    </strong>
                    <span>{selectedProfile.permissionsLine}</span>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-error/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-primary rounded"
                      />
                      <span>Remember profile</span>
                    </label>
                    <Link to="/signup" className="text-primary font-bold hover:underline">
                      Activate seat token →
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-sm hover:opacity-95 transition-all"
                  >
                    <span>
                      {isSubmitting
                        ? 'Authenticating Session...'
                        : `Sign In as ${selectedProfile.title}`}
                    </span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>
            </section>
          </div>
        </main>
      )}

      {/* Welcome Transition Modal / Overlay */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-white">
              <CheckCircle2 size={24} />
            </div>
            <strong className="mt-3 block text-base font-bold text-error">
              Welcome back, {selectedProfile.name}
            </strong>
            <p className="mt-1 text-xs text-primary font-semibold">{selectedProfile.title}</p>
            <p className="mt-0.5 text-[11px] text-error/80">{selectedProfile.scope}</p>
            <div className="mt-4 border-t border-border pt-3 text-[11px] text-error/70">
              {selectedProfile.permissionsLine}
            </div>
            <p className="mt-3 font-mono text-[10px] text-primary">Loading authorized workspace...</p>
          </div>
        </div>
      )}
    </div>
  )
}
