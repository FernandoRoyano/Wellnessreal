import Container from '@/components/common/Container'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Política editorial',
  description:
    'Cómo crea, revisa y actualiza WellnessReal sus contenidos sobre entrenamiento, nutrición y salud.',
  path: '/politica-editorial',
})

function EditorialSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-fluid-xl font-semibold tracking-tight text-accent">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export default function PoliticaEditorialPage() {
  return (
    <section className="relative bg-brand-deep py-fluid-xl">
      <div className="pointer-events-none absolute inset-0 bg-radial-accent opacity-30" />
      <Container>
        <article className="relative mx-auto max-w-3xl">
          <header className="mb-fluid-md space-y-3">
            <span className="eyebrow">Transparencia</span>
            <h1 className="headline text-fluid-5xl text-white">
              Política <span className="text-gradient-brand">editorial</span>
            </h1>
            <p className="text-fluid-lg leading-relaxed text-muted">
              Publicamos contenido para ayudarte a tomar decisiones más informadas sobre
              entrenamiento, alimentación y hábitos, sin sustituir la atención sanitaria.
            </p>
            <p className="text-fluid-sm text-subtle">Última actualización: septiembre de 2026</p>
          </header>

          <div className="space-y-10 text-fluid-base leading-relaxed text-muted">
            <EditorialSection title="1. Quién crea el contenido">
              <p>
                Los contenidos de WellnessReal están dirigidos por Fernando Royano, graduado en
                Ciencias de la Actividad Física y del Deporte, entrenador y fundador de
                WellnessReal. Cuando un tema supera el ámbito del entrenamiento y los hábitos,
                diferenciamos la información educativa del diagnóstico o tratamiento sanitario.
              </p>
            </EditorialSection>

            <EditorialSection title="2. Cómo seleccionamos los temas">
              <p>
                Priorizamos dudas reales de clientes y lectores, problemas frecuentes en la
                práctica profesional y asuntos sobre los que existe desinformación. No elegimos un
                tema solo porque sea tendencia o pueda atraer visitas.
              </p>
            </EditorialSection>

            <EditorialSection title="3. Fuentes y evidencia">
              <p>
                Consultamos guías de organismos sanitarios, revisiones sistemáticas, metaanálisis
                y estudios revisados por pares. Enlazamos las fuentes principales dentro de cada
                artículo para que puedas comprobarlas. Explicamos las limitaciones cuando la
                evidencia es escasa, indirecta o no permite una conclusión firme.
              </p>
            </EditorialSection>

            <EditorialSection title="4. Criterios de redacción">
              <ul className="list-disc space-y-2 pl-6 marker:text-accent">
                <li>Usamos un lenguaje claro y evitamos promesas absolutas.</li>
                <li>Separamos resultados de salud, rendimiento y composición corporal.</li>
                <li>No presentamos asociaciones como si demostraran causalidad.</li>
                <li>No recomendamos modificar medicación ni sustituir seguimiento médico.</li>
                <li>Indicamos cuándo una recomendación general necesita adaptación individual.</li>
              </ul>
            </EditorialSection>

            <EditorialSection title="5. Contenidos sobre salud">
              <p>
                Los artículos sobre hipotiroidismo, Hashimoto, dolor, suplementación u otras
                condiciones tienen una finalidad educativa. No diagnostican, interpretan
                analíticas ni sustituyen a un médico, endocrino, dietista-nutricionista u otro
                profesional sanitario cualificado.
              </p>
            </EditorialSection>

            <EditorialSection title="6. Actualizaciones y correcciones">
              <p>
                Revisamos los contenidos cuando aparece evidencia relevante, cambian las guías o
                detectamos que una explicación puede mejorarse. Las modificaciones sustanciales
                actualizan la fecha del artículo. Si encuentras un error, puedes escribir a{' '}
                <a
                  href="mailto:info@wellnessreal.es"
                  className="text-accent underline underline-offset-2 hover:opacity-80"
                >
                  info@wellnessreal.es
                </a>
                . Lo revisaremos y corregiremos cuando corresponda.
              </p>
            </EditorialSection>

            <EditorialSection title="7. Independencia comercial">
              <p>
                WellnessReal comercializa servicios propios de entrenamiento y acompañamiento.
                Cuando un contenido enlaza a uno de esos servicios, la relación es explícita. Las
                recomendaciones editoriales no se venden a marcas ni se presentan como neutrales
                cuando existe un interés comercial.
              </p>
            </EditorialSection>

            <EditorialSection title="8. Uso responsable">
              <p>
                Ante síntomas nuevos, intensos o persistentes, consulta con un profesional
                sanitario. Puedes conocer mejor el enfoque de WellnessReal en nuestra{' '}
                <Link href="/filosofia" className="text-accent underline underline-offset-2">
                  filosofía de trabajo
                </Link>{' '}
                y revisar las condiciones legales en la{' '}
                <Link href="/privacidad" className="text-accent underline underline-offset-2">
                  política de privacidad
                </Link>
                .
              </p>
            </EditorialSection>
          </div>
        </article>
      </Container>
    </section>
  )
}
