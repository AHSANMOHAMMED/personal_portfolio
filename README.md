# Ahsan Mohammed | Cinematic Portfolio

An animated, data-driven Next.js portfolio for Ahsan Mohammed, focused on full-stack engineering, mobile products, SaaS, ERP/POS systems, cloud deployment, and practical software delivery.

## Stack

- Next.js 16.2.6 with React 19
- Static export for GitHub Pages
- GSAP and ScrollTrigger for the cinematic navigation and section motion
- Three.js for restrained hero, intro, and footer effects
- CSS Modules for component styles
- JSON-driven portfolio content

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run build
```

The production build writes the static export to `out/`.

## Architecture

- `app/page.js` owns the full-page controller and transition lock.
- `components/sections/` contains the intro, hero, about, projects, experience, collaboration, and contact/footer sections.
- `components/ui/` contains navigation, the project dialog, cursor, and shared UI pieces.
- `components/three/` contains browser-only decorative scenes. Each scene is dynamically loaded and cleans up its renderer, observers, and animation frame.
- `lib/navigation.js` derives navigation destinations from the project count so adding a project does not silently invalidate the navbar.
- `lib/siteConfig.js` is the source of truth for the GitHub Pages origin, base path, and public asset URLs.

## Content editing

Update verified portfolio content in:

- `data/profile.json` - identity, biography, skills, experience, projects, publications, social links, resume, and collaboration principles.
- `data/content.json` - hero labels, footer copy, and presentation labels.

Do not add unverified testimonials, client claims, user counts, revenue, employment details, or live URLs. Missing evidence should remain omitted until confirmed.

## Interaction and accessibility

The cinematic wheel/touch transitions are enabled on capable desktop screens. Small screens and reduced-motion users use normal scrolling. The site also supports keyboard section navigation with Arrow keys, Page Up/Down, Home, and End.

The project viewer is an accessible dialog with Escape handling, focus trapping, focus restoration, labelled controls, touch-friendly carousel buttons, and background scroll locking. Browser zoom is enabled, and a skip-to-content link is available to keyboard users.

With `prefers-reduced-motion: reduce`, the loader is skipped, intro autoplay and decorative Three.js animation are disabled, and essential content remains available without sweeping transitions.

## Media and performance

- The intro uses one video element with a poster and metadata preload rather than decoding duplicate video layers.
- Hero and intro Three.js effects pause when their scene is off-screen or the document is hidden.
- Three.js is not loaded during reduced-motion mode.
- Below-fold project images remain lazy-loaded.
- Footer video playback begins only when the footer transition reaches its video phase.

Keep large videos and images compressed, preserve explicit dimensions/aspect ratios, and test the production export before publishing.

## GitHub Pages deployment

The deployment workflow is `.github/workflows/deploy.yml`. It builds with Node 20, uploads `out/`, and deploys through GitHub Pages.

The configured production URL is:

`https://AHSANMOHAMMED.github.io/personal_portfolio`

If the repository name or deployment host changes, update `BASE_PATH` and `SITE_ORIGIN` in `lib/siteConfig.js` together with `next.config.mjs`.

## Known limitations

- The current portfolio still uses a custom full-screen desktop experience, so browser testing should cover wheel, touch, keyboard, reduced motion, and 200% zoom.
- Static export cannot provide server-side contact forms; the portfolio uses verified email and external profile links instead.
- Dependency vulnerabilities reported by `npm install` should be reviewed separately before upgrading packages.
