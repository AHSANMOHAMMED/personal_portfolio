'use client'

import { useEffect, useState } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [cursorState, setCursorState] = useState('default') // default, hover, project, drag, rotate3d
  const [cursorState, setCursorState] = useState('default')
  const [label, setLabel] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Detect touch-only devices to disable custom cursor
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      return
    }

    const onMouseMove = (e) => {
      if (window.matchMedia('(pointer: coarse)').matches) {
        setIsTouch(true)
        return
      }
      if (window.matchMedia('(pointer: coarse)').matches) return
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const onMouseOver = (e) => {
      if (window.matchMedia('(pointer: coarse)').matches) return
      const target = e.target.closest('[data-cursor]')
      if (target) {
        const state = target.getAttribute('data-cursor')
        const text = target.getAttribute('data-cursor-label') || ''
        setCursorState(state)
        setLabel(text)
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

  if (isTouch || !isVisible) return null
  if (!isVisible) return null

  return (
    <div
      className={`${styles.cursorContainer} ${styles[cursorState] || ''}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div className={styles.dot} />
      <div className={styles.ring}>
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  )
}

