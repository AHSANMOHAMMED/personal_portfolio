'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import MarqueeStrip from '@/components/ui/MarqueeStrip'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import styles from '@/styles/sections/WorkExperienceSection.module.css'

const WorkExpThreeScene = dynamic(() => import('@/components/three/WorkExpThreeScene'), { ssr: false })

const EXPS = profile.experience || []

export default function WorkExperienceSection() {
  const sectionRef        = useRef(null)
  const timelineLineRef   = useRef(null)
  const entryRefs         = useRef([])
  const animatedRef       = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const line    = timelineLineRef.current
    const entries = entryRefs.current.filter(Boolean)

    if (reduced) {
      if (line) gsap.set(line, { scaleY: 1 })
      gsap.set(entries, { opacity: 1, y: 0 })
      return
    }

    if (line) gsap.set(line, { scaleY: 0, transformOrigin: 'top center' })
    gsap.set(entries, { opacity: 0, y: 30 })

    const scroller = document.querySelector('main')
    if (!scroller) return

    function onScroll() {
      if (animatedRef.current) return
      const inRange = Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.5
      if (!inRange) return
      animatedRef.current = true

      if (line) {
        gsap.to(line, { scaleY: 1, duration: 1.2, ease: 'power2.inOut' })
      }
      gsap.to(entries, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        stagger: 0.15, delay: 0.3,
      })
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Work Experience">
      <div className={styles.threeBg}>
        <ErrorBoundary>
          <WorkExpThreeScene />
        </ErrorBoundary>
      </div>

      <div className={styles.header}>
        <span className={styles.label}>EXPERIENCE</span>
        <span className={styles.labelRight}>{String(EXPS.length).padStart(2, '0')} ENTRIES</span>
      </div>

      <div className={styles.timeline}>
        <div ref={timelineLineRef} className={styles.timelineLine} aria-hidden />

        {EXPS.length === 0 ? (
          <p className={styles.placeholder}>No experience entries yet.</p>
        ) : (
          EXPS.map((exp, i) => (
            <div
              key={exp.id ?? i}
              ref={(el) => { entryRefs.current[i] = el }}
              className={styles.entry}
            >
              <div className={styles.yearCol}>
                <span className={`${styles.yearLabel} ${i === 0 ? styles.yearLabelNow : ''}`}>
                  {exp.period}
                </span>
                <span className={`${styles.dot} ${i === 0 ? styles.dotPulse : ''}`} aria-hidden />
              </div>

              <div className={styles.entryBody}>
                <div className={styles.entryHead}>
                  <h3 className={styles.role}>{exp.role}</h3>
                  <span className={styles.typeTag}>{exp.type}</span>
                </div>
                <p className={styles.company}>{exp.company}</p>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className={styles.bullets}>
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className={styles.bullet}>{b}</li>
                    ))}
                  </ul>
                )}
                {exp.tech && exp.tech.length > 0 && (
                  <div className={styles.stack}>
                    {exp.tech.map((t) => (
                      <span key={t} className={styles.tag}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.marqueeRow} aria-hidden="true">
        <MarqueeStrip text={(profile.skills || []).slice(0, 8).join(' · ')} direction="ltr" speed={50} accent="orange" />
      </div>
    </section>
  )
}