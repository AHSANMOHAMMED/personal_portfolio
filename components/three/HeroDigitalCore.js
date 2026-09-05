'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function CoreMesh() {
  const meshRef = useRef(null)
  const wireframeRef = useRef(null)

  // Shader material uniform updates
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

  // Particles position memory
  // Particles position memory (deterministic distribution)
  const particleCount = 200
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const r = (Math.random() * 0.8 + 1.2) * 2.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const pseudoRand1 = Math.sin(i * 9999.0) * 0.5 + 0.5
      const pseudoRand2 = Math.cos(i * 3333.0) * 0.5 + 0.5
      const pseudoRand3 = Math.sin(i * 1234.0) * 0.5 + 0.5
      const r = (pseudoRand1 * 0.8 + 1.2) * 2.2
      const theta = pseudoRand2 * Math.PI * 2
      const phi = Math.acos(pseudoRand3 * 2 - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      const p1 = Math.sin(i * 9999.0) * 0.5 + 0.5
      const p2 = Math.cos(i * 3333.0) * 0.5 + 0.5
      const p3 = Math.sin(i * 1234.0) * 0.5 + 0.5
      const radius = (p1 * 0.8 + 1.2) * 2.2
      const theta = p2 * Math.PI * 2
      const phi = Math.acos(p3 * 2 - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return positions
  }, [particleCount])

  return (
    <group scale={1.2}>
      {/* Inner Icosahedron Core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#f7931e"
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
          emissive="#e85500"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Outer Wireframe Shield */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[2.1, 2]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Ambient Particle Cloud */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlesPosition, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#f7931e"
          transparent
          opacity={0.7}
          sizeAttenuation
        />
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
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00f0ff" />
        <CoreMesh />
      </Canvas>
    </div>
  )
}

