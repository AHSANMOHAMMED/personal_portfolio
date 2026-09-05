'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from '@/lib/gsap'
import styles from '@/styles/ui/ProjectModal.module.css'
import Image from 'next/image'

export default function ProjectModal({ isOpen, onClose, project }) {
  const overlayRef = useRef(null)
  const modalRef = useRef(null)
  const [imgIdx, setImgIdx] = useState(0)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const previousFocusRef = useRef(null)

  const allImages = project
    ? [...new Set([project.image, ...(project.demoImages || [])])]
    : []

  useEffect(() => {
    if (isOpen && project) {
      previousFocusRef.current = document.activeElement
      queueMicrotask(() => setImgIdx(0))
      document.body.style.overflow = 'hidden'
      document.body.dataset.modalOpen = 'true'
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(modalRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', delay: 0.1 })
      requestAnimationFrame(() => modalRef.current?.focus())
    } else {
      document.body.style.overflow = ''
      delete document.body.dataset.modalOpen
      previousFocusRef.current?.focus?.()
    }
    return () => {
      document.body.style.overflow = ''
      delete document.body.dataset.modalOpen
    }
  }, [isOpen, project])

  const handleClose = useCallback(() => {
    gsap.to(modalRef.current, { y: 20, opacity: 0, duration: 0.2 })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, onComplete: () => {
      delete document.body.dataset.modalOpen
      onClose()
    }})
  }, [onClose])

  const prevImg = useCallback(() => {
    setImgIdx(i => (i - 1 + allImages.length) % allImages.length)
  }, [allImages.length])

  const nextImg = useCallback(() => {
    setImgIdx(i => (i + 1) % allImages.length)
  }, [allImages.length])

  // Touch swipe for image carousel
  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const onTouchEnd = useCallback((e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) nextImg()
      else prevImg()
    }
  }, [nextImg, prevImg])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') prevImg()
      if (e.key === 'ArrowRight') nextImg()
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, handleClose, prevImg, nextImg])

  if (!isOpen || !project) return null

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleClose}>
      <div
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        onWheel={e => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Image Carousel */}
        {allImages.length > 0 && (
          <div
            className={styles.carousel}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className={styles.carouselTrack}>
              {allImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className={`${styles.carouselSlide} ${idx === imgIdx ? styles.carouselSlideActive : ''}`}
                >
                  <Image
                    src={imgSrc}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    fill
                    className={styles.carouselImage}
                    sizes="(max-width: 768px) 100vw, 900px"
                  />
                </div>
              ))}
            </div>

            {allImages.length > 1 && (
              <>
                <button className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`} onClick={prevImg} aria-label="Previous image">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className={`${styles.carouselArrow} ${styles.carouselArrowRight}`} onClick={nextImg} aria-label="Next image">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div className={styles.carouselDots}>
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      className={`${styles.dot} ${idx === imgIdx ? styles.dotActive : ''}`}
                      onClick={() => setImgIdx(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
                <span className={styles.carouselCounter}>{imgIdx + 1} / {allImages.length}</span>
              </>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className={styles.scrollContent}>
          <div className={styles.header}>
            <span className={styles.typeTag} style={{ color: project.color || 'var(--accent)', borderColor: `${project.color || '#f7931e'}40`, backgroundColor: `${project.color || '#f7931e'}1A` }}>
              {project.type}
            </span>
            <h2 id="project-dialog-title" className={styles.title}>{project.title}</h2>
            <p className={styles.subtitle}>{project.subtitle}</p>
          </div>

          <div className={styles.details}>
            {project.problem && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle} style={{ borderLeftColor: project.color || 'var(--accent)' }}>The Problem</h3>
                {Array.isArray(project.problem) ? (
                  <ul className={styles.listText}>
                    {project.problem.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                ) : (
                  <p className={styles.sectionText}>{project.problem}</p>
                )}
              </div>
            )}

            {project.solution && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle} style={{ borderLeftColor: project.color || 'var(--accent)' }}>The Solution</h3>
                {Array.isArray(project.solution) ? (
                  <ul className={styles.listText}>
                    {project.solution.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                ) : (
                  <p className={styles.sectionText}>{project.solution}</p>
                )}
              </div>
            )}

            <div className={styles.section}>
              <h3 className={styles.sectionTitle} style={{ borderLeftColor: project.color || 'var(--accent)' }}>About</h3>
              <p className={styles.sectionText}>{project.desc}</p>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle} style={{ borderLeftColor: project.color || 'var(--accent)' }}>Technologies</h3>
              <div className={styles.stack}>
                {project.tech.map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className={styles.primaryBtn} style={{ backgroundColor: project.color || 'var(--accent)', color: '#fff' }}>
                  View Demo
                </a>
              )}
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn}>
                  GitHub Repo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
