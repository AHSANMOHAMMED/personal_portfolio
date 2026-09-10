'use client'

import { useEffect } from 'react'
import { MdArrowOutward, MdCopyright } from 'react-icons/md'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'

export default function ContactSection() {
  useEffect(() => {
    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%',
        end: 'bottom center',
        toggleActions: 'play none none none',
      },
    })

    contactTimeline.fromTo(
      '.contact-section h3',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    )

    contactTimeline.fromTo(
      '.contact-box',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
      '-=0.4',
    )

    return () => {
      contactTimeline.kill()
    }
  }, [])

  const social = [
    { name: 'Github', href: profile.contact?.github || profile.social?.github },
    { name: 'Linkedin', href: profile.contact?.linkedin || profile.social?.linkedin },
    { name: 'Twitter', href: profile.contact?.twitter || profile.social?.twitter },
    { name: 'Facebook', href: profile.contact?.facebook || profile.social?.facebook },
    { name: 'Instagram', href: profile.contact?.instagram || profile.social?.instagram },
  ]

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>{profile.developer?.fullName || 'Ahsan Mohammed'}</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${profile.social?.email}`} data-cursor="disable">
                {profile.social?.email}
              </a>
            </p>
            <h4>Location</h4>
            <p>
              <span>{profile.social?.location}</span>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            {social.filter((s) => s.href).map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="disable"
                className="contact-social"
              >
                {item.name} <MdArrowOutward />
              </a>
            ))}
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by{' '}
              <span>{profile.developer?.fullName || 'Ahsan Mohammed'}</span>
            </h2>
            <h5>
              <MdCopyright /> {new Date().getFullYear()}
            </h5>
            <p style={{ marginTop: '0.75rem', opacity: 0.55, fontSize: '0.75rem' }}>
              Experience inspired by an{' '}
              <a
                href="https://github.com/red1-for-hek/portfolio-website"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="disable"
              >
                MIT open-source template
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
