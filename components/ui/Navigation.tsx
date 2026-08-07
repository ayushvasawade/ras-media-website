'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Work', href: '#campaigns' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`nav-root ${scrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#"
          className="nav-logo"
          aria-label="RAS Media — Home"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          <Image
            src="/ras-logo.svg"
            alt="RAS Media Logo"
            width={36}
            height={36}
            style={{ objectFit: 'contain' }}
            priority
          />
          <span className="nav-logo-text">RAS MEDIA</span>
        </a>

        {/* Desktop links */}
        <ul className="nav-links" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="nav-link"
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="nav-cta"
          onClick={(e) => { e.preventDefault(); handleNavClick('#contact') }}
          aria-label="Start a Campaign with RAS Media"
        >
          Start a Campaign
        </a>

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className="mobile-nav-links" role="list">
          {NAV_LINKS.map((link, i) => (
            <li key={link.label} style={{ transitionDelay: `${i * 60}ms` }}>
              <a
                href={link.href}
                className="mobile-nav-link"
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: '4rem' }}>
          <a
            href="#contact"
            className="btn btn-primary"
            onClick={(e) => { e.preventDefault(); handleNavClick('#contact') }}
            tabIndex={menuOpen ? 0 : -1}
          >
            Start a Campaign
          </a>
        </div>

        {/* Decorative number */}
        <div
          style={{
            position: 'absolute',
            bottom: '3rem',
            right: 'var(--section-pad-x)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.72rem',
            letterSpacing: '0.2em',
            color: 'var(--ras-white-mute)',
          }}
          aria-hidden="true"
        >
          RAS MEDIA © 2024
        </div>
      </div>
    </>
  )
}
