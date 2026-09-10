'use client'

import profile from '@/data/profile.json'

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
            {firstName.toUpperCase()}
            {lastName ? (
              <>
                {' '}
                <br />
                <span>{lastName.toUpperCase()}</span>
              </>
            ) : null}
          </h1>
        </div>
        <div className="landing-info">
          <h3>An</h3>
          <h2 className="landing-info-h2">
            <div className="landing-h2-1">Full-Stack</div>
            <div className="landing-h2-2">Software</div>
          </h2>
          <h2>
            <div className="landing-h2-info">Software Engineer</div>
            <div className="landing-h2-info-1">Product Builder</div>
          </h2>
        </div>
        <div className="mobile-photo">
          <img
            src="/images/ahsan_ai_portrait.png"
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
