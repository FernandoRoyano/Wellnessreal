import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/cliente/',
          '/comunidad/',
          '/programa/',
          '/studio/',
          '/gracias',
          '/metodo/video',
          '/webinar/clase',
        ],
      },
    ],
    sitemap: 'https://wellnessreal.es/sitemap.xml',
  }
}
