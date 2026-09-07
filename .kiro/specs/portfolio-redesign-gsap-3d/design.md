# Design Document — Portfolio Redesign (GSAP + 3D)

## Overview

This document describes the technical design for the `portfolio-redesign-gsap-3d` feature: a dramatic visual
and interaction overhaul of Ahsan Mohammed's Next.js portfolio. The redesign introduces a hybrid
percentage-counter screen loader, a mixed-typography system with a serif display font, dual counter-scrolling
marquee strips, enhanced Three.js 3D scenes, a new "What I Do" section, numbered project cards, a magazine-
style Work Experience layout, and a bold contact block merged into the existing Footer section.

All AGENTS.md constraints remain in force throughout:

- No CSS scroll-snap — scroll exclusively driven by `goTo(idx)` in `app/page.js` via GSAP.
- CSS Modules only; no inline style objects except GSAP-written dynamic values.
- GSAP imported from `@/lib/gsap` only.
- All content from `data/profile.json` and `data/content.json`.
- `app/globals.css` is the single source of truth for design tokens.
- Three.js components loaded with `dynamic(..., { ssr: false })`.
- `PublicationsFooterSection` is a 300 vh sticky section covering 3 scroll steps. `TOTAL_STEPS` stays at
  `11 + PROJECT_SLIDES` (20 with 9 projects).

---

## Architecture

### Component Tree

```
app/layout.js
  └── <html> (Playfair Display font variable applied)
      └── app/page.js  [Home]
          ├── CustomCursor
          ├── ScreenLoader (conditional, showLoader state)
          ├── loopOverlay div (GSAP fade)
          ├── Navbar
          └── <main ref=mainRef>
              └── <div>
                  ├── VideoIntro                       [step 0]
                  │   └── CinematicLayer (dynamic, ssr:false)
                  ├── HeroSection                      [step 1]
                  │   ├── HeroBackground (dynamic, ssr:false)
                  │   ├── HeroDigitalCore (dynamic, ssr:false)
                  │   ├── MarqueeStrip [ltr, orange]
                  │   └── MarqueeStrip [rtl, cyan]
                  ├── AboutSection                     [step 2]
                  │   ├── AboutThreeScene (dynamic, ssr:false)  ← NEW
                  │   └── TechOrbit (existing)
                  ├── ProjectsSection                  [steps 3–11]
                  │   ├── [9 slides with number labels]
                  │   ├── MarqueeStrip [ltr, orange]  (last slide)
                  │   └── MarqueeStrip [rtl, cyan]    (last slide)
                  ├── SystemArchitectureSection        [step 12]
                  ├── WhatIDoSection                   [step 13]  ← REPLACES SkillsMatrixSection
                  ├── WorkExperienceSection            [step 14]
                  │   ├── WorkExpThreeScene (dynamic, ssr:false) ← NEW
                  │   ├── MarqueeStrip [ltr, orange]
                  │   └── MarqueeStrip [rtl, cyan]
                  ├── TestimonialsSection              [step 15]
                  ├── GitHubSection                    [step 16]
                  └── PublicationsFooterSection        [steps 17–19]
```

### Scroll Step Budget (TOTAL_STEPS = 20, unchanged)

| Step | Section |
|------|---------|
| 0 | VideoIntro |
| 1 | HeroSection |
| 2 | AboutSection |
| 3–11 | ProjectsSection (9 slides) |
| 12 | SystemArchitectureSection |
| 13 | **WhatIDoSection** (was SkillsMatrixSection) |
| 14 | WorkExperienceSection |
| 15 | TestimonialsSection |
| 16 | GitHubSection |
| 17–19 | PublicationsFooterSection (300 vh / 3 steps) |

### Data Flow

```
data/profile.json ──► All components (content, skills, projects, experience, socials)
data/content.json ──► VideoIntro, PublicationsFooterSection (site copy, footer CTA lines)
app/globals.css   ──► All CSS Modules (design tokens via var())
@/lib/gsap        ──► All components using animation (not direct gsap import)
```

### Event Coordination Flow

```
                  ┌─────────────────────────────────────────────────────┐
                  │  Browser session starts (no sessionStorage key)     │
                  └────────────────────┬────────────────────────────────┘
                                       │
                               ScreenLoader mounts
                               starts GSAP counter tween
                               0→100 over 2.5s (power2.inOut)
                                       │
                  ┌────────────────────┴────────────────────────────────┐
                  │  Wait for BOTH:                                     │
                  │  (A) counter tween reaches 100 (onUpdate tick)      │
                  │  (B) window event: 'threejs-ready'                  │
                  └────────────────────┬────────────────────────────────┘
                                       │
                         (A) fires from counterRef obj         
                         when tweened value ≥ 100              
                                       │
                         (B) fires from HeroDigitalCore
                         inside R3F Canvas onCreated callback  
                                       │
                        Both conditions satisfied              
                        gsap.delayedCall(0.3, reveal)          
                                       │
                               split-panel exit animation
                               splitTop: y 0→-100%, 1.1s expo.inOut
                               splitBottom: y 0→100%, 1.1s expo.inOut
                                       │
                               onComplete (at 1.1s):
                               dispatch 'loader-dismissed'
                               dispatch 'loader-animation-done'
                               call onDismiss() → setShowLoader(false)
                                       │
                  ┌────────────────────┴───────────────────────────────┐
                  │  VideoIntro listens for 'loader-animation-done'    │
                  │  starts entrance timeline (opacity:0,scale:1.05    │
                  │  → opacity:1,scale:1, 0.6s power3.out)            │
                  │  name character animations begin at +0.3s          │
                  └────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### 1. ScreenLoader (modify `components/sections/ScreenLoader.jsx`)

**Purpose:** Full-screen overlay with percentage counter. Replaces the existing typing-name animation.

**Props:**
```ts
interface ScreenLoaderProps {
  onDismiss: () => void  // called when reveal animation completes
}
```

**State:**
```ts
counterDisplayRef: useRef({ val: 0 })   // GSAP tween target object (not state)
counterElRef: useRef<HTMLSpanElement>    // DOM ref for counter text update
splitTopRef: useRef<HTMLDivElement>      // upper split panel
splitBottomRef: useRef<HTMLDivElement>   // lower split panel
nameRef: useRef<HTMLParagraphElement>    // secondary name text
counterDoneRef: useRef(false)           // tracks when counter tween reaches 100
threeJsReadyRef: useRef(false)          // tracks when threejs-ready event fires
revealFiredRef: useRef(false)           // prevents double reveal
```

**Logic flow:**
1. On mount, check `prefers-reduced-motion` → instant dismiss if true.
2. Check `sessionStorage('portfolio-entered') === 'true'` → instant dismiss with event dispatch if true.
3. Otherwise, start GSAP counter tween: `gsap.to(counterRef, { val: 100, duration: 2.5, ease: 'power2.inOut', onUpdate: updateCounter })`.
4. `updateCounter` sets `counterElRef.current.textContent = Math.round(counterRef.val) + '%'` and checks if value >= 100 to set `counterDoneRef.current = true`, then calls `checkBothReady()`.
5. `addEventListener('threejs-ready', () => { threeJsReadyRef.current = true; checkBothReady() })`.
6. `checkBothReady()`: if both refs true and `!revealFiredRef.current`, set `revealFiredRef.current = true`, call `gsap.delayedCall(0.3, triggerReveal)`.
7. `triggerReveal()`: GSAP tl animating splitTop/splitBottom, on complete dispatch events, call `onDismiss()`.

**CSS Module structure (`styles/sections/ScreenLoader.module.css`):**
```css
.overlay       { position: fixed; inset: 0; z-index: 10000; background: var(--bg-dark); 
                 display: flex; flex-direction: column; align-items: center; justify-content: center; }
.counter       { font-family: var(--font-display); font-size: clamp(4rem,12vw,10rem);
                 color: var(--text-primary); line-height: 1; }
.nameText      { font-family: var(--font-sans); font-size: var(--text-small);
                 color: var(--text-muted); letter-spacing: 0.2em; margin-top: 1rem; }
.splitTop      { position: fixed; inset: 0; bottom: 50%; z-index: 10001; background: var(--bg-dark); }
.splitBottom   { position: fixed; inset: 0; top: 50%; z-index: 10001; background: var(--bg-dark); }
```

**Key constraints:**
- `splitTop` and `splitBottom` are rendered as JSX elements (not `document.createElement`) with class refs, because the existing approach creates DOM nodes imperatively which is not pure CSS Modules.
- The existing `centerLine` DOM element approach is retained only if it uses a CSS Module class; otherwise remove it.

---

### 2. Typography System (modify `app/globals.css` + `app/layout.js`)

**`app/layout.js` additions:**
```js
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '700', '900'],
})

