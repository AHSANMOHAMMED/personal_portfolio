# Ahsan — 3D Animated Developer Portfolio

A premium, responsive developer portfolio built with React, Vite, Three.js and GSAP.

## Features

- Interactive glass-like 3D hero object
- GSAP entrance and scroll-triggered animation
- Magnetic call-to-action interaction
- Responsive cinematic layout
- Nine detailed project showcases with product UI demonstrations
- Interactive case-study panels with project-specific feature lists
- Professional internship and education timeline
- Complete grouped technical toolbox
- Real email, phone, GitHub and LinkedIn contact links
- Project, experience, about, skills and contact sections
- Accessible semantic HTML and SEO metadata
- GitHub Pages / Vercel / Netlify ready

## Enhancement specification

For the complete GSAP, Three.js, accessibility, performance, project-demo, SEO and testing implementation brief, read [`PORTFOLIO_ENHANCEMENT_MASTER_PROMPT.md`](./PORTFOLIO_ENHANCEMENT_MASTER_PROMPT.md). It can be pasted directly into Cursor, Windsurf, Antigravity, Claude Code, Codex, or another repository-aware coding agent.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Personalize

1. Update projects, skills, timeline or profile details in `src/data.js`.
2. Update page structure and biography in `src/App.jsx`.
3. Adjust colors from the CSS variables at the top of `src/styles.css`.
4. Add exact repository URLs to each project as they become public.

## Deploy

Push the repository to GitHub and import it into Vercel or Netlify. Build command: `npm run build`; output folder: `dist`.
