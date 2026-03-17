import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
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
      // 404s reportados por Search Console (marzo 2026)
      {
        source: '/como-realizar-correctamente-el-test-de-1rm',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/carbohidratos-y-entrenamiento-de-fuerza-son-realmente-necesarios',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/:num(\\d+)',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/la-verdad-sobre-el-aquarius-y-tratamiento-de-la-gastroenteritis',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/asesoramiento-nutricional',
        destination: '/servicios/nutricion',
        permanent: true,
      },
      {
        source: '/como-aumentar-tu-motivacion-y-lograr-resultados',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/dieta-carnivora-beneficios-riesgos-y-falta-de-contexto',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/agujetas',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/ashwagandha-un-ansiolitico-natural',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/como-abordar-el-estrenimiento-de-manera-integral-mas-alla-de-la-fibra-y-el-agua',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/reglas-no-escritas-de-convivencia-en-el-gimnasio',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/agua-con-gas-beneficios-mitos-y-realidades',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/el-mejor-tipo-de-magnesio-una-mirada-cientifica',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/como-entrenar-durant-el-ciclo-menstrual-guia-completa',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/el-estres-vision-de-la-medicina-natural-y-moderna',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/nutricion/page/:num*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/descubre-las-mejores-frutas-para-tu-salud-bajo-indice-glucemico-y-beneficios',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/biomecanica-del-calzado-deportivo-y-sus-elementos',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/proteccion-solar-inteligente-equilibrando-la-exposicion-natural-y-el-uso-de-crema-solar-para-una-piel-saludable',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/introduccion-al-mindfulness',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/es-el-seitan-bueno-o-malo-para-tu-digestion-la-ciencia-lo-revela',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/ciencia-vs-espiritualidad',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/huevo-lo-necesitas-saber',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/la-mejor-version-ti-misma-especial-mujeres',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/metodo-para-calcular-tus-calorias-de-mantenimiento',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/introduccion-al-veganismo',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/calentamiento-estiramientos-y-prevencion-de-lesiones',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/sexo-masa-muscular-y-rendimiento-deportivo',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/alivio-de-los-dolores-causados-por-la-fibromialgia',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/cuanta-proteina-tomar-y-como-hacerlo',
        destination: '/blog',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
