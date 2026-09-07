# Implementation Plan: Portfolio Redesign (GSAP + 3D)

## Overview

This plan converts the design document into incremental coding tasks ordered by dependency. Foundation work
(data, tokens, font, navigation) must land first; new UI primitives (MarqueeStrip) and Three.js scenes are
built independently in parallel before the section-level rewrites that consume them; orchestration wires
everything together last.

All tasks follow AGENTS.md constraints: CSS Modules only, GSAP from `@/lib/gsap`, Three.js via
`dynamic(…, { ssr: false })`, all content from `data/profile.json` / `data/content.json`.

---

## Tasks

- [x] 1. Foundation — data, tokens, font, navigation
  - [x] 1.1 Extend `data/profile.json` with new required fields
    - Add top-level `whatIDo` array (3 entries: Full-Stack, Mobile, Cloud & DevOps — each with `title`, `description`, `skills`)
    - Add top-level `contactHeadline` string (`"Let's build something real."`)
    - Add top-level `roleCycle` array (`["FULL-STACK ENGINEER", "MOBILE DEVELOPER", "CLOUD & DEVOPS"]`)
    - Add top-level `greeting` string (`"Hello! I'm"`)
    - Add `sections.whatIDo.heading` (`"WHAT I DO"`) and `sections.techStack.heading` (`"TECH STACK"`) nested keys
    - No existing keys may be removed or renamed
    - _Requirements: 5.2, 9.1, 13.1, 14.1, 16.3_

  - [x] 1.2 Add design-system tokens to `app/globals.css`
    - In the `:root` block add: `--font-display`, `--display-hero: clamp(4rem, 14vw, 13rem)`, `--display-section: clamp(2.5rem, 6vw, 5.5rem)`, `--display-number: clamp(3rem, 8vw, 7rem)`, `--text-label: 0.72rem`
    - All existing tokens (`--accent`, `--accent-cyan`, `--bg-dark`, `--hero-name-size`, `--text-body`, `--text-small`, `--accent-glow`, `--cyan-glow`) must remain unchanged
    - Add `@media (max-width: 767px)` override block setting `--display-hero: clamp(3rem, 12vw, 6rem)` and `--display-section: clamp(2rem, 8vw, 3.5rem)`
    - Do NOT add `scroll-snap-type` or `scroll-snap-align` anywhere
    - _Requirements: 2.3, 2.8, 11.1, 11.7_

  - [x] 1.3 Load Playfair Display font in `app/layout.js`
    - Import `Playfair_Display` from `next/font/google` with `subsets: ['latin']`, `display: 'swap'`, `variable: '--font-display'`, `weight: ['400', '700', '900']`
    - Apply the font variable to the `<html>` element className alongside existing `geistSans.variable` and `geistMono.variable`
    - _Requirements: 2.1, 12.8_

  - [x] 1.4 Update `lib/navigation.js` for new step budget
    - Change `TOTAL_STEPS` to `12 + PROJECT_SLIDES` (was `11 + PROJECT_SLIDES`)
    - Update the comment to document the new step map: Intro(0), Hero(1), About(2), Projects(3..3+N), Architecture(3+N+1), WhatIDo(3+N+2), TechStack(3+N+3), Work(3+N+4), Testimonials(3+N+5), GitHub(3+N+6), Footer(3+N+7..9)
    - Replace `{ label: 'Skills', index: 3 + PROJECT_SLIDES + 1 }` with `{ label: 'What I Do', index: 3 + PROJECT_SLIDES + 1 }`
    - Add `{ label: 'Tech Stack', index: 3 + PROJECT_SLIDES + 2 }` as the next entry
    - Increment all subsequent indices by 1 (Experience, GitHub, Contact)
    - Add `{ label: 'Resume', index: -1 }` placeholder (or handle RESUME link separately in Navbar — see task 9.1)
    - _Requirements: 5.1, 16.1, 16.8_

- [x] 2. MarqueeStrip UI primitive
  - [x] 2.1 Create `components/ui/MarqueeStrip.jsx`
    - Accept props: `text` (string, required), `direction` (`'ltr'|'rtl'`, default `'ltr'`), `speed` (number, default `60`), `accent` (`'orange'|'cyan'`, default `'orange'`)
    - Repeat `text` enough times to exceed `window.innerWidth * 2` (compute on render; `Math.ceil((window.innerWidth * 2) / estimatedTextWidth) + 4`)
    - Apply `--marquee-speed` as the ONLY inline CSS variable on the track element (exempt from the no-inline-style rule per Req 3.2, 11.3)
    - Apply `styles.rtl` class (not `transform: scaleX(-1)`) for `direction="rtl"` — this sets `animation-direction: reverse`
    - Apply `styles.orange` (`color: var(--accent)`) or `styles.cyan` (`color: var(--accent-cyan)`) based on `accent` prop
    - _Requirements: 3.1, 3.2, 3.4, 3.6_

  - [x] 2.2 Create `components/ui/MarqueeStrip.module.css`
    - Define `@keyframes marquee` animating `transform: translateX(0)` → `translateX(-50%)`
    - `.track` uses `animation: marquee calc(var(--marquee-speed, 60) * 1s) linear infinite` with `will-change: transform`
    - `.rtl` sets `animation-direction: reverse`
    - `.container` has `height ≤ 3rem`, `overflow: hidden`, `width: 100%`
    - `@media (prefers-reduced-motion: reduce)` sets `.track { animation-play-state: paused }`
    - _Requirements: 3.1, 3.6, 12.4, 12.5_

  - [ ]* 2.3 Write property test for MarqueeStrip direction-to-style mapping (Property 6)
    - **Property 6: MarqueeStrip direction-to-style mapping**
    - For any `direction="ltr"` instance verify `animation-direction` is not `reverse` and color class is `.orange`; for `direction="rtl"` verify `animation-direction: reverse` and color class is `.cyan`
    - Use `fc.constantFrom('ltr', 'rtl')` and `fc.constantFrom('orange', 'cyan')`
    - **Validates: Requirements 3.2, 3.4**

  - [ ]* 2.4 Write property test for MarqueeStrip contained height (Property 7)
    - **Property 7: MarqueeStrip container height never exceeds 3rem**
    - Render component with arbitrary `text` and `speed` values and assert container computed height ≤ `3 * 16 = 48px` (assuming 16px base)
    - Use `fc.string({ minLength: 1 })` for text, `fc.integer({ min: 10, max: 120 })` for speed
    - **Validates: Requirements 3.7**

