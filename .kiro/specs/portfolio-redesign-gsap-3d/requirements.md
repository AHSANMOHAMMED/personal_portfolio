# Requirements Document

## Introduction

A dramatic visual redesign of Ahsan Mohammed's personal portfolio website, inspired by the design language of redoyanulhaque.me. The redesign retains the existing Next.js / GSAP cinematic full-page scroll architecture and all AGENTS.md constraints while introducing: a hybrid percentage-counter screen loader, a bold mixed-typography system with a display serif font, dual counter-scrolling marquee strips between sections, enhanced and new Three.js 3D accents, a "What I Do" roles section (replacing `SkillsMatrixSection`) with an integrated tech icon wall, numbered project cards (01–09), a magazine-style Work Experience layout, and a bold contact block merged into the existing `PublicationsFooterSection`. `VideoIntro` is retained but shortened and styled to blend with the new loader reveal. A secondary cool accent colour (cyan/slate) is introduced alongside the existing orange.

All existing AGENTS.md constraints apply throughout:
- No CSS scroll-snap; scroll is driven exclusively by `goTo(idx)` in `app/page.js` via GSAP.
- CSS Modules only for all component styles; no inline style objects except for GSAP-driven dynamic values.
- GSAP imported from `@/lib/gsap`, never directly from `gsap`.
- All content sourced from `data/profile.json`; no hardcoded names, roles, or social links.
- `app/globals.css` is the single source of truth for design tokens.
- Three.js components loaded with `dynamic(..., { ssr: false })`.
- `PublicationsFooterSection` remains a 300 vh sticky section covering 3 scroll steps.

---

## Glossary

- **Portfolio**: The Next.js personal portfolio application for Ahsan Mohammed.
- **Loader / ScreenLoader**: The full-screen overlay shown on first visit before the portfolio content is revealed. Currently implemented in `components/sections/ScreenLoader.jsx`.
- **HeroSection**: Scroll step 1; contains the oversized name, roles, CTAs, and the 3D digital core (`HeroDigitalCore`).
- **VideoIntro**: Scroll step 0; a short cinematic video/animation before the hero. Currently implemented in `components/sections/VideoIntro.jsx`.
- **MarqueeStrip**: An infinitely looping horizontal text ticker; a pair of MarqueeStrips runs in opposite directions (LTR + RTL).
- **WhatIDoSection**: New section at `components/sections/WhatIDoSection.jsx`, replacing `SkillsMatrixSection` (scroll step `3 + PROJECT_SLIDES + 1`); contains three role cards and an integrated tech icon wall.
- **ProjectsSection**: Existing section covering scroll steps 3 through `3 + PROJECT_SLIDES − 1`; redesigned with bold numbered cards (01, 02 …). Currently in `components/sections/ProjectsSection.jsx`.
- **WorkExperienceSection**: Existing single-step section at `components/sections/WorkExperienceSection.jsx`; redesigned as magazine-style numbered columns.
- **SkillsMatrixSection**: Existing section at `components/sections/SkillsMatrixSection.js`; replaced by `WhatIDoSection` in this redesign, freeing its scroll step slot.
- **PublicationsFooterSection**: Existing 300 vh sticky section (3 scroll steps) at `components/sections/PublicationsFooterSection.jsx`; enhanced with a bold contact/CTA block in its third panel.
- **ThreeScene**: Any Three.js canvas component in `components/three/`, loaded via `dynamic(..., { ssr: false })`.
- **HeroDigitalCore**: Existing Three.js component at `components/three/HeroDigitalCore.js`; uses React Three Fiber (R3F) and renders an icosahedron + wireframe + particle cloud.
- **TOTAL_STEPS**: The exported constant from `lib/navigation.js`; equals `11 + PROJECT_SLIDES` (currently 20 with 9 projects). Must remain 20 after this redesign.
- **Accent_Orange**: CSS custom property `--accent: #f7931e` (already in `globals.css`).
- **Accent_Cyan**: CSS custom property `--accent-cyan: #00f0ff` (already in `globals.css`; promoted to intentional active use).
- **Display_Font**: New serif/display typeface added via `next/font/google`; exposed as CSS variable `--font-display`.
- **Body_Font**: Geist Sans — retained via `--font-geist-sans` / `--font-sans` (already in `globals.css`).
- **GSAP**: The animation library imported exclusively from `@/lib/gsap`.
- **CSS_Modules**: The scoped CSS file pattern (`*.module.css`) used for all component styles.
- **profile.json**: `data/profile.json`; the single source of all portfolio content.
- **content.json**: `data/content.json`; source for site-level copy (tagline, footer CTA lines, interstitial labels).
- **IntersectionObserver**: Browser API used to trigger GSAP entrance animations when sections scroll into view.
- **prefers-reduced-motion**: CSS/JS media feature; all animations must degrade gracefully when active.

---

## Requirements

---

### Requirement 1: Hybrid Percentage-Counter Screen Loader

**User Story:** As a visitor, I want to see a dramatic full-screen loading sequence with a percentage counter climbing from 0 to 100, so that the portfolio makes an immediate cinematic first impression and I know the page is genuinely ready before I enter.

#### Acceptance Criteria

1. WHEN the Portfolio page first loads in a new browser session (i.e. `sessionStorage` key `portfolio-entered` is absent or not equal to `'true'`) AND `prefers-reduced-motion` is not active, THE `ScreenLoader` component SHALL render a full-screen overlay (`position: fixed; inset: 0`) with background colour `var(--bg-dark)` at `z-index` above all page content, covering the entire viewport.

2. THE Loader SHALL display a large percentage counter rendered in the Display_Font (`var(--font-display)`) at `font-size: clamp(4rem, 12vw, 10rem)`, showing integer values from `0%` to `100%` during the animation.

3. WHEN the Loader counter animates, THE counter value SHALL begin incrementing from `0` immediately on mount using a GSAP tween with `ease: 'power2.inOut'`, completing the `0 → 100` run over exactly 2.5 seconds; the counter SHALL display the rounded integer at each frame.

4. THE Loader SHALL gate the reveal on two conditions that must both be true before dismissal: (a) the 2.5-second counter tween has reached `100`, AND (b) a `'threejs-ready'` custom DOM event has been dispatched on `window`. WHILE either condition is unmet, THE counter SHALL display `100%` and hold without triggering the reveal animation.

