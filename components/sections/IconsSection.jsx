'use client'

import { useEffect } from 'react'
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6'
import { TbNotes } from 'react-icons/tb'
import HoverLinks from '@/components/ui/HoverLinks'
import profile from '@/data/profile.json'

export default function SocialIcons() {
  useEffect(() => {
    const social = document.getElementById('social')
    if (!social) return

    const cleanups = []

    social.querySelectorAll('span').forEach((item) => {
      const link = item.querySelector('a')
      if (!link) return

      const rect = item.getBoundingClientRect()
      let mouseX = rect.width / 2
      let mouseY = rect.height / 2
      let currentX = 0
      let currentY = 0
      let rafId = 0

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1
        currentY += (mouseY - currentY) * 0.1
        link.style.setProperty('--siLeft', `${currentX}px`)
        link.style.setProperty('--siTop', `${currentY}px`)
        rafId = requestAnimationFrame(updatePosition)
      }

      const onMouseMove = (e) => {
        const latest = item.getBoundingClientRect()
        const x = e.clientX - latest.left
        const y = e.clientY - latest.top
        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x
          mouseY = y
        } else {
          mouseX = latest.width / 2
          mouseY = latest.height / 2
        }
      }

      document.addEventListener('mousemove', onMouseMove)
      updatePosition()
      cleanups.push(() => {
        document.removeEventListener('mousemove', onMouseMove)
        cancelAnimationFrame(rafId)
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href={profile.social?.github} target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href={profile.social?.linkedin} target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href={profile.social?.twitter} target="_blank" rel="noopener noreferrer">
            <FaXTwitter />
          </a>
        </span>
        <span>
          <a href={profile.social?.instagram} target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </span>
      </div>
      <a className="resume-button" href={profile.social?.resume || '#'} data-cursor="disable">
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  )
}
