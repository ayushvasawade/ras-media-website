'use client'

import FinalFooter from '@/components/sections/FinalFooter'

const SERVICES = [
  {
    number: '01',
    title: 'CREATOR INTELLIGENCE & TALENT MATCHING',
    tagline: 'Data-backed alignment over guesswork.',
    desc: 'We analyze audience demographics, engagement authenticity, cultural affinity, and historical performance to pair your brand with creators who legitimately move the needle.',
    deliverables: [
      'Audience overlap & fraud audit',
      'Tier-1, mid-tier, and micro-creator curation',
      'Contract negotiation & usage rights management',
      'Competitive landscape mapping',
    ],
  },
  {
    number: '02',
    title: 'END-TO-END CAMPAIGN ARCHITECTURE',
    tagline: 'Seamless briefs that unlock creator creativity.',
    desc: 'From initial creative ideation to brief design, product seeding, and multi-platform rollout. We ensure brand guardrails are met without stripping away authentic creator voice.',
    deliverables: [
      'Creative strategy & hook ideation',
      'Comprehensive creator guidelines & briefing',
      'Live review & compliance QA workflow',
      'Multi-wave rollout synchronization',
    ],
  },
  {
    number: '03',
    title: 'CULTURAL CONTENT & STUDIO PRODUCTION',
    tagline: 'Studio-grade fidelity built for vertical screens.',
    desc: 'High-concept short-form reels, experiential event captures, long-form YouTube integrations, and brand-owned original IP designed to thrive on algorithms.',
    deliverables: [
      'Vertical 9:16 cinematic video direction',
      'Experiential & festival content activations',
      'Interactive filters & sound design',
      'Asset repurposing for paid ad suites',
    ],
  },
  {
    number: '04',
    title: 'PERFORMANCE AMPLIFICATION & ROI REPORTING',
    tagline: 'Scale top-performing organic assets with precision paid boost.',
    desc: 'We identify viral organic winner creatives and scale them via creator partnership ads, whitelist boosting, and pixel-tracked conversion funnels with transparent analytics.',
    deliverables: [
      'Creator Partnership Ads (Partnership Whitelisting)',
      'Real-time conversion & attribution tracking',
      'Full post-campaign metric teardown & sentiment report',
      'Audience retargeting asset library',
    ],
  },
]

const PROCESS_STEPS = [
  {
    step: '01',
    name: 'DISCOVERY & STRATEGY',
    summary: 'We unpack your brand objectives, target consumer profile, and KPIs to map out the creative angle.',
  },
  {
    step: '02',
    name: 'CREATOR CURATION',
    summary: 'Our talent team vets creators for audience affinity, engagement quality, and tone fit before contracting.',
  },
  {
    step: '03',
    name: 'PRODUCTION & QA',
    summary: 'Creators produce high-impact assets under our creative direction with strict brand safety QA.',
  },
  {
    step: '04',
    name: 'AMPLIFICATION & REPORTING',
    summary: 'We deploy coordinated drops, boost top performers, and provide comprehensive ROI analytics.',
  },
]

export default function ServicesPage() {
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
            02 / CAPABILITIES & SERVICES
          </div>

          <h1 className="subpage-hero__title">
            ENGINEERED FOR <span className="highlight">INFLUENCE.</span>
          </h1>

          <p className="subpage-hero__desc">
            We operate at the intersection of cultural storytelling and performance marketing.
            Explore how we build, scale, and measure creator campaigns for high-growth brands.
          </p>

          <div className="subpage-hero__actions">
            <button
              type="button"
              onClick={handleOpenModal}
              className="subpage-cta-btn"
            >
              <span>INQUIRE ABOUT SERVICES</span>
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Services Breakdown */}
      <section className="subpage-content-section">
        <div className="subpage-container">
          <div className="services-list">
            {SERVICES.map((service) => (
              <div key={service.number} className="service-detail-card">
                <div className="service-detail-card__top">
                  <span className="service-number">{service.number}</span>
                  <h2 className="service-title">{service.title}</h2>
                </div>

                <p className="service-tagline highlight">{service.tagline}</p>
                <p className="service-desc">{service.desc}</p>

                <div className="service-deliverables">
                  <span className="deliverables-title">WHAT WE DELIVER:</span>
                  <ul className="deliverables-list">
                    {service.deliverables.map((item) => (
                      <li key={item} className="deliverables-item">
                        <span className="check">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process / Workflow */}
      <section className="subpage-process-section">
        <div className="subpage-container">
          <div className="subpage-section-header">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              HOW WE WORK
            </div>
            <h2 className="subpage-section-title">
              OUR 4-STEP <span className="highlight">BLUEPRINT.</span>
            </h2>
          </div>

          <div className="process-grid">
            {PROCESS_STEPS.map((item) => (
              <div key={item.step} className="process-card">
                <span className="process-num">{item.step}</span>
                <h3 className="process-name">{item.name}</h3>
                <p className="process-summary">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="subpage-banner-cta">
        <div className="subpage-container">
          <div className="subpage-banner-inner">
            <span className="eyebrow">CUSTOM CAMPAIGN REQUIREMENTS?</span>
            <h2 className="subpage-banner-title">
              LET’S TALK <span className="highlight">STRATEGY.</span>
            </h2>
            <p className="subpage-banner-copy">
              Send us your brief and timeline. We’ll curate an actionable proposal tailored to your goals.
            </p>
            <button
              type="button"
              onClick={handleOpenModal}
              className="subpage-cta-btn subpage-cta-btn--large"
            >
              <span>START A CAMPAIGN</span>
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
