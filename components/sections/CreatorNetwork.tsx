'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Animated creator network using Canvas 2D
function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    let w = canvas.offsetWidth
    let h = canvas.offsetHeight
    canvas.width = w
    canvas.height = h

    const RAS_RED = [193, 39, 45]
    const RAS_MAROON = [107, 15, 18]

    // Nodes representing network entities
    interface Node {
      x: number
      y: number
      vx: number
      vy: number
      r: number
      color: number[]
      label: string
      pulse: number
      pulseSpeed: number
    }

    const LABELS = ['BRAND', 'RAS MEDIA', 'CREATOR', 'AUDIENCE', 'CREATOR', 'BRAND', 'CREATOR', 'AUDIENCE', 'CREATOR']

    const nodes: Node[] = Array.from({ length: 24 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 3 + 1.5,
      color: i % 3 === 0 ? RAS_RED : RAS_MAROON,
      label: LABELS[i % LABELS.length] || '',
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
    }))

    // Central node — RAS Media hub
    const center: Node = {
      x: w / 2, y: h / 2,
      vx: 0, vy: 0,
      r: 8,
      color: RAS_RED,
      label: 'RAS',
      pulse: 0, pulseSpeed: 0.03,
    }

    let frame = 0

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      frame++

      // Update nodes
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        node.pulse += node.pulseSpeed

        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > h) node.vy *= -1
      })

      center.pulse += center.pulseSpeed

      // Draw connections
      ;[...nodes].forEach((nodeA) => {
        ;[...nodes, center].forEach((nodeB) => {
          const dx = nodeA.x - nodeB.x
          const dy = nodeA.y - nodeB.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.35
            const [r, g, b] = RAS_MAROON
            ctx.beginPath()
            ctx.moveTo(nodeA.x, nodeA.y)
            ctx.lineTo(nodeB.x, nodeB.y)
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        })

        // Draw connection to center if close
        const dx = nodeA.x - center.x
        const dy = nodeA.y - center.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 280) {
          const alpha = (1 - dist / 280) * 0.6
          const [r, g, b] = RAS_RED
          ctx.beginPath()
          ctx.moveTo(nodeA.x, nodeA.y)
          ctx.lineTo(center.x, center.y)
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      })

      // Draw nodes
      nodes.forEach((node) => {
        const pulseSize = Math.sin(node.pulse) * 1.5
        const [r, g, b] = node.color

        // Glow
        const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 4 + pulseSize)
        grd.addColorStop(0, `rgba(${r},${g},${b},0.25)`)
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r * 4 + pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r + pulseSize * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},0.9)`
        ctx.fill()
      })

      // Draw center (RAS hub)
      const cp = Math.sin(center.pulse) * 3
      const cgrd = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, center.r * 6 + cp)
      cgrd.addColorStop(0, `rgba(193,39,45,0.4)`)
      cgrd.addColorStop(1, `rgba(193,39,45,0)`)
      ctx.beginPath()
      ctx.arc(center.x, center.y, center.r * 6 + cp, 0, Math.PI * 2)
      ctx.fillStyle = cgrd
      ctx.fill()

      ctx.beginPath()
      ctx.arc(center.x, center.y, center.r + cp * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = '#C1272D'
      ctx.fill()

      // Center ring
      ctx.beginPath()
      ctx.arc(center.x, center.y, center.r * 3 + cp, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(193,39,45,0.25)`
      ctx.lineWidth = 1
      ctx.stroke()

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    const onResize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w
      canvas.height = h
      center.x = w / 2
      center.y = h / 2
    }

    window.addEventListener('resize', onResize)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="network-canvas"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  )
}

export default function CreatorNetwork() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="network-section"
      id="network"
      aria-label="RAS Creator Network"
    >
      <NetworkCanvas />

      {/* Dark overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(8,8,8,0.7) 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div ref={contentRef} className="network-content" style={{ opacity: 0 }}>
        <div className="section-label" aria-hidden="true">The Network</div>
        <h2 className="text-display-lg" style={{ maxWidth: 700, marginBottom: '2rem' }}>
          A NETWORK
          <br />
          BUILT FOR
          <br />
          <span style={{ color: 'var(--ras-red)' }}>INFLUENCE.</span>
        </h2>
        <p className="text-body-lg" style={{ maxWidth: 520, marginBottom: '3rem' }}>
          RAS Media sits at the intersection of brands and creators — orchestrating campaigns that flow from strategy through to audience impact.
        </p>

        {/* Flow diagram */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
          role="list"
          aria-label="Campaign flow: Brand to Impact"
        >
          {['BRANDS', 'RAS MEDIA', 'CREATORS', 'AUDIENCE', 'IMPACT'].map((label, i, arr) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} role="listitem">
              <div
                style={{
                  padding: '0.6rem 1.2rem',
                  border: `1px solid ${i === 1 ? 'var(--ras-red)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '2px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  color: i === 1 ? 'var(--ras-red)' : 'var(--ras-white-dim)',
                  background: i === 1 ? 'rgba(193,39,45,0.08)' : 'transparent',
                }}
              >
                {label}
              </div>
              {i < arr.length - 1 && (
                <div
                  style={{
                    color: 'var(--ras-red)',
                    fontSize: '0.8rem',
                    opacity: 0.6,
                  }}
                  aria-hidden="true"
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
