'use client'

import { useEffect, useState, useRef } from 'react'

const NEED_OPTIONS = [
  'Influencer Marketing',
  'Creator Campaign',
  'Content Production',
  'Talent / Creator Collaboration',
  'Social Media Campaign',
  'Brand Campaign',
  'Other',
]

const BUDGET_OPTIONS = [
  'Under ₹50K',
  '₹50K – ₹1L',
  '₹1L – ₹5L',
  '₹5L – ₹10L',
  '₹10L+',
  'Not decided yet',
]

const TIMELINE_OPTIONS = [
  'ASAP',
  'Within 2 weeks',
  'Within 1 month',
  '1–3 months',
  'Flexible',
]

export default function CampaignModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    workEmail: '',
    phone: '',
    campaignName: '',
    need: '',
    budget: '',
    timeline: '',
    website: '',
    brief: '',
    message: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const modalRef = useRef<HTMLDivElement>(null)

  // Listen for global event to open modal
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      setIsSuccess(false)
      setErrors({})
    }

    const handleClose = () => {
      setIsOpen(false)
    }

    window.addEventListener('ras:open-campaign-modal', handleOpen)
    window.addEventListener('ras:close-campaign-modal', handleClose)

    return () => {
      window.removeEventListener('ras:open-campaign-modal', handleOpen)
      window.removeEventListener('ras:close-campaign-modal', handleClose)
    }
  }, [])

  // Lock body scroll when modal is open and handle ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false)
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }

    if (!formData.workEmail.trim()) {
      newErrors.workEmail = 'Work email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail.trim())) {
      newErrors.workEmail = 'Please provide a valid work email'
    }

    if (!formData.need) {
      newErrors.need = 'Please select what you need'
    }

    if (!formData.brief.trim()) {
      newErrors.brief = 'Project / campaign brief is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setIsSuccess(true)
        setFormData({
          fullName: '',
          companyName: '',
          workEmail: '',
          phone: '',
          campaignName: '',
          need: '',
          budget: '',
          timeline: '',
          website: '',
          brief: '',
          message: '',
        })
      } else {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setErrors({ submit: data.error || 'Failed to submit form' })
        }
      }
    } catch (err) {
      console.error(err)
      setErrors({ submit: 'Something went wrong. Please try again or email us directly.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="campaign-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="campaign-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false)
      }}
    >
      <div ref={modalRef} className="campaign-modal-card">
        {/* Header with Title and Close Button */}
        <div className="campaign-modal-header">
          <div>
            <span className="campaign-modal-eyebrow">
              <span className="campaign-modal-eyebrow-line" />
              01 / INQUIRY
            </span>
            <h2 id="campaign-modal-title" className="campaign-modal-title">
              START A <span className="highlight">CAMPAIGN.</span>
            </h2>
          </div>

          <button
            type="button"
            className="campaign-modal-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close campaign inquiry form"
          >
            ×
          </button>
        </div>

        {isSuccess ? (
          <div className="campaign-modal-success">
            <div className="campaign-modal-success-icon">✓</div>
            <h3 className="campaign-modal-success-title">
              Thanks — your campaign brief has been received.
            </h3>
            <p className="campaign-modal-success-text">
              We&apos;ll be in touch shortly.
            </p>
            <button
              type="button"
              className="campaign-modal-success-btn"
              onClick={() => setIsOpen(false)}
            >
              CLOSE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="campaign-modal-form" noValidate>
            {errors.submit && (
              <div className="campaign-form-error-banner">
                {errors.submit}
              </div>
            )}

            {/* 2-Column Responsive Form Grid */}
            <div className="campaign-form-grid">
              {/* Full Name * */}
              <div className="campaign-form-group">
                <label htmlFor="fullName" className="campaign-form-label">
                  FULL NAME <span className="req">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Maya Lin"
                  className={`campaign-form-input ${errors.fullName ? 'has-error' : ''}`}
                  autoFocus
                />
                {errors.fullName && <span className="campaign-form-error">{errors.fullName}</span>}
              </div>

              {/* Company Name * */}
              <div className="campaign-form-group">
                <label htmlFor="companyName" className="campaign-form-label">
                  COMPANY NAME <span className="req">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Nike / Spotify / Brand Co"
                  className={`campaign-form-input ${errors.companyName ? 'has-error' : ''}`}
                />
                {errors.companyName && <span className="campaign-form-error">{errors.companyName}</span>}
              </div>

              {/* Work Email * */}
              <div className="campaign-form-group">
                <label htmlFor="workEmail" className="campaign-form-label">
                  WORK EMAIL <span className="req">*</span>
                </label>
                <input
                  id="workEmail"
                  type="email"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                  placeholder="maya@company.com"
                  className={`campaign-form-input ${errors.workEmail ? 'has-error' : ''}`}
                />
                {errors.workEmail && <span className="campaign-form-error">{errors.workEmail}</span>}
              </div>

              {/* Phone Number */}
              <div className="campaign-form-group">
                <label htmlFor="phone" className="campaign-form-label">
                  PHONE NUMBER <span className="opt">(OPTIONAL)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="campaign-form-input"
                />
              </div>

              {/* What do you need? * (Full Width) */}
              <div className="campaign-form-group full-width">
                <label htmlFor="need" className="campaign-form-label">
                  WHAT DO YOU NEED? <span className="req">*</span>
                </label>
                <select
                  id="need"
                  name="need"
                  value={formData.need}
                  onChange={handleChange}
                  className={`campaign-form-select ${errors.need ? 'has-error' : ''}`}
                >
                  <option value="">Select an option...</option>
                  {NEED_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.need && <span className="campaign-form-error">{errors.need}</span>}
              </div>

              {/* Budget Range */}
              <div className="campaign-form-group">
                <label htmlFor="budget" className="campaign-form-label">
                  BUDGET RANGE <span className="opt">(OPTIONAL)</span>
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="campaign-form-select"
                >
                  <option value="">Select budget range...</option>
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timeline */}
              <div className="campaign-form-group">
                <label htmlFor="timeline" className="campaign-form-label">
                  TIMELINE <span className="opt">(OPTIONAL)</span>
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="campaign-form-select"
                >
                  <option value="">Select target timeline...</option>
                  {TIMELINE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campaign / Project Name */}
              <div className="campaign-form-group">
                <label htmlFor="campaignName" className="campaign-form-label">
                  CAMPAIGN NAME <span className="opt">(OPTIONAL)</span>
                </label>
                <input
                  id="campaignName"
                  type="text"
                  name="campaignName"
                  value={formData.campaignName}
                  onChange={handleChange}
                  placeholder="e.g. Summer Creator Drop 2026"
                  className="campaign-form-input"
                />
              </div>

              {/* Website / Social Media */}
              <div className="campaign-form-group">
                <label htmlFor="website" className="campaign-form-label">
                  WEBSITE / SOCIAL LINK <span className="opt">(OPTIONAL)</span>
                </label>
                <input
                  id="website"
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://brand.com or @handle"
                  className="campaign-form-input"
                />
              </div>

              {/* Project / Campaign Brief * (Full Width) */}
              <div className="campaign-form-group full-width">
                <label htmlFor="brief" className="campaign-form-label">
                  PROJECT / CAMPAIGN BRIEF <span className="req">*</span>
                </label>
                <textarea
                  id="brief"
                  name="brief"
                  rows={4}
                  value={formData.brief}
                  onChange={handleChange}
                  placeholder="Tell us about your brand goals, target audience, deliverables, or creative direction..."
                  className={`campaign-form-textarea ${errors.brief ? 'has-error' : ''}`}
                />
                {errors.brief && <span className="campaign-form-error">{errors.brief}</span>}
              </div>

              {/* Additional Message (Full Width) */}
              <div className="campaign-form-group full-width">
                <label htmlFor="message" className="campaign-form-label">
                  ADDITIONAL MESSAGE <span className="opt">(OPTIONAL)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={2}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any extra context, talent references, or links you'd like to share..."
                  className="campaign-form-textarea"
                />
              </div>
            </div>

            {/* Footer / Submit Button */}
            <div className="campaign-form-footer">
              <div className="campaign-form-disclaimer">
                We respect your privacy. No spam. You’ll hear from our team within 24 hours.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="campaign-form-submit-btn"
              >
                {isSubmitting ? (
                  <span>SENDING BRIEF...</span>
                ) : (
                  <>
                    <span>SEND INQUIRY</span>
                    <span className="arrow">→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