5. WHEN both conditions in criterion 4 are met, THE Loader SHALL hold at `100%` for exactly 300 ms (via `gsap.delayedCall(0.3, ...)`) before triggering the reveal animation.

6. WHEN the reveal animation fires, THE Loader SHALL execute a split-panel exit: the upper half panel (`styles.splitTop`) SHALL translate from `y: '0%'` to `y: '-100%'` and the lower half panel (`styles.splitBottom`) SHALL translate from `y: '0%'` to `y: '100%'`, both using GSAP with `ease: 'expo.inOut'` over 1.1 seconds, simultaneously revealing portfolio content beneath.

7. WHEN the reveal animation completes (at 1.1 s), THE Loader SHALL: (a) dispatch `new CustomEvent('loader-dismissed')` on `window`, (b) dispatch `new CustomEvent('loader-animation-done')` on `window`, (c) invoke `onDismiss()`. These events SHALL be dispatched in this order.

8. WHEN `sessionStorage` key `portfolio-entered` equals `'true'` at mount time, THE Loader SHALL skip all counter and reveal animation, immediately invoke `onDismiss()`, and dispatch `loader-dismissed` and `loader-animation-done` without visual display.

9. IF `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true` at mount time, THEN THE Loader SHALL immediately invoke `onDismiss()` and dispatch `loader-dismissed` without rendering or animating anything.

10. THE Loader SHALL display `profile.name.full.toUpperCase()` (sourced from `data/profile.json`) as a secondary text element positioned beneath or alongside the counter; this text SHALL use the Body_Font at `var(--text-small)` size.

11. THE Loader SHALL use CSS Modules exclusively (`styles/sections/ScreenLoader.module.css`); the two split-panel elements (`splitTop`, `splitBottom`) SHALL be defined as classes in the CSS Module, not created as inline-styled DOM nodes. All GSAP calls SHALL target class-based refs, not inline `style` attributes.

---

### Requirement 2: Full Design-System Typography Overhaul

**User Story:** As a visitor, I want the portfolio to use a bold mixed-typography system — a Display_Font for all headings and a clean Body_Font for body copy — so that the visual hierarchy is immediately striking and editorial, consistent with the reference site's design language.

#### Acceptance Criteria

1. THE Portfolio SHALL load a Display_Font via `next/font/google` in `app/layout.js` using `display: 'swap'` to prevent FOIT. The chosen typeface SHALL be a high-contrast serif or display sans-serif (e.g. Playfair Display, Cormorant Garamond, or DM Serif Display). The font variable SHALL be applied to the `<html>` element and exposed as CSS custom property `--font-display` in `app/globals.css` under the `:root` block.

2. THE Portfolio SHALL retain Geist Sans (`var(--font-geist-sans)`, already aliased as `--font-sans` in `globals.css`) as Body_Font for all paragraph, label, tag, and UI text elements. No component SHALL assign `var(--font-display)` to body copy, descriptions, or tags.

3. THE Portfolio SHALL add the following new type-scale tokens to the `:root` block of `app/globals.css`:
   - `--display-hero: clamp(4rem, 14vw, 13rem)` — hero oversized name (supplements existing `--hero-name-size`)
   - `--display-section: clamp(2.5rem, 6vw, 5.5rem)` — section headings across all redesigned sections
   - `--display-number: clamp(3rem, 8vw, 7rem)` — bold editorial numbers (01, 02 …)
   - `--text-label: 0.72rem` — aliased from existing `--text-small`
   The existing tokens `--hero-name-size`, `--text-body`, and `--text-small` SHALL be retained unchanged.

4. THE `HeroSection` name heading (`<h1>`) SHALL apply `font-family: var(--font-display)` and `font-size: var(--display-hero)`, rendering `profile.name.first` and `profile.name.last` in uppercase on separate lines.

5. WHEN a section heading is rendered in `AboutSection`, `WhatIDoSection`, `ProjectsSection`, `WorkExperienceSection`, `TestimonialsSection`, or `GitHubSection`, THE heading element SHALL apply `font-family: var(--font-display)` and `font-size: var(--display-section)`.

6. THE Portfolio SHALL use `--accent-cyan` (`#00f0ff`, already in `globals.css`) as an actively rendered accent colour in at least the following contexts: (a) typographic highlights or underlines in at least two section headings, (b) hover states on at least two interactive elements (e.g. nav links, social links), (c) the wireframe material in `HeroDigitalCore`. Incidental usage in `globals.css` does not satisfy this criterion; explicit CSS class rules using `color: var(--accent-cyan)` or `border-color: var(--accent-cyan)` in component CSS Modules do.

7. IF `prefers-reduced-motion` is active, THEN THE Portfolio SHALL render the Display_Font and all updated type-scale tokens without executing any GSAP entrance animation or CSS transition tied to those elements.

8. THE `app/globals.css` SHALL include a `@media (max-width: 767px)` override block setting `--display-hero` to `clamp(3rem, 12vw, 6rem)` and `--display-section` to `clamp(2rem, 8vw, 3.5rem)` for mobile viewports.

---

### Requirement 3: Dual Counter-Scrolling Marquee Strips

**User Story:** As a visitor, I want to see infinite horizontal marquee text strips between key sections, so that transitions feel alive and the design language carries the energy of the reference site.

#### Acceptance Criteria

1. THE Portfolio SHALL include a reusable `MarqueeStrip` component at `components/ui/MarqueeStrip.jsx` that renders an infinitely looping horizontal text ticker. The looping animation SHALL be implemented as a CSS `@keyframes marquee` animation with `animation-timing-function: linear` and `animation-iteration-count: infinite`, defined in `components/ui/MarqueeStrip.module.css`. No GSAP ticker SHALL be used for the loop itself.

2. THE `MarqueeStrip` component SHALL accept the following props:
   - `text` (string, required): the phrase repeated enough times to fill the visible width plus overflow; the text SHALL NOT be hardcoded inside the component — the caller passes it from `profile.json` fields.
   - `direction` (`'ltr'` | `'rtl'`, default `'ltr'`): `'rtl'` SHALL be implemented by applying `animation-direction: reverse` (not `transform: scaleX(-1)`).
   - `speed` (number, default `60`): the inline CSS variable `--marquee-speed` written once as an inline style on the track element only (this is an acceptable GSAP-exempt case as it is a static CSS variable, not a GSAP-driven dynamic value); `animation-duration` in the CSS Module SHALL reference `calc(var(--marquee-speed, 60) * 1s / 100 * var(--track-width))` or equivalent.
   - `accent` (`'orange'` | `'cyan'`, default `'orange'`): controls `color: var(--accent)` vs `color: var(--accent-cyan)` on the text.

