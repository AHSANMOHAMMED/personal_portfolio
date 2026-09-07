'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'

function CoreMesh() {
  const meshRef = useRef(null)
  const wireframeRef = useRef(null)

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.2 + pointer.y * 0.5
      meshRef.current.rotation.y = t * 0.3 + pointer.x * 0.5
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = -t * 0.15 - pointer.y * 0.3
      wireframeRef.current.rotation.y = -t * 0.25 - pointer.x * 0.3
    }
  })

  const particleCount = 200
  const allPositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const p1 = Math.sin(i * 9999.0) * 0.5 + 0.5
      const p2 = Math.cos(i * 3333.0) * 0.5 + 0.5
      const p3 = Math.sin(i * 1234.0) * 0.5 + 0.5

      const radius = (p1 * 0.8 + 1.2) * 2.2
      const theta = p2 * Math.PI * 2
      const phi = Math.acos(p3 * 2 - 1)

      positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return positions
  }, [])

  // Split into orange (first 100) and cyan (last 100)
  const orangePos = useMemo(() => allPositions.slice(0, 300),   [allPositions])
  const cyanPos   = useMemo(() => allPositions.slice(300, 600), [allPositions])

  return (
    <group scale={1.2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#c2a4ff"
          roughness={0.2}
          metalness={0.8}
          emissive="#e85500"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[2.1, 2]} />
        <meshBasicMaterial color="#8a6cc7" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Orange particles — first 100 */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[orangePos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#c2a4ff" transparent opacity={0.7} sizeAttenuation />
      </points>

      {/* Cyan particles — last 100 */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cyanPos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#8a6cc7" transparent opacity={0.6} sizeAttenuation />
      </points>
    </group>
  )
}

export default function HeroDigitalCore() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '350px' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => {
          window.dispatchEvent(new CustomEvent('threejs-ready'))
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#8a6cc7" />
        <CoreMesh />
      </Canvas>
    </div>
  )
}
