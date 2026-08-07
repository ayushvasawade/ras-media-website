'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const RASLogo3D = dynamic(() => import('../3d/RASLogo3D'), { ssr: false })

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const scrollProgress = useRef(0)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      mouseX.current = nx
      mouseY.current = ny
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="contact-section"
      id="contact"
      aria-label="Contact RAS Media — Start a Campaign"
    >
      {/* Background 3D logo — subtle */}
      <div
        className="contact-bg-canvas"
        aria-hidden="true"
        style={{ opacity: 0.18 }}
      >
        <RASLogo3D
          mouseX={mouseX}
          mouseY={mouseY}
          scrollProgress={scrollProgress}
          scale={10}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Radial red glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(193,39,45,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div ref={contentRef} className="contact-content" style={{ opacity: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--ras-red)',
            marginBottom: '3rem',
          }}
        >
          Let's Work Together
        </div>

        <h2 className="contact-headline" aria-label="Let's make some noise">
          LET&apos;S MAKE
          <br />
          <span style={{ color: 'var(--ras-red)' }}>SOME NOISE.</span>
        </h2>

        <p className="contact-sub">
          Have a campaign in mind? Let's build something people remember. Talk to us about your brand, your goals, and the audience you want to reach.
        </p>

        <div className="contact-ctas">
          <a
            href="mailto:hello@rasmedia.agency"
            className="btn btn-primary btn-magnetic"
            data-cursor="GO"
            aria-label="Start a campaign — Email RAS Media"
          >
            Start a Campaign
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="mailto:creators@rasmedia.agency"
            className="btn btn-outline"
            aria-label="Join the RAS Creator Network"
          >
            Join Our Creator Network
          </a>
        </div>

        <div
          style={{
            marginTop: '5rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            color: 'var(--ras-white-mute)',
            letterSpacing: '0.05em',
          }}
        >
          Or reach us at{' '}
          <a
            href="mailto:hello@rasmedia.agency"
            style={{ color: 'var(--ras-white-dim)', textDecoration: 'none', borderBottom: '1px solid rgba(245,240,238,0.2)' }}
          >
            hello@rasmedia.agency
          </a>
        </div>
      </div>
    </section>
  )
}
