# PORTFOLIO V2 STRATEGIC PLAN — AHSANMOHAMMED

## 1. Executive Summary
Transform `personal_portfolio-main` into **AHSANMOHAMMED PORTFOLIO V2** — a high-performance, cinematic, WebGL/3D-powered developer portfolio that communicates mature software engineering capability ("I build digital systems that solve real problems").

## 2. Architectural Blueprint
- **Framework:** Next.js 16.2.6 (App Router) + React 19.
- **Scroll Engine:** Lenis Smooth Scroll integrated with GSAP ScrollTrigger (`@/lib/gsap`). Respects `AGENTS.md` constraint while providing fluid section scrolling.
- **Styling Architecture:** Modern CSS Modules for component scoping (`*.module.css`) + CSS Custom Properties in `globals.css`.
- **3D & WebGL Stack:** Three.js + custom shaders / interactive canvas loaded with `dynamic(..., { ssr: false })`.
- **Data Source:** `data/profile.json` as single source of truth for all project descriptions, skills, metrics, and bio.

## 3. Section Roadmap & Feature Specs
1. **Section 00 — Preloader:** Tech metadata, progress percentage counter, subtle canvas particle backglow (1.5–2s max).
2. **Section 01 — Hero:** "AHSAN MOHAMMED / FULL-STACK SOFTWARE ENGINEER". Continuous abstract 3D Digital Core visual responding to cursor/scroll. Magnetic buttons & text reveals.
3. **Section 02 — Editorial Intro:** Scroll-triggered typography ("I DON'T JUST WRITE CODE. I BUILD SYSTEMS.").
4. **Section 03 — About:** Product thinking, System Design, AI integration, databases, cloud deployment, and Hafiz/Moulavi background highlights.
5. **Section 04 — Project Showcase & Case Studies:** Cinematic 3D project cards for Doorli, Retail Smart ERP, Farmora, MediConnect Lanka, Doorli Enterprise OS, AetherForge IDE, etc. Filterable & expandable mini-case studies (Problem, Solution, Architecture, Tech, Results).
6. **Section 05 — System Architecture ("BEHIND THE INTERFACE"):** Interactive dynamic flow diagram showing client -> edge -> API gateway -> microservices -> DB / cache / queue -> deployment pipelines.
7. **Section 06 — Interactive Skills System:** Categorized technical system matrix (Frontend, Backend, Database, Mobile, Infra/DevOps, AI).
8. **Section 07 — Experience & Timeline:** Cinematic vertical timeline with dynamic line drawing on scroll.
9. **Section 08 — GitHub Identity ("BUILT IN PUBLIC"):** Live stats, language distribution, top repository cards with graceful fallback on API limit.
10. **Section 09 — Cinematic Contact CTA:** High-impact typography ("LET'S BUILD SOMETHING MEANINGFUL"), interactive background, social links, resume download, contact modal.

## 4. Performance & Accessibility Strategy
- **Performance:** Dynamic imports for Three.js, frustum culling, pixel-ratio capping, WebP assets, zero unneeded renders. Target Lighthouse >= 90.
- **Accessibility:** Full keyboard navigation, proper ARIA landmark roles, custom cursor fallback on mobile/touch, reduced-motion overrides.
- **SEO:** Complete JSON-LD schema (Person, WebSite, SoftwareApplication), OpenGraph tags, sitemap.xml, robots.txt, canonical URLs using `lib/siteConfig.js`.

## 5. Implementation Phases
- **Phase 1-2:** Audit & Core Infrastructure (Lenis, GSAP, Custom Cursor, Preloader)
- **Phase 3-5:** Hero 3D Core, Editorial Intro, About Section
- **Phase 6-8:** Interactive Case Studies, System Architecture Visualization, Skills Matrix
- **Phase 9-11:** Work Experience Timeline, GitHub Integration, Contact CTA
- **Phase 12-15:** SEO, Accessibility, Mobile Optimization, Lighthouse Audit & Verification
