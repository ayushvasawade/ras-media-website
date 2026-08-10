'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

interface LoaderProps {
  onComplete: () => void
}

type ReadyWindow = Window & {
  __rasGlbReady?: boolean
  __rasHero13Ready?: boolean
}

const MIN_DISPLAY_MS = 500

export default function Loader({ onComplete }: LoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const progressLabelRef = useRef<HTMLSpanElement>(null)

  const [readyMap, setReadyMap] = useState({
    fonts: false,
    logoAsset: false,
    hero3d: false,
    heroBackground: false,
  })

  const exitTriggered = useRef(false)
  const startedAt = useRef(0)

  const progress = useMemo(() => {
    const done = Object.values(readyMap).filter(Boolean).length
    return Math.round((done / Object.keys(readyMap).length) * 100)
  }, [readyMap])

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

    const onGlbReady = () => markReady('hero3d')
    const onHeroBgReady = () => markReady('heroBackground')

    if (readyWindow.__rasGlbReady) markReady('hero3d')
    if (readyWindow.__rasHero13Ready) markReady('heroBackground')

    document.fonts.ready.then(() => markReady('fonts'))

    const logoProbe = new window.Image()
    logoProbe.decoding = 'async'
    logoProbe.src = '/ras-logo.svg'
    logoProbe.onload = () => markReady('logoAsset')
    logoProbe.onerror = () => markReady('logoAsset')

    window.addEventListener('ras:glb-ready', onGlbReady)
    window.addEventListener('ras:hero13-ready', onHeroBgReady)

    return () => {
      window.removeEventListener('ras:glb-ready', onGlbReady)
      window.removeEventListener('ras:hero13-ready', onHeroBgReady)
    }
  }, [onComplete])

  useEffect(() => {
    if (progressFillRef.current) {
      gsap.to(progressFillRef.current, {
        width: `${progress}%`,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    if (progressLabelRef.current) {
      progressLabelRef.current.textContent = `${progress}%`
    }

    if (progress < 100 || exitTriggered.current) return

    const waitMs = Math.max(0, MIN_DISPLAY_MS - (performance.now() - startedAt.current))
    const timer = window.setTimeout(() => {
      if (exitTriggered.current) return
      exitTriggered.current = true

      const exitTl = gsap.timeline({ onComplete })
      exitTl.to(logoRef.current, {
        opacity: 0,
        y: -10,
        scale: 1.04,
        duration: 0.5,
        ease: 'power2.inOut',
      })
      exitTl.to('.ras-loader-progress-track, .ras-loader-progress-meta', {
        opacity: 0,
        duration: 0.25,
      }, '<')
      exitTl.to(overlayRef.current, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.1')
    }, waitMs)

    return () => window.clearTimeout(timer)
  }, [progress, onComplete])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !logoRef.current) return

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }

    const onPointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2
      target.y = (event.clientY / window.innerHeight - 0.5) * 2
    }

    const tick = () => {
      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08

      gsap.set(logoRef.current, {
        x: current.x * 10,
        y: current.y * 8,
        rotateY: current.x * 8,
        rotateX: -current.y * 7,
      })
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <div ref={overlayRef} className="ras-loader" aria-hidden="true" role="presentation">
      <div className="ras-loader-noise" />
      <div className="ras-loader-glow" />

      <div ref={logoRef} className="ras-loader-logo" style={{ transformStyle: 'preserve-3d' }}>
        <Image
          src="/ras-logo.svg"
          alt="RAS Media"
          width={192}
          height={192}
          priority
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      <div className="ras-loader-progress-meta" aria-hidden="true">
        <span>Loading</span>
        <span ref={progressLabelRef}>0%</span>
      </div>

      <div className="ras-loader-progress-track">
        <div ref={progressFillRef} className="ras-loader-progress-fill" />
      </div>
    </div>
  )
}
