'use client'

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