- [x] 3. New Three.js scenes
  - [x] 3.1 Create `components/three/AboutThreeScene.jsx`
    - Use raw Three.js API only — no `@react-three/fiber` or `@react-three/drei` imports
    - Create ≤ 60 `PlaneGeometry(0.4, 0.6)` meshes with `MeshBasicMaterial({ transparent: true, opacity: 0.04–0.08, side: THREE.DoubleSide })` alternating `#f7931e` / `#00f0ff`
    - Renderer: `new THREE.WebGLRenderer({ antialias: false, alpha: true })`, `setPixelRatio(Math.min(window.devicePixelRatio, 2))`
    - Each mesh stores `userData.rx`, `userData.ry`, `userData.vy` for independent rotation/drift rates
    - Pause/resume: `IntersectionObserver(threshold: 0.05)` on mount element — `cancelAnimationFrame(raf)` on leave, `requestAnimationFrame(tick)` on entry
    - `document.addEventListener('visibilitychange', ...)` guard (pause when tab hidden)
    - `window.matchMedia('(prefers-reduced-motion: reduce)').matches` → early return before renderer creation
    - `ResizeObserver` for camera aspect + renderer size updates
    - Full cleanup in `useEffect` return: cancel RAF, disconnect observers, dispose geometries/materials/renderer, remove domElement
    - Export a `<div ref={mountRef}>` as the mount point (position: absolute, inset: 0)
    - _Requirements: 7.3, 7.5, 7.6, 7.7, 7.8, 12.3_

  - [x] 3.2 Create `components/three/WorkExpThreeScene.jsx`
    - Use raw Three.js API only — no R3F imports
    - ≤ 80 points total using `THREE.BufferGeometry` + `THREE.PointsMaterial` with sprite texture (reuse `makeSprite()` pattern from `HeroBackground.jsx`)
    - Two layers: ~50 tight drifters (small, brighter) + ~30 bokeh background (larger, dim) — consistent with `HeroBackground` depth-of-field illusion
    - `setPixelRatio(Math.min(window.devicePixelRatio, 2))`, `alpha: true` renderer
    - Camera Y rotation: `camera.rotation.y += 0.02 * dt` in tick
    - Same `IntersectionObserver`, `visibilitychange`, `prefers-reduced-motion`, `ResizeObserver`, and cleanup patterns as `AboutThreeScene`
    - _Requirements: 7.4, 7.5, 7.6, 7.7, 7.8, 12.3_

  - [ ]* 3.3 Write property test for Three.js renderer pixel ratio cap (Property 13)
    - **Property 13: renderer pixel ratio is always ≤ 2**
    - For any `window.devicePixelRatio` value, assert `Math.min(dpr, 2) ≤ 2`
    - Use `fc.float({ min: 1, max: 5 })` to generate DPR values
    - **Validates: Requirements 7.5**