3. THE Portfolio SHALL render a pair of `MarqueeStrip` components (one `direction="ltr"`, one `direction="rtl"`) in each of the following locations:
   - Inside `HeroSection`, positioned at the bottom of the section container (below the CTA group), spanning the full section width.
   - Inside `ProjectsSection`, positioned at the bottom of the section container, visible when the last project slide is active.
   - Inside `WorkExperienceSection`, positioned at the bottom of the section container.
   The strip pairs SHALL be rendered as children of their parent section component, not injected in `app/page.js`, so that `TOTAL_STEPS` is not affected.

4. WHEN a `MarqueeStrip` pair is rendered, THE `direction="ltr"` strip SHALL use `accent="orange"` (text colour `var(--accent)`) and THE `direction="rtl"` strip SHALL use `accent="cyan"` (text colour `var(--accent-cyan)`).

5. THE text content passed to each `MarqueeStrip` SHALL originate from `profile.json` fields: use `profile.tagline` for the `HeroSection` pair, `profile.roles.detailed` for the `ProjectsSection` pair, and the first entry of `profile.skills` repeated as a formatted string for the `WorkExperienceSection` pair. No literal string values other than separators (e.g. ` · `) SHALL be hardcoded in the caller.

6. IF `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true`, THEN THE `MarqueeStrip` component SHALL set `animation-play-state: paused` on the track element via a CSS Module conditional class, stopping all motion while keeping the text visible.

7. THE MarqueeStrip container SHALL have `height` ≤ `3rem` and SHALL use `overflow: hidden` so it does not expand section height or affect `TOTAL_STEPS` counting.

---

### Requirement 4: Bold Typographic Hero Section

**User Story:** As a visitor, I want the hero section to immediately communicate Ahsan's identity through oversized typography, a cinematic entrance animation, and a clear set of CTAs, so that the first impression is impactful and memorable.

#### Acceptance Criteria

1. THE `HeroSection` `<h1>` SHALL render `profile.name.first` and `profile.name.last` in separate `<span>` elements in uppercase, using `font-family: var(--font-display)` and `font-size: var(--display-hero)`. On entering the viewport, each line SHALL animate via GSAP from `{ y: 60, opacity: 0 }` to `{ y: 0, opacity: 1 }` with a 120 ms stagger between the two lines (first name, then last name), using `ease: 'power3.out'` over 0.8 s.

2. THE `HeroSection` SHALL display a role/tagline line sourced from `profile.tagline` (with `profile.roles.detailed` as fallback if `profile.tagline` is absent), rendered in Body_Font at `var(--text-body)` size, animating in after the name lines complete (delay ≥ 240 ms from first line start).

3. THE `HeroSection` SHALL retain all existing CTAs: "VIEW WORK" button (scrolls to projects step), "ABOUT ME" button (scrolls to about step), resume download link (`profile.resume`), and social links from `profile.socials`. All CTA text and href values SHALL originate from `profile.json`.

4. WHEN the `HeroSection` `<section>` element intersects the viewport (IntersectionObserver with `threshold: 0.15`), THE GSAP entrance timeline (created with `{ paused: true }`) SHALL be played. The timeline SHALL be killed in the `useEffect` cleanup.

5. THE `HeroSection` SHALL load `HeroDigitalCore` via `dynamic(() => import('@/components/three/HeroDigitalCore'), { ssr: false })` and render it in the right column of the section layout.

6. WHEN `HeroDigitalCore` completes its first render cycle (i.e. the R3F `Canvas` `onCreated` callback fires), THE component SHALL dispatch `new CustomEvent('threejs-ready')` on `window` so the Loader can complete its countdown per Requirement 1 criterion 4.

7. THE `HeroSection` SHALL load `HeroBackground` via `dynamic(() => import('@/components/three/HeroBackground'), { ssr: false })` and render it as an absolutely positioned full-bleed layer within the section.

8. IF `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true`, THEN THE `HeroSection` SHALL render all elements at their final `opacity: 1, y: 0` state via `gsap.set(...)` on mount without playing any entrance timeline.

---

### Requirement 5: "What I Do" Roles Section with Tech Icon Wall

**User Story:** As a visitor, I want to see a dedicated section that clearly communicates Ahsan's three specialisations (Full-Stack, Mobile, Cloud/DevOps) alongside a visual tech icon wall, so that I can quickly understand his skill breadth at a glance.

#### Acceptance Criteria

1. THE Portfolio SHALL replace `SkillsMatrixSection` (currently at scroll step `3 + PROJECT_SLIDES + 1`) with a new `WhatIDoSection` component at `components/sections/WhatIDoSection.jsx`. The new component SHALL occupy exactly 1 scroll step (100 vh height). `TOTAL_STEPS` SHALL remain `11 + PROJECT_SLIDES` (unchanged). `lib/navigation.js` SHALL be updated to reference `WhatIDoSection` in place of `SkillsMatrixSection`, and `app/page.js` SHALL import and render `WhatIDoSection` in the same slot.

2. THE `WhatIDoSection` SHALL render exactly three role cards. Card data SHALL be sourced from a `whatIDo` array added to `data/profile.json`, where each entry contains: `title` (string), `description` (string), and `skills` (array of strings for chip display). If the `whatIDo` key is absent from `profile.json`, the component SHALL render a graceful fallback using the first three entries of `profile.skillCategories`.

3. WHEN the `WhatIDoSection` `<section>` element is within `window.innerHeight * 0.5` pixels of the `main` scroller's `scrollTop` (matching the proximity check pattern used in `AboutSection`), THE component SHALL animate each role card via GSAP from `{ y: 40, opacity: 0 }` to `{ y: 0, opacity: 1 }` with 150 ms stagger between cards, using `ease: 'power3.out'` over 0.6 s. The animation SHALL fire once per page load; re-entering the section SHALL NOT replay it.

