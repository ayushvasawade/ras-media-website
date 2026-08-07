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
  scale?: number
}

function LogoMesh({ mouseX, mouseY, scrollProgress, scale = 8 }: LogoMeshProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const { scene } = useGLTF('/RAS.glb')

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

  // Idle float + rotation + mouse parallax
  const idleAngle = useRef(0)
  const floatOffset = useRef(0)
  const currentRot = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Time-based idle
    idleAngle.current += delta * 0.3
    floatOffset.current += delta * 0.5

    // Target rotation from mouse
    const targetRotY = mouseX.current * 0.35
    const targetRotX = mouseY.current * -0.2

    // Smooth interpolation
    currentRot.current.x += (targetRotX - currentRot.current.x) * 0.04
    currentRot.current.y += (targetRotY - currentRot.current.y) * 0.04

    // Idle slow Y rotation
    const idleRotY = Math.sin(idleAngle.current * 0.4) * 0.1

    // Floating movement
    const floatY = Math.sin(floatOffset.current) * 0.008

    // Scroll-driven: slight Z pull + rotation
    const sp = scrollProgress.current
    const scrollRotX = sp * 0.4
    const scrollZ = sp * -0.5

    groupRef.current.rotation.x = currentRot.current.x + scrollRotX
    groupRef.current.rotation.y = currentRot.current.y + idleRotY
    groupRef.current.position.y = floatY + sp * -0.15
    groupRef.current.position.z = scrollZ
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

function Lighting() {
  const lightRef = useRef<THREE.PointLight>(null!)

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(clock.elapsedTime * 0.8) * 0.3
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
        ref={lightRef}
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

      {/* Subtle blue-ish cool fill from below — depth */}
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

// ─── Loading Fallback ──────────────────────────────────────────────────────
function LogoFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        style={{
          width: 60,
          height: 60,
          border: '1px solid rgba(193,39,45,0.3)',
          borderTopColor: '#C1272D',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Public Component ──────────────────────────────────────────────────────
interface RASLogo3DProps {
  className?: string
  style?: React.CSSProperties
  scale?: number
  mouseX: React.MutableRefObject<number>
  mouseY: React.MutableRefObject<number>
  scrollProgress: React.MutableRefObject<number>
  isMobile?: boolean
}

export default function RASLogo3D({
  className,
  style,
  scale = 8,
  mouseX,
  mouseY,
  scrollProgress,
  isMobile = false,
}: RASLogo3DProps) {
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
            scale={mobileScale}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
