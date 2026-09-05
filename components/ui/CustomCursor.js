'use client'

import { useEffect, useState } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [cursorState, setCursorState] = useState('default')
  const [label, setLabel] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const onMouseMove = (e) => {
      if (window.matchMedia('(pointer: coarse)').matches) return
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const onMouseOver = (e) => {
      if (window.matchMedia('(pointer: coarse)').matches) return
      const target = e.target.closest('[data-cursor]')
      if (target) {
        setCursorState(target.getAttribute('data-cursor') || 'default')
        setLabel(target.getAttribute('data-cursor-label') || '')
      } else if (e.target.closest('a, button, input, textarea, [role="button"]')) {
        setCursorState('hover')
        setLabel('')
      } else {
        setCursorState('default')
        setLabel('')
      }
    }

    const onMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className={`${styles.cursorContainer} ${styles[cursorState] || ''}`}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <div className={styles.dot} />
      <div className={styles.ring}>
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  )
}
