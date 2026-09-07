'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/WhatIDoSection.module.css'

const FALLBACK = [
  { title: 'Full-Stack', description: '', skills: [] },
  { title: 'Mobile',     description: '', skills: [] },
  { title: 'Cloud',      description: '', skills: [] },
]

export default function WhatIDoSection() {
  const sectionRef  = useRef(null)
  const cardRefs    = useRef([])
  const animatedRef = useRef(false)

  const ROLES = (profile.whatIDo && profile.whatIDo.length > 0)
    ? profile.whatIDo.slice(0, 3)
    : (profile.skillCategories || []).slice(0, 3).map((cat) => ({
        title: cat.label,
        description: (cat.skills || []).slice(0, 5).join(', '),
        skills: cat.skills || [],
      }))

  const HEADING = profile.sections?.whatIDo?.heading || 'WHAT I DO'

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = cardRefs.current.filter(Boolean)
    if (cards.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(cards, { opacity: 1, y: 0 })
      return
    }

    gsap.set(cards, { opacity: 0, y: 40 })

    const scroller = document.querySelector('main')
    if (!scroller) return

    function onScroll() {
      if (animatedRef.current) return
      const inRange = Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.5
      if (!inRange) return
      animatedRef.current = true
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.15,
      })
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-label={HEADING}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{HEADING}</h2>

        <div className={styles.cardsRow}>
          {ROLES.map((role, i) => (
            <article
              key={role.title || i}
              ref={(el) => { cardRefs.current[i] = el }}
              className={styles.card}
            >
              <span className={styles.cardIndex}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={styles.cardTitle}>{role.title}</h3>
              {role.description && (
                <p className={styles.cardDesc}>{role.description}</p>
              )}
              {role.skills && role.skills.length > 0 && (
                <div className={styles.chips}>
                  {role.skills.map((skill) => (
                    <span key={skill} className={styles.chip}>{skill}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}