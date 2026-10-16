import Link from 'next/link'
import { ArrowRight, CheckCircle, BookOpen } from 'lucide-react'
import Container from '@/components/common/Container'
import JsonLd, { breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd'

export interface TopicHubConfig {
  eyebrow: string
  title: string
  highlightedTitle: string
  introduction: string
  answer: string
  path: string
  sections: { title: string; body: string }[]
  guides: { href: string; title: string; description: string }[]
  faqs: { question: string; answer: string }[]
  cta: { title: string; description: string; href: string; label: string }
}

export default function TopicHubPage({ config }: { config: TopicHubConfig }) {
  const url = `https://wellnessreal.es${config.path}`

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Inicio', url: 'https://wellnessreal.es' },
        { name: `${config.title} ${config.highlightedTitle}`, url },
      ])} />
      <JsonLd data={faqSchema(config.faqs)} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${config.title} ${config.highlightedTitle}`,
        description: config.introduction,
        url,
        inLanguage: 'es',
        author: { '@type': 'Person', name: 'Fernando Royano', url: 'https://wellnessreal.es/sobre-mi' },
      }} />

      <section className="relative overflow-hidden bg-brand-deep py-fluid-xl">
        <div className="absolute inset-0 bg-radial-accent opacity-60" />
        <div className="absolute inset-0 bg-grid-soft opacity-30" />
        <Container>
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="eyebrow justify-center">{config.eyebrow}</span>
            <h1 className="headline mt-5 text-fluid-6xl leading-[1.04] text-white">
              {config.title} <span className="text-gradient-brand">{config.highlightedTitle}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-fluid-xl leading-relaxed text-white/80">
              {config.introduction}
            </p>
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-accent/25 bg-accent/10 p-6 text-left">
              <p className="text-fluid-xs font-semibold uppercase tracking-wider text-accent">Respuesta breve</p>
              <p className="mt-2 text-fluid-lg leading-relaxed text-white">{config.answer}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-dusk py-fluid-xl">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {config.sections.map((section) => (
              <article key={section.title} className="surface-card rounded-2xl p-7">
                <CheckCircle className="h-5 w-5 text-accent" aria-hidden="true" />
                <h2 className="headline mt-5 text-fluid-xl text-white">{section.title}</h2>
                <p className="mt-3 text-fluid-sm leading-relaxed text-muted">{section.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand-deep py-fluid-xl" aria-labelledby="guias-relacionadas">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <span className="eyebrow">Guías relacionadas</span>
              <h2 id="guias-relacionadas" className="headline mt-4 text-fluid-4xl text-white">
                Profundiza según tu situación
              </h2>
              <p className="mt-3 text-fluid-base leading-relaxed text-muted">
                Contenido escrito y revisado con criterio profesional, fuentes identificables y límites claros.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {config.guides.map((guide) => (
                <article key={guide.href} className="surface-card flex h-full gap-4 rounded-2xl p-6">
                  <BookOpen className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-fluid-lg font-semibold text-white">{guide.title}</h3>
                    <p className="mt-2 flex-1 text-fluid-sm leading-relaxed text-muted">{guide.description}</p>
                    <Link href={guide.href} className="mt-4 inline-flex items-center gap-2 text-fluid-sm font-semibold text-accent">
                      Leer la guía <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-dusk py-fluid-xl" aria-labelledby="preguntas-frecuentes">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 id="preguntas-frecuentes" className="headline text-fluid-4xl text-white">Preguntas frecuentes</h2>
            <div className="mt-7 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.025] px-6">
              {config.faqs.map((faq) => (
                <article key={faq.question} className="py-6">
                  <h3 className="text-fluid-lg font-semibold text-white">{faq.question}</h3>
                  <p className="mt-2 text-fluid-sm leading-relaxed text-muted">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-deep py-fluid-xl">
        <Container>
          <div className="surface-card-accent mx-auto max-w-3xl rounded-2xl p-fluid-md text-center">
            <h2 className="headline text-fluid-3xl text-white">{config.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-fluid-base leading-relaxed text-muted">{config.cta.description}</p>
            <Link href={config.cta.href} className="btn-brand mt-6 text-fluid-base">
              {config.cta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
