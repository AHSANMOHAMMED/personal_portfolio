'use client'

import profile from '@/data/profile.json'
import { assetUrl } from '@/lib/siteConfig'

export default function LandingSection() {
  const nameParts = (profile.developer?.fullName || 'Ahsan Mohammed').split(' ')
  const firstName = nameParts[0] || profile.developer?.name || 'Ahsan'
  const lastName = nameParts.slice(1).join(' ') || ''

  return (
    <div className="landing-section" id="landingDiv">
      <div className="landing-container">
        <div className="landing-intro">
          <h2>Hello! I&apos;m</h2>
          <h1>
            <span className="landing-name-line">{firstName.toUpperCase()}</span>
            {lastName ? (
              <span className="landing-name-line">{lastName.toUpperCase()}</span>
            ) : null}
          </h1>
        </div>
        <div className="landing-info">
          <h3>An</h3>
          <h2 className="landing-info-h2">
            <div className="landing-h2-1">Full-Stack</div>
          </h2>
          <h2 className="landing-info-sub">
            <div className="landing-h2-info">
              <span className="landing-role-line">Software</span>
              <span className="landing-role-line">Engineer</span>
            </div>
          </h2>
        </div>
        <div className="mobile-photo">
          <img
            src={assetUrl('/images/ahsan_ai_portrait.png')}
            alt={profile.developer?.fullName || 'Ahsan Mohammed'}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </div>
  )
}
