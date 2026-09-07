'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/ContactSection.module.css'

export default function ContactSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom center',
        toggleActions: 'play none none none',
      },
    })

    tl.fromTo(
      `.${styles.contactSection} h3`,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
    tl.fromTo(
      `.${styles.contactBox}`,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
      '-=0.4'
    )

    return () => tl.kill()
  }, [])

  const socialLinks = [
    { name: 'Github', href: profile.social?.github, icon: 'github' },
    { name: 'Linkedin', href: profile.social?.linkedin, icon: 'linkedin' },
    { name: 'Twitter', href: profile.social?.twitter, icon: 'twitter' },
    { name: 'Instagram', href: profile.social?.instagram, icon: 'instagram' },
    { name: 'Facebook', href: profile.social?.facebook, icon: 'facebook' },
  ]

  return (
    <div ref={sectionRef} className={styles.contactSection} id="contact">
      <div className={styles.contactContainer}>
        <h3>{profile.developer?.fullName || 'Ahsan Mohammed'}</h3>

        <div className={styles.contactFlex}>
          <div className={styles.contactBox}>
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

          <div className={styles.contactBox}>
            <h4>Social</h4>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactSocial}
                data-cursor="disable"
              >
                {social.name}
              </a>
            ))}
          </div>

          <div className={styles.contactBox}>
            <h2>
              Designed and Developed
              <br />
              by <span>{profile.developer?.fullName || 'Ahsan Mohammed'}</span>
            </h2>
            <h5>
              © {new Date().getFullYear()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  )
}