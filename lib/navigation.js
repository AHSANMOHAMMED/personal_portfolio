import profile from '@/data/profile.json'

export const PROJECT_SLIDES = profile.projects.length
// Intro(0), Hero(1), About(2), Projects(3..3+N), Architecture(3+N+1), Skills(3+N+2), Work(3+N+3), Testimonials(3+N+4), GitHub(3+N+5), Footer(3+N+6..8)
export const TOTAL_STEPS = 11 + PROJECT_SLIDES

export const NAV_ITEMS = [
  { label: 'Home', index: 1 },
  { label: 'About', index: 2 },
  { label: 'Work', index: 3 },
  { label: 'Architecture', index: 3 + PROJECT_SLIDES },
  { label: 'Skills', index: 3 + PROJECT_SLIDES + 1 },
  { label: 'Experience', index: 3 + PROJECT_SLIDES + 2 },
  { label: 'GitHub', index: 3 + PROJECT_SLIDES + 4 },
  { label: 'Contact', index: 3 + PROJECT_SLIDES + 5 },
]
