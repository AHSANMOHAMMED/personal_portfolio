'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/CareerSection.module.css'

export default function CareerSection() {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)
  const boxRefs = useRef([])
  const dotRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const timeline = timelineRef.current
    const dot = dotRef.current
    if (!section || !timeline || !dot) return

    // Animate timeline height on scroll
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeline.classList.add(styles.visible)
          dot.style.animation = 'timeline 0.8s linear forwards'

          // Animate each career box
          boxRefs.current.forEach((box, i) => {
            if (!box) return
            setTimeout(() => {
              box.classList.add(styles.visible)
            }, i * 150)
          })
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const experiences = profile.experiences || profile.experiences || []

  return (
    <div ref={sectionRef} className={styles.careerSection} id="career">
      <div className={styles.careerContainer}>
        <h2>
          My career <span>&</span>
          <br />
          experience
        </h2>

        <div className={styles.careerInfo}>
          <div ref={timelineRef} className={styles.careerTimeline}>
            <div ref={dotRef} className={styles.careerDot} />
          </div>

          {experiences.map((exp, i) => (
            <div
              key={exp.id || i}
              ref={(el) => { boxRefs.current[i] = el }}
              className={styles.careerInfoBox}
            >
              <div className={styles.careerInfoIn}>
                <div className={styles.careerRole}>
                  <h4>{exp.position}</h4>
                  <h5>{exp.company}</h5>
                </div>
                <h3>
                  {exp.period?.includes('Present')
                    ? 'NOW'
                    : exp.period?.includes(' - ')
                    ? exp.period.split(' - ')[0]
                    : exp.period}
                </h3>
              </div>
              <p>{exp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}