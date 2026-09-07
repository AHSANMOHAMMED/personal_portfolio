'use client'

import { useMemo } from 'react'
import styles from '@/styles/ui/MarqueeStrip.module.css'

export default function MarqueeStrip({
  text,
  direction = 'ltr',
  speed = 60,
  accent = 'orange',
}) {
  const items = useMemo(() => {
    const approxCharWidth = 9
    const trackWidth = typeof window !== 'undefined' ? window.innerWidth * 2.5 : 2400
    const textWidth = (text || '').length * approxCharWidth + 40
    const count = Math.max(6, Math.ceil(trackWidth / Math.max(1, textWidth)) + 2)
    return Array(count).fill(text || '')
  }, [text])

  const trackClass = [
    styles.track,
    direction === 'rtl' ? styles.rtl : '',
    accent === 'cyan' ? styles.cyan : styles.orange,
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.container} aria-hidden="true">
      <div
        className={trackClass}
        style={{ '--marquee-speed': speed }}
      >
        {items.map((t, i) => (
          <span key={i} className={styles.item}>
            {t}
            <span className={styles.sep} aria-hidden="true"> · </span>
          </span>
        ))}
      </div>
    </div>
  )
}
