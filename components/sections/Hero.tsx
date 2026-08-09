'use client'

/**
 * Hero.tsx — RAS Media Hero Section
 *
 * Architecture for the cinematic scroll transition:
 *
 *   The hero section ITSELF is pinned by GSAP for `pinDistance` extra pixels
 *   of scroll travel. During that travel:
 *
 *     Phase 1 (0 → 20%)   Hero content slides up + fades out
 *     Phase 2 (14 → 62%)  "TALK." zoom word scales from 1× → viewport-filling
 *     Phase 3 (55 → 74%)  Noir overlay rises to ~97% opacity (depth moment)
 *     Phase 4 (72 → 85%)  Noir recedes — "camera" has emerged into Section 2
 *     Phase 5 (82 → 100%) BrandStatement lines stagger in from below
 *
 *   Because the hero is the pin container (NOT a separate stage element),
 *   there is ZERO gap — the hero simply takes over the viewport longer.
 *   When the pin releases, the viewport is perfectly positioned at the top
 *   of BrandStatement, which has already been fully revealed by Phase 5.
 *
 *   Reverse: scrub:1.5 makes the entire timeline bidirectional automatically.
 */

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// No inline spinner — the full-screen Loader handles the waiting state
const RASLogo3D = dynamic(() => import('../3d/RASLogo3D'), { ssr: false })

interface HeroProps {
  transitionProgress?: React.MutableRefObject<number>
  /** Set to true by page.tsx once the Loader exits — triggers entry animation */
  loaderDone?: boolean
}

