'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import content from '@/data/content.json'
import styles from '@/styles/sections/VideoIntro.module.css'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

const CinematicLayer = dynamic(() => import('@/components/three/CinematicLayer'), { ssr: false })

function scrollNext() {
  const main = document.querySelector('main')
  if (main) main.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
}

export default function VideoIntro() {
  const videoRef    = useRef(null)
  const mainVideoWrapRef = useRef(null)
  const eyebrowRef  = useRef(null)
  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const roleRef     = useRef(null)
  const dividerRef  = useRef(null)
  const scrollRef   = useRef(null)
  const hintRef     = useRef(null)

  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)
  const [showHint, setShowHint] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Split name into characters for staggered reveal
  const firstNameChars = useMemo(() => profile.name.first.split(''), [])
  const lastNameChars  = useMemo(() => profile.name.last.split(''), [])

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  // ── Cinematic entrance timeline ──
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 })

    // 1. Video zooms in from slightly scaled down + fades
    if (mainVideoWrapRef.current) {
      tl.fromTo(mainVideoWrapRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: 'power3.out' },
        0
      )
    }

    // 2. Eyebrow typewriter reveal via clip-path
    if (eyebrowRef.current) {
      tl.fromTo(eyebrowRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.8, ease: 'power2.out' },
        0.8
      )
    }

    // 3. First name — staggered character reveal
    if (firstNameRef.current) {
      const spans = firstNameRef.current.querySelectorAll(`.${styles.char}`)
      if (spans.length) {
        tl.fromTo(spans,
          { opacity: 0, y: 40, rotateX: -40 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.6, ease: 'power3.out', stagger: 0.04 },
          1.0
        )
      }
    }

    // 4. Divider line sweeps across
    if (dividerRef.current) {
      tl.fromTo(dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: 'power2.out' },
        1.3
      )
    }

    // 5. Last name — staggered character reveal (slightly delayed)
    if (lastNameRef.current) {
      const spans = lastNameRef.current.querySelectorAll(`.${styles.char}`)
      if (spans.length) {
        tl.fromTo(spans,
          { opacity: 0, y: 40, rotateX: -40 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.6, ease: 'power3.out', stagger: 0.04 },
          1.4
        )
      }
    }

    // 6. Role slides up
    if (roleRef.current) {
      tl.fromTo(roleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        1.8
      )
    }

    // 7. Scroll cue fades in
    if (scrollRef.current) {
      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        2.2
      )
    }

    return () => tl.kill()
  }, [])

  // Video fade-in
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (typeof v.play !== 'function') return
    v.muted = true
    const t = gsap.fromTo(v, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' })
    return () => t.kill()
  }, [])

  // Unmute on loader dismiss
  useEffect(() => {
    function onLoaderDismissed() {
      const v = videoRef.current
      if (!v) return
      if (typeof v.play !== 'function') return
      v.muted = false
      setMuted(false)
      dismissHint()
    }
    window.addEventListener('loader-dismissed', onLoaderDismissed)
    return () => window.removeEventListener('loader-dismissed', onLoaderDismissed)
  }, [])

  // Play video after animation done
  useEffect(() => {
    function onAnimationDone() {
      const v = videoRef.current
      if (!v) return
      if (typeof v.play !== 'function') return
      v.play().catch(() => {})
    }
    window.addEventListener('loader-animation-done', onAnimationDone)
    return () => window.removeEventListener('loader-animation-done', onAnimationDone)
  }, [])

  useEffect(() => {
    if (!showHint) return
    const id = setTimeout(() => dismissHint(), 6000)
    return () => clearTimeout(id)
  }, [showHint])

  function dismissHint() {
    if (!hintRef.current) return
    gsap.to(hintRef.current, { opacity: 0, y: -8, duration: 0.35, onComplete: () => setShowHint(false) })
  }

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (typeof v.play !== 'function') return
    if (playing) { v.pause(); setPlaying(false) }
    else         { v.play();  setPlaying(true)  }
  }

  function toggleMute() {
    if (showHint) dismissHint()
    const v = videoRef.current
    if (!v) return
    if (typeof v.play !== 'function') return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  function handleEnded() {
    const main = document.querySelector('main')
    if (main && main.scrollTop < window.innerHeight * 0.4) scrollNext()
  }

  return (
    <section className={styles.section}>

      {/* 1 - Blurred ambient background */}
      <video
        src="/personal_portfolio/assets/hero_bg_video.mp4"
        autoPlay muted playsInline
        aria-hidden="true"
        className={styles.bgVideo}
      />

      {/* 2 - Main video with cinematic zoom wrapper */}
      <div ref={mainVideoWrapRef} className={styles.mainVideoWrap}>
        <video
          ref={videoRef}
          data-testid="intro-video"
          src="/personal_portfolio/assets/hero_bg_video.mp4"
          muted playsInline
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={handleEnded}
          className={styles.mainVideo}
        />
      </div>

      {/* 3 - Cinematic gradient overlay */}
      <div className={styles.overlay} />

      {/* 4 - Three.js cinematic bokeh layer (desktop only) */}
      {!isMobile && (
        <ErrorBoundary>
          <CinematicLayer />
        </ErrorBoundary>
      )}

      {/* 5 - Landing text with cinematic reveal */}
      <div className={styles.heroContent}>
        <p ref={eyebrowRef} className={styles.eyebrow}>{content.site.tagline}</p>

        <h1 className={styles.nameBlock}>
          <span ref={firstNameRef} className={styles.nameLine}>
            {firstNameChars.map((ch, i) => (
              <span key={i} className={styles.char}>{ch === ' ' ? '\u00A0' : ch}</span>
            ))}
          </span>
          <span ref={dividerRef} className={styles.nameDivider} />
          <span ref={lastNameRef} className={styles.nameLine}>
            {lastNameChars.map((ch, i) => (
              <span key={i} className={styles.char}>{ch === ' ' ? '\u00A0' : ch}</span>
            ))}
          </span>
        </h1>

        <p ref={roleRef} className={styles.role}>{profile.roles.detailed}</p>
      </div>

      {/* 6 - Paused overlay */}
      {!playing && (
        <button className={styles.playOverlay} onClick={togglePlay} aria-label="Play video">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="35" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
            <polygon points="29,20 56,36 29,52" fill="white" />
          </svg>
        </button>
      )}

      {/* 7 - Sound hint badge */}
      {showHint && (
        <div ref={hintRef} className={styles.soundHint} onClick={toggleMute} style={{ pointerEvents: 'all', cursor: 'pointer' }}>
          <span className={styles.soundPulse} />
          <span>Tap for sound</span>
        </div>
      )}

      {/* 8 - Scroll cue */}
      <button
        ref={scrollRef}
        className={styles.scrollCue}
        onClick={scrollNext}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </button>

    </section>
  )
}
