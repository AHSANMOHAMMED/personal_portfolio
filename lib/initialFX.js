import { TextSplitter } from '@/lib/textSplitter'
import { gsap } from '@/lib/gsap'
import { lenis } from '@/components/ui/Navbar'

export function initialFX() {
  window.scrollTo(0, 0)
  document.body.style.overflowY = 'auto'
  document.documentElement.style.overflowY = 'auto'
  if (lenis) {
    lenis.scrollTo(0, { immediate: true })
    lenis.start()
  }
  document.getElementsByTagName('main')[0]?.classList.add('main-active')
  gsap.to('body', {
    backgroundColor: '#0b080c',
    duration: 0.5,
    delay: 1,
  })

  // Skip char-splitting on phones — it collapses "Software Engineer" and
  // fights the stacked mobile hero layout.
  const isMobileHero = window.matchMedia('(max-width: 1024px)').matches
  if (!isMobileHero) {
    const selectors = [
      '.landing-info h3',
      '.landing-intro h2',
      '.landing-intro h1',
      '.landing-h2-1',
      '.landing-h2-info',
    ]
    const elements = selectors.flatMap((selector) =>
      Array.from(document.querySelectorAll(selector)),
    )
    const landingText = new TextSplitter(elements, {
      type: 'chars',
    })
    gsap.fromTo(
      landingText.chars,
      { opacity: 0, y: 80, filter: 'blur(5px)' },
      {
        opacity: 1,
        duration: 1.2,
        filter: 'blur(0px)',
        ease: 'power3.inOut',
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      },
    )
  } else {
    gsap.fromTo(
      ['.landing-intro', '.mobile-photo', '.landing-info'],
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.12,
        delay: 0.15,
      },
    )
  }

  gsap.fromTo(
    ['.header', '.icons-section', '.nav-fade'],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: 'power1.inOut',
      delay: 0.1,
    },
  )
}
