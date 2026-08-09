'use client'

/**
 * HeroTransition.tsx
 *
 * Cinematic scroll transition: Hero → BrandStatement
 *
 * Architecture:
 *   - A zero-height "stage" element sits between Hero and BrandStatement in the DOM.
 *   - GSAP ScrollTrigger pins this element and gives it `triggerLength` pixels of
 *     scroll real-estate (the animation scrub window).
 *   - Inside the pinned stage we render:
 *       1. A "zoom word" — "TALK." — that scales from normal hero size to
 *          viewport-filling, creating the "camera through text" illusion.
 *       2. A Noir overlay — a pure-black div that peaks at the zoom apex.
 *   - The BrandStatement elements (targeted by [data-bs-line]) and Hero columns
 *     (targeted by .hero-left-col, .hero-canvas-col) are animated by the same
 *     scrubbed timeline — no second GSAP context needed.
 *   - transitionProgress ref is written frame-by-frame so RASLogo3D.tsx can
 *     react to it inside its useFrame loop.
 *
 * Timeline (scroll progress 0 → 1):
 *   0.00–0.18   Hero text / eyebrow / CTAs: translateY → -60px, opacity → 0
 *   0.05–0.25   Hero canvas (3D logo): opacity dims slightly
 *   0.12–0.60   Zoom word: scale 1 → targetScale
 *   0.12–0.50   Zoom word: opacity 0.08 → 1
 *   0.55–0.72   Noir overlay: opacity 0 → 0.97
 *   0.72–0.84   Noir overlay: opacity 0.97 → 0  (camera has passed through)
 *   0.82–1.00   BrandStatement lines stagger in (translateY 80px → 0, opacity 0 → 1)
 *   0.90–1.00   BrandStatement sub: opacity 0 → 1
 *
 * Reverse: because scrub:1.5 is set, scrolling up reverses every step.
 *
 * Reduced-motion: entire pinned zoom is replaced with a simple 40px fade/slide.
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// How many viewport-heights of scroll travel the transition consumes.
// Desktop: 1.8vh, Mobile: 1.2vh — keeps mobile snappy.
const SCRUB_MULTIPLIER_DESKTOP = 1.8
const SCRUB_MULTIPLIER_MOBILE = 1.2

interface HeroTransitionProps {
  /** Shared ref written by this component; read by RASLogo3D's useFrame */
  transitionProgress: React.MutableRefObject<number>
}

export default function HeroTransition({ transitionProgress }: HeroTransitionProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const zoomWordRef = useRef<HTMLSpanElement>(null)
  const noirRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    const zoomWord = zoomWordRef.current
    const noir = noirRef.current
    if (!stage || !zoomWord || !noir) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    // ─── Reduced-motion fallback ───────────────────────────────────────
    if (reducedMotion) {
      // Simple: hero fades out, brand statement fades in, no pinning
      const bsLines = document.querySelectorAll('[data-bs-line]')
      const bsSub = document.querySelector('.brand-statement-sub')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#brand-statement',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      tl.to(bsLines, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 })
        .to(bsSub, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')

      return () => { tl.kill() }
    }

    // ─── Compute dynamic scale target ──────────────────────────────────
    // We want "TALK." to grow until its rendered width == 1.6 × viewport width.
    // This is recalculated on resize.
    let targetScale = 1

    const computeScale = () => {
      const vw = window.innerWidth
      const wordW = zoomWord.getBoundingClientRect().width || vw * 0.5
      targetScale = (vw * 1.65) / Math.max(wordW, 1)
    }
    computeScale()

    const ro = new ResizeObserver(computeScale)
    ro.observe(document.documentElement)

    // ─── Pinned scroll travel ──────────────────────────────────────────
    const multiplier = isMobile ? SCRUB_MULTIPLIER_MOBILE : SCRUB_MULTIPLIER_DESKTOP
    const pinDistance = window.innerHeight * multiplier

    // ─── Hero element targets ──────────────────────────────────────────
    const heroLeftCol = document.querySelector('.hero-left-col')
    const heroCanvasCol = document.querySelector('.hero-canvas-col')
    const heroScrollHint = document.querySelector('.hero-scroll-hint')

    // ─── BrandStatement targets ────────────────────────────────────────
    const bsLines = gsap.utils.toArray<HTMLElement>('[data-bs-line]')
    const bsSub = document.querySelector<HTMLElement>('.brand-statement-sub')

    // ─── Main scrubbed timeline ────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: `+=${pinDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Write transition progress for the 3D logo's useFrame
          // Peak depth at progress ~0.65 (zoom apex / noir moment)
          const p = self.progress
          // Ramp up 0.15→0.75, then ramp back down 0.75→1.0
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

    // Phase 1 — Hero elements move up and fade out
    tl.to(
      [heroLeftCol, heroScrollHint].filter(Boolean),
      { y: -60, opacity: 0, duration: 0.18, ease: 'power2.in' },
      0
    )
    tl.to(
      heroCanvasCol,
      { opacity: 0.1, duration: 0.25, ease: 'power1.in' },
      0.05
    )

    // Phase 2 — Zoom word scales up, camera passes through
    tl.fromTo(
      zoomWord,
      { scale: 1, opacity: 0.06, transformOrigin: '50% 50%' },
      { scale: () => targetScale, opacity: 1, duration: 0.48, ease: 'power3.in' },
      0.12
    )

    // Phase 3 — Noir overlay crescendos
    tl.fromTo(
      noir,
      { opacity: 0 },
      { opacity: 0.97, duration: 0.17, ease: 'power2.in' },
      0.55
    )

    // Phase 4 — Noir overlay recedes (camera emerged)
    tl.to(
      noir,
      { opacity: 0, duration: 0.12, ease: 'power2.out' },
      0.72
    )

    // Also fade out the zoom word behind the noir
    tl.to(
      zoomWord,
      { opacity: 0, duration: 0.08, ease: 'none' },
      0.70
    )

    // Phase 5 — BrandStatement lines stagger in
    tl.to(
      bsLines,
      {
        opacity: 1,
        y: 0,
        duration: 0.18,
        ease: 'power3.out',
        stagger: 0.04,
      },
      0.82
    )

    // Phase 6 — BrandStatement sub
    if (bsSub) {
      tl.to(
        bsSub,
        { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' },
        0.90
      )
    }

    return () => {
      tl.kill()
      ro.disconnect()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [transitionProgress])

  return (
    <>
      {/* ── Stage: pinned container ──────────────────────────────────── */}
      <div
        ref={stageRef}
        className="hero-transition-stage"
        aria-hidden="true"
      >
        {/* Noir overlay */}
        <div ref={noirRef} className="ht-noir" />

        {/* Zoom word — "TALK." lifted from the hero headline */}
        <div className="ht-zoom-word-wrapper">
          <span ref={zoomWordRef} className="ht-zoom-word">
            TALK.
          </span>
        </div>
      </div>
    </>
  )
}
