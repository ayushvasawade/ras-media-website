'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Hero13 from '@/components/originkit/hero-13'
import BrandStatement from '@/components/sections/BrandStatement'
import ServicesShowcase from '@/components/sections/ServicesShowcase'
import CreatorNetwork from '@/components/sections/CreatorNetwork'
import ClosingStatement from '@/components/sections/ClosingStatement'
import FinalFooter from '@/components/sections/FinalFooter'

// Dynamically import Loader so it never renders on the server
const Loader = dynamic(() => import('@/components/ui/Loader'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  // Loader state: becomes true when the cinematic loader completes its exit
  const [loaderDone, setLoaderDone] = useState(false)
  const scrollSpacerRef = useRef<HTMLDivElement>(null)
  const scrollSpacer34Ref = useRef<HTMLDivElement>(null)

  // Prevent scroll during the loader
  useEffect(() => {
    if (!loaderDone) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [loaderDone])

  useEffect(() => {
    // Lenis smooth scroll integration with GSAP ScrollTrigger
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null
    let tick: ((time: number) => void) | null = null

    const initLenis = async () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) return

      const { default: Lenis } = await import('lenis')

      const lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      lenis = lenisInstance

      // Sync Lenis with GSAP ScrollTrigger
      lenisInstance.on('scroll', ScrollTrigger.update)

      tick = (time: number) => {
        lenisInstance.raf(time * 1000)
      }
      gsap.ticker.add(tick)

      gsap.ticker.lagSmoothing(0)
    }

    initLenis()

    return () => {
      if (lenis) {
        lenis.destroy()
      }
      if (tick) {
        gsap.ticker.remove(tick)
      }
    }
  }, [])

  /* ── Section 2 → Section 3 Zoom-Through Transition ────────────── */
  useEffect(() => {
    const section2 = document.getElementById('brand-statement')
    const section3 = document.getElementById('services-showcase')
    const scrollSpacer = scrollSpacerRef.current
    const leftContent = document.querySelector('.section-two__content') as HTMLElement | null
    const logoLayer = document.querySelector('.section-two__logo-layer') as HTMLElement | null

    if (!section2 || !section3 || !scrollSpacer) return

    // Responsive transform-origin: on mobile, zoom center rather than right
    const isMobile = window.innerWidth < 768
    const originX = isMobile ? '50%' : '75%'
    const originY = isMobile ? '45%' : '50%'
    const transformOrigin = `${originX} ${originY}`

    // Mobile-tuned values: lower zoom, faster scrub for touch
    const zoomScale = isMobile ? 5 : 8
    const scrubLag = isMobile ? 1.0 : 1.5

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSpacer,
          start: 'top bottom',   // spacer top = viewport bottom → scrollY ≈ 0
          end: 'bottom bottom',  // spacer bottom = viewport bottom → scrollY = spacer height
          scrub: scrubLag,       // smooth interpolation (mobile: snappier)
          onUpdate: (self) => {
            const p = self.progress
            const active = p > 0.001

            // Toggle is-scrubbing class for CSS will-change & transition overrides
            section2.classList.toggle('is-scrubbing', active)
            section3.classList.toggle('is-scrubbing', active)

            // Toggle pointer events: Section 3 interactive only when mostly visible
            if (p > 0.85) {
              section2.style.pointerEvents = 'none'
              section3.style.pointerEvents = 'auto'
            } else {
              // Only restore if Section 2 is actually visible (Explore has run)
              if (section2.style.display === 'flex') {
                section2.style.pointerEvents = 'auto'
              }
              section3.style.pointerEvents = 'none'
            }
          },
        },
      })

      /* ─── Phase 1: Forward Zoom (0% → 100%) ─────────────────── */
      tl.fromTo(
        section2,
        { scale: 1, transformOrigin },
        {
          scale: zoomScale,
          duration: 1,
          ease: 'power2.in',
        },
        0
      )

      /* ─── Phase 2: Content Drifts & Blurs (0% → 40%) ────────── */
      if (leftContent) {
        tl.fromTo(
          leftContent,
          { x: '0%', y: '0%', opacity: 1, filter: 'blur(0px)' },
          {
            x: isMobile ? '0%' : '-20%',
            y: isMobile ? '-12%' : '0%',
            opacity: 0,
            filter: isMobile ? 'blur(8px)' : 'blur(12px)',
            duration: isMobile ? 0.3 : 0.4,
            ease: 'power1.in',
          },
          0
        )
      }

      /* ─── Phase 3: Logo Layer Fades (mobile: earlier) ────────── */
      if (logoLayer) {
        tl.fromTo(
          logoLayer,
          { opacity: 1 },
          {
            opacity: 0,
            duration: isMobile ? 0.25 : 0.3,
            ease: 'power1.in',
          },
          isMobile ? 0.15 : 0.25
        )
      }

      /* ─── Phase 4: Section 2 Fades to Transparent (55% → 85%) ── */
      tl.fromTo(
        section2,
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          duration: 0.3,
          ease: 'none',
        },
        isMobile ? 0.45 : 0.55
      )

      /* ─── Phase 5: Section 3 Reveals Behind (40% → 95%) ──────── */
      tl.fromTo(
        section3,
        { autoAlpha: 0, scale: isMobile ? 1.03 : 1.06 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.55,
          ease: 'power2.out',
        },
        isMobile ? 0.35 : 0.4
      )
    })

    // Recalculate on resize (responsive origin)
    const handleResize = () => {
      const nowMobile = window.innerWidth < 768
      const newOriginX = nowMobile ? '50%' : '75%'
      const newOriginY = nowMobile ? '45%' : '50%'
      if (section2) {
        gsap.set(section2, { transformOrigin: `${newOriginX} ${newOriginY}` })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      ctx.revert()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  /* ── Section 3 → Section 4 Shared Visual & Color Transition ───── */
  useEffect(() => {
    const section3 = document.getElementById('services-showcase')
    const section4 = document.getElementById('creator-network')
    const scrollSpacer34 = scrollSpacer34Ref.current
    const sec3Content = document.querySelector('.section-three__content') as HTMLElement | null
    const sec3PatternBg = document.querySelector('.section-three__pattern-bg') as HTMLElement | null
    const sharedVisualWrap = document.querySelector('.section-three__visual-wrap') as HTMLElement | null
    const sharedVisualCard = document.querySelector('.section-three__visual-card') as HTMLElement | null

    if (!section3 || !section4 || !scrollSpacer34 || !sharedVisualWrap) return

    const isMobile = window.innerWidth < 768

    const ctx = gsap.context(() => {
      const tl34 = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSpacer34,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1.2,
          onUpdate: (self) => {
            const p = self.progress
            if (p > 0.3) {
              section3.style.pointerEvents = 'none'
              section4.style.pointerEvents = 'auto'
              section4.style.visibility = 'visible'
              section4.style.opacity = '1'
              section4.style.zIndex = '35'
            } else {
              section3.style.pointerEvents = 'auto'
              section4.style.pointerEvents = 'none'
              section4.style.opacity = '0'
              section4.style.visibility = 'hidden'
            }
          },
        },
      })

      // 1. Cinematic Background Color Transition: Cotton (#edebdd) → Cherry Tint → Maroon → Deep Maroon (#3D0507)
      tl34.to(
        section3,
        {
          backgroundColor: '#3D0507',
          duration: 1,
          ease: 'none',
        },
        0
      )

      // 2. Section 3 Content & Pattern exit: slides up & autoAlpha hides cleanly
      if (sec3Content) {
        tl34.to(
          sec3Content,
          {
            y: -80,
            autoAlpha: 0,
            duration: 0.45,
            ease: 'power1.in',
          },
          0
        )
      }

      if (sec3PatternBg) {
        tl34.to(
          sec3PatternBg,
          {
            autoAlpha: 0,
            duration: 0.45,
            ease: 'power1.in',
          },
          0
        )
      }

      // 3. Shared Visual Component Transformation:
      // Glides from right side further to the left in a flat horizontal line, expanding in scale
      if (!isMobile) {
        tl34.to(
          sharedVisualWrap,
          {
            x: '-64vw',
            y: 0,
            yPercent: 0,
            scale: 1.05,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.1
        )

        if (sharedVisualCard) {
          tl34.to(
            sharedVisualCard,
            {
              rotateX: 0,
              rotateY: 0,
              y: 0,
              boxShadow: '0 35px 70px -15px rgba(0,0,0,0.6), 0 0 0 2px #C1272D',
              duration: 0.8,
              ease: 'power2.inOut',
            },
            0.1
          )
        }
      } else {
        tl34.to(
          sharedVisualWrap,
          {
            y: '-20vh',
            scale: 0.9,
            autoAlpha: 0.3,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.1
        )
      }

      // 4. Section 4 Poster Artwork Entrance: begins at 0.45 when Section 3 text is completely hidden
      tl34.fromTo(
        section4,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.55,
          ease: 'power2.out',
        },
        0.45
      )

      const posterWords = section4.querySelectorAll('.poster-word')
      if (posterWords.length) {
        tl34.fromTo(
          posterWords,
          { autoAlpha: 0, scale: 0.96 },
          {
            autoAlpha: 1,
            scale: 1,
            stagger: 0.03,
            duration: 0.5,
            ease: 'power2.out',
          },
          0.48
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Cinematic intro loader — unmounted after exit animation completes */}
      {!loaderDone && <Loader onComplete={() => setLoaderDone(true)} />}

      <main id="main-content" tabIndex={-1}>
        {/* Section 1: Hero */}
        <Hero13 />

        {/* Invisible scroll spacer — Section 2→3 zoom transition */}
        <div
          ref={scrollSpacerRef}
          className="section-2-3-scroll-spacer"
          aria-hidden="true"
        />

        {/* Section 2: Brand Statement */}
        <BrandStatement />

        {/* Section 3: Services Showcase */}
        <ServicesShowcase />

        {/* Invisible scroll spacer — Section 3→4 shared visual & background color transition */}
        <div
          ref={scrollSpacer34Ref}
          className="section-3-4-scroll-spacer"
          aria-hidden="true"
        />

        {/* Section 4: Creator Network */}
        <CreatorNetwork />

        {/* Section 5: Closing Statement */}
        <ClosingStatement />

        {/* Final Section: Footer */}
        <FinalFooter />
      </main>
    </>
  )
}
