# Ahsan Mohammed | 3D Portfolio

Interactive developer portfolio for Ahsan Mohammed — Lenis smooth scroll, GSAP section motion, a scroll-linked Three.js character, project showcase, tech stack, plus `/play` chess and Groq-powered AI chat.

## Stack

- Next.js 16.2.6 + React 19
- GSAP + ScrollTrigger + Lenis
- Three.js (desktop character scene)
- chess.js + RedoxChess WASM engine
- Groq chat API (`/api/chat`)

## Local development

```bash
npm install
cp .env.example .env.local   # add GROQ_API_KEY for /play chat
npm run dev
```

Open `http://localhost:3000`.

## Content

Edit verified portfolio content in:

- `data/profile.json` — identity, about, experience, projects, skills, social links
- `data/content.json` — optional presentation labels

## Deploy (Vercel)

This app is intended for **Vercel** (serverless `/api/chat`). Set `GROQ_API_KEY` in the project environment. Optionally set `NEXT_PUBLIC_SITE_ORIGIN` to your production URL.

```bash
npm run build
npm start
```

## Attribution

The scroll-linked 3D character experience, section motion patterns, and `/play` chess/chat UX are adapted from the MIT-licensed template:

- [red1-for-hek/portfolio-website](https://github.com/red1-for-hek/portfolio-website)
- Live reference: [redoyanulhaque.me](https://www.redoyanulhaque.me/)

Content, branding, and system prompt are customized for Ahsan Mohammed.

## Validation

```bash
npm run lint
npm run build
```
