'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PROCESS_STEPS = [
  { num: '01', title: 'Brand Brief' },
  { num: '02', title: 'Strategy' },
  { num: '03', title: 'Creator Discovery' },
  { num: '04', title: 'Content Creation' },
  { num: '05', title: 'Distribution' },
  { num: '06', title: 'Results' },
]

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    stepsRef.current.forEach((step, i) => {
      if (!step) return
      gsap.fromTo(
        step,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="process-section"
      id="process"
      aria-label="How RAS Works"
    >
      <div className="section-label" aria-hidden="true">The Process</div>

      <h2 className="text-display-md" style={{ marginBottom: '1rem' }}>
        HOW RAS WORKS
      </h2>
      <p className="text-body-lg" style={{ maxWidth: 560, marginBottom: '4rem' }}>
        A streamlined end-to-end process that takes your campaign from idea to measurable impact.
      </p>

      <div className="process-steps" role="list">
        {PROCESS_STEPS.map((step, i) => (
          <div
            key={step.num}
            ref={(el) => { stepsRef.current[i] = el }}
            className="process-step"
            style={{ opacity: 0 }}
            role="listitem"
          >
            <div className="process-step-num" aria-hidden="true">{step.num}</div>
            <div className="process-step-title">{step.title}</div>

            {/* Connector line between steps (not last) */}
            {i < PROCESS_STEPS.length - 1 && (
              <div className="process-connector" aria-hidden="true" />
            )}

            {/* Red accent on hover */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, var(--ras-red), var(--ras-maroon))',
                opacity: 0,
                transition: 'opacity 300ms ease',
              }}
              className="step-accent"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      {/* Bottom label */}
      <div
        style={{
          marginTop: '5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '3rem',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            fontWeight: 700,
            color: 'var(--ras-white)',
            letterSpacing: '-0.01em',
          }}
        >
          Every step. One team.
        </div>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, var(--ras-red), transparent)',
          }}
          aria-hidden="true"
        />
        <a
          href="#contact"
          className="btn btn-primary"
          onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
          aria-label="Start a campaign with RAS Media"
        >
          Start a Campaign
        </a>
      </div>
    </section>
  )
}
