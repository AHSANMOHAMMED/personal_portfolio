# AI Agent Instructions

## Next.js version

This project uses **Next.js 16.2.6** — breaking changes exist vs. older versions.
Read `node_modules/next/dist/docs/` before writing any Next.js-specific code.
Heed deprecation notices.

## Key project constraints

- **Lenis + ScrollTrigger** drive smooth scrolling (initialized in `components/ui/Navbar.jsx`). Do not add CSS `scroll-snap-type`. Home scroll starts after the loading intro (`lib/initialFX.js` calls `lenis.start()`).
- **GSAP from `@/lib/gsap`** — not imported directly from `gsap`. This ensures ScrollTrigger is registered.
- **All portfolio content in `data/profile.json`** — do not hardcode names, roles, or social links in components. The `/play` chat system prompt is also built from this file.
- **Design tokens** live in `app/globals.css` and `styles/reference/portfolio-home.css` (`--accentColor`, `--backgroundColor`). Prefer those variables.
- Section / Character scroll scrubbing uses **stable global class hooks** (e.g. `landing-section`, `about-section`, `whatIDO`, `character-model`) required by `lib/GsapScroll.js`.
- **`lib/siteConfig.js`** exports `SITE_URL` / `BASE_PATH`. Use `assetUrl()` for public asset paths.
- **Three.js Character** (`components/three/Character/`) must be loaded with `dynamic(..., { ssr: false })` and only on desktop (`>1024`). It is an imperative Three.js scene (not R3F).
- **Hosting is Vercel** (not static GitHub Pages). `/api/chat` requires `GROQ_API_KEY`. Do not re-enable `output: 'export'` without removing the chat API.
- Visual experience is adapted from the MIT-licensed [red1-for-hek/portfolio-website](https://github.com/red1-for-hek/portfolio-website) template; keep attribution in the README/contact footer.