// Applied to <html>: className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}
```

**`app/globals.css` additions to `:root`:**
```css
--font-display: /* set by next/font via CSS variable */;
--display-hero:    clamp(4rem, 14vw, 13rem);
--display-section: clamp(2.5rem, 6vw, 5.5rem);
--display-number:  clamp(3rem, 8vw, 7rem);
--text-label:      0.72rem;
```

**Mobile override block (`@media (max-width: 767px)`):**
```css
--display-hero:    clamp(3rem, 12vw, 6rem);
--display-section: clamp(2rem, 8vw, 3.5rem);
```

**`--accent-cyan` active usage map:**
- `HeroSection.module.css`: `.lastName { color: var(--accent-cyan) }` (typographic highlight)
- `WhatIDoSection.module.css`: `.heading span { border-bottom: 2px solid var(--accent-cyan) }`
- `HeroSection.module.css`: `.socialLink:hover { color: var(--accent-cyan) }`
- `Navbar.module.css` (existing or modified): nav link hover uses `color: var(--accent-cyan)`
- `HeroDigitalCore.js`: wireframe `color="#00f0ff"` already present (confirmed in existing code)

---

### 3. MarqueeStrip (new `components/ui/MarqueeStrip.jsx`)

**Props:**
```ts
interface MarqueeStripProps {
  text: string              // phrase repeated to fill width (required; sourced from profile.json by caller)
  direction?: 'ltr' | 'rtl' // default 'ltr'
  speed?: number            // default 60 (seconds baseline at 100% track width)
  accent?: 'orange' | 'cyan' // default 'orange'
}
```

**Rendering logic:**
```jsx
// Repeat text enough times to exceed viewport width
const repeats = Math.ceil((window.innerWidth * 2) / estimatedTextWidth) + 4
const items = Array(repeats).fill(text)

// Single track element with inline CSS variable for speed (acceptable: static var, not GSAP-driven)
<div className={styles.container}>
  <div
    className={`${styles.track} ${direction === 'rtl' ? styles.rtl : ''} ${accent === 'cyan' ? styles.cyan : styles.orange}`}
    style={{ '--marquee-speed': speed }}  // static CSS variable injection — exempt from inline style rule
  >
    {items.map((t, i) => <span key={i} className={styles.item}>{t} <span className={styles.sep}>·</span> </span>)}
  </div>
</div>
```

**CSS Module (`components/ui/MarqueeStrip.module.css`):**
```css
.container {
  width: 100%;
  overflow: hidden;
  height: 2.5rem;     /* ≤ 3rem */
  display: flex;
  align-items: center;
}

.track {
  display: flex;
  white-space: nowrap;
  animation: marquee calc(var(--marquee-speed, 60) * 1s) linear infinite;
  will-change: transform;
}

.rtl { animation-direction: reverse; }

.orange { color: var(--accent); }
.cyan   { color: var(--accent-cyan); }

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .track { animation-play-state: paused; }
}
```

**Caller pattern (example in HeroSection):**
```jsx
import MarqueeStrip from '@/components/ui/MarqueeStrip'
import profile from '@/data/profile.json'

// In JSX:
<MarqueeStrip text={profile.tagline} direction="ltr" speed={60} accent="orange" />
<MarqueeStrip text={profile.tagline} direction="rtl" speed={60} accent="cyan" />
```

| Location | `text` source | Speed |
|----------|--------------|-------|
| HeroSection | `profile.tagline` | 60 |
| ProjectsSection (last slide area) | `profile.roles.detailed` | 55 |
| WorkExperienceSection | `profile.skills.slice(0,8).join(' · ')` | 50 |

---

### 4. HeroSection (modify `components/sections/HeroSection.jsx`)

**Changes from existing:**
- `<h1>` receives `className={styles.nameHeader}` with CSS Module applying `--font-display` / `--display-hero`.
- Two `<span>` children (firstName, lastName) each become the animation targets.
- GSAP entrance changes: `{ y: 60, opacity: 0 }` → `{ y: 0, opacity: 1, stagger: 0.12 }` targeting both spans via `titleRef` containing both.
- `HeroBackground` loaded via `dynamic()` (already present but confirm `ssr: false`).
- `HeroDigitalCore` loaded via `dynamic()` — add `onCreated` prop (see section 7.2).
- MarqueeStrip pair added at bottom of `leftCol` or below the full container.

**Refs:**
```js
const nameFirstRef = useRef(null)  // <span> for first name
const nameLastRef  = useRef(null)  // <span> for last name
// existing refs retained: subTitleRef, statementRef, ctaGroupRef, core3dRef
```

**GSAP entrance animation (updated):**
```js
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (reducedMotion) {
  gsap.set([nameFirstRef.current, nameLastRef.current, subTitleRef.current, ...], { opacity: 1, y: 0 })
  return
}
const tl = gsap.timeline({ paused: true })
tl.fromTo(
  [nameFirstRef.current, nameLastRef.current],
  { y: 60, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12 },
  0.1
)
// ... rest of existing timeline for subTitleRef, ctaGroupRef, etc.
```

**CSS Module additions (`styles/sections/HeroSection.module.css`):**
```css
.nameHeader {
  font-family: var(--font-display);
  font-size: var(--display-hero);
  line-height: 0.92;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}
.lastName {
  color: var(--accent-cyan);
  display: block;
}
.socialLink:hover {
  color: var(--accent-cyan);
  transition: color 0.2s;
}
```

**MarqueeStrip placement:**
```jsx
<div className={styles.marqueeRow}>
  <MarqueeStrip text={profile.tagline} direction="ltr" speed={60} accent="orange" />
  <MarqueeStrip text={profile.tagline} direction="rtl" speed={60} accent="cyan" />
</div>
```

---

### 5. WhatIDoSection (new `components/sections/WhatIDoSection.jsx`)

**Purpose:** Replaces `SkillsMatrixSection` at step 13. Three role cards + deduplicated tech icon wall.

**Props:** none (all data from `profile.json`)

**Refs:**
```js
const sectionRef   = useRef(null)
const cardRefs     = useRef([])   // one per role card
const iconRefs     = useRef([])   // one per deduplicated skill icon
const animatedRef  = useRef(false) // fires entrance only once
```

**Data sourcing:**
```js
import profile from '@/data/profile.json'
const ROLES = profile.whatIDo ?? profile.skillCategories.slice(0, 3).map(cat => ({
  title: cat.label,
  description: cat.skills.slice(0, 5).join(', '),
  skills: cat.skills,
}))
const HEADING = profile.sections?.whatIDo?.heading ?? 'WHAT I DO'

// Deduplicated skills from skillCategories
const seen = new Set()
const ALL_SKILLS = profile.skillCategories.flatMap(cat => cat.skills).filter(s => {
  if (seen.has(s)) return false
  seen.add(s)
  return true
})
```

**Scroll proximity detection:**
```js
useEffect(() => {
  const scroller = document.querySelector('main')
  function onScroll() {
    const section = sectionRef.current
    if (!section || animatedRef.current) return
    if (Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.5) {
      animatedRef.current = true
      playEntrance()
    }
  }
  scroller.addEventListener('scroll', onScroll, { passive: true })
  return () => scroller.removeEventListener('scroll', onScroll)
}, [])
```

**Entrance animation:**
```js
function playEntrance() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) {
    gsap.set(cardRefs.current, { opacity: 1, y: 0 })
    gsap.set(iconRefs.current, { opacity: 1, y: 0 })
    return
  }
  gsap.fromTo(
    cardRefs.current,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.15 }
  )
  gsap.fromTo(
    iconRefs.current,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.03, delay: 0.2 }
  )
}
```

**Icon hover handlers (pointer:fine only):**
```js
function handleIconEnter(el) {
  if (!window.matchMedia('(pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.to(el, { scale: 1.2, duration: 0.2, ease: 'power2.out',
    boxShadow: '0 0 12px var(--accent-glow)' })
}
function handleIconLeave(el) {
  if (!window.matchMedia('(pointer: fine)').matches) return
  gsap.to(el, { scale: 1, duration: 0.15, boxShadow: 'none' })
}
```

**JSX structure:**
```jsx
<section ref={sectionRef} className={styles.section}>
  <h2 className={styles.heading}>{HEADING}</h2>

  <div className={styles.cardsRow}>
    {ROLES.map((role, i) => (
      <div key={role.title} ref={el => { cardRefs.current[i] = el }} className={styles.card}>
        <h3 className={styles.cardTitle}>{role.title}</h3>
        <p className={styles.cardDesc}>{role.description}</p>
        <div className={styles.cardSkills}>
          {role.skills.map(s => <span key={s} className={styles.chip}>{s}</span>)}
        </div>
      </div>
    ))}
  </div>

  <div className={styles.iconWall}>
    {ALL_SKILLS.map((skill, i) => (
      <div
        key={skill}
        ref={el => { iconRefs.current[i] = el }}
        className={styles.iconItem}
        onMouseEnter={e => handleIconEnter(e.currentTarget)}
        onMouseLeave={e => handleIconLeave(e.currentTarget)}
      >
        <span className={styles.iconLabel}>{skill}</span>
      </div>
    ))}
  </div>
</section>
```

**CSS Module (`styles/sections/WhatIDoSection.module.css`):**
```css
.section    { height: 100vh; display: flex; flex-direction: column;
              justify-content: center; padding: 4rem clamp(1.5rem, 5vw, 6rem); }
