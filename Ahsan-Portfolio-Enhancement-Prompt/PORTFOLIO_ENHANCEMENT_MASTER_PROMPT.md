# Ahsan Mohammed Portfolio — GSAP + 3D Enhancement Master Prompt

> Copy everything from **BEGIN PROMPT** to **END PROMPT** into Cursor, Windsurf, Antigravity, Claude Code, Codex, or another coding agent while the portfolio repository is open.

---

## BEGIN PROMPT

You are a senior creative developer, interaction designer, Three.js engineer, and frontend performance specialist. Upgrade my existing React portfolio into a polished, memorable, recruitment-ready experience. Work directly in the existing repository; inspect all current files before changing anything.

Do not replace the portfolio with a generic template. Preserve my verified content, identity, existing functionality, and working links. Enhance the implementation progressively and keep the application deployable throughout the work.

### 1. Portfolio owner and positioning

- Name: **Ahsan Mohammed**
- Role: **Full-Stack & Platform Developer**
- Location: **Puttalam, Sri Lanka**
- Education: Third-year BSc (Hons) Information Technology undergraduate specializing in Software Engineering at SLIIT
- Email: `ahsanmohammed828@gmail.com`
- Phone: `+94 72 50 68 682`
- GitHub: `https://github.com/AHSANMOHAMMED`
- LinkedIn: `https://www.linkedin.com/in/ahsan-m-s-m-13048b324`
- Main positioning: Building scalable SaaS, POS, ERP, local-commerce, web and mobile products

The finished portfolio must communicate engineering ability, product thinking, practical experience, reliability, curiosity, and attention to visual detail. The audience is recruiters, engineering managers, clients, collaborators, and other developers.

### 2. Required technology

Use the current React and Vite codebase. Use these tools where appropriate:

- React and modern component composition
- GSAP with `ScrollTrigger` for timelines and scroll animation
- Three.js through `@react-three/fiber`
- `@react-three/drei` helpers
- CSS custom properties and responsive CSS
- Lucide React icons

Avoid adding a large dependency when the same result can be achieved cleanly with existing dependencies. Do not migrate the application to another framework unless explicitly instructed.

### 3. Non-negotiable engineering rules

1. Inspect `package.json`, `src`, `public`, project data, existing styles, and README before editing.
2. Preserve all verified personal information and project content.
3. Never invent project statistics, companies, testimonials, client names, repository URLs, live demo links, employment claims, or technologies.
4. Use data-driven project rendering rather than duplicating card markup.
5. Split oversized components into focused reusable components.
6. Clean up every GSAP context, event listener, animation frame, observer, timer, and Three.js resource.
7. Respect `prefers-reduced-motion` and provide a complete low-motion experience.
8. Provide a static or lightweight fallback when WebGL is unavailable.
9. Do not block page content while 3D assets load.
10. Do not add autoplay audio, scroll hijacking, fake terminals, fake analytics, fake GitHub data, excessive particle effects, or a custom cursor that harms usability.
11. Keep keyboard navigation, focus visibility, semantic structure, contrast, and screen-reader support intact.
12. Ensure `npm run build` finishes successfully with no runtime errors.

### 4. Visual direction

Create a premium dark editorial interface with a controlled neon-lime accent, warm secondary colors for project identities, subtle grid texture, high-quality typography, generous whitespace, and strong visual hierarchy.

The experience should feel like a creative engineering portfolio—not a gaming website. Motion must reinforce meaning and hierarchy. Use depth, light, glass, blur, perspective, and texture carefully. Avoid visual noise.

Design tokens must include:

- Background, surface, elevated surface, foreground, muted text and border colors
- Primary and secondary accent colors
- Spacing scale
- Radius scale
- Shadow and glow presets
- Fluid typography using `clamp()`
- Motion duration and easing tokens
- Container widths and responsive breakpoints

### 5. Global experience enhancements

Implement:

