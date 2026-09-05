'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import Navbar                from '@/components/ui/Navbar'
import VideoIntro            from '@/components/sections/VideoIntro'
import HeroSection           from '@/components/sections/HeroSection'
import AboutSection          from '@/components/sections/AboutSection'
import ProjectsSection       from '@/components/sections/ProjectsSection'
import WorkExperienceSection from '@/components/sections/WorkExperienceSection'
import PublicationsFooterSection from '@/components/sections/PublicationsFooterSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import ScreenLoader from '@/components/sections/ScreenLoader'
import CustomCursor from '@/components/ui/CustomCursor'
import SystemArchitectureSection from '@/components/sections/SystemArchitectureSection'
import SkillsMatrixSection from '@/components/sections/SkillsMatrixSection'
import GitHubSection from '@/components/sections/GitHubSection'
import { TOTAL_STEPS } from '@/lib/navigation'

const TOTAL = TOTAL_STEPS

export default function Home() {
  const mainRef        = useRef(null)
  const idxRef         = useRef(0)
  const busyRef        = useRef(false)
  const tweenRef       = useRef(null)
  const loopOverlayRef = useRef(null)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isReducedMotion = motionQuery.matches
    const isSmallScreen = window.matchMedia('(max-width: 767px)').matches
    const useCinematicNavigation = !isReducedMotion && !isSmallScreen
    if (!useCinematicNavigation) el.style.overflowY = 'auto'

    function fadeLoop(targetScrollTop, targetIdx) {
      busyRef.current = true
      tweenRef.current?.kill()
      gsap.to(loopOverlayRef.current, {
        opacity: 1,
        duration: 0.55,
        ease: 'power2.in',
        onComplete: () => {
          el.scrollTop    = targetScrollTop
          idxRef.current  = targetIdx
          gsap.to(loopOverlayRef.current, {
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            delay: 0.05,
            onComplete: () => {
              setTimeout(() => { busyRef.current = false }, 300)
            },
          })
        },
      })
    }

    function goTo(idx) {
      if (idx >= TOTAL) idx = 0
      if (idx < 0)      idx = TOTAL - 1

      if (idx === idxRef.current || busyRef.current) return

      if (idxRef.current === TOTAL - 1 && idx === 0) {
        fadeLoop(0, 0)
        return
      }

      if (idxRef.current === 0 && idx === TOTAL - 1) {
        fadeLoop((TOTAL - 1) * window.innerHeight, TOTAL - 1)
        return
      }

      idxRef.current = idx
      busyRef.current = true
      tweenRef.current?.kill()
      tweenRef.current = gsap.to(el, {
        scrollTop: idx * window.innerHeight,
        duration: 1.0,
        ease: 'power3.inOut',
        onComplete: () => { setTimeout(() => { busyRef.current = false }, 600) },
      })
    }

    function onWheel(e) {
      if (document.body.dataset.modalOpen === 'true') return
      if (!useCinematicNavigation) return
      e.preventDefault()
      if (busyRef.current) return
      goTo(idxRef.current + (e.deltaY > 0 ? 1 : -1))
    }

    let touchY = 0
    function onTouchStart(e) {
      if (document.body.dataset.modalOpen === 'true') return
      touchY = e.touches[0].clientY
    }
    function onTouchEnd(e) {
      if (document.body.dataset.modalOpen === 'true') return
      if (!useCinematicNavigation) return
      const dy = touchY - e.changedTouches[0].clientY
      if (Math.abs(dy) < 40 || busyRef.current) return
      goTo(idxRef.current + (dy > 0 ? 1 : -1))
    }

    function onScroll() {
      idxRef.current = Math.round(el.scrollTop / window.innerHeight)
    }

    function onKeyDown(e) {
      if (document.body.dataset.modalOpen === 'true') return
      const target = e.target
      if (target instanceof HTMLElement && target.closest('button, a, input, textarea, select, [role="dialog"]')) return

      const keyTargets = {
        ArrowDown: 1,
        PageDown: 1,
        ArrowUp: -1,
        PageUp: -1,
        Home: -TOTAL,
        End: TOTAL,
      }
      if (!(e.key in keyTargets)) return
      e.preventDefault()
      if (!useCinematicNavigation) {
        const nextIdx = Math.max(0, Math.min(TOTAL - 1, idxRef.current + keyTargets[e.key]))
        el.scrollTop = nextIdx * window.innerHeight
        return
      }
      goTo(idxRef.current + keyTargets[e.key])
    }

    function onFooterLoop() {
      if (busyRef.current) return
      fadeLoop(0, 0)
    }

    el.addEventListener('wheel',  onWheel,  { passive: false })
    el.addEventListener('scroll', onScroll, { passive: true  })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('footer-loop-back', onFooterLoop)

    return () => {
      el.removeEventListener('wheel',  onWheel)
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('footer-loop-back', onFooterLoop)
      tweenRef.current?.kill()
      el.style.overflowY = ''
    }
  }, [])

  return (
    <>
      <CustomCursor />
      {showLoader && (
        <ScreenLoader onDismiss={() => setShowLoader(false)} />
      )}

      <div
        ref={loopOverlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 9999,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      <Navbar />
      <a className="skip-link" href="#portfolio-content">Skip to portfolio content</a>
      <main id="portfolio-content" ref={mainRef} tabIndex={-1} style={{ height: '100dvh', overscrollBehavior: 'none' }}>
        <div>
          <VideoIntro />
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SystemArchitectureSection />
          <SkillsMatrixSection />
          <WorkExperienceSection />
          <TestimonialsSection />
          <GitHubSection />
          <PublicationsFooterSection />
        </div>
      </main>
    </>
  )
}
