'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATEMENTS = [
  {
    not: 'NOT JUST MORE REACH.',
    yes: 'THE RIGHT REACH.',
  },
  {
    not: 'NOT JUST MORE CREATORS.',
    yes: 'THE RIGHT CREATORS.',
  },
  {
    not: 'NOT JUST CONTENT.',
    yes: 'CONTENT THAT MOVES PEOPLE.',
  },
]

export default function WhyRAS() {
  const sectionRef = useRef<HTMLElement>(null)
  const statementsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    statementsRef.current.forEach((el, i) => {
      if (!el) return
      const notEl = el.querySelector('.why-not')
      const yesEl = el.querySelector('.why-yes')
      const arrowEl = el.querySelector('.why-arrow')

      gsap.fromTo(
        [notEl, arrowEl, yesEl],
        { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
        }
      )
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="why-section"
      id="why-ras"
      aria-label="Why Choose RAS Media"
    >
      <div className="section-label" aria-hidden="true">Why RAS</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
        {STATEMENTS.map((s, i) => (
          <div
            key={i}
            ref={(el) => { statementsRef.current[i] = el }}
            className="why-statement"
            style={{ textAlign: i % 2 === 0 ? 'left' : 'right' }}
          >
            <span className="why-not" aria-hidden="true">{s.not}</span>
            <span className="why-arrow" aria-hidden="true">↓</span>
            <span className="why-yes">{s.yes}</span>
          </div>
        ))}
      </div>

      {/* Vertical red accent line */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '10%',
          bottom: '10%',
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, var(--ras-red) 30%, var(--ras-red) 70%, transparent)',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
