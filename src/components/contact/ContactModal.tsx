import { useEffect, useState } from 'react'
import {
  Building2,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  User,
  X,
} from 'lucide-react'
import { getErrorMessage, getFieldErrors } from '@/lib/axios'
import { contactService } from '@/services/contact.service'
import type {
  ContactFieldErrors,
  ContactInquiry,
  ContactResponse,
  InquiryCategory,
} from '@/types/contact'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  initialCategory?: InquiryCategory
}

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

export function ContactModal({
  isOpen,
  onClose,
  initialCategory = 'institutional',
}: ContactModalProps) {
  const [form, setForm] = useState<ContactInquiry>({
    ...defaultFormState,
    category: initialCategory,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ContactResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({})
  const [ariaStatus, setAriaStatus] = useState('')

  // Sync category & capture UTM parameters when modal opens
  useEffect(() => {
    if (!isOpen) return

    try {
      const params = new URLSearchParams(window.location.search)
      const cat = (params.get('category') as InquiryCategory) || initialCategory
      const source = params.get('utm_source')
      const medium = params.get('utm_medium')
      const campaign = params.get('utm_campaign')
      const term = params.get('utm_term')
      const content = params.get('utm_content')

      setForm((prev) => ({
        ...prev,
        category: ['institutional', 'general', 'partnership', 'support'].includes(cat)
          ? cat
          : initialCategory,
        ...(source ? { utm_source: source } : {}),
        ...(medium ? { utm_medium: medium } : {}),
        ...(campaign ? { utm_campaign: campaign } : {}),
        ...(term ? { utm_term: term } : {}),
        ...(content ? { utm_content: content } : {}),
      }))
    } catch {
      // Safe fallback
    }
  }, [isOpen, initialCategory])

  // Escape key listener & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

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

    // Phone validation (optional)
    const trimmedPhone = form.phone?.trim()
    if (trimmedPhone) {
      const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/
      if (!phoneRegex.test(trimmedPhone)) {
        errors.phone = 'Please enter a valid phone number (7-20 digits).'
      }
    }

    // Organization validation for institutional inquiries
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

    // Bot Honeypot Mitigation: silently reject automated bots
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
      setResponse(res)
      setAriaStatus('Inquiry submitted successfully.')
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

  function handleReset() {
    setForm({
      ...defaultFormState,
      category: initialCategory,
    })
    setResponse(null)
    setErrorMessage('')
    setFieldErrors({})
    setAriaStatus('')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Accessible live status announcer */}
      <div role="status" aria-live="polite" className="sr-only">
        {ariaStatus}
      </div>

      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-[#cce6e8] text-[#003439] font-sans transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full text-[#557477] hover:text-[#003439] hover:bg-[#cce6e8]/40 transition-colors cursor-pointer"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {/* Brand Header */}
        <div className="mb-4 flex items-center gap-2.5">
          <img
            src="/images/logo.jpeg"
            alt="Heftin Academy"
            className="size-7 rounded-md object-contain"
          />
          <span className="font-semibold text-sm tracking-tight text-[#001a1c]">
            Heftin Academy
          </span>
        </div>

        {response ? (
          /* =========================================
             SUCCESS VIEW (Zero redundant subtitle copy)
             ========================================= */
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-[#00828e]/10 text-[#00828e]">
              <CheckCircle2 size={26} aria-hidden="true" />
            </div>

            <h2
              id="contact-modal-title"
              className="text-2xl font-bold tracking-tight text-[#003439] font-serif"
            >
              Inquiry received
            </h2>

            {/* Official Confirmation Card */}
            <div className="my-6 rounded-xl border border-[#cce6e8] bg-[#f4fbfb] p-4 text-left text-xs space-y-2.5">
              {response.inquiry_id && (
                <div className="flex justify-between items-center">
                  <span className="text-[#557477]">Inquiry Reference:</span>
                  <strong className="font-mono text-[#00828e] font-semibold">
                    {response.inquiry_id}
                  </strong>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[#557477]">Contact Person:</span>
                <strong className="text-[#003439]">{form.name}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#557477]">Notification Email:</span>
                <strong className="text-[#003439]">{form.email}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#557477]">Response SLA:</span>
                <strong className="text-[#00828e]">Within 1 business day</strong>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 rounded-lg border border-[#cce6e8] bg-white py-2.5 px-4 text-xs font-semibold text-[#00828e] hover:bg-[#cce6e8]/20 transition-colors"
              >
                Send another inquiry
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg bg-[#00828e] py-2.5 px-4 text-xs font-semibold text-white hover:bg-[#006f79] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* =========================================
             FORM VIEW
             ========================================= */
          <>
            <div className="mb-6">
              <h2
                id="contact-modal-title"
                className="text-2xl font-bold tracking-tight text-[#003439] font-serif"
              >
                Get in touch
              </h2>
              <p className="mt-1 text-xs text-[#557477]">
                Inquire about institutional licensing, faculty test batches, or general academy access.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Invisible Bot Honeypot */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="modal-contact-hp">Leave this field blank</label>
                <input
                  id="modal-contact-hp"
                  type="text"
                  name="organization_website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.honeypot || ''}
                  onChange={(e) => updateField('honeypot', e.target.value)}
                />
              </div>

              {/* 2-Column: Full Name & Work Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="modal-contact-name"
                    className="block text-xs font-semibold text-[#003439] mb-1.5"
                  >
                    Full name <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#557477] pointer-events-none">
                      <User size={16} aria-hidden="true" />
                    </span>
                    <input
                      id="modal-contact-name"
                      type="text"
                      required
                      disabled={isLoading}
                      aria-required="true"
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={fieldErrors.name ? 'modal-name-error' : undefined}
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
                    <p id="modal-name-error" className="mt-1 text-[11px] text-[#dc2626]">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="modal-contact-email"
                    className="block text-xs font-semibold text-[#003439] mb-1.5"
                  >
                    Work email <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#557477] pointer-events-none">
                      <Mail size={16} aria-hidden="true" />
                    </span>
                    <input
                      id="modal-contact-email"
                      type="email"
                      required
                      disabled={isLoading}
                      aria-required="true"
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? 'modal-email-error' : undefined}
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
                    <p id="modal-email-error" className="mt-1 text-[11px] text-[#dc2626]">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* 2-Column: Phone & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="modal-contact-phone"
                    className="block text-xs font-semibold text-[#003439] mb-1.5"
                  >
                    Phone number <span className="text-[#557477] font-normal">(optional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#557477] pointer-events-none">
                      <Phone size={16} aria-hidden="true" />
                    </span>
                    <input
                      id="modal-contact-phone"
                      type="tel"
                      disabled={isLoading}
                      aria-invalid={Boolean(fieldErrors.phone)}
                      aria-describedby={fieldErrors.phone ? 'modal-phone-error' : undefined}
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
                    <p id="modal-phone-error" className="mt-1 text-[11px] text-[#dc2626]">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="modal-contact-category"
                    className="block text-xs font-semibold text-[#003439] mb-1.5"
                  >
                    Inquiry category <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <select
                      id="modal-contact-category"
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

              {/* Organization Field */}
              <div>
                <label
                  htmlFor="modal-contact-org"
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
                    id="modal-contact-org"
                    type="text"
                    disabled={isLoading}
                    aria-invalid={Boolean(fieldErrors.organization)}
                    aria-describedby={fieldErrors.organization ? 'modal-org-error' : undefined}
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
                  <p id="modal-org-error" className="mt-1 text-[11px] text-[#dc2626]">
                    {fieldErrors.organization}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="modal-contact-message"
                  className="block text-xs font-semibold text-[#003439] mb-1.5"
                >
                  Message &amp; requirements <span className="text-[#dc2626]">*</span>
                </label>
                <div className="relative flex">
                  <span className="absolute left-3 top-3 text-[#557477] pointer-events-none">
                    <MessageSquare size={16} aria-hidden="true" />
                  </span>
                  <textarea
                    id="modal-contact-message"
                    rows={3}
                    required
                    disabled={isLoading}
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={fieldErrors.message ? 'modal-msg-error' : undefined}
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
                  <p id="modal-msg-error" className="mt-1 text-[11px] text-[#dc2626]">
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {/* DPDP Consent */}
              <div>
                <label className="flex items-start gap-2.5 text-[11.5px] text-[#557477] leading-relaxed cursor-pointer select-none">
                  <input
                    id="modal-contact-consent"
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

              {/* Error Banner */}
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-lg bg-[#001a1c] p-3 text-xs text-white"
                >
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                id="modalContactSubmitBtn"
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
          </>
        )}
      </div>
    </div>
  )
}
