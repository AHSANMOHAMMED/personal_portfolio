# Ahsan Mohammed — Current Portfolio Enhancement Master Prompt

This prompt is tailored to the existing **Next.js 16 + React 19 + GSAP + Three.js cinematic portfolio** described in the repository audit. It is not a generic rebuild prompt.

## How to use

1. Open the real `personal_portfolio-main` repository in Cursor, Windsurf, Antigravity, Claude Code, Codex, or another repository-aware coding agent.
2. Give the agent access to the complete repository.
3. Paste everything under **MASTER IMPLEMENTATION PROMPT**.
4. Let the agent audit before editing.
5. Review factual content changes before publishing.

---

# MASTER IMPLEMENTATION PROMPT

You are a senior creative frontend engineer, interaction designer, accessibility specialist, Three.js performance engineer, and Next.js architect. Enhance my existing portfolio in place. Do not replace it with a generic portfolio template and do not discard its cinematic identity.

## Current application context

The repository is already a data-driven cinematic portfolio for **Ahsan Mohammed**, built with:

- Next.js 16
- React 19
- GSAP and ScrollTrigger
- Three.js / React Three Fiber
- CSS Modules
- Static export for GitHub Pages under `/personal_portfolio`
- Video introduction and video backgrounds
- Full-screen slide navigation
- Horizontal project navigation
- Responsive desktop, tablet, and mobile layouts
- SEO metadata, Open Graph, Twitter cards, sitemap, robots and JSON-LD
- Vercel Analytics

The experience currently contains:

1. Screen loader
2. Video introduction
3. Hero section
4. About section
5. Projects section
6. Work experience
7. Testimonials
8. Publications and contact/footer sequence

The existing visual identity uses warm orange and amber accents, dark cinematic backgrounds, large typography, layered imagery, video and 3D effects. Preserve and refine this identity.

## Verified portfolio positioning

- Name: Ahsan Mohammed
- Third-year SLIIT Software Engineering undergraduate
- Full-stack software engineer
- Mobile application developer
- Cloud and DevOps enthusiast
- Sri Lankan developer open to remote opportunities
- Main areas: web, mobile, SaaS, ERP/POS, enterprise systems, cloud, microservices and developer tooling

Current featured projects:

1. Doorli
2. Retail Smart ERP
3. Farmora App
4. Doorli Enterprise OS
5. MediConnect Lanka
6. AetherForge IDE
7. Arabic College Portal
8. Aura Academic
9. Nexus Core

Never invent project metrics, users, revenue, clients, testimonials, employment claims, publications, repository links, live links or technical implementations. If content is not verified in the repository, mark it as needing owner confirmation.

## Primary goal

Turn the current technically impressive portfolio into a credible, accessible, fast and memorable recruitment portfolio. Keep the cinematic storytelling while ensuring that visitors can quickly understand:

- Who Ahsan is
- What he specializes in
- Which work is real, academic, experimental or in progress
- What role he performed in each project
- Which technologies he can confidently use
- How to contact or evaluate him

The enhancement must make the site feel more polished without adding visual noise or unnecessary effects.

---

## Phase 1 — Audit before modification

Inspect these areas before editing:

- `app/page.js`
- `app/layout.js`
- `next.config.mjs`
- `components/sections/*.jsx`
- `components/ui/*.jsx`
- `components/three/*.jsx`
- `styles/**/*.module.css`
- `data/profile.json`
- `data/content.json`
- GSAP initialization utilities
- sitemap and robots generators
- manifest and Open Graph image implementation
- GitHub Pages workflow
- media files, portraits, project galleries and resume
- all lockfiles and package manifests

First produce a concise audit containing:

- Current component architecture
- Content data flow
- Full-screen navigation state model
- GSAP timelines and ownership
- Three.js render loops and assets
- Video loading behavior
- Static export/base-path behavior
- Accessibility problems
- Performance bottlenecks
- Broken, placeholder or unverified content
- Console, lint and build issues

Do not edit until this audit is complete.

---

## Phase 2 — Fix confirmed production issues first

### 2.1 Testimonials credibility

Several testimonial entries contain `INSERT_NAME`. Do not publish fake or incomplete testimonials.

Implement one of these safe outcomes:

1. If verified names, roles, organizations and exact recommendation text exist, use them.
2. If they do not exist, remove the incomplete testimonial cards and replace the section with a truthful “Collaboration principles” or “How I work” section.

