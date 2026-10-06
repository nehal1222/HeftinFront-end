import { useState } from 'react'
import { CheckCircle2, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

type FormState = {
  orgName: string
  orgType: string
  contactName: string
  contactEmail: string
  contactPhone: string
  expectedStudents: string
}

const initialState: FormState = {
  orgName: '',
  orgType: 'coaching',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  expectedStudents: '500-1000',
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
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8 text-foreground font-sans">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-control bg-primary text-primary-foreground shadow-sm">
            <GraduationCap size={20} aria-hidden="true" />
          </div>
          <span className="font-display text-heading-sm font-semibold text-foreground-strong">
            Heftin Academy
          </span>
        </div>

        <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm">
          <h1 className="font-display text-heading-sm font-semibold text-foreground-strong">
            Request Institutional Access
          </h1>

          {submitted ? (
            <div className="mt-6 space-y-4 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-control bg-primary-soft text-primary-dark">
                <CheckCircle2 size={24} aria-hidden="true" />
              </div>
              <h2 className="font-display text-heading-sm font-semibold text-foreground-strong">
                Request Submitted
              </h2>
              <div className="pt-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center rounded-control bg-primary px-5 py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
                >
                  Go to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="req-org-name" className="block text-caption font-semibold text-foreground-strong">
                    Organization Name
                  </label>
                  <input
                    id="req-org-name"
                    required
                    value={form.orgName}
                    onChange={(e) => updateField('orgName', e.target.value)}
                    className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="req-org-type" className="block text-caption font-semibold text-foreground-strong">
                    Type
                  </label>
                  <select
                    id="req-org-type"
                    value={form.orgType}
                    onChange={(e) => updateField('orgType', e.target.value)}
                    className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm outline-none focus:border-primary"
                  >
                    <option value="coaching">Coaching Academy</option>
                    <option value="institute">College / Institute</option>
                    <option value="school">School</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="req-contact-name" className="block text-caption font-semibold text-foreground-strong">
                    Contact Person
                  </label>
                  <input
                    id="req-contact-name"
                    required
                    value={form.contactName}
                    onChange={(e) => updateField('contactName', e.target.value)}
                    className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="req-contact-email" className="block text-caption font-semibold text-foreground-strong">
                    Work Email
                  </label>
                  <input
                    id="req-contact-email"
                    type="email"
                    required
                    value={form.contactEmail}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="req-contact-phone" className="block text-caption font-semibold text-foreground-strong">
                    Phone
                  </label>
                  <input
                    id="req-contact-phone"
                    value={form.contactPhone}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                    className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="req-students" className="block text-caption font-semibold text-foreground-strong">
                    Expected Students
                  </label>
                  <input
                    id="req-students"
                    value={form.expectedStudents}
                    onChange={(e) => updateField('expectedStudents', e.target.value)}
                    className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
              >
                Submit Request
              </button>
            </form>
          )}

          <div className="mt-5 border-t border-border pt-3 text-center">
            <Link
              to={ROUTES.LOGIN}
              className="text-caption font-medium text-muted hover:text-primary transition-colors"
            >
              Already registered? Sign in
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            to={ROUTES.HOME}
            className="text-caption font-medium text-muted hover:text-foreground"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
