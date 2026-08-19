'use client'

import FinalFooter from '@/components/sections/FinalFooter'

const VALUES = [
  {
    num: '01',
    title: 'CULTURE OVER CLUTTER',
    desc: 'We reject generic influencer spam. Every partnership is rooted in genuine creative tension and cultural relevance.',
  },
  {
    num: '02',
    title: 'CREATOR-FIRST RESPECT',
    desc: 'Creators aren’t billboards — they’re directors of their own community. We empower them to tell brand stories authentically.',
  },
  {
    num: '03',
    title: 'DATA WITHOUT DOGMA',
    desc: 'We use audience metrics and engagement intelligence to inform intuition, never to replace bold creative ambition.',
  },
  {
    num: '04',
    title: 'OBSESSION WITH IMPACT',
    desc: 'Impressions mean nothing if sentiment and sales don’t follow. We structure campaigns to drive verifiable bottom-line results.',
  },
]

const STATS = [
  { value: '500+', label: 'TOP CREATORS MANAGED' },
  { value: '350+', label: 'CAMPAIGNS DEPLOYED' },
  { value: '15+', label: 'INDUSTRIES ACTIVATED' },
  { value: '99%', label: 'CLIENT RETENTION RATE' },
]

export default function AboutPage() {
  const handleOpenModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ras:open-campaign-modal'))
    }
  }

  return (
    <main className="subpage-root" id="main-content">
      {/* Hero */}
      <section className="subpage-hero">
        <div className="subpage-hero__container">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            03 / ABOUT RAS MEDIA
          </div>

          <h1 className="subpage-hero__title">
            MAKING BRANDS <span className="highlight">IMPOSSIBLE</span> TO IGNORE.
          </h1>

          <p className="subpage-hero__desc">
            RAS Media is a modern creator marketing agency built for the algorithmic era.
            We connect the world’s most ambitious brands with the culture shapers who drive internet conversation.
          </p>

          <div className="subpage-hero__actions">
            <button
              type="button"
              onClick={handleOpenModal}
              className="subpage-cta-btn"
            >
              <span>PARTNER WITH US</span>
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Manifest Block */}
      <section className="about-manifest-section">
        <div className="subpage-container">
          <div className="about-manifest-card">
            <span className="eyebrow">OUR CREED</span>
            <h2 className="about-manifest-heading">
              ATTENTION IS CHEAP. <br />
              <span className="highlight">INFLUENCE IS EARNED.</span>
            </h2>
            <div className="about-manifest-text">
              <p>
                In a feed crowded with interchangeable sponsored posts, true cut-through requires
                originality, contextual relevance, and deep audience trust.
              </p>
              <p>
                At RAS Media, we don’t treat creator partnerships as transactions. We build
                collaborative ecosystems where creators create their best work, and brands achieve
                unmatched cultural equity and commercial growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="subpage-content-section">
        <div className="subpage-container">
          <div className="subpage-section-header">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              PRINCIPLES
            </div>
            <h2 className="subpage-section-title">
              HOW WE <span className="highlight">THINK.</span>
            </h2>
          </div>

          <div className="values-grid">
            {VALUES.map((val) => (
              <div key={val.num} className="value-card">
                <span className="value-num">{val.num}</span>
                <h3 className="value-title">{val.title}</h3>
                <p className="value-desc">{val.desc}</p>
              </div>
            ))}
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

      {/* Banner CTA */}
      <section className="subpage-banner-cta">
        <div className="subpage-container">
          <div className="subpage-banner-inner">
            <span className="eyebrow">LET’S WORK TOGETHER</span>
            <h2 className="subpage-banner-title">
              READY TO ELEVATE YOUR <span className="highlight">BRAND?</span>
            </h2>
            <p className="subpage-banner-copy">
              Whether you’re launching a product or repositioning a legacy brand, our talent team is ready to help.
            </p>
            <button
              type="button"
              onClick={handleOpenModal}
              className="subpage-cta-btn subpage-cta-btn--large"
            >
              <span>GIVE US SOME WORK</span>
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
