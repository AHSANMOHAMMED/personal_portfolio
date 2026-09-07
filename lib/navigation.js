import profile from '@/data/profile.json'

export const PROJECT_SLIDES = profile.projects.length
// Intro(0), Hero(1), About(2), Projects(3..3+N), Architecture(3+N+1), WhatIDo(3+N+2), TechStack(3+N+3), Work(3+N+4), Testimonials(3+N+5), GitHub(3+N+6), Footer(3+N+7..9)
export const TOTAL_STEPS = 12 + PROJECT_SLIDES

export const NAV_ITEMS = [
  { label: 'Home',         index: 1 },
  { label: 'About',        index: 2 },
  { label: 'Work',         index: 3 },
  { label: 'Architecture', index: 3 + PROJECT_SLIDES },
  { label: 'What I Do',    index: 3 + PROJECT_SLIDES + 1 },
  { label: 'Tech Stack',   index: 3 + PROJECT_SLIDES + 2 },
  { label: 'Experience',   index: 3 + PROJECT_SLIDES + 3 },
  { label: 'GitHub',       index: 3 + PROJECT_SLIDES + 5 },
  { label: 'Contact',      index: 3 + PROJECT_SLIDES + 6 },
]
