import { useState } from 'react'
import { ArrowLeft, Building2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import logoImg from '@/assets/logo.jpeg'

type FormState = {
  orgName: string
  orgType: string
  contactName: string
  contactEmail: string
  contactPhone: string
  city: string
  expectedStudents: string
  examFamilies: string
  message: string
}

const initialState: FormState = {
  orgName: '',
  orgType: 'coaching',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  city: '',
  expectedStudents: '500-1000',
  examFamilies: 'UPSC / JEE / NEET',
  message: '',
}

export function OnboardingRequestPage() {
  const [form, setForm] = useState<FormState>(initialState)
  const [submitted, setSubmitted] = useState(false)

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white text-error font-sans antialiased">
      <header className="border-b border-border bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="size-8 overflow-hidden rounded-lg border border-border">
              <img src={logoImg} alt="Heftin" className="size-full object-cover" />
            </div>
            <strong className="text-sm font-bold text-error">Heftin Academy</strong>
          </Link>

          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <ArrowLeft size={13} /> Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-xl border border-border p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase text-primary">Onboarding</span>
              <h1 className="mt-1 text-2xl font-bold text-error">Request Access</h1>
              <p className="mt-1.5 text-xs text-error/80">Submit your institution details for managed workspace provisioning.</p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <ShieldCheck size={16} className="text-primary shrink-0" />
                  <div>
                    <strong className="block text-xs font-bold text-error">Compliance Verified</strong>
                    <p className="text-[11px] text-error/70">Verified before tenant creation.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Building2 size={16} className="text-primary shrink-0" />
                  <div>
                    <strong className="block text-xs font-bold text-error">Tenant Isolation</strong>
                    <p className="text-[11px] text-error/70">Private custom roles and cohort scopes.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Sparkles size={16} className="text-primary shrink-0" />
                  <div>
                    <strong className="block text-xs font-bold text-error">SAML 2.0 / SSO</strong>
                    <p className="text-[11px] text-error/70">Google Workspace and Entra integration.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-3 text-[11px] text-error/70">
              Have an invite code?{' '}
              <Link to="/signup" className="font-bold text-primary underline">
                Activate seat
              </Link>
            </div>
          </aside>

          <section className="rounded-xl border border-border p-6 shadow-xs">
            {submitted ? (
              <div className="space-y-3 text-center py-6">
                <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary text-white">
                  <CheckCircle2 size={24} />
                </div>
                <h2 className="text-lg font-bold text-error">Request Received</h2>
                <p className="text-xs text-error/80 max-w-sm mx-auto">
                  Our team will contact <code>{form.contactEmail}</code> to provision your workspace.
                </p>
                <div className="pt-2">
                  <Link
                    to={ROUTES.HOME}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:opacity-90"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <h2 className="text-base font-bold text-error">Institution Details</h2>
                  <p className="text-xs text-error/70">Fill out your organization profile.</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-error mb-1">Institution Name</label>
                    <input
                      required
                      placeholder="Delhi Public Academy"
                      value={form.orgName}
                      onChange={(e) => updateField('orgName', e.target.value)}
                      className="w-full rounded-lg border border-border px-3 py-2 text-xs text-error outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-error mb-1">Category</label>
                    <select
                      value={form.orgType}
                      onChange={(e) => updateField('orgType', e.target.value)}
                      className="w-full rounded-lg border border-border px-3 py-2 text-xs text-error outline-none focus:border-primary"
                    >
                      <option value="coaching">Coaching Academy</option>
                      <option value="school">School</option>
                      <option value="institute">College / University</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-error mb-1">Contact Name</label>
                    <input
                      required
                      placeholder="Name"
                      value={form.contactName}
                      onChange={(e) => updateField('contactName', e.target.value)}
                      className="w-full rounded-lg border border-border px-3 py-2 text-xs text-error outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-error mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@institution.edu"
                      value={form.contactEmail}
                      onChange={(e) => updateField('contactEmail', e.target.value)}
                      className="w-full rounded-lg border border-border px-3 py-2 text-xs text-error outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-error mb-1">Learners</label>
                    <select
                      value={form.expectedStudents}
                      onChange={(e) => updateField('expectedStudents', e.target.value)}
                      className="w-full rounded-lg border border-border px-3 py-2 text-xs text-error outline-none focus:border-primary"
                    >
                      <option value="under-500">&lt; 500</option>
                      <option value="500-1000">500 – 2,000</option>
                      <option value="2000+">2,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-error mb-1">Exam Streams</label>
                    <input
                      value={form.examFamilies}
                      onChange={(e) => updateField('examFamilies', e.target.value)}
                      placeholder="UPSC, JEE, NEET"
                      className="w-full rounded-lg border border-border px-3 py-2 text-xs text-error outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-error mb-1">Notes (Optional)</label>
                  <textarea
                    rows={2}
                    value={form.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-xs text-error outline-none focus:border-primary"
                    placeholder="Volume, proctoring, or LMS requirements..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary py-2.5 text-xs font-bold text-white hover:opacity-90"
                >
                  Submit Request →
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
