import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { AuthSample1_EnterpriseSSO } from '@/components/auth/AuthSample1_EnterpriseSSO'
import { AuthSample2_WorkspacePortal } from '@/components/auth/AuthSample2_WorkspacePortal'
import { AuthSample3_UniversalScopeChooser } from '@/components/auth/AuthSample3_UniversalScopeChooser'

export function AuthSamplesHubPage() {
  const [selectedSampleTab, setSelectedSampleTab] = useState<'1' | '2' | '3'>('1')
  const [showScreenshot, setShowScreenshot] = useState(true)
  const [authSuccessBanner, setAuthSuccessBanner] = useState<{
    name: string
    org: string
    role: string
  } | null>(null)

  function handleAuthSuccess(info: { name: string; org: string; role: string; personaId: string }) {
    setAuthSuccessBanner({
      name: info.name,
      org: info.org,
      role: info.role,
    })
    setTimeout(() => {
      setAuthSuccessBanner(null)
    }, 4500)
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-4 sm:p-page font-sans text-error">
      {/* Executive Header */}
      <header className="border-b border-border pb-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-colors"
            >
              Open Live Login →
            </Link>
            <Link
              to="/signup"
              className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-error hover:border-primary transition-colors"
            >
              Open Live Sign Up
            </Link>
          </div>
        </div>

        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
          Executive Architectural Review &amp; Lead Presentation
        </span>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-error">
          Phase 1 Login &amp; Architecture Evaluation Hub
        </h1>
        <p className="mt-2 max-w-3xl text-xs sm:text-sm text-error/80 leading-relaxed">
          Below are <strong>3 production-ready enterprise authentication layouts</strong> designed to replace
          the legacy role-picker model, ensuring strict server-authoritative rights and zero tenant leakage.
        </p>
      </header>

      {/* Visual Screenshot Mockup Showcase */}
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-primary">UI Visual Deliverable</span>
            <h2 className="text-sm font-bold text-error">Lead Presentation: 3 Design Layouts Visual Comparison</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowScreenshot(!showScreenshot)}
            className="rounded-lg border border-border px-3 py-1 text-xs font-bold text-primary hover:border-primary"
          >
            {showScreenshot ? 'Hide Screenshot' : 'Show Screenshot'}
          </button>
        </div>

        {showScreenshot && (
          <div className="overflow-hidden rounded-xl border border-border bg-[#001a1c]/5">
            <img
              src="/images/login-layouts-comparison.jpg"
              alt="Professional Login UI Comparison Mockup: Executive Split-Screen, Subdomain Gateway, and Cohort Chooser"
              className="w-full object-cover"
            />
            <div className="p-3 bg-white border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-error/80">
              <span>
                <strong>Image Artifact:</strong> High-fidelity comparison of the 3 approved layouts using the strict 4-color palette.
              </span>
              <span className="font-mono text-[10px] text-primary font-bold">
                #00828e · #cce6e8 · #001a1c · #ffffff
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Architectural Standards & Security Compliance Matrix */}
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3 mb-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-primary">Architecture Governance</span>
            <h2 className="text-base font-bold text-error">Architectural Standards &amp; Security Compliance Matrix</h2>
          </div>
          <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-white uppercase">
            100% Architecture Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Item 1 */}
          <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-primary text-xs">
              <CheckCircle2 size={15} /> Server-Computed Rights
            </div>
            <strong className="mt-1 block text-xs text-error">Authoritative RBAC</strong>
            <p className="mt-1 text-[11px] text-error/80 leading-relaxed">
              Eliminated client-side intersection. Rights and ceiling bounds are computed live by the server and consumed from <code>/auth/me</code>.
            </p>
          </div>

          {/* Item 2 */}
          <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-primary text-xs">
              <CheckCircle2 size={15} /> Resource Scope Isolation
            </div>
            <strong className="mt-1 block text-xs text-error">Explicit Resource Scopes</strong>
            <p className="mt-1 text-[11px] text-error/80 leading-relaxed">
              Added <code>scopes: &#123; type, id &#125;[]</code>. A batch-scoped teacher has <code>users.view</code> strictly scoped to their assigned batch.
            </p>
          </div>

          {/* Item 3 */}
          <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-primary text-xs">
              <CheckCircle2 size={15} /> Token Provisioning
            </div>
            <strong className="mt-1 block text-xs text-error">Controlled Onboarding</strong>
            <p className="mt-1 text-[11px] text-error/80 leading-relaxed">
              Phase 1 organizations and staff are provisioned via verified invitation tokens, eliminating unverified self-registration.
            </p>
          </div>

          {/* Item 4 */}
          <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-primary text-xs">
              <CheckCircle2 size={15} /> Rights Catalog
            </div>
            <strong className="mt-1 block text-xs text-error">Strict Permission Model</strong>
            <p className="mt-1 text-[11px] text-error/80 leading-relaxed">
              Standardized on exact Sprint permission codes: <code>users.*</code>, <code>roles.*</code>, <code>batches.*</code>.
            </p>
          </div>

          {/* Item 5 */}
          <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-primary text-xs">
              <CheckCircle2 size={15} /> Platform Admin Boundary
            </div>
            <strong className="mt-1 block text-xs text-error">SuperAdmin Isolation</strong>
            <p className="mt-1 text-[11px] text-error/80 leading-relaxed">
              SuperAdmin is not a tenant role. Modeled with <code>account_id: null</code> and <code>is_platform_admin: true</code>, unbound by tenant ceiling.
            </p>
          </div>

          {/* Item 6 */}
          <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-primary text-xs">
              <CheckCircle2 size={15} /> Fail-Closed Security
            </div>
            <strong className="mt-1 block text-xs text-error">403 Forbidden Safeguards</strong>
            <p className="mt-1 text-[11px] text-error/80 leading-relaxed">
              Denials render explicit 403 forbidden screen explaining missing right code; never leaves a broken or blank shell.
            </p>
          </div>

          {/* Item 7 */}
          <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-primary text-xs">
              <CheckCircle2 size={15} /> Ceiling Safeguards
            </div>
            <strong className="mt-1 block text-xs text-error">Anti-Self-Escalation</strong>
            <p className="mt-1 text-[11px] text-error/80 leading-relaxed">
              Dynamic roles cannot exceed the organization ceiling. Role editors only expose codes held by the editor.
            </p>
          </div>

          {/* Item 8 */}
          <div className="rounded-xl border border-border p-3.5 bg-white shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-primary text-xs">
              <CheckCircle2 size={15} /> Cryptographic Tenancy
            </div>
            <strong className="mt-1 block text-xs text-error">Tenant In Token</strong>
            <p className="mt-1 text-[11px] text-error/80 leading-relaxed">
              Client never sends <code>account_id</code>. Tenant identity and authorizations derive cryptographically from session token.
            </p>
          </div>
        </div>
      </section>

      {/* The 3 Interactive Layout Proposals */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-primary">Interactive Comparison</span>
            <h2 className="text-xl font-bold text-error">
              Test the 3 Design Layouts (Live Interactive Sandboxes)
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelectedSampleTab('1')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedSampleTab === '1'
                  ? 'bg-primary text-white shadow-xs'
                  : 'border border-border bg-white text-error hover:border-primary'
              }`}
            >
              Executive Split-Screen
            </button>
            <button
              type="button"
              onClick={() => setSelectedSampleTab('2')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedSampleTab === '2'
                  ? 'bg-primary text-white shadow-xs'
                  : 'border border-border bg-white text-error hover:border-primary'
              }`}
            >
              Subdomain Gateway
            </button>
            <button
              type="button"
              onClick={() => setSelectedSampleTab('3')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedSampleTab === '3'
                  ? 'bg-primary text-white shadow-xs'
                  : 'border border-border bg-white text-error hover:border-primary'
              }`}
            >
              Cohort Chooser
            </button>
          </div>
        </div>

        {/* Success Banner if authenticated within sample */}
        {authSuccessBanner && (
          <div className="flex items-center justify-between rounded-xl border border-primary/50 bg-[#f8fcfe] p-4 text-xs shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-primary shrink-0" />
              <span>
                <strong>Authenticated:</strong> Signed in as <strong>{authSuccessBanner.name}</strong> ({authSuccessBanner.role}) into{' '}
                <strong>{authSuccessBanner.org}</strong>.
              </span>
            </div>
            <Link to="/dashboard" className="font-bold text-primary hover:underline shrink-0">
              Enter Workspace →
            </Link>
          </div>
        )}

        {/* Live Mounted Component Display */}
        <div className="rounded-2xl border border-border bg-[#f8fcfe] p-4 sm:p-8 flex justify-center">
          {selectedSampleTab === '1' && (
            <div className="w-full flex justify-center">
              <AuthSample1_EnterpriseSSO onSuccess={handleAuthSuccess} />
            </div>
          )}
          {selectedSampleTab === '2' && (
            <div className="w-full flex justify-center">
              <AuthSample2_WorkspacePortal onSuccess={handleAuthSuccess} />
            </div>
          )}
          {selectedSampleTab === '3' && (
            <div className="w-full flex justify-center">
              <AuthSample3_UniversalScopeChooser onSuccess={handleAuthSuccess} />
            </div>
          )}
        </div>
      </section>

      {/* Evaluation & Scorecard Table */}
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
          Lead Review Summary &amp; Recommended Decision
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase font-bold text-primary">
                <th className="pb-2.5">Layout Option</th>
                <th className="pb-2.5">Key Mechanics</th>
                <th className="pb-2.5">Architecture Standards</th>
                <th className="pb-2.5">Lead Review Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[11px] text-error">
              <tr className="bg-[#f8fcfe]">
                <td className="py-3 font-bold text-primary">★ Executive Split-Screen</td>
                <td className="py-3">2-Column Layout · Email Domain Discovery · Stated English Rights · Quick Persona Test</td>
                <td className="py-3 font-semibold text-primary">Server Rights &amp; Platform Boundary</td>
                <td className="py-3 font-bold text-primary">Recommended (Production Standard)</td>
              </tr>
              <tr>
                <td className="py-3 font-bold">Subdomain Gateway</td>
                <td className="py-3">Institutional Subdomain Bar · 2-Step Verification · Contract Inspection</td>
                <td className="py-3 font-semibold text-primary">Domain Tenancy &amp; Strict Isolation</td>
                <td className="py-3 text-error/80">Approved Alternative for Multi-Subdomain Setups</td>
              </tr>
              <tr>
                <td className="py-3 font-bold">Cohort Chooser</td>
                <td className="py-3">Interactive Cohort Card Selector · Department Observer Toggle · Scoped Permissions</td>
                <td className="py-3 font-semibold text-primary">Session Scope Isolation &amp; Multi-Cohort Safety</td>
                <td className="py-3 text-error/80">Approved Alternative for Multi-Batch Educators</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
