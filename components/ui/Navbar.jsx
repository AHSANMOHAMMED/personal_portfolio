'use client'

import { useEffect, useRef, useState } from 'react'
import profile from '@/data/profile.json'
import styles from '@/styles/ui/Navbar.module.css'
import { NAV_ITEMS } from '@/lib/navigation'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeStep,  setActiveStep]  = useState(0)
  const headerRef = useRef(null)

  function navigateTo(index) {
    const scroller = document.querySelector('main')
    if (!scroller) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const smallScreen   = window.matchMedia('(max-width: 767px)').matches
    scroller.scrollTo({
      top: index * window.innerHeight,
      behavior: reducedMotion || smallScreen ? 'auto' : 'smooth',
    })
  }

  useEffect(() => {
    function onNavStep(e) {
      const step = (e && e.detail && typeof e.detail.step === 'number') ? e.detail.step : 0
      setActiveStep(step)
      setIsScrolled(step > 0)
    }
    window.addEventListener('nav-step-change', onNavStep)
    return () => window.removeEventListener('nav-step-change', onNavStep)
  }, [])

  return (
    <header
      ref={headerRef}
      className={`${styles.nav} ${isScrolled ? styles.navScrolled : ''}`}
    >
      <nav className={styles.linkList} aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`${styles.link} ${activeStep === item.index ? styles.linkActive : ''}`}
            onClick={() => navigateTo(item.index)}
            aria-current={activeStep === item.index ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <a
        href={profile.resume}
        download
        className={styles.resumeLink}
      >
        RESUME
      </a>
    </header>
  )
}