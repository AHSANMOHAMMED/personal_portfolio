'use client'

import Link from 'next/link'
import profile from '@/data/profile.json'

export default function CTASection() {
  return (
    <div className="cta-section">
      <div className="cta-buttons">
        <Link href="/play" className="cta-btn cta-btn-play" data-cursor="disable">
          Play With Me →
        </Link>
        <a
          href={profile.social?.linkedin || profile.contact?.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn cta-btn-hire"
          data-cursor="disable"
        >
          Hire Me →
        </a>
      </div>
    </div>
  )
}
