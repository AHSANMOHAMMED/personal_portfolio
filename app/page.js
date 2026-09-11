'use client'

import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/ui/Navbar'
import CustomCursor from '@/components/ui/CustomCursor'
import LandingSection from '@/components/sections/LandingSection'
import AboutSection from '@/components/sections/AboutSection'
import WhatIDoSection from '@/components/sections/WhatIDoSection'
import CareerSection from '@/components/sections/CareerSection'
import WorkSection from '@/components/sections/WorkSection'
import TechStackSection from '@/components/sections/TechStackSection'
import CTASection from '@/components/sections/CTASection'
import ContactSection from '@/components/sections/ContactSection'
import IconsSection from '@/components/sections/IconsSection'
import { LoadingProvider } from '@/context/LoadingProvider'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

const CharacterModel = dynamic(() => import('@/components/three/Character'), {
  ssr: false,
})

function HomeContent() {
  const [showCharacter, setShowCharacter] = useState(false)

  useEffect(() => {
    // Desktop-only 3D character (matches reference >1024)
    const mq = window.matchMedia('(min-width: 1025px)')
    const sync = () => setShowCharacter(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <div className="container-main">
      <CustomCursor />
      <Navbar />
      <IconsSection />
      {showCharacter ? (
        <ErrorBoundary
          fallback={null}
          onError={(err) => console.error('Character crashed:', err)}
        >
          <Suspense fallback={null}>
            <CharacterModel />
          </Suspense>
        </ErrorBoundary>
      ) : null}
      <div className="container-main">
        <LandingSection />
        <AboutSection />
        <WhatIDoSection />
        <CareerSection />
        <WorkSection />
        <TechStackSection />
        <CTASection />
        <ContactSection />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <LoadingProvider>
      <HomeContent />
    </LoadingProvider>
  )
}
