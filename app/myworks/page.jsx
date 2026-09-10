'use client'

import Link from 'next/link'
import profile from '@/data/profile.json'
import Navbar from '@/components/ui/Navbar'
import CustomCursor from '@/components/ui/CustomCursor'
import '@/styles/reference/MyWorks.css'

export default function MyWorks() {
  const projects = profile.projects || []

  return (
    <>
      <CustomCursor />
      <Navbar />
      <div className="myworks-page">
        <div className="myworks-header">
          <Link href="/" className="back-button" data-cursor="disable">
            ← Back to Home
          </Link>
          <h1>
            All <span>Works</span>
          </h1>
          <p>A collection of all my projects and creations</p>
        </div>

        <div className="myworks-grid">
          {projects.map((project, index) => {
            const href = project.link
            const img = project.image?.startsWith('/')
              ? project.image
              : `/${project.image}`
            const cardContent = (
              <>
                <div className="myworks-card-number">0{index + 1}</div>
                <div className="myworks-card-image">
                  <img src={img} alt={project.title} loading="lazy" decoding="async" />
                </div>
                <div className="myworks-card-info">
                  <h3>{project.title}</h3>
                  <p className="myworks-card-category">{project.category}</p>
                  <p className="myworks-card-description">{project.description}</p>
                  <p className="myworks-card-tech">{project.technologies}</p>
                </div>
              </>
            )

            return (
              <a
                className="myworks-card"
                key={project.id}
                data-cursor="disable"
                href={href || undefined}
                target={href ? '_blank' : undefined}
                rel={href ? 'noopener noreferrer' : undefined}
              >
                {cardContent}
              </a>
            )
          })}
        </div>
      </div>
    </>
  )
}
