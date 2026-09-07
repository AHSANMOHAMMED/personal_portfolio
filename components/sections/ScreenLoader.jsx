'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/ScreenLoader.module.css'

export default function ScreenLoader({ onDismiss }) {
  const counterRef    = useRef({ val: 0 })
  const counterElRef  = useRef(null)
  const splitTopRef   = useRef(null)
  const splitBottomRef= useRef(null)
  const nameRef       = useRef(null)
  const counterDoneRef  = useRef(false)
  const threeJsReadyRef = useRef(false)
  const revealFiredRef  = useRef(false)
  const fallbackIdRef   = useRef(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasEntered    = window.sessionStorage.getItem('portfolio-entered') === 'true'

    function dispatchAndDismiss() {
      window.dispatchEvent(new CustomEvent('loader-dismissed'))
      window.dispatchEvent(new CustomEvent('loader-animation-done'))
      onDismiss()
    }

    if (reducedMotion || hasEntered) {
      dispatchAndDismiss()
      return
    }

    function triggerReveal() {
      const tl = gsap.timeline({
        onComplete: () => {
          window.sessionStorage.setItem('portfolio-entered', 'true')
          window.dispatchEvent(new CustomEvent('loader-dismissed'))
          window.dispatchEvent(new CustomEvent('loader-animation-done'))
          onDismiss()
        },
      })
      tl.to(splitTopRef.current,    { y: '-100%', duration: 1.1, ease: 'expo.inOut' }, 0)
      tl.to(splitBottomRef.current, { y:  '100%', duration: 1.1, ease: 'expo.inOut' }, 0)
    }

    function checkBothReady() {
      if (counterDoneRef.current && threeJsReadyRef.current && !revealFiredRef.current) {
        revealFiredRef.current = true
        clearTimeout(fallbackIdRef.current)
        gsap.delayedCall(0.3, triggerReveal)
      }
    }

    function updateCounter() {
      const val = Math.round(counterRef.current.val)
      if (counterElRef.current) counterElRef.current.textContent = val + '%'
      if (val >= 100) {
        counterDoneRef.current = true
        checkBothReady()
      }
    }

    function onThreeJsReady() {
      threeJsReadyRef.current = true
      checkBothReady()
    }

    // 5-second fallback in case threejs-ready never fires
    fallbackIdRef.current = setTimeout(() => {
      threeJsReadyRef.current = true
      checkBothReady()
    }, 5000)

    window.addEventListener('threejs-ready', onThreeJsReady)

    gsap.to(counterRef.current, {
      val: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: updateCounter,
    })

    return () => {
      window.removeEventListener('threejs-ready', onThreeJsReady)
      clearTimeout(fallbackIdRef.current)
      gsap.killTweensOf(counterRef.current)
    }
  }, [onDismiss])

  return (
    <div className={styles.overlay} role="status" aria-label="Loading portfolio">
      <span ref={counterElRef} className={styles.counter} aria-live="polite">0%</span>
      <p ref={nameRef} className={styles.nameText}>{profile.name.full.toUpperCase()}</p>
      <div ref={splitTopRef}    className={styles.splitTop}    aria-hidden="true" />
      <div ref={splitBottomRef} className={styles.splitBottom} aria-hidden="true" />
    </div>
  )
}