export default function Hero({ transitionProgress: transitionProgressProp, loaderDone = false }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const canvasColRef = useRef<HTMLDivElement>(null)

  // Transition overlay elements (absolutely inside the hero)
  const zoomWordRef = useRef<HTMLSpanElement>(null)
  const noirRef = useRef<HTMLDivElement>(null)

  // Internal fallback if no external ref is provided
  const internalTP = useRef(0)
  const transitionProgress = transitionProgressProp ?? internalTP

  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const scrollProgress = useRef(0)

  // Intro zoom: 0→1 during the loader-to-hero transition.
  // Drives subtle scale reduction in RASLogo3D (1.15× → 1.0×).
  const introProgress = useRef(0)

  // ─── Mouse tracking ───────────────────────────────────────────────────────
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

  // ─── Entry animation (triggered when loaderDone becomes true) ─────────
  // The 3D canvas already covers the full hero area behind the Loader
  // overlay. When the overlay fades (loaderDone), the 3D logo is already
  // visible centered on screen. This animation morphs the canvas from
  // full-viewport to its right-column position, zooms the 3D model out
  // slightly, and reveals the hero typography — all as one continuous
  // cinematic sequence.
  useEffect(() => {
    if (!loaderDone) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    const lines = titleRef.current
      ? Array.from(titleRef.current.querySelectorAll('.hero-title-inner'))
      : []

    if (!reducedMotion) {
      const tl = gsap.timeline()
      gsap.set(canvasColRef.current, { pointerEvents: 'none' })

      // Phase 1: "Camera pull-back" — canvas morphs from full-viewport
      // to the right column. The 3D logo is always centered within its
      // canvas, so it naturally moves from screen-center to column-center.
      if (!isMobile) {
        tl.to(canvasColRef.current, {
          left: '50%',
          width: '50%',
          duration: 1.3,
          ease: 'power3.inOut',
        }, 0)
      } else {
        // Mobile: canvas shrinks to bottom portion of hero
        tl.to(canvasColRef.current, {
          top: '40%',
          height: '60%',
          duration: 1.0,
          ease: 'power3.inOut',
        }, 0)
      }

      // 3D zoom-out: introProgress 0→1 (logo scale 1.15× → 1.0×)
      tl.to(introProgress, {
        current: 1,
        duration: 1.4,
        ease: 'power2.out',
      }, 0)

      // Phase 2: Hero typography reveals (staggers start partway through)
      tl.to(eyebrowRef.current, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      }, 0.5)

      if (lines.length > 0) {
        tl.to(lines, {
          y: '0%', duration: 1.0, ease: 'power4.out', stagger: 0.11,
        }, 0.55)
      }

      tl.to(subRef.current, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      }, 0.95)
      tl.to(ctasRef.current, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      }, 1.05)
      tl.to(scrollHintRef.current, { opacity: 1, duration: 0.7, onComplete: () => {
        gsap.set(canvasColRef.current, { clearProps: 'pointerEvents' })
      } }, 1.2)

      return () => { tl.kill() }
    } else {
      // Reduced motion: instant reveal, skip all animation
      if (!isMobile) {
        gsap.set(canvasColRef.current, { left: '50%', width: '50%' })
      } else {
        gsap.set(canvasColRef.current, { top: '40%', height: '60%' })
      }
      introProgress.current = 1
      gsap.set(
        [
          eyebrowRef.current,
          subRef.current,
          ctasRef.current,
          scrollHintRef.current,
          ...lines,
        ].filter(Boolean),
        { opacity: 1, y: 0 }
      )
    }
  }, [loaderDone])

  // ─── Cinematic scroll transition (pins the hero section itself) ───────────
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    // ── Reduced-motion: simple fade-in for BrandStatement ────────────────
    if (reducedMotion) {
      const bsLines = gsap.utils.toArray<HTMLElement>('[data-bs-line]')
      const bsSub = document.querySelector<HTMLElement>('.brand-statement-sub')

      const rmTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#brand-statement',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })
      rmTl.to(bsLines, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 })
      if (bsSub) rmTl.to(bsSub, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')

      return () => { rmTl.kill() }
    }

    // ── Compute TALK. scale target ────────────────────────────────────────
    // Scale is calculated so TALK. spans 1.65× the viewport width.
    // Recalculated on ResizeObserver so mobile breakpoints stay correct.
    let targetScale = 10
    const computeScale = () => {
      if (!zoomWordRef.current) return
      const wordW = Math.max(zoomWordRef.current.offsetWidth, 1)
      targetScale = (window.innerWidth * 1.65) / wordW
    }

    // Run after first paint so font is loaded + measured correctly
    requestAnimationFrame(() => {
      requestAnimationFrame(computeScale)
    })

    const ro = new ResizeObserver(() => {
      computeScale()
      ScrollTrigger.refresh()
    })
    ro.observe(document.documentElement)

    // ── Pin distance ──────────────────────────────────────────────────────
    // Desktop: 1.8× viewport height of extra scroll travel
    // Mobile:  1.0× (shorter = snappier on small screens)
    const pinDistance = window.innerHeight * (isMobile ? 1.0 : 1.8)

    // ── Targets ───────────────────────────────────────────────────────────
    const heroLeftEls = [
      eyebrowRef.current,
      titleRef.current,
      subRef.current,
      ctasRef.current,
      scrollHintRef.current,
    ].filter(Boolean)

    const bsLines = gsap.utils.toArray<HTMLElement>('[data-bs-line]')
    const bsSub = document.querySelector<HTMLElement>('.brand-statement-sub')

    // ── Build the scrubbed timeline ───────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,   // ← Hero section IS the pin container
        start: 'top top',
        end: `+=${pinDistance}`,
        pin: true,                     // Hero section gets pinned
        pinSpacing: true,              // Spacer pushed BrandStatement exactly below
        scrub: 1.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Update 3D logo scroll reference during normal hero phase
          scrollProgress.current = self.progress * 0.3

          // 3D logo transition progress (0→1 then back to 0)
          const p = self.progress
          if (p <= 0.15) {
            transitionProgress.current = 0
          } else if (p <= 0.72) {
            transitionProgress.current = gsap.utils.mapRange(0.15, 0.72, 0, 1, p)
          } else {
            transitionProgress.current = gsap.utils.mapRange(0.72, 1.0, 1, 0, p)
          }
        },
      },
    })

    // Phase 1 — Hero content slides up & fades out
    tl.to(
      heroLeftEls,
      { y: -70, opacity: 0, duration: 0.20, ease: 'power2.in' },
      0
    )
    tl.to(
      canvasColRef.current,
      { opacity: 0.06, duration: 0.22, ease: 'power1.in' },
      0.03
    )

    // Phase 2 — "TALK." zoom word: appears and scales toward camera
    tl.fromTo(
      zoomWordRef.current,
      { scale: 1, opacity: 0, transformOrigin: '50% 50%' },
      {
        scale: () => targetScale,
        opacity: 1,
        duration: 0.48,
        ease: 'power3.in',
      },
      0.14
    )

    // Phase 3 — Noir overlay: depth moment
    tl.fromTo(
      noirRef.current,
      { opacity: 0 },
      { opacity: 0.97, duration: 0.17, ease: 'power2.in' },
      0.55
    )

    // Phase 4 — Noir recedes; zoom word exits
    tl.to(noirRef.current, { opacity: 0, duration: 0.13, ease: 'power2.out' }, 0.72)
    tl.to(zoomWordRef.current, { opacity: 0, duration: 0.08 }, 0.70)

    // Phase 5 — BrandStatement emerges
    tl.to(
      bsLines,
      { opacity: 1, y: 0, duration: 0.18, ease: 'power3.out', stagger: 0.04 },
      0.82
    )
    if (bsSub) {
      tl.to(bsSub, { opacity: 1, y: 0, durati      {/* ── 3D Canvas Layer — covers full hero initially, morphs to right col ── */}
      {/* The canvas starts covering the entire hero area so the 3D logo
       * appears centered on screen (behind the Loader overlay). After
       * loaderDone, GSAP animates it to left:50% / width:50% — sliding
       * the logo into its right-column position. The model is always
       * centered within the canvas, so the movement is natural. */}
      <div
        ref={canvasColRef}
        className="hero-canvas-col"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        {/* Glow behind model */}
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
          transitionProgress={transitionProgress}
          introProgress={introProgress}
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

      {/* ── Two-column hero layout ───────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'flex-start',
          paddingTop: 'var(--nav-height)',
        }}
        className="hero-grid"
      >
        {/* LEFT: Text column */}
        <div
          className="hero-left-col"
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

        {/* RIGHT: Empty spacer (canvas is positioned absolutely) */}
        <div aria-hidden="true" />
      </div> left: '50%',
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
            transitionProgress={transitionProgress}
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

      {/* ── Cinematic Transition Overlay (inside pinned hero) ──────────── */}
      {/*
       * These elements are absolutely positioned inside the hero section.
       * When GSAP pins the hero (making it position:fixed), these fill the
       * full viewport. No separate stage element = no gap.
       */}

      {/* Zoom word container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <span
          ref={zoomWordRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 9vw, 13rem)',
            fontWeight: 700,
            lineHeight: 0.88,
            letterSpacing: '-0.03em',
            color: 'var(--ras-white)',
            whiteSpace: 'nowrap',
            transformOrigin: '50% 50%',
            opacity: 0,
            display: 'block',
            userSelect: 'none',
            willChange: 'transform, opacity',
          }}
        >
          TALK.
        </span>
      </div>

      {/* Noir overlay */}
      <div
        ref={noirRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--ras-black)',
          opacity: 0,
          zIndex: 25,
          pointerEvents: 'none',
          willChange: 'opacity',
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
