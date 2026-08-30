'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from '@/lib/gsap'
import styles from '@/styles/ui/TechOrbit.module.css'

/* ── Tech data: name, color, ring (0=innermost), proficiency ── */
const TECHS = [
  // Ring 0 — innermost (fast, clockwise)
  { name: 'React',       color: '#61DAFB', ring: 0, prof: 'Expert' },
  { name: 'Next.js',     color: '#ffffff', ring: 0, prof: 'Expert' },
  { name: 'TypeScript',  color: '#3178C6', ring: 0, prof: 'Advanced' },
  { name: 'Node.js',     color: '#339933', ring: 0, prof: 'Advanced' },
  // Ring 1 — (medium, counter-clockwise)
  { name: 'Flutter',     color: '#02569B', ring: 1, prof: 'Advanced' },
  { name: 'PostgreSQL',  color: '#4169E1', ring: 1, prof: 'Advanced' },
  { name: 'Docker',      color: '#2496ED', ring: 1, prof: 'Advanced' },
  { name: 'Python',      color: '#3776AB', ring: 1, prof: 'Proficient' },
  // Ring 2 — (slow, clockwise)
  { name: 'JavaScript',  color: '#F7DF1E', ring: 2, prof: 'Expert' },
  { name: 'Java',        color: '#ED8B00', ring: 2, prof: 'Proficient' },
  { name: 'GraphQL',     color: '#E10098', ring: 2, prof: 'Proficient' },
  { name: 'Redis',       color: '#DC382D', ring: 2, prof: 'Proficient' },
  // Ring 3 — outermost (slowest, counter-clockwise)
  { name: 'AWS',         color: '#FF9900', ring: 3, prof: 'Proficient' },
  { name: 'MongoDB',     color: '#47A248', ring: 3, prof: 'Advanced' },
  { name: 'Git',         color: '#F05032', ring: 3, prof: 'Expert' },
  { name: 'Express',     color: '#ffffff', ring: 3, prof: 'Advanced' },
]

/* Ring config: radius(%), speed(s/revolution), direction(1=CW, -1=CCW) */
const RINGS = [
  { radius: 28, speed: 30,  dir: 1  },
  { radius: 42, speed: 45,  dir: -1 },
  { radius: 56, speed: 60,  dir: 1  },
  { radius: 70, speed: 80,  dir: -1 },
]

export default function TechOrbit() {
  const containerRef = useRef(null)
  const orbitRef     = useRef(null)
  const ringRefs     = useRef([])
  const iconRefs     = useRef([])
  const [hovered, setHovered]   = useState(null)
  const [paused, setPaused]     = useState(false)
  const tiltRef     = useRef({ x: 0, y: 0 })
  const rafRef      = useRef(null)

  /* ── Mouse parallax / 3D tilt ── */
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    tiltRef.current.x = ((e.clientY - cy) / (rect.height / 2)) * 8
    tiltRef.current.y = ((e.clientX - cx) / (rect.width / 2)) * -8
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  /* ── Smooth tilt RAF loop ── */
  useEffect(() => {
    let currentX = 0, currentY = 0
    function tick() {
      currentX += (tiltRef.current.x - currentX) * 0.06
      currentY += (tiltRef.current.y - currentY) * 0.06
      if (orbitRef.current) {
        orbitRef.current.style.transform =
          `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* ── Pause on hover ── */
  useEffect(() => {
    ringRefs.current.forEach((ring) => {
      if (ring) ring.style.animationPlayState = paused ? 'paused' : 'running'
    })
    // Also pause icon counter-rotation
    iconRefs.current.forEach((icon) => {
      if (icon) icon.style.animationPlayState = paused ? 'paused' : 'running'
    })
  }, [paused])

  /* ── Distribute icons evenly around each ring ── */
  const ringTechs = RINGS.map((_, ri) => TECHS.filter(t => t.ring === ri))

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseLeave={() => { setPaused(false); setHovered(null) }}
    >
      {/* Ambient glow */}
      <div className={styles.ambientGlow} aria-hidden />

      {/* Orbit system */}
      <div ref={orbitRef} className={styles.orbitSystem}>

        {/* Orbit ring paths */}
        {RINGS.map((ring, ri) => (
          <div
            key={ri}
            className={`${styles.ringPath} ${styles[`ringPath${ri}`]}`}
            style={{
              width: `${ring.radius * 2}%`,
              height: `${ring.radius * 2}%`,
            }}
          />
        ))}

        {/* Rotating rings with icons */}
        {RINGS.map((ring, ri) => {
          const techs = ringTechs[ri]
          const angleStep = 360 / techs.length
          return (
            <div
              key={ri}
              ref={el => { ringRefs.current[ri] = el }}
              className={`${styles.ring} ${styles[`ring${ri}`]}`}
              style={{
                width: `${ring.radius * 2}%`,
                height: `${ring.radius * 2}%`,
                animationDuration: `${ring.speed}s`,
                animationDirection: ring.dir === 1 ? 'normal' : 'reverse',
              }}
            >
              {techs.map((tech, ti) => {
                const angle = angleStep * ti
                const rad = (angle * Math.PI) / 180
                const r = 50 // percent from center of ring
                const x = 50 + r * Math.cos(rad)
                const y = 50 + r * Math.sin(rad)
                const isHovered = hovered === `${ri}-${ti}`

                return (
                  <div
                    key={tech.name}
                    ref={el => { iconRefs.current[ri * 4 + ti] = el }}
                    className={`${styles.iconWrap} ${isHovered ? styles.iconWrapActive : ''}`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      animationDuration: `${ring.speed}s`,
                      animationDirection: ring.dir === 1 ? 'reverse' : 'normal',
                    }}
                    onMouseEnter={() => { setPaused(true); setHovered(`${ri}-${ti}`) }}
                    onMouseLeave={() => { setPaused(false); setHovered(null) }}
                  >
                    <div
                      className={`${styles.iconBadge} ${isHovered ? styles.iconBadgeActive : ''}`}
                      style={{ '--tech-color': tech.color }}
                    >
                      <span className={styles.iconLetter}>
                        {tech.name.charAt(0)}
                      </span>
                    </div>

                    {/* Tooltip */}
                    {isHovered && (
                      <div className={styles.tooltip}>
                        <span className={styles.tooltipName}>{tech.name}</span>
                        <span className={styles.tooltipProf}>{tech.prof}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}

        {/* Center badge */}
        <div className={styles.centerBadge}>
          <span className={styles.centerInitials}>AM</span>
          <span className={styles.centerLabel}>Full-Stack</span>
        </div>

      </div>
    </div>
  )
}
