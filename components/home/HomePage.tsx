'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Hero from '@/components/sections/Hero'

// Dynamically import Loader so it never renders on the server
const Loader = dynamic(() => import('@/components/ui/Loader'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  // Shared ref for the future scene-to-scene forward-travel transitions.
  const forwardProgress = useRef(0)

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
    let tick: ((time: number) => void) | null = null

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

      tick = (time: number) => {
        lenisInstance.raf(time * 1000)
      }
      gsap.ticker.add(tick)

      gsap.ticker.lagSmoothing(0)
    }

    initLenis()

    return () => {
      if (lenis) {
        lenis.destroy()
      }
      if (tick) {
        gsap.ticker.remove(tick)
      }
    }
  }, [])

  return (
    <>
      {/* Cinematic intro loader — unmounted after exit animation completes */}
      {!loaderDone && <Loader onComplete={() => setLoaderDone(true)} />}

      <main id="main-content" tabIndex={-1}>
        <Hero transitionProgressRef={forwardProgress} loaderDone={loaderDone} />

        {/* Foundation spacer for the forward-zoom travel system (Section 2 intentionally not built yet). */}
        <section className="forward-scroll-buffer" aria-hidden="true" />
      </main>
    </>
  )
}
