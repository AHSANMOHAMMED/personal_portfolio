'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/WorkSection.module.css'
import Link from 'next/link'

export default function WorkSection() {
  const sectionRef = useRef(null)
  const flexRef = useRef(null)
  const [hoveredProject, setHoveredProject] = useState(null)

  useEffect(() => {
    if (window.innerWidth <= 768) return

    const section = sectionRef.current
    const flex = flexRef.current
    if (!section || !flex) return

    const boxes = flex.querySelectorAll(`.${styles.workBox}`)
    if (boxes.length === 0) return

    // Calculate total scroll width
    const getScrollWidth = () => {
      const rect = flex.getBoundingClientRect()
      const parentRect = flex.parentElement.getBoundingClientRect()
      return boxes[0].offsetWidth * boxes.length - (rect.left - parentRect.left) + 100
    }

    let scrollWidth = getScrollWidth()

    const handleResize = () => {
      scrollWidth = getScrollWidth()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${scrollWidth}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        id: 'work',
        invalidateOnRefresh: true,
      },
    })

    tl.to(flex, {
      x: -scrollWidth,
      ease: 'none',
    })

    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener('resize', handleResize)
      tl.kill()
      const workTrigger = ScrollTrigger.getById('work')
      if (workTrigger) workTrigger.kill()
    }
  }, [])

  const projects = profile.projects?.slice(0, 5) || []

  return (
    <div ref={sectionRef} className={styles.workSection} id="work">
      <div className={styles.workContainer}>
        <h2>
          My <span>Work</span>
        </h2>

        <div ref={flexRef} className={styles.workFlex}>
          {projects.map((project, i) => (
            <div key={project.id} className={styles.workBox}>
              <div className={styles.workImage}>
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                />
                {project.link && (
                  <div className={styles.workLink}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>

              <div className={styles.workInfo}>
                <div className={styles.workTitle}>
                  <h3>0{i + 1}</h3>
                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.technologies}</p>
              </div>
            </div>
          ))}

          {/* CTA Box */}
          <div className={`${styles.workBox} ${styles.workBoxCta}`}>
            <div className={styles.seeAllWorks}>
              <h3>Want to see more?</h3>
              <p>Explore all of my projects and creations</p>
              <Link href="/myworks" className={styles.seeAllBtn} data-cursor="disable">
                See All Works →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}