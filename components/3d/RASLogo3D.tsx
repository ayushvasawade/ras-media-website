'use client'

import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Preload the GLB
useGLTF.preload('/RAS.glb')

interface LogoMeshProps {
  mouseX: React.MutableRefObject<number>
  mouseY: React.MutableRefObject<number>
  scrollProgress: React.MutableRefObject<number>
  transitionProgress: React.MutableRefObject<number>
  introProgress: React.MutableRefObject<number>
  scale?: number
}

function LogoMesh({ mouseX, mouseY, scrollProgress, transitionProgress, introProgress, scale = 8 }: LogoMeshProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const { scene } = useGLTF('/RAS.glb')
  const glbReadyDispatched = useRef(false)

  // Clone scene to avoid shared state issues
  const clonedScene = useRef<THREE.Object3D | null>(null)

  useEffect(() => {
    if (!clonedScene.current) {
      clonedScene.current = scene.clone(true)

      // Enhance materials: add metalness/roughness for a premium look
      clonedScene.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone()

          // Override SVGMat.001 teal to deep red/dark
          if (mat.name === 'SVGMat.001') {
            mat.color = new THREE.Color('#1a0003')
            mat.metalness = 0.6
            mat.roughness = 0.3
          } else {
            // Enhance all other red/maroon materials
            mat.metalness = Math.max(mat.metalness, 0.3)
            mat.roughness = Math.min(mat.roughness, 0.45)
            mat.envMapIntensity = 1.5
          }

          mesh.material = mat
          mesh.castShadow = true
          mesh.receiveShadow = true
        }
      })

      // Signal that GLB is ready — Loader listens for this
      if (!glbReadyDispatched.current) {
        glbReadyDispatched.current = true
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('ras:glb-ready'))
        }
      }
    }

    if (groupRef.current && clonedScene.current) {
      groupRef.current.add(clonedScene.current)
    }

    return () => {
      if (groupRef.current && clonedScene.current) {
        groupRef.current.remove(clonedScene.current)
      }
    }
  }, [scene])

  // ── Animation state ───────────────────────────────────────────────────────
  const idleAngle = useRef(0)
  const floatOffset = useRef(0)

  // Smoothed rotation
  const currentRot = useRef({ x: 0, y: 0 })
  // Smoothed XY positional drift
  const currentPos = useRef({ x: 0, y: 0 })

  // Idle-return: track when cursor last moved
  const lastMouseX = useRef(0)
  const lastMouseY = useRef(0)
  const idleFrames = useRef(0)
  const IDLE_FRAMES_THRESHOLD = 90 // ~1.5s at 60fps

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Time-based idle
    idleAngle.current += delta * 0.3
    floatOffset.current += delta * 0.5

    // Detect cursor movement / idleness
    const mx = mouseX.current
    const my = mouseY.current
    const moved = Math.abs(mx - lastMouseX.current) > 0.001 || Math.abs(my - lastMouseY.current) > 0.001
    if (moved) {
      idleFrames.current = 0
      lastMouseX.current = mx
      lastMouseY.current = my
    } else {
      idleFrames.current++
    }

    const isIdle = idleFrames.current > IDLE_FRAMES_THRESHOLD
    // Blend factor: 0 = active, 1 = full idle return
    const idleBlend = isIdle ? Math.min(1, (idleFrames.current - IDLE_FRAMES_THRESHOLD) / 120) : 0

    // Target rotation from mouse (scaled down during idle return)
    const activeScale = 1 - idleBlend
    const targetRotY = mx * 0.35 * activeScale
    const targetRotX = my * -0.25 * activeScale

    // Target XY position from mouse — strong spatial follow (±0.35 / ±0.2 units)
    // The logo should clearly chase the cursor in 3D space with weight.
    const targetPosX = mx * 0.35 * activeScale
    const targetPosY = my * -0.2 * activeScale

    // Smooth interpolation with damping (premium inertia — object has weight)
    currentRot.current.x += (targetRotX - currentRot.current.x) * 0.05
    currentRot.current.y += (targetRotY - currentRot.current.y) * 0.05
    currentPos.current.x += (targetPosX - currentPos.current.x) * 0.035
    currentPos.current.y += (targetPosY - currentPos.current.y) * 0.035

    // Idle slow Y sway
    const idleRotY = Math.sin(idleAngle.current * 0.4) * 0.1

    // Floating movement
    const floatY = Math.sin(floatOffset.current) * 0.008

    // Scroll-driven: slight Z pull + rotation
    const sp = scrollProgress.current
    const scrollRotX = sp * 0.4
    const scrollZ = sp * -0.5

    // Cinematic transition: deeper Z pull + scale reduction
    const tp = transitionProgress.current
    const transZ = tp * -2.0
    const transScaleMult = 1 - tp * 0.35

    // Intro zoom: during loader→hero, logo starts slightly larger and zooms out
    const ip = introProgress.current
    const introScaleVal = 1 + (1 - ip) * 0.15 // 1.15 → 1.0

    groupRef.current.rotation.x = currentRot.current.x + scrollRotX
    groupRef.current.rotation.y = currentRot.current.y + idleRotY
    groupRef.current.position.x = currentPos.current.x
    groupRef.current.position.y = floatY + sp * -0.15 + currentPos.current.y
    groupRef.current.position.z = scrollZ + transZ
    groupRef.current.scale.setScalar(scale * transScaleMult * introScaleVal)
  })

  return (
    <group
      ref={groupRef}
      scale={[scale, scale, scale]}
      // Center the model — model spans roughly [0.02..0.21] in X and Z
      position={[-0.115 * scale, -0.115 * scale, 0]}
    />
  )
}