- [x] 4. ScreenLoader rewrite
  - [x] 4.1 Rewrite `components/sections/ScreenLoader.jsx` with GSAP counter + dual-gate reveal
    - Remove all existing typing animation state and `setTyped` / interval logic
    - New refs: `counterRef` (plain object `{ val: 0 }`), `counterElRef` (span DOM ref), `splitTopRef`, `splitBottomRef`, `nameRef`, `counterDoneRef`, `threeJsReadyRef`, `revealFiredRef`
    - On mount: check `prefers-reduced-motion` → immediately dispatch `loader-dismissed` + `loader-animation-done`, call `onDismiss()`, return
    - Check `sessionStorage('portfolio-entered') === 'true'` → same immediate dismiss path
    - Otherwise: `gsap.to(counterRef, { val: 100, duration: 2.5, ease: 'power2.inOut', onUpdate: updateCounter })`
    - `updateCounter`: set `counterElRef.current.textContent = Math.round(counterRef.val) + '%'`; when value ≥ 100 set `counterDoneRef.current = true` and call `checkBothReady()`
    - Add `window.addEventListener('threejs-ready', ...)` → set `threeJsReadyRef.current = true`, call `checkBothReady()`
    - `checkBothReady()`: if both refs true and `!revealFiredRef.current` → set `revealFiredRef.current = true`, `gsap.delayedCall(0.3, triggerReveal)`
    - Add 5s fallback timeout: `setTimeout(() => { threeJsReadyRef.current = true; checkBothReady() }, 5000)`
    - `triggerReveal()`: GSAP tl animating `splitTopRef` (`y: 0 → '-100%'`, 1.1s, `expo.inOut`) and `splitBottomRef` (`y: 0 → '100%'`, 1.1s, `expo.inOut`) simultaneously; onComplete: dispatch `loader-dismissed`, dispatch `loader-animation-done`, call `onDismiss()`; set `sessionStorage('portfolio-entered', 'true')`
    - JSX: `.overlay` containing `.counter` span (counterElRef), `.nameText` para (nameRef) showing `profile.name.full.toUpperCase()`, `.splitTop` div (splitTopRef), `.splitBottom` div (splitBottomRef)
    - All split panels are JSX elements with CSS Module class refs — NOT imperatively created DOM nodes
    - _Requirements: 1.1–1.11, 11.3_

  - [x] 4.2 Update `styles/sections/ScreenLoader.module.css` for counter + split-panel layout
    - Replace `.monogram`, `.accentLine`, `.role`, `.startBtn`, `.particles`, `.liquidBg` classes with: `.overlay`, `.counter`, `.nameText`, `.splitTop`, `.splitBottom`
    - `.overlay`: `position: fixed; inset: 0; z-index: 10000; background: var(--bg-dark); display: flex; flex-direction: column; align-items: center; justify-content: center`
    - `.counter`: `font-family: var(--font-display); font-size: clamp(4rem,12vw,10rem); color: var(--text-primary); line-height: 1`
    - `.nameText`: `font-family: var(--font-sans); font-size: var(--text-small); color: var(--text-muted); letter-spacing: 0.2em; margin-top: 1rem`
    - `.splitTop`: `position: fixed; inset: 0; bottom: 50%; z-index: 10001; background: var(--bg-dark)`
    - `.splitBottom`: `position: fixed; inset: 0; top: 50%; z-index: 10001; background: var(--bg-dark)`
    - Add `will-change: transform` on `.splitTop` and `.splitBottom`
    - _Requirements: 1.11, 12.4_

  - [ ]* 4.3 Write property test for loader counter value mapping (Property 1)
    - **Property 1: counter display integer matches expected value for any time in [0, 2.5]**
    - For any `t` in `[0, 2.5]`, assert `Math.round(t / 2.5 * 100)` is in `[0, 100]`
    - Use `fc.float({ min: 0, max: 2.5 })`
    - **Validates: Requirements 1.3**

  - [ ]* 4.4 Write property test for loader dual-gate condition (Property 2)
    - **Property 2: reveal fires if and only if both counterDone AND threeJsReady are true**
    - For all 4 boolean combinations, assert reveal is triggered only when both are true; use mock `checkBothReady` extracted from component logic
    - Use `fc.boolean()` × `fc.boolean()`
    - **Validates: Requirements 1.4**

  - [ ]* 4.5 Write property test for loader event ordering invariant (Property 3)
    - **Property 3: loader-dismissed dispatched before loader-animation-done, both before onDismiss()**
    - Mock `window.dispatchEvent` and `onDismiss` callback; assert call order is always: (1) `loader-dismissed`, (2) `loader-animation-done`, (3) `onDismiss()`
    - **Validates: Requirements 1.7**

- [x] 5. Checkpoint — Foundation and primitives complete
  - Ensure all tests pass, ask the user if questions arise.
  - Verify `globals.css` contains all 5 new tokens
  - Verify `lib/navigation.js` exports `TOTAL_STEPS = 12 + PROJECT_SLIDES`
  - Verify `MarqueeStrip` renders without errors

