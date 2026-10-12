import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage, getFieldErrors } from '@/lib/axios'
import { contactService } from '@/services/contact.service'
import type { ContactFieldErrors, ContactInquiry, ContactResponse, InquiryCategory } from '@/types/contact'
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
    consent: false,
    honeypot: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ContactResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({})
  const [ariaStatus, setAriaStatus] = useState('')

  // Read URL query parameters on mount (category pre-selection & UTM marketing attribution)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const cat = params.get('category') as InquiryCategory | null
      const source = params.get('utm_source')
      const medium = params.get('utm_medium')
      const campaign = params.get('utm_campaign')
      const term = params.get('utm_term')
      const content = params.get('utm_content')

      setForm((prev) => ({
        ...prev,
        ...(cat && ['institutional', 'general', 'partnership', 'support'].includes(cat)
          ? { category: cat }
          : {}),
        ...(source ? { utm_source: source } : {}),
        ...(medium ? { utm_medium: medium } : {}),
        ...(campaign ? { utm_campaign: campaign } : {}),
        ...(term ? { utm_term: term } : {}),
        ...(content ? { utm_content: content } : {}),
      }))
    } catch {
      // Safe fallback if URL search parameters cannot be parsed
    }
  }, [])

  function updateField<K extends keyof ContactInquiry>(field: K, value: ContactInquiry[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errorMessage) setErrorMessage('')
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function validateClientSide(): ContactFieldErrors {
    const errors: ContactFieldErrors = {}

    // Name validation
    const trimmedName = form.name.trim()
    if (!trimmedName) {
      errors.name = 'Please enter your full name.'
    } else if (trimmedName.length < 2) {
      errors.name = 'Full name must be at least 2 characters.'
    } else if (trimmedName.length > 100) {
      errors.name = 'Full name cannot exceed 100 characters.'
    }

    // Email validation
    const trimmedEmail = form.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedEmail) {
      errors.email = 'Please enter your work email.'
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.'
    } else if (trimmedEmail.length > 255) {
      errors.email = 'Email cannot exceed 255 characters.'
    }

    // Phone validation (optional, but validated if entered)
    const trimmedPhone = form.phone?.trim()
    if (trimmedPhone) {
      const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/
      if (!phoneRegex.test(trimmedPhone)) {
        errors.phone = 'Please enter a valid phone number (7-20 digits).'
      }
    }

    // Organization validation (mandatory for institutional inquiries)
    if (form.category === 'institutional' && !form.organization?.trim()) {
      errors.organization = 'Please provide your institution or organization name.'
    }

    // Message validation
    const trimmedMessage = form.message.trim()
    if (!trimmedMessage) {
      errors.message = 'Please enter your message or requirements.'
    } else if (trimmedMessage.length < 10) {
      errors.message = 'Message must be at least 10 characters.'
    } else if (trimmedMessage.length > 2000) {
      errors.message = 'Message cannot exceed 2000 characters.'
    }

    // Consent validation
    if (!form.consent) {
      errors.consent = 'You must consent to be contacted to submit this inquiry.'
    }

    return errors
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setFieldErrors({})

    // Bot Honeypot Mitigation: silently reject automated bot entries
    if (form.honeypot && form.honeypot.trim() !== '') {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setErrorMessage('Unable to dispatch inquiry. Please refresh and try again.')
        setAriaStatus('Submission rejected by spam detection.')
      }, 500)
      return
    }

    // Run client-side validation
    const validationErrors = validateClientSide()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      const firstErrorMessage = Object.values(validationErrors)[0]
      setErrorMessage(firstErrorMessage || 'Please complete all required fields.')
      setAriaStatus(`Validation error: ${firstErrorMessage}`)
      return
    }

    setIsLoading(true)
    setAriaStatus('Submitting inquiry...')

    try {
      const res = await contactService.submitContact(form)
      setResponse(res)
      setAriaStatus('Inquiry submitted successfully.')
    } catch (err) {
      // Map server 422 field errors directly to their input fields
      const serverFieldErrors = getFieldErrors(err)
      if (Object.keys(serverFieldErrors).length > 0) {
        setFieldErrors(serverFieldErrors)
        const firstServerMsg = Object.values(serverFieldErrors)[0]
        setErrorMessage(firstServerMsg || 'Please correct the highlighted fields.')
        setAriaStatus(`Validation error: ${firstServerMsg}`)
      } else {
        const errorDetail = getErrorMessage(
          err,
          'Unable to dispatch inquiry. Please check your connection or contact hello@heftin.com directly.',
        )
        setErrorMessage(errorDetail)
        setAriaStatus(`Error: ${errorDetail}`)
      }
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
      consent: false,
      honeypot: '',
    })
    setResponse(null)
    setErrorMessage('')
    setFieldErrors({})
    setAriaStatus('')
  }

  return (
    <div className="legacy-auth-page">
      {/* Accessible live status announcer for screen readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {ariaStatus}
      </div>

      {/* ================================
           ANIMATED FLOATING BACKGROUND
      ================================= */}
      <div className="background" aria-hidden="true">
        <div className="circle circle-one" />
        <div className="circle circle-two" />
        <div className="circle circle-three" />
      </div>

      {/* ================================
           MAIN WRAPPER & UNIFIED CARD
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
                 APPROVED SUCCESS VIEW
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
                <p>
                  {response.message ||
                    'Thank you for reaching out. Our institutional partnerships team has received your inquiry and will contact you within 1 business day.'}
                </p>
              </div>

              <div
                style={{
                  padding: '14px 16px',
                  margin: '18px 0',
                  borderRadius: '10px',
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  fontSize: '12px',
                  textAlign: 'left',
                }}
              >
                {response.inquiry_id && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--muted)' }}>Inquiry Reference:</span>
                    <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>
                      {response.inquiry_id}
                    </strong>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--muted)' }}>Contact Person:</span>
                  <strong style={{ color: 'var(--foreground-strong, #003439)' }}>{form.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--muted)' }}>Notification Email:</span>
                  <strong style={{ color: 'var(--foreground-strong, #003439)' }}>{form.email}</strong>
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
                  style={{ flex: 1, background: '#fff', color: 'var(--primary)', border: '1.5px solid var(--border)' }}
                >
                  Send another inquiry
                </button>
                <Link to={ROUTES.HOME} className="primary-button" style={{ flex: 1 }}>
                  Return to Home &rarr;
                </Link>
              </div>
            </div>
          ) : (
            /* ================================
                 PUBLIC CONTACT FORM VIEW
            ================================= */
            <>
              {/* TOP NAVIGATION SHORTCUTS */}
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
                    color: 'var(--muted)',
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
                    color: 'var(--muted)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  Get Started
                </Link>
                <button
                  type="button"
                  disabled
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
                  Inquire about institutional licensing, faculty test batches, or general academy access.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* BOT HONEYPOT FIELD (Hidden from sighted & screen reader users) */}
                <div style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
                  <label htmlFor="contact-hp">Leave this field blank</label>
                  <input
                    id="contact-hp"
                    type="text"
                    name="organization_website_url"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.honeypot || ''}
                    onChange={(e) => updateField('honeypot', e.target.value)}
                  />
                </div>

                {/* 2-COLUMN: FULL NAME & WORK EMAIL */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="contact-name">
                      Full name <span style={{ color: 'var(--error, #e53e3e)' }}>*</span>
                    </label>
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
                        disabled={isLoading}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
                        style={fieldErrors.name ? { borderColor: 'var(--error, #e53e3e)' } : undefined}
                      />
                    </div>
                    {fieldErrors.name && (
                      <p id="contact-name-error" style={{ color: 'var(--error, #e53e3e)', fontSize: '11px', marginTop: '4px' }}>
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="contact-email">
                      Work email <span style={{ color: 'var(--error, #e53e3e)' }}>*</span>
                    </label>
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
                        disabled={isLoading}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="you@institution.com"
                        autoComplete="email"
                        style={fieldErrors.email ? { borderColor: 'var(--error, #e53e3e)' } : undefined}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p id="contact-email-error" style={{ color: 'var(--error, #e53e3e)', fontSize: '11px', marginTop: '4px' }}>
                        {fieldErrors.email}
                      </p>
                    )}
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
                        disabled={isLoading}
                        aria-invalid={Boolean(fieldErrors.phone)}
                        aria-describedby={fieldErrors.phone ? 'contact-phone-error' : undefined}
                        value={form.phone || ''}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        style={fieldErrors.phone ? { borderColor: 'var(--error, #e53e3e)' } : undefined}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p id="contact-phone-error" style={{ color: 'var(--error, #e53e3e)', fontSize: '11px', marginTop: '4px' }}>
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="contact-category">
                      Inquiry category <span style={{ color: 'var(--error, #e53e3e)' }}>*</span>
                    </label>
                    <select
                      id="contact-category"
                      disabled={isLoading}
                      value={form.category}
                      onChange={(e) =>
                        updateField('category', e.target.value as InquiryCategory)
                      }
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '10px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: '11px',
                        fontSize: '13px',
                        background: 'var(--white)',
                        color: 'var(--foreground-strong, #003439)',
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

                {/* ORGANIZATION / INSTITUTE NAME */}
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label htmlFor="contact-organization">
                    Organization / Institute name{' '}
                    {form.category === 'institutional' && (
                      <span style={{ color: 'var(--error, #e53e3e)' }}>*</span>
                    )}
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2M9 15h2M13 11h2M13 15h2" />
                      </svg>
                    </span>
                    <input
                      id="contact-organization"
                      type="text"
                      disabled={isLoading}
                      aria-invalid={Boolean(fieldErrors.organization)}
                      aria-describedby={fieldErrors.organization ? 'contact-org-error' : undefined}
                      value={form.organization || ''}
                      onChange={(e) => updateField('organization', e.target.value)}
                      placeholder="e.g. Apex IAS Academy / Delhi Coaching Institute"
                      style={fieldErrors.organization ? { borderColor: 'var(--error, #e53e3e)' } : undefined}
                    />
                  </div>
                  {fieldErrors.organization && (
                    <p id="contact-org-error" style={{ color: 'var(--error, #e53e3e)', fontSize: '11px', marginTop: '4px' }}>
                      {fieldErrors.organization}
                    </p>
                  )}
                </div>

                {/* MESSAGE & REQUIREMENTS */}
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label htmlFor="contact-message">
                    Message &amp; requirements <span style={{ color: 'var(--error, #e53e3e)' }}>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    disabled={isLoading}
                    rows={3}
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                    value={form.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Tell us about your student batches, target examinations, or inquiry details."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--border)',
                      borderRadius: '11px',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      borderColor: fieldErrors.message ? 'var(--error, #e53e3e)' : 'var(--border)',
                    }}
                  />
                  {fieldErrors.message && (
                    <p id="contact-message-error" style={{ color: 'var(--error, #e53e3e)', fontSize: '11px', marginTop: '4px' }}>
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* PRIVACY & DPDP CONSENT CHECKBOX */}
                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="contact-consent"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '11.5px',
                      color: 'var(--muted)',
                      cursor: 'pointer',
                      lineHeight: '1.4',
                    }}
                  >
                    <input
                      id="contact-consent"
                      type="checkbox"
                      disabled={isLoading}
                      checked={form.consent}
                      onChange={(e) => updateField('consent', e.target.checked)}
                      style={{ marginTop: '2px', accentColor: 'var(--primary)' }}
                    />
                    <span>
                      I agree to the Terms of Service and Privacy Policy, and consent to Heftin Academy contacting me regarding institutional demo services.
                    </span>
                  </label>
                  {fieldErrors.consent && (
                    <p style={{ color: 'var(--error, #e53e3e)', fontSize: '11px', marginTop: '4px' }}>
                      {fieldErrors.consent}
                    </p>
                  )}
                </div>

                {/* GENERAL ERROR BANNER */}
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

              {/* DIRECT FALLBACK CHANNELS */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '12px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  background: 'var(--white)',
                  fontSize: '11.5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ display: 'block', color: 'var(--foreground-strong, #003439)' }}>
                    Direct Support Line
                  </strong>
                  <span style={{ color: 'var(--muted)' }}>hello@heftin.com &middot; New Delhi, India</span>
                </div>
                <a
                  href="mailto:hello@heftin.com"
                  style={{
                    color: 'var(--primary)',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '11.5px',
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
    </div>
  )
}