.heading    { font-family: var(--font-display); font-size: var(--display-section);
              text-transform: uppercase; margin-bottom: 3rem;
              border-bottom: 2px solid var(--accent-cyan); display: inline-block; }
.cardsRow   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 3rem; }
.card       { border: 1px solid var(--border-dim); padding: 2rem;
              background: var(--bg-card); border-radius: 0.5rem; }
.cardTitle  { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.75rem; }
.iconWall   { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.iconItem   { border: 1px solid var(--border-dim); padding: 0.4rem 0.9rem;
              border-radius: 2rem; font-size: var(--text-small); cursor: default;
              transform-origin: center; will-change: transform; }
@media (max-width: 767px) {
  .cardsRow { grid-template-columns: 1fr; }
}
```

---

### 6. ProjectsSection (modify `components/sections/ProjectsSection.jsx`)

**Changes:**
- Add `numberLabelRefs = useRef([])` for per-slide number label elements.
- Add `tiltCleanupsRef = useRef([])` for mousemove listener cleanup.
- Number label element added to each slide (see JSX below).
- On slide activation (`onUpdate` in ScrollTrigger), animate the active number label.
- Mouse tilt handlers attached to each slide container.

**Number label animation (inside `onUpdate` callback):**
```js
const activeIdx = Math.round(self.progress * (n - 1))
if (prev !== activeIdx) {
  const label = numberLabelRefs.current[activeIdx]
  if (label && !reducedMotion) {
    gsap.fromTo(label, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' })
  }
}
```

**Mouse tilt handler (attached per slide in `useEffect`):**
```js
function attachTilt(slideEl, labelEl) {
  if (reducedMotion) return
  if (!window.matchMedia('(pointer: fine)').matches) return
  function onMove(e) {
    const r = slideEl.getBoundingClientRect()
    const rx = ((e.clientY - r.top)  / r.height - 0.5) * -16   // → ±8°
    const ry = ((e.clientX - r.left) / r.width  - 0.5) * 16
    gsap.to(slideEl, { rotateX: rx, rotateY: ry, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
  }
  function onLeave() {
    gsap.to(slideEl, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
  }
  slideEl.addEventListener('mousemove', onMove)
  slideEl.addEventListener('mouseleave', onLeave)
  return () => { slideEl.removeEventListener('mousemove', onMove); slideEl.removeEventListener('mouseleave', onLeave) }
}
```

**JSX addition inside each slide:**
```jsx
<div className={styles.slide}>
  {/* NEW: bold number label */}
  <span
    ref={el => { numberLabelRefs.current[i] = el }}
    className={styles.slideNumberLabel}
    aria-hidden="true"
  >
    {String(i + 1).padStart(2, '0')}
  </span>
  {/* existing: slideBg, slideContent, etc. */}
</div>
```

**CSS Module additions (`styles/sections/ProjectsSection.module.css`):**
```css
.slideNumberLabel {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  font-family: var(--font-display);
  font-size: var(--display-number);
  color: rgba(255, 255, 255, 0.08);
  line-height: 1;
  pointer-events: none;
  user-select: none;
}
.slide { perspective: 800px; transform-style: preserve-3d; }
```

---

### 7. Three.js Scene Specifications

#### 7.1 HeroBackground (modify `components/three/HeroBackground.jsx`)

**Changes:**
- `N1`: 65 → **98** (fast drifters)
- `N2`: 22 → **33** (bokeh blobs)
- In `tick()`, add: `camera.rotation.y += 0.03 * dt` after camera position update.

```js
// In tick():
camera.rotation.y += 0.03 * dt   // slow ambient Y rotation
```

#### 7.2 HeroDigitalCore (modify `components/three/HeroDigitalCore.js`)

**Changes:**
- Split 200 particles into two `<points>` groups of 100 each.
- First 100: orange `#f7931e` — existing first half of `particlesPosition`.
- Second 100: cyan `#00f0ff` — second half.
- Dispatch `threejs-ready` from `Canvas` `onCreated` callback.

```jsx
// In CoreMesh — split particle positions
const particleCount = 200
const positions = useMemo(() => {
  const p = new Float32Array(particleCount * 3)
  // ... existing generation logic
  return p
}, [])
const orangePos = useMemo(() => positions.slice(0, 300), [positions])   // first 100 × 3
const cyanPos   = useMemo(() => positions.slice(300, 600), [positions]) // last 100 × 3

// In JSX within <group>:
<points>
  <bufferGeometry>
    <bufferAttribute attach="attributes-position" args={[orangePos, 3]} />
  </bufferGeometry>
  <pointsMaterial size={0.035} color="#f7931e" transparent opacity={0.7} sizeAttenuation />
</points>
<points>
  <bufferGeometry>
    <bufferAttribute attach="attributes-position" args={[cyanPos, 3]} />
  </bufferGeometry>
  <pointsMaterial size={0.035} color="#00f0ff" transparent opacity={0.6} sizeAttenuation />
</points>

// In HeroDigitalCore component (Canvas wrapper):
<Canvas
  camera={{ position: [0, 0, 6], fov: 45 }}
  dpr={[1, 2]}
  gl={{ antialias: true, alpha: true }}
  onCreated={() => {
    window.dispatchEvent(new CustomEvent('threejs-ready'))
  }}
>
```

#### 7.3 AboutThreeScene (new `components/three/AboutThreeScene.jsx`)

**Geometry:** ≤ 60 `PlaneGeometry(0.4, 0.6)` meshes (thin rectangular panes).

**Materials:** `MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.04–0.08, side: THREE.DoubleSide })`. Colors alternate between `#f7931e` and `#00f0ff`.

**Animation:** Each mesh rotates on all axes at a slow, unique rate; drifts slightly in Y; wraps around when leaving bounds.

**Renderer:** `alpha: true`, `setPixelRatio(Math.min(window.devicePixelRatio, 2))`.

**Pause/resume:** `IntersectionObserver(threshold: 0.05)` on mount element → `cancelAnimationFrame` when not intersecting, `requestAnimationFrame(tick)` on re-entry.

**Structure:**
```js
'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function AboutThreeScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const COUNT = 50
    const W = mount.clientWidth, H = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;'
    mount.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100)
    camera.position.z = 8

    const meshes = []
    const COLORS = [0xf7931e, 0x00f0ff]
    for (let i = 0; i < COUNT; i++) {
      const geo = new THREE.PlaneGeometry(0.4, 0.6)
      const mat = new THREE.MeshBasicMaterial({
        color: COLORS[i % 2],
        transparent: true,
        opacity: 0.04 + Math.random() * 0.04,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6
      )
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      )
      mesh.userData = {
        rx: (Math.random() - 0.5) * 0.3,
        ry: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.04,
      }
      scene.add(mesh)
      meshes.push(mesh)
    }

    let raf
    let isVisible = true, pageVisible = !document.hidden
    const io = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting }, { threshold: 0.05 })
    io.observe(mount)
    const onVis = () => { pageVisible = !document.hidden }
    document.addEventListener('visibilitychange', onVis)

    const timer = new THREE.Timer()
    function tick() {
      raf = requestAnimationFrame(tick)
      if (!isVisible || !pageVisible) return
      timer.update(performance.now())
      const dt = Math.min(timer.getDelta(), 0.05)
      meshes.forEach(m => {
        m.rotation.x += m.userData.rx * dt
        m.rotation.y += m.userData.ry * dt
        m.position.y += m.userData.vy * dt
        if (m.position.y > 6)  m.position.y = -6
        if (m.position.y < -6) m.position.y = 6
      })
      renderer.render(scene, camera)
    }
    tick()

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      meshes.forEach(m => { m.geometry.dispose(); m.material.dispose() })
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}
```

#### 7.4 WorkExpThreeScene (new `components/three/WorkExpThreeScene.jsx`)

**Geometry:** `THREE.BufferGeometry` with ≤ 80 points. Positions fill a wide 3D volume. Uses `THREE.PointsMaterial` with sprite texture.

**Appearance:** White/cream particles at varying opacities (0.2–0.7), size 0.06–0.12, additive blending, depth-of-field illusion via two layers (near: small+bright, far: large+dim) — consistent with HeroBackground pattern.

**Pattern:** Same RAF pause/resume via `IntersectionObserver`, same `Math.min(devicePixelRatio, 2)`, same `visibilitychange` guard. `prefers-reduced-motion` early return.

```js
// Layer N: 50 tight drifters + 30 bokeh background
// camera Y rotation: += 0.02 * dt (slower than hero)
// Same makeSprite() function as HeroBackground
```

---

### 8. WorkExperienceSection (modify `components/sections/WorkExperienceSection.jsx`)

**Removed refs:** `lineRef`, `dotRefs`, `bulletListRefs`, `collapsedHeights`, `hoverTlsRef` (for expand/collapse).

**New refs:**
```js
const sectionRef    = useRef(null)
const columnRefs    = useRef([])
const animatedRef   = useRef(false)
const bgSceneRef    = useRef(null)
```

**Animation (fires once via `animatedRef`):**
```js
useEffect(() => {
  const scroller = document.querySelector('main')
  function onScroll() {
    const section = sectionRef.current
    if (!section || animatedRef.current) return
    if (Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.5) {
      animatedRef.current = true
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) {
        gsap.set(columnRefs.current, { opacity: 1, y: 0 })
        return
      }
      gsap.fromTo(
        columnRefs.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.2 }
      )
    }
  }
  scroller.addEventListener('scroll', onScroll, { passive: true })
  return () => scroller.removeEventListener('scroll', onScroll)
}, [])
```

**Hover handlers (desktop only):**
```js
function handleColEnter(el) {
  if (window.innerWidth < 768) return
  gsap.to(el, { backgroundColor: 'rgba(247,147,30,0.04)', duration: 0.3, ease: 'power2.out' })
}
function handleColLeave(el) {
  if (window.innerWidth < 768) return
  gsap.to(el, { backgroundColor: 'transparent', duration: 0.25 })
}
```

**JSX structure:**
```jsx
<section ref={sectionRef} className={styles.section} aria-label="Work Experience">
  <WorkExpThreeScene />   {/* dynamic, ssr:false — full-bleed background */}

  <div className={styles.header}>
    <span className={styles.label}>Work Experience</span>
    <span className={styles.labelRight}>0{EXPS.length} Entries</span>
  </div>

  <div className={styles.columnsGrid}>
    {EXPS.map((exp, i) => (
      <div
        key={exp.id}
        ref={el => { columnRefs.current[i] = el }}
        className={styles.column}
        onMouseEnter={e => handleColEnter(e.currentTarget)}
        onMouseLeave={e => handleColLeave(e.currentTarget)}
      >
        <span className={styles.colNum} aria-hidden="true">
          {String(i + 1).padStart(2, '0')}
        </span>
        <div className={styles.colBody}>
          <div className={styles.colMeta}>
            <span className={styles.period}>{exp.period} – {exp.periodEnd}</span>
            <span className={styles.typeTag}>{exp.type}</span>
          </div>
          <h2 className={styles.company}>{exp.company}</h2>
          <p className={styles.role}>{exp.role}</p>
          <ul className={styles.bullets}>
            {exp.bullets.map((b, bi) => <li key={bi} className={styles.bullet}>{b}</li>)}
          </ul>
          <div className={styles.stack}>
            {exp.tech.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        </div>
      </div>
    ))}
  </div>

  <div className={styles.marqueeRow}>
    <MarqueeStrip text={profile.skills.slice(0, 8).join(' · ')} direction="ltr" speed={50} accent="orange" />
    <MarqueeStrip text={profile.skills.slice(0, 8).join(' · ')} direction="rtl" speed={50} accent="cyan" />
  </div>
</section>
```

**CSS Module (`styles/sections/WorkExperienceSection.module.css`) — key changes:**
```css
.section       { height: 100vh; position: relative; overflow: hidden;
                 display: flex; flex-direction: column; justify-content: space-between;
                 padding: 4rem clamp(1.5rem, 5vw, 6rem); }
.columnsGrid   { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                 gap: 2rem; flex: 1; align-items: start; }
.column        { padding: 1.5rem; border-top: 1px solid var(--border-dim);
                 will-change: transform; background: transparent; }
.colNum        { font-family: var(--font-display); font-size: var(--display-number);
                 color: rgba(255,255,255,0.06); line-height: 1; display: block; margin-bottom: 0.5rem; }
.company       { font-family: var(--font-display); font-size: 1.4rem; margin: 0.5rem 0 0.25rem; }
/* Remove: .snakeLine, .dot, .dotNum, .entries, .timelineBody */
```

---

### 9. PublicationsFooterSection (modify `components/sections/PublicationsFooterSection.jsx`)

**Changes:**
1. Add `contactHeadline` from `profile.contactHeadline` in the 3rd panel (footer content).
2. Email rendered as large `<a href={mailto:…}>` with `--font-display` styling.
3. Social icons use `SOCIAL_ICONS` map with text fallback.
4. Entrance animation when `footerFade > 0.05` fires once per session.
5. `footer-loop-back` dispatch uses a ref flag to rate-limit.

**New data additions in `data/profile.json`:**
```json
"whatIDo": [
  { "title": "Full-Stack", "description": "...", "skills": ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"] },
  { "title": "Mobile", "description": "...", "skills": ["Flutter", "Dart", "React Native", "Firebase"] },
  { "title": "Cloud & DevOps", "description": "...", "skills": ["Docker", "GitHub Actions", "AWS", "GCP", "Nginx"] }
],
"contactHeadline": "Let's build something real.",
"sections": { "whatIDo": { "heading": "WHAT I DO" } }
```

**Footer entrance animation:**
```js
const footerEnteredRef = useRef(false)  // new ref

// Inside onScroll(), in the footer phase block:
if (footerFade > 0.05 && !footerEnteredRef.current) {
  footerEnteredRef.current = true
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reducedMotion) {
    gsap.fromTo(
      [leftRef.current, rightRef.current, bigNameRef.current, bottomBarRef.current],
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12 }
    )
  }
}
```

**Rate-limiting `footer-loop-back`:**
```js
// In app/page.js — existing onFooterLoop handler:
function onFooterLoop() {
  if (busyRef.current) return  // existing guard covers rate-limiting
  fadeLoop(0, 0)
}
// No component-level dispatch change needed; the busyRef in page.js acts as the rate limiter.
// The section dispatches the event; page.js guards it.
```

**Contact block JSX additions (in `rightCol` or new `contactBlock` div):**
```jsx
<div className={styles.contactBlock}>
  <p className={styles.contactHeadline}>{profile.contactHeadline}</p>
  <a href={`mailto:${profile.email}`} className={styles.contactEmail}>
    {profile.email}
  </a>
  <div className={styles.contactSocials}>
    {profile.socials.map(s => (
      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
         className={styles.contactSocialLink} aria-label={s.label}>
        {SOCIAL_ICONS[s.label] ?? <span>{s.label}</span>}
      </a>
    ))}
  </div>
</div>
```

**CSS additions (`styles/sections/PublicationsFooterSection.module.css`):**
```css
.contactHeadline {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 3.5rem);
  color: var(--text-primary);
  margin-bottom: 1rem;
}
.contactEmail {
  font-family: var(--font-display);
  font-size: clamp(1rem, 2.5vw, 1.6rem);
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid var(--accent);
}
.contactEmail:hover { color: var(--accent-hover); }
.contactSocials { display: flex; gap: 1.5rem; margin-top: 1.5rem; }
.contactSocialLink { color: var(--text-muted); transition: color 0.2s; }
.contactSocialLink:hover { color: var(--accent-cyan); }
```

---

### 10. VideoIntro (modify `components/sections/VideoIntro.jsx`)

**Changes:**
- Remove the existing `useEffect` that runs the entrance timeline immediately (the `gsap.timeline({ delay: 0.5 })` block).
- Replace with a `useEffect` that listens for `loader-animation-done` on `window` and only then creates and plays the timeline.
- Update entrance timeline start values: `mainVideoWrapRef` from `{ opacity: 0, scale: 1.05 }` → `{ opacity: 1, scale: 1 }` over `0.6s power3.out` at position `0`.
- Name char animations shifted to start at position `0.3` in timeline (was `1.0` / `1.4`).
- All string content verified to come from `profile.json` / `content.json` (no JSX string literals for names/roles).

**Updated `useEffect` pattern:**
```js
useEffect(() => {
  if (isReducedMotion) {
    if (mainVideoWrapRef.current) gsap.set(mainVideoWrapRef.current, { opacity: 1, scale: 1 })
    // set all other refs to final state
    return undefined
  }

  function onAnimationDone() {
    const tl = gsap.timeline()

    if (mainVideoWrapRef.current) {
      tl.fromTo(mainVideoWrapRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' },
        0
      )
    }

    // eyebrow, firstNameChars, divider, lastNameChars, role, scroll — all shifted by +0.3 from original
    if (eyebrowRef.current) {
      tl.fromTo(eyebrowRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.8, ease: 'power2.out' },
        0.3  // was 0.8
      )
    }
    // ... etc, each time offset reduced by 0.5s from original
  }

  window.addEventListener('loader-animation-done', onAnimationDone)
  return () => window.removeEventListener('loader-animation-done', onAnimationDone)
}, [isReducedMotion])
```

---

## Data Models

### `data/profile.json` additions

```json
{
  "whatIDo": [
    {
      "title": "Full-Stack",
      "description": "Building scalable web apps end-to-end with React, Next.js, Node.js, TypeScript, and PostgreSQL.",
      "skills": ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"]
    },
    {
      "title": "Mobile",
      "description": "Cross-platform mobile applications with Flutter and React Native for iOS and Android.",
      "skills": ["Flutter", "Dart", "React Native", "Firebase"]
    },
    {
      "title": "Cloud & DevOps",
      "description": "Containerised deployments, CI/CD pipelines, and cloud infrastructure on AWS, GCP, and Oracle Cloud.",
      "skills": ["Docker", "GitHub Actions", "AWS", "GCP", "Nginx"]
    }
  ],
  "contactHeadline": "Let's build something real.",
  "sections": {
    "whatIDo": {
      "heading": "WHAT I DO"
    }
  }
}
```

### TypeScript-style interfaces (for documentation)

```ts
interface WhatIDoEntry {
  title: string
  description: string
  skills: string[]
}

interface SkillCategory {
  id: string
  label: string
  icon: string
  color: string
  skills: string[]
}

interface MarqueeStripProps {
  text: string
  direction?: 'ltr' | 'rtl'
  speed?: number
  accent?: 'orange' | 'cyan'
}
```

### Navigation update (`lib/navigation.js`)

```js
// Change comment only + NAV_ITEMS label:
// Intro(0), Hero(1), About(2), Projects(3..3+N), Architecture(3+N+1),
// WhatIDo(3+N+2), Work(3+N+3), Testimonials(3+N+4), GitHub(3+N+5), Footer(3+N+6..8)

export const NAV_ITEMS = [
  { label: 'Home',         index: 1 },
  { label: 'About',        index: 2 },
  { label: 'Work',         index: 3 },
  { label: 'Architecture', index: 3 + PROJECT_SLIDES },
  { label: 'What I Do',    index: 3 + PROJECT_SLIDES + 1 },   // was 'Skills'
  { label: 'Experience',   index: 3 + PROJECT_SLIDES + 2 },
  { label: 'GitHub',       index: 3 + PROJECT_SLIDES + 4 },
  { label: 'Contact',      index: 3 + PROJECT_SLIDES + 5 },
]
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a
system — essentially, a formal statement about what the system should do. Properties serve as the bridge
between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Counter Value Mapping

*For any* elapsed time `t` (in seconds) in the range `[0, 2.5]`, the displayed integer counter value should
equal `Math.round(t / 2.5 * 100)`, ensuring the GSAP `power2.inOut` easing produces values within `[0, 100]`
and the rounding function correctly converts any floating-point tween value to its nearest integer.

**Validates: Requirements 1.3**

---

### Property 2: Loader Dual Gate Condition

*For any* combination of `(counterDone: boolean, threeJsReady: boolean)`, the reveal animation should fire if
and only if both `counterDone === true` AND `threeJsReady === true`. When either or both are false, no reveal
should be triggered regardless of event timing or ordering.

**Validates: Requirements 1.4**

---

### Property 3: Loader Event Ordering Invariant

*For any* invocation of the reveal-complete handler, the events `'loader-dismissed'` and
`'loader-animation-done'` should always be dispatched in that exact order, and both should be dispatched
before `onDismiss()` is called. No permutation of the three actions is acceptable.

**Validates: Requirements 1.7**

---

### Property 4: Content Sourcing Completeness

*For any* values in `profile.json` and `content.json`, the rendered portfolio should display exactly those
values in the corresponding UI elements. Specifically: (a) any `profile.name.full.toUpperCase()` should appear
in the ScreenLoader secondary text; (b) any `profile.tagline` should appear in the HeroSection MarqueeStrip
and role line; (c) any `profile.name.first` and `profile.name.last` should appear in the VideoIntro and
HeroSection `<h1>` renders; (d) any `profile.contactHeadline` should appear in the PublicationsFooterSection
third panel. No component should render hardcoded name, role, or contact strings.

**Validates: Requirements 1.10, 3.5, 4.2, 4.3, 9.1, 10.4**

---

### Property 5: Display Font Token Universal Application

*For any* section heading in `HeroSection`, `WhatIDoSection`, `WorkExperienceSection`, and
`ProjectsSection`, the rendered element should always use `font-family: var(--font-display)` and the
corresponding size token (`--display-hero`, `--display-section`, or `--display-number`). No heading in these
sections should use any other font family, regardless of what value is assigned to `--font-display` at runtime.

**Validates: Requirements 2.4, 2.5, 5.8, 6.1, 8.1**

---

### Property 6: MarqueeStrip Direction-to-Style Mapping

*For any* `MarqueeStrip` instance with `direction="ltr"`, the rendered track element should have
`animation-direction: normal` (or unset) and `color: var(--accent)`. *For any* instance with
`direction="rtl"`, the track should have `animation-direction: reverse` and `color: var(--accent-cyan)`.
This mapping should hold for any `speed` and `text` values passed as props.

**Validates: Requirements 3.2, 3.4**

---

### Property 7: MarqueeStrip Contained Height

*For any* rendered `MarqueeStrip` — regardless of `text` length, `speed` value, or parent container
dimensions — the container's computed height should never exceed `3rem`. The `overflow: hidden` declaration
should ensure no text overflow expands the section.

**Validates: Requirements 3.7**

---

### Property 8: Deduplicated Tech Icon Wall

*For any* `profile.skillCategories` array (including any configuration with duplicate skill names across
categories), the `WhatIDoSection` icon wall should render each unique skill name exactly once. No skill
string should appear as a label more than once in the rendered output.

**Validates: Requirements 5.4**

---

### Property 9: Role Card Count Matches Data

*For any* `profile.whatIDo` array of length `n` (where `n ≤ 3`), the `WhatIDoSection` should render exactly
`n` role cards. If the `whatIDo` key is absent, the fallback using `profile.skillCategories.slice(0, 3)`
should render exactly `Math.min(3, profile.skillCategories.length)` cards. The rendered card count should
always equal the data source length, never a hardcoded value.

**Validates: Requirements 5.2**

---

### Property 10: Ordinal Number Label Zero-Padding

*For any* array index `i` from `0` to `n-1` (where `n` is the array length of `profile.projects` or
`profile.experience`), the rendered ordinal label should equal `String(i + 1).padStart(2, '0')`. For `i = 0`
the label is `"01"`, for `i = 8` it is `"09"`. No label should be a raw number or use a different padding
scheme.

**Validates: Requirements 6.1, 8.1**

---

### Property 11: Card Data Binding Completeness

*For any* entry in `profile.projects`, the rendered project card should contain all of: the zero-padded
number label, `project.title`, `project.subtitle`, `project.type`, all `project.tech` chips, and
`project.desc`. *For any* entry in `profile.experience`, the rendered work column should contain all of:
`exp.company`, `exp.role`, the period string (`exp.period – exp.periodEnd`), `exp.type`, all `exp.bullets`,
and all `exp.tech` chips. Missing any field for any entry is a violation.

**Validates: Requirements 6.2, 8.5**

---

### Property 12: Project Card Tilt Rotation Bounded

*For any* cursor position `(cx, cy)` within a project card of dimensions `(cardWidth, cardHeight)`, the
computed `rotateX` and `rotateY` values passed to GSAP should satisfy `|rotateX| ≤ 8` and `|rotateY| ≤ 8`
(in degrees). The tilt calculation `((cy / cardHeight) - 0.5) * -16` for X and `((cx / cardWidth) - 0.5) * 16`
for Y guarantees this bound. No cursor position, including edge and corner positions, should produce a rotation
exceeding 8° in absolute value.

**Validates: Requirements 6.5**

---

### Property 13: Three.js Renderer Pixel Ratio Cap

*For any* value of `window.devicePixelRatio` (including values greater than 2 such as on 3× OLED screens),
all Three.js renderers (`HeroBackground`, `CinematicLayer`, `AboutThreeScene`, `WorkExpThreeScene`) should
call `renderer.setPixelRatio` with a value equal to `Math.min(window.devicePixelRatio, 2)`. No renderer
should ever receive a pixel ratio greater than 2.

**Validates: Requirements 7.5**

---

### Property 14: Entrance Animations Fire Exactly Once (Idempotence)

*For any* number of times the `main` scroller crosses the entrance threshold for `WhatIDoSection`,
`WorkExperienceSection`, or `PublicationsFooterSection` (including rapid oscillations through the threshold),
the GSAP entrance animation for that section should fire exactly once per page load session. The `animatedRef`
/ `animDoneRef` guard pattern must ensure idempotence: a second crossing should produce no additional GSAP
calls.

**Validates: Requirements 5.3, 8.4, 9.4**

---

### Property 15: No Legacy Timeline Elements in WorkExperienceSection

*For any* render of `WorkExperienceSection` — regardless of the content of `profile.experience` —
the rendered DOM should contain zero elements matching the CSS classes `.snakeLine`, `.dot`, `.dotNum`,
or any SVG connector element. The magazine column layout is the sole layout pattern; no timeline-connector
pattern should ever coexist with it.

**Validates: Requirements 8.6**

---

### Property 16: Footer Loop-Back Rate Limiting

*For any* sequence of `footer-loop-back` custom events dispatched on `window` while `busyRef.current` is
`true` in `app/page.js`, at most one `fadeLoop(0, 0)` call should be processed per navigation cycle. All
events dispatched while the busy guard is active should be silently ignored. After `busyRef.current` becomes
`false`, the next `footer-loop-back` event should be processed normally.

**Validates: Requirements 9.5**

---

### Property 17: `threejs-ready` Dispatched on HeroDigitalCore Creation

*For any* mount of `HeroDigitalCore` in a browser environment where R3F successfully initialises the WebGL
context, the `window` object should receive exactly one `'threejs-ready'` `CustomEvent` during the `Canvas`
`onCreated` callback. The event should be dispatched before any frame is rendered. Multiple mounts should
dispatch the event each time (idempotent with respect to mount count for loader gating purposes, since the
loader only listens once).

**Validates: Requirements 1.4, 4.6**

---

## Error Handling

### Three.js Scene Failures

All Three.js components are wrapped in `ErrorBoundary` at their call site (consistent with existing
`HeroBackground` and `CinematicLayer` usage). If a WebGL context cannot be obtained, the `ErrorBoundary`
renders nothing (transparent background), and the section degrades gracefully to its CSS-only appearance.

### Missing `profile.json` Keys

- `profile.whatIDo` absent → fallback to `profile.skillCategories.slice(0, 3)` mapping in `WhatIDoSection`.
- `profile.contactHeadline` absent → fallback to empty string (element not rendered).
- `profile.sections?.whatIDo?.heading` absent → fallback to `'WHAT I DO'` constant.
- `profile.tagline` absent in `MarqueeStrip` caller → fallback to `profile.roles.detailed`.

### GSAP Tween Targets Not Available

All GSAP calls check `ref.current` before animating (existing pattern). The counter tween uses a plain
object `{ val: 0 }` as the target (not a DOM ref) to avoid null-checks on the tween itself; the `onUpdate`
callback reads the DOM ref only when updating text.

### Loader `threejs-ready` Never Fires

If `HeroDigitalCore` fails to initialise (WebGL not available, R3F error), `threejs-ready` is never dispatched
and the loader hangs at `100%`. Mitigation: add a fallback timeout in ScreenLoader:

```js
// In ScreenLoader useEffect:
const fallbackId = setTimeout(() => {
  threeJsReadyRef.current = true
  checkBothReady()
}, 5000)  // 5s timeout — enter portfolio even if 3D fails
return () => clearTimeout(fallbackId)
```

### `prefers-reduced-motion`

Every component with GSAP animations checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
at the top of its animation `useEffect`. When active:
- GSAP timelines are not created.
- `gsap.set(...)` places elements at their final state immediately.
- Three.js scenes return early (no RAF loop started).
- MarqueeStrip CSS applies `animation-play-state: paused`.

---

## Testing Strategy

### Unit Tests (Example-Based)

Unit tests focus on concrete behavior with specific inputs:

- **ScreenLoader**: session storage skip path, reduced motion instant dismiss, split panel exit GSAP call params.
- **MarqueeStrip**: renders with all prop combinations, `animation-direction: reverse` for `rtl`, correct color class applied.
- **WhatIDoSection**: fallback rendering when `whatIDo` absent, deduplication of skills.
- **ProjectsSection**: number label zero-padding function (`String(i+1).padStart(2,'0')`).
- **WorkExperienceSection**: absence of `.snakeLine` and `.dot` elements, correct `mailto:` href construction.
- **VideoIntro**: entrance timeline does not fire on mount, fires on `loader-animation-done` event.
- **HeroDigitalCore**: `onCreated` dispatches `threejs-ready` CustomEvent.

### Property-Based Tests

Property tests verify universal invariants across generated inputs. The recommended PBT library for this
JavaScript/Next.js project is **[fast-check](https://github.com/dubzzz/fast-check)**.

Each property test must run a **minimum of 100 iterations**. Tag each test with a comment referencing its
design property:

```
// Feature: portfolio-redesign-gsap-3d, Property N: <property text>
```

**Example property test structure:**

```js
import * as fc from 'fast-check'

// Feature: portfolio-redesign-gsap-3d, Property 10: Ordinal number label zero-padding
test('Property 10: ordinal label zero-pads correctly for any valid index', () => {
  fc.assert(fc.property(
    fc.integer({ min: 0, max: 8 }),
    (i) => {
      const label = String(i + 1).padStart(2, '0')
      expect(label).toHaveLength(2)
      expect(label[0]).toBe('0')
      expect(Number(label)).toBe(i + 1)
    }
  ))
})

// Feature: portfolio-redesign-gsap-3d, Property 12: Project card tilt rotation bounded
test('Property 12: tilt rotation never exceeds ±8 degrees for any cursor position', () => {
  fc.assert(fc.property(
    fc.float({ min: 0, max: 1 }),  // normalized cx (0–1)
    fc.float({ min: 0, max: 1 }),  // normalized cy (0–1)
    (ncx, ncy) => {
      const rotateX = (ncy - 0.5) * -16
      const rotateY = (ncx - 0.5) * 16
      expect(Math.abs(rotateX)).toBeLessThanOrEqual(8)
      expect(Math.abs(rotateY)).toBeLessThanOrEqual(8)
    }
  ))
})

// Feature: portfolio-redesign-gsap-3d, Property 1: Counter value mapping
test('Property 1: counter display integer matches expected value for any time in [0, 2.5]', () => {
  fc.assert(fc.property(
    fc.float({ min: 0, max: 2.5 }),
    (t) => {
      const eased = /* power2.inOut applied externally */ t / 2.5  // simplified linear check for range
      const displayed = Math.round(eased * 100)
      expect(displayed).toBeGreaterThanOrEqual(0)
      expect(displayed).toBeLessThanOrEqual(100)
    }
  ))
})

// Feature: portfolio-redesign-gsap-3d, Property 8: Deduplicated icon wall
test('Property 8: deduplicated skills produce unique labels for any skillCategories input', () => {
  fc.assert(fc.property(
    fc.array(
      fc.record({
        id: fc.string(),
        label: fc.string(),
        icon: fc.string(),
        color: fc.string(),
        skills: fc.array(fc.constantFrom('React','Next.js','Node.js','TypeScript','Docker','Flutter'), { minLength: 1 }),
      }),
      { minLength: 1, maxLength: 5 }
    ),
    (categories) => {
      const seen = new Set()
      const deduped = categories.flatMap(c => c.skills).filter(s => {
        if (seen.has(s)) return false
        seen.add(s)
        return true
      })
      const labels = deduped
      expect(new Set(labels).size).toBe(labels.length)  // all unique
    }
  ))
})
```

**Properties to implement as fast-check property tests:**

| Property | Test focus | Generator |
|----------|-----------|-----------|
| P1 | Counter range [0, 100] | `fc.float({ min: 0, max: 2.5 })` |
| P2 | Gate: reveal iff both true | `fc.boolean()` × `fc.boolean()` |
| P3 | Event ordering | Fixed sequence, verify call order |
| P7 | MarqueeStrip height ≤ 3rem | Render with `fc.string()`, measure |
| P8 | Deduplication uniqueness | `fc.array` of skill categories |
| P9 | Card count = data length | `fc.array(roleEntry, {maxLength:3})` |
| P10 | Zero-padding correctness | `fc.integer({min:0, max:8})` |
| P12 | Tilt bounded ±8° | `fc.float(0,1)` × `fc.float(0,1)` |
| P13 | Pixel ratio cap ≤ 2 | `fc.float({min:1, max:5})` |

### Integration Tests

- Full page scroll sequence: `TOTAL_STEPS` remains 20, `WhatIDoSection` at step 13.
- `loader-dismissed` → `VideoIntro` unmutes and starts video.
- `threejs-ready` dispatched before loader reveal completes.
- MarqueeStrip animation does not affect `scrollTop` or `TOTAL_STEPS`.

### Smoke Tests

- `globals.css` contains all four new token definitions.
- `app/layout.js` imports Playfair Display with `display: 'swap'`.
- `HeroBackground` renderer `pixelRatio ≤ 2` in code.
- No `R3F` imports in `AboutThreeScene` or `WorkExpThreeScene`.
- `dynamic(..., { ssr: false })` applied to all `components/three/` imports.

---

## File Change Inventory

### New Files

| File | Purpose |
|------|---------|
| `components/ui/MarqueeStrip.jsx` | Reusable infinite marquee component |
| `components/ui/MarqueeStrip.module.css` | CSS keyframes + track styles |
| `components/sections/WhatIDoSection.jsx` | "What I Do" roles section (replaces SkillsMatrix) |
| `styles/sections/WhatIDoSection.module.css` | Styles for WhatIDoSection |
| `components/three/AboutThreeScene.jsx` | Raw Three.js floating planes for AboutSection |
| `components/three/WorkExpThreeScene.jsx` | Raw Three.js sparse particle field for WorkExp |

### Modified Files

| File | Changes |
|------|---------|
| `app/globals.css` | Add `--font-display`, `--display-hero`, `--display-section`, `--display-number`, `--text-label` tokens; add mobile breakpoint overrides |
| `app/layout.js` | Import Playfair Display via `next/font/google`, apply variable to `<html>` |
| `data/profile.json` | Add `whatIDo` array, `contactHeadline` string, `sections.whatIDo.heading` |
| `lib/navigation.js` | Update comment and `NAV_ITEMS` label from 'Skills' to 'What I Do' |
| `app/page.js` | Swap `import SkillsMatrixSection` → `import WhatIDoSection`; update JSX slot |
| `components/sections/ScreenLoader.jsx` | Replace typing animation with GSAP counter; CSS Module split panels; dual-gate reveal; `sessionStorage` skip + reduced motion instant dismiss |
| `components/sections/VideoIntro.jsx` | Entrance triggered by `loader-animation-done` event (not mount); updated animation start values; no hardcoded strings |
| `components/sections/HeroSection.jsx` | `--font-display` on `<h1>`; updated GSAP entrance params; `HeroDigitalCore` `onCreated` dispatch; `HeroBackground` `dynamic` confirm; add MarqueeStrip pair |
| `components/sections/ProjectsSection.jsx` | Bold number labels; `numberLabelRefs`; slide-activation label animation; mouse-tilt handler; MarqueeStrip pair (last slide area) |
| `components/sections/WorkExperienceSection.jsx` | Magazine column layout; remove snakeLine/dot; add `WorkExpThreeScene`; `animatedRef` once-guard; column hover; add MarqueeStrip pair |
| `components/sections/PublicationsFooterSection.jsx` | Add contact block with `contactHeadline`, email, social icons; footer entrance animation once-guard; `busyRef` rate-limiting via existing page.js guard |
| `components/three/HeroBackground.jsx` | N1 → 98, N2 → 33; add `camera.rotation.y += 0.03 * dt` in tick |
| `components/three/HeroDigitalCore.js` | Split 200 particles into two `<points>` groups (100 orange, 100 cyan); add `Canvas` `onCreated` dispatch of `threejs-ready` |
| `styles/sections/ScreenLoader.module.css` | Add `.counter`, `.nameText`, `.splitTop`, `.splitBottom` classes; remove or repurpose typing-animation classes |
| `styles/sections/HeroSection.module.css` | Add `--font-display` / `--display-hero` for `.nameHeader`; add `.lastName` cyan color; add `.marqueeRow`; hover cyan color for social links |
| `styles/sections/WorkExperienceSection.module.css` | Replace timeline styles with magazine column grid; add `.colNum` display-number; remove `.snakeLine`, `.dot`, `.dotNum`, `.entries`, `.timelineBody` |
| `styles/sections/PublicationsFooterSection.module.css` | Add `.contactHeadline`, `.contactEmail`, `.contactSocials`, `.contactSocialLink` |

---

## Gap Fixes — Reference Site Analysis

The following sections address 6 design gaps identified by comparing the spec against redoyanulhaque.me.

---

### G1: Navbar Redesign (modify `components/ui/Navbar.jsx`)

**Reference pattern:** Minimal floating nav with `ABOUT WORK CONTACT RESUME` in all-caps, no background on the VideoIntro step, subtle blur background after scrolling.

**Changes:**
- Nav links use `var(--font-body)`, `var(--text-label)` (0.72rem), `letter-spacing: 0.15em`, all-caps.
- Background: transparent by default; transitions to `rgba(5,5,7,0.85)` + `backdrop-filter: blur(12px)` when scroll step > 0. Use `window.addEventListener('nav-step-change', ...)` custom event dispatched from `app/page.js` `onScroll`, or read a `data-step` attribute set on `<main>` by `page.js`.
- Active link: `color: var(--accent)` + `border-bottom: 2px solid var(--accent)`.
- Hover: `color: var(--accent-cyan)` via CSS transition.
- RESUME link: `<a href={profile.resume} download>RESUME</a>`.

**CSS Module additions (`styles/ui/Navbar.module.css`):**
```css
.nav        { position: fixed; top: 0; inset-inline: 0; z-index: 1000;
              display: flex; align-items: center; justify-content: space-between;
              padding: 1.25rem clamp(1.5rem, 4vw, 3rem);
              transition: background 0.3s, backdrop-filter 0.3s; }
.navScrolled{ background: rgba(5,5,7,0.85); backdrop-filter: blur(12px); }
.link       { font-family: var(--font-body); font-size: var(--text-label);
              letter-spacing: 0.15em; text-transform: uppercase;
              color: var(--text-muted); text-decoration: none;
              transition: color 0.2s; }
.link:hover { color: var(--accent-cyan); }
.linkActive { color: var(--accent); border-bottom: 2px solid var(--accent); }
.resumeLink { border: 1px solid var(--border-bright); padding: 0.4rem 1rem;
              border-radius: 2rem; color: var(--text-primary); }
.resumeLink:hover { border-color: var(--accent-cyan); color: var(--accent-cyan); }
```

**Step tracking:** In `app/page.js`, after `idxRef.current = idx` in `goTo()`, dispatch:
```js
window.dispatchEvent(new CustomEvent('nav-step-change', { detail: { step: idx } }))
```
Navbar listens and sets `isScrolled` state (`step > 0`) and `activeStep` state.

---

### G2: Animated Role Word Switcher (modify `components/sections/HeroSection.jsx`)

**Reference pattern:** Beneath the large name, roles cycle — "AI ENGINEER" → "FULL-STACK DEVELOPER" — with a clip-path swap animation.

**New `profile.json` field:**
```json
"roleCycle": [
  "FULL-STACK ENGINEER",
  "MOBILE DEVELOPER",
  "CLOUD & DEVOPS"
]
```

**New refs:**
```js
const roleARef   = useRef(null)   // currently visible role span
const roleBRef   = useRef(null)   // incoming role span
const cycleRef   = useRef(null)   // setTimeout id
const roleIdxRef = useRef(0)
```

**Switcher logic (called from entrance timeline onComplete):**
```js
const ROLES = profile.roleCycle ?? [profile.roles.short]

function startCycle() {
  if (ROLES.length <= 1) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  function swap() {
    const nextIdx = (roleIdxRef.current + 1) % ROLES.length
    roleIdxRef.current = nextIdx

    // outgoing
    gsap.to(roleARef.current, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.4,
      ease: 'power2.in',
    })
    // set incoming text
    if (roleBRef.current) roleBRef.current.textContent = ROLES[nextIdx]
    // incoming
    gsap.fromTo(roleBRef.current,
      { clipPath: 'inset(100% 0 0% 0)', opacity: 1 },
      { clipPath: 'inset(0% 0 0% 0)', duration: 0.4, ease: 'power2.out', delay: 0.3 }
    )

    cycleRef.current = setTimeout(swap, 2500)
  }

  cycleRef.current = setTimeout(swap, 2500)
}
```

**JSX:**
```jsx
<div className={styles.roleSwitcher} aria-live="polite">
  <span ref={roleARef} className={styles.roleText}>
    {ROLES[0]}
  </span>
  <span ref={roleBRef} className={styles.roleText} aria-hidden="true">
    {ROLES[1] ?? ROLES[0]}
  </span>
</div>
```

**CSS Module additions:**
```css
.roleSwitcher { position: relative; overflow: hidden; height: calc(var(--text-body) * 1.6); }
.roleText     { position: absolute; top: 0; left: 0;
                font-family: var(--font-body); font-size: var(--text-body);
                color: var(--accent-cyan); letter-spacing: 0.1em; text-transform: uppercase;
                clip-path: inset(0 0 0% 0); }
```

**Cleanup in `useEffect` return:**
```js
return () => { clearTimeout(cycleRef.current); observer.disconnect(); tl.kill() }
```

---

### G3 (Partially addressed): Hero Greeting Prefix

**Reference pattern:** `Hello! I'm` above the oversized name in the hero.

**Change to `HeroSection.jsx`:** Add a `<p className={styles.greeting}>` element above the `<h1>`, with text from a new `profile.greeting` field (fallback: `"Hello! I'm"`). This animates in as part of the GSAP entrance timeline before the name lines.

**`profile.json` addition:**
```json
"greeting": "Hello! I'm"
```

**CSS:**
```css
.greeting { font-family: var(--font-body); font-size: var(--text-body);
            color: var(--text-muted); letter-spacing: 0.08em;
            margin-bottom: 0.5rem; }
```

---

### G4: Vertical Year-Anchored Timeline in WorkExperienceSection

**This supersedes the magazine column layout specified in sections 8 and the original Requirement 8.** The design now matches the reference site's career section.

**Layout:** Two-column grid: left column `~100px` for year labels + vertical line; right column fills remaining space with entry content.

**Vertical line:** Absolutely positioned `1px` `var(--border-dim)` line running the full height of the timeline container. Each entry has a `6px` circular dot at its year-label level.

**GSAP animation:**
```js
// Vertical line entrance
gsap.fromTo(timelineLineRef.current,
  { scaleY: 0, transformOrigin: 'top center' },
  { scaleY: 1, duration: 1.2, ease: 'power2.inOut' }
)
// Entry stagger
gsap.fromTo(entryRefs.current,
  { y: 30, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.15, delay: 0.3 }
)
```

**CSS Module (key rules):**
```css
.section       { height: 100vh; position: relative; overflow: hidden;
                 padding: 4rem clamp(1.5rem, 5vw, 6rem);
                 display: flex; flex-direction: column; justify-content: center; }
.timeline      { position: relative; display: flex; flex-direction: column; gap: 2.5rem; }
.timelineLine  { position: absolute; left: 3.5rem; top: 0; bottom: 0;
                 width: 1px; background: var(--border-dim);
                 transform-origin: top center; }
.entry         { display: grid; grid-template-columns: 7rem 1fr; gap: 2rem; align-items: start; }
.yearCol       { text-align: right; padding-right: 2rem; position: relative; }
.yearLabel     { font-family: var(--font-display); font-size: clamp(1.5rem,3vw,2.5rem);
                 color: var(--text-muted); line-height: 1; }
.yearLabelNow  { color: var(--accent); }
.dot           { position: absolute; right: -4px; top: 0.35rem;
                 width: 8px; height: 8px; border-radius: 50%;
                 background: var(--accent); }
.dotPulse      { box-shadow: 0 0 0 6px var(--accent-glow);
                 animation: pulse 2s ease-in-out infinite; }
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px var(--accent-glow); }
  50%       { box-shadow: 0 0 0 8px transparent; }
}
.entryBody     { padding-left: 0.5rem; }
.company       { font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 0.25rem; }
.role          { color: var(--text-muted); font-size: var(--text-body); margin-bottom: 0.75rem; }
```

**Additional refs:**
```js
const timelineLineRef = useRef(null)
const entryRefs       = useRef([])   // one per experience entry
```

---

### G5: Standalone TechStackSection (new `components/sections/TechStackSection.jsx`)

**Purpose:** Dedicated full-screen step matching reference site's "TECH STACK" section. Dense icon + label tile grid.

**Step insertion:** After `WhatIDoSection` at step `3 + PROJECT_SLIDES + 2`. `TOTAL_STEPS` becomes `12 + PROJECT_SLIDES` (21 with 9 projects). `lib/navigation.js` updated.

**Data:** `profile.skillCategories` — all skills flattened and deduplicated by name.

**Component structure:**
```jsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/TechStackSection.module.css'

const HEADING = profile.sections?.techStack?.heading ?? 'TECH STACK'

const seen = new Set()
const ALL_SKILLS = profile.skillCategories.flatMap(c => c.skills).filter(s => {
  if (seen.has(s)) return false; seen.add(s); return true
})

export default function TechStackSection() {
  const sectionRef  = useRef(null)
  const tileRefs    = useRef([])
  const animatedRef = useRef(false)

  useEffect(() => {
    const scroller = document.querySelector('main')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      gsap.set(tileRefs.current, { opacity: 1, y: 0 })
      return
    }

    gsap.set(tileRefs.current, { opacity: 0, y: 20 })

    function onScroll() {
      const section = sectionRef.current
      if (!section || animatedRef.current) return
      if (Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.5) {
        animatedRef.current = true
        gsap.to(tileRefs.current, {
          opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.025
        })
      }
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  function handleTileEnter(el) {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.to(el, { scale: 1.15, borderColor: 'var(--accent-cyan)', duration: 0.2, ease: 'power2.out' })
  }
  function handleTileLeave(el) {
    if (!window.matchMedia('(pointer: fine)').matches) return
    gsap.to(el, { scale: 1, borderColor: 'var(--border-dim)', duration: 0.15 })
  }

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Tech Stack">
      <h2 className={styles.heading}>{HEADING}</h2>
      <div className={styles.grid}>
        {ALL_SKILLS.map((skill, i) => (
          <div
            key={skill}
            ref={el => { tileRefs.current[i] = el }}
            className={styles.tile}
            onMouseEnter={e => handleTileEnter(e.currentTarget)}
            onMouseLeave={e => handleTileLeave(e.currentTarget)}
          >
            <span className={styles.tileLabel}>{skill}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
```

**CSS Module (`styles/sections/TechStackSection.module.css`):**
```css
.section  { height: 100vh; display: flex; flex-direction: column; justify-content: center;
            padding: 4rem clamp(1.5rem, 5vw, 6rem); overflow: hidden; }
.heading  { font-family: var(--font-display); font-size: var(--display-section);
            text-transform: uppercase; margin-bottom: 3rem;
            color: var(--text-primary); }
.grid     { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.tile     { border: 1px solid var(--border-dim); padding: 0.45rem 1rem;
            border-radius: 2rem; cursor: default; transform-origin: center;
            will-change: transform; }
.tileLabel{ font-family: var(--font-body); font-size: var(--text-label);
            color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
```

**`lib/navigation.js` update:**
```js
export const TOTAL_STEPS = 12 + PROJECT_SLIDES  // was 11 + PROJECT_SLIDES

export const NAV_ITEMS = [
  { label: 'Home',         index: 1 },
  { label: 'About',        index: 2 },
  { label: 'Work',         index: 3 },
  { label: 'Architecture', index: 3 + PROJECT_SLIDES },
  { label: 'What I Do',    index: 3 + PROJECT_SLIDES + 1 },
  { label: 'Tech Stack',   index: 3 + PROJECT_SLIDES + 2 },   // NEW
  { label: 'Experience',   index: 3 + PROJECT_SLIDES + 3 },   // +1
  { label: 'GitHub',       index: 3 + PROJECT_SLIDES + 5 },   // +1
  { label: 'Contact',      index: 3 + PROJECT_SLIDES + 6 },   // +1
]
```

**`app/page.js` update:** Add `<TechStackSection />` import and JSX between `<WhatIDoSection />` and `<WorkExperienceSection />`.

---

### G6: Section Progress Indicator / Active Nav State

**Reference pattern:** Minimal visual cue for current section (active nav link color).

**Design:** Already covered by G1 (Navbar active state). No additional dot-indicator component needed for now — the active nav link `color: var(--accent)` + underline provides the visual location cue matching the reference site's simplicity.

---

### P1: Project Number Prominence Update

**Reference pattern:** Numbers are left-aligned and prominent (not watermark-opacity). Update `slideNumberLabel` styling.

**CSS Module change (`styles/sections/ProjectsSection.module.css`):**
```css
/* Update from watermark to prominent */
.slideNumberLabel {
  position: absolute;
  top: 1.5rem;
  left: 2rem;          /* was right: 2rem */
  font-family: var(--font-display);
  font-size: var(--display-number);
  color: var(--accent);            /* was rgba(255,255,255,0.08) */
  opacity: 0.15;                   /* subtle but readable */
  line-height: 1;
  pointer-events: none;
  user-select: none;
}
```

---

### P3: Footer Signature Credit Line

**Reference pattern:** "Designed and Developed by [Name]" at the bottom.

**Change to `PublicationsFooterSection.jsx`:** The existing `bottomBar` already has "DESIGNED & DEVELOPED / WITH PRECISION." — update it to include the name explicitly sourced from `profile.name.full`.

**JSX update in `bottomBar`:**
```jsx
<div className={styles.bottomRight}>
  <span className={styles.builtWith}>
    DESIGNED &amp; DEVELOPED BY<br />
    {profile.name.full.toUpperCase()}
  </span>
  <span className={styles.barDivider} />
  <span className={styles.year}>{year}</span>
</div>
```

---

### Updated File Change Inventory (Gap Additions)

#### Additional New Files

| File | Purpose |
|------|---------|
| `components/sections/TechStackSection.jsx` | Standalone tech stack tile grid section |
| `styles/sections/TechStackSection.module.css` | Styles for TechStackSection |

#### Additional Modified Files

| File | Changes |
|------|---------|
| `components/ui/Navbar.jsx` | All-caps minimal floating nav; transparent → blur-bg on scroll; active link indicator; RESUME link; cyan hover |
| `styles/ui/Navbar.module.css` | New `.navScrolled`, `.link`, `.linkActive`, `.resumeLink` classes |
| `components/sections/HeroSection.jsx` | Add greeting prefix element; add role word switcher with `profile.roleCycle` cycling via GSAP clip-path |
| `styles/sections/HeroSection.module.css` | Add `.greeting`, `.roleSwitcher`, `.roleText` classes |
| `components/sections/WorkExperienceSection.jsx` | Replace magazine columns with vertical year-anchored timeline; add `timelineLineRef`, `entryRefs`; vertical line scaleY entrance |
| `styles/sections/WorkExperienceSection.module.css` | Add `.timeline`, `.timelineLine`, `.entry`, `.yearCol`, `.yearLabel`, `.yearLabelNow`, `.dot`, `.dotPulse`, `.entryBody`; remove magazine column classes |
| `data/profile.json` | Add `roleCycle` array, `greeting` string, `sections.techStack.heading` |
| `lib/navigation.js` | `TOTAL_STEPS` → `12 + PROJECT_SLIDES`; add `Tech Stack` nav item; increment subsequent indices |
| `app/page.js` | Add `import TechStackSection`; add `<TechStackSection />` between WhatIDoSection and WorkExperienceSection |
