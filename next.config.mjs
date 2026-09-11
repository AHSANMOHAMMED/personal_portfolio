/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === '1'
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  (isGithubPages ? '/personal_portfolio' : '')

const nextConfig = {
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true,
    qualities: [75, 80, 95, 100],
  },
  ...(isGithubPages
    ? {
        output: 'export',
        basePath,
        assetPrefix: basePath || undefined,
        trailingSlash: true,
      }
    : {}),
}

export default nextConfig
