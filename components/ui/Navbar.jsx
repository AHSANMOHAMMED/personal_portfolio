'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import HoverLinks from '@/components/ui/HoverLinks'
import profile from '@/data/profile.json'

export let lenis = null

export default function Navbar() {
  const pathname = usePathname()

  useEffect(() => {
    const isTouchMobile =
      typeof window !== 'undefined' &&
      (window.matchMedia('(max-width: 1024px)').matches ||
        window.matchMedia('(hover: none) and (pointer: coarse)').matches)

    // Phones/tablets: force native document scroll (no Lenis, no pin traps).
    if (isTouchMobile) {
      const unlock = () => {
        document.documentElement.style.setProperty('overflow-y', 'auto', 'important')
        document.documentElement.style.setProperty('height', 'auto', 'important')
        document.body.style.setProperty('overflow-y', 'auto', 'important')
        document.body.style.setProperty('overflow', 'auto', 'important')
        document.body.style.setProperty('height', 'auto', 'important')
        document.body.style.position = 'relative'
        document.body.style.touchAction = 'pan-y pinch-zoom'
      }
      unlock()

      // Kill any leftover work pins from desktop→mobile resize.
      ScrollTrigger.getById('work')?.kill()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars?.pin) {
          // keep character scrub triggers; only drop full-page pins if any
        }
      })

      const links = document.querySelectorAll('.header ul a')
      const onClick = (e) => {
        const section = e.currentTarget.getAttribute('data-href')
        if (!section) return
        const target = document.querySelector(section)
        if (!target) return
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      links.forEach((elem) => elem.addEventListener('click', onClick))
      const refresh = () => {
        unlock()
        ScrollTrigger.refresh()
      }
      window.addEventListener('orientationchange', refresh)
      window.addEventListener('load', refresh)
      requestAnimationFrame(refresh)
      return () => {
        links.forEach((elem) => elem.removeEventListener('click', onClick))
        window.removeEventListener('orientationchange', refresh)
        window.removeEventListener('load', refresh)
      }
    }

    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    })

    // Home waits for the loader/Character intro; other routes scroll immediately
    if (pathname === '/') {
      lenis.stop()
    } else {
      lenis.start()
      document.body.style.overflowY = 'auto'
    }

    function raf(time) {
      lenis?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    const links = document.querySelectorAll('.header ul a')
    const onClick = (e) => {
      e.preventDefault()
      const section = e.currentTarget.getAttribute('data-href')
      if (section && lenis) {
        const target = document.querySelector(section)
        if (target) {
          lenis.scrollTo(target, {
            offset: 0,
            duration: 1.5,
          })
        }
      }
    }
    links.forEach((elem) => elem.addEventListener('click', onClick))

    const onResize = () => lenis?.resize()
    window.addEventListener('resize', onResize)

    return () => {
      links.forEach((elem) => elem.removeEventListener('click', onClick))
      window.removeEventListener('resize', onResize)
      lenis?.destroy()
      lenis = null
    }
  }, [pathname])

  const initials =
    profile.developer?.fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('') || 'AM'

  return (
    <>
      <div className="header">
        <Link href="/" className="navbar-title" data-cursor="disable">
          {initials}
        </Link>
        <a
          href={`mailto:${profile.social?.email}`}
          className="navbar-connect"
          data-cursor="disable"
        >
          {profile.social?.email}
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1" />
      <div className="landing-circle2" />
      <div className="nav-fade" />
    </>
  )
}
