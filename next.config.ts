import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lsgpvvhvlydtrjpawckt.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // ✅ ADD THIS PROXY
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://endlessgrindbackend-7jdl.onrender.com/api/:path*' ,
      },
    ]
  },
}

// 'https://endlessgrindbackend-7jdl.onrender.com/api/:path*'
export default nextConfig