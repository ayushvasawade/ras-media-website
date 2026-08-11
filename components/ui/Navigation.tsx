'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Work', href: '#campaigns' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
]

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isCottonTheme, setIsCottonTheme] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Detect Section 2 & 3 (Cotton Scene) vs Section 4 (Dark Maroon) activation
  useEffect(() => {
    const checkSection = () => {
      const bs = document.getElementById('brand-statement')
      const ss = document.getElementById('services-showcase')
      const s4 = document.getElementById('creator-network')

      let isCotton = false

      if (bs) {
        const bsStyle = window.getComputedStyle(bs)
        if (bsStyle.display === 'flex' && bsStyle.visibility !== 'hidden' && parseFloat(bsStyle.opacity) > 0.05) {
          isCotton = true
        }
      }

      if (ss) {
        const ssStyle = window.getComputedStyle(ss)
        const bg = ssStyle.backgroundColor
        if (ssStyle.display !== 'none' && ssStyle.visibility !== 'hidden' && parseFloat(ssStyle.opacity) > 0.05) {
          const s4Style = s4 ? window.getComputedStyle(s4) : null
          const isS4Active = s4Style && s4Style.visibility !== 'hidden' && parseFloat(s4Style.opacity) > 0.4
          const isBgDark = bg && (bg.includes('61, 5, 7') || bg.includes('31, 3, 4') || bg.includes('107, 15, 18'))

          if (isS4Active || isBgDark) {
            isCotton = false
          } else {
            isCotton = true
          }
        }
      }

      setIsCottonTheme(isCotton)
    }

    const interval = setInterval(checkSection, 100)
    return () => clearInterval(interval)
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
        className={`nav-root ${scrolled ? 'scrolled' : ''} ${isCottonTheme ? 'light-theme' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#"
          className="nav-logo"
          aria-label="RAS Media — Home"
          onClick={(e) => {
            e.preventDefault();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('ras:reverse-hero-zoom'));
            }
          }}
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
          RAS MEDIA © {new Date().getFullYear()}
        </div>
      </div>
    </>
  )
}
