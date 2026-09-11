'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import profile from '@/data/profile.json'
import WorkImage from '@/components/ui/WorkImage'

export default function WorkSection() {
  const projects = (profile.projects || []).slice(0, 5)

  useEffect(() => {
    let translateX = 0
    let timeline

    function setTranslateX() {
      const box = document.getElementsByClassName('work-box')
      if (box.length === 0) return
      const container = document.querySelector('.work-container')
      if (!container) return
      const rectLeft = container.getBoundingClientRect().left
      const rect = box[0].getBoundingClientRect()
      const parentWidth = box[0].parentElement.getBoundingClientRect().width
      const padding = parseInt(window.getComputedStyle(box[0]).padding, 10) / 2 || 0
      translateX = Math.max(
        0,
        rect.width * box.length - (rectLeft + parentWidth) + padding,
      )
    }

    function build() {
      timeline?.kill()
      ScrollTrigger.getById('work')?.kill()
      setTranslateX()
      if (translateX <= 0) return

      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.work-section',
          start: 'top top',
          end: `+=${translateX}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          id: 'work',
          invalidateOnRefresh: true,
        },
      })

      timeline.to('.work-flex', {
        x: -translateX,
        ease: 'none',
      })
    }

    build()
    ScrollTrigger.refresh()

    const onResize = () => {
      build()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      timeline?.kill()
      ScrollTrigger.getById('work')?.kill()
    }
  }, [])

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>
                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.technologies}</p>
              </div>
              <WorkImage image={project.image} alt={project.title} link={project.link} />
            </div>
          ))}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Want to see more?</h3>
              <p>Explore all of my projects and creations</p>
              <Link href="/myworks" className="see-all-btn" data-cursor="disable">
                See All Works →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
