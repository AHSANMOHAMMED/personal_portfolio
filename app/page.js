'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import LoadingScreen from '@/components/sections/LoadingScreen'
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

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const mainRef = useRef(null)
  const lenisRef = useRef(null)

  useEffect(() => {
    if (!isLoaded) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    })

    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // GSAP ScrollTrigger integration with Lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [isLoaded])

  return (
    <>
      <CustomCursor />

      {!isLoaded && (
        <LoadingScreen onComplete={() => setIsLoaded(true)} />
      )}

      {isLoaded && (
        <>
          <Navbar />

          <main ref={mainRef} id="main-content">
            <LandingSection />
            <AboutSection />
            <WhatIDoSection />
            <CareerSection />
            <WorkSection />
            <TechStackSection />
            <CTASection />
            <ContactSection />
            <IconsSection />
          </main>
        </>
      )}
    </>
  )
}