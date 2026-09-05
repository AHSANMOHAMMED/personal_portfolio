'use client'

import { useEffect, useRef, Fragment } from 'react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { FiArrowUpRight, FiDownload } from 'react-icons/fi'
import { gsap } from '@/lib/gsap'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

import profile from '@/data/profile.json'
import content from '@/data/content.json'
import styles from '@/styles/sections/HeroSection.module.css'

const HeroBackground = dynamic(() => import('@/components/three/HeroBackground'), { ssr: false })
const HeroDigitalCore = dynamic(() => import('@/components/three/HeroDigitalCore'), { ssr: false })

const SOCIAL_ICON_MAP = { GitHub: FaGithub, LinkedIn: FaLinkedinIn, WhatsApp: FaWhatsapp }
const SIDEBAR_LABELS  = ['WhatsApp', 'GitHub', 'LinkedIn']

function splitTagline(text, highlight) {
  if (!highlight) return [text]
  const parts = text.split(highlight)
  return parts.reduce((acc, part, i) => {
    acc.push(part)
    if (i < parts.length - 1) {
      acc.push(<span key={i} className={styles.taglineAccent}>{highlight}</span>)
    }
    return acc
  }, [])
}

export default function HeroSection() {
  const sectionRef     = useRef(null)
  const greetRef       = useRef(null)
  const roleRef        = useRef(null)
  const firstName      = useRef(null)
  const lastName       = useRef(null)
  const photoRef       = useRef(null)
  const pillsRef       = useRef(null)
  const ctaBtnRef      = useRef(null)
  const statsRef       = useRef(null)
  const taglineCardRef = useRef(null)
  const availCardRef   = useRef(null)
  const socialRef      = useRef(null)
  const sectionRef   = useRef(null)
  const titleRef     = useRef(null)
  const subTitleRef  = useRef(null)
  const statementRef = useRef(null)
  const ctaGroupRef  = useRef(null)
  const core3dRef    = useRef(null)

  function handleViewProjects() {
    const scroller = document.querySelector('main')
    if (scroller) {
      gsap.to(scroller, { scrollTop: 3 * window.innerHeight, duration: 1.0, ease: 'power3.inOut' })
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

    // Set initial states
    gsap.set(greetRef.current, { opacity: 0, y: -20 })
    gsap.set(roleRef.current, { opacity: 0, y: 15 })
    gsap.set(firstName.current, { opacity: 0, x: -60, skewX: -3 })
    gsap.set(lastName.current, { opacity: 0, x: -60, skewX: -3 })
    if (photoRef.current) gsap.set(photoRef.current, { opacity: 0, clipPath: 'inset(0 100% 0 0)' })
    if (socialRef.current) gsap.set(socialRef.current, { opacity: 0, x: -15 })
    gsap.set(ctaBtnRef.current, { opacity: 0, y: 15, scale: 0.95 })
    gsap.set(taglineCardRef.current, { opacity: 0, y: 20, scale: 0.96 })
    gsap.set(availCardRef.current, { opacity: 0, y: 20, scale: 0.96 })
    gsap.set(statsRef.current, { opacity: 0, y: 15 })
    gsap.set(titleRef.current, { opacity: 0, y: 40 })
    gsap.set(subTitleRef.current, { opacity: 0, y: 30 })
    gsap.set(statementRef.current, { opacity: 0, y: 20 })
    gsap.set(ctaGroupRef.current, { opacity: 0, y: 20 })
    if (core3dRef.current) gsap.set(core3dRef.current, { opacity: 0, scale: 0.8 })

    // Stagger individual pills
    const pillEls = pillsRef.current?.querySelectorAll('.' + styles.pill)
    if (pillEls?.length) gsap.set(pillEls, { opacity: 0, y: 12, scale: 0.9 })

    const tl = gsap.timeline({ paused: true })
    tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.1)
      .to(subTitleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.25)
      .to(statementRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.4)
      .to(ctaGroupRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' }, 0.55)
      .to(core3dRef.current, { opacity: 1, scale: 1, duration: 1.0, ease: 'expo.out' }, 0.2)

    // Greeting and role
    tl.to(greetRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0)
      .to(roleRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.15)
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        tl.play()
        observer.disconnect()
      }
    }, { threshold: 0.15 })

    // Name — dramatic slide with skew
    .to(firstName.current, { opacity: 1, x: 0, skewX: 0, duration: 0.7, ease: 'expo.out' }, 0.2)
      .to(lastName.current, { opacity: 1, x: 0, skewX: 0, duration: 0.7, ease: 'expo.out' }, 0.35)

    // Photo — cinematic clip-path reveal from right
    .to(photoRef.current, { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.0, ease: 'power3.inOut' }, 0.2)

    // Social sidebar
    .to(socialRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.5)

    // Pills — staggered pop in
    .to(pillEls || [], { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)', stagger: 0.08 }, 0.6)

    // CTA button — scale pop
    .to(ctaBtnRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }, 0.9)

    // Stats — slide up
    .to(statsRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 1.0)

    // Tagline + availability cards — slide up with scale
    .to(taglineCardRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }, 0.7)
      .to(availCardRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }, 0.85)

    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { tl.play(); observer.disconnect() } },
      { threshold: 0.2 },
    )
    observer.observe(section)
    return () => { observer.disconnect(); tl.kill() }
  }, [])

  const sidebarSocials = SIDEBAR_LABELS
    .map(label => profile.socials.find(s => s.label === label))
    .filter(Boolean)

  return (
    <section ref={sectionRef} className={styles.section}>
    <section ref={sectionRef} className={styles.section} id="hero">
      <div className={styles.container}>
        
        {/* Left Editorial Content */}
        <div className={styles.leftCol}>
          <div className={styles.badge} data-cursor="hover">
            <span className={styles.dot} /> Available for projects & engineering roles
          </div>

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/personal_portfolio/assets/hero1.png"
        className={styles.bgVideo}
      >
        <source src="/personal_portfolio/assets/hero_bg_video.mp4" type="video/mp4" />
      </video>
          <h1 ref={titleRef} className={styles.nameHeader}>
            <span className={styles.firstName}>{profile.name.first.toUpperCase()}</span>
            <span className={styles.lastName}>{profile.name.last.toUpperCase()}</span>
          </h1>

      <ErrorBoundary>
        <HeroBackground />
      </ErrorBoundary>
          <h2 ref={subTitleRef} className={styles.roleSubHeader}>
            FULL-STACK SOFTWARE ENGINEER
          </h2>

      {/* Photo */}
      <div ref={photoRef} className={styles.photo}>
        <Image
          src="/personal_portfolio/images/my_portrait_1778399171468.png" alt={profile.name.full}
          fill priority quality={100}
          sizes="(min-width: 768px) 55vw, 100vw"
          className={styles.photoImg}
        />
      </div>
          <p ref={statementRef} className={styles.brandStatement}>
            {"\"I build digital systems that solve real problems.\""}
          </p>

      {/* Social Sidebar */}
      <div ref={socialRef} className={styles.socialSidebar}>
        {sidebarSocials.map(social => {
          const Icon = SOCIAL_ICON_MAP[social.label]
          if (!Icon) return null
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label={social.label}
          <div ref={ctaGroupRef} className={styles.ctaGroup}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleScrollToWork}
              data-cursor="project"
              data-cursor-label="VIEW"
            >
              <Icon size={15} />
              <span className={styles.socialLabel}>{social.label}</span>
            </a>
          )
        })}
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollText}>Scroll down</span>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="7" cy="6" r="2" fill="currentColor"/>
          </svg>
        </div>
      </div>
              VIEW WORK <FiArrowUpRight />
            </button>

      {/* Left Content Column */}
      <div className={styles.content}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleScrollToAbout}
              data-cursor="hover"
            >
              ABOUT ME
            </button>

        {/* Greeting */}
        <div className={styles.greeting}>
          <p ref={greetRef} className={styles.greetText}>{"Hi, I'm"}</p>
          <p ref={roleRef}  className={styles.roleText}>{profile.roles.short}</p>
        </div>
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

        {/* Stacked Name */}
        <div className={styles.nameBlock}>
          <p ref={firstName} className={styles.name}>{profile.name.first}</p>
          <p ref={lastName}  className={styles.name}>{profile.name.last}</p>
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

        {/* Tag Pills */}
        <div ref={pillsRef} className={styles.pills}>
          {content.hero.pills.map((tag, i) => (
            <Fragment key={tag}>
              <span className={styles.pill}>{tag}</span>
              {i < content.hero.pills.length - 1 && (
                <span className={styles.pillDot} aria-hidden="true" />
              )}
            </Fragment>
          ))}
        {/* Right 3D Visual Core Container */}
        <div ref={core3dRef} className={styles.right3dCol} data-cursor="rotate3d">
          <ErrorBoundary>
            <HeroDigitalCore />
          </ErrorBoundary>
        </div>

        {/* View Projects CTA */}
        <div ref={ctaBtnRef} className={styles.ctaRow}>
          <button type="button" className={styles.viewBtn} onClick={handleViewProjects}>
            View Work <FiArrowUpRight />
          </button>
          <a href={profile.resume} download className={styles.resumeBtn}>
            Resume <FiDownload />
          </a>
        </div>

        {/* Stats Row */}
        <div ref={statsRef} className={styles.stats}>
          {[...profile.stats.slice(0, 2), content.hero.specialistStat].map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Tagline + Availability Cards */}
      <div className={styles.cardsCol}>
        <div ref={taglineCardRef} className={styles.taglineCard}>
          <p className={styles.taglineText}>
            {splitTagline(profile.tagline, content.hero.taglineHighlight)}
          </p>
          <p className={styles.freelanceNote}>{content.hero.freelanceNote}</p>
        </div>

        {profile.available && (
          <div ref={availCardRef} className={styles.availCard}>
            <div className={styles.availHeader}>
              <span className={styles.availDot} />
              <span className={styles.availStatus}>{content.hero.availableLabel}</span>
            </div>
            <p className={styles.locationLine}>Based in {profile.location.based}</p>
            <p className={styles.locationLine}>Available {profile.location.availability}</p>
          </div>
        )}
      </div>

    </section>
  )
}