Do not keep anonymous recommendations presented as verified testimonials. Do not invent identities.

### 2.2 GitHub Pages URL consistency

Create one centralized site configuration containing:

```js
export const siteConfig = {
  origin: 'https://AHSANMOHAMMED.github.io',
  basePath: '/personal_portfolio',
  url: 'https://AHSANMOHAMMED.github.io/personal_portfolio',
};
```

Adjust this only if the real deployed repository name is different. Use this configuration consistently for:

- Next.js `basePath`
- `assetPrefix` when required
- canonical URL
- sitemap
- robots
- JSON-LD
- Open Graph/Twitter images
- resume and downloadable assets
- local images and video URLs
- internal links

Create a helper for base-path-safe public assets. Do not scatter hardcoded `/personal_portfolio` strings through components.

### 2.3 Open Graph image failure

Fix the reported portrait-loading failure during Open Graph image generation.

- Prefer a build-safe local asset or an explicit static Open Graph image.
- Ensure static export does not require a runtime image fetch.
- Validate the generated image path under the GitHub Pages base path.
- Confirm the production build no longer reports this warning.

### 2.4 Multiple lockfiles and lint configuration

- Identify the intended package manager.
- Keep one authoritative lockfile for this application.
- Configure Next.js workspace root correctly when the surrounding workspace cannot be changed.
- Add the missing TypeScript dependency only if required by the current lint/tooling configuration.
- Make `npm run lint` or the repository’s chosen lint command execute successfully.
- Do not migrate JavaScript files to TypeScript merely to silence a tooling issue.

### 2.5 Mobile zoom

Remove `userScalable: false` and `maximumScale: 1`. Allow browser zoom. Confirm that 200% zoom does not hide essential content or controls.

---

## Phase 3 — Improve the navigation architecture

The existing portfolio disables normal document scrolling and converts wheel/touch input into full-screen transitions. Preserve the cinematic slide experience on capable desktop devices, but make it progressively enhanced rather than mandatory.

### Requirements

- Normal content must remain reachable when JavaScript or GSAP fails.
- Do not permanently set the document to an unusable `overflow: hidden` state.
- Add keyboard support for Arrow Up, Arrow Down, Page Up, Page Down, Home, End, Enter and Escape where appropriate.
- Do not intercept keyboard commands when focus is inside a button, link, input, textarea, select or dialog.
- Provide visible section navigation with correct labels and active state.
- Ensure browser Back behavior is not broken.
- Respect touch scrolling and avoid accidental transitions during horizontal gestures.
- Use a transition lock to prevent multiple wheel events from skipping several sections.
- Add an alternative standard-scroll mode for reduced-motion users and small screens.
- Keep deep links and section IDs meaningful.
- Restore focus after programmatic transitions when appropriate.

Create section/project navigation from data instead of hardcoded indexes. Derive counts and destinations from the same section/project definitions used for rendering.

Recommended model:

```js
const sections = [
  { id: 'hero', label: 'Home', component: HeroSection },
  { id: 'about', label: 'About', component: AboutSection },
  { id: 'projects', label: 'Projects', component: ProjectsSection },
  { id: 'experience', label: 'Experience', component: WorkExperienceSection },
  { id: 'impact', label: 'Impact', component: ImpactSection },
  { id: 'contact', label: 'Contact', component: ContactSection },
];
```

Do not hardcode navigation values that silently break when a project or section is added.

---

## Phase 4 — Establish one motion system

The portfolio already has many animations. Do not simply add more. Audit, consolidate and refine them.

### Create reusable motion tokens

```js
export const motion = {
  duration: {
    fast: 0.25,
    normal: 0.6,
    section: 1.0,
    cinematic: 1.4,
  },
  ease: {
    standard: 'power3.out',
    emphasized: 'power4.inOut',
  },
};
```

### GSAP rules

- Register plugins once.
- Use `gsap.context()` inside React components.
- Revert contexts on unmount.
- Kill ScrollTriggers and observers when sections unmount.
- Do not create duplicate timelines on every render.
- Use refs instead of global class selectors when components can repeat.
- Prefer transforms and opacity over layout properties.
- Avoid overlapping timelines fighting over the same transform.
- Do not hide critical content by default unless JavaScript immediately establishes and controls that state.
- Pause animation when the page is hidden.

