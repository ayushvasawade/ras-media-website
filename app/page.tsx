'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
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

// Dynamically import Loader so it never renders on the server
const Loader = dynamic(() => import('@/components/ui/Loader'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  // Shared ref: written by HeroTransition's ScrollTrigger, read by RASLogo3D useFrame
  const transitionProgress = useRef(0)

  // Loader state: becomes true when the cinematic loader completes its exit
  const [loaderDone, setLoaderDone] = useState(false)

  // Prevent scroll during the loader
  useEffect(() => {
    if (!loaderDone) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [loaderDone])

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
    <>
      {/* Cinematic intro loader — unmounted after exit animation completes */}
      {!loaderDone && <Loader onComplete={() => setLoaderDone(true)} />}

      <main id="main-content" tabIndex={-1}>
        <Hero transitionProgress={transitionProgress} loaderDone={loaderDone} />
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
    </>
  )
}
