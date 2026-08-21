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

  /* ── Section 2 → Section 3 Zoom-Through Transition ────────────── */
  useEffect(() => {
    const section2 = document.getElementById('brand-statement')
    const section3 = document.getElementById('services-showcase')
    const scrollSpacer = scrollSpacerRef.current
    const leftContent = document.querySelector('.section-two__content') as HTMLElement | null
    const logoLayer = document.querySelector('.section-two__logo-layer') as HTMLElement | null

    if (!section2 || !section3 || !scrollSpacer) return

    // Responsive transform-origin and parameters
    const isMobile = window.innerWidth < 768
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024

    const originX = isMobile ? '50%' : isTablet ? '70%' : '75%'
    const originY = isMobile ? '45%' : isTablet ? '50%' : '50%'
    const transformOrigin = `${originX} ${originY}`

    // Device-tuned values:
    const zoomScale = isMobile ? 5 : isTablet ? 6.5 : 8
    const scrubLag = isMobile ? 0.8 : isTablet ? 1.2 : 1.5

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSpacer,
          start: 'top bottom',   // spacer top = viewport bottom → scrollY ≈ 0
          end: 'bottom bottom',  // spacer bottom = viewport bottom → scrollY = spacer height
          scrub: scrubLag,       // smooth interpolation (mobile: fast & responsive touch tracking)
          onUpdate: (self) => {
            const p = self.progress
            const active = p > 0.001

            // Toggle is-scrubbing class for CSS will-change & transition overrides
            section2.classList.toggle('is-scrubbing', active)
            section3.classList.toggle('is-scrubbing', active)

            // Toggle pointer events: Section 3 interactive only when settled
            if (p > 0.85) {
              section2.style.pointerEvents = 'none'
              section3.style.pointerEvents = 'auto'
            } else {
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

      /* ─── Phase 2: Content Drifts & Blurs (0% → 35% mob / 40% desk) ────────── */
      if (leftContent) {
        tl.fromTo(
          leftContent,
          { x: '0%', y: '0%', opacity: 1, filter: 'blur(0px)' },
          {
            x: isMobile ? '0%' : isTablet ? '-12%' : '-20%',
            y: isMobile ? '-10%' : isTablet ? '-6%' : '0%',
            opacity: 0,
            filter: isMobile ? 'blur(10px)' : isTablet ? 'blur(10px)' : 'blur(12px)',
            duration: isMobile ? 0.35 : isTablet ? 0.38 : 0.4,
            ease: 'power1.in',
          },
          0
        )
      }

      /* ─── Phase 3: Logo Layer Fades (mob: 15%→40%, desk: 25%→55%) ────────── */
      if (logoLayer) {
        tl.fromTo(
          logoLayer,
          { opacity: 1 },
          {
            opacity: 0,
            duration: isMobile ? 0.25 : isTablet ? 0.25 : 0.3,
            ease: 'power1.in',
          },
          isMobile ? 0.15 : isTablet ? 0.2 : 0.25
        )
      }

      /* ─── Phase 4: Section 2 Background Fade (mob: 38%→70%, desk: 55%→85%) ── */
      tl.fromTo(
        section2,
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          duration: isMobile ? 0.32 : isTablet ? 0.3 : 0.3,
          ease: 'none',
        },
        isMobile ? 0.38 : isTablet ? 0.45 : 0.55
      )

      /* ─── Phase 5: Section 3 Reveals Behind (mob: 50%→95%, desk: 40%→95%) ──── */
      tl.fromTo(
        section3,
        { autoAlpha: 0, scale: isMobile ? 1.03 : isTablet ? 1.04 : 1.06 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: isMobile ? 0.45 : isTablet ? 0.47 : 0.55,
          ease: 'power2.out',
        },
        isMobile ? 0.5 : isTablet ? 0.48 : 0.4
      )
    })

    // Recalculate on resize (responsive origin)
    const handleResize = () => {
      const nowMobile = window.innerWidth < 768
      const nowTablet = window.innerWidth >= 768 && window.innerWidth < 1024
      const newOriginX = nowMobile ? '50%' : nowTablet ? '70%' : '75%'
      const newOriginY = nowMobile ? '45%' : nowTablet ? '50%' : '50%'
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

    const mm = gsap.matchMedia()

    // ── DESKTOP (≥ 768px): Glides horizontally from right to left into poster ──
    mm.add('(min-width: 768px)', () => {
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

      // 1. Cinematic Background Color Transition: Cotton (#edebdd) → Maroon (#3D0507)
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

      // 3. Visual moves horizontally right to left on desktop
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

      // 4. Section 4 Poster Artwork Entrance
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

    // ── MOBILE (< 768px): Glides strictly UPWARD (x: 0) ──
    mm.add('(max-width: 767px)', () => {
      const tl34 = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSpacer34,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.8,
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

      // 1. Cinematic Background Color Transition
      tl34.to(
        section3,
        {
          backgroundColor: '#3D0507',
          duration: 1,
          ease: 'none',
        },
        0
      )

      // 2. Section 3 Content & Pattern exit: slides up
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

      // 3. Visual moves strictly UPWARD on mobile (x is locked to 0)
      tl34.to(
        sharedVisualWrap,
        {
          x: 0,
          y: '-40vh',
          scale: 0.92,
          autoAlpha: 0,
          duration: 0.65,
          ease: 'power2.in',
        },
        0.05
      )

      // 4. Section 4 Poster Artwork Entrance
      tl34.fromTo(
        section4,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.55,
          ease: 'power2.out',
        },
        0.4
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
          0.42
        )
      }
    })

    return () => mm.revert()
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
