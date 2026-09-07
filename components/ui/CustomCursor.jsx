'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const isHoveringRef = useRef(false)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor || window.innerWidth <= 768) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0
    const speed = 0.15

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const tick = () => {
      cursorX += (mouseX - cursorX) * speed
      cursorY += (mouseY - cursorY) * speed
      gsap.set(cursor, { x: cursorX, y: cursorY })
      requestAnimationFrame(tick)
    }

    const onMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (!target) return
      const type = target.dataset.cursor
      if (type === 'icons') {
        cursor.classList.add('cursor-icons')
        isHoveringRef.current = true
      } else if (type === 'disable') {
        cursor.classList.add('cursor-disable')
        isHoveringRef.current = false
      }
    }

    const onMouseOut = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (!target) return
      cursor.classList.remove('cursor-icons', 'cursor-disable')
      isHoveringRef.current = false
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    // Initialize cursor position
    gsap.set(cursor, { x: -100, y: -100 })
    requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="cursor-main"
      aria-hidden="true"
    />
  )
}