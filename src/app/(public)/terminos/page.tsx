import Container from '@/components/common/Container'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | WellnessReal',
  description: 'Términos y condiciones de uso de los servicios de WellnessReal.',
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-fluid-xl font-semibold text-accent tracking-tight">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

export default function TerminosPage() {
  return (
    <section className="relative py-fluid-xl bg-brand-deep">
      <div className="absolute inset-0 bg-radial-accent opacity-30 pointer-events-none" />
      <Container>
        <div className="relative max-w-3xl mx-auto">
          <div className="mb-fluid-md space-y-3">
            <span className="eyebrow">Legal</span>
            <h1 className="headline text-fluid-5xl text-white">
              Términos y <span className="text-gradient-brand">condiciones</span>
            </h1>
            <p className="text-fluid-sm text-subtle">Última actualización: febrero 2026</p>
          </div>

          <div className="space-y-10 text-fluid-base text-muted leading-relaxed">
            <LegalSection title="1. Identificación">
              <p>
                El presente sitio web es propiedad de:<br />
                <strong className="text-white">Fernando Royano Cabrero</strong>, operando bajo la marca WellnessReal.<br />
                <strong className="text-white">CIF:</strong> 72171129G<br />
                <strong className="text-white">Email:</strong> info@wellnessreal.es<br />
                <strong className="text-white">Teléfono:</strong> +34 633 261 963
              </p>
            </LegalSection>

            <LegalSection title="2. Objeto">
              <p>
                Estos términos regulan el uso del sitio web wellnessreal.es y la contratación de los servicios
                ofrecidos: entrenamiento personal (online y presencial), nutrición personalizada, osteopatía y
                servicios combinados.
              </p>
            </LegalSection>

            <LegalSection title="3. Servicios y contratación">
              <ul className="list-disc pl-6 space-y-2 marker:text-accent">
                <li>La contratación de servicios se realiza a través de propuestas personalizadas enviadas de forma individual a cada cliente.</li>
                <li>El cliente recibirá un enlace único donde podrá revisar la propuesta, aceptar las condiciones y realizar el pago.</li>
                <li>La aceptación digital del contrato (nombre completo + checkbox de aceptación) tiene la misma validez que una firma manuscrita conforme a la Ley 59/2003 de Firma Electrónica.</li>
                <li>El servicio comenzará una vez confirmado el pago.</li>
              </ul>
            </LegalSection>

            <LegalSection title="4. Precios y pago">
              <ul className="list-disc pl-6 space-y-2 marker:text-accent">
                <li>Los precios están indicados en euros (€) e incluyen impuestos cuando corresponda.</li>
                <li>
                  Métodos de pago aceptados:
                  <ul className="list-disc pl-6 mt-1 space-y-1 marker:text-accent/60">
                    <li><strong className="text-white">Tarjeta de crédito/débito:</strong> procesado de forma segura por Stripe.</li>
                    <li><strong className="text-white">Transferencia bancaria:</strong> a la cuenta indicada en la propuesta.</li>
                  </ul>
                </li>
                <li>El pago trimestral se abona íntegramente al inicio del periodo.</li>
                <li>Los precios pueden ser actualizados. El precio vigente será el indicado en la propuesta aceptada.</li>
              </ul>
            </LegalSection>

            <LegalSection title="5. Cancelación y reembolsos">
              <ul className="list-disc pl-6 space-y-2 marker:text-accent">
                <li>Puedes cancelar tu suscripción en cualquier momento comunicándolo a info@wellnessreal.es.</li>
                <li>
                  <strong className="text-white">Derecho de desistimiento:</strong> dispones de 14 días naturales desde
                  la contratación para desistir sin necesidad de justificación, siempre que no se haya comenzado la
                  prestación del servicio.
                </li>
                <li>Si el servicio ya ha comenzado, no se realizarán reembolsos por el periodo en curso.</li>
                <li>
                  <strong className="text-white">Sesiones presenciales:</strong> se pueden cancelar o reprogramar con un
                  mínimo de 48 horas de antelación. Las cancelaciones con menos de 48h no serán reembolsadas.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="6. Obligaciones del cliente">
              <ul className="list-disc pl-6 space-y-2 marker:text-accent">
                <li>Proporcionar información veraz sobre tu estado de salud y condición física.</li>
                <li>Consultar con un médico antes de iniciar cualquier programa de entrenamiento si tienes condiciones de salud preexistentes.</li>
                <li>Seguir las indicaciones del profesional para obtener los mejores resultados.</li>
                <li>No compartir ni redistribuir el material proporcionado (planes, vídeos, guías).</li>
              </ul>
            </LegalSection>

            <LegalSection title="7. Limitación de responsabilidad">
              <ul className="list-disc pl-6 space-y-2 marker:text-accent">
                <li>WellnessReal ofrece servicios de entrenamiento personal y bienestar. No es un servicio médico ni sustituye la atención sanitaria profesional.</li>
                <li>Los resultados dependen del compromiso, adherencia y circunstancias individuales de cada cliente.</li>
                <li>No me responsabilizo de lesiones derivadas de una ejecución incorrecta de los ejercicios o del incumplimiento de las indicaciones proporcionadas.</li>
              </ul>
            </LegalSection>

            <LegalSection title="8. Propiedad intelectual">
              <p>
                Todos los contenidos del sitio web (textos, imágenes, logos, vídeos, planes de entrenamiento, guías
                nutricionales) son propiedad de WellnessReal o se utilizan con autorización. Queda prohibida su
                reproducción, distribución o uso comercial sin autorización expresa.
              </p>
            </LegalSection>

            <LegalSection title="9. Protección de datos">
              <p>
                El tratamiento de datos personales se rige por la{' '}
                <a href="/privacidad" className="text-accent underline underline-offset-2 hover:opacity-80">
                  Política de Privacidad
                </a>.
              </p>
            </LegalSection>

            <LegalSection title="10. Modificaciones">
              <p>
                WellnessReal se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán
                publicados en esta página y entrarán en vigor desde su publicación. Para los servicios ya contratados,
                se aplicarán los términos vigentes en el momento de la contratación.
              </p>
            </LegalSection>

            <LegalSection title="11. Legislación aplicable">
              <p>
                Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se someten
                a los juzgados y tribunales de Madrid, salvo que la normativa de consumidores establezca otra
                jurisdicción.
              </p>
            </LegalSection>

            <div className="pt-6 border-t border-border-subtle">
              <p className="text-fluid-sm text-subtle">
                Si tienes dudas sobre estos términos, escríbeme a{' '}
                <a href="mailto:info@wellnessreal.es" className="text-accent underline underline-offset-2 hover:opacity-80">
                  info@wellnessreal.es
                </a>.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
