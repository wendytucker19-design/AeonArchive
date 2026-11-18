import type { NextConfig } from 'next';

const exporting = process.env.AEON_STATIC_EXPORT === '1';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(exporting ? { output: 'export' as const, distDir: '.next-export' } : {}),
  turbopack: { root: process.cwd() },
  images: { formats: ['image/avif', 'image/webp'], qualities: [75, 90], unoptimized: exporting },
};

export default nextConfig;
