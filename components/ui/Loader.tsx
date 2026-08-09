'use client'

/**
 * Loader.tsx — RAS Media Cinematic Intro Loader
 *
 * Sequence:
 *  Phase 1 (0 → ~0.8s)  RAS SVG logo fades + scales in from slightly below-center
 *  Phase 2 (0.8 → 1.2s) Subtle pulse + tagline fades in
 *  Phase 3 (ongoing)     Progress bar fills as fonts + GLB load; minimum 1.2s display
 *  Phase 4 (on ready)    Exit: logo scales up + blurs out, overlay opacity → 0, onComplete()
 *
 * Respects prefers-reduced-motion (instant reveal, no animation).
 */

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

interface LoaderProps {
  onComplete: () => void
}

const MIN_DISPLAY_MS = 1200

export default function Loader({ onComplete }: LoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoWrapRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const barFillRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const exitTriggered = useRef(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const overlay = overlayRef.current
    const logoWrap = logoWrapRef.current
    const tagline = taglineRef.current

    if (!overlay || !logoWrap || !tagline) return

    // ── Reduced-motion: instant pass-through ───────────────────────────
    if (reducedMotion) {
      onComplete()
      return
    }

    // ── Track load readiness ───────────────────────────────────────────
    let fontsReady = false
    let glbReady = false
    const startTime = Date.now()

    const tryExit = () => {
      if (!fontsReady || !glbReady || exitTriggered.current) return
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)
      setTimeout(runExit, remaining)
    }

    // ── Fonts ──────────────────────────────────────────────────────────
    document.fonts.ready.then(() => {
      fontsReady = true
      setProgress((p) => Math.max(p, 50))
      tryExit()
    })

    // ── GLB ready (dispatched by RASLogo3D after clone + material setup) ─
    const onGlbReady = () => {
      glbReady = true
      setProgress(100)
      tryExit()
    }
    window.addEventListener('ras:glb-ready', onGlbReady, { once: true })

    // ── Safety: if GLB event never fires (SSR/no-JS), exit after 4s ───
    const safetyTimer = setTimeout(() => {
      glbReady = true
      setProgress(100)
      tryExit()
    }, 4000)

    // ── Entry animation ────────────────────────────────────────────────
    const entryTl = gsap.timeline()

    // Logo reveal
    entryTl
      .fromTo(
        logoWrap,
        { opacity: 0, scale: 0.78, y: 18 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out' }
      )
      // Subtle pulse
      .to(logoWrap, { scale: 1.03, duration: 0.35, ease: 'power1.inOut', yoyo: true, repeat: 1 }, '+=0.1')
      // Tagline
      .fromTo(
        tagline,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )

    // ── Progress bar: animate to 45% quickly, then wait for actual loads ─
    gsap.to(barFillRef.current, { width: '45%', duration: 0.9, ease: 'power2.out' })

    // ── Exit animation ─────────────────────────────────────────────────
    // SVG stays centered — no lateral movement. The overlay fades to
    // reveal the 3D logo already positioned behind it. Brief crossfade
    // window where both SVG and 3D are partially visible creates the
    // "flat logo gains depth" illusion.
    function runExit() {
      if (exitTriggered.current) return
      exitTriggered.current = true

      // Fill bar to 100%
      gsap.to(barFillRef.current, { width: '100%', duration: 0.4, ease: 'power2.out' })

      const exitTl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          onComplete()
        },
      })

      exitTl
        // SVG: scale up slightly (gaining depth illusion) + dissolve
        .to(logoWrap, {
          scale: 1.12,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.inOut',
        })
        // Tagline + progress bar dissolve alongside
        .to(tagline, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '<')
        .to(barFillRef.current, { opacity: 0, duration: 0.3 }, '<')
        // Grain fades
        .to('.ras-loader-grain', { opacity: 0, duration: 0.4 }, '<')
        .to('.ras-loader-glow', { opacity: 0, duration: 0.4 }, '<')
        // Overlay background fades — starts shortly after SVG so the 3D
        // logo behind the overlay becomes visible during the crossfade
        .to(
          overlay,
          { opacity: 0, duration: 0.7, ease: 'power2.inOut' },
          0.15   // starts 0.15s into the timeline (SVG already dimming)
        )
    }

    return () => {
      clearTimeout(safetyTimer)
      window.removeEventListener('ras:glb-ready', onGlbReady)
      entryTl.kill()
    }
  }, [onComplete])

  // Sync progress bar width with state
  useEffect(() => {
    if (progress > 45 && barFillRef.current) {
      gsap.to(barFillRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: 'power2.out',
      })
    }
  }, [progress])

  return (
    <div ref={overlayRef} className="ras-loader" aria-hidden="true" role="presentation">
      {/* Ambient noise grain overlay */}
      <div className="ras-loader-grain" />

      {/* Radial glow behind logo */}
      <div className="ras-loader-glow" />

      {/* Logo */}
      <div ref={logoWrapRef} className="ras-loader-logo">
        <Image
          src="/ras-logo.svg"
          alt="RAS Media"
          width={180}
          height={180}
          priority
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* Tagline */}
      <div ref={taglineRef} className="ras-loader-tagline">
        Influencer Marketing Agency
      </div>

      {/* Progress bar */}
      <div className="ras-loader-progress-track">
        <div ref={barFillRef} className="ras-loader-progress-fill" />
      </div>
    </div>
  )
}
