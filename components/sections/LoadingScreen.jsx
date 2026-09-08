'use client'

import { useEffect, useRef, useState } from 'react'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/LoadingScreen.module.css'

export default function LoadingScreen({ onComplete }) {
  const [percent, setPercent] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const containerRef = useRef(null)
  const wrapRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    let current = 0
    let interval = null

    interval = setInterval(() => {
      if (current <= 50) {
        const increment = Math.round(5 * Math.random())
        current += increment
      } else {
        clearInterval(interval)
        interval = setInterval(() => {
          current += Math.round(Math.random())
          if (current > 91) {
            clearInterval(interval)
          }
        }, 20)
      }

      if (current >= 100) {
        current = 100
        clearInterval(interval)
        setTimeout(() => {
          setIsComplete(true)
          wrapRef.current?.classList.add(styles.loadingComplete)
          setTimeout(() => {
            wrapRef.current?.classList.add(styles.loadingClicked)
            setIsClicked(true)
            setTimeout(() => {
              if (onCompleteRef.current) onCompleteRef.current()
            }, 1200)
          }, 1000)
        }, 600)
      }
      setPercent(current)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e) => {
    if (!wrapRef.current || isComplete) return
    const rect = wrapRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    wrapRef.current.style.setProperty('--mouse-x', `${x}px`)
    wrapRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  const handleClick = () => {
    if (!isComplete || isClicked) return
    wrapRef.current?.classList.add(styles.loadingClicked)
    setIsClicked(true)
    setTimeout(() => {
      if (onCompleteRef.current) onCompleteRef.current()
    }, 1200)
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.loaderGame} ${isClicked ? styles.loaderOut : ''}`}
    >
      {/* Header */}
      <div className={styles.loadingHeader}>
        <a href="#/" className={styles.loaderTitle} data-cursor="disable">
          {profile.developer?.fullName?.split(' ').map(n => n[0]).join('') || 'AM'}
        </a>
        <div className={styles.loaderGameContainer}>
          <div className={styles.loaderGameIn}>
            {Array(27).fill(0).map((_, i) => (
              <div key={i} className={styles.loaderGameLine} />
            ))}
          </div>
          <div className={styles.loaderGameBall} />
        </div>
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

        {/* Loading pill button */}
        <div
          ref={wrapRef}
          className={styles.loadingWrap}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          <div className={styles.loadingHover} />
          <div className={`${styles.loadingButton} ${isComplete ? styles.loadingComplete : ''}`}>
            <div className={styles.loadingContainer}>
              <div className={styles.loadingContent}>
                <div className={styles.loadingContentIn}>
                  Loading <span>{percent}%</span>
                  <div className={styles.loadingBox} />
                </div>
              </div>
              <div className={styles.loadingContent2}>
                <span>Welcome</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}