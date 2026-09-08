'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { splitText } from '@/lib/splitText'
import profile from '@/data/profile.json'
import styles from '@/styles/ui/Navbar.module.css'

export default function Navbar() {
  const [isLoaded, setIsLoaded] = useState(false)
  const navRef = useRef(null)
  const linksRef = useRef([])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    // Animate nav links with split text hover effect
    linksRef.current.forEach((link) => {
      if (!link) return
      const text = link.textContent
      link.innerHTML = ''

      const outer = document.createElement('span')
      outer.className = styles.hoverLink
      outer.setAttribute('data-cursor', 'disable')

      const inner = document.createElement('span')
      inner.className = styles.hoverIn
      inner.setAttribute('data-text', text)

      const original = document.createElement('span')
      original.textContent = text

      const hover = document.createElement('div')
      hover.textContent = text

      inner.appendChild(original)
      inner.appendChild(hover)
      outer.appendChild(inner)
      link.appendChild(outer)
    })
  }, [isLoaded])

  return (
    <header ref={navRef} className={styles.header}>
      <a href="#/" className={styles.navbarTitle} data-cursor="disable">
        {profile.developer?.fullName?.split(' ').map(n => n[0]).join('') || 'AM'}
      </a>

      <a href={`mailto:${profile.social?.email}`} className={styles.navbarConnect} data-cursor="disable">
        {profile.social?.email}
      </a>

      <ul>
        <li>
          <a href="#about" ref={(el) => { linksRef.current[0] = el }}>
            About
          </a>
        </li>
        <li>
          <a href="#whatIDO" ref={(el) => { linksRef.current[1] = el }}>
            What I Do
          </a>
        </li>
        <li>
          <a href="#career" ref={(el) => { linksRef.current[2] = el }}>
            Career
          </a>
        </li>
        <li>
          <a href="#work" ref={(el) => { linksRef.current[3] = el }}>
            Work
          </a>
        </li>
        <li>
          <a href="#contact" ref={(el) => { linksRef.current[4] = el }}>
            Contact
          </a>
        </li>
      </ul>
    </header>
  )
}