import { SITE_URL } from '@/lib/siteConfig'

export const dynamic = 'force-static'

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahsanmohammed.dev'
  return [
    {
      url: SITE_URL,
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      priority: 1.0,
    },
  ]
}
