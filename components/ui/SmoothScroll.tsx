'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll() {
  const lenisRef = useRef<any>(null)
  const tickerRef = useRef<((time: number) => void) | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const desktopMediaQuery = window.matchMedia('(min-width: 1024px)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let isDisposed = false

    const destroyLenis = () => {
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current)
        tickerRef.current = null
      }
      if (lenisRef.current) {
        lenisRef.current.off('scroll', ScrollTrigger.update)
        lenisRef.current.destroy()
        lenisRef.current = null
        if (typeof window !== 'undefined') {
          delete (window as any).__lenis
        }
      }
      ScrollTrigger.refresh()
    }

    const initLenis = async () => {
      // Clean up any existing instance first
      destroyLenis()

      if (isDisposed) return
      if (reducedMotionQuery.matches || !desktopMediaQuery.matches) {
        return
      }

      const { default: Lenis } = await import('lenis')
      if (isDisposed || !desktopMediaQuery.matches) return

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        infinite: false,
        autoRaf: false,
      })

      lenisRef.current = lenis
      ;(window as any).__lenis = lenis

      // Synchronize Lenis scroll position with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update)

      // GSAP Ticker drives Lenis animation frame
      const tick = (time: number) => {
        lenis.raf(time * 1000)
      }
      tickerRef.current = tick
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      ScrollTrigger.refresh()
    }

    initLenis()

    const handleMediaChange = () => {
      if (desktopMediaQuery.matches && !reducedMotionQuery.matches) {
        if (!lenisRef.current) {
          initLenis()
        }
      } else {
        if (lenisRef.current) {
          destroyLenis()
        }
      }
    }

    desktopMediaQuery.addEventListener('change', handleMediaChange)
    reducedMotionQuery.addEventListener('change', handleMediaChange)

    return () => {
      isDisposed = true
      desktopMediaQuery.removeEventListener('change', handleMediaChange)
      reducedMotionQuery.removeEventListener('change', handleMediaChange)
      destroyLenis()
    }
  }, [])

  return null
}