- [x] 6. HeroSection + HeroDigitalCore + HeroBackground updates
  - [x] 6.1 Update `components/three/HeroDigitalCore.js` — dual particle groups + `threejs-ready` dispatch
    - Split the single 200-particle `<points>` element into two groups of 100 each
    - First group (indices 0–99): `pointsMaterial color="#f7931e"` — use `positions.slice(0, 300)` (100 × 3 floats)
    - Second group (indices 100–199): `pointsMaterial color="#00f0ff"` — use `positions.slice(300, 600)`
    - Add `onCreated` callback to `<Canvas>`: `() => { window.dispatchEvent(new CustomEvent('threejs-ready')) }`
    - The existing wireframe `meshBasicMaterial color="#00f0ff"` is already correct — confirm and retain
    - _Requirements: 4.6, 7.2_

  - [x] 6.2 Update `components/three/HeroBackground.jsx` — increased particle counts + camera rotation
    - Change `N1` from `65` to `98` (fast drifters array size and all related `Float32Array` allocations)
    - Change `N2` from `22` to `33` (bokeh blobs array size and all related allocations)
    - In the `tick()` function, after the camera parallax update, add: `camera.rotation.y += 0.03 * dt`
    - Confirm `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` is present (it is — retain)
    - _Requirements: 7.1, 7.5_

  - [-] 6.3 Update `components/sections/HeroSection.jsx` — display font, greeting, role switcher, MarqueeStrip
    - Add `greeting` display: `<p className={styles.greeting}>{profile.greeting ?? "Hello! I'm"}</p>` above the `<h1>`, animated into the GSAP entrance timeline before the name spans
    - Apply `className={styles.nameHeader}` to `<h1>` and `className={styles.lastName}` to the last-name `<span>`
    - Rename existing single `titleRef` to target `[nameFirstRef.current, nameLastRef.current]`; add `nameFirstRef` and `nameLastRef` pointing to the two name `<span>` elements
    - Update entrance GSAP timeline: `fromTo([nameFirstRef.current, nameLastRef.current], { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12 }, 0.1)`
    - Add role word switcher `<div className={styles.roleSwitcher}>` with two overlapping `<span>` refs (`roleARef`, `roleBRef`) sourcing roles from `profile.roleCycle ?? [profile.roles.short]`
    - Implement `startCycle()` function calling from entrance timeline `onComplete`; each cycle: outgoing span `clipPath → 'inset(0 0 100% 0)'`, incoming span `clipPath → 'inset(0% 0 0% 0)'`; each role visible 2.5s; infinite loop; `prefers-reduced-motion` guard (display first role as static text)
    - Add `import MarqueeStrip from '@/components/ui/MarqueeStrip'`; render pair at bottom: `<MarqueeStrip text={profile.tagline} direction="ltr" speed={60} accent="orange" />` + `direction="rtl" accent="cyan"`
    - `HeroBackground` already loaded via `dynamic` — confirm `ssr: false`; `HeroDigitalCore` already `dynamic` — add `onCreated` prop if not already there (handled in 6.1)
    - `prefers-reduced-motion`: `gsap.set(...)` all elements to final state; no timeline played; no cycling
    - Add `will-change: transform, opacity` via CSS Module class on animated elements
    - Cleanup: `clearTimeout(cycleRef.current)`, kill all tweens
    - _Requirements: 4.1, 4.4, 4.7, 4.8, 14.1–14.8_

  - [-] 6.4 Update `styles/sections/HeroSection.module.css` — display font + cyan accent + marquee row
    - Add `.nameHeader { font-family: var(--font-display); font-size: var(--display-hero); line-height: 0.92; text-transform: uppercase; letter-spacing: -0.02em; }`
    - Add `.lastName { color: var(--accent-cyan); display: block; }`
    - Add `.greeting { font-family: var(--font-body); font-size: var(--text-body); color: var(--text-muted); letter-spacing: 0.08em; margin-bottom: 0.5rem; }`
    - Add `.roleSwitcher { position: relative; overflow: hidden; height: calc(var(--text-body) * 1.6); }`
    - Add `.roleText { position: absolute; top: 0; left: 0; font-family: var(--font-body); font-size: var(--text-body); color: var(--accent-cyan); letter-spacing: 0.1em; text-transform: uppercase; clip-path: inset(0 0 0% 0); }`
    - Add `.socialLink:hover { color: var(--accent-cyan); transition: color 0.2s; }`
    - Add `.marqueeRow` container for the two MarqueeStrip components
    - Add `will-change: transform, opacity` to the elements targeted by GSAP
    - _Requirements: 2.4, 2.6, 12.4_

  - [ ]* 6.5 Write property test for ordinal zero-padding (Property 10)
    - **Property 10: ordinal label zero-pads correctly for any valid index**
    - For any `i` in `[0, 8]`, assert `String(i + 1).padStart(2, '0')` has length 2, starts with `'0'`, and `Number(label) === i + 1`
    - Use `fc.integer({ min: 0, max: 8 })`
    - **Validates: Requirements 6.1, 8.1**