4. THE `WhatIDoSection` SHALL render a tech icon wall sub-section displaying icons (SVG sprite or `react-icons` equivalents) for skills from `profile.skillCategories`. Each category group SHALL render its skills as icon + label pairs. Duplicate skill names across categories SHALL appear only once (deduplication by skill name string). No skill name SHALL be hardcoded in the component.

5. WHEN a tech icon element is hovered (on a device with `pointer: fine`), THE `WhatIDoSection` SHALL animate that icon via GSAP: `{ scale: 1 }` → `{ scale: 1.2, duration: 0.2, ease: 'power2.out' }` on `mouseenter`, reverting to `{ scale: 1, duration: 0.15 }` on `mouseleave`. The box-shadow applied SHALL use `0 0 12px var(--accent-glow)`.

6. WHEN the `WhatIDoSection` enters the scroll proximity threshold (same condition as criterion 3), THE icon wall items SHALL animate via GSAP from `{ opacity: 0, y: 20 }` to `{ opacity: 1, y: 0 }` with a 30 ms stagger per icon, using `ease: 'power2.out'` over 0.4 s. This animation SHALL fire in the same pass as the card entrance and SHALL fire only once per page load.

7. THE `WhatIDoSection` SHALL use CSS Modules exclusively (`styles/sections/WhatIDoSection.module.css`). All GSAP calls SHALL target element refs. No inline `style` objects SHALL be used except for GSAP-written properties.

8. THE `WhatIDoSection` section heading SHALL use `font-family: var(--font-display)` and `font-size: var(--display-section)`. The heading text SHALL be `"WHAT I DO"` sourced as a constant — either from a new `sections.whatIDo.heading` key in `data/profile.json` or from a module-level constant read from `profile.json`; it SHALL NOT be a JSX string literal in the component.

9. IF `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true`, THEN THE `WhatIDoSection` SHALL render all cards and icon items at `opacity: 1, y: 0` via `gsap.set(...)` on mount, with no hover scale animations applied.

---

### Requirement 6: Numbered Project Cards

**User Story:** As a visitor, I want to browse projects presented as bold numbered showcase cards (01, 02, 03…) so that the work feels curated, editorial, and premium rather than a standard grid.

#### Acceptance Criteria

1. THE `ProjectsSection` SHALL render a large bold number label for each project — `01`, `02`, … `09` — derived from `index + 1` (zero-padded to two digits). The number label element SHALL use `font-family: var(--font-display)` and `font-size: var(--display-number)`. The tokens `--font-display` and `--display-number` SHALL be defined in `globals.css` per Requirement 2.

2. THE `ProjectsSection` card SHALL display: the bold number label, `project.title`, `project.subtitle`, `project.type` as a type tag, `project.tech` as chip elements, and `project.desc` as a short description paragraph. All values SHALL be sourced from `profile.projects` entries in `data/profile.json`; no project data SHALL be hardcoded in the component.

3. THE `ProjectsSection` SHALL retain its existing horizontal scroll step structure: `PROJECT_SLIDES` individual scroll steps driven by the existing `ScrollTrigger`-based GSAP timeline in the component. `TOTAL_STEPS` SHALL remain unchanged at `11 + PROJECT_SLIDES`.

4. WHEN a project slide becomes the active step (i.e. the `ScrollTrigger` `onUpdate` fires and `activeIdx` changes), THE number label element for that slide SHALL animate via GSAP from `{ y: 30, opacity: 0 }` to `{ y: 0, opacity: 1 }` over 0.7 s with `ease: 'expo.out'`.

5. WHEN the project card container is hovered on a device with `pointer: fine` (desktop), THE card SHALL apply a GSAP `mousemove` listener that sets `rotateX` and `rotateY` based on cursor position within the card; the maximum rotation SHALL be ±8° on each axis, using `gsap.to` with `duration: 0.3, ease: 'power2.out'`. On `mouseleave`, the card SHALL reset to `{ rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' }`.

6. THE "View Details" button inside each project card SHALL continue to open the `ProjectModal` by calling `setSelectedProject(proj)`, consistent with the existing implementation. The `ProjectModal` component SHALL not be removed or replaced.

7. THE `ProjectsSection` SHALL source all project content exclusively from `profile.projects` in `data/profile.json`. No project titles, descriptions, tech stacks, or image paths SHALL be hardcoded in the component.

8. IF `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true`, THEN: (a) the number label SHALL be rendered at `opacity: 1, y: 0` immediately via `gsap.set(...)` without a reveal tween, AND (b) the `mousemove` tilt handler SHALL not be attached.

---

### Requirement 7: Enhanced and New Three.js 3D Scenes

**User Story:** As a visitor, I want the portfolio to feature visually impactful Three.js canvas accents not just in the hero but also in 2–3 other sections, so that the 3D design language is consistent and immersive throughout.

#### Acceptance Criteria

1. THE `HeroBackground` component (`components/three/HeroBackground.jsx`) SHALL be updated: particle count for Layer 1 (fast drifters) SHALL increase from 65 to at least 98 particles; Layer 2 (bokeh blobs) SHALL increase from 22 to at least 33 particles. Additionally, the camera's Y-axis rotation SHALL be incremented by `≤ 0.05` radians per second in the `tick()` loop (e.g. `camera.rotation.y += 0.03 * dt`), creating a slow ambient rotation effect.

2. THE `HeroDigitalCore` component (`components/three/HeroDigitalCore.js`) uses React Three Fiber. The existing wireframe `meshBasicMaterial` SHALL already be set to `color="#00f0ff"` (confirmed in current code). The `pointsMaterial` SHALL be updated to use `color="#00f0ff"` as an alternate particle colour: half the particles (first 100 of 200) SHALL use `#f7931e` and the remaining half SHALL use `#00f0ff` by splitting the `bufferAttribute` data into two `<points>` groups with separate `pointsMaterial` instances.

3. THE Portfolio SHALL include a new `AboutThreeScene` component at `components/three/AboutThreeScene.jsx`. It SHALL render using the raw Three.js API (not R3F). It SHALL contain ≤ 60 floating plane meshes (`PlaneGeometry`) or equivalent lightweight geometry, slowly rotating and drifting. The renderer SHALL use `alpha: true`. It SHALL be loaded in `AboutSection` via `dynamic(() => import('@/components/three/AboutThreeScene'), { ssr: false })` and positioned as an `absolutely` positioned full-bleed layer at `z-index: 0`.

