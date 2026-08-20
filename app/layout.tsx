import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/ui/Navigation'
import CustomCursor from '@/components/ui/CustomCursor'
import CampaignModal from '@/components/ui/CampaignModal'
import SmoothScroll from '@/components/ui/SmoothScroll'

export const metadata: Metadata = {
  metadataBase: new URL('https://rasmedia.agency'),
  title: 'RAS Media — Influencer Marketing Agency',
  description:
    'RAS Media connects brands with creators and builds influencer campaigns that turn attention into impact. From creator discovery to campaign execution and performance reporting.',
  keywords: [
    'influencer marketing',
    'influencer agency',
    'creator marketing',
    'Instagram influencers',
    'brand campaigns',
    'RAS Media',
  ],
  openGraph: {
    title: 'RAS Media — Influencer Marketing Agency',
    description:
      'RAS Media connects brands with creators and builds influencer campaigns that turn attention into impact.',
    type: 'website',
    locale: 'en_US',
    siteName: 'RAS Media',
    images: [
      {
        url: '/ras-logo.png',
        width: 1200,
        height: 630,
        alt: 'RAS Media — Influencer Marketing Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAS Media — Influencer Marketing Agency',
    description:
      'RAS Media connects brands with creators and builds influencer campaigns that turn attention into impact.',
    images: ['/ras-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#080808" />
        <link rel="icon" href="/ras-logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/ras-logo.png" />
      </head>
      <body>
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="skip-link"
          aria-label="Skip to main content"
        >
          Skip to content
        </a>

        <CustomCursor />
        <SmoothScroll />
        <Navigation />
        <CampaignModal />
        {children}
      </body>
    </html>
  )
}
