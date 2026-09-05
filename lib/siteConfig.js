export const SITE_ORIGIN = 'https://AHSANMOHAMMED.github.io'
export const BASE_PATH = '/personal_portfolio'
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`

export function assetUrl(path) {
	const normalizedPath = path.startsWith('/') ? path : `/${path}`
	return `${BASE_PATH}${normalizedPath}`
}