4. THE Portfolio SHALL include a new `WorkExpThreeScene` component at `components/three/WorkExpThreeScene.jsx`. It SHALL render using the raw Three.js API (not R3F). It SHALL contain ≤ 80 particles (a `THREE.Points` geometry) creating a depth-of-field–style sparse field. It SHALL be loaded in `WorkExperienceSection` via `dynamic(() => import('@/components/three/WorkExpThreeScene'), { ssr: false })` and positioned as a full-bleed background layer.

5. WHERE `window.devicePixelRatio > 2`, ALL Three.js renderers (`HeroBackground`, `CinematicLayer`, `AboutThreeScene`, `WorkExpThreeScene`) SHALL call `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`, consistent with the pattern already used in the existing components.

6. WHEN an `IntersectionObserver` (threshold `0.05`) reports a ThreeScene canvas is not intersecting the viewport, THE component SHALL call `cancelAnimationFrame(raf)` to pause the animation loop. WHEN it becomes intersecting again, THE component SHALL restart the loop by calling `requestAnimationFrame(tick)`. This pattern SHALL be implemented in `AboutThreeScene` and `WorkExpThreeScene`, consistent with the existing pattern in `HeroBackground.jsx`.

7. IF `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true`, THEN `AboutThreeScene` and `WorkExpThreeScene` SHALL return early from their `useEffect` before creating a renderer or starting an animation loop. The canvas element SHALL remain in the DOM but empty (transparent background `var(--bg-dark)` applied via CSS Module class).

8. `AboutThreeScene` and `WorkExpThreeScene` SHALL be loaded exclusively with `dynamic(..., { ssr: false })`. Neither component SHALL import or use `@react-three/fiber`, `@react-three/drei`, or any React Three Fiber dependency. All Three.js usage SHALL be via `import * as THREE from 'three'`, consistent with `HeroBackground.jsx` and `CinematicLayer.jsx`.

---

### Requirement 8: Magazine-Style Work Experience Layout

**User Story:** As a visitor, I want the Work Experience section to present entries as bold numbered magazine columns rather than a conventional timeline, so that the layout feels editorial and visually distinct.

#### Acceptance Criteria

1. THE `WorkExperienceSection` SHALL render each experience entry as a distinct vertical column. Each column SHALL display a large bold number (`01`, `02`, `03`) as the column header, using `font-family: var(--font-display)` and `font-size: var(--display-number)`. The tokens SHALL be defined in `globals.css` per Requirement 2 criterion 3.

2. IF `profile.experience` in `data/profile.json` contains one or more entries, THE `WorkExperienceSection` SHALL render exactly one column per entry, sourcing all data from the `profile.experience` array. IF the array is empty, THE section SHALL render a single placeholder column with "No experience entries yet." No experience data (company names, roles, periods, bullet text, tech tags) SHALL be hardcoded in the component.

3. THE `WorkExperienceSection` `<section>` element SHALL have `height: 100vh` (via CSS Module) so it occupies exactly 1 scroll step, consistent with the current `TOTAL_STEPS` budget of `11 + PROJECT_SLIDES`.

4. WHEN the `WorkExperienceSection` `<section>` element is within `window.innerHeight * 0.5` pixels of the `main` scroller's `scrollTop`, THE GSAP entrance timeline SHALL animate each numbered column from `{ y: 60, opacity: 0 }` to `{ y: 0, opacity: 1 }` with a 200 ms stagger between columns, using `ease: 'power3.out'` over 0.7 s per column, imported from `@/lib/gsap`. This animation SHALL fire exactly once per page load; subsequent re-entries to the section SHALL leave columns at their final state.

5. THE column SHALL render the following fields from each `profile.experience` entry: `exp.company` (as column title), `exp.role` (as subtitle), `exp.period` and `exp.periodEnd` joined as `"${exp.period} – ${exp.periodEnd}"` (as date range), `exp.type` (as a tag chip), `exp.bullets` (as an unordered list), and `exp.tech` (as tag chips).

6. THE `WorkExperienceSection` SHALL NOT render the SVG timeline line (`snakeLine`), connecting dot elements (`dot`, `dotNum`), or any equivalent horizontal/vertical connector SVG. The numbered column layout replaces this pattern entirely.

7. WHEN a column element is hovered on a viewport width ≥ 768 px, THE `WorkExperienceSection` SHALL apply a GSAP background transition: `{ backgroundColor: 'transparent' }` → `{ backgroundColor: 'rgba(247, 147, 30, 0.04)', duration: 0.3, ease: 'power2.out' }` on `mouseenter`, reverting to transparent on `mouseleave`. GSAP SHALL be imported from `@/lib/gsap`.

8. IF `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true`, THEN THE `WorkExperienceSection` SHALL render all columns at `opacity: 1, y: 0` via `gsap.set(...)` on mount. No entrance animation or hover background transition SHALL be applied.

9. THE `WorkExperienceSection` CSS Module SHALL define tokens `--font-display` and `--display-number` via `var()` references to the `globals.css` root tokens, not hardcoded values.

---

### Requirement 9: Bold Contact Block in PublicationsFooterSection

**User Story:** As a visitor, I want to see a bold, unmissable contact call-to-action with social links and email when I reach the end of the portfolio, so that I know exactly how to get in touch with Ahsan.

#### Acceptance Criteria

1. THE `PublicationsFooterSection` footer panel (the third visible state within its 300 vh scroll travel, when `footerFade > 0`) SHALL include a prominently sized contact headline rendered in `font-family: var(--font-display)` at `clamp(2.5rem, 6vw, 5.5rem)` (`var(--display-section)`). The headline text SHALL be sourced from a new `contactHeadline` field in `data/profile.json`; if the field is absent, THE component SHALL fall back to the string from `content.footer.ctaLines` joined with a space.

2. THE contact block SHALL display `profile.email` as a `<a href="mailto:...">` element rendered in `font-family: var(--font-display)` at `font-size: clamp(1.8rem, 4vw, 3.5rem)`. The `href` attribute value SHALL be dynamically constructed as `` `mailto:${profile.email}` `` sourced from `data/profile.json`.

