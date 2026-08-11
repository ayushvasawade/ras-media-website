'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

export default function ServicesShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const visualWrapRef = useRef<HTMLDivElement>(null)
  const visualCardRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const patternBgRef = useRef<HTMLDivElement>(null)

  /* ── Interactive Pointer Parallax & Tilt Effect ──────────────── */
  useEffect(() => {
    const section = sectionRef.current
    const card = visualCardRef.current
    const badge = badgeRef.current
    const patternBg = patternBgRef.current

    if (!section || !card) return

    const isMobile = window.innerWidth < 768

    const handlePointerMove = (e: PointerEvent) => {
      if (isMobile) return

      const rect = section.getBoundingClientRect()
      // Relative mouse offset from center of section (-1 to 1)
      const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2

      // Card tilt & subtle translation via smooth gsap.to
      gsap.to(card, {
        rotateY: relX * 8,
        rotateX: -relY * 8,
        x: relX * 12,
        y: relY * 10,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      // Badge leads mouse with extra offset (layer parallax)
      if (badge) {
        gsap.to(badge, {
          x: relX * 22,
          y: relY * 18,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }

      // Background micro-pattern grid shifts subtly opposite (depth layer)
      if (patternBg) {
        gsap.to(patternBg, {
          x: -relX * 20,
          y: -relY * 15,
          duration: 1.2,
          ease: 'power1.out',
          overwrite: 'auto',
        })
      }
    }

    // Ambient floating on mobile
    if (isMobile) {
      gsap.to(card, {
        y: '+=10',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    } else {
      window.addEventListener('pointermove', handlePointerMove)
    }

    return () => {
      if (!isMobile) {
        window.removeEventListener('pointermove', handlePointerMove)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services-showcase"
      aria-label="Section 3 — Strategy Meets Culture"
      className="section-three"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      {/* 1. 100+ Micro Typography Pattern Background Layer (144 Instances of CULTURE × IMPACT) */}
      <div ref={patternBgRef} className="section-three__pattern-bg" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={`pattern-row ${rowIndex % 2 === 0 ? 'pattern-row-left' : 'pattern-row-right'}`}
          >
            {Array.from({ length: 12 }).map((_, itemIndex) => (
              <span key={itemIndex} className="pattern-item">
                CULTURE × IMPACT
                <span className="pattern-dash">—</span>
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* 2. Main Responsive Container (Left Content + Right Visual) */}
      <div className="section-three__container">
        
        {/* Left / Center Main Content Block */}
        <div className="section-three__content">
          {/* Eyebrow Label */}
          <span className="eyebrow sec3-eyebrow">
            <span className="eyebrow-line" />
            02 / OUR APPROACH
          </span>

          {/* Bold Editorial Headline */}
          <h2>
            <span className="block">STRATEGY</span>
            <span className="block">MEETS</span>
            <span className="block highlight">CULTURE.</span>
          </h2>

          {/* Supporting Paragraph */}
          <p className="sec3-paragraph">
            From insight to execution, we engineer campaigns that resonate.
            We connect brands with creators, platforms, and cultural moments&nbsp;—
            turning attention into measurable impact.
          </p>

          {/* Capability Pillars Grid */}
          <div className="section-three__pillars">
            <div className="section-three__pillar">
              <span className="section-three__pillar-num">01 / STRATEGY</span>
              <span className="section-three__pillar-title">Creator Intelligence</span>
              <span className="section-three__pillar-desc">Data-backed audience & talent matching</span>
            </div>

            <div className="section-three__pillar">
              <span className="section-three__pillar-num">02 / PRODUCTION</span>
              <span className="section-three__pillar-title">Cultural Content</span>
              <span className="section-three__pillar-desc">Multi-format direction & storytelling</span>
            </div>

            <div className="section-three__pillar">
              <span className="section-three__pillar-num">03 / TALENT</span>
              <span className="section-three__pillar-title">Iconic Creators</span>
              <span className="section-three__pillar-desc">Direct relationships with top voices</span>
            </div>

            <div className="section-three__pillar">
              <span className="section-three__pillar-num">04 / SCALE</span>
              <span className="section-three__pillar-title">Performance</span>
              <span className="section-three__pillar-desc">Amplification & ROI tracking</span>
            </div>
          </div>
        </div>

        {/* Right Side Visual Statement Frame */}
        <div ref={visualWrapRef} className="section-three__visual-wrap">
          
          {/* Main Editorial Visual Card */}
          <div ref={visualCardRef} className="section-three__visual-card">
            <Image
              src="/originkit/hero-13/potrait-1.png"
              alt="RAS Media Creator Showcase"
              width={600}
              height={750}
              priority
              className="section-three__visual-img"
            />
            <div className="section-three__visual-overlay" />
            
            {/* Metadata Badge */}
            <span className="section-three__tag">RAS // 02 ENGINE</span>
          </div>

          {/* Floating Cherry Red Badge */}
          <div ref={badgeRef} className="section-three__badge">
            <Image
              src="/ras-logo.svg"
              alt="RAS Logo"
              width={24}
              height={24}
              className="section-three__badge-logo"
            />
            <span className="section-three__badge-text">CREATOR CULTURE</span>
          </div>

        </div>

      </div>
    </section>
  )
}