- A compact initial loading transition showing the `AM` monogram and progress state
- A direct-content fallback so loading never traps the visitor
- Smooth route-free section navigation
- Active navigation state based on the visible section
- A minimal reading/scroll progress indicator
- High-quality page entrance and exit-like section transitions
- Subtle pointer-responsive lighting on capable desktop devices
- Strong focus-visible styles
- Skip-to-content link
- “Back to top” control near the footer
- Reusable animated heading component
- Reusable reveal component with reduced-motion handling
- Consistent hover, pressed, focus and disabled states

### 6. Three.js hero scene

Enhance the hero into a high-quality interactive 3D signature piece.

Requirements:

- Keep the object abstract and connected to software/platform engineering
- Use a refined torus knot, network core, glass orb, or layered geometric system
- Use physically believable materials and controlled environment lighting
- Add gentle pointer parallax and slow idle rotation
- Add a GSAP-driven entrance sequence
- Connect scroll progress to restrained camera/object movement
- Clamp device pixel ratio for performance
- Pause or reduce animation when the tab is hidden
- Reduce complexity on mobile and low-powered devices
- Provide a CSS/static fallback if WebGL initialization fails
- Prevent canvas interaction from blocking navigation or page scrolling
- Add accessible nearby text; do not rely on the canvas to communicate essential information

Do not create thousands of particles. Keep draw calls, geometry density, post-processing and textures within a sensible budget.

### 7. GSAP motion system

Create a coherent animation language:

- Hero headline mask reveal with staggered lines
- Supporting text and CTA entrance after the primary headline
- Navigation entrance after critical content
- Scroll-triggered section-label, heading and body reveals
- Project cards entering with stagger and depth
- Project visual parallax contained inside each card
- Text-marquee movement connected to scroll speed
- Timeline line/progress animation in the experience section
- Skill-group stagger with restrained hover response
- Contact section color transition and CTA reveal
- Magnetic CTA behavior only for precise pointer devices

Use `gsap.context()` scoped to components. Kill ScrollTriggers on cleanup. Avoid animating layout properties such as width, height, top and left when transforms or opacity can produce the effect. Avoid stacking multiple animations on the same property without a deliberate timeline.

### 8. Project showcase requirements

Keep and improve all confirmed project entries:

1. RetailerPOS Cloud
2. Doorli
3. Doorli Enterprise OS
4. Retail Smart ERP
5. Hotel Management
6. Food Management
7. Zesty Mart
8. Online Job Portal
9. WhatsApp Reply Bot

Each project must include:

- Project number, title, category and honest status
- Clear outcome-focused summary
- Technology chips
- Feature list
- Project-specific visual demonstration
- “View case study” action
- GitHub or demo action only when a verified link exists
- Keyboard-operable interactions

Do not use the same generic mockup for every project. Build small, lightweight UI demonstrations:

#### RetailerPOS Cloud

Show a polished retail dashboard with sales overview, checkout summary, inventory alert, barcode/product area, top products, role badge and recent transactions. Represent these as demonstration data, not real customer data.

#### Doorli

Show a local delivery map interface with restaurant/store cards, active order, driver route, ETA, delivery status steps and wallet/payment element.

#### Doorli Enterprise OS

Show a system operations view with services, Kafka event flow, webhook delivery state, deployment pipeline, backup status and health indicators.

#### Retail Smart ERP

Show a multi-module business dashboard with POS, inventory, accounting, HR/payroll, work orders and appointment modules.

#### Hotel Management

Show room availability, reservations, guest profile, staff/manager/admin role states, approval request and occupancy summary.

#### Food Management

Show menu categories, food cards, dietary badges, cart, takeaway status, rating summary and AI/OCR import indicator.

#### Zesty Mart

Show grocery catalogue, category navigation, cart quantity controls, order summary and notification state.

#### Online Job Portal

Show job search, filters, job cards and application status.

#### WhatsApp Reply Bot

Show a conversation interface, rule/workflow nodes, automated response state and webhook status.

The UI demonstrations must be responsive, decorative, fast, and visibly related to each product. Label demonstration data when necessary. Never expose real customer data.

### 9. Project case-study experience

Replace the basic modal with an accessible case-study drawer or modal:

