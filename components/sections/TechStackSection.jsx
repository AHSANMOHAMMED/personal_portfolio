'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/TechStackSection.module.css'

export default function TechStackSection() {
  const sectionRef  = useRef(null)
  const tileRefs    = useRef([])
  const animatedRef = useRef(false)
  const hoverCleanupsRef = useRef([])

  const HEADING = profile.sections?.techStack?.heading || 'TECH STACK'

  const seen = new Set()
  const skills = (profile.skillCategories || []).flatMap((c) => c.skills || [])
  const deduped = skills.filter((s) => {
    if (!s) return false
    if (seen.has(s)) return false
    seen.add(s)
    return true
  })

  function attachHover(tiles) {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    hoverCleanupsRef.current.forEach((fn) => fn())
    hoverCleanupsRef.current = []

    tiles.forEach((el) => {
      const enter = () => {
        gsap.to(el, { scale: 1.15, borderColor: 'var(--accent-cyan)', duration: 0.2, ease: 'power2.out' })
      }
      const leave = () => {
        gsap.to(el, { scale: 1, borderColor: 'var(--border-dim)', duration: 0.2, ease: 'power2.out' })
      }
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
      hoverCleanupsRef.current.push(() => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      })
    })
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const tiles = tileRefs.current.filter(Boolean)
    if (tiles.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(tiles, { opacity: 1, y: 0 })
      attachHover(tiles)
      return
    }

    gsap.set(tiles, { opacity: 0, y: 20 })

    const scroller = document.querySelector('main')
    if (!scroller) return

    function onScroll() {
      if (animatedRef.current) return
      const inRange = Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.5
      if (!inRange) return
      animatedRef.current = true
      gsap.to(tiles, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: 'power2.out',
        stagger: 0.025,
        onComplete: () => attachHover(tiles),
      })
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      hoverCleanupsRef.current.forEach((fn) => fn())
      hoverCleanupsRef.current = []
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-label={HEADING}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{HEADING}</h2>

        <div className={styles.grid}>
          {deduped.map((skill, i) => (
            <span
              key={skill}
              ref={(el) => { tileRefs.current[i] = el }}
              className={styles.tile}
              style={{ cursor: 'default' }}
            >
              <span className={styles.tileLabel}>{skill}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}