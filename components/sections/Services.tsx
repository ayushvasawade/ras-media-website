'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    num: '01',
    name: 'Influencer Marketing',
    desc: 'Full-service influencer campaigns — from strategy to execution, tailored to your brand and audience.',
  },
  {
    num: '02',
    name: 'Creator Discovery',
    desc: 'We identify the right creators for your brand through rigorous vetting across niche, audience, and performance metrics.',
  },
  {
    num: '03',
    name: 'Campaign Management',
    desc: 'End-to-end coordination — briefings, negotiations, content reviews, approvals, and publishing timelines.',
  },
  {
    num: '04',
    name: 'Brand Activations',
    desc: 'High-impact creator events and live activations that create real cultural moments around your brand.',
  },
  {
    num: '05',
    name: 'Performance & Analytics',
    desc: 'Transparent reporting on reach, views, engagement, and conversions — so you always know what\'s working.',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    )

    itemsRef.current.forEach((item, i) => {
      if (!item) return
      gsap.fromTo(
        item,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          },
          delay: i * 0.05,
        }
      )
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="services-section"
      id="services"
      aria-label="Our Services"
    >
      <div className="section-label" aria-hidden="true">What We Do</div>

      <h2 ref={titleRef} className="text-display-md" style={{ marginBottom: '3rem', opacity: 0 }}>
        WHAT WE DO
      </h2>

      <div role="list">
        {SERVICES.map((service, i) => (
          <div
            key={service.num}
            ref={(el) => { itemsRef.current[i] = el }}
            className="service-item"
            role="listitem"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            style={{ opacity: 0 }}
          >
            <span className="service-num" aria-hidden="true">{service.num}</span>

            <div>
              <div className="service-name">{service.name}</div>
              <p
                className="service-desc"
                style={{ display: activeIndex === i ? 'block' : 'none' }}
              >
                {service.desc}
              </p>
            </div>

            <div className="service-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h12M7 1l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom border */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: 0,
        }}
        aria-hidden="true"
      />
    </section>
  )
}
