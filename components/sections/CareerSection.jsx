'use client'

import { useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'

function getDisplayYear(period) {
  if (!period) return ''
  if (/present/i.test(period)) return 'NOW'
  if (/completed/i.test(period)) return 'Completed'
  if (period.includes(' - ')) return period.split(' - ')[0]
  return period
}

export default function CareerSection() {
  const experiences = profile.experiences || []

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.career-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    })

    tl.fromTo(
      '.career-container > h2',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
    ).fromTo(
      '.career-info-box',
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'power3.out' },
      '-=0.3',
    )

    return () => tl.kill()
  }, [])

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&amp;</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot" />
          </div>
          {experiences.map((exp, index) => (
            <div key={index} className="career-info-box">
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{exp.position}</h4>
                  <h5>{exp.company}</h5>
                </div>
                <h3>{getDisplayYear(exp.period)}</h3>
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
