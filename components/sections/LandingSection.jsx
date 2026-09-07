'use client'

import { useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from '@/lib/gsap'
import { splitText } from '@/lib/splitText'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/LandingSection.module.css'

function CharacterModel() {
  const meshRef = useRef()
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()

    // Gentle idle rotation
    groupRef.current.rotation.y += delta * 0.15

    // Subtle floating motion
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 0.8) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
      {/* Head */}
      <mesh ref={meshRef} position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#c2a4ff" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.4, 1, 8, 16]} />
        <meshStandardMaterial color="#8a6cc7" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Base platform */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.15, 32]} />
        <meshStandardMaterial color="#0b080c" roughness={0.8} metalness={0.2} />
      </mesh>
      {/* Glow ring */}
      <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.03, 16, 64]} />
        <meshBasicMaterial color="#c2a4ff" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#c2a4ff" />
      <spotLight position={[0, 5, 0]} angle={0.5} intensity={0.8} color="#8a6cc7" />
      <CharacterModel />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <Environment preset="night" />
    </>
  )
}

export default function LandingSection() {
  const containerRef = useRef(null)
  const introRef = useRef(null)
  const infoRef = useRef(null)
  const h2_1Ref = useRef(null)
  const h2_infoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const container = containerRef.current
      if (!container) return

      // Split text animations
      if (introRef.current) {
        const split = splitText(introRef.current, { type: 'chars,lines', linesClass: 'split-line' })
        gsap.fromTo(split.chars,
          { y: 80, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            stagger: 0.025,
            ease: 'power3.inOut',
            delay: 0.3,
          }
        )
      }

      // Landing info animation
      if (h2_1Ref.current) {
        const split1 = splitText(h2_1Ref.current, { type: 'chars,lines', linesClass: 'split-h2' })
        gsap.fromTo(split1.chars,
          { y: 80, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            stagger: 0.025,
            ease: 'power3.inOut',
            delay: 0.5,
          }
        )
      }

      if (h2_infoRef.current) {
        gsap.fromTo(h2_infoRef.current,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: 'power1.inOut',
            delay: 0.8,
          }
        )
      }

      // Animate canvas in
      if (canvasRef.current) {
        gsap.fromTo(canvasRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.2,
          }
        )
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const firstName = profile.developer?.name || 'Ahsan'
  const lastName = profile.developer?.fullName?.split(' ').slice(1).join(' ') || 'Mohammed'

  return (
    <div ref={containerRef} className={styles.landingSection} id="landingDiv">
      <div className={styles.landingContainer}>
        {/* Intro text */}
        <div ref={introRef} className={styles.landingIntro}>
          <h2>Hello! I&apos;m</h2>
          <h1>
            {firstName.toUpperCase()}
            <br />
            <span>{lastName.toUpperCase()}</span>
          </h1>
        </div>

        {/* Info text */}
        <div ref={infoRef} className={styles.landingInfo}>
          <h3>An</h3>
          <h2 className={styles.landingInfoH2}>
            <div ref={h2_1Ref} className={styles.landingH21}>
              {profile.developer?.title?.split(' ').slice(0, 2).join(' ') || 'Full-Stack'}
            </div>
          </h2>
          <h2>
            <div ref={h2_infoRef} className={styles.landingH2Info}>
              {profile.developer?.title?.split(' ').slice(2).join(' ') || 'Engineer'}
            </div>
          </h2>
        </div>

        {/* Mobile photo */}
        <div className={styles.mobilePhoto}>
          <img
            src="/images/my_portrait_1778399171468.png"
            alt={profile.developer?.fullName || 'Ahsan Mohammed'}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* 3D Character */}
        <div ref={canvasRef} className={styles.characterContainer}>
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 1, 5], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <Scene />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </div>
  )
}