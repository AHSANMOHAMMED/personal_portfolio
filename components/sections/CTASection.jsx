'use client'

import profile from '@/data/profile.json'
import styles from '@/styles/sections/CTASection.module.css'

export default function CTASection() {
  return (
    <div className={styles.ctaSection} id="cta">
      <div className={styles.ctaButtons}>
        <a href="#play" className={`${styles.ctaBtn} ${styles.ctaBtnPlay}`} data-cursor="disable">
          Play With Me →
        </a>
        <a
          href={profile.social?.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.ctaBtn} ${styles.ctaBtnHire}`}
          data-cursor="disable"
        >
          Hire Me →
        </a>
      </div>
    </div>
  )
}