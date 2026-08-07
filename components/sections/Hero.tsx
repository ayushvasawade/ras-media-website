'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const RASLogo3D = dynamic(() => import('../3d/RASLogo3D'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          border: '1px solid rgba(193,39,45,0.3)',
          borderTopColor: '#C1272D',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
    </div>
  ),
})

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const canvasColRef = useRef<HTMLDivElement>(null)

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

    const tl = gsap.timeline({ delay: 0.2 })
    const lines = titleRef.current
      ? Array.from(titleRef.current.querySelectorAll('.hero-title-inner'))
      : []

    if (!reducedMotion) {
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })

      if (lines.length > 0) {
        tl.to(
          lines,
          { y: '0%', duration: 1.1, ease: 'power4.out', stagger: 0.12 },
          '-=0.4'
        )
      }

      tl.to(subRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5')
        .to(ctasRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .fromTo(
          canvasColRef.current,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
          '-=1.0'
        )
        .to(scrollHintRef.current, { opacity: 1, duration: 0.8 }, '-=0.3')
    } else {
      gsap.set(
        [eyebrowRef.current, subRef.current, ctasRef.current, scrollHintRef.current, canvasColRef.current, ...lines].filter(Boolean),
        { opacity: 1, y: 0 }
      )
    }

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollProgress.current = self.progress
      },
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="hero"
      id="hero"
      aria-label="RAS Media Hero Section"
      style={{ alignItems: 'stretch', padding: 0 }}
    >
      {/* Subtle background noise / gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 60% 50%, rgba(107,15,18,0.12) 0%, transparent 65%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* ── Two-column hero layout ───────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          paddingTop: 'var(--nav-height)',
        }}
        className="hero-grid"
      >
        {/* ── LEFT: Text column ───────────────────────────── */}
        <div
          style={{
            padding: 'clamp(3rem, 6vw, 7rem) clamp(1.5rem, 4vw, 5rem) clamp(3rem, 6vw, 7rem) var(--section-pad-x)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div ref={eyebrowRef} className="hero-eyebrow" role="text" style={{ opacity: 0 }}>
            Influencer Marketing Agency
          </div>

          <h1
            ref={titleRef}
            className="hero-title"
            aria-label="Make people talk about your brand"
          >
            <span className="hero-title-line">
              <span className="hero-title-inner">MAKE</span>
            </span>
            <span className="hero-title-line">
              <span className="hero-title-inner">PEOPLE</span>
            </span>
            <span className="hero-title-line">
              <span className="hero-title-inner">
                TALK.<span style={{ color: 'var(--ras-red)' }}>_</span>
              </span>
            </span>
          </h1>

          <p ref={subRef} className="hero-sub" style={{ opacity: 0, marginTop: '2.5rem' }}>
            RAS Media connects brands with creators who turn attention into influence. From discovery to execution — we manage it all.
          </p>

          <div ref={ctasRef} className="hero-ctas" style={{ opacity: 0, marginTop: '2.5rem' }}>
            <a
              href="#contact"
              className="btn btn-primary btn-magnetic"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              data-cursor="GO"
              aria-label="Start a Campaign with RAS Media"
            >
              Start a Campaign
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#services"
              className="btn btn-outline"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })
              }}
              aria-label="Explore RAS Media services"
            >
              Explore RAS
            </a>
          </div>
        </div>

        {/* ── RIGHT: 3D Logo column ────────────────────────── */}
        <div
          ref={canvasColRef}
          aria-hidden="true"
          style={{
            position: 'relative',
            height: '100vh',
            opacity: 0,
          }}
        >
          {/* Glow behind the model */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              height: '70%',
              background: 'radial-gradient(ellipse at center, rgba(193,39,45,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <RASLogo3D
            mouseX={mouseX}
            mouseY={mouseY}
            scrollProgress={scrollProgress}
            scale={8}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          />
        </div>
      </div>

      {/* Scroll hint */}
      <div ref={scrollHintRef} className="hero-scroll-hint" style={{ opacity: 0, zIndex: 3 }} aria-hidden="true">
        <div className="scroll-line" />
        <span>Scroll to explore</span>
      </div>

      {/* Vignette bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to top, var(--ras-black), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Mobile: stack vertically */
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 55vw;
          }
        }

        /* Tablet: slightly narrower canvas */
        @media (max-width: 1024px) and (min-width: 769px) {
          .hero-grid {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
        }
      `}</style>
    </section>
  )
}
