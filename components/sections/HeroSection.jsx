'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { FiArrowUpRight, FiDownload } from 'react-icons/fi'
import { gsap } from '@/lib/gsap'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import MarqueeStrip from '@/components/ui/MarqueeStrip'

import profile from '@/data/profile.json'
import styles from '@/styles/sections/HeroSection.module.css'

const HeroDigitalCore = dynamic(() => import('@/components/three/HeroDigitalCore'), { ssr: false })

const SOCIAL_ICON_MAP = { GitHub: FaGithub, LinkedIn: FaLinkedinIn, WhatsApp: FaWhatsapp }

export default function HeroSection() {
  const sectionRef    = useRef(null)
  const greetingRef   = useRef(null)
  const nameFirstRef  = useRef(null)
  const nameLastRef   = useRef(null)
  const roleARef      = useRef(null)
  const roleBRef      = useRef(null)
  const taglineRef    = useRef(null)
  const ctaGroupRef   = useRef(null)
  const core3dRef     = useRef(null)
  const cycleRef      = useRef(null)
  const timelineRef   = useRef(null)
  const activeRef     = useRef(false)
  const currentRoleIdx = useRef(0)

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

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const roles = profile.roleCycle && profile.roleCycle.length > 0
      ? profile.roleCycle
      : [profile.roles?.short || '']

    if (reduced) {
      gsap.set([greetingRef.current, nameFirstRef.current, nameLastRef.current, taglineRef.current, ctaGroupRef.current].filter(Boolean),
        { opacity: 1, y: 0 })
      if (core3dRef.current) gsap.set(core3dRef.current, { opacity: 1, scale: 1 })
      if (roleARef.current) {
        roleARef.current.textContent = roles[0]
        gsap.set(roleARef.current, { clipPath: 'inset(0 0 0% 0)' })
      }
      if (roleBRef.current) gsap.set(roleBRef.current, { clipPath: 'inset(0 0 100% 0)' })
      return
    }

    gsap.set(greetingRef.current, { opacity: 0, y: 20 })
    gsap.set([nameFirstRef.current, nameLastRef.current], { opacity: 0, y: 60 })
    gsap.set(taglineRef.current, { opacity: 0, y: 20 })
    gsap.set(ctaGroupRef.current, { opacity: 0, y: 20 })
    if (core3dRef.current) gsap.set(core3dRef.current, { opacity: 0, scale: 0.9 })

    if (roleARef.current) {
      roleARef.current.textContent = roles[0]
      gsap.set(roleARef.current, { clipPath: 'inset(0 0 0% 0)' })
    }
    if (roleBRef.current) gsap.set(roleBRef.current, { clipPath: 'inset(0 0 100% 0)' })

    const tl = gsap.timeline({ paused: true, onComplete: () => startCycle() })
    timelineRef.current = tl

    tl.to(greetingRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0)
      .to([nameFirstRef.current, nameLastRef.current],
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12 }, 0.1)
      .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.5)
      .to(ctaGroupRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.7)
      .to(core3dRef.current, { opacity: 1, scale: 1, duration: 1.0, ease: 'expo.out' }, 0.3)

    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        tl.play()
        observer.disconnect()
      }
    }, { threshold: 0.15 })

    observer.observe(section)
    activeRef.current = true

    function startCycle() {
      if (cycleRef.current) clearTimeout(cycleRef.current)
      if (!activeRef.current || roles.length <= 1) return
      const cycleNext = () => {
        const outgoing = currentRoleIdx.current % 2 === 0 ? roleARef.current : roleBRef.current
        const incoming = currentRoleIdx.current % 2 === 0 ? roleBRef.current : roleARef.current
        if (!outgoing || !incoming) return
        const nextIdx = (currentRoleIdx.current + 1) % roles.length
        incoming.textContent = roles[nextIdx]
        gsap.set(incoming, { clipPath: 'inset(0 0 100% 0)' })
        gsap.to(outgoing, { clipPath: 'inset(0 0 100% 0)', duration: 0.4, ease: 'power2.in' })
        gsap.to(incoming, { clipPath: 'inset(0 0 0% 0)', duration: 0.4, ease: 'power2.out', delay: 0.1 })
        currentRoleIdx.current = nextIdx
        cycleRef.current = setTimeout(cycleNext, 2500)
      }
      cycleRef.current = setTimeout(cycleNext, 2500)
    }

    return () => {
      observer.disconnect()
      tl.kill()
      activeRef.current = false
      if (cycleRef.current) clearTimeout(cycleRef.current)
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} id="hero">
      <div className={styles.container}>

        {/* Left Editorial Content */}
        <div className={styles.leftCol}>
          <div className={styles.badge} data-cursor="hover">
            <span className={styles.dot} /> Available for projects & engineering roles
          </div>

          <p ref={greetingRef} className={styles.greeting}>{profile.greeting || "Hello! I'm"}</p>

          <h1 className={styles.nameHeader}>
            <span ref={nameFirstRef} className={styles.nameFirst}>{profile.name.first.toUpperCase()}</span>
            <span ref={nameLastRef}  className={styles.nameLast}>{profile.name.last.toUpperCase()}</span>
          </h1>

          <div className={styles.roleSwitcher} aria-live="polite">
            <span ref={roleARef} className={styles.roleText}>{profile.roleCycle?.[0] || profile.roles?.short || ''}</span>
            <span ref={roleBRef} className={styles.roleText} aria-hidden="true" />
          </div>

          <p ref={taglineRef} className={styles.brandStatement}>
            {profile.tagline || profile.roles?.detailed || ''}
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

      {/* Bottom marquee (single lavender strip) */}
      <div className={styles.marqueeRow} aria-hidden="true">
        <MarqueeStrip text={profile.tagline || profile.roles?.detailed || ''} direction="ltr" speed={60} accent="orange" />
      </div>
    </section>
  )
}