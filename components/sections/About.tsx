'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CAPABILITIES = [
  'Creator Discovery',
  'Campaign Strategy',
  'Creator Coordination',
  'Content Management',
  'Campaign Tracking',
  'Performance Reporting',
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    })

    tl.fromTo(
      headlineRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    ).fromTo(
      bodyRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
      '-=0.7'
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="about-section"
      id="about"
      aria-label="About RAS Media"
    >
      <div ref={headlineRef} style={{ opacity: 0 }}>
        <div className="section-label" aria-hidden="true">About</div>
        <h2 className="about-headline">
          WE SIT
          <br />
          BETWEEN
          <br />
          BRANDS
          <br />
          <span style={{ color: 'var(--ras-red)' }}>&amp; CULTURE.</span>
        </h2>

        {/* Decorative element */}
        <div
          style={{
            marginTop: '3rem',
            width: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, var(--ras-red), var(--ras-maroon))',
          }}
          aria-hidden="true"
        />
      </div>

      <div ref={bodyRef} style={{ opacity: 0 }}>
        <p className="about-body">
          RAS Media connects brands with relevant creators and manages influencer campaigns from discovery and negotiation to content execution and performance.
        </p>
        <p className="about-body">
          We don't just find influencers — we build campaign ecosystems that are strategically targeted, creatively executed, and analytically tracked. Every campaign we run is designed to move people, not just reach them.
        </p>

        <div
          style={{
            marginBottom: '2.5rem',
            fontFamily: 'var(--font-display)',
            fontSize: '0.72rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ras-red)',
          }}
        >
          What We Provide
        </div>

        <ul className="about-capabilities" aria-label="RAS Media capabilities">
          {CAPABILITIES.map((cap) => (
            <li key={cap} className="about-cap">
              {cap}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: '3rem' }}>
          <a
            href="#contact"
            className="btn btn-outline"
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            aria-label="Contact RAS Media"
          >
            Work With Us
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