3. THE contact block SHALL render all entries in `profile.socials` as `<a>` elements with: icon (from the existing `SOCIAL_ICONS` map), label text (`social.label`), `href={social.href}`, `target="_blank"`, and `rel="noopener noreferrer"`. IF a `social.label` has no registered icon in `SOCIAL_ICONS`, THE component SHALL render the label text only (no icon), without throwing an error.

4. WHEN the footer panel's `footerFade` value (driven by the scroll position in `onScroll`) first exceeds `0.05`, THE contact headline and email link SHALL animate via GSAP from `{ y: 40, opacity: 0 }` to `{ y: 0, opacity: 1 }` with a 150 ms stagger between elements, using `ease: 'power3.out'` over 0.6 s. The animation SHALL fire at most once per page session (guarded by a `footerAnimDone` ref).

5. THE `PublicationsFooterSection` SHALL continue to dispatch `new CustomEvent('footer-loop-back')` on `window` when the scroll distance `dist` exceeds `2 * window.innerHeight` (i.e. the user scrolls past the full 300 vh wrapper), consistent with the existing `onFooterLoop` handler in `app/page.js`. This event SHALL be dispatched at most once per scroll-past (guarded by a ref flag that resets when `dist` drops below `1.8 * window.innerHeight`).

6. THE `PublicationsFooterSection` SHALL remain a single component spanning the full 300 vh wrapper (`className={styles.wrapper}` with `height: 300vh`). It SHALL NOT be split into separate section components. `TOTAL_STEPS` SHALL remain `11 + PROJECT_SLIDES`.

7. THE `PublicationsFooterSection` SHALL source all contact content — email, social links, name — exclusively from `data/profile.json` and site copy from `data/content.json`. No email addresses, URLs, or names SHALL be hardcoded as JSX string literals in the component.

8. IF `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true`, THEN THE contact headline and email link SHALL render at `opacity: 1, y: 0` via `gsap.set(...)` on mount; no entrance animation SHALL be applied.

---

### Requirement 10: Shortened VideoIntro Blended with Loader Reveal

**User Story:** As a visitor, I want the VideoIntro to feel like a continuation of the dramatic loader reveal rather than a separate, redundant intro, so that the opening sequence is cohesive and doesn't overstay its welcome.

#### Acceptance Criteria

1. THE `VideoIntro` entrance GSAP timeline (the multi-step staggered sequence in the existing `useEffect`) SHALL be refactored so the total visible animation from first element appearing to last element reaching final state completes in ≤ 2.7 s (down from the current ~2.7 s sum that starts immediately on mount). The exit auto-scroll triggered by the video `onEnded` event SHALL occur within 2 s of the video ending.

2. WHEN `window` dispatches the `'loader-animation-done'` custom event (fired by the Loader on reveal completion), THE `VideoIntro` SHALL begin its GSAP entrance timeline. The existing `useEffect` that listens for `'loader-animation-done'` (currently calling `v.play()`) SHALL be extended to also trigger the entrance timeline. The entrance timeline SHALL NOT start on mount unconditionally; it SHALL be initiated only by this event listener. The delay between `loader-animation-done` firing and the first animated element becoming visible SHALL be ≤ 16 ms (one frame).

3. THE `VideoIntro` entrance timeline SHALL begin with a single fade+scale animation of `mainVideoWrapRef.current` from `{ opacity: 0, scale: 1.05 }` to `{ opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }`, replacing the existing `{ scale: 1.15 → 1, opacity: 0 → 1, duration: 1.8 }` treatment. The subsequent eyebrow and name character animations SHALL be retained but their timings compressed to start no earlier than 0.3 s from the timeline start.

4. THE `VideoIntro` `<section>` element SHALL remain as scroll step 0 (first child of the `<div>` inside `<main>` in `app/page.js`). `TOTAL_STEPS` in `lib/navigation.js` SHALL NOT be modified as a result of this requirement.

5. THE `VideoIntro` SHALL source all text content from `data/profile.json` (`profile.name.first`, `profile.name.last`, `profile.roles.detailed`) and `data/content.json` (`content.site.tagline`). No name strings, role strings, or tagline strings SHALL be hardcoded as JSX string literals in the component.

6. IF `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true`, THEN THE `VideoIntro` SHALL: (a) render all elements at `opacity: 1` at their final positions without any GSAP entrance timeline, (b) not autoplay the video (consistent with the existing `autoPlay={!isReducedMotion}` prop), and (c) show the scroll cue button immediately without awaiting the timeline.

---

### Requirement 11: Design Token Consistency Across All Sections

**User Story:** As a developer maintaining the portfolio, I want all visual values (colours, spacing, type scales, timing) to be defined as CSS custom properties in `app/globals.css` and consumed via CSS Modules, so that the redesign is maintainable and globally consistent.

#### Acceptance Criteria

1. THE `app/globals.css` `:root` block SHALL define all new tokens introduced by this redesign: `--font-display`, `--display-hero`, `--display-section`, `--display-number`, and `--text-label`. Existing tokens (`--accent`, `--accent-cyan`, `--bg-dark`, `--hero-name-size`, `--text-body`, `--text-small`, `--accent-glow`, `--cyan-glow`) SHALL be retained unchanged.

2. WHEN any component CSS Module references a design token defined in `globals.css`, THE rule SHALL use `var(--token-name)` syntax. No raw hex colour, px font-size, or timing value that duplicates a `globals.css` token SHALL appear in any component's CSS Module.

3. THE Portfolio SHALL NOT introduce any new inline `style` prop objects in JSX except for values that GSAP writes dynamically at runtime (`transform`, `opacity`, `will-change`). The `--marquee-speed` CSS variable written to a single track element (per Requirement 3 criterion 2) is an approved exception.

4. THE Portfolio SHALL NOT introduce any CSS rule containing `scroll-snap-type` or `scroll-snap-align` in any stylesheet file.

5. THE Portfolio SHALL NOT contain any `import { gsap } from 'gsap'` or `import gsap from 'gsap'` statement. All GSAP usage SHALL use `import { gsap } from '@/lib/gsap'` or `import { gsap, ScrollTrigger } from '@/lib/gsap'`.

6. THE Portfolio SHALL NOT hardcode `profile.name.full`, `profile.email`, `profile.roles`, `profile.skills`, `profile.projects`, or `profile.socials` as string literals in component JSX or CSS. All such content SHALL originate from `data/profile.json` or `data/content.json`.

