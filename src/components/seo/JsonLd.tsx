export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// --- Schema builders ---

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'WellnessReal',
    url: 'https://wellnessreal.es',
    logo: 'https://wellnessreal.es/WR_AUX_normal_bg.png',
    email: 'info@wellnessreal.es',
    telephone: '+34633261963',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+34633261963',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
  }
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: 'WellnessReal',
    description:
      'Entrenamiento online personalizado, nutrición y osteopatía. Planes adaptados a tu vida real.',
    url: 'https://wellnessreal.es',
    logo: 'https://wellnessreal.es/WR_AUX_normal_bg.png',
    image: 'https://wellnessreal.es/portada-WR.jpg',
    email: 'info@wellnessreal.es',
    telephone: '+34633261963',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Madrid',
      addressCountry: 'ES',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
  }
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WellnessReal',
    url: 'https://wellnessreal.es',
    inLanguage: 'es',
    publisher: {
      '@type': 'Organization',
      name: 'WellnessReal',
      url: 'https://wellnessreal.es',
    },
  }
}

export function serviceSchema(service: {
  name: string
  description: string
  url: string
  provider?: string
  areaServed?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      '@type': 'Organization',
      name: service.provider || 'WellnessReal',
      url: 'https://wellnessreal.es',
    },
    areaServed: service.areaServed || 'ES',
  }
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function articleSchema(article: {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  author: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image,
    datePublished: article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WellnessReal',
      logo: {
        '@type': 'ImageObject',
        url: 'https://wellnessreal.es/WR_AUX_normal_bg.png',
      },
    },
  }
}

export function offerSchema(offers: { name: string; price: string; description: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Entrenamiento Online Personalizado',
    provider: {
      '@type': 'Organization',
      name: 'WellnessReal',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Planes de entrenamiento',
      itemListElement: offers.map((offer) => ({
        '@type': 'Offer',
        name: offer.name,
        price: offer.price,
        priceCurrency: 'EUR',
        description: offer.description,
      })),
    },
  }
}
