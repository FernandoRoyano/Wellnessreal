import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // WordPress common URLs
      {
        source: '/wp-admin',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-admin/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-login.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-content/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-includes/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/xmlrpc.php',
        destination: '/',
        permanent: true,
      },
      // WordPress feed URLs
      {
        source: '/feed',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/feed/:path*',
        destination: '/blog',
        permanent: true,
      },
      // WordPress category/tag URLs
      {
        source: '/category/:slug*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/:slug*',
        destination: '/blog',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
