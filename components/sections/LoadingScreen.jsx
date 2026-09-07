'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/ScreenLoader.module.css'

export default function LoadingScreen({ onComplete }) {
  const [percent, setPercent] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const containerRef = useRef(null)
  const ballRef = useRef(null)
  const percentRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Simulate loading
    let current = 0
    const interval = setInterval(() => {
      if (current < 50) {
        current += Math.floor(Math.random() * 5) + 1
      } else if (current < 91) {
        current += Math.floor(Math.random() * 2) + 1
      } else if (current >= 100) {
        current = 100
        clearInterval(interval)
        setTimeout(() => {
          setIsComplete(true)
          setTimeout(() => {
            setIsClicked(true)
            setTimeout(() => {
              if (onComplete) onComplete()
            }, 900)
          }, 600)
        }, 600)
      }
      setPercent(current)
      if (percentRef.current) {
        percentRef.current.textContent = current
      }
    }, 80)

    return () => clearInterval(interval)
  }, [onComplete])

  const handleMouseMove = (e) => {
    if (!containerRef.current || isComplete) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    containerRef.current.style.setProperty('--mouse-x', `${x}%`)
    containerRef.current.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.loaderGame} ${isClicked ? styles.loaderOut : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Header */}
      <div className={styles.loadingHeader}>
        <a href="#/" className={styles.loaderTitle} data-cursor="disable">
          {profile.developer?.fullName?.split(' ').map(n => n[0]).join('') || 'AM'}
        </a>
      </div>

      {/* Main loading screen */}
      <div className={styles.loadingScreen}>
        {/* Marquee */}
        <div className={styles.loadingMarquee}>
          <div className={styles.marqueeTrack}>
            {Array(10).fill(0).map((_, i) => (
              <span key={i}>
                AI Engineer&nbsp;&nbsp;
                <span style={{ opacity: 0.5 }}>·</span>
                &nbsp;&nbsp;Full Stack Developer&nbsp;&nbsp;
                <span style={{ opacity: 0.5 }}>·</span>
                &nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* Loading button with hover effect */}
        <div
          className={`${styles.loadingWrap} ${isComplete ? styles.loadingClicked : ''}`}
        >
          <div className={styles.loadingHover} />
          <div className={`${styles.loadingButton} ${isComplete ? styles.loadingComplete : ''}`}>
            <div className={styles.loadingContainer}>
              <div className={styles.loadingContent}>
                <div className={styles.loadingContentIn}>
                  <span ref={percentRef}>{percent}</span>
                </div>
              </div>
              <div className={styles.loadingContent2}>
                <span>Welcome</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ball animation overlay */}
      {!isComplete && (
        <div className={styles.loaderGameContainer}>
          <div className={styles.loaderGameIn}>
            {Array(27).fill(0).map((_, i) => (
              <div key={i} className={styles.loaderGameLine} />
            ))}
          </div>
          <div ref={ballRef} className={styles.loaderGameBall} />
        </div>
      )}
    </div>
  )
}