// ── Orbiting rim light ─────────────────────────────────────────────────────
function Lighting() {
  const keyLightRef = useRef<THREE.PointLight>(null!)
  const rimLightRef = useRef<THREE.PointLight>(null!)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    // Key light breathes
    if (keyLightRef.current) {
      keyLightRef.current.intensity = 1.5 + Math.sin(t * 0.8) * 0.3
    }

    // Rim light slowly orbits around the Y axis for living reflections
    if (rimLightRef.current) {
      const angle = t * 0.18
      rimLightRef.current.position.set(Math.cos(angle) * 4, 1.5, Math.sin(angle) * 3)
      rimLightRef.current.intensity = 0.7 + Math.sin(t * 0.5) * 0.2
    }
  })

  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.15} />

      {/* Key light - warm white from upper right */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.5}
        color="#fff5ee"
      />

      {/* Red accent fill from front-left */}
      <pointLight
        ref={keyLightRef}
        position={[-3, 2, 4]}
        intensity={1.5}
        color="#C1272D"
        distance={15}
      />

      {/* Deep maroon rim from behind */}
      <pointLight
        position={[2, -2, -4]}
        intensity={0.8}
        color="#6B0F12"
        distance={10}
      />

      {/* Orbiting rim — creates life in the metallic reflections */}
      <pointLight
        ref={rimLightRef}
        position={[4, 1.5, 3]}
        intensity={0.9}
        color="#C1272D"
        distance={12}
      />

      {/* Subtle cool fill from below — depth */}
      <pointLight
        position={[0, -5, 2]}
        intensity={0.4}
        color="#1a1a2e"
        distance={8}
      />
    </>
  )
}

function SceneSetup() {
  const { gl } = useThree()

  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }, [gl])

  return null
}

// ─── Public Component ──────────────────────────────────────────────────────
interface RASLogo3DProps {
  className?: string
  style?: React.CSSProperties
  scale?: number
  mouseX: React.MutableRefObject<number>
  mouseY: React.MutableRefObject<number>
  scrollProgress: React.MutableRefObject<number>
  /** Optional: only needed by Hero. Absent ⇒ zero (no transition effect). */
  transitionProgress?: React.MutableRefObject<number>
  /** 0→1 during loader-to-hero intro. Absent ⇒ 1 (intro complete, no zoom). */
  introProgress?: React.MutableRefObject<number>
  isMobile?: boolean
}

export default function RASLogo3D({
  className,
  style,
  scale = 8,
  mouseX,
  mouseY,
  scrollProgress,
  transitionProgress,
  introProgress,
  isMobile = false,
}: RASLogo3DProps) {
  // Fallback refs for optional props
  const zeroRef = useRef(0)
  const oneRef = useRef(1)
  const resolvedTP = transitionProgress ?? zeroRef
  const resolvedIP = introProgress ?? oneRef
  const mobileScale = isMobile ? scale * 0.65 : scale

  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        camera={{ position: [0, 0, 1.8], fov: 45, near: 0.01, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <SceneSetup />
        <Lighting />
        <Suspense fallback={null}>
          <LogoMesh
            mouseX={mouseX}
            mouseY={mouseY}
            scrollProgress={scrollProgress}
            transitionProgress={resolvedTP}
            introProgress={resolvedIP}
            scale={mobileScale}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
