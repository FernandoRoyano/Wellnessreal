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
      // Old WordPress page URLs (indexed in Google)
      {
        source: '/entrenamiento-personalizado-online',
        destination: '/servicios/entrenamiento-online',
        permanent: true,
      },
      {
        source: '/entrenamiento-personalizado-online/:path*',
        destination: '/servicios/entrenamiento-online',
        permanent: true,
      },
      {
        source: '/nutricion',
        destination: '/servicios/nutricion',
        permanent: true,
      },
      {
        source: '/osteopatia',
        destination: '/servicios/osteopatia',
        permanent: true,
      },
      // Old WordPress blog posts (redirect to blog)
      {
        source: '/todo-lo-que-necesitas-saber-sobre-metodos-anticonceptivos',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/como-reducir-los-antojos-por-el-azucar-y-los-ultraprocesados',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/ejercicios-basicos-para-el-gimnasio',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/el-descanso-el-gran-olvidado',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/claves-para-adelgazar-y-tener-exito-con-la-dieta',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/lesiones-de-ligamento-y-sus-procesos-de-curacion',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/ejercicio-fisico-en-el-adulto-mayor-con-hipertension',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/reglas-de-oro-para-la-mujer-moderna',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/alimentos-no-perecederos-que-debemos-tener-en-la-despensa',
        destination: '/blog',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
