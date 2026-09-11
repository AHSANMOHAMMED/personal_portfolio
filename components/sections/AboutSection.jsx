'use client'

import { useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'

export default function AboutSection() {
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 75%',
        end: 'bottom 40%',
        toggleActions: 'play none none reverse',
      },
    })

    tl.fromTo(
      '.about-me .title',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
    ).fromTo(
      '.about-me .para',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.35',
    )

    return () => tl.kill()
  }, [])

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{profile.about?.title || 'About Me'}</h3>
        <p className="para">{profile.about?.description}</p>
      </div>
    </div>
  )
}
