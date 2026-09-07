'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { splitText, animateSplitText } from '@/lib/splitText'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/AboutSection.module.css'

export default function AboutSection() {
  const sectionRef = useRef(null)
  const paraRef = useRef([])
  const titleRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const paras = section.querySelectorAll(`.${styles.para}`)
    const titles = section.querySelectorAll(`.${styles.title}`)

    paras.forEach((el) => {
      el.classList.add('visible')
      const split = splitText(el, { type: 'lines,words' })
      el.split = split
      const anim = animateSplitText(split, {
        y: 80,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el.parentElement?.parentElement,
          start: 'top 60%',
          toggleActions: 'play pause resume reverse',
        },
      })
      el.anim = anim
    })

    titles.forEach((el) => {
      const split = splitText(el, { type: 'chars,lines', linesClass: 'split-line' })
      el.split = split
      const anim = animateSplitText(split, {
        y: 80,
        rotate: 10,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: el.parentElement?.parentElement,
          start: 'top 60%',
          toggleActions: 'play pause resume reverse',
        },
      })
      el.anim = anim
    })

    return () => {
      paras.forEach((el) => {
        el.split?.revert()
        el.anim?.kill()
      })
      titles.forEach((el) => {
        el.split?.revert()
        el.anim?.kill()
      })
    }
  }, [])

  return (
    <div ref={sectionRef} className={styles.aboutSection} id="about">
      <div className={styles.aboutMe}>
        <h3 ref={titleRef} className={styles.title}>{profile.about?.title || 'About Me'}</h3>
        <p ref={(el) => { paraRef.current[0] = el }} className={styles.para}>
          {profile.about?.description || ''}
        </p>
      </div>
    </div>
  )
}