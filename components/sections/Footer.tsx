'use client'

import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'What We Do', href: '#services' },
  { label: 'Creator Network', href: '#network' },
  { label: 'Work', href: '#campaigns' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/rasmedia' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/rasmedia' },
  { label: 'Email', href: 'mailto:hello@rasmedia.agency' },
]

export default function Footer() {
  const handleClick = (href: string) => (e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer
      className="footer"
      id="footer"
      role="contentinfo"
      aria-label="RAS Media Footer"
    >
      <div className="footer-grid">
        {/* Brand column */}
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Image
              src="/ras-logo.svg"
              alt="RAS Media Logo"
              width={32}
              height={32}
              style={{ objectFit: 'contain' }}
            />
            <span className="footer-brand-text">RAS MEDIA</span>
          </div>
          <p className="footer-tagline">
            Influencer marketing agency connecting brands with creators who turn attention into influence.
          </p>
          <div className="footer-social" role="list" aria-label="Social media links">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="footer-social-link"
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                role="listitem"
                aria-label={`RAS Media on ${link.label}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation column */}
        <div>
          <div className="footer-col-title" aria-hidden="true">Navigation</div>
          <ul className="footer-links" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.label} role="listitem">
                <a
                  href={link.href}
                  className="footer-link"
                  onClick={handleClick(link.href)}
                  aria-label={`Navigate to ${link.label}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services column */}
        <div>
          <div className="footer-col-title" aria-hidden="true">Services</div>
          <ul className="footer-links" role="list">
            {[
              'Influencer Marketing',
              'Creator Discovery',
              'Campaign Management',
              'Brand Activations',
              'Performance Analytics',
            ].map((service) => (
              <li key={service} role="listitem">
                <a
                  href="#services"
                  className="footer-link"
                  onClick={handleClick('#services')}
                >
                  {service}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div>
          <div className="footer-col-title" aria-hidden="true">Contact</div>
          <ul className="footer-links" role="list">
            <li role="listitem">
              <a href="mailto:hello@rasmedia.agency" className="footer-link" aria-label="Email RAS Media">
                hello@rasmedia.agency
              </a>
            </li>
            <li role="listitem">
              <a href="mailto:creators@rasmedia.agency" className="footer-link" aria-label="Join RAS creator network">
                creators@rasmedia.agency
              </a>
            </li>
          </ul>

          <div style={{ marginTop: '3rem' }}>
            <a
              href="#contact"
              className="btn btn-primary"
              onClick={handleClick('#contact')}
              aria-label="Start a campaign with RAS Media"
              style={{ fontSize: '0.72rem', padding: '0.75rem 1.5rem' }}
            >
              Start a Campaign
            </a>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © {new Date().getFullYear()} RAS Media. All rights reserved.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.72rem',
              color: 'var(--ras-white-mute)',
              letterSpacing: '0.05em',
            }}
          >
            Influencer Marketing Agency
          </span>
        </div>
      </div>
    </footer>
  )
}
