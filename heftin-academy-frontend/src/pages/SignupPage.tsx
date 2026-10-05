import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Key,
  Lock,
  Mail,
  User,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import logoImg from '@/assets/logo.jpeg'

export function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState<'redeem' | 'student' | 'institution'>('redeem')

  // Redeem token form state
  const [inviteToken, setInviteToken] = useState('HAC-DPA-8492')
  const [tokenEmail, setTokenEmail] = useState('rohit@dpa.edu')
  const [tokenPassword, setTokenPassword] = useState('password123')

  // Student register state
  const [studentName, setStudentName] = useState('Sana Iqbal')
  const [studentEmail, setStudentEmail] = useState('sana@dpa.edu')
  const [studentBatch, setStudentBatch] = useState('batch_101')
  const [studentPassword, setStudentPassword] = useState('password123')

  // Institution request state
  const [orgName, setOrgName] = useState('Delhi Public Academy')
  const [adminName, setAdminName] = useState('Nehal Sinha')
  const [orgEmail, setOrgEmail] = useState('orgadmin@dpa.edu')
  const [orgSize, setOrgSize] = useState('500+')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successInfo, setSuccessInfo] = useState<{
    title: string
    name: string
    role: string
    scope: string
    permissions: string
    destination: string
  } | null>(null)

  function handleRedeemToken(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      login({
        email: tokenEmail,
        password: tokenPassword || 'password123',
      }).catch(() => {
        // Demo offline fallback
      })
      try {
        localStorage.setItem('heftin-phase1-persona', 'teacher')
      } catch {
        // Storage disabled or blocked
      }
      setSuccessInfo({
        title: 'Seat Successfully Activated!',
        name: 'Prof. Rohit Mehta',
        role: 'Faculty / Educator',
        scope: 'Delhi Public Academy · Batch 101 Faculty',
        permissions: 'Permissions: View users and manage assigned batch exams.',
        destination: '/dashboard',
      })
    }, 700)
  }

  function handleStudentRegister(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      login({
        email: studentEmail,
        password: studentPassword || 'password123',
      }).catch(() => {
        // Demo offline fallback
      })
      try {
        localStorage.setItem('heftin-phase1-persona', 'student')
      } catch {
        // Storage disabled or blocked
      }
      setSuccessInfo({
        title: 'Student Enrollment Complete!',
        name: studentName,
        role: 'Student / Aspirant',
        scope: `Delhi Public Academy · ${studentBatch === 'batch_101' ? 'Batch 101' : 'Batch 202'}`,
        permissions: 'Permissions: View assigned batch exams and rank results.',
        destination: '/dashboard',
      })
    }, 700)
  }

  function handleOrgRequest(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccessInfo({
        title: 'Institutional Onboarding Submitted!',
        name: adminName,
        role: 'Prospective Organization Admin',
        scope: `${orgName} (${orgSize} Aspirants)`,
        permissions: 'Permissions: Pending platform administrator review.',
        destination: '/login',
      })
    }, 700)
  }

  return (
    <div className="min-h-screen bg-white text-error font-sans antialiased">
      {/* Top Header */}
      <div className="border-b border-border bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-8 overflow-hidden rounded-lg border border-border">
              <img src={logoImg} alt="Heftin Academy" className="size-full object-cover" />
            </div>
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-primary">
                Enterprise Onboarding
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
              to="/login"
              className="rounded-lg bg-primary px-3 py-1.5 text-white hover:opacity-90 transition-opacity"
            >
              Sign In →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Broad Layout */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Context & Explanations */}
          <section className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs">
              <span className="size-2 rounded-full bg-primary" />
              <span className="font-mono text-[10px] font-bold uppercase text-primary">
                Phase 1 Onboarding &amp; Registration
              </span>
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-error tracking-tight">
              Create your account or activate your seat.
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-error/80 leading-relaxed">
              Institutional staff receive secure invitation tokens bounded by organization ceilings.
              Students can register directly into their allocated mock test cohorts.
            </p>

            {/* Architecture Highlights */}
            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
                <div className="flex items-center gap-2.5">
                  <Key size={18} className="text-primary shrink-0" />
                  <strong className="text-xs font-bold text-error">Token-Based Role Binding</strong>
                </div>
                <p className="mt-1 text-[11px] text-error/80 leading-relaxed pl-7">
                  Tokens instantly attach the recipient to their designated department, batch, and rights.
                </p>
              </div>

              <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
                <div className="flex items-center gap-2.5">
                  <GraduationCap size={18} className="text-primary shrink-0" />
                  <strong className="text-xs font-bold text-error">Cohort-Enrolled Students</strong>
                </div>
                <p className="mt-1 text-[11px] text-error/80 leading-relaxed pl-7">
                  Enrolled students get immediate access to assigned test series and batch leaderboards.
                </p>
              </div>

              <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
                <div className="flex items-center gap-2.5">
                  <Building2 size={18} className="text-primary shrink-0" />
                  <strong className="text-xs font-bold text-error">Organization Tenancy</strong>
                </div>
                <p className="mt-1 text-[11px] text-error/80 leading-relaxed pl-7">
                  Institutional accounts maintain strict tenant isolation with custom role hierarchies.
                </p>
              </div>
            </div>

            {/* Phase 2 Note */}
            <div className="mt-6 rounded-xl border border-dashed border-border bg-[#f8fcfe] p-3.5 text-center">
              <strong className="block text-[10px] font-bold uppercase tracking-wider text-primary">
                Phase 2 — Individual Aspirants
              </strong>
              <p className="mt-1 text-[11px] text-error/80">
                Self-service individual public exam accounts are scheduled for Phase 2.
              </p>
            </div>

            <div className="mt-8 border-t border-border pt-5 flex items-center justify-between text-xs">
              <Link to="/" className="text-primary font-bold hover:underline">
                ← Return to Homepage
              </Link>
              <Link to="/login" className="text-error font-semibold hover:text-primary">
                Already registered? Sign In →
              </Link>
            </div>
          </section>

          {/* Right Column: Interactive Registration & Activation Panel */}
          <section className="lg:col-span-7">
            {successInfo ? (
              <div className="rounded-2xl border border-primary/40 bg-white p-6 sm:p-8 shadow-sm text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary text-white mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-lg font-bold text-error">{successInfo.title}</h2>
                <p className="mt-1 text-sm text-primary font-semibold">
                  {successInfo.name} · {successInfo.role}
                </p>
                <p className="mt-1 text-xs text-error/80">{successInfo.scope}</p>

                <div className="my-5 rounded-xl border border-border bg-[#f8fcfe] p-3 text-xs text-error text-left">
                  <strong className="block text-[11px] text-primary uppercase font-bold mb-0.5">
                    Assigned Session Rights
                  </strong>
                  <span>{successInfo.permissions}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => navigate(successInfo.destination)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <span>Launch Workspace Now</span>
                    <ArrowRight size={14} />
                  </button>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-xs font-bold text-error hover:border-primary transition-colors"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
                {/* Mode Selector Tabs */}
                <div className="flex rounded-xl border border-border p-1 bg-white mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('redeem')}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                      activeTab === 'redeem'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-error hover:text-primary'
                    }`}
                  >
                    🎟️ Redeem Token
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('student')}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                      activeTab === 'student'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-error hover:text-primary'
                    }`}
                  >
                    🎓 Student Enrollment
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('institution')}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                      activeTab === 'institution'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-error hover:text-primary'
                    }`}
                  >
                    🏢 Request Tenant
                  </button>
                </div>

                {/* TAB 1: REDEEM INVITE TOKEN */}
                {activeTab === 'redeem' && (
                  <form onSubmit={handleRedeemToken} noValidate className="space-y-4">
                    <div>
                      <h2 className="text-sm font-bold text-error">Activate Institutional Seat</h2>
                      <p className="text-[11px] text-error/70">
                        Enter the invitation token issued by your organization administrator.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="token-input" className="block text-xs font-bold text-error mb-1">
                        Invitation Token
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-primary">
                          <Key size={16} />
                        </span>
                        <input
                          type="text"
                          id="token-input"
                          value={inviteToken}
                          onChange={(e) => setInviteToken(e.target.value)}
                          placeholder="HAC-DPA-XXXX"
                          required
                          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 font-mono text-xs font-bold text-primary outline-none focus:border-primary"
                        />
                      </div>
                      <span className="mt-1 block text-[10px] text-primary font-semibold">
                        Sample Token: HAC-DPA-8492 (Delhi Public Academy Faculty)
                      </span>
                    </div>

                    <div>
                      <label htmlFor="token-email" className="block text-xs font-bold text-error mb-1">
                        Institutional Email
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-primary">
                          <Mail size={16} />
                        </span>
                        <input
                          type="email"
                          id="token-email"
                          value={tokenEmail}
                          onChange={(e) => setTokenEmail(e.target.value)}
                          required
                          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-xs text-error font-medium outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="token-password" className="block text-xs font-bold text-error mb-1">
                        Set Account Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-primary">
                          <Lock size={16} />
                        </span>
                        <input
                          type="password"
                          id="token-password"
                          value={tokenPassword}
                          onChange={(e) => setTokenPassword(e.target.value)}
                          placeholder="Create password"
                          required
                          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-xs text-error outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Token Verified Summary */}
                    <div className="rounded-xl border border-border bg-[#f8fcfe] p-3.5 text-xs text-error">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-[11px] text-primary font-bold uppercase">
                          Token Authorization Preview
                        </strong>
                        <span className="text-[10px] font-bold text-primary font-mono">VERIFIED</span>
                      </div>
                      <p className="font-semibold text-error">Delhi Public Academy · Batch 101 Faculty</p>
                      <div className="mt-2 text-[11px] text-error/80 flex items-center gap-1.5">
                        <span className="font-bold text-primary">Permissions:</span>
                        <span>View users and manage assigned batch exams.</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-sm hover:opacity-95 transition-all"
                    >
                      <span>{isSubmitting ? 'Validating Token...' : 'Activate Seat & Enter Academy'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                )}

                {/* TAB 2: STUDENT ENROLLMENT */}
                {activeTab === 'student' && (
                  <form onSubmit={handleStudentRegister} noValidate className="space-y-4">
                    <div>
                      <h2 className="text-sm font-bold text-error">Student Cohort Registration</h2>
                      <p className="text-[11px] text-error/70">
                        Enroll as an aspirant to take scheduled mock tests and track your rank.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="student-name" className="block text-xs font-bold text-error mb-1">
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-primary">
                          <User size={16} />
                        </span>
                        <input
                          type="text"
                          id="student-name"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Sana Iqbal"
                          required
                          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-xs text-error outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="student-reg-email" className="block text-xs font-bold text-error mb-1">
                        Student Email / Roll Number
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-primary">
                          <Mail size={16} />
                        </span>
                        <input
                          type="text"
                          id="student-reg-email"
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          placeholder="sana@dpa.edu or STU-101"
                          required
                          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-xs text-error outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="student-batch" className="block text-xs font-bold text-error mb-1">
                        Select Exam Batch
                      </label>
                      <select
                        id="student-batch"
                        value={studentBatch}
                        onChange={(e) => setStudentBatch(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white py-2.5 px-3 text-xs text-error font-medium outline-none focus:border-primary"
                      >
                        <option value="batch_101">Batch 101 - Engineering &amp; Science Mocks</option>
                        <option value="batch_202">Batch 202 - Banking Exam Test Series</option>
                        <option value="batch_303">Batch 303 - SSC CGL Prelims Cohort</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="student-reg-password" className="block text-xs font-bold text-error mb-1">
                        Create Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-primary">
                          <Lock size={16} />
                        </span>
                        <input
                          type="password"
                          id="student-reg-password"
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          required
                          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-xs text-error outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Student Permissions Summary */}
                    <div className="rounded-xl border border-border bg-[#f8fcfe] p-3 text-xs text-error">
                      <strong className="block text-[11px] text-primary uppercase font-bold mb-0.5">
                        Student Access Rights
                      </strong>
                      <span>Permissions: View assigned batch exams and rank results.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-sm hover:opacity-95 transition-all"
                    >
                      <span>{isSubmitting ? 'Enrolling Student...' : 'Complete Student Registration'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                )}

                {/* TAB 3: REQUEST INSTITUTION TENANT */}
                {activeTab === 'institution' && (
                  <form onSubmit={handleOrgRequest} noValidate className="space-y-4">
                    <div>
                      <h2 className="text-sm font-bold text-error">Request Institutional Tenant</h2>
                      <p className="text-[11px] text-error/70">
                        Provision a dedicated organization workspace with custom roles and rights ceilings.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="org-name" className="block text-xs font-bold text-error mb-1">
                        Academy / Institution Name
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-primary">
                          <Building2 size={16} />
                        </span>
                        <input
                          type="text"
                          id="org-name"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          placeholder="Delhi Public Academy"
                          required
                          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-xs text-error outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="admin-name" className="block text-xs font-bold text-error mb-1">
                        Administrator Contact Name
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-primary">
                          <User size={16} />
                        </span>
                        <input
                          type="text"
                          id="admin-name"
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                          placeholder="Nehal Sinha"
                          required
                          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-xs text-error outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="org-email" className="block text-xs font-bold text-error mb-1">
                        Official Institutional Email
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-primary">
                          <Mail size={16} />
                        </span>
                        <input
                          type="email"
                          id="org-email"
                          value={orgEmail}
                          onChange={(e) => setOrgEmail(e.target.value)}
                          placeholder="admin@dpa.edu"
                          required
                          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-xs text-error outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="org-size" className="block text-xs font-bold text-error mb-1">
                        Estimated Aspirant Volume
                      </label>
                      <select
                        id="org-size"
                        value={orgSize}
                        onChange={(e) => setOrgSize(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white py-2.5 px-3 text-xs text-error font-medium outline-none focus:border-primary"
                      >
                        <option value="100-250">100 - 250 Aspirants</option>
                        <option value="250-500">250 - 500 Aspirants</option>
                        <option value="500+">500+ Aspirants (Enterprise)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-sm hover:opacity-95 transition-all"
                    >
                      <span>{isSubmitting ? 'Submitting Request...' : 'Submit Institutional Tenant Request'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                )}

                {/* Footer Switch */}
                <div className="mt-6 border-t border-border pt-4 text-center text-xs">
                  <span className="text-error/70">Already have an active account? </span>
                  <Link to="/login" className="font-bold text-primary hover:underline">
                    Sign in here →
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
