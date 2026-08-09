'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const line3Ref = useRef<HTMLSpanElement>(null)
  const line4Ref = useRef<HTMLSpanElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    // The HeroTransition orchestrator drives the scroll-scrubbed reveal of these
    // elements. We only add a fallback: if this section is already in-viewport
    // on load (e.g. accessed via direct anchor), reveal without animation.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Only used as fallback — HeroTransition normally handles this
            section.classList.add('brand-statement--visible')
            observer.disconnect()
          }
        })
      },
      { threshold: 0.01 }
    )
    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="brand-statement"
      id="brand-statement"
      aria-label="Brand statement"
    >
      <div className="section-label" aria-hidden="true">Our Purpose</div>

      <h2 className="brand-statement-title" aria-label="We connect brands and creators">
        <span
          ref={line1Ref}
          data-bs-line="1"
          style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.05em', opacity: 0, transform: 'translateY(80px)' }}
        >
          WE
        </span>
        <span
          ref={line2Ref}
          data-bs-line="2"
          style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.05em', opacity: 0, transform: 'translateY(80px)' }}
        >
          CONNECT
        </span>
        <span
          ref={line3Ref}
          data-bs-line="3"
          style={{
            display: 'block',
            overflow: 'hidden',
            paddingBottom: '0.05em',
            WebkitTextStroke: '1px rgba(245,240,238,0.2)',
            color: 'transparent',
            opacity: 0,
            transform: 'translateY(80px)',
          }}
        >
          BRANDS
        </span>
        <span
          ref={line4Ref}
          data-bs-line="4"
          style={{ display: 'flex', alignItems: 'baseline', gap: '0.2em', overflow: 'hidden', paddingBottom: '0.05em', opacity: 0, transform: 'translateY(80px)' }}
        >
          <span className="accent">×</span>
          <span>CREATORS</span>
        </span>
      </h2>

      <p ref={subRef} className="brand-statement-sub" style={{ opacity: 0, transform: 'translateY(30px)' }}>
        Turning products into conversations, campaigns into communities, and attention into measurable impact.
      </p>

      {/* Decorative red line */}
      <div
        style={{
          position: 'absolute',
          right: 'var(--section-pad-x)',
          bottom: '6rem',
          width: '1px',
          height: '120px',
          background: 'linear-gradient(to bottom, var(--ras-red), transparent)',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
