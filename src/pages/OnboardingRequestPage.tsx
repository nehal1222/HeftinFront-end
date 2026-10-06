import { useState } from 'react'
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

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
  examFamilies: 'UPSC',
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
    <main className="min-h-screen bg-surface px-page py-section text-foreground">
      <div className="mx-auto max-w-5xl">
        <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-primary-dark">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to home
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-card border border-border bg-surface-elevated p-6">
            <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">Public front door</p>
            <h1 className="mt-3 font-display text-heading-lg text-foreground-strong">Request access for your organization</h1>
            <p className="mt-3 text-body text-muted">
              This form creates an onboarding request only. It never creates a user, an account, or a login.
            </p>

            <div className="mt-6 space-y-4 rounded-control border border-border bg-surface p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-7 place-items-center rounded-control bg-primary-soft text-primary-dark">
                  <ShieldCheck size={15} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-body-sm font-semibold text-foreground-strong">Super Admin review</p>
                  <p className="mt-1 text-caption text-muted">Requests appear in a review queue before any org is created.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-7 place-items-center rounded-control bg-primary-soft text-primary-dark">
                  <CheckCircle2 size={15} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-body-sm font-semibold text-foreground-strong">Rate-limited and protected</p>
                  <p className="mt-1 text-caption text-muted">CAPTCHA and request throttling are part of the public flow.</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
            {submitted ? (
              <div className="space-y-4">
                <div className="grid size-12 place-items-center rounded-control bg-primary-soft text-primary-dark">
                  <CheckCircle2 size={22} aria-hidden="true" />
                </div>
                <h2 className="font-display text-heading-md text-foreground-strong">Request received</h2>
                <p className="text-body text-muted">
                  Your organization request has been logged and passed to the Heftin review queue. We will be in touch once it is reviewed.
                </p>
                <Link to={ROUTES.HOME} className="inline-flex items-center rounded-control bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark">
                  Back to home
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Organization details</p>
                  <h2 className="mt-1 font-display text-heading-md text-foreground-strong">Tell us about your org</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-body-sm font-medium text-foreground-strong">
                    Organization name
                    <input
                      required
                      value={form.orgName}
                      onChange={(event) => updateField('orgName', event.target.value)}
                      className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    />
                  </label>

                  <label className="block text-body-sm font-medium text-foreground-strong">
                    Org type
                    <select
                      value={form.orgType}
                      onChange={(event) => updateField('orgType', event.target.value)}
                      className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    >
                      <option value="coaching">Coaching</option>
                      <option value="school">School</option>
                      <option value="institute">Institute</option>
                      <option value="other">Other</option>
                    </select>
                  </label>

                  <label className="block text-body-sm font-medium text-foreground-strong">
                    Contact name
                    <input
                      required
                      value={form.contactName}
                      onChange={(event) => updateField('contactName', event.target.value)}
                      className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    />
                  </label>

                  <label className="block text-body-sm font-medium text-foreground-strong">
                    Contact email
                    <input
                      type="email"
                      required
                      value={form.contactEmail}
                      onChange={(event) => updateField('contactEmail', event.target.value)}
                      className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    />
                  </label>

                  <label className="block text-body-sm font-medium text-foreground-strong">
                    Phone
                    <input
                      value={form.contactPhone}
                      onChange={(event) => updateField('contactPhone', event.target.value)}
                      className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    />
                  </label>

                  <label className="block text-body-sm font-medium text-foreground-strong">
                    City
                    <input
                      value={form.city}
                      onChange={(event) => updateField('city', event.target.value)}
                      className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    />
                  </label>

                  <label className="block text-body-sm font-medium text-foreground-strong">
                    Expected learners
                    <input
                      value={form.expectedStudents}
                      onChange={(event) => updateField('expectedStudents', event.target.value)}
                      className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    />
                  </label>

                  <label className="block text-body-sm font-medium text-foreground-strong">
                    Exam families
                    <input
                      value={form.examFamilies}
                      onChange={(event) => updateField('examFamilies', event.target.value)}
                      className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    />
                  </label>
                </div>

                <label className="block text-body-sm font-medium text-foreground-strong">
                  Message
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(event) => updateField('message', event.target.value)}
                    className="mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    placeholder="Tell us what support and access your org needs."
                  />
                </label>

                <button type="submit" className="w-full rounded-control bg-primary px-4 py-3 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark">
                  Submit onboarding request
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