- Use `role="dialog"`, `aria-modal="true"` and labelled heading
- Lock background scroll while open
- Move focus into the dialog
- Trap focus inside
- Close with Escape, close button and overlay click
- Restore focus to the triggering button
- Animate in/out with GSAP
- Display problem, solution, responsibilities, features, architecture, technologies, challenges, lessons and current status where verified content exists
- Avoid invented outcomes and numbers

On mobile, use a full-screen panel with a sticky close button.

### 10. Experience and education

Present the timeline clearly and honestly:

- Full-Stack Engineering Intern, Aupview Technology, March–September 2026
- RetailerPOS Cloud work in a five-member team
- Responsibilities: authentication/onboarding, dashboards, quotations, sales/returns, purchasing, inventory, barcodes, products/variants, customers, suppliers, employees, roles/access control, reports, settings, subscriptions/billing, marketing workflows, APIs, testing, debugging and real customer-data migration
- SLIIT BSc (Hons) IT, Software Engineering specialization, third year
- Diploma in IT, ICBT, 2023
- Diploma in English, Headway Language School, 2023

Add a tasteful timeline progress animation. The content must remain fully visible without JavaScript or motion.

### 11. Skills presentation

Group skills by meaningful engineering area rather than displaying an unstructured logo wall:

- Frontend and UI engineering
- Backend and APIs
- Databases and data systems
- Cloud, DevOps and platform engineering
- Mobile development
- Testing, debugging and collaboration

Use icons sparingly. Do not assign fake percentage proficiency values. Add short evidence text connecting key skills to real projects.

### 12. Contact and social section

Include verified links only:

- Email
- Phone
- GitHub
- LinkedIn
- Location

Add copy-email functionality with accessible success feedback. Ensure `mailto:` and `tel:` links work. Open external social links in a new tab with `rel="noreferrer"`. Create a visually impressive GSAP footer reveal without reducing readability.

### 13. Responsive behavior

Test and optimize at:

- 320px
- 375px
- 430px
- 768px
- 1024px
- 1280px
- 1440px and larger

Requirements:

- No horizontal overflow
- No clipped headings
- No overlapping 3D canvas and hero copy
- Comfortable tap targets of approximately 44px
- Usable project modals/drawers
- Simplified motion and 3D on small screens
- Navigation remains accessible with and without JavaScript animation

### 14. Performance targets

- Lazy-load the 3D scene and other non-critical heavy components
- Place the canvas behind a suspense boundary and error fallback
- Code-split project case studies if useful
- Keep fonts and icons efficient
- Use CSS gradients instead of large decorative images when practical
- Avoid forced layout in pointer and scroll handlers
- Use `will-change` only temporarily or on justified elements
- Target Lighthouse performance, accessibility, best-practices and SEO scores of 90 or higher on a production build where realistically possible
- Eliminate the oversized JavaScript bundle warning where practical by splitting Three.js code from initial content

### 15. Accessibility requirements

- Semantic landmarks: header/nav/main/section/footer
- Logical heading order
- Skip link
- Visible keyboard focus
- Full keyboard operation
- Accessible dialogs
- Descriptive labels for icon-only buttons
- Decorative canvas hidden from the accessibility tree
- WCAG AA contrast for normal text
- `prefers-reduced-motion` support in both CSS and JavaScript
- Do not hide essential content behind animation initial states

### 16. SEO and sharing

Add or verify:

- Unique page title and description
- Canonical URL placeholder documented for deployment
- Open Graph title, description, image and URL
- Twitter card metadata
- Person and WebSite JSON-LD using verified facts
- Correct favicon and web manifest
- `robots.txt`
- `sitemap.xml` with documented deployment URL replacement
- Meaningful section IDs and link text

Do not add fake review/rating schema.

### 17. Reliability and error handling

- Add an application-level error boundary
- Add a WebGL error fallback
- Prevent one animation failure from hiding the page
- Avoid undefined React/JSX runtime errors
- Validate every imported asset path
- Ensure refresh and direct loading work on the deployment target
- Keep external links centralized in data/configuration

### 18. Recommended file organization

Refactor toward this structure when appropriate:

