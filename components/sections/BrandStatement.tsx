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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const lines = [line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current]

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    tl.fromTo(
      lines,
      { y: '105%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1.1, ease: 'power4.out', stagger: 0.1 }
    ).fromTo(
      subRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
      '-=0.4'
    )

    return () => {
      tl.kill()
    }
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
          style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.05em' }}
        >
          WE
        </span>
        <span
          ref={line2Ref}
          style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.05em' }}
        >
          CONNECT
        </span>
        <span
          ref={line3Ref}
          style={{
            display: 'block',
            overflow: 'hidden',
            paddingBottom: '0.05em',
            WebkitTextStroke: '1px rgba(245,240,238,0.2)',
            color: 'transparent',
          }}
        >
          BRANDS
        </span>
        <span
          ref={line4Ref}
          style={{ display: 'flex', alignItems: 'baseline', gap: '0.2em', overflow: 'hidden', paddingBottom: '0.05em' }}
        >
          <span className="accent">×</span>
          <span>CREATORS</span>
        </span>
      </h2>

      <p ref={subRef} className="brand-statement-sub">
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
