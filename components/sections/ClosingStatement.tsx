'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ClosingStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const logoWrapRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const copyRef = useRef<HTMLParagraphElement>(null)
  const editorialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const logoWrap = logoWrapRef.current
    const headline = headlineRef.current
    const copy = copyRef.current
    const editorial = editorialRef.current

    if (!section) return

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (isReducedMotion) {
        gsap.set(['.sec5-line', copy, editorial, logoWrap], { opacity: 1, y: 0 })
        return
      }

      /* ── 1. Scroll-Driven Background & 3D Logo Parallax Scrub ───── */
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        },
      })
      .to(section, {
        backgroundColor: '#050505',
        ease: 'none',
      }, 0)
      .to(logoWrap, {
        y: 60,
        rotateY: 12,
        rotateX: -8,
        scale: 1.08,
        ease: 'none',
      }, 0)

      /* ── 2. Entrance Sequence for Typography & Editorial Elements ── */
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })

      // Eyebrow Tag
      entranceTl.fromTo(
        '.sec5-eyebrow',
        { autoAlpha: 0, y: 20, filter: 'blur(4px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
      )

      // Main Headline Lines
      entranceTl.fromTo(
        '.sec5-line',
        { autoAlpha: 0, y: 50, rotateX: -10, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 1.1,
          stagger: 0.18,
          ease: 'power3.out',
        },
        '-=0.5'
      )

      // Supporting Copy
      entranceTl.fromTo(
        copy,
        { autoAlpha: 0, y: 24, filter: 'blur(4px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      )

      // Editorial Bottom Divider Line
      entranceTl.fromTo(
        editorial,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="attention-influence"
      aria-label="Section 5 — Attention Is Easy. Influence Isn't."
      className="section-five"
    >
      {/* 1. Ambient Background Cherry Glow Canvas */}
      <div className="section-five__ambient-glow" aria-hidden="true" />

      {/* 2. 3D RAS SVG Visual Anchor */}
      <div ref={logoWrapRef} className="section-five__logo-anchor" aria-hidden="true">
        <Image
          src="/ras-logo.svg"
          alt="RAS 3D Logo Mark"
          width={320}
          height={320}
          priority
          className="section-five__logo-img"
        />
      </div>

      {/* 3. Central Editorial Composition */}
      <div className="section-five__container">
        
        {/* Top Eyebrow Tag */}
        <span className="eyebrow sec5-eyebrow">
          <span className="eyebrow-line" />
          04 // THE CLIMAX
        </span>

        {/* Main Oversized Editorial Headline */}
        <h2 ref={headlineRef} className="section-five__headline">
          <span className="sec5-line block">ATTENTION IS EASY.</span>
          <span className="sec5-line block highlight-cherry">INFLUENCE ISN&apos;T.</span>
        </h2>

        {/* Supporting Editorial Copy */}
        <p ref={copyRef} className="section-five__copy">
          &ldquo;We turn fleeting attention into lasting brand relevance.&rdquo;
        </p>

        {/* Bottom Editorial Line */}
        <div ref={editorialRef} className="section-five__editorial-line">
          <span className="editorial-item">STRATEGY</span>
          <span className="editorial-divider">&times;</span>
          <span className="editorial-item">CREATORS</span>
          <span className="editorial-divider">&times;</span>
          <span className="editorial-item">CULTURE</span>
        </div>

      </div>
    </section>
  )
}
