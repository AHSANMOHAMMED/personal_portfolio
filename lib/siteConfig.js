export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  (process.env.GITHUB_PAGES === '1'
    ? 'https://ahsanmohammed.github.io'
    : 'https://ahsanmohammed.vercel.app')
export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  (process.env.GITHUB_PAGES === '1' ? '/personal_portfolio' : '')
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`

/** Prefix public asset paths with BASE_PATH (required on GitHub Pages). */
export function assetUrl(path = '') {
  if (!path) return BASE_PATH || '/'
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${BASE_PATH}${normalizedPath}`
}
