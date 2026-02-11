import type { Metadata } from 'next'

const SITE_URL = 'https://wellnessreal.es'
const SITE_NAME = 'WellnessReal'
const DEFAULT_OG_IMAGE = '/portada-WR.jpg'

interface BuildMetadataOptions {
  title: string
  description: string
  path: string
  ogImage?: string
  noindex?: boolean
  keywords?: string[]
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  noindex,
  keywords,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`
  const image = ogImage || DEFAULT_OG_IMAGE

  return {
    title,
    description,
    ...(keywords && { keywords: keywords.join(', ') }),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'es_ES',
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    ...(noindex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

export { SITE_URL, SITE_NAME }
