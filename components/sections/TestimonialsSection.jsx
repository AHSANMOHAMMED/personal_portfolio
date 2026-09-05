'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { FiArrowUpRight } from 'react-icons/fi'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/TestimonialsSection.module.css'

const PRINCIPLES = profile.collaborationPrinciples

export default function TestimonialsSection() {
  const sectionRef = useRef(null)
  const labelRef   = useRef(null)
  const headingRef = useRef(null)
  const cardRefs   = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const scroller = document.querySelector('main')
    if (!scroller) return

    let isActive = false

    function resetAnim() {
      gsap.set(labelRef.current, { opacity: 0, y: -15 })
      gsap.set(headingRef.current, { opacity: 0, y: -25 })
      cardRefs.current.forEach(el => {
        if (el) gsap.set(el, { opacity: 0, y: 30, scale: 0.97 })
      })
    }

    function playAnim() {
      resetAnim()
      gsap.to(labelRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
      gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', delay: 0.1 })
      cardRefs.current.forEach((el, i) => {
        if (el) gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', delay: 0.25 + i * 0.12 })
      })
    }

    resetAnim()

    function onScroll() {
      const inRange = Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.5
      if (inRange && !isActive) { isActive = true; playAnim() }
      if (!inRange && isActive) { isActive = false; resetAnim() }
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => { scroller.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>

      {/* Background accent */}
      <div className={styles.bgAccent} aria-hidden />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <p ref={labelRef} className={styles.label}>How I Work</p>
          <h2 ref={headingRef} className={styles.heading}>Good work is a team practice.</h2>
        </div>

        {/* Cards grid */}
        <div className={styles.grid}>
          {PRINCIPLES.map((principle, i) => (
            <div
              key={principle.id}
              ref={el => { cardRefs.current[i] = el }}
              className={styles.card}
            >
              <span className={styles.cardIndex}>0{i + 1}</span>
              <h3 className={styles.principleTitle}>{principle.title}</h3>
              <p className={styles.text}>{principle.text}</p>
              <FiArrowUpRight className={styles.principleIcon} aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
