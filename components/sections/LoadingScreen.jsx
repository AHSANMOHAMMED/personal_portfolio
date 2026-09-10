'use client'

import { useEffect, useState } from 'react'
import { useLoading } from '@/context/LoadingProvider'
import profile from '@/data/profile.json'

export default function LoadingScreen({ percent }) {
  const { setIsLoading } = useLoading()
  const [loaded, setLoaded] = useState(false)
  const [clicked, setClicked] = useState(false)

  const title =
    profile.developer?.fullName ||
    profile.developer?.name ||
    'Ahsan Mohammed'
  const role =
    profile.developer?.title || 'Full-Stack Software Engineer'

  useEffect(() => {
    if (percent < 100 || loaded) return
    const t1 = setTimeout(() => setLoaded(true), 400)
    return () => clearTimeout(t1)
  }, [percent, loaded])

  const enterSite = () => {
    if (percent < 100 && !loaded) return
    if (clicked) return
    setClicked(true)
    window.scrollTo(0, 0)
    import('@/lib/initialFX').then((module) => {
      setTimeout(() => {
        window.scrollTo(0, 0)
        if (module.initialFX) module.initialFX()
        setIsLoading(false)
      }, 700)
    })
  }

  // Auto-enter shortly after Welcome is ready (still clickable)
  useEffect(() => {
    if (!loaded && percent < 100) return
    if (!loaded && percent >= 100) setLoaded(true)
    if (!(loaded || percent >= 100)) return
    const t = setTimeout(enterSite, 1200)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, percent])

  function handleMouseMove(e) {
    const { currentTarget: target } = e
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    target.style.setProperty('--mouse-x', `${x}px`)
    target.style.setProperty('--mouse-y', `${y}px`)
  }

  const marqueeItems = [role, 'Full Stack Developer', role, 'Full Stack Developer']

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          {title.replace(/\s+/g, '')}
        </a>
        <div className={`loaderGame ${clicked ? 'loader-out' : ''}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index} />
              ))}
            </div>
            <div className="loaderGame-ball" />
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <div className="loading-marquee-track">
            {[...marqueeItems, ...marqueeItems].map((text, i) => (
              <span key={`${text}-${i}`}>&nbsp; {text} &nbsp;</span>
            ))}
          </div>
        </div>
        <div
          className={`loading-wrap ${clicked ? 'loading-clicked' : ''}`}
          onMouseMove={handleMouseMove}
          onClick={enterSite}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') enterSite()
          }}
        >
          <div className="loading-hover" />
          <div className={`loading-button ${loaded ? 'loading-complete' : ''}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{Math.min(100, Math.round(percent))}%</span>
                </div>
              </div>
              <div className="loading-box" />
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
