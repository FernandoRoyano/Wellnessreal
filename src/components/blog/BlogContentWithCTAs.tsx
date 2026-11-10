'use client'
import { CommunityLink } from '@/components/comunidad/CommunityLink'

import Link from 'next/link'
import { trackBlogCtaClick } from '@/lib/analytics'
import { splitBlogSections } from '@/lib/blog-content'
import { attributeArticleLinks, withArticleSource } from '@/lib/article-attribution'

interface Props {
  content: string
  /** Artículos de la categoría tiroides funnelizan a su guía + comunidad, no al embudo general. */
  isThyroid?: boolean
  sourceSlug?: string
  showCtas?: boolean
}

/** Primer CTA (~30%): captar el email con el lead magnet adecuado. */
function GuideCtaBanner({ isThyroid, sourceSlug }: { isThyroid?: boolean; sourceSlug: string }) {
  const cfg = isThyroid
    ? {
        eyebrow: 'Comunidad gratuita',
        title: 'Lleva estas ideas a una primera semana posible',
        desc: 'Lecciones, un planificador semanal y un espacio para dudas generales. Acceso gratuito con tu email.',
        href: '/comunidad/entrar',
      }
    : {
        eyebrow: 'Recurso gratuito',
        title: '¿Quieres aplicar esto a tu caso real?',
        desc: 'Descarga la guía gratuita: “Fuerza para la vida real”.',
        href: '/recurso-gratis#formulario',
      }
  return (
    <div className="my-10 p-6 md:p-8 rounded-xl" style={{ backgroundColor: '#1a1535', border: '2px solid #FCEE21' }}>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest mb-1 text-accent">
            {cfg.eyebrow}
          </p>
          <h3 className="text-lg font-bold text-white mb-1">{cfg.title}</h3>
          <p className="text-sm text-gray-400">{cfg.desc}</p>
        </div>
        {isThyroid ? <CommunityLink href={cfg.href} source="blog_inline" className="btn-brand flex-shrink-0 px-6 py-3 text-sm">Entrar gratis</CommunityLink> : <Link
          href={withArticleSource(cfg.href, sourceSlug)}
          onClick={() => trackBlogCtaClick(sourceSlug, cfg.href, 'inline')}
          className="flex-shrink-0 px-6 py-3 rounded-lg font-bold text-sm transition hover:scale-105"
          style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
        >
          Descargar gratis
        </Link>}
      </div>
    </div>
  )
}

/** Segundo CTA (~70%): comunidad como entrada; BASE como continuación contextual. */
function SecondCtaBanner({ isThyroid, sourceSlug }: { isThyroid?: boolean; sourceSlug: string }) {
  const cfg = isThyroid
    ? {
        eyebrow: 'Siguiente paso opcional · De pago',
        title: '¿Quieres convertirlo en un plan para tu semana?',
        desc: 'Conoce Método BASE Tiroides: 12 semanas de fuerza, organización y seguimiento.',
        href: '/metodo-tiroides',
        cta: 'Ver el programa',
        track: 'blog_inline_metodo_tiroides',
      }
    : {
        eyebrow: 'Comunidad gratuita · Tiroides',
        title: '¿Convives con hipotiroidismo o Hashimoto?',
        desc: 'Tenemos un espacio para mujeres que quieren aprender sobre fuerza y hábitos: lecciones, recursos y dudas generales, a tu ritmo.',
        href: '/comunidad/entrar',
        cta: 'Entrar gratis',
      }
  return (
    <div className="my-10 p-6 md:p-8 rounded-xl" style={{ backgroundColor: '#1a1535', border: '2px solid #662D91' }}>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#FCEE21' }}>
            {cfg.eyebrow}
          </p>
          <h3 className="text-lg font-bold text-white mb-1">{cfg.title}</h3>
          <p className="text-sm text-gray-400">{cfg.desc}</p>
        </div>
        {isThyroid ? <Link
          href={withArticleSource(cfg.href, sourceSlug)}
          onClick={() => trackBlogCtaClick(sourceSlug, cfg.href, 'inline')}
          className="flex-shrink-0 px-6 py-3 rounded-lg font-bold text-sm transition hover:scale-105 border-2 border-[#FCEE21] text-[#FCEE21] hover:bg-[#FCEE21] hover:text-[#16122B]"
        >
          {cfg.cta}
        </Link> : <CommunityLink
          href={withArticleSource(cfg.href, sourceSlug)}
          source="blog_inline_community"
          onClick={() => trackBlogCtaClick(sourceSlug, cfg.href, 'inline')}
          className="btn-brand flex-shrink-0 px-6 py-3 text-sm"
        >{cfg.cta}</CommunityLink>}
      </div>
    </div>
  )
}

export default function BlogContentWithCTAs({ content, isThyroid, sourceSlug = 'unknown', showCtas = true }: Props) {
  const attributedContent = attributeArticleLinks(content, sourceSlug)
  const sections = splitBlogSections(attributedContent)
  const total = sections.length

  if (!showCtas || total < 4) {
    return (
      <article
        className="prose prose-invert prose-lg max-w-none markdown-content"
        dangerouslySetInnerHTML={{ __html: attributedContent }}
      />
    )
  }

  const guideIndex = Math.max(2, Math.floor(total * 0.3))
  const valoracionIndex = Math.min(total - 1, Math.max(guideIndex + 1, Math.floor(total * 0.7)))

  return (
    <>
      {sections.map((chunk, index) => (
        <div key={index}>
          <div
            className="prose prose-invert prose-lg max-w-none markdown-content"
            dangerouslySetInnerHTML={{ __html: chunk }}
          />
          {index === guideIndex - 1 && <GuideCtaBanner isThyroid={isThyroid} sourceSlug={sourceSlug} />}
          {index === valoracionIndex - 1 && valoracionIndex !== guideIndex && (
            <SecondCtaBanner isThyroid={isThyroid} sourceSlug={sourceSlug} />
          )}
        </div>
      ))}
    </>
  )
}
