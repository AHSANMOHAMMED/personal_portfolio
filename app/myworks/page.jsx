'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import profile from '@/data/profile.json'
import Navbar from '@/components/ui/Navbar'
import CustomCursor from '@/components/ui/CustomCursor'
import styles from '@/styles/pages/MyWorks.module.css'

export default function MyWorks() {
  const sectionRef = useRef(null)
  const projects = profile.projects || []

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = section.querySelectorAll(`.${styles.projectCard}`)
    if (cards.length === 0) return

    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main ref={sectionRef} className={styles.myworksPage}>
        <div className={styles.container}>
          <h1 className={styles.title}>My Works</h1>
          <p className={styles.subtitle}>A selection of projects I&apos;ve built</p>

          <div className={styles.projectGrid}>
            {projects.map((project, i) => (
              <a
                key={project.id}
                href={project.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectCard}
                data-cursor="disable"
              >
                <div className={styles.projectImage}>
                  <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
                </div>
                <div className={styles.projectInfo}>
                  <span className={styles.projectNumber}>0{i + 1}</span>
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                  <div className={styles.projectTech}>
                    {project.technologies?.split(', ').map((tech, j) => (
                      <span key={j}>{tech}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}