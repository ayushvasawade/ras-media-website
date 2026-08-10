'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Hero13TunnelBackground from '@/components/sections/Hero13TunnelBackground'

gsap.registerPlugin(ScrollTrigger)

const RASLogo3D = dynamic(() => import('@/components/3d/RASLogo3D'), { ssr: false })

interface HeroProps {
  transitionProgressRef?: React.MutableRefObject<number>
  loaderDone?: boolean
}

export default function Hero({ transitionProgressRef, loaderDone = false }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const shadeRef = useRef<HTMLDivElement>(null)

  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const logoScrollProgress = useRef(0)
  const introProgress = useRef(0)
  const internalTransitionProgressRef = useRef(0)
  const resolvedTransitionProgressRef = transitionProgressRef ?? internalTransitionProgressRef
  const [isMobile, setIsMobile] = useState(false)

  const setTransitionProgress = useCallback((value: number) => {
    if (transitionProgressRef) {
      transitionProgressRef.current = value
      return
    }
    internalTransitionProgressRef.current = value
  }, [transitionProgressRef])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mq.matches)
    update()

    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      mouseX.current = (event.clientX / window.innerWidth - 0.5) * 2
      mouseY.current = (event.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useEffect(() => {
    if (!loaderDone) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const titleLines = titleRef.current
      ? Array.from(titleRef.current.querySelectorAll('.hero-word'))
      : []

    if (reducedMotion) {
      introProgress.current = 1
      gsap.set([titleRef.current, ...titleLines], { clearProps: 'all' })
      return
    }

    const entryTl = gsap.timeline()

    entryTl.to(introProgress, { current: 1, duration: 1, ease: 'power2.out' }, 0)
    entryTl.fromTo(
      titleRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
      0.12
    )
    entryTl.fromTo(
      titleLines,
      { yPercent: 115 },
      { yPercent: 0, duration: 1, stagger: 0.09, ease: 'power4.out' },
      0.2
    )

    return () => {
      entryTl.kill()
    }
  }, [loaderDone])

  useEffect(() => {
    const section = sectionRef.current
    const scene = sceneRef.current
    const title = titleRef.current
    const shade = shadeRef.current
    if (!section || !scene || !title || !shade) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const pinDistance = window.innerHeight * (isMobile ? 0.8 : 1.2)

    if (reducedMotion) {
      setTransitionProgress(0)
      return
    }

    const zoomTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${pinDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          logoScrollProgress.current = p
          setTransitionProgress(p)
        },
      },
    })

    zoomTl.to(scene, { scale: isMobile ? 1.08 : 1.18, duration: 1, ease: 'none' }, 0)
    zoomTl.to(title, { yPercent: -7, scale: 1.08, opacity: 0.46, duration: 1, ease: 'none' }, 0)
    zoomTl.to(shade, { opacity: 0.58, duration: 1, ease: 'none' }, 0.32)

    return () => {
      zoomTl.kill()
    }
  }, [setTransitionProgress])

  return (
    <section ref={sectionRef} id="hero" className="hero-scene" aria-label="RAS Media Hero">
      <div className="hero-base" aria-hidden="true" />
      <Hero13TunnelBackground className="hero13-layer" />

      <div ref={sceneRef} className="hero-scene-content">
        <div className="hero-logo-layer" aria-hidden="true">
          <RASLogo3D
            mouseX={mouseX}
            mouseY={mouseY}
            scrollProgress={logoScrollProgress}
            transitionProgress={resolvedTransitionProgressRef}
            introProgress={introProgress}
            scale={8}
            isMobile={isMobile}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        <div className="hero-copy-wrap">
          <h1 ref={titleRef} className="hero-main-title" aria-label="Make people talk">
            <span className="hero-title-line">
              <span className="hero-word">MAKE</span>
            </span>
            <span className="hero-title-line">
              <span className="hero-word">PEOPLE</span>
            </span>
            <span className="hero-title-line">
              <span className="hero-word">TALK.</span>
            </span>
          </h1>
        </div>
      </div>

      <div ref={shadeRef} className="hero-forward-shade" aria-hidden="true" />
    </section>
  )
}
