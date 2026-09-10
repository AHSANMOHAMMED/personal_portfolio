'use client'

import profile from '@/data/profile.json'

export default function AboutSection() {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{profile.about?.title || 'About Me'}</h3>
        <p className="para">{profile.about?.description}</p>
      </div>
    </div>
  )
}
