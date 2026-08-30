'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/ScreenLoader.module.css'

export default function ScreenLoader({ onDismiss }) {
  const overlayRef = useRef(null)
  const nameRef = useRef(null)
  const lineRef = useRef(null)
  const roleRef = useRef(null)
  const btnRef = useRef(null)
  const [typed, setTyped] = useState('')
  const fullName = profile.name.full.toUpperCase()

  // Typing effect for the name
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= fullName.length) {
        setTyped(fullName.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 65)
    return () => clearInterval(interval)
  }, [fullName])

  // Animate elements in after typing completes
  useEffect(() => {
    if (typed.length < fullName.length) return

    const tl = gsap.timeline({ delay: 0.15 })
    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power3.out' })
      .fromTo(roleRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .fromTo(btnRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
    return () => tl.kill()
  }, [typed, fullName])

  function handleStart() {
    window.dispatchEvent(new CustomEvent('loader-dismissed'))

    const overlay = overlayRef.current
    if (!overlay) return

    overlay.style.pointerEvents = 'none'

    // Create split layers
    const top = document.createElement('div')
    top.className = styles.splitTop

    const bottom = document.createElement('div')
    bottom.className = styles.splitBottom

    const line = document.createElement('div')
    line.className = styles.centerLine

    document.body.appendChild(top)
    document.body.appendChild(bottom)
    document.body.appendChild(line)

    // Dramatic flash before split
    gsap.to(overlay, { opacity: 0, duration: 0.15, ease: 'power2.out' })

    // Orange glow line sweeps across
    gsap.fromTo(line, { scaleX: 0, opacity: 0 }, {
      scaleX: 1, opacity: 1, duration: 0.3, ease: 'power2.out',
    })

    // Split halves apart with slight rotation for drama
    gsap.to(top, {
      y: '-100%', rotation: -0.5, duration: 1.1,
      ease: 'expo.inOut', force3D: true,
    })

    gsap.to(bottom, {
      y: '100%', rotation: 0.5, duration: 1.1,
      ease: 'expo.inOut', force3D: true,
    })

    // Line expands then fades
    gsap.to(line, { scaleX: 1.5, opacity: 0, duration: 0.4, delay: 0.25, ease: 'power2.in' })

    setTimeout(() => {
      top.remove()
      bottom.remove()
      line.remove()
      window.dispatchEvent(new CustomEvent('loader-animation-done'))
      onDismiss()
    }, 1100)
  }

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div className={styles.liquidBg} aria-hidden />

      {/* Ambient particles */}
      <div className={styles.particles} aria-hidden>
        {[...Array(6)].map((_, i) => (
          <span key={i} className={styles.particle} style={{
            left: `${15 + i * 14}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${3 + i * 0.5}s`,
          }} />
        ))}
      </div>

      {/* Typing name */}
      <div className={styles.nameBlock}>
        <p ref={nameRef} className={styles.monogram}>
          {typed}<span className={styles.cursor}>|</span>
        </p>
        <div ref={lineRef} className={styles.accentLine} />
        <p ref={roleRef} className={styles.role}>{profile.roles.short}</p>
      </div>

      <button ref={btnRef} className={styles.startBtn} onClick={handleStart}>
        Enter Portfolio
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '0.5rem' }}>
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
