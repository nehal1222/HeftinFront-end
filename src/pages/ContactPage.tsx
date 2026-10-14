import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  User,
  X,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage, getFieldErrors } from '@/lib/axios'
import { contactService } from '@/services/contact.service'
import { useAuth } from '@/hooks/useAuth'
import type {
  ContactFieldErrors,
  ContactInquiry,
  InquiryCategory,
} from '@/types/contact'
import '@/landing.css'

const SIGNUP_ROUTE = (ROUTES as Record<string, string>).SIGNUP || '/signup'
const REQUEST_ACCESS_ROUTE = (ROUTES as Record<string, string>).REQUEST_ACCESS || '/request-access'
const WORKSPACE_ROUTE = (ROUTES as Record<string, string>).WORKSPACE || ROUTES.DASHBOARD || '/dashboard'

const defaultFormState: ContactInquiry = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  category: 'institutional',
  subject: '',
  message: '',
  consent: false,
  honeypot: '',
}

export function ContactPage() {
  const { isAuthenticated, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [form, setForm] = useState<ContactInquiry>(defaultFormState)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [submissionDetails, setSubmissionDetails] = useState<{
    inquiry_id?: string
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({})
  const [ariaStatus, setAriaStatus] = useState('')

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
    } catch (_err) {
      void _err
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

    const trimmedName = form.name.trim()
    if (!trimmedName) {
      errors.name = 'Please enter your full name.'
    } else if (trimmedName.length < 2) {
      errors.name = 'Full name must be at least 2 characters.'
    } else if (trimmedName.length > 100) {
      errors.name = 'Full name cannot exceed 100 characters.'
    }

    const trimmedEmail = form.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedEmail) {
      errors.email = 'Please enter your work email.'
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.'
    } else if (trimmedEmail.length > 255) {
      errors.email = 'Email cannot exceed 255 characters.'
    }

    const trimmedPhone = form.phone?.trim()
    if (trimmedPhone) {
      const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/
      if (!phoneRegex.test(trimmedPhone)) {
        errors.phone = 'Please enter a valid phone number (7-20 digits).'
      }
    }

    if (form.category === 'institutional' && !form.organization?.trim()) {
      errors.organization = 'Please provide your institution or organization name.'
    }

    const trimmedMessage = form.message.trim()
    if (!trimmedMessage) {
      errors.message = 'Please enter your message or requirements.'
    } else if (trimmedMessage.length < 10) {
      errors.message = 'Message must be at least 10 characters.'
    } else if (trimmedMessage.length > 2000) {
      errors.message = 'Message cannot exceed 2000 characters.'
    }

    if (!form.consent) {
      errors.consent = 'You must consent to be contacted to submit this inquiry.'
    }

    return errors
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setFieldErrors({})

    if (form.honeypot && form.honeypot.trim() !== '') {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setErrorMessage('Unable to dispatch inquiry. Please refresh and try again.')
        setAriaStatus('Submission rejected by spam detection.')
      }, 500)
      return
    }

    const validationErrors = validateClientSide()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      const firstError = Object.values(validationErrors)[0]
      setErrorMessage(firstError || 'Please complete all required fields.')
      setAriaStatus(`Validation error: ${firstError}`)
      return
    }

    setIsLoading(true)
    setAriaStatus('Submitting inquiry...')

    try {
      const res = await contactService.submitContact(form)
      setSubmissionDetails({
        inquiry_id: res.inquiry_id,
      })
      setShowSuccessPopup(true)
      setAriaStatus('Inquiry submitted successfully. Thank you for contacting us!')
    } catch (err) {
      const serverFieldErrors = getFieldErrors(err)
      if (Object.keys(serverFieldErrors).length > 0) {
        setFieldErrors(serverFieldErrors)
        const firstMsg = Object.values(serverFieldErrors)[0]
        setErrorMessage(firstMsg || 'Please correct the highlighted fields.')
        setAriaStatus(`Validation error: ${firstMsg}`)
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

  function closeSuccessPopup() {
    setShowSuccessPopup(false)
    setSubmissionDetails(null)
    setForm(defaultFormState)
    setErrorMessage('')
    setFieldErrors({})
    setAriaStatus('')
  }

  return (
    <div className="landing-page-root" style={{ background: 'var(--cream, #f7faf9)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div role="status" aria-live="polite" className="sr-only">
        {ariaStatus}
      </div>

      <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="navbar-inner">
          <Link to={ROUTES.HOME} className="brand">
            <img src="/images/logo.jpeg" alt="Heftin Academy" className="brand-logo" />
            <span className="brand-name">Heftin Academy</span>
          </Link>

          <button
            type="button"
            className={`nav-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span><span></span><span></span>
          </button>

          <div className={`navbar-collapse ${isMobileMenuOpen ? 'is-open' : ''}`} id="navCollapse">
            <ul>
              <li>
                <Link to={`${ROUTES.HOME}#exams`} style={{ whiteSpace: 'nowrap' }} onClick={() => setIsMobileMenuOpen(false)}>
                  Explore
                </Link>
              </li>
              <li>
                <Link to={REQUEST_ACCESS_ROUTE} style={{ whiteSpace: 'nowrap' }} onClick={() => setIsMobileMenuOpen(false)}>
                  For Institutes
                </Link>
              </li>
              <li>
                <Link to={`${ROUTES.HOME}#about`} style={{ whiteSpace: 'nowrap' }} onClick={() => setIsMobileMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link to={`${ROUTES.HOME}#product`} style={{ whiteSpace: 'nowrap' }} onClick={() => setIsMobileMenuOpen(false)}>
                  Product
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CONTACT}
                  style={{ whiteSpace: 'nowrap', color: 'var(--teal, #00828e)', fontWeight: 700 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className="nav-actions-inner" style={{ whiteSpace: 'nowrap' }}>
              <Link to={REQUEST_ACCESS_ROUTE} className="go-premium" style={{ whiteSpace: 'nowrap' }}>
                Go Premium
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to={WORKSPACE_ROUTE} className="login" style={{ whiteSpace: 'nowrap' }}>
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="start-button"
                    style={{ whiteSpace: 'nowrap', cursor: 'pointer', border: 'none' }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} className="login" style={{ whiteSpace: 'nowrap' }}>
                    Login
                  </Link>
                  <Link to={SIGNUP_ROUTE} className="start-button" style={{ whiteSpace: 'nowrap' }}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center py-12 sm:py-16 px-4">
        <div className="w-full max-w-xl rounded-2xl bg-white p-6 sm:p-10 shadow-lg border border-[#cce6e8] text-[#003439] font-sans">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#003439] font-serif">
              Get in touch
            </h1>
            <p className="mt-1 text-xs text-[#557477]">
              Inquire about institutional licensing, faculty test batches, or general academy access.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="sr-only" aria-hidden="true">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-[#003439] mb-1.5"
                    >
                      Full name <span className="text-[#dc2626]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#557477] pointer-events-none">
                        <User size={16} aria-hidden="true" />
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
                        className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-xs text-[#001a1c] placeholder-[#557477]/60 outline-none transition-colors ${
                          fieldErrors.name
                            ? 'border-[#dc2626] focus:border-[#dc2626]'
                            : 'border-[#cce6e8] focus:border-[#00828e]'
                        }`}
                      />
                    </div>
                    {fieldErrors.name && (
                      <p id="contact-name-error" className="mt-1 text-[11px] text-[#dc2626]">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-[#003439] mb-1.5"
                    >
                      Work email <span className="text-[#dc2626]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#557477] pointer-events-none">
                        <Mail size={16} aria-hidden="true" />
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
                        placeholder="you@institution.co"
                        autoComplete="email"
                        className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-xs text-[#001a1c] placeholder-[#557477]/60 outline-none transition-colors ${
                          fieldErrors.email
                            ? 'border-[#dc2626] focus:border-[#dc2626]'
                            : 'border-[#cce6e8] focus:border-[#00828e]'
                        }`}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p id="contact-email-error" className="mt-1 text-[11px] text-[#dc2626]">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-semibold text-[#003439] mb-1.5"
                    >
                      Phone number <span className="text-[#557477] font-normal">(optional)</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#557477] pointer-events-none">
                        <Phone size={16} aria-hidden="true" />
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
                        className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-xs text-[#001a1c] placeholder-[#557477]/60 outline-none transition-colors ${
                          fieldErrors.phone
                            ? 'border-[#dc2626] focus:border-[#dc2626]'
                            : 'border-[#cce6e8] focus:border-[#00828e]'
                        }`}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p id="contact-phone-error" className="mt-1 text-[11px] text-[#dc2626]">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-category"
                      className="block text-xs font-semibold text-[#003439] mb-1.5"
                    >
                      Inquiry category <span className="text-[#dc2626]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <select
                        id="contact-category"
                        disabled={isLoading}
                        value={form.category}
                        onChange={(e) => updateField('category', e.target.value as InquiryCategory)}
                        className="w-full appearance-none rounded-lg border border-[#cce6e8] bg-white py-2.5 px-3 text-xs text-[#001a1c] outline-none focus:border-[#00828e] transition-colors cursor-pointer"
                      >
                        <option value="institutional">Institutional Access &amp; Licensing</option>
                        <option value="general">General Academy Inquiry</option>
                        <option value="partnership">Content &amp; Faculty Partnership</option>
                        <option value="support">Technical &amp; Session Support</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 text-[#557477]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-org"
                    className="block text-xs font-semibold text-[#003439] mb-1.5"
                  >
                    Organization / Institute name{' '}
                    {form.category === 'institutional' ? (
                      <span className="text-[#dc2626]">*</span>
                    ) : (
                      <span className="text-[#557477] font-normal">(optional)</span>
                    )}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#557477] pointer-events-none">
                      <Building2 size={16} aria-hidden="true" />
                    </span>
                    <input
                      id="contact-org"
                      type="text"
                      disabled={isLoading}
                      aria-invalid={Boolean(fieldErrors.organization)}
                      aria-describedby={fieldErrors.organization ? 'contact-org-error' : undefined}
                      value={form.organization || ''}
                      onChange={(e) => updateField('organization', e.target.value)}
                      placeholder="e.g. Apex IAS Academy / Delhi Coaching Institute"
                      className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-xs text-[#001a1c] placeholder-[#557477]/60 outline-none transition-colors ${
                        fieldErrors.organization
                          ? 'border-[#dc2626] focus:border-[#dc2626]'
                          : 'border-[#cce6e8] focus:border-[#00828e]'
                      }`}
                    />
                  </div>
                  {fieldErrors.organization && (
                    <p id="contact-org-error" className="mt-1 text-[11px] text-[#dc2626]">
                      {fieldErrors.organization}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-[#003439] mb-1.5"
                  >
                    Message &amp; requirements <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="relative flex">
                    <span className="absolute left-3 top-3 text-[#557477] pointer-events-none">
                      <MessageSquare size={16} aria-hidden="true" />
                    </span>
                    <textarea
                      id="contact-message"
                      rows={3}
                      required
                      disabled={isLoading}
                      aria-required="true"
                      aria-invalid={Boolean(fieldErrors.message)}
                      aria-describedby={fieldErrors.message ? 'contact-msg-error' : undefined}
                      value={form.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      placeholder="Tell us about your student batches, target examinations, or inquiry details."
                      className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-xs text-[#001a1c] placeholder-[#557477]/60 outline-none transition-colors resize-y ${
                        fieldErrors.message
                          ? 'border-[#dc2626] focus:border-[#dc2626]'
                          : 'border-[#cce6e8] focus:border-[#00828e]'
                      }`}
                    />
                  </div>
                  {fieldErrors.message && (
                    <p id="contact-msg-error" className="mt-1 text-[11px] text-[#dc2626]">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-2.5 text-[11.5px] text-[#557477] leading-relaxed cursor-pointer select-none">
                    <input
                      id="contact-consent"
                      type="checkbox"
                      disabled={isLoading}
                      checked={form.consent}
                      onChange={(e) => updateField('consent', e.target.checked)}
                      className="mt-0.5 size-3.5 rounded border-[#cce6e8] text-[#00828e] focus:ring-[#00828e] cursor-pointer"
                    />
                    <span>
                      I agree to the Terms of Service and Privacy Policy, and consent to Heftin Academy contacting me regarding my inquiry.
                    </span>
                  </label>
                  {fieldErrors.consent && (
                    <p className="mt-1 text-[11px] text-[#dc2626]">
                      {fieldErrors.consent}
                    </p>
                  )}
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-lg bg-[#001a1c] p-3 text-xs text-white"
                  >
                    {errorMessage}
                  </div>
                )}

                <button
                  id="contactSubmitBtn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#00828e] py-3 px-4 text-xs font-semibold text-white hover:bg-[#006f79] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <span>Submit inquiry to partnerships &rarr;</span>
                  )}
                </button>
              </form>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to={ROUTES.HOME} className="brand footer-brand-logo" style={{ marginBottom: '14px' }}>
              <img src="/images/logo.jpeg" alt="Heftin Academy" className="brand-logo" />
              <span className="brand-name">Heftin Academy</span>
            </Link>
            <p>Every mock test brings you closer to rank one.</p>
            <p className="footer-contact">
              Contact: <a href="mailto:hello@heftin.com">hello@heftin.com</a>
            </p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><Link to={`${ROUTES.HOME}#product`}>Product Overview</Link></li>
              <li><Link to={`${ROUTES.LOGIN}?role=student`}>Test Series</Link></li>
              <li><Link to={WORKSPACE_ROUTE}>Performance</Link></li>
              <li><Link to={REQUEST_ACCESS_ROUTE}>Pricing</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to={`${ROUTES.HOME}#about`}>About Us</Link></li>
              <li><Link to={REQUEST_ACCESS_ROUTE}>For Institutes</Link></li>
              <li><Link to={REQUEST_ACCESS_ROUTE}>Activate Invite / Onboarding</Link></li>
              <li><Link to={ROUTES.HOME}>Careers</Link></li>
              <li><Link to={ROUTES.CONTACT}>Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to={ROUTES.LOGIN}>Organizational Portal</Link></li>
              <li><Link to={REQUEST_ACCESS_ROUTE}>Enterprise Solutions</Link></li>
              <li><Link to={REQUEST_ACCESS_ROUTE}>Tenant Governance</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Heftin Academy. All rights reserved.</p>
        </div>
      </footer>

      {showSuccessPopup && submissionDetails && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-popup-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in"
          onClick={closeSuccessPopup}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-7 sm:p-8 shadow-2xl border border-[#cce6e8] text-center font-sans transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeSuccessPopup}
              aria-label="Close message"
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-[#557477] hover:text-[#003439] hover:bg-[#cce6e8]/40 transition-colors cursor-pointer"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-[#00828e]/10 text-[#00828e]">
              <CheckCircle2 size={32} aria-hidden="true" />
            </div>

            <h2
              id="success-popup-title"
              className="text-2xl font-bold tracking-tight text-[#003439] font-serif"
            >
              Thank you for contacting us!
            </h2>

            <p className="mt-2 text-xs text-[#557477] leading-relaxed">
              We have received your message. Our team will review your inquiry and get in touch with you shortly.
            </p>

            {submissionDetails.inquiry_id && (
              <div className="my-5 rounded-xl border border-[#cce6e8] bg-[#f4fbfb] p-3 text-xs text-center">
                <span className="text-[#557477]">Inquiry Reference:</span>{' '}
                <strong className="font-mono text-[#00828e] font-semibold">
                  {submissionDetails.inquiry_id}
                </strong>
              </div>
            )}

            <div className={`flex flex-col sm:flex-row gap-2.5 ${submissionDetails.inquiry_id ? 'pt-1' : 'pt-5'}`}>
              <button
                type="button"
                onClick={closeSuccessPopup}
                className="flex-1 rounded-lg border border-[#cce6e8] bg-white py-2.5 px-4 text-xs font-semibold text-[#00828e] hover:bg-[#cce6e8]/20 transition-colors cursor-pointer"
              >
                Done
              </button>
              <Link
                to={ROUTES.HOME}
                className="flex-1 rounded-lg bg-[#00828e] py-2.5 px-4 text-xs font-semibold text-white hover:bg-[#006f79] text-center transition-colors"
              >
                Return to Home &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