- [x] 7. New sections — WhatIDoSection and TechStackSection
  - [-] 7.1 Create `components/sections/WhatIDoSection.jsx`
    - Source data: `const ROLES = profile.whatIDo ?? profile.skillCategories.slice(0, 3).map(cat => ({ title: cat.label, description: cat.skills.slice(0, 5).join(', '), skills: cat.skills }))`
    - `const HEADING = profile.sections?.whatIDo?.heading ?? 'WHAT I DO'`
    - Refs: `sectionRef`, `cardRefs` (array), `animatedRef` (once-guard)
    - Scroll proximity detection on `document.querySelector('main')` scroll events matching the existing `AboutSection` pattern: `Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.5`
    - Card entrance (fires once): `gsap.fromTo(cardRefs.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.15 })`
    - `prefers-reduced-motion`: `gsap.set(cardRefs.current, { opacity: 1, y: 0 })` on mount
    - Three role cards rendered with `title`, `description`, and `skills` chips; heading uses `font-family: var(--font-display)`
    - No icon wall — that lives in TechStackSection (task 7.3)
    - Use CSS Modules exclusively; no inline style objects
    - _Requirements: 5.1, 5.2, 5.3, 5.7, 5.8, 5.9_

  - [-] 7.2 Create `styles/sections/WhatIDoSection.module.css`
    - `.section`: `height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 4rem clamp(1.5rem, 5vw, 6rem)`
    - `.heading`: `font-family: var(--font-display); font-size: var(--display-section); text-transform: uppercase; margin-bottom: 3rem; border-bottom: 2px solid var(--accent-cyan); display: inline-block`
    - `.cardsRow`: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 3rem`
    - `.card`: `border: 1px solid var(--border-dim); padding: 2rem; background: var(--bg-card); border-radius: 0.5rem`
    - `.cardTitle`: `font-family: var(--font-display); font-size: 1.5rem`
    - `.chip`: border pill chip for skill names
    - `@media (max-width: 767px)`: `.cardsRow { grid-template-columns: 1fr }`
    - Add `will-change: transform, opacity` on `.card`
    - _Requirements: 5.7, 12.4_

  - [ ]* 7.3 Write property test for role card count matches data (Property 9)
    - **Property 9: WhatIDoSection renders exactly as many cards as the data source length**
    - For any `whatIDo` array of length 0–3, assert rendered card count equals `Math.min(3, data.length)` (or fallback count from `skillCategories`)
    - Use `fc.array(fc.record({ title: fc.string(), description: fc.string(), skills: fc.array(fc.string()) }), { maxLength: 3 })`
    - **Validates: Requirements 5.2**

  - [x] 7.4 Create `components/sections/TechStackSection.jsx`
    - `const HEADING = profile.sections?.techStack?.heading ?? 'TECH STACK'`
    - Deduplicate all skills: `profile.skillCategories.flatMap(c => c.skills)` filtered with a `Set`
    - Refs: `sectionRef`, `tileRefs` (array), `animatedRef` (once-guard)
    - Same scroll proximity pattern as `WhatIDoSection`
    - Tile entrance (fires once): `gsap.to(tileRefs.current, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.025 })`
    - On mount with reduced motion: `gsap.set(tileRefs.current, { opacity: 1, y: 0 })`
    - Hover handlers (pointer:fine + no reduced-motion only): `gsap.to(el, { scale: 1.15, borderColor: 'var(--accent-cyan)', duration: 0.2, ease: 'power2.out' })` on enter, revert on leave
    - No icon image assets required — skill name text labels only
    - Use CSS Modules exclusively
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

  - [~] 7.5 Create `styles/sections/TechStackSection.module.css`
    - `.section`: `height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 4rem clamp(1.5rem, 5vw, 6rem)`
    - `.heading`: `font-family: var(--font-display); font-size: var(--display-section); text-transform: uppercase; margin-bottom: 3rem`
    - `.grid`: `display: flex; flex-wrap: wrap; gap: 0.75rem`
    - `.tile`: `border: 1px solid var(--border-dim); padding: 0.4rem 0.9rem; border-radius: 2rem; transform-origin: center; will-change: transform`
    - `.tileLabel`: `font-family: var(--font-body); font-size: var(--text-label)`
    - _Requirements: 16.2, 16.5, 16.6_

  - [ ]* 7.6 Write property test for TechStack deduplication (Property 8)
    - **Property 8: deduplicated skills produce unique labels for any skillCategories input**
    - For any generated `skillCategories` array (with potential cross-category duplicates), assert every skill name appears exactly once in the deduplicated output
    - Use `fc.array(fc.record({ id: fc.string(), label: fc.string(), icon: fc.string(), color: fc.string(), skills: fc.array(fc.constantFrom('React','Next.js','Node.js','TypeScript','Docker','Flutter'), { minLength: 1 }) }), { minLength: 1, maxLength: 5 })`
    - **Validates: Requirements 5.4** (and aligns with P8 in design)

- [x] 8. ProjectsSection redesign
  - [~] 8.1 Update `components/sections/ProjectsSection.jsx` — number labels, tilt, MarqueeStrip
    - Add `numberLabelRefs = useRef([])` and `tiltCleanupsRef = useRef([])`
    - In JSX, add a `<span ref={el => { numberLabelRefs.current[i] = el }} className={styles.slideNumberLabel} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>` inside each slide
    - In the `onUpdate` callback of `ScrollTrigger`, detect `activeIdx` change and animate the incoming label: `gsap.fromTo(numberLabelRefs.current[activeIdx], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' })`
    - `prefers-reduced-motion` guard: set all labels to `{ opacity: 1, y: 0 }` on init; skip tilt attachment
    - Attach mouse-tilt handler per slide (`pointer: fine` devices only): `rotateX = ((e.clientY - r.top) / r.height - 0.5) * -16`, `rotateY = ((e.clientX - r.left) / r.width - 0.5) * 16` (±8° max); `gsap.to(slideEl, { rotateX, rotateY, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })`; `mouseleave` resets to `rotateX: 0, rotateY: 0` in 0.5s; store cleanup functions in `tiltCleanupsRef`
    - Add MarqueeStrip pair at the bottom of the section (visible for all slides, positioned at section bottom): `text={profile.roles.detailed}`, `direction="ltr" speed={55} accent="orange"` + `direction="rtl" speed={55} accent="cyan"`
    - All project data remains sourced from `profile.projects` — no hardcoded values
    - Run tilt cleanups in `useEffect` return
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 6.7, 6.8_

  - [~] 8.2 Update `styles/sections/ProjectsSection.module.css` — number label + tilt perspective
    - Add `.slideNumberLabel { position: absolute; top: 1.5rem; right: 2rem; font-family: var(--font-display); font-size: var(--display-number); color: rgba(255,255,255,0.08); line-height: 1; pointer-events: none; user-select: none; }`
    - Add `perspective: 800px; transform-style: preserve-3d` to `.slide`
    - _Requirements: 6.1, 6.5_

  - [ ]* 8.3 Write property test for project tilt rotation bounded (Property 12)
    - **Property 12: tilt rotation never exceeds ±8° for any cursor position**
    - For any normalized `(ncx, ncy)` in `[0, 1] × [0, 1]`, assert `|rotateX| ≤ 8` and `|rotateY| ≤ 8`
    - Use `fc.float({ min: 0, max: 1 })` × `fc.float({ min: 0, max: 1 })`
    - **Validates: Requirements 6.5**

  - [ ]* 8.4 Write property test for card data binding completeness (Property 11 — projects half)
    - **Property 11 (projects): every project entry renders all required fields**
    - For any `profile.projects` array, assert each rendered card contains the zero-padded number label, `title`, `subtitle`, `type`, all `tech` chips, and `desc`
    - Use `fc.array(fc.record({ id: fc.integer(), title: fc.string(), subtitle: fc.string(), type: fc.string(), tech: fc.array(fc.string()), desc: fc.string() }), { minLength: 1, maxLength: 9 })`
    - **Validates: Requirements 6.2**

- [x] 9. Navbar redesign
  - [~] 9.1 Update `components/ui/Navbar.jsx` — minimal floating nav with active state + RESUME link
    - Nav link labels sourced exclusively from `lib/navigation.js` `NAV_ITEMS` — no hardcoded labels
    - Add RESUME `<a>` link sourced from `profile.resume`: `<a href={profile.resume} download className={styles.resumeLink}>RESUME</a>`
    - Add `isScrolled` state, listen for `window` custom event `'nav-step-change'` dispatched by `app/page.js`; set `isScrolled = detail.step > 0`
    - Add `activeStep` state updated from the same event
    - Apply `styles.navScrolled` class when `isScrolled` is true (provides blur + dark background)
    - Active link: apply `styles.linkActive` when `navItem.index === activeStep`
    - `prefers-reduced-motion`: instant transition (no duration); no GSAP
    - All GSAP usage uses `@/lib/gsap` import
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [~] 9.2 Update `styles/ui/Navbar.module.css` — all-caps minimal floating styles
    - `.nav`: `position: fixed; top: 0; inset-inline: 0; z-index: 1000; display: flex; align-items: center; justify-content: space-between; padding: 1.25rem clamp(1.5rem, 4vw, 3rem); transition: background 0.3s, backdrop-filter 0.3s`
    - `.navScrolled`: `background: rgba(5,5,7,0.85); backdrop-filter: blur(12px)`
    - `.link`: `font-family: var(--font-body); font-size: var(--text-label); letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); text-decoration: none; transition: color 0.2s`
    - `.link:hover`: `color: var(--accent-cyan)`
    - `.linkActive`: `color: var(--accent); border-bottom: 2px solid var(--accent)`
    - `.resumeLink`: `border: 1px solid var(--border-bright); padding: 0.4rem 1rem; border-radius: 2rem; color: var(--text-primary)`
    - `.resumeLink:hover`: `border-color: var(--accent-cyan); color: var(--accent-cyan)`
    - All `:focus-visible` outlines retained with `outline: 2px solid var(--accent)`
    - _Requirements: 13.1, 13.2, 13.4, 13.5, 13.6, 12.1_

- [x] 10. WorkExperienceSection redesign
  - [~] 10.1 Rewrite `components/sections/WorkExperienceSection.jsx` — vertical year-anchored timeline
    - Remove all refs and logic for `lineRef`, `dotRefs`, `cardRefs`, `bulletListRefs`, `collapsedHeights`, `hoverTlsRef`, `tlRef`
    - Add new refs: `sectionRef`, `timelineLineRef`, `entryRefs` (one per experience entry), `animatedRef` (once-guard)
    - Remove `WorkExpParticles` / old background image; add `WorkExpThreeScene` loaded via `dynamic(() => import('@/components/three/WorkExpThreeScene'), { ssr: false })` as full-bleed background
    - Vertical timeline layout: `.timeline` container with `.timelineLine` (absolutely positioned 1px line) and `.entry` rows (grid: `7rem 1fr`)
    - Each entry: left `.yearCol` with `.yearLabel` (`exp.period`), `.dot` circle; right `.entryBody` with `exp.role` in `--font-display`, `exp.company`, `exp.type` tag, `exp.bullets` list, `exp.tech` chips
    - Most-recent entry dot (`i === 0`): apply `.dotPulse` class for pulsing box-shadow CSS animation
    - Scroll proximity entrance (once-guard, `animatedRef`): `gsap.fromTo(timelineLineRef.current, { scaleY: 0, transformOrigin: 'top center' }, { scaleY: 1, duration: 1.2, ease: 'power2.inOut' })` then `gsap.fromTo(entryRefs.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.15, delay: 0.3 })`
    - Column hover (desktop ≥ 768px): `gsap.to(el, { backgroundColor: 'rgba(247,147,30,0.04)', duration: 0.3 })` on enter; revert on leave
    - `prefers-reduced-motion`: `gsap.set([timelineLineRef.current, ...entryRefs.current], { opacity: 1, y: 0, scaleY: 1 })`
    - Add MarqueeStrip pair at bottom: `text={profile.skills.slice(0, 8).join(' · ')}`, `speed={50}`
    - Zero `.snakeLine`, `.dot` (old horizontal), `.dotNum`, `.entries`, `.timelineBody` class references must be absent from the new JSX
    - All data from `profile.experience` — no hardcoded content
    - _Requirements: 8.1–8.9, 15.1–15.8_

  - [~] 10.2 Rewrite `styles/sections/WorkExperienceSection.module.css` — vertical timeline styles
    - Remove `.snakeLine`, `.dot`, `.dotNum`, `.entries`, `.timelineBody`, `.entry` (old horizontal), `.card`, `.cardHead`, `.bullets`, `.hoverExpand` classes
    - Add new classes from design spec: `.section`, `.timeline`, `.timelineLine`, `.entry` (new grid layout), `.yearCol`, `.yearLabel`, `.yearLabelNow`, `.dot`, `.dotPulse`, `.entryBody`, `.company`, `.role`, `.bullets`, `.bullet`, `.stack`, `.tag`, `.header`, `.label`, `.labelRight`, `.marqueeRow`
    - `.company { font-family: var(--font-display); font-size: 1.4rem }`
    - `.yearLabel { font-family: var(--font-display); font-size: clamp(1.5rem,3vw,2.5rem); color: var(--text-muted) }`
    - `.yearLabelNow { color: var(--accent) }`
    - `@keyframes pulse` for `.dotPulse` box-shadow animation
    - `.column`/`.entry` gets `will-change: transform, opacity`
    - _Requirements: 8.1, 8.6, 12.4, 15.4_

  - [ ]* 10.3 Write property test for absence of legacy timeline elements (Property 15)
    - **Property 15: rendered WorkExperienceSection DOM contains zero legacy timeline elements**
    - Shallow/full render with any `profile.experience` array and assert no elements with CSS classes `.snakeLine`, `.dot` (old), `.dotNum` exist in the output
    - Use `fc.array(fc.record({ id: fc.integer(), role: fc.string(), company: fc.string(), period: fc.string(), periodEnd: fc.string(), type: fc.string(), bullets: fc.array(fc.string()), tech: fc.array(fc.string()) }), { minLength: 0, maxLength: 5 })`
    - **Validates: Requirements 8.6**

  - [ ]* 10.4 Write property test for card data binding completeness (Property 11 — experience half)
    - **Property 11 (experience): every experience entry renders all required fields**
    - Assert each rendered entry contains `exp.company`, `exp.role`, period string, `exp.type`, all bullets, all tech chips
    - Use same `fc.array` generator as 10.3
    - **Validates: Requirements 8.5**

- [~] 11. Checkpoint — Core sections and navigation complete
  - Ensure all tests pass, ask the user if questions arise.
  - Verify ScreenLoader shows counter, fades with split panels, and fires both events
  - Verify HeroSection shows greeting, display-font name, role switcher cycling, and MarqueeStrip pair
  - Verify WorkExperienceSection shows vertical timeline with zero old timeline DOM classes

- [x] 12. VideoIntro entrance refactor
  - [~] 12.1 Update `components/sections/VideoIntro.jsx` — entrance triggered by `loader-animation-done` event
    - Remove the existing `gsap.timeline({ delay: 0.5 })` `useEffect` that runs the entrance unconditionally on mount
    - Add a new `useEffect` that calls `window.addEventListener('loader-animation-done', onAnimationDone)` (cleanup removes it)
    - Inside `onAnimationDone`, build a new `gsap.timeline()` with compressed timings: `mainVideoWrapRef` `{ opacity: 0, scale: 1.05 } → { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }` at position `0`; eyebrow and name chars shifted to start at `0.3` (not `0.8`/`1.0`); total animation completes in ≤ 2.7s
    - The existing `useEffect` that calls `v.play()` on `loader-animation-done` is merged into `onAnimationDone` (or retained as a separate listener — both are acceptable, but the play call must also only happen after this event)
    - `prefers-reduced-motion`: set all refs to final state `{ opacity: 1, scale: 1, y: 0 }` via `gsap.set` on mount; no timeline created; no listener added
    - All text content verified to come from `profile.json` / `content.json`: `profile.name.first`, `profile.name.last`, `profile.roles.detailed`, `content.site.tagline` — no JSX string literals for these
    - _Requirements: 10.1, 10.2, 10.3, 10.5, 10.6_

- [x] 13. AboutSection — ThreeScene integration
  - [~] 13.1 Update `components/sections/AboutSection.jsx` — integrate `AboutThreeScene` as background layer
    - Add `const AboutThreeScene = dynamic(() => import('@/components/three/AboutThreeScene'), { ssr: false })`
    - Render `<ErrorBoundary><AboutThreeScene /></ErrorBoundary>` as the first child of the section with `position: absolute; inset: 0; z-index: 0; pointer-events: none`
    - Ensure all existing section content is positioned at `z-index: 1` or higher so it renders above the Three.js layer
    - The section heading must use `font-family: var(--font-display)` and `font-size: var(--display-section)` per Requirement 2.5 — add CSS Module rule if not already present
    - _Requirements: 7.3, 2.5_

- [x] 14. PublicationsFooterSection — contact block + entrance animation
  - [~] 14.1 Update `components/sections/PublicationsFooterSection.jsx` — contact block + once-guard footer animation
    - Add `footerEnteredRef = useRef(false)` (once-guard for footer entrance animation)
    - In the `onScroll` function's footer phase block, when `footerFade > 0.05 && !footerEnteredRef.current`: set `footerEnteredRef.current = true`; if not reduced-motion, `gsap.fromTo([leftRef.current, rightRef.current, bigNameRef.current, bottomBarRef.current], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12 })`
    - `prefers-reduced-motion`: `gsap.set(...)` same refs to `{ opacity: 1, y: 0 }` on mount
    - Add contact block JSX inside `rightCol` (or as a new `.contactBlock` div in `footerContent`):
      - `<p className={styles.contactHeadline}>{profile.contactHeadline ?? ''}</p>` (sourced from profile.json, not hardcoded)
      - `<a href={\`mailto:${profile.email}\`} className={styles.contactEmail}>{profile.email}</a>` (dynamic href construction)
      - Social icons loop: `profile.socials.map(s => <a …>{SOCIAL_ICONS[s.label] ?? <span>{s.label}</span>}</a>)` — text fallback for unknown icons, no errors thrown
    - All content (email, socials, name) sourced from `data/profile.json`; site copy from `data/content.json`
    - The `footer-loop-back` event dispatch: no change needed — the existing `busyRef` guard in `app/page.js` `onFooterLoop` acts as the rate limiter
    - The 300vh wrapper structure and `TOTAL_STEPS` must remain unchanged
    - _Requirements: 9.1–9.8_

  - [~] 14.2 Update `styles/sections/PublicationsFooterSection.module.css` — contact block styles
    - Add `.contactBlock { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }`
    - Add `.contactHeadline { font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 3.5rem); color: var(--text-primary); }`
    - Add `.contactEmail { font-family: var(--font-display); font-size: clamp(1rem, 2.5vw, 1.6rem); color: var(--accent); text-decoration: none; border-bottom: 1px solid var(--accent); }` + hover state
    - Add `.contactSocials { display: flex; gap: 1.5rem; margin-top: 1.5rem; }`
    - Add `.contactSocialLink { color: var(--text-muted); transition: color 0.2s; }` + hover `color: var(--accent-cyan)`
    - _Requirements: 9.1, 9.2, 9.3, 2.6_

  - [ ]* 14.3 Write property test for footer entrance fires exactly once (Property 14)
    - **Property 14: footer entrance animation fires exactly once per page load regardless of threshold crossings**
    - For any number `n > 0` of simulated threshold crossings, assert the GSAP animation is called exactly once; subsequent crossings produce no additional calls
    - Use `fc.integer({ min: 1, max: 20 })` to simulate crossing count
    - **Validates: Requirements 9.4**

- [x] 15. Orchestration — app/page.js wiring
  - [~] 15.1 Update `app/page.js` — swap SkillsMatrixSection for WhatIDoSection + TechStackSection, dispatch nav events
    - Replace `import SkillsMatrixSection from '@/components/sections/SkillsMatrixSection'` with `import WhatIDoSection from '@/components/sections/WhatIDoSection'`
    - Add `import TechStackSection from '@/components/sections/TechStackSection'`
    - In the JSX `<div>` inside `<main>`, replace `<SkillsMatrixSection />` with `<WhatIDoSection />` followed immediately by `<TechStackSection />`
    - In the `goTo()` function, after updating `idxRef.current = idx`, add: `window.dispatchEvent(new CustomEvent('nav-step-change', { detail: { step: idx } }))`
    - In `onScroll()`, also dispatch `nav-step-change` with the current rounded index when scroll position changes
    - In the `fadeLoop()` function, dispatch `nav-step-change` with the `targetIdx` on completion
    - Update the `TOTAL` constant derivation comment to reflect `TOTAL_STEPS = 12 + PROJECT_SLIDES`
    - Retain `SystemArchitectureSection`, `TestimonialsSection`, `GitHubSection` at their updated indices
    - The `<a className="skip-link">` element must remain immediately before `<main>` — do not remove
    - _Requirements: 5.1, 16.8, 13.5_

- [x] 16. Accessibility, performance baseline, and token audit
  - [~] 16.1 Audit all new interactive elements for `:focus-visible` outlines and `aria-label` attributes
    - All icon-only buttons and links in new/modified components (MarqueeStrip — none needed, WhatIDoSection icon hover elements — none needed as `cursor: default`, TechStackSection tiles — `cursor: default` only, Navbar RESUME link — label visible, ContactBlock social links — `aria-label={s.label}` already applied)
    - Verify existing `aria-label` on mute/play buttons in VideoIntro is retained after refactor
    - Add `outline: 2px solid var(--accent)` `:focus-visible` rule to any new `<button>` or `<a>` elements lacking it
    - _Requirements: 12.1, 12.2_

  - [~] 16.2 Verify `will-change` and token reference compliance across all new CSS Modules
    - Confirm `will-change: transform, opacity` is set on GSAP animation targets in: `ScreenLoader.module.css` (splitTop, splitBottom), `HeroSection.module.css` (nameHeader, nameFirst, nameLast), `WhatIDoSection.module.css` (card), `WorkExperienceSection.module.css` (entry/column)
    - Confirm `will-change: transform` on MarqueeStrip `.track`
    - Confirm no raw hex, px font-size, or timing value duplicating a `globals.css` token appears in any CSS Module
    - Confirm no `scroll-snap-type` or `scroll-snap-align` in any stylesheet
    - Confirm all `gsap` imports use `from '@/lib/gsap'` — run `grep -r "from 'gsap'" src` equivalently to verify
    - _Requirements: 11.2, 11.3, 11.4, 11.5, 12.4, 12.5_

- [~] 17. Final checkpoint — Full integration pass
  - Ensure all tests pass, ask the user if questions arise.
  - Verify full scroll sequence: step 0 VideoIntro → step 1 Hero → step 2 About → steps 3–11 Projects → step 12 Architecture → step 13 WhatIDo → step 14 TechStack → step 15 WorkExperience → step 16 Testimonials → step 17 GitHub → steps 18–20 Footer
  - Verify `TOTAL_STEPS === 12 + PROJECT_SLIDES` (21 with 9 projects)
  - Verify ScreenLoader counter animates, split-panel exits, and both events fire before VideoIntro entrance plays
  - Verify `threejs-ready` is dispatched from HeroDigitalCore `onCreated`
  - Verify no `import gsap from 'gsap'` or `import { gsap } from 'gsap'` statements exist anywhere

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- All property tests use `fast-check` (already a dependency or install with `npm install --save-dev fast-check`)
- Requirement 15 (vertical year-anchored timeline) supersedes Requirement 8 for WorkExperienceSection layout only; all other Req 8 criteria (data sourcing, TOTAL_STEPS, GSAP entrance, reduced-motion) remain in force
- `TOTAL_STEPS` changes from `11 + PROJECT_SLIDES` to `12 + PROJECT_SLIDES` (one new step: TechStackSection)
- The `nav-step-change` custom event is the bridge between `app/page.js` scroll state and Navbar active-link tracking — no `useState` added to `page.js`
- Three.js scenes in `components/three/` must always be loaded with `dynamic(…, { ssr: false })` — never imported directly

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4"] },
    { "id": 1, "tasks": ["2.1", "2.2", "3.1", "3.2", "4.1", "4.2"] },
    { "id": 2, "tasks": ["2.3", "2.4", "3.3", "4.3", "4.4", "4.5", "6.1", "6.2"] },
    { "id": 3, "tasks": ["6.3", "6.4", "7.1", "7.2", "7.4", "7.5", "8.1", "8.2", "9.1", "9.2"] },
    { "id": 4, "tasks": ["6.5", "7.3", "7.6", "8.3", "8.4", "10.1", "10.2", "12.1", "13.1", "14.1", "14.2"] },
    { "id": 5, "tasks": ["10.3", "10.4", "14.3", "16.1", "16.2"] },
    { "id": 6, "tasks": ["15.1"] }
  ]
}
```
