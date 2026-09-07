'use client'

import { useEffect, useRef, useState } from 'react'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/WhatIDoSection.module.css'

export default function WhatIDoSection() {
  const [activeIndex, setActiveIndex] = useState(null)
  const refs = useRef([])

  const skills = profile.skills || {}

  useEffect(() => {
    // Touch devices: add click handlers
    if (window.innerWidth > 768) return
    refs.current.forEach((el, i) => {
      if (!el) return
      el.addEventListener('click', () => {
        setActiveIndex(activeIndex === i ? null : i)
      })
    })
  }, [])

  const toggleBox = (index) => {
    if (window.innerWidth <= 768) return
    setActiveIndex(activeIndex === index ? null : index)

    // Toggle sibling classes
    const parent = refs.current[index]?.parentElement
    if (!parent) return

    Array.from(parent.children).forEach((child, i) => {
      if (i === index) {
        child.classList.toggle(styles.whatContentActive)
        child.classList.remove(styles.whatSibling)
      } else {
        child.classList.remove(styles.whatContentActive)
        child.classList.toggle(styles.whatSibling)
      }
    })
  }

  return (
    <div className={styles.whatIDO} id="whatIDO">
      <div className={styles.whatBox}>
        <h2 className={styles.title}>
          W<span className={styles.hatH2}>HAT</span>&nbsp;I<span className={styles.doH2}> DO</span>
        </h2>
      </div>

      <div className={styles.whatBox}>
        <div className={styles.whatBoxIn}>
          {/* Border decorations */}
          <div className={styles.whatBorder2}>
            <svg width="100%">
              <line x1="0" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
              <line x1="100%" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
            </svg>
          </div>

          {Object.entries(skills).map(([key, skill], index) => (
            <div
              key={key}
              ref={(el) => { refs.current[index] = el }}
              className={`${styles.whatContent} ${styles.whatNoTouch}`}
              onMouseEnter={() => toggleBox(index)}
            >
              <div className={styles.whatBorder1}>
                <svg height="100%">
                  <line x1="0" y1="0" x2="100%" y2="0" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
                  <line x1="0" y1="100%" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
                </svg>
              </div>
              <div className={styles.whatCorner} />

              <div className={styles.whatContentIn}>
                <h3>{skill.title}</h3>
                <h4>{skill.description}</h4>
                <p>{skill.details}</p>
                <h5>Skillset & tools</h5>
                <div className={styles.whatContentFlex}>
                  {skill.tools?.map((tool, i) => (
                    <div key={i} className={styles.whatTags}>{tool}</div>
                  ))}
                </div>
                <div className={styles.whatArrow} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}