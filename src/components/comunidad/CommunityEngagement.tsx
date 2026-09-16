'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Download, MessageCircle, Share2 } from 'lucide-react'

interface CommunityResource {
  title: string
  description: string
  href: string
}

export function LessonEngagement({ resource }: { resource: CommunityResource }) {
  return (
    <section className="community-engagement" aria-labelledby="lesson-action-title">
      <div className="community-engagement-heading">
        <p>Ahora llévalo a la práctica</p>
        <h2 id="lesson-action-title">Leer ayuda. Hacer una cosa cambia el recorrido.</h2>
      </div>
      <div className="community-engagement-grid">
        <a href={resource.href} target="_blank" rel="noreferrer" className="community-engagement-action is-resource">
          <span><Download className="h-5 w-5" /></span>
          <div><small>Recurso relacionado · PDF</small><strong>{resource.title}</strong><p>{resource.description}</p></div>
          <ArrowRight className="h-4 w-4" />
        </a>
        <Link href="/comunidad/preguntas-apoyo" className="community-engagement-action">
          <span><MessageCircle className="h-5 w-5" /></span>
          <div><small>Coméntalo con la comunidad</small><strong>¿Qué te llevas de esta lección?</strong><p>Una idea o una duda es suficiente para empezar.</p></div>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <CommunityShare compact />
    </section>
  )
}

export function CommunityShare({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = 'https://wellnessreal.es/comunidad/entrar'
  const shareText = 'He encontrado una comunidad gratuita de WellnessReal con contenido claro sobre tiroides, entrenamiento y hábitos. Puede que te venga bien.'

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Comunidad Tiroides · WellnessReal', text: shareText, url: shareUrl })
        return
      }
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      console.error('[CommunityShare:handleShare] No se pudo compartir', error)
    }
  }

  return (
    <div className={`community-share ${compact ? 'is-compact' : ''}`}>
      <div>
        <small>La comunidad seguirá siendo gratuita</small>
        <strong>¿Conoces a alguien a quien esto podría ayudar?</strong>
        <p>Envíale la entrada a la comunidad. Sin mensajes automáticos ni cadenas: tú decides a quién le puede servir.</p>
      </div>
      <button type="button" onClick={handleShare}>
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {copied ? 'Enlace copiado' : 'Compartir comunidad'}
      </button>
    </div>
  )
}
