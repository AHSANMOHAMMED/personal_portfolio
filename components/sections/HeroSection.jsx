'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { FiArrowUpRight, FiDownload } from 'react-icons/fi'
import { gsap } from '@/lib/gsap'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

import profile from '@/data/profile.json'
import styles from '@/styles/sections/HeroSection.module.css'

const HeroDigitalCore = dynamic(() => import('@/components/three/HeroDigitalCore'), { ssr: false })

const SOCIAL_ICON_MAP = { GitHub: FaGithub, LinkedIn: FaLinkedinIn, WhatsApp: FaWhatsapp }

export default function HeroSection() {
  const sectionRef   = useRef(null)
  const titleRef     = useRef(null)
  const subTitleRef  = useRef(null)
  const statementRef = useRef(null)
  const ctaGroupRef  = useRef(null)
  const core3dRef    = useRef(null)

  function handleScrollToWork() {
    const main = document.querySelector('main')
    if (main) {
      gsap.to(main, { scrollTop: window.innerHeight * 3, duration: 1.2, ease: 'power3.inOut' })
    }
  }

  function handleScrollToAbout() {
    const main = document.querySelector('main')
    if (main) {
      gsap.to(main, { scrollTop: window.innerHeight, duration: 1.0, ease: 'power3.inOut' })
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.set(titleRef.current, { opacity: 0, y: 40 })
    gsap.set(subTitleRef.current, { opacity: 0, y: 30 })
    gsap.set(statementRef.current, { opacity: 0, y: 20 })
    gsap.set(ctaGroupRef.current, { opacity: 0, y: 20 })
    if (core3dRef.current) gsap.set(core3dRef.current, { opacity: 0, scale: 0.8 })

    const tl = gsap.timeline({ paused: true })
    tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.1)
      .to(subTitleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.25)
      .to(statementRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.4)
      .to(ctaGroupRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' }, 0.55)
      .to(core3dRef.current, { opacity: 1, scale: 1, duration: 1.0, ease: 'expo.out' }, 0.2)

    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        tl.play()
        observer.disconnect()
      }
    }, { threshold: 0.15 })

    observer.observe(section)
    return () => { observer.disconnect(); tl.kill() }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} id="hero">
      <div className={styles.container}>
        
        {/* Left Editorial Content */}
        <div className={styles.leftCol}>
          <div className={styles.badge} data-cursor="hover">
            <span className={styles.dot} /> Available for projects & engineering roles
          </div>

          <h1 ref={titleRef} className={styles.nameHeader}>
            <span className={styles.firstName}>{profile.name.first.toUpperCase()}</span>
            <span className={styles.lastName}>{profile.name.last.toUpperCase()}</span>
          </h1>

          <h2 ref={subTitleRef} className={styles.roleSubHeader}>
            FULL-STACK SOFTWARE ENGINEER
          </h2>

          <p ref={statementRef} className={styles.brandStatement}>
            {"\"I build digital systems that solve real problems.\""}
          </p>

          <div ref={ctaGroupRef} className={styles.ctaGroup}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleScrollToWork}
              data-cursor="project"
              data-cursor-label="VIEW"
            >
              VIEW WORK <FiArrowUpRight />
            </button>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleScrollToAbout}
              data-cursor="hover"
            >
              ABOUT ME
            </button>

            {profile.resume && (
              <a
                href={profile.resume}
                download
                className={styles.resumeBtn}
                data-cursor="hover"
              >
                <FiDownload /> Resume
              </a>
            )}
          </div>

          {/* Social Links Bar */}
          <div className={styles.socialBar}>
            {profile.socials.map((s) => {
              const Icon = SOCIAL_ICON_MAP[s.label]
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={s.label}
                  data-cursor="hover"
                >
                  {Icon && <Icon size={16} />}
                  <span>{s.label}</span>
                </a>
              )
            })}
          </div>
        </div>

        {/* Right 3D Visual Core Container */}
        <div ref={core3dRef} className={styles.right3dCol} data-cursor="rotate3d">
          <ErrorBoundary>
            <HeroDigitalCore />
          </ErrorBoundary>
        </div>

      </div>
    </section>
  )
}
