import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { contactService } from '@/services/contact.service'
import type { ContactInquiry, ContactResponse } from '@/types/contact'
import '@/auth.css'

export function ContactPage() {
  const [form, setForm] = useState<ContactInquiry>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    category: 'institutional',
    subject: '',
    message: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ContactResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  function updateField<K extends keyof ContactInquiry>(field: K, value: ContactInquiry[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errorMessage) setErrorMessage('')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const res = await contactService.submitContact(form)
      setResponse(res)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to dispatch inquiry.'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    setForm({
      name: '',
      email: '',
      phone: '',
      organization: '',
      category: 'institutional',
      subject: '',
      message: '',
    })
    setResponse(null)
    setErrorMessage('')
  }

  return (
    <>
      {/* ================================
           ANIMATED FLOATING BACKGROUND
      ================================= */}
      <div className="background" aria-hidden="true">
        <div className="circle circle-one" />
        <div className="circle circle-two" />
        <div className="circle circle-three" />
      </div>

      {/* ================================
           MAIN WRAPPER & UNIFIED 500PX CARD
      ================================= */}
      <main className="auth-wrapper font-sans">
        <section className="auth-card">
          {/* BRAND LOGO */}
          <div className="brand">
            <div className="brand-icon">
              <img src="/images/logo.jpeg" alt="Heftin Academy" className="brand-icon-img" />
            </div>
            <span>Heftin Academy</span>
          </div>

          {response ? (
            /* ================================
                 SUCCESS CONFIRMATION VIEW
            ================================= */
            <div style={{ textAlign: 'center', padding: '12px 4px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  margin: '0 auto 14px',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  background: 'rgba(0, 130, 142, 0.1)',
                  color: 'var(--primary)',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="auth-heading" style={{ marginBottom: '14px' }}>
                <h1 style={{ fontSize: '26px' }}>
                  <span className="line-1">Inquiry</span>
                  <span className="line-2">received</span>
                </h1>
                <p>{response.message}</p>
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  margin: '18px 0',
                  borderRadius: '10px',
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  fontSize: '11.5px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--muted)' }}>Reference Ticket:</span>
                  <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>
                    {response.ticketId ?? 'CT-REC-001'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--muted)' }}>Contact Person:</span>
                  <strong style={{ color: 'var(--error)' }}>{form.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Response SLA:</span>
                  <strong style={{ color: 'var(--primary)' }}>Within 1 business day</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  className="primary-button"
                  style={{ flex: 1, background: '#fff', color: 'var(--error)', border: '1px solid var(--border)' }}
                >
                  Send another message
                </button>
                <Link to={ROUTES.HOME} className="primary-button" style={{ flex: 1 }}>
                  Return to Home &rarr;
                </Link>
              </div>
            </div>
          ) : (
            /* ================================
                 CONTACT FORM VIEW
            ================================= */
            <>
              {/* TOP MODE TOGGLES */}
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  marginBottom: '20px',
                  padding: '4px',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  background: 'var(--white)',
                }}
              >
                <Link
                  to={ROUTES.LOGIN}
                  style={{
                    flex: 1,
                    padding: '8px 6px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    color: 'var(--error)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.SIGNUP}
                  style={{
                    flex: 1,
                    padding: '8px 6px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    color: 'var(--error)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  Activate Invite
                </Link>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '8px 6px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  Contact Us
                </button>
              </div>

              {/* HEADING */}
              <div className="auth-heading">
                <h1>
                  <span className="line-1">Get in</span>
                  <span className="line-2">touch</span>
                </h1>
                <p>
                  Have questions about institutional access, test batches, or partnerships? Send us a
                  message.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* 2-COLUMN: NAME & WORK EMAIL */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="contact-name">Full name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                      </span>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="contact-email">Work email</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="m3 7 9 6 9-6" />
                        </svg>
                      </span>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="you@institution.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                </div>

                {/* 2-COLUMN: PHONE & CATEGORY */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="contact-phone">Phone number (optional)</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </span>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="contact-category">Inquiry category</label>
                    <select
                      id="contact-category"
                      value={form.category}
                      onChange={(e) =>
                        updateField('category', e.target.value as ContactInquiry['category'])
                      }
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '10px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: '11px',
                        fontSize: '13px',
                        background: 'var(--white)',
                        color: 'var(--error)',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="institutional">Institutional Demo &amp; Licensing</option>
                      <option value="general">General Academy Inquiry</option>
                      <option value="partnership">Content &amp; Faculty Partnership</option>
                      <option value="support">Technical &amp; Session Support</option>
                    </select>
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label htmlFor="contact-message">Message &amp; requirements</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={3}
                    value={form.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Tell us about your organization, batches, or questions."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--border)',
                      borderRadius: '11px',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* ERROR FEEDBACK */}
                {errorMessage && (
                  <div className="form-message error" style={{ display: 'block', marginBottom: '14px' }}>
                    {errorMessage}
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="primary-button"
                  id="contactSubmitBtn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loader" style={{ display: 'inline-block' }} />
                      <span className="button-text">Transmitting inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span className="button-text">Submit inquiry to partnerships</span>
                      <span className="button-arrow">&rarr;</span>
                    </>
                  )}
                </button>
              </form>

              {/* DIRECT CHANNELS */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  background: 'var(--white)',
                  fontSize: '11px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ display: 'block', color: 'var(--error)' }}>
                    Direct Support Line
                  </strong>
                  <span style={{ color: 'var(--muted)' }}>hello@heftin.com &middot; Delhi, India</span>
                </div>
                <a
                  href="mailto:hello@heftin.com"
                  style={{
                    color: 'var(--primary)',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '11px',
                  }}
                >
                  Write Email &rarr;
                </a>
              </div>

              <p className="bottom-text" style={{ marginTop: '16px' }}>
                Need to access your workspace? <Link to={ROUTES.LOGIN}>Sign in</Link>
              </p>
            </>
          )}
        </section>
      </main>
    </>
  )
}
