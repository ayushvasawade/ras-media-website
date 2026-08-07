import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export for Netlify deployment
  output: 'export',

  // Required for next/image with static export
  images: {
    unoptimized: true,
  },

  // Transpile Three.js for compatibility
  transpilePackages: ['three'],

  // Strict mode
  reactStrictMode: true,

  // Trailing slash for Netlify static routing
  trailingSlash: true,
}

export default nextConfig
