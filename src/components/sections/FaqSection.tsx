import { Plus } from 'lucide-react'
import Container from '@/components/common/Container'
import JsonLd, { faqSchema } from '@/components/seo/JsonLd'

export interface Faq {
  question: string
  answer: string
}

interface FaqSectionProps {
  faqs: Faq[]
  /** Título visible de la sección. */
  title?: string
  eyebrow?: string
  /** Fondo de la sección para encajar con el ritmo de la página. */
  background?: 'deep' | 'dusk'
}

// Sección de preguntas frecuentes con `<details>` nativo (accesible, sin JS) que
// además inyecta el schema FAQPage para que Google muestre las preguntas en los
// resultados de búsqueda.
export default function FaqSection({
  faqs,
  title = 'Preguntas frecuentes',
  eyebrow = 'Dudas habituales',
  background = 'deep',
}: FaqSectionProps) {
  const bg = background === 'dusk' ? 'bg-brand-dusk' : 'bg-brand-deep'

  return (
    <section className={`relative py-fluid-xl ${bg}`}>
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
          <span className="eyebrow justify-center">{eyebrow}</span>
          <h2 className="headline text-fluid-4xl text-white">{title}</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group surface-card rounded-2xl px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-fluid-lg font-semibold text-white">
                {faq.question}
                <Plus
                  className="shrink-0 w-5 h-5 text-accent transition-transform duration-300 group-open:rotate-45"
                  strokeWidth={2.5}
                />
              </summary>
              <p className="text-fluid-base text-muted leading-relaxed mt-4">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>

      <JsonLd data={faqSchema(faqs)} />
    </section>
  )
}
