import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import styles from '@/styles/ui/ProjectModal.module.css'
import Image from 'next/image'

export default function ProjectModal({ isOpen, onClose, project }) {
  const overlayRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen && project) {
      document.body.style.overflow = 'hidden'
      document.body.dataset.modalOpen = 'true'
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(modalRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', delay: 0.1 })
    } else {
      document.body.style.overflow = ''
      delete document.body.dataset.modalOpen
    }
    
    return () => {
        document.body.style.overflow = ''
        delete document.body.dataset.modalOpen
    }
  }, [isOpen, project])

  const handleClose = () => {
    gsap.to(modalRef.current, { y: 20, opacity: 0, duration: 0.2 })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, onComplete: () => {
      delete document.body.dataset.modalOpen
      onClose()
    }})
  }

  if (!isOpen || !project) return null

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleClose}>
      <div className={styles.modal} ref={modalRef} onClick={e => e.stopPropagation()} onWheel={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className={styles.header}>
            <div className={styles.meta}>
                <span className={styles.typeTag} style={{ color: project.color || 'var(--accent)', borderColor: project.color ? `${project.color}40` : 'rgba(247, 147, 30, 0.25)', backgroundColor: project.color ? `${project.color}1A` : 'rgba(247, 147, 30, 0.1)' }}>{project.type}</span>
            </div>
            <h2 className={styles.title}>{project.title}</h2>
            <p className={styles.subtitle}>{project.subtitle}</p>
        </div>

        <div className={styles.content}>
            <div className={styles.imageContainer} style={{ position: 'relative' }}>
                {project.image && (
                    <Image src={project.image} alt={project.title} fill className={styles.image} />
                )}
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
                    <h3 className={styles.sectionTitle} style={{ borderLeftColor: project.color || 'var(--accent)' }}>Description</h3>
                    <p className={styles.sectionText}>{project.desc}</p>
                </div>

                {project.demoImages && project.demoImages.length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle} style={{ borderLeftColor: project.color || 'var(--accent)' }}>Screenshots</h3>
                        <div className={styles.gallery}>
                            {project.demoImages.map((imgSrc, idx) => (
                                <div key={idx} className={styles.galleryImageWrapper}>
                                    <Image src={imgSrc} alt={`${project.title} screenshot ${idx + 1}`} fill className={styles.galleryImage} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
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
