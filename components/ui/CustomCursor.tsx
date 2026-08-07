'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsMobile(true)
      return
    }

    const dot = dotRef.current!
    const ring = ringRef.current!
    const label = labelRef.current!

    let dotX = 0, dotY = 0
    let ringX = 0, ringY = 0
    let animId: number

    const onMouseMove = (e: MouseEvent) => {
      dotX = e.clientX
      dotY = e.clientY
    }

    const animate = () => {
      // Dot follows exactly
      dot.style.left = `${dotX}px`
      dot.style.top = `${dotY}px`

      // Ring lags behind
      ringX += (dotX - ringX) * 0.12
      ringY += (dotY - ringY) * 0.12
      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`
      label.style.left = `${ringX}px`
      label.style.top = `${ringY}px`

      animId = requestAnimationFrame(animate)
    }

    const onMouseEnterHoverable = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      dot.classList.add('is-hovering')
      ring.classList.add('is-hovering')

      const cursorLabel = target.getAttribute('data-cursor')
      if (cursorLabel) {
        label.textContent = cursorLabel
        label.classList.add('is-visible')
      }
    }

    const onMouseLeaveHoverable = () => {
      dot.classList.remove('is-hovering')
      ring.classList.remove('is-hovering')
      label.classList.remove('is-visible')
    }

    const onMouseLeaveWindow = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const onMouseEnterWindow = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    // Attach to all interactive elements
    const attachHandlers = () => {
      const hoverables = document.querySelectorAll(
        'a, button, [data-cursor], .btn, .nav-link, .service-item, .campaign-card'
      )
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterHoverable)
        el.addEventListener('mouseleave', onMouseLeaveHoverable)
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeaveWindow)
    document.addEventListener('mouseenter', onMouseEnterWindow)
    attachHandlers()
    animId = requestAnimationFrame(animate)

    // Re-attach when new elements mount
    const observer = new MutationObserver(attachHandlers)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeaveWindow)
      document.removeEventListener('mouseenter', onMouseEnterWindow)
      cancelAnimationFrame(animId)
      observer.disconnect()
    }
  }, [])

  if (isMobile) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true" />
    </>
  )
}
