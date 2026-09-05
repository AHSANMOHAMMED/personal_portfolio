import profile from '@/data/profile.json'

export const PROJECT_SLIDES = profile.projects.length
export const TOTAL_STEPS = 8 + PROJECT_SLIDES

export const NAV_ITEMS = [
  { label: 'Home', index: 0 },
  { label: 'About', index: 2 },
  { label: 'Work', index: 3 },
  { label: 'Experience', index: 3 + PROJECT_SLIDES },
  { label: 'Impact', index: 5 + PROJECT_SLIDES },
  { label: 'Contact', index: 7 + PROJECT_SLIDES },
]
