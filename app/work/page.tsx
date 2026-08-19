'use client'

import { Metadata } from 'next'
import Link from 'next/link'
import FinalFooter from '@/components/sections/FinalFooter'

const CASE_STUDIES = [
  {
    client: 'SPOTIFY INDIA',
    category: 'CULTURAL MOMENTS & MUSIC',
    title: 'Amplifying Regional Sounds Across 40M+ Fans',
    metric: '18.4M Impressions',
    roi: '3.8× Engagement Benchmark',
    desc: 'Mobilized 45 tier-1 creators to drive organic trend adoption for local language playlist drops.',
    tags: ['Creator Matchmaking', 'Short-form Video', 'Cultural Seeding'],
  },
  {
    client: 'NIKE RUNNING',
    category: 'COMMUNITY & SPORT',
    title: 'Igniting Grassroots Running Communities in Metro Cities',
    metric: '125K+ UGC Videos',
    roi: '94% Positive Sentiment',
    desc: 'Engineered a hyper-local athlete and fitness creator collective that transformed casual joggers into brand advocates.',
    tags: ['Athlete Collective', 'Event Activations', 'Viral Challenges'],
  },
  {
    client: 'ZOMATO LIVE',
    category: 'FOOD & EXPERIENTIAL',
    title: 'Selling Out 3-Day Music & Food Festival in 48 Hours',
    metric: '32M+ Video Views',
    roi: '100% Ticket Sellout',
    desc: 'Coordinated a 72-hour creator swarm with exclusive backstage teasers and influencer storytelling.',
    tags: ['Real-time Coverage', 'Storytelling Swarm', 'Ticket Conversions'],
  },
  {
    client: 'NOTHING TECH',
    category: 'PRODUCT LAUNCH & DESIGN',
    title: 'Making Hardware Drops Impossible To Ignore',
    metric: '4.2M Organic Reach',
    roi: '22K Pre-orders',
    desc: 'Curated aesthetic-first tech and lifestyle tastemakers to deliver unboxing experiences with cinematic fidelity.',
    tags: ['Tastemaker Seeding', 'Unboxing Direction', 'Aesthetic Fidelity'],
  },
]

const STATS = [
  { value: '500+', label: 'CREATORS NETWORKED' },
  { value: '1.2B+', label: 'TOTAL CAMPAIGN REACH' },
  { value: '98.5%', label: 'ON-TIME DELIVERY' },
  { value: '4.2×', label: 'AVG ENGAGEMENT MULTIPLIER' },
]

export default function WorkPage() {
  const handleOpenModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ras:open-campaign-modal'))
    }
  }

  return (
    <main className="subpage-root" id="main-content">
      {/* Hero Header */}
      <section className="subpage-hero">
        <div className="subpage-hero__container">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            01 / WORK & CASE STUDIES
          </div>

          <h1 className="subpage-hero__title">
            CAMPAIGNS THAT <span className="highlight">COMMAND</span> ATTENTION.
          </h1>

          <p className="subpage-hero__desc">
            We don’t just buy reach. We craft cultural moments that align ambitious brands
            with authentic creator voices — driving measurable impact and lasting prestige.
          </p>

          {/* Quick CTA */}
          <div className="subpage-hero__actions">
            <button
              type="button"
              onClick={handleOpenModal}
              className="subpage-cta-btn"
            >
              <span>START A CAMPAIGN</span>
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="subpage-stats-section">
        <div className="subpage-stats-grid">
          {STATS.map((stat) => (
            <div key={stat.label} className="subpage-stat-card">
              <span className="subpage-stat-val">{stat.value}</span>
              <span className="subpage-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="subpage-content-section">
        <div className="subpage-container">
          <div className="subpage-section-header">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              FEATURED DELIVERABLES
            </div>
            <h2 className="subpage-section-title">
              PROOF OF <span className="highlight">IMPACT.</span>
            </h2>
          </div>

          <div className="case-studies-grid">
            {CASE_STUDIES.map((study, index) => (
              <article key={study.client} className="case-study-card">
                <div className="case-study-card__header">
                  <span className="case-study-num">0{index + 1} // {study.category}</span>
                  <h3 className="case-study-client">{study.client}</h3>
                </div>

                <h4 className="case-study-title">{study.title}</h4>
                <p className="case-study-desc">{study.desc}</p>

                <div className="case-study-metrics">
                  <div className="case-study-metric-box">
                    <span className="metric-label">REACH / VIEWS</span>
                    <span className="metric-val">{study.metric}</span>
                  </div>
                  <div className="case-study-metric-box">
                    <span className="metric-label">PERFORMANCE</span>
                    <span className="metric-val highlight">{study.roi}</span>
                  </div>
                </div>

                <div className="case-study-tags">
                  {study.tags.map((tag) => (
                    <span key={tag} className="case-study-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="subpage-banner-cta">
        <div className="subpage-container">
          <div className="subpage-banner-inner">
            <span className="eyebrow">READY TO MAKE NOISE?</span>
            <h2 className="subpage-banner-title">
              LET’S BUILD YOUR NEXT <span className="highlight">VIRAL MOMENT.</span>
            </h2>
            <p className="subpage-banner-copy">
              Tell us your targets. We’ll design the creator lineup, strategy, and production blueprint.
            </p>
            <button
              type="button"
              onClick={handleOpenModal}
              className="subpage-cta-btn subpage-cta-btn--large"
            >
              <span>SUBMIT YOUR BRIEF</span>
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <FinalFooter />
    </main>
  )
}
