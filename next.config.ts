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
      // Feed URLs (noindex en Search Console)
      {
        source: '/:slug*/feed',
        destination: '/blog',
        permanent: true,
      },
      // WordPress pagination
      {
        source: '/:cat/page/:num*',
        destination: '/blog',
        permanent: true,
      },
      // Old WordPress pages (rastreadas sin indexar)
      {
        source: '/valoracion-inicial',
        destination: '/valoracion',
        permanent: true,
      },
      {
        source: '/valoracion-estilo-de-vida',
        destination: '/valoracion',
        permanent: true,
      },
      {
        source: '/contratacion-nutricion',
        destination: '/tarifas',
        permanent: true,
      },
      {
        source: '/contratacion-entrenamiento',
        destination: '/tarifas',
        permanent: true,
      },
      {
        source: '/fat-burner-academy',
        destination: '/tarifas',
        permanent: true,
      },
      {
        source: '/test-de-salud',
        destination: '/valoracion',
        permanent: true,
      },
      {
        source: '/gracias-rellenar-formulario',
        destination: '/gracias',
        permanent: true,
      },
      {
        source: '/aviso-legal',
        destination: '/',
        permanent: true,
      },
      {
        source: '/politica-de-privacidad',
        destination: '/',
        permanent: true,
      },
      // All remaining old WordPress blog posts → /blog
      {
        source: '/diferenciar-jamon-iberico-del-jamon-serrano',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/cuantas-comidas-al-dia-muchas-pequenas-pocas-grandes',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/como-combatir-los-antojos-estrategias-para-un-estilo-de-vida-saludable',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/optimiza-tu-ciclo-menstrual-para-mejorar-tu-rendimiento',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/barreras-digestivas-el-estomago',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/desarrollo-de-tus-capacidades-fisicas',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/curcumina',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/estrategias-naturales-y-medicas-para-mejorar-la-caida-del-cabello-en-mujeres',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/como-mantenerte-activo-con-ninos-pequenos-los-mejores-consejos-y-soluciones-',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/entrenamiento-en-casa-guia-completa-y-mejora-material-para-comprar',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/dolor-menstrual-y-amenorrea',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/vitamina-d-beneficios-sintesis-y-recomendaciones',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/despierta-tus-gluteos-como-entrenarlos-correctamente',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/posibles-alteraciones-durante-el-embarazo-parte-ii',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/como-vencer-el-hambre-emocional-y-controlar-tu-alimentacion',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/7-factores-que-pueden-afectar-a-tu-pelo',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/esta-bien-planteada-la-piramide-alimentaria-es-buena-para-nuestra-salud',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/l-glutamina-y-sus-funciones-en-el-organismo',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/sentadilla-evitar-piernas-flamenco',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/dolor-lumbar-durante-el-embarazo-parte-iii',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/como-solucionar-problemas-tipicos-de-la-cetosis',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/minimiza-los-efectos-del-alcohol-y-recuperate-rapido',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/la-verdad-sobre-los-lacteos',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/agujetas-despues-del-entrenamiento',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/como-identificar-y-tratar-un-esguince-de-tobillo',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/foam-roller-ultimas-evidencias-y-como-aplicarlo',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/mantequilla-ghee',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/kobido-masaje-tradicional-japones',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/grasas-la-verdad-las-grasas-conceptos-importantes',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/adiccion-al-azucar-obesidad-y-falta-de-contexto',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/lo-que-necesitas-saber-sobre-nutriscore',
        destination: '/blog',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
