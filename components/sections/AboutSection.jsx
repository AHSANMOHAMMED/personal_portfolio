'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import TechOrbit from '@/components/ui/TechOrbit'
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/AboutSection.module.css'

const BIO = profile.bio
const DIMENSIONS = [
  { num: '01', title: 'PRODUCT THINKING', desc: 'Translating complex real-world requirements into scalable, intuitive software products.' },
  { num: '02', title: 'FULL-STACK DEVELOPMENT', desc: 'End-to-end architecture with modern React, Next.js, Node.js, TypeScript, and Flutter.' },
  { num: '03', title: 'SYSTEM DESIGN', desc: 'Designing resilient microservices, optimized REST APIs, and event-driven backends.' },
  { num: '04', title: 'AI INTEGRATION', desc: 'Embedding production LLMs, AI agents, and intelligent automated workflows into applications.' },
  { num: '05', title: 'DATABASES & CACHING', desc: 'Relational & NoSQL data design using PostgreSQL, MongoDB, Redis, and PostGIS.' },
  { num: '06', title: 'DEPLOYMENT & DEVOPS', desc: 'Containerizing services with Docker, CI/CD pipelines, Nginx, and cloud hosting.' },
]

const ICON_MAP = { GitHub: FaGithub, LinkedIn: FaLinkedinIn, WhatsApp: FaWhatsapp }
const SOCIALS = profile.socials.map(s => ({ Icon: ICON_MAP[s.label], href: s.href, label: s.label }))

export default function AboutSection() {
  const sectionRef = useRef(null)
  const photoRef = useRef(null)
  const contentRef = useRef(null)
  const socialsRef = useRef(null)
  const introRef = useRef(null)
  const bioRef = useRef(null)
  const dimsRef = useRef(null)
  const intervalRef = useRef(null)

  const [typed, setTyped] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const scroller = document.querySelector('main')
    if (!scroller) return

    gsap.set(introRef.current, { opacity: 0, y: 50 })
    gsap.set(bioRef.current, { opacity: 0, y: 30 })

    const dimCards = dimsRef.current?.querySelectorAll('.' + styles.dimCard) || []
    gsap.set(dimCards, { opacity: 0, y: 25 })

    let isActive = false

    const resetAnim = () => {
      clearInterval(intervalRef.current)
      gsap.killTweensOf(photoRef.current)
      gsap.killTweensOf(contentRef.current)
      const socialIcons = socialsRef.current?.querySelectorAll('a') ?? []
      gsap.killTweensOf(socialIcons)
      gsap.set(photoRef.current, { opacity: 0, x: -50 })
      gsap.set(contentRef.current, { opacity: 0, y: 40 })
      gsap.set(socialIcons, { opacity: 0, y: 20 })
      setTyped(0)
      setDone(false)
    }

    const playAnim = () => {
      resetAnim()
      gsap.to(photoRef.current, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' })
      gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.15 })
      gsap.to(dimCards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.3 })
      const socialIcons = socialsRef.current?.querySelectorAll('a') ?? []
      gsap.to(socialIcons, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1, delay: 0.5 })

      let i = 0
      intervalRef.current = setInterval(() => {
        i = Math.min(i + 6, BIO.length)
        setTyped(i)
        if (i >= BIO.length) {
          clearInterval(intervalRef.current)
          setDone(true)
        }
      }, 16)
    }

    resetAnim()

    const onScroll = () => {
      const inRange = Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.5
      if (inRange && !isActive) {
        isActive = true
        playAnim()
      }
      if (!inRange && isActive) {
        isActive = false
        resetAnim()
      }
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      clearInterval(intervalRef.current)
      scroller.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} id="about">
      <div className={styles.container}>
        <div ref={introRef} className={styles.editorialBanner}>
          <p className={styles.kicker}>PHILOSOPHY & ARCHITECTURE</p>
          <h2 className={styles.statementText}>
            {"I DON'T JUST WRITE CODE."}<br />
            <span className={styles.highlightText}>{"I BUILD SYSTEMS."}</span>
          </h2>
        </div>

        <div ref={photoRef} className={styles.photoCol}>
          <div className={styles.photoWrap}>
            <div className={styles.photoFrame} data-about-photo>
              <Image
                src="/personal_portfolio/images/sketch_portrait_1778401315319.png"
                alt={profile.name.full}
                fill
                quality={100}
                sizes="(min-width: 768px) 30vw, 100vw"
                className={styles.photoImg}
              />
            </div>
            <p className={styles.signature}>{profile.name.first}</p>
          </div>

          <div ref={socialsRef} className={styles.socials}>
            {SOCIALS.map(({ Icon, href, label }) => Icon ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={styles.socialLink}
              >
                <Icon />
              </a>
            ) : null)}
          </div>
        </div>

        <div ref={contentRef} className={styles.content}>
          <p className={styles.whoLabel}>Tech Stack</p>

          <div className={styles.orbitWrap}>
            <TechOrbit />
          </div>

          <div ref={dimsRef} className={styles.dimensionsGrid}>
            {DIMENSIONS.map((dim) => (
              <div key={dim.num} className={styles.dimCard} data-cursor="hover">
                <span className={styles.dimNum}>{dim.num}</span>
                <h4 className={styles.dimTitle}>{dim.title}</h4>
                <p className={styles.dimDesc}>{dim.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.bioWrap}>
            <p className={styles.bio}>
              {BIO.split('').map((char, i) => (
                <span
                  key={i}
                  className={
                    i < typed
                      ? (i === typed - 1 && !done ? styles.lastTyped : styles.typed)
                      : styles.untyped
                  }
                >
                  {char}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