7. THE `app/globals.css` SHALL include a `@media (max-width: 767px)` override block that sets mobile-specific values for `--display-hero` and `--display-section` per Requirement 2 criterion 8. All other new tokens whose values are viewport-invariant SHALL appear only in the `:root` block.

---

### Requirement 12: Accessibility and Performance Baseline

**User Story:** As a visitor using assistive technology or a lower-powered device, I want the portfolio to remain accessible and performant after the redesign, so that the visual ambition does not come at the cost of usability.

#### Acceptance Criteria

1. THE Portfolio SHALL ensure all interactive elements (buttons, links, project modal trigger, nav links) retain a visible `:focus-visible` outline using `outline: 2px solid var(--accent)` or `outline: 2px solid var(--accent-cyan)`, consistent with the existing `skip-link:focus-visible` pattern in `globals.css`.

2. THE Portfolio SHALL maintain `aria-label` attributes on all icon-only interactive elements: social link anchors (where label text is visually hidden), mute/play toggle buttons in `VideoIntro`, and any new icon-only buttons introduced by this redesign.

3. WHEN an `IntersectionObserver` reports any Three.js canvas (`HeroBackground`, `CinematicLayer`, `AboutThreeScene`, `WorkExpThreeScene`) is not intersecting the viewport (threshold `0.05`), THE component SHALL call `cancelAnimationFrame(raf)` to suspend its GPU loop. WHEN it becomes intersecting again, THE component SHALL call `requestAnimationFrame(tick)` to resume.

4. THE CSS Module for `ScreenLoader`, `HeroSection`, `WhatIDoSection`, and `WorkExperienceSection` SHALL include `will-change: transform, opacity` on the elements targeted by GSAP entrance animations, applied as a CSS Module class property (not an inline `style` prop).

5. THE `MarqueeStrip` CSS Module SHALL include `will-change: transform` on the scrolling track element that the CSS `marquee` animation runs on.

6. IF `prefers-reduced-motion` is active, THEN the global rule in `globals.css` (`animation-duration: 0.01ms !important; transition-duration: 0.01ms !important`) SHALL already suppress all CSS animations and transitions. All GSAP timelines SHALL additionally check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before playing, consistent with the pattern used in existing components.

7. THE `app/page.js` SHALL retain the `<a className="skip-link" href="#portfolio-content">Skip to portfolio content</a>` element immediately before the `<main>` element, unchanged.

8. THE Display_Font SHALL be loaded via `next/font/google` with `display: 'swap'` in `app/layout.js` to prevent FOIT on initial load.

9. WHEN `AboutThreeScene` and `WorkExpThreeScene` are mounted, EACH SHALL create an `IntersectionObserver` with `threshold: 0.05` on the canvas element and SHALL NOT start its `requestAnimationFrame` loop until the first `isIntersecting: true` callback fires, consistent with the pattern in `HeroBackground.jsx`.

---

### Requirement 13: Minimal Floating Navbar Redesign

**User Story:** As a visitor, I want to see a clean, minimal all-caps floating navbar with `ABOUT`, `WORK`, `CONTACT`, and `RESUME` links — matching the reference site's navigation style — so that navigation feels modern and unobtrusive.

#### Acceptance Criteria

1. THE `Navbar` component SHALL be redesigned so that nav link labels are rendered in all-caps using `font-family: var(--font-body)` (Body_Font) at `var(--text-label)` size (`0.72rem`) with `letter-spacing: 0.15em`. The links SHALL be sourced from `lib/navigation.js` `NAV_ITEMS` (label + scroll index); no hardcoded labels in the component.

2. THE `Navbar` SHALL float over content using `position: fixed; top: 0; left: 0; right: 0; z-index: 1000` with a transparent background by default. WHEN the user has scrolled past step 0 (VideoIntro), THE Navbar background SHALL transition to `var(--bg-dark)` with `opacity: 0.85` and a `backdrop-filter: blur(12px)` applied via GSAP or CSS transition over 0.3 s.

3. THE `Navbar` SHALL include a `RESUME` link that opens/downloads `profile.resume` sourced from `data/profile.json`, rendered as an `<a>` element with `download` or `target="_blank"` attribute, consistent with how other CTA resume links work in the portfolio.

4. WHEN a nav link is hovered (on `pointer: fine` devices), THE link text SHALL transition to `color: var(--accent-cyan)` over 0.2 s via CSS transition in the CSS Module (not GSAP).

5. THE active nav link (corresponding to the currently visible scroll step) SHALL be visually distinguished by `color: var(--accent)` and a 2px underline `border-bottom: 2px solid var(--accent)`. The active index SHALL be tracked by listening to the existing scroll events in `app/page.js` via a custom DOM event or by reading a shared ref, without adding `useState` to `app/page.js`.

6. THE `Navbar` SHALL use CSS Modules exclusively (`styles/ui/Navbar.module.css`). No inline style objects other than GSAP-driven values.

7. IF `prefers-reduced-motion` is active, THEN THE Navbar background transition SHALL occur instantly (no duration) and no GSAP animations SHALL be applied.

---

### Requirement 14: Animated Role Word Switcher in Hero

**User Story:** As a visitor, I want to see an animated role word cycling beneath my name in the hero section — switching between specialisations like "FULL-STACK ENGINEER", "MOBILE DEVELOPER", "CLOUD ENGINEER" — so that my identity is communicated dynamically.

#### Acceptance Criteria

1. THE `HeroSection` SHALL render an animated role switcher element beneath the name heading. The switcher SHALL cycle through role strings sourced from a new `profile.roleCycle` array in `data/profile.json` (e.g. `["FULL-STACK ENGINEER", "MOBILE DEVELOPER", "CLOUD & DEVOPS"]`). If `profile.roleCycle` is absent, the switcher SHALL fall back to displaying `profile.roles.short` as static text.

2. THE role switcher SHALL use a GSAP clip-path or `y`-translate swap animation: the outgoing role animates out via `{ clipPath: 'inset(0 0 100% 0)', duration: 0.4, ease: 'power2.in' }` and the incoming role animates in via `{ clipPath: 'inset(0 0 0% 0)', duration: 0.4, ease: 'power2.out' }` with a 100 ms overlap. Each role SHALL be visible for 2.5 seconds before cycling to the next.

