'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
]

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isCottonTheme, setIsCottonTheme] = useState(false)

  // Scroll position listener for header backdrop styling
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Detect Section 2 & 3 (Cotton Scene) on the homepage vs dark themes
  useEffect(() => {
    if (pathname !== '/') {
      setIsCottonTheme(false)
      return
    }

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
  }, [pathname])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const handleOpenCampaignModal = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ras:open-campaign-modal'))
    }
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault()
      setMenuOpen(false)
      if (typeof window !== 'undefined') {
        const bs = document.getElementById('brand-statement')
        if (bs && bs.style.display === 'flex') {
          window.dispatchEvent(new CustomEvent('ras:reverse-hero-zoom'))
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    } else {
      setMenuOpen(false)
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
        <Link
          href="/"
          className="nav-logo"
          aria-label="RAS Media — Home"
          onClick={handleLogoClick}
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
        </Link>

        {/* Desktop links */}
        <ul className="nav-links" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <button
          type="button"
          className="nav-cta"
          onClick={handleOpenCampaignModal}
          aria-label="Start a Campaign with RAS Media"
        >
          Start a Campaign
        </button>

        {/* Mobile hamburger */}
        <button
          type="button"
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
              <Link
                href={link.href}
                className={`mobile-nav-link ${pathname === link.href ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Prominent Mobile CTA */}
          <li style={{ transitionDelay: `${NAV_LINKS.length * 60}ms` }}>
            <button
              type="button"
              className="mobile-nav-cta"
              onClick={handleOpenCampaignModal}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span>START A CAMPAIGN</span>
              <span className="arrow">→</span>
            </button>
          </li>
        </ul>

        {/* Decorative footer in mobile menu */}
        <div
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: 'var(--section-pad-x)',
            right: 'var(--section-pad-x)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            color: 'var(--ras-white-mute)',
            borderTop: '1px solid rgba(237, 235, 221, 0.08)',
            paddingTop: '1.25rem',
          }}
          aria-hidden="true"
        >
          <span>RAS MEDIA AGENCY</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </>
  )
}