```text
src/
  components/
    common/
      AnimatedHeading.jsx
      ErrorBoundary.jsx
      MagneticLink.jsx
      Reveal.jsx
      SectionLabel.jsx
    layout/
      Header.jsx
      Footer.jsx
    hero/
      Hero.jsx
      HeroScene.jsx
      HeroFallback.jsx
    projects/
      ProjectGrid.jsx
      ProjectCard.jsx
      ProjectDemo.jsx
      CaseStudyDialog.jsx
    sections/
      About.jsx
      Experience.jsx
      Skills.jsx
      Contact.jsx
  data/
    profile.js
    projects.js
  hooks/
    useReducedMotion.js
    useActiveSection.js
    useWebGLSupport.js
  styles/
    tokens.css
    global.css
    components.css
  App.jsx
  main.jsx
```

Do not refactor solely for appearance. Preserve a simpler structure if it is already clean and maintainable.

### 19. Implementation sequence

Complete the work in this order:

1. Audit the existing project and report the current architecture and risks.
2. Fix runtime errors, broken assets, console errors and accessibility blockers.
3. Centralize verified portfolio content.
4. Establish tokens, layout and responsive foundations.
5. Split reusable components.
6. Implement the loading, navigation and global motion system.
7. Enhance the Three.js hero with fallbacks.
8. Create unique project UI demonstrations.
9. Implement the accessible case-study experience.
10. Enhance experience, skills, about and contact sections.
11. Add SEO, structured data and social metadata.
12. Optimize loading and split heavy bundles.
13. Test all breakpoints, motion preferences, keyboard paths and external links.
14. Run production build and resolve all errors.
15. Update README with setup, architecture, customization, accessibility, performance and deployment instructions.

### 20. Required validation

Run and report:

```bash
npm install
npm run build
npm run dev
```

Also verify:

- Browser console contains no application errors
- Favicon loads without a 404
- All navigation links reach the correct section
- Every case study opens and closes correctly
- Escape and focus behavior work
- Email, phone, GitHub and LinkedIn links work
- WebGL fallback works
- Reduced-motion mode keeps all content visible
- Mobile layout has no horizontal overflow
- Refreshing the deployed page works

If linting or automated tests are not configured, add lightweight, suitable configuration only when it meaningfully improves reliability. Do not spend most of the task on tooling.

### 21. Definition of done

The task is complete only when:

- The portfolio has no runtime errors
- `npm run build` succeeds
- The 3D hero is visually strong but performant
- GSAP animations are intentional, smooth and cleaned up correctly
- All nine verified projects are represented
- Project demonstrations look meaningfully different
- Personal, education, internship, contact and social information is complete
- The site works on mobile, tablet and desktop
- Keyboard and reduced-motion experiences work
- Heavy code is lazy-loaded where practical
- README explains the entire project
- No unverified claims or links have been introduced

At completion, provide:

1. A concise summary of improvements
2. A list of files added or changed
3. Build/test results
4. Known limitations
5. Exact deployment steps
6. Any remaining items that require information from me

Begin by auditing the repository. Then implement the complete enhancement without asking unnecessary questions. Ask only when a missing fact would cause you to invent personal information, repository links, or project claims.

## END PROMPT

---

## Quick agent command

Use this shorter instruction when the AI agent already has access to this file:

```text
Read PORTFOLIO_ENHANCEMENT_MASTER_PROMPT.md completely and implement every applicable requirement in the stated order. Inspect the existing repository first, preserve verified content, do not invent claims or links, validate all interactions and accessibility requirements, optimize Three.js and GSAP performance, run the production build, and update README.md with the final architecture and deployment instructions.
```

## Suggested quality checklist

- [ ] No browser-console errors
- [ ] No missing favicon or asset requests
- [ ] Production build passes
- [ ] Three.js is lazy-loaded and has a fallback
- [ ] GSAP animations clean up on unmount
- [ ] Reduced-motion mode works
- [ ] All nine projects are included
- [ ] Each project has a distinct UI demonstration
- [ ] Case-study dialog is keyboard accessible
- [ ] GitHub and LinkedIn links are correct
- [ ] Contact actions work
- [ ] Layout works from 320px to large desktop
- [ ] SEO and social metadata are complete
- [ ] README documents setup, structure and deployment
