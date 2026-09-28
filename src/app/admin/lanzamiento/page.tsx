import { readFile } from 'node:fs/promises'
import path from 'node:path'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import {
  BookOpen,
  CalendarDays,
  FileText,
  Mail,
  Megaphone,
  Users,
  Workflow,
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'

const quickLinks = [
  {
    href: '/admin/email/campaigns',
    label: 'Campañas de email',
    description: 'Crear, revisar y programar los emails en MailerLite.',
    icon: Mail,
  },
  {
    href: '/admin/email/subscribers',
    label: 'Suscriptores',
    description: 'Comprobar contactos, estados y consentimiento.',
    icon: Users,
  },
  {
    href: '/admin/blog',
    label: 'Artículos en borrador',
    description: 'Revisar los artículos científicos antes de publicar.',
    icon: BookOpen,
  },
  {
    href: '/admin/funnel-tiroides',
    label: 'Embudo Tiroides',
    description: 'Consultar captación, clase, oferta, solicitudes y ventas.',
    icon: Workflow,
  },
  {
    href: '/admin/guiones',
    label: 'Guiones',
    description: 'Acceder a los guiones de clase, vídeo y anuncios.',
    icon: Megaphone,
  },
  {
    href: '/admin/comunidad/asesoria',
    label: 'Solicitudes y pagos',
    description: 'Gestionar candidatos, valoraciones y enlaces de pago.',
    icon: FileText,
  },
] as const

const socialCreatives = [
  { date: '1 octubre', title: 'Una semana difícil', file: '01-semana-dificil.png' },
  { date: '5 octubre', title: 'Apertura · 10 plazas', file: '02-apertura-10-plazas.png' },
  { date: '12 octubre', title: 'Progresar, mantener o reducir', file: '03-progresar-mantener-reducir.png' },
  { date: '15 octubre', title: 'Entrenamiento, no tratamiento', file: '04-entrenamiento-no-tratamiento.png' },
  { date: '20 octubre', title: 'Semanas diferentes', file: '05-semanas-diferentes.png' },
  { date: '25 octubre', title: 'Cierre de solicitudes', file: '06-cierre-solicitudes.png' },
] as const

const markdownComponents = {
  h1: ({ children }: React.ComponentPropsWithoutRef<'h1'>) => (
    <h1 className="mb-6 text-3xl font-bold text-white">{children}</h1>
  ),
  h2: ({ children }: React.ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mb-4 mt-10 border-b border-white/10 pb-3 text-2xl font-bold text-white">
      {children}
    </h2>
  ),
  h3: ({ children }: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mb-3 mt-7 text-lg font-bold text-[#FCEE21]">{children}</h3>
  ),
  p: ({ children }: React.ComponentPropsWithoutRef<'p'>) => (
    <p className="mb-4 leading-7 text-gray-300">{children}</p>
  ),
  ul: ({ children }: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul className="mb-5 list-disc space-y-2 pl-6 text-gray-300">{children}</ul>
  ),
  ol: ({ children }: React.ComponentPropsWithoutRef<'ol'>) => (
    <ol className="mb-5 list-decimal space-y-2 pl-6 text-gray-300">{children}</ol>
  ),
  blockquote: ({ children }: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="my-5 border-l-2 border-[#FCEE21] bg-[#FCEE21]/5 px-5 py-4 text-gray-300">
      {children}
    </blockquote>
  ),
  code: ({ children }: React.ComponentPropsWithoutRef<'code'>) => (
    <code className="rounded bg-black/30 px-1.5 py-0.5 text-sm text-[#FCEE21]">{children}</code>
  ),
  a: ({ children, href }: React.ComponentPropsWithoutRef<'a'>) => (
    <a
      href={href}
      className="font-medium text-[#FCEE21] underline decoration-[#FCEE21]/40 underline-offset-4 hover:decoration-[#FCEE21]"
    >
      {children}
    </a>
  ),
  table: ({ children }: React.ComponentPropsWithoutRef<'table'>) => (
    <div className="mb-6 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[38rem] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }: React.ComponentPropsWithoutRef<'th'>) => (
    <th className="border-b border-white/10 bg-black/25 px-4 py-3 font-bold text-white">{children}</th>
  ),
  td: ({ children }: React.ComponentPropsWithoutRef<'td'>) => (
    <td className="border-b border-white/5 px-4 py-3 align-top text-gray-300">{children}</td>
  ),
}

export default async function LaunchCenterPage() {
  const [launchPlan, businessModel, historicalSequence] = await Promise.all([
    readFile(
      path.join(process.cwd(), 'docs', 'marketing', 'lanzamiento-metodo-base-tiroides-2026.md'),
      'utf8'
    ),
    readFile(path.join(process.cwd(), 'docs', 'modelo-negocio-metodo-base.md'), 'utf8'),
    readFile(
      path.join(process.cwd(), 'docs', 'marketing', 'secuencia-tiroides-mailerlite.md'),
      'utf8'
    ),
  ])

  const calendarStart = launchPlan.indexOf('## Calendario')
  const emailsStart = launchPlan.indexOf('## Email 1')
  const socialStart = launchPlan.indexOf('## Publicaciones orgánicas')
  const reviewStart = launchPlan.indexOf('## Revisión antes de programar')
  const campaignIntro = launchPlan.slice(0, calendarStart)
  const calendar = launchPlan.slice(calendarStart, emailsStart)
  const emails = launchPlan.slice(emailsStart, socialStart)
  const socialPosts = launchPlan.slice(socialStart, reviewStart)
  const launchReview = launchPlan.slice(reviewStart)

  return (
    <div className="flex min-h-screen bg-[#16122B]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-auto p-5 md:p-8">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#FCEE21]">
            <CalendarDays size={17} />
            Centro de campaña
          </div>
          <h1 className="mt-2 text-3xl font-bold text-white">Lanzamiento Método BASE Tiroides</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
            Aquí tienes reunidos el calendario, los emails, las publicaciones sociales, los documentos
            de estrategia y los accesos operativos. Que un texto aparezca aquí no significa que ya esté
            programado o enviado.
          </p>
        </header>

        <nav aria-label="Índice del centro de campaña" className="mb-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map(({ href, label, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-[#662D91]/40 bg-[#1a1535] p-4 transition-colors hover:border-[#FCEE21]/60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FCEE21]/10 text-[#FCEE21]">
                <Icon size={17} />
              </span>
              <h2 className="mt-4 font-bold text-white">{label}</h2>
              <p className="mt-1 text-xs leading-5 text-gray-400">{description}</p>
            </Link>
          ))}
        </nav>

        <section className="mb-6 rounded-2xl border border-[#FCEE21]/35 bg-[#1a1535] p-5 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FCEE21]">Documento activo</p>
              <h2 className="mt-1 text-xl font-bold text-white">Emails y publicaciones de octubre</h2>
            </div>
            <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
              Redactado · pendiente de cargar y programar
            </span>
          </div>
          <ReactMarkdown components={markdownComponents}>{campaignIntro}</ReactMarkdown>

          <div id="calendario" className="scroll-mt-6">
            <ReactMarkdown components={markdownComponents}>{calendar}</ReactMarkdown>
          </div>

          <div id="emails" className="scroll-mt-6">
            <ReactMarkdown components={markdownComponents}>{emails}</ReactMarkdown>
          </div>

          <div id="redes" className="scroll-mt-6">
            <ReactMarkdown components={markdownComponents}>{socialPosts}</ReactMarkdown>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {socialCreatives.map((creative) => (
                <article
                  key={creative.file}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                >
                  <Image
                    src={`/social/metodo-base-tiroides-2026/${creative.file}`}
                    alt={`Creatividad para redes: ${creative.title}`}
                    width={1122}
                    height={1402}
                    className="h-auto w-full"
                  />
                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#FCEE21]">
                      {creative.date}
                    </p>
                    <h3 className="mt-1 text-sm font-bold text-white">{creative.title}</h3>
                    <a
                      href={`/social/metodo-base-tiroides-2026/${creative.file}`}
                      download
                      className="mt-3 inline-flex text-xs font-semibold text-gray-300 underline decoration-white/30 underline-offset-4 hover:text-white"
                    >
                      Abrir o descargar imagen
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <ReactMarkdown components={markdownComponents}>{launchReview}</ReactMarkdown>
        </section>

        <details id="modelo" className="mb-4 scroll-mt-6 rounded-2xl border border-white/10 bg-[#1a1535] p-5 md:p-8">
          <summary className="cursor-pointer text-lg font-bold text-white">
            Modelo de negocio, avances y checklist
          </summary>
          <div className="mt-6 border-t border-white/10 pt-2">
            <ReactMarkdown components={markdownComponents}>{businessModel}</ReactMarkdown>
          </div>
        </details>

        <details id="historica" className="scroll-mt-6 rounded-2xl border border-amber-400/20 bg-[#1a1535] p-5 md:p-8">
          <summary className="cursor-pointer text-lg font-bold text-white">
            Secuencia histórica de MailerLite · no programar sin revisar
          </summary>
          <p className="mt-4 rounded-xl bg-amber-400/10 p-4 text-sm leading-6 text-amber-200">
            Este documento pertenece al planteamiento anterior. Contiene mensajes desactualizados y un
            hueco pendiente para un caso real. Se conserva como referencia, no como campaña aprobada.
          </p>
          <div className="mt-6 border-t border-white/10 pt-2">
            <ReactMarkdown components={markdownComponents}>{historicalSequence}</ReactMarkdown>
          </div>
        </details>
      </main>
    </div>
  )
}
