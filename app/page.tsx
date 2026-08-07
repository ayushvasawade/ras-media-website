'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Hero from '@/components/sections/Hero'
import BrandStatement from '@/components/sections/BrandStatement'
import Services from '@/components/sections/Services'
import CreatorNetwork from '@/components/sections/CreatorNetwork'
import Campaigns from '@/components/sections/Campaigns'
import Process from '@/components/sections/Process'
import WhyRAS from '@/components/sections/WhyRAS'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  useEffect(() => {
    // Lenis smooth scroll integration with GSAP ScrollTrigger
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null

    const initLenis = async () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) return

      const { default: Lenis } = await import('lenis')

      const lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      lenis = lenisInstance

      // Sync Lenis with GSAP ScrollTrigger
      lenisInstance.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)
    }

    initLenis()

    return () => {
      if (lenis) {
        lenis.destroy()
      }
      gsap.ticker.remove(() => {})
    }
  }, [])

  return (
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <BrandStatement />
      <Services />
      <CreatorNetwork />
      <Campaigns />
      <Process />
      <WhyRAS />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
