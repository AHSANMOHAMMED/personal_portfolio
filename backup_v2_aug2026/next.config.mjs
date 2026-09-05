/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: 'export',
  basePath: '/personal_portfolio',
  images: {
    unoptimized: true,
    qualities: [75, 80, 95, 100],
  },
};

export default nextConfig;
