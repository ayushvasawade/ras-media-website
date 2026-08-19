'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FinalFooter() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  // Ensure video plays smoothly even if browser restricts autoplay policies
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playVideo = async () => {
      try {
        video.muted = true
        await video.play()
      } catch (err) {
        console.warn('Footer background video autoplay prevented:', err)
      }
    }

    playVideo()
  }, [])

  // Reveal observer for entrance animation trigger
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15 }
    )
    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  // GSAP Text Reveal & Entrance Animations
  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content || !isRevealed) return

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (isReducedMotion) {
        gsap.set(
          ['.ff-eyebrow', '.ff-line-1', '.ff-line-2', '.ff-copy', '.ff-cta-wrap', '.ff-bottom-bar'],
          { opacity: 1, y: 0, filter: 'none' }
        )
        return
      }

      const tl = gsap.timeline({ delay: 0.15 })

      // 1. Eyebrow Tag
      tl.fromTo(
        '.ff-eyebrow',
        { autoAlpha: 0, y: 20, filter: 'blur(4px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }
      )

      // 2. Headline Line 1: STILL WAITING.
      tl.fromTo(
        '.ff-line-1',
        { autoAlpha: 0, y: 40, rotateX: -10, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
        },
        '-=0.4'
      )

      // 3. Headline Line 2: FOR YOUR NEXT CAMPAIGN. (Dominant visual line)
      tl.fromTo(
        '.ff-line-2',
        { autoAlpha: 0, y: 50, scale: 0.94, filter: 'blur(10px)' },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power3.out',
        },
        '-=0.6'
      )

      // 4. Small copy: We have the creators. You have the brief.
      tl.fromTo(
        '.ff-copy',
        { autoAlpha: 0, y: 24, filter: 'blur(4px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )

      // 5. CTA Button
      tl.fromTo(
        '.ff-cta-wrap',
        { autoAlpha: 0, y: 30, scale: 0.92 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.85, ease: 'back.out(1.4)' },
        '-=0.5'
      )

      // 6. Bottom Footer Bar
      tl.fromTo(
        '.ff-bottom-bar',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [isRevealed])

  return (
    <footer
      ref={sectionRef}
      id="contact"
      aria-label="RAS Media — Final Footer"
      className="final-footer"
    >
      {/* Full-screen Cinematic Background Video */}
      <div className="final-footer__video-wrap" aria-hidden="true">
        <video
          ref={videoRef}
          src="/FOOTER_BG.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="final-footer__video"
        />
        {/* Subtle Noir Black / Deep Maroon Overlay */}
        <div className="final-footer__overlay" />
        {/* Subtle Edge Vignette */}
        <div className="final-footer__vignette" />
      </div>

      {/* Main Content Overlay */}
      <div ref={contentRef} className="final-footer__container">
        {/* Eyebrow Label */}
        <div className="ff-eyebrow eyebrow">
          <span className="eyebrow-line" />
          <span>05 // THE FINALE</span>
        </div>

        {/* Oversized Editorial Main Content */}
        <div className="final-footer__hero-content">
          <h2 className="final-footer__headline">
            <span className="ff-line-1 block">STILL WAITING.</span>
            <span className="ff-line-2 block highlight-strong">
              FOR YOUR NEXT CAMPAIGN.
            </span>
          </h2>

          <p className="ff-copy final-footer__small-copy">
            <span>We have the creators.</span>
            <br />
            <span>You have the brief.</span>
          </p>

          <div className="ff-cta-wrap final-footer__cta-wrap">
            <button
              type="button"
              className="final-footer__cta"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('ras:open-campaign-modal'))
                }
              }}
              aria-label="Give us some work — Open Campaign Inquiry Form"
            >
              <span className="cta-text">GIVE US SOME WORK</span>
              <span className="cta-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* Footer Information at Bottom */}
        <div className="ff-bottom-bar final-footer__info-bar">
          {/* Brand Info */}
          <div className="final-footer__brand-info">
            <div className="final-footer__logo-mark">
              <Image
                src="/ras-logo.svg"
                alt="RAS Logo"
                width={28}
                height={28}
                style={{ objectFit: 'contain' }}
              />
              <span className="final-footer__brand-title">RAS MEDIA</span>
            </div>
            <span className="final-footer__agency-sub">
              INFLUENCER MARKETING AGENCY
            </span>
          </div>

          {/* Social Links */}
          <nav
            className="final-footer__social-links"
            aria-label="Social & Contact Links"
          >
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ff-link"
            >
              INSTAGRAM
            </a>
            <span className="ff-dot">·</span>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ff-link"
            >
              LINKEDIN
            </a>
            <span className="ff-dot">·</span>
            <a href="mailto:hello@rasmedia.com" className="ff-link">
              EMAIL
            </a>
          </nav>

          {/* Copyright Notice */}
          <div className="final-footer__copyright">
            © 2026 RAS MEDIA
          </div>
        </div>
      </div>
    </footer>
  )
}
