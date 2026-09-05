'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from './SkillsMatrixSection.module.css'

export default function SkillsMatrixSection() {
  const sectionRef = useRef(null)
  const categories = profile.skillCategories || []
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 'frontend')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const skillChips = section.querySelectorAll('.' + styles.skillChip)
    gsap.fromTo(
      skillChips,
      { opacity: 0, scale: 0.9, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
    )
  }, [activeCategory])

  return (
    <section ref={sectionRef} className={styles.section} id="skills">
      <div className={styles.container}>
        
        <div className={styles.header}>
          <span className={styles.kicker}>TECHNICAL CAPABILITIES</span>
          <h2 className={styles.title}>ENGINEERING MATRIX</h2>
          <p className={styles.subtitle}>
            Production-tested technologies across web, mobile, database, and infrastructure engineering.
          </p>
        </div>

        {/* Category Tabs */}
        <div className={styles.tabRow}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.tabBtn} ${activeCategory === cat.id ? styles.activeTab : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              data-cursor="hover"
            >
              <span>{cat.label}</span>
              <span className={styles.countBadge}>{cat.skills.length}</span>
            </button>
          ))}
        </div>

        {/* Skills Chips Grid */}
        <div className={styles.skillsGrid}>
          {categories
            .find((c) => c.id === activeCategory)
            ?.skills.map((skill) => (
              <div key={skill} className={styles.skillChip} data-cursor="hover">
                <span className={styles.skillDot} />
                <span className={styles.skillName}>{skill}</span>
              </div>
            ))}
        </div>

      </div>
    </section>
  )
}