### Refined motion choreography

- Loader: shorten repeat visits; support session-based skip.
- Intro: make video optional and immediately skippable.
- Hero: use one strong text reveal, subtle portrait depth and controlled Three.js movement.
- About: animate supporting elements after the biography becomes readable.
- Projects: connect progress indicator, title, media and metadata in one timeline.
- Experience: animate the timeline based on entry visibility.
- Impact/publications: prioritize readable evidence over effects.
- Contact: finish with one clear visual transition and direct CTA.

No animation should delay access to project information or contact actions.

---

## Phase 5 — Complete reduced-motion behavior

Create a `useReducedMotion` hook using `window.matchMedia('(prefers-reduced-motion: reduce)')` and respond to preference changes.

In reduced-motion mode:

- Use standard vertical scrolling.
- Skip the screen loader automatically.
- Do not autoplay the video introduction.
- Replace full-screen slide transitions with immediate navigation.
- Stop decorative GSAP timelines.
- Disable pointer parallax and magnetic movement.
- Pause or render a static Three.js frame.
- Use a static image/gradient instead of the footer shader/video.
- Keep every section and all essential content visible.
- Preserve small functional state changes without sweeping motion.

Add CSS fallbacks with `@media (prefers-reduced-motion: reduce)`.

---

## Phase 6 — Three.js enhancement and optimization

There are already hero particles, intro bokeh effects and a video-based footer shader. Refine these scenes instead of adding more independent canvases.

### Scene architecture

- Lazy-load every Three.js scene using `next/dynamic` with SSR disabled only for the canvas component.
- Wrap scenes in Suspense and an error boundary.
- Add CSS/static-image fallbacks.
- Clamp DPR: approximately `Math.min(window.devicePixelRatio, 1.5)` on desktop and `1` on lower-powered mobile devices.
- Pause render loops when the tab is hidden or the scene is outside the viewport.
- Use `frameloop="demand"` for scenes that do not need continuous motion.
- Dispose geometries, materials, textures and video textures.
- Reuse geometry/material where practical.
- Avoid high polygon counts and excessive transparent layers.
- Respect the device’s power/performance conditions.

### Hero scene

- Keep the hero scene focused on identity and engineering.
- Create restrained pointer parallax on desktop.
- Link scroll/slide progress to a small camera or object transformation.
- Do not let the canvas capture pointer events needed by navigation.
- Keep hero name, role and CTA as accessible HTML.

### Video intro bokeh

- Reduce particles on mobile.
- Ensure playback controls remain usable above the canvas.
- Do not render effects while video is paused or off-screen.
- Provide a “Skip intro” action immediately.
- Remember a visitor’s skip/completion state for the current session.

### Footer video shader

- Load only when the footer approaches the viewport.
- Do not create two simultaneously decoding video elements unless essential.
- Provide poster and gradient fallback.
- Pause and release the video when it is not visible.
- Use the portrait fallback on mobile only if it loads faster and remains readable.

---

## Phase 7 — Improve project storytelling

The project descriptions are already detailed. Improve their clarity and credibility.

For every project, render these fields from `profile.json` or a normalized project data source:

- Title
- One-line value proposition
- Honest type: professional, academic, personal, concept, framework or in progress
- Status
- Problem
- Solution
- My role
- Main responsibilities
- Important features
- Architecture/technical approach
- Technologies
- Main engineering challenge
- What I learned
- Verified GitHub URL
- Verified live URL
- Gallery with meaningful alt text

If a field is unavailable, omit it. Never fill missing evidence with marketing claims.

### Project overview enhancements

- Show project category and status before opening the modal.
- Add a concise “My contribution” line.
- Make technology chips readable rather than purely decorative.
- Make project progress/count dynamic from the data length.
- Add keyboard-operable previous/next project controls.
- Allow swipe on touch devices without blocking vertical page navigation.
- Preload only adjacent project media.
- Lazy-load the rest.

### Project modal redesign

Upgrade the current modal into an accessible case-study dialog:

- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` connected to the project title
- Initial focus inside the dialog
- Focus trap
- Escape key closes
- Overlay click closes
- Close button has an accessible label
- Background scroll is locked only while open
- Trigger focus is restored on close
- Screen reader announces the opened project
- Mobile uses a full-height drawer/panel
- GSAP opening/closing timeline respects reduced motion

Do not render a link button when its URL is missing or unverified.

---

## Phase 8 — Strengthen the content hierarchy

### Hero

The first viewport must answer within a few seconds:

- Ahsan Mohammed
- Full-stack software engineer
- Primary specialization
- Location/remote availability
- View projects
- Contact/download resume

Keep the cinematic styling, but do not make the user wait through the loader and video to discover this information. Add a clearly visible skip path.

### About

Use a concise professional biography first. Place longer personal, multilingual, educational and Islamic scholarship context in clearly separated supporting blocks. Ensure that professional positioning stays prominent for recruiters.

### Skills

Replace any technology-logo overload with categories and evidence:

- Frontend
- Backend
- Mobile
- Databases
- Cloud/DevOps
- Architecture
- Testing and collaboration

Do not use fake skill percentages. Where possible, connect key skills to projects.

### Work and education

Clearly distinguish employment, internship, university education and religious scholarship. Use exact dates and organization names already verified in the repository.

### Publications and impact

The current portfolio has two publication-style impact claims. Verify whether each item is actually:

- A published paper
- A technical article
- A case study
- A project achievement
- A proposed concept

Rename the section and item types honestly. Add source links only when verified. Do not imply academic publication if no publication exists.

### Testimonials alternative

If verified testimonials are unavailable, create a “How I work” section using truthful principles such as ownership, learning, communication, documentation and iterative delivery. Do not write quotes attributed to imaginary people.

---

## Phase 9 — Performance engineering

Measure before and after using the production build.

### Loading priorities

- Critical: navigation, hero copy, primary CTA and essential hero image.
- Deferred: video intro if skippable, project galleries, Three.js scenes, testimonials/impact media and footer video.
- Lazy-load below-fold images with correct dimensions.
- Use poster images for videos.
- Prefer modern formats such as WebP/AVIF where the export workflow supports them.
- Avoid loading desktop and mobile video variants simultaneously.

### Runtime improvements

- Use IntersectionObserver to activate heavy sections only near visibility.
- Pause video, shader and animation loops off-screen.
- Debounce/limit wheel and resize work.
- Avoid forced layout during transitions.
- Memoize stable project presentation components only where profiling supports it.
- Remove unused dependencies and dead backup imports.
- Keep `backup_v2_aug2026` outside the production source/import graph.

### Targets

- No application console errors.
- No missing asset requests.
- No hydration warnings.
- No layout shift caused by images/video.
- Interactive controls should respond immediately.
- Aim for Lighthouse 90+ in accessibility, SEO and best practices.
- Improve performance as far as possible without destroying the visual identity.

Document any target that cannot be met and the measured reason.

---

## Phase 10 — Accessibility

Implement and validate:

- A skip-to-content link
- Semantic header, nav, main, sections and footer
- One logical H1 and structured heading order
- Visible `:focus-visible` states
- At least 44px touch targets where practical
- Meaningful button/link labels
- Decorative canvases and videos hidden from assistive technology
- Alt text for informative project images
- Empty alt text for decorative images
- Captions/transcript or meaningful text alternative for information-bearing video
- Keyboard operation of navigation, projects, media controls and modal
- Zoom support
- Color contrast meeting WCAG AA for normal text
- No essential information conveyed only through color, motion or 3D
- Reduced-motion implementation described earlier

Test with keyboard only and at 200% browser zoom.

---

## Phase 11 — SEO and deployment correctness

Centralize and validate:

- Title template
- Description
- Canonical URL
- Open Graph URL and image
- Twitter card
- `metadataBase`
- Person JSON-LD
- WebSite JSON-LD
- Sitemap
- Robots
- Manifest
- Favicon and icons

Use only verified identity and social links. Ensure all absolute URLs include the correct GitHub Pages project base path.

For static export:

- Run the export/build locally.
- Inspect the generated `out` directory.
- Confirm index, CSS, JavaScript, portrait, resume, videos, Open Graph image and project media resolve under `/personal_portfolio`.
- Confirm direct loading from the deployed project URL works.
- Verify the GitHub Actions workflow publishes the intended output directory.

---

## Phase 12 — Maintainability

Keep `profile.json` as the main content source, but normalize the schema where required. Move duplicated strings from components into configuration/data when the data can reasonably change.

Recommended separation:

```text
app/
  layout.js
  page.js
