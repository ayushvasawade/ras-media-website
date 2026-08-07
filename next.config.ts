import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow GLB files to be served from public
  // No webpack config needed — GLB served as static assets from /public

  // Transpile Three.js and R3F packages for compatibility
  transpilePackages: ['three'],

  // Strict mode for better React practices
  reactStrictMode: true,
}

export default nextConfig
