'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Placeholder campaigns — clearly marked for replacement
const CAMPAIGNS = [
  {
    id: '01',
    brand: '[CLIENT BRAND]',
    name: '[CAMPAIGN NAME]',
    desc: 'A creator-led product launch that drove authentic conversations across Instagram, reaching target demographics with precision.',
    creators: '[XX]',
    reach: '[X.XM]',
    views: '[X.XM]',
    engagement: '[X.X%]',
    span: 'large' as const,
  },
  {
    id: '02',
    brand: '[CLIENT BRAND]',
    name: '[CAMPAIGN NAME]',
    desc: 'Multi-creator fashion activation across lifestyle and style influencers.',
    creators: '[XX]',
    reach: '[XXXk]',
    views: '[XXXk]',
    engagement: '[X.X%]',
    span: 'normal' as const,
  },
  {
    id: '03',
    brand: '[CLIENT BRAND]',
    name: '[CAMPAIGN NAME]',
    desc: 'Targeted food & beverage campaign leveraging micro-influencers for regional impact.',
    creators: '[XX]',
    reach: '[XXXk]',
    views: '[XXXk]',
    engagement: '[X.X%]',
    span: 'normal' as const,
  },
]

interface CampaignCardProps {
  campaign: (typeof CAMPAIGNS)[number]
  index: number
}

function CampaignCard({ campaign, index }: CampaignCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: index * 0.15,
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
        },
      }
    )
  }, [index])

  return (
    <div
      ref={cardRef}
      className={`campaign-card ${campaign.span === 'large' ? 'campaign-card-large' : ''}`}
      data-cursor="VIEW"
      style={{ opacity: 0 }}
      role="article"
      aria-label={`Campaign: ${campaign.name}`}
    >
      {/* Background gradient mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 80%, rgba(107,15,18,0.5) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(61,5,7,0.3) 0%, transparent 50%),
            linear-gradient(160deg, #0f0f0f 0%, #1a1a1a 100%)
          `,
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <span className="campaign-num" aria-hidden="true">{campaign.id}</span>

      <div className="campaign-cta-arrow" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="campaign-brand">{campaign.brand}</div>
        <h3 className="campaign-name">{campaign.name}</h3>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
            color: 'var(--ras-white-dim)',
            lineHeight: 1.7,
            marginTop: '1rem',
            maxWidth: 520,
          }}
        >
          {campaign.desc}
        </p>

        <div className="campaign-stats">
          <div>
            <div className="campaign-stat-label">Creators</div>
            <div className="campaign-stat-val">{campaign.creators}</div>
          </div>
          <div>
            <div className="campaign-stat-label">Total Reach</div>
            <div className="campaign-stat-val">{campaign.reach}</div>
          </div>
          <div>
            <div className="campaign-stat-label">Views</div>
            <div className="campaign-stat-val">{campaign.views}</div>
          </div>
          <div>
            <div className="campaign-stat-label">Engagement</div>
            <div className="campaign-stat-val">{campaign.engagement}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Campaigns() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

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
  }, [])

  return (
    <section
      ref={sectionRef}
      className="campaigns-section"
      id="campaigns"
      aria-label="Selected Campaigns"
    >
      <div className="section-label" aria-hidden="true">Our Work</div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '0',
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        <h2
          ref={titleRef}
          className="text-display-md"
          style={{ opacity: 0 }}
        >
          SELECTED
          <br />
          CAMPAIGNS
        </h2>

        {/* Placeholder note in development */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            color: 'var(--ras-white-mute)',
            letterSpacing: '0.05em',
            maxWidth: 260,
            lineHeight: 1.6,
          }}
        >
          Campaign data coming soon. Placeholder content is clearly marked for replacement.
        </p>
      </div>

      <div className="campaign-grid">
        {CAMPAIGNS.map((campaign, i) => (
          <CampaignCard key={campaign.id} campaign={campaign} index={i} />
        ))}
      </div>
    </section>
  )
}
