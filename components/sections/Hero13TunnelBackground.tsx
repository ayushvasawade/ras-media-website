'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Hero13TunnelBackgroundProps {
  className?: string
}

type ReadyWindow = Window & { __rasHero13Ready?: boolean }

export default function Hero13TunnelBackground({ className }: Hero13TunnelBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const readyWindow = window as ReadyWindow

    if (reducedMotion) {
      readyWindow.__rasHero13Ready = true
      window.dispatchEvent(new CustomEvent('ras:hero13-ready'))
      return
    }

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    root.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 40)
    camera.position.set(0, 0, 2.2)

    const tunnelGroup = new THREE.Group()
    scene.add(tunnelGroup)

    const frameCount = isMobile ? 20 : 30
    const frameSpacing = 0.65
    const frameMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color('#6B0F12'),
      transparent: true,
      opacity: 0.24,
    })

    const frames: THREE.LineSegments[] = []
    for (let i = 0; i < frameCount; i++) {
      const size = 1 + i * 0.09
      const geometry = new THREE.EdgesGeometry(new THREE.PlaneGeometry(size * 2.4, size * 1.4))
      const frame = new THREE.LineSegments(geometry, frameMaterial)
      frame.position.z = -i * frameSpacing
      frame.position.y = Math.sin(i * 0.55) * 0.12
      tunnelGroup.add(frame)
      frames.push(frame)
    }

    const haze = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#1A0003'),
        transparent: true,
        opacity: 0.24,
      })
    )
    haze.position.z = -10
    scene.add(haze)

    const pointerTarget = new THREE.Vector2(0, 0)
    const pointerSmooth = new THREE.Vector2(0, 0)
    let rafId = 0
    let alive = true

    const resize = () => {
      const { clientWidth, clientHeight } = root
      if (clientWidth === 0 || clientHeight === 0) return
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * 2
    }

    const loop = () => {
      if (!alive) return

      pointerSmooth.x += (pointerTarget.x - pointerSmooth.x) * 0.05
      pointerSmooth.y += (pointerTarget.y - pointerSmooth.y) * 0.05

      tunnelGroup.rotation.y = pointerSmooth.x * 0.05
      tunnelGroup.rotation.x = -pointerSmooth.y * 0.03

      if (!reducedMotion) {
        const speed = isMobile ? 0.015 : 0.02
        const wrapLimit = 1.2
        const backLimit = -frameSpacing * (frameCount - 1)

        for (let i = 0; i < frames.length; i++) {
          const frame = frames[i]
          const material = frame.material as THREE.LineBasicMaterial
          frame.position.z += speed

          if (frame.position.z > wrapLimit) {
            frame.position.z = backLimit
          }

          const depthNorm = Math.max(0, Math.min(1, (Math.abs(frame.position.z) / Math.abs(backLimit || 1))))
          material.opacity = 0.06 + (1 - depthNorm) * 0.24
        }
      }

      renderer.render(scene, camera)
      rafId = window.requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    readyWindow.__rasHero13Ready = true
    window.dispatchEvent(new CustomEvent('ras:hero13-ready'))
    rafId = window.requestAnimationFrame(loop)

    return () => {
      alive = false
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      renderer.dispose()
      frameMaterial.dispose()
      haze.geometry.dispose()
      ;(haze.material as THREE.Material).dispose()
      frames.forEach((frame) => frame.geometry.dispose())
      root.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={rootRef} className={className} aria-hidden="true" />
}
