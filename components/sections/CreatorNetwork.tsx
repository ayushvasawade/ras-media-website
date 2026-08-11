'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CreatorNetwork() {
  const sectionRef = useRef<HTMLElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)

  /* ── Interactive Pointer & Parallax Motion for Poster Elements ──── */
  useEffect(() => {
    const section = sectionRef.current
    const poster = posterRef.current
    if (!section || !poster) return

    const isMobile = window.innerWidth < 768

    const handlePointerMove = (e: PointerEvent) => {
      if (isMobile) return

      const rect = section.getBoundingClientRect()
      const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2

      // Micro parallax movement across horizontal vs vertical layers
      const hItems = poster.querySelectorAll('.poster-word-h')
      const vItems = poster.querySelectorAll('.poster-word-v')

      hItems.forEach((el, index) => {
        const factor = (index + 1) * 6
        gsap.to(el, {
          x: relX * factor,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })

      vItems.forEach((el, index) => {
        const factor = (index + 1) * 8
        gsap.to(el, {
          y: relY * factor,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })
    }

    if (!isMobile) {
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
      id="creator-network"
      aria-label="Section 4 — Creator Culture Editorial Artwork"
      className="section-four"
    >
      <div ref={posterRef} className="section-four__poster-canvas">
        
        {/* ── 1. Intersecting Poster Words ──────────────────────────── */}
        
        {/* CREATORS — Huge Horizontal */}
        <div className="poster-word poster-word-h poster-creators">
          CREATORS
        </div>

        {/* INFLUENCE — Vertical */}
        <div className="poster-word poster-word-v poster-influence">
          INFLUENCE
        </div>

        {/* CULTURE — Huge Horizontal */}
        <div className="poster-word poster-word-h poster-culture">
          CULTURE
        </div>

        {/* IMPACT — Vertical */}
        <div className="poster-word poster-word-v poster-impact">
          IMPACT
        </div>

        {/* REACH — Horizontal Outline */}
        <div className="poster-word poster-word-h poster-reach">
          REACH
        </div>

        {/* STORIES — Vertical */}
        <div className="poster-word poster-word-v poster-stories">
          STORIES
        </div>

        {/* ATTENTION — Horizontal Outline */}
        <div className="poster-word poster-word-h poster-attention">
          ATTENTION
        </div>

        {/* CONNECTION — Vertical */}
        <div className="poster-word poster-word-v poster-connection">
          CONNECTION
        </div>

        {/* ── 2. Integrated Editorial Paragraph ────────────────────── */}
        <div className="poster-paragraph-block">
          <p>
            &ldquo;We connect brands with creators who shape culture, spark conversations and turn attention into influence.&rdquo;
          </p>
        </div>

        {/* ── 3. Tiny Editorial Badges & Labels ────────────────────── */}
        <div className="poster-label label-creator-network">
          <span>[ CREATOR NETWORK ]</span>
        </div>

        <div className="poster-label label-brand-creator">
          <span>BRAND × CREATOR</span>
        </div>

        <div className="poster-label label-culture-tag">
          <span>03 // CULTURE</span>
        </div>

        <div className="poster-label label-influence-tag">
          <span>INFLUENCE ENGINE</span>
        </div>

      </div>
    </section>
  )
}
