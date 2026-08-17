'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

export default function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const floatingLogoRef = useRef<HTMLDivElement>(null)
  const contentWrapperRef = useRef<HTMLDivElement>(null)

  const [isRevealed, setIsRevealed] = useState(false)

  /* ── Reveal Observer (with fallback for fixed/hidden elements) ── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let disposed = false

    const triggerReveal = () => {
      if (!disposed) {
        disposed = true
        setIsRevealed(true)
        observer?.disconnect()
        mutObs?.disconnect()
        if (pollId) clearInterval(pollId)
      }
    }

    // Primary: IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) triggerReveal()
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(section)

    // Fallback 1: MutationObserver — detect when handleExplore sets display:flex
    const mutObs = new MutationObserver(() => {
      const style = window.getComputedStyle(section)
      if (style.display !== 'none' && parseFloat(style.opacity) > 0.05) {
        triggerReveal()
      }
    })
    mutObs.observe(section, { attributes: true, attributeFilter: ['style', 'class'] })

    // Fallback 2: Polling check (covers edge cases on mobile)
    const pollId = setInterval(() => {
      const style = window.getComputedStyle(section)
      if (style.display !== 'none' && parseFloat(style.opacity) > 0.05) {
        triggerReveal()
      }
    }, 500)

    return () => {
      disposed = true
      observer.disconnect()
      mutObs.disconnect()
      clearInterval(pollId)
    }
  }, [])

  /* ── GSAP Text Entrance Animation Sequence ─────────────────────── */
  useEffect(() => {
    if (!isRevealed || !contentWrapperRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })

      // 1. Eyebrow label fade & slide
      tl.fromTo(
        '.sec2-eyebrow',
        { opacity: 0, y: 24, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }
      )

      // 2. Staggered Headline Lines
      tl.fromTo(
        '.sec2-headline-line',
        { opacity: 0, y: 44, rotateX: -15, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
        },
        '-=0.4'
      )

      // 3. Supporting Paragraph
      tl.fromTo(
        '.sec2-paragraph',
        { opacity: 0, y: 28, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )

      // 4. Staggered Category Labels
      tl.fromTo(
        '.sec2-category-tag',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
        '-=0.4'
      )
    }, contentWrapperRef)

    return () => ctx.revert()
  }, [isRevealed])

  /* ── Full Section Dynamic Cursor Tracking for Interactive Logo ──── */
  useEffect(() => {
    const section = sectionRef.current
    const logoEl = floatingLogoRef.current
    if (!section || !logoEl || !isRevealed) return

    const isMobile = window.innerWidth < 768

    const sectionRect = section.getBoundingClientRect()

    // Initial position: large & dominant on the right side
    const initialX = isMobile ? sectionRect.width * 0.5 - 75 : sectionRect.width * 0.7 - 110
    const initialY = isMobile ? sectionRect.height * 0.6 - 75 : sectionRect.height * 0.5 - 110

    gsap.set(logoEl, {
      x: initialX,
      y: initialY,
      scale: isMobile ? 1.0 : 1.85,
      opacity: 1,
    })

    // GSAP quickTo interpolators for smooth weight & damping
    const xTo = gsap.quickTo(logoEl, 'x', { duration: 0.85, ease: 'power3.out' })
    const yTo = gsap.quickTo(logoEl, 'y', { duration: 0.85, ease: 'power3.out' })

    let isFollowActive = false

    // Sequence 1: Shrink from large logo to smaller floating logo
    const shrinkTimer = setTimeout(() => {
      const targetScale = isMobile ? 0.75 : 0.85
      gsap.to(logoEl, { scale: targetScale, duration: 1.2, ease: 'power2.inOut', overwrite: 'auto' })
      isFollowActive = true

      // On mobile: trigger subtle ambient floating animation (no cursor tracking)
      if (isMobile) {
        gsap.to(logoEl, {
          y: '+=16',
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }
    }, 450)

    // Sequence 2: Full Section Dynamic Bounding Box Cursor Follower
    const handlePointerMove = (e: PointerEvent) => {
      if (!isFollowActive || isMobile) return

      const currentSection = sectionRef.current
      const currentLogo = floatingLogoRef.current
      if (!currentSection || !currentLogo) return

      const rect = currentSection.getBoundingClientRect()
      const logoRect = currentLogo.getBoundingClientRect()

      // Calculate cursor position relative to Section 2
      const cursorX = e.clientX - rect.left
      const cursorY = e.clientY - rect.top

      // Calculate dynamic max boundaries based on actual section & logo dimensions
      const maxX = rect.width - logoRect.width
      const maxY = rect.height - logoRect.height

      // Target position offset slightly (+24px)
      const targetRawX = cursorX + 24
      const targetRawY = cursorY + 24

      // Constrain strictly within visible Section 2 boundaries
      const clampedX = Math.max(10, Math.min(maxX - 10, targetRawX))
      const clampedY = Math.max(10, Math.min(maxY - 10, targetRawY))

      xTo(clampedX)
      yTo(clampedY)
    }

    if (!isMobile) {
      window.addEventListener('pointermove', handlePointerMove)
    }

    return () => {
      clearTimeout(shrinkTimer)
      if (!isMobile) {
        window.removeEventListener('pointermove', handlePointerMove)
      }
    }
  }, [isRevealed])



  return (
    <section
      ref={sectionRef}
      id="brand-statement"
      aria-label="Section 2 — We Make Brands Impossible To Ignore"
      className="section-two hidden opacity-0 pointer-events-none"
    >
      {/* 1. Independent Interactive Logo Layer */}
      <div className="section-two__logo-layer">
        <div ref={floatingLogoRef} className="section-two__logo">
          <Image
            src="/ras-logo.svg"
            alt="RAS Media SVG Logo"
            width={220}
            height={220}
            priority
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* 2. Responsive Content Container (Centered, Normal Document Flow) */}
      <div className="section-two__container">
        <div ref={contentWrapperRef} className="section-two__content">
          
          {/* Eyebrow Label */}
          <span className="eyebrow sec2-eyebrow">
            <span className="eyebrow-line" />
            01 / WHAT WE DO
          </span>

          {/* Headline */}
          <h2>
            <span className="sec2-headline-line block">WE MAKE</span>
            <span className="sec2-headline-line block">BRANDS</span>
            <span className="sec2-headline-line block highlight">IMPOSSIBLE</span>
            <span className="sec2-headline-line block">TO IGNORE.</span>
          </h2>

          {/* Supporting Paragraph */}
          <p className="sec2-paragraph">
            We connect ambitious brands with the right creators, turning attention into influence and influence into impact.
          </p>

          {/* Categories */}
          <div className="categories">
            <span className="sec2-category-tag">BRANDS</span>
            <span className="sec2-category-tag dash">—</span>
            <span className="sec2-category-tag">CREATORS</span>
            <span className="sec2-category-tag dash">—</span>
            <span className="sec2-category-tag">CULTURE</span>
            <span className="sec2-category-tag dash">—</span>
            <span className="sec2-category-tag">INFLUENCE</span>
          </div>

        </div>
      </div>
    </section>
  )
}