3. THE role switcher SHALL loop infinitely through all entries in `profile.roleCycle`. WHEN the last entry is displayed and its display time elapses, THE switcher SHALL cycle back to the first entry.

4. THE role switcher text SHALL use `font-family: var(--font-body)` (Body_Font) at `var(--text-body)` size in `color: var(--accent-cyan)` with `letter-spacing: 0.1em` and `text-transform: uppercase`.

5. THE role switcher SHALL start cycling only after the `HeroSection` entrance timeline has completed (i.e. after the `onComplete` callback of the GSAP timeline). It SHALL NOT cycle while the section is not visible.

6. IF `prefers-reduced-motion` is active, THEN THE role switcher SHALL display the first role string as static text with no cycling or animation.

7. THE role switcher container SHALL have `overflow: hidden` and a fixed height matching one line of text so that the swap animation does not cause layout shift.

8. On `useEffect` cleanup (component unmount), all cycling intervals and GSAP tweens for the role switcher SHALL be killed.

---

### Requirement 15: Vertical Year-Anchored Career Timeline

**User Story:** As a visitor, I want to see my career and education history presented as a vertical timeline with year labels on the left and role descriptions on the right — matching the reference site's career section — so that my journey is easy to scan chronologically.

#### Acceptance Criteria

1. THE `WorkExperienceSection` SHALL render experience entries as a vertical timeline layout: a left column containing the year/period label and a right column containing the role, company, type tag, description, and tech tags. This replaces the requirement in Requirement 8 for magazine columns (Requirement 8 is superseded by this requirement for layout only; all other criteria from Requirement 8 regarding data sourcing, TOTAL_STEPS budget, GSAP entrance animation, and reduced-motion handling remain in force).

2. THE timeline year label (left column) SHALL display `exp.period` (e.g. `"2025"` or `"NOW"`) in `font-family: var(--font-display)` at `clamp(1.5rem, 3vw, 2.5rem)`, coloured `var(--accent)` for the most recent entry and `var(--text-muted)` for all others.

3. THE right column SHALL display: `exp.role` as the entry title in `font-family: var(--font-display)` at `1.1rem`, `exp.company` as a subtitle, `exp.type` as a tag chip, and `exp.bullets` as a compact unordered list. `exp.tech` chips SHALL be rendered beneath the bullets.

4. THE entries SHALL be connected by a vertical line in the left margin (a `1px` solid `var(--border-dim)` line), with a `6px` circular dot `var(--accent)` at each entry's year-label level. The most-recent entry dot SHALL pulse with a `box-shadow: 0 0 0 6px var(--accent-glow)` CSS animation to indicate currency (matching the reference site's "NOW" indicator).

5. WHEN the `WorkExperienceSection` enters the scroll proximity threshold (within `window.innerHeight * 0.5` of `scrollTop`), the vertical line SHALL animate from height `0` to its full height via GSAP `scaleY: 0 → 1` with `transformOrigin: 'top center'` over 1.2 s, followed by each entry staggering in from `{ y: 30, opacity: 0 }` to `{ y: 0, opacity: 1 }` with a 150 ms stagger. This animation SHALL fire once per page load.

6. THE `WorkExperienceSection` SHALL NOT render the horizontal `snakeLine` or the existing dot/entry pattern; this vertical timeline replaces both the existing horizontal timeline (Requirement 8.6) and the magazine column layout previously specified.

7. THE `WorkExperienceSection` SHALL source all content exclusively from `profile.experience` in `data/profile.json`. No content SHALL be hardcoded.

8. IF `prefers-reduced-motion` is active, THEN all elements SHALL render at final opacity/position via `gsap.set(...)` and the vertical line SHALL render at full height without animation.

---

### Requirement 16: Standalone Tech Stack Section

**User Story:** As a visitor, I want to see a dedicated full-screen section showing Ahsan's complete technology stack as a dense icon + label grid — matching the reference site's prominent TECH STACK section — so that I can quickly assess the breadth of his technical skills.

#### Acceptance Criteria

1. THE `WhatIDoSection` tech icon wall (from Requirement 5) SHALL be separated into a new standalone `TechStackSection` component at `components/sections/TechStackSection.jsx` occupying exactly 1 scroll step (100 vh). The `WhatIDoSection` shall retain its three role cards but SHALL NOT include the icon wall. `TOTAL_STEPS` SHALL be updated to `12 + PROJECT_SLIDES` to accommodate the new section (i.e. one additional step). `lib/navigation.js` SHALL be updated accordingly.

2. THE `TechStackSection` SHALL render all skills from `profile.skillCategories` as icon + label tiles. Each tile SHALL display the skill name in `font-family: var(--font-body)` at `var(--text-label)` size. Tiles SHALL be arranged in a CSS `flex-wrap: wrap` grid with `gap: 0.75rem`.

3. THE `TechStackSection` section heading SHALL read `"TECH STACK"` sourced from a new `sections.techStack.heading` field in `data/profile.json` (fallback: `"TECH STACK"`), rendered in `font-family: var(--font-display)` at `var(--display-section)`.

4. WHEN the `TechStackSection` enters the viewport (within `window.innerHeight * 0.5` of `scrollTop`), ALL tile elements SHALL animate via GSAP from `{ opacity: 0, y: 20 }` to `{ opacity: 1, y: 0 }` with a 25 ms stagger per tile, using `ease: 'power2.out'` over 0.35 s per tile. This SHALL fire once per page load.

5. WHEN a tile is hovered on `pointer: fine` devices, THE tile SHALL animate via GSAP: `scale: 1 → 1.15`, `border-color: var(--accent-cyan)` transition over 0.2 s, reverting on `mouseleave`. IF `prefers-reduced-motion` is active, no hover animation SHALL be applied.

6. THE `TechStackSection` SHALL use CSS Modules exclusively (`styles/sections/TechStackSection.module.css`).

7. IF `prefers-reduced-motion` is active, THEN all tiles SHALL render at `opacity: 1, y: 0` on mount. No hover animations SHALL be applied.

8. THE section SHALL be inserted in `app/page.js` at step `3 + PROJECT_SLIDES + 2` (after `WhatIDoSection`), and all subsequent step indices in `lib/navigation.js` SHALL be incremented by 1 to maintain accurate navigation.
