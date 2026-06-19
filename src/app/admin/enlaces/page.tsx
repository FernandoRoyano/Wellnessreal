'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import {
  Link2, Copy, Check, ExternalLink, Target, PlayCircle, Sparkles, ClipboardList,
  Gift, MessageCircle, FileText, Home, Heart, Star, BookOpen, Dumbbell, Shield,
} from 'lucide-react'

const BASE_URL = 'https://wellnessreal.es'

type Pagina = { title: string; description: string; path: string; highlight?: boolean }
type Grupo = { titulo: string; nota?: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; paginas: Pagina[] }

const GRUPOS: Grupo[] = [
  {
    titulo: 'Embudo VSL (principal)',
    nota: 'Donde aterrizan los anuncios.',
    icon: Target,
    paginas: [
      { title: 'VSL — Opt-in', description: 'Página de registro. Aquí entran los anuncios.', path: '/metodo', highlight: true },
      { title: 'VSL — Vídeo', description: 'Vídeo de 15 min + CTA. Acceso directo.', path: '/metodo/video' },
    ],
  },
  {
    titulo: 'Embudo del plan con IA',
    nota: 'Las dos puertas del onboarding.',
    icon: Sparkles,
    paginas: [
      { title: 'Webinar', description: 'Landing del webinar. Tras reservar, lleva al cuestionario.', path: '/webinar' },
      { title: 'Cuestionario (plan IA)', description: 'Puerta directa: rellenan, la IA genera y ven el teaser.', path: '/cuestionario', highlight: true },
    ],
  },
  {
    titulo: 'Captación / lead magnets',
    icon: Gift,
    paginas: [
      { title: 'Valoración gratuita', description: 'Formulario 6 pasos con pre-cualificación.', path: '/valoracion' },
      { title: 'Recurso gratis (PDF)', description: 'Guía descargable. Lead magnet.', path: '/recurso-gratis' },
      { title: 'Contacto', description: 'Formulario genérico de contacto.', path: '/contacto' },
    ],
  },
  {
    titulo: 'Páginas de venta',
    icon: FileText,
    paginas: [
      { title: 'Tarifas', description: 'Tráfico que ya sabe lo que busca.', path: '/tarifas' },
      { title: 'Servicios', description: 'Resumen de todos los servicios.', path: '/servicios' },
      { title: 'Entrenamiento online', description: 'Servicio de entrenamiento online.', path: '/servicios/entrenamiento-online' },
      { title: 'Entrenamiento personalizado', description: 'Servicio 1-a-1 presencial.', path: '/servicios/entrenamiento-personalizado' },
      { title: 'Nutrición', description: 'Servicio de nutrición.', path: '/servicios/nutricion' },
      { title: 'Osteopatía', description: 'Servicio de osteopatía.', path: '/servicios/osteopatia' },
    ],
  },
  {
    titulo: 'Marca y contenido',
    icon: Home,
    paginas: [
      { title: 'Home', description: 'Página principal.', path: '/' },
      { title: 'Filosofía', description: 'Tu enfoque y valores.', path: '/filosofia' },
      { title: 'Caso real', description: 'Caso de éxito / prueba social.', path: '/caso-real' },
      { title: 'Blog', description: 'Artículos y SEO.', path: '/blog' },
    ],
  },
  {
    titulo: 'Legal',
    icon: Shield,
    paginas: [
      { title: 'Privacidad', description: 'Política de privacidad.', path: '/privacidad' },
      { title: 'Términos', description: 'Términos y condiciones.', path: '/terminos' },
    ],
  },
]

const ICONO_PAGINA: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  '/metodo': Target, '/metodo/video': PlayCircle, '/webinar': PlayCircle, '/cuestionario': ClipboardList,
  '/valoracion': ClipboardList, '/recurso-gratis': Gift, '/contacto': MessageCircle,
  '/tarifas': FileText, '/servicios': Dumbbell, '/': Home, '/filosofia': Heart, '/caso-real': Star, '/blog': BookOpen,
  '/privacidad': Shield, '/terminos': Shield,
}

export default function EnlacesAdminPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto" style={{ backgroundColor: '#16122B' }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Enlaces</h1>
          <p className="text-gray-500 text-sm mt-1">
            Todas tus páginas públicas en un sitio. Copia la URL para anuncios o ábrela para revisarla.
          </p>
        </div>

        <div className="space-y-8">
          {GRUPOS.map((grupo) => {
            const GIcon = grupo.icon
            return (
              <section key={grupo.titulo}>
                <div className="flex items-center gap-2 mb-1">
                  <GIcon size={16} style={{ color: '#FCEE21' }} />
                  <h2 className="text-white font-bold text-sm">{grupo.titulo}</h2>
                </div>
                {grupo.nota && <p className="text-gray-500 text-xs mb-4">{grupo.nota}</p>}
                {!grupo.nota && <div className="mb-4" />}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {grupo.paginas.map((p) => (
                    <LinkCard key={p.path} pagina={p} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>
    </div>
  )
}

function LinkCard({ pagina }: { pagina: Pagina }) {
  const [copied, setCopied] = useState(false)
  const url = pagina.path === '/' ? BASE_URL : `${BASE_URL}${pagina.path}`
  const Icon = ICONO_PAGINA[pagina.path] || Link2

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* noop */
    }
  }

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: '#1a1535',
        border: pagina.highlight ? '1px solid rgba(252,238,33,0.5)' : '1px solid rgba(102,45,145,0.3)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: pagina.highlight ? 'rgba(252,238,33,0.15)' : 'rgba(102,45,145,0.2)' }}>
          <Icon size={14} style={{ color: pagina.highlight ? '#FCEE21' : '#c084fc' }} />
        </div>
        <h4 className="text-white text-sm font-bold">{pagina.title}</h4>
        {pagina.highlight && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto" style={{ backgroundColor: '#FCEE21', color: '#16122B' }}>
            CLAVE
          </span>
        )}
      </div>
      <p className="text-gray-400 text-xs leading-relaxed mb-3">{pagina.description}</p>
      <div className="flex items-center gap-1 rounded-lg px-2.5 py-2" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(102,45,145,0.2)' }}>
        <code className="flex-1 text-[11px] text-gray-300 truncate font-mono">{url}</code>
        <button onClick={copy} className="p-1.5 rounded transition-all hover:bg-white/10" title="Copiar URL" aria-label="Copiar URL">
          {copied ? <Check size={13} style={{ color: '#4ade80' }} /> : <Copy size={13} className="text-gray-400" />}
        </button>
        <a href={url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded transition-all hover:bg-white/10" title="Abrir" aria-label="Abrir">
          <ExternalLink size={13} className="text-gray-400" />
        </a>
      </div>
    </div>
  )
}
