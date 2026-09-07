'use client'

import { useEffect, useRef } from 'react'
import Navbar from '@/components/ui/Navbar'
import CustomCursor from '@/components/ui/CustomCursor'
import styles from '@/styles/pages/Play.module.css'

export default function Play() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    const squares = []
    const gridSize = 8
    const squareSize = Math.min(canvas.width, canvas.height) / gridSize

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        squares.push({
          x: col * squareSize,
          y: row * squareSize,
          size: squareSize,
          color: (row + col) % 2 === 0 ? 'rgba(194, 164, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
        })
      }
    }

    let animationId
    let mouseX = canvas.width / 2
    let mouseY = canvas.height / 2

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      squares.forEach((sq) => {
        const centerX = sq.x + sq.size / 2
        const centerY = sq.y + sq.size / 2
        const distX = mouseX - centerX
        const distY = mouseY - centerY
        const dist = Math.sqrt(distX * distX + distY * distY)
        const maxDist = Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2

        const intensity = Math.max(0, 1 - dist / maxDist) * 0.5

        ctx.fillStyle = sq.color.replace(/[\d.]+\)$/, `${0.3 + intensity})`)
        ctx.fillRect(sq.x, sq.y, sq.size - 1, sq.size - 1)
      })

      animationId = requestAnimationFrame(draw)
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <Navbar />

      <div className={styles.playPage}>
        <canvas ref={canvasRef} className={styles.chessCanvas} />
        <div className={styles.playOverlay}>
          <h1>3D Chess</h1>
          <p>Interactive chess experience coming soon</p>
        </div>
      </div>
    </>
  )
}