components/
  navigation/
  sections/
  projects/
  ui/
  three/
config/
  site.js
  navigation.js
data/
  profile.json
  content.json
hooks/
  useReducedMotion.js
  useSectionNavigation.js
  usePageVisibility.js
lib/
  assets.js
  gsap.js
  seo.js
styles/
```

Do not perform a large folder refactor unless it improves clear ownership. Prioritize safe behavior over moving files.

---

## Phase 13 — Verification commands

Use the package manager established by the repository and run:

```bash
npm install
npm run lint
npm run build
npm run dev
```

If scripts differ, use and document the repository’s actual commands.

Verify manually:

- First visit and repeat visit
- Skip intro
- Video play/pause and mute
- Desktop wheel navigation
- Keyboard navigation
- Touch navigation
- Reduced-motion mode
- JavaScript/animation failure fallback
- Every project slide
- Every project dialog
- Every verified external link
- Resume download
- Contact links
- GitHub Pages base-path assets
- 320px, 375px, 430px, 768px, 1024px, 1280px and 1440px widths
- 200% zoom
- Tab switching/background behavior

Check that no private customer data, API key, environment secret, phone data dump or internal credential is included in the static export.

---

## Required acceptance criteria

The enhancement is complete only when:

- The existing cinematic identity remains recognizable.
- Placeholder testimonials are removed or replaced with verified content.
- GitHub Pages URLs and assets are consistent.
- Open Graph image generation/export works.
- Build and lint run successfully.
- Mobile zoom is enabled.
- Keyboard users can reach all sections and projects.
- Reduced-motion mode disables custom slide motion, videos and unnecessary 3D loops.
- Navigation/project indices are data-driven.
- Project modal is a proper accessible dialog.
- Three.js and video work is lazy-loaded and paused when invisible.
- Essential content is readable without completing the intro.
- Project types, roles and statuses are honest and clear.
- Publications/impact items are labelled according to evidence.
- No fake testimonial, statistic, link or achievement is introduced.
- No console error, asset 404 or hydration warning remains.
- README documents architecture, content editing, media optimization, accessibility, build and GitHub Pages deployment.

---

## Required final response from the coding agent

After implementation, report:

1. Executive summary
2. Issues fixed
3. UX and animation improvements
4. Accessibility improvements
5. Performance improvements
6. SEO/deployment improvements
7. Files added, removed and modified
8. Lint and build results
9. Manual test results
10. Remaining content requiring Ahsan’s verification
11. Deployment instructions

Begin now with the repository audit. Then implement in the stated priority order. Do not ask broad design questions when the existing design system already answers them. Ask only when a missing fact would force an unverified personal, project, publication, testimonial or deployment claim.

# END MASTER IMPLEMENTATION PROMPT

---

## Short execution command

After saving this file in the real portfolio repository, you can use:

```text
Read CURRENT_PORTFOLIO_ENHANCEMENT_PROMPT.md completely. Audit the existing Next.js 16 portfolio and implement the enhancement in the specified phases. Preserve the cinematic orange/amber identity, fix confirmed production issues before adding effects, do not invent content or links, fully support keyboard and reduced-motion users, optimize video and Three.js work, verify the GitHub Pages base path, run lint and production build, and update the README with evidence of the final result.
```

## Priority checklist

### Critical

- [ ] Remove or verify `INSERT_NAME` testimonials
- [ ] Correct canonical/base-path/asset URL configuration
- [ ] Fix Open Graph image build warning
- [ ] Resolve lockfile/workspace warning
- [ ] Restore lint by resolving missing TypeScript dependency/configuration
- [ ] Enable mobile zoom
- [ ] Make project dialog accessible
- [ ] Add keyboard and reduced-motion navigation paths

### High value

- [ ] Generate navigation and project indexes from data
- [ ] Make intro immediately skippable
- [ ] Avoid forcing visitors through loader/video
- [ ] Lazy-load Three.js and video scenes
- [ ] Pause render/video work off-screen
- [ ] Clearly label project status and Ahsan’s contribution
- [ ] Verify publication/impact claims
- [ ] Remove duplicated content from components

### Polish

- [ ] Refine GSAP choreography rather than adding excessive motion
- [ ] Improve project media loading and alt text
- [ ] Add session-aware loader/intro behavior
- [ ] Improve focus-visible states and touch targets
- [ ] Add performance and accessibility notes to README
