'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export default function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    let hover = false
    const cursor = cursorRef.current
    if (!cursor) return

    const mousePos = { x: 0, y: 0 }
    const cursorPos = { x: 0, y: 0 }

    const onMove = (e) => {
      mousePos.x = e.clientX
      mousePos.y = e.clientY
    }
    document.addEventListener('mousemove', onMove)

    let rafId = 0
    const loop = () => {
      if (!hover) {
        const delay = 6
        cursorPos.x += (mousePos.x - cursorPos.x) / delay
        cursorPos.y += (mousePos.y - cursorPos.y) / delay
        gsap.to(cursor, { x: cursorPos.x, y: cursorPos.y, duration: 0.1 })
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    const onOver = (e) => {
      const target = e.currentTarget
      const rect = target.getBoundingClientRect()
      if (target.dataset.cursor === 'icons') {
        cursor.classList.add('cursor-icons')
        gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 })
        cursor.style.setProperty('--cursorH', `${rect.height}px`)
        hover = true
      }
      if (target.dataset.cursor === 'disable') {
        cursor.classList.add('cursor-disable')
      }
    }

    const onOut = () => {
      cursor.classList.remove('cursor-disable', 'cursor-icons')
      hover = false
    }

    const bind = () => {
      document.querySelectorAll('[data-cursor]').forEach((item) => {
        item.addEventListener('mouseover', onOver)
        item.addEventListener('mouseout', onOut)
      })
    }
    bind()

    const observer = new MutationObserver(bind)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      observer.disconnect()
      document.querySelectorAll('[data-cursor]').forEach((item) => {
        item.removeEventListener('mouseover', onOver)
        item.removeEventListener('mouseout', onOut)
      })
    }
  }, [])

  return <div className="cursor-main" ref={cursorRef} />
}
