import { SITE_URL } from '@/lib/siteConfig'

export const dynamic = 'force-static'

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahsanmohammed.dev'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
