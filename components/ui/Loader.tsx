'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

interface LoaderProps {
  onComplete: () => void
}

type ReadyWindow = Window & {
  __rasHero13Ready?: boolean
}

const MIN_DISPLAY_MS = 800

export default function Loader({ onComplete }: LoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const capsuleRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const percentRef = useRef<HTMLSpanElement>(null)
  const taglineRef = useRef<HTMLSpanElement>(null)

  const [readyMap, setReadyMap] = useState({
    fonts: false,
    logoAsset: false,
    heroBackground: false,
  })

  const exitTriggered = useRef(false)
  const startedAt = useRef(0)
  const displayProgress = useRef({ value: 0 })

  const progress = useMemo(() => {
    const done = Object.values(readyMap).filter(Boolean).length
    return Math.round((done / Object.keys(readyMap).length) * 100)
  }, [readyMap])

  /* ── Asset readiness tracking ────────────────────────────────── */
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      onComplete()
      return
    }

    const readyWindow = window as ReadyWindow
    startedAt.current = performance.now()

    const markReady = (key: keyof typeof readyMap) => {
      setReadyMap((previous) => (previous[key] ? previous : { ...previous, [key]: true }))
    }

    const onHeroBgReady = () => markReady('heroBackground')

    if (readyWindow.__rasHero13Ready) markReady('heroBackground')

    document.fonts.ready.then(() => markReady('fonts'))

    const logoProbe = new window.Image()
    logoProbe.decoding = 'async'
    logoProbe.src = '/ras-logo.svg'
    logoProbe.onload = () => markReady('logoAsset')
    logoProbe.onerror = () => markReady('logoAsset')

    window.addEventListener('ras:hero13-ready', onHeroBgReady)

    // Safety fallback: ensure loader finishes within 1.5s max even if an event is delayed
    const fallbackTimer = window.setTimeout(() => {
      setReadyMap({ fonts: true, logoAsset: true, heroBackground: true })
    }, 1500)

    return () => {
      window.removeEventListener('ras:hero13-ready', onHeroBgReady)
      window.clearTimeout(fallbackTimer)
    }
  }, [onComplete])

  /* ── Intro animation ─────────────────────────────────────────── */
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const tl = gsap.timeline()

    tl.fromTo(
      capsuleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0.15
    )
    tl.fromTo(
      taglineRef.current,
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
      0.5
    )
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
      0.4
    )

    return () => { tl.kill() }
  }, [])

  /* ── Progress animation (logo slides + fill + counter) ─────── */
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reducedMotion ? 0 : 2

    // Smoothly tween the logo position using left %
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        left: `${progress}%`,
        duration,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    // Smoothly tween the fill width
    if (fillRef.current) {
      gsap.to(fillRef.current, {
        width: `${progress}%`,
        duration,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    // Animate the displayed counter number
    gsap.to(displayProgress.current, {
      value: progress,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.textContent = `${Math.round(displayProgress.current.value)}%`
        }
      },
    })

    /* ── Exit sequence ───────────────────────────────────────── */
    if (progress < 100 || exitTriggered.current) return

    const waitMs = Math.max(0, MIN_DISPLAY_MS - (performance.now() - startedAt.current))
    const timer = window.setTimeout(() => {
      if (exitTriggered.current) return
      exitTriggered.current = true

      const exitTl = gsap.timeline({ onComplete })

      // Flash the capsule glow
      exitTl.to('.loader-capsule-glow', {
        opacity: 0.7,
        duration: 0.3,
        ease: 'power2.in',
      })

      // Fade out tagline + percentage
      exitTl.to('.loader-tagline, .loader-percent', {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.inOut',
      }, '<0.1')

      // Scale up logo slightly and fade
      exitTl.to(logoRef.current, {
        scale: 1.15,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      }, '-=0.15')

      // Collapse capsule
      exitTl.to(capsuleRef.current, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: 'left center',
        duration: 0.5,
        ease: 'power3.inOut',
      }, '-=0.3')

      // Final overlay fade
      exitTl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      }, '-=0.2')
    }, waitMs)

    return () => window.clearTimeout(timer)
  }, [progress, onComplete])

  return (
    <div ref={overlayRef} className="loader-overlay" aria-hidden="true" role="presentation">
      {/* Film grain texture */}
      <div className="loader-noise" />

      {/* Ambient glow behind capsule */}
      <div className="loader-ambient-glow" />

      {/* Bottom-left capsule loading bar */}
      <div className="loader-capsule-area">
        <div ref={capsuleRef} className="loader-capsule">
          {/* Track fill */}
          <div ref={fillRef} className="loader-capsule-fill" />

          {/* Inner capsule glow */}
          <div className="loader-capsule-glow" />

          {/* Floor reflection */}
          <div className="loader-capsule-reflection" />

          {/* Logo indicator sliding inside the capsule */}
          <div ref={logoRef} className="loader-logo-indicator">
            <Image
              src="/ras-logo.svg"
              alt="RAS Media"
              width={64}
              height={64}
              priority
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Tagline text along the capsule */}
          <span ref={taglineRef} className="loader-tagline">
            INFLUENCER MARKETING AGENCY
          </span>

          {/* Percentage readout */}
          <span ref={percentRef} className="loader-percent">
            0%
          </span>
        </div>
      </div>
    </div>
  )
}
