'use client'

import Link from 'next/link'
import { trackSignUp, trackGenerateLead } from '@/lib/analytics'

interface Props {
  content: string
  /** Artículos de la categoría tiroides funnelizan a su guía + comunidad, no al embudo general. */
  isThyroid?: boolean
}

function splitIntoParagraphs(html: string): string[] {
  return html
    .split('</p>')
    .map((chunk) => (chunk.trim() ? chunk + '</p>' : ''))
    .filter(Boolean)
}

/** Primer CTA (~30%): captar el email con el lead magnet adecuado. */
function GuideCtaBanner({ isThyroid }: { isThyroid?: boolean }) {
  const cfg = isThyroid
    ? {
        eyebrow: 'Guía gratuita',
        title: '¿Tienes hipotiroidismo y esto te suena?',
        desc: 'Descarga la guía gratuita “Entrenar y adelgazar con hipotiroidismo”.',
        href: '/tiroides',
        track: 'blog_inline_tiroides_guia',
      }
    : {
        eyebrow: 'Recurso gratuito',
        title: '¿Quieres aplicar esto a tu caso real?',
        desc: 'Descarga la guía gratuita: “Fitness real para gente con vida real”.',
        href: '/recurso-gratis',
        track: 'blog_inline_guia',
      }
  return (
    <div className="my-10 p-6 md:p-8 rounded-xl" style={{ backgroundColor: '#1a1535', border: '2px solid #FCEE21' }}>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#662D91' }}>
            {cfg.eyebrow}
          </p>
          <h3 className="text-lg font-bold text-white mb-1">{cfg.title}</h3>
          <p className="text-sm text-gray-400">{cfg.desc}</p>
        </div>
        <Link
          href={cfg.href}
          onClick={() => trackSignUp(cfg.track)}
          className="flex-shrink-0 px-6 py-3 rounded-lg font-bold text-sm transition hover:scale-105"
          style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
        >
          Descargar gratis
        </Link>
      </div>
    </div>
  )
}

/** Segundo CTA (~70%): dar el siguiente paso (comunidad para tiroides, valoración si no). */
function SecondCtaBanner({ isThyroid }: { isThyroid?: boolean }) {
  const cfg = isThyroid
    ? {
        eyebrow: 'No estás sola',
        title: 'Hay una comunidad de mujeres como tú',
        desc: 'Gratis: contenido paso a paso y un foro para preguntar sin miedo.',
        href: '/comunidad/entrar',
        cta: 'Entrar gratis',
        track: 'blog_inline_tiroides_comunidad',
      }
    : {
        eyebrow: 'Plan personalizado',
        title: 'Esto es contenido general. Tu caso es único.',
        desc: 'Solicita una valoración gratuita y recibe un plan diseñado para tu vida real.',
        href: '/valoracion',
        cta: 'Valoración gratuita',
        track: 'blog_inline_valoracion',
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
        <Link
          href={cfg.href}
          onClick={() => trackGenerateLead(cfg.track)}
          className="flex-shrink-0 px-6 py-3 rounded-lg font-bold text-sm transition hover:scale-105 border-2 border-[#FCEE21] text-[#FCEE21] hover:bg-[#FCEE21] hover:text-[#16122B]"
        >
          {cfg.cta}
        </Link>
      </div>
    </div>
  )
}

export default function BlogContentWithCTAs({ content, isThyroid }: Props) {
  const paragraphs = splitIntoParagraphs(content)
  const total = paragraphs.length

  if (total < 4) {
    return (
      <article
        className="prose prose-invert prose-lg max-w-none markdown-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  const guideIndex = Math.floor(total * 0.3)
  const valoracionIndex = Math.floor(total * 0.7)

  return (
    <>
      {paragraphs.map((chunk, index) => (
        <div key={index}>
          <div
            className="prose prose-invert prose-lg max-w-none markdown-content"
            dangerouslySetInnerHTML={{ __html: chunk }}
          />
          {index === guideIndex - 1 && <GuideCtaBanner isThyroid={isThyroid} />}
          {index === valoracionIndex - 1 && valoracionIndex !== guideIndex && (
            <SecondCtaBanner isThyroid={isThyroid} />
          )}
        </div>
      ))}
    </>
  )
}
