import Container from '@/components/common/Container'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | WellnessReal',
  description: 'Política de privacidad y protección de datos de WellnessReal.',
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-fluid-xl font-semibold text-accent tracking-tight">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

export default function PrivacidadPage() {
  return (
    <section className="relative py-fluid-xl bg-brand-deep">
      <div className="absolute inset-0 bg-radial-accent opacity-30 pointer-events-none" />
      <Container>
        <div className="relative max-w-3xl mx-auto">
          <div className="mb-fluid-md space-y-3">
            <span className="eyebrow">Legal</span>
            <h1 className="headline text-fluid-5xl text-white">
              Política de <span className="text-gradient-brand">privacidad</span>
            </h1>
            <p className="text-fluid-sm text-subtle">Última actualización: febrero 2026</p>
          </div>

          <div className="space-y-10 text-fluid-base text-muted leading-relaxed">
            <LegalSection title="1. Responsable del tratamiento">
              <p>
                <strong className="text-white">Identidad:</strong> Fernando Royano Cabrero (WellnessReal)<br />
                <strong className="text-white">CIF:</strong> 72171129G<br />
                <strong className="text-white">Email:</strong> info@wellnessreal.es<br />
                <strong className="text-white">Teléfono:</strong> +34 633 261 963
              </p>
            </LegalSection>

            <LegalSection title="2. Datos que recopilamos">
              <p>Recopilamos los siguientes datos personales:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 marker:text-accent">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Datos de salud y actividad física (proporcionados voluntariamente en las consultas)</li>
                <li>Datos de navegación (cookies técnicas y analíticas)</li>
                <li>Datos de pago (procesados directamente por Stripe, no almacenamos datos bancarios de tarjeta)</li>
              </ul>
            </LegalSection>

            <LegalSection title="3. Finalidad del tratamiento">
              <p>Tus datos se utilizan para:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 marker:text-accent">
                <li>Gestionar la prestación de servicios de entrenamiento, nutrición y osteopatía</li>
                <li>Responder a tus consultas y solicitudes de información</li>
                <li>Enviar comunicaciones comerciales si has dado tu consentimiento (newsletter)</li>
                <li>Gestionar la facturación y cobros de los servicios contratados</li>
                <li>Cumplir con obligaciones legales y fiscales</li>
              </ul>
            </LegalSection>

            <LegalSection title="4. Base legal">
              <ul className="list-disc pl-6 space-y-1 marker:text-accent">
                <li><strong className="text-white">Ejecución del contrato:</strong> para prestar los servicios contratados</li>
                <li><strong className="text-white">Consentimiento:</strong> para comunicaciones comerciales y cookies no esenciales</li>
                <li><strong className="text-white">Interés legítimo:</strong> para la mejora de los servicios</li>
                <li><strong className="text-white">Obligación legal:</strong> para cumplir con la normativa fiscal y mercantil</li>
              </ul>
            </LegalSection>

            <LegalSection title="5. Conservación de datos">
              <p>
                Los datos personales se conservarán mientras dure la relación contractual y, una vez finalizada, durante
                los plazos legalmente establecidos. Los datos de contacto para comunicaciones comerciales se
                conservarán hasta que solicites la baja.
              </p>
            </LegalSection>

            <LegalSection title="6. Destinatarios">
              <p>Tus datos podrán ser comunicados a:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 marker:text-accent">
                <li><strong className="text-white">Stripe:</strong> procesamiento de pagos con tarjeta</li>
                <li><strong className="text-white">Vercel:</strong> alojamiento web</li>
                <li><strong className="text-white">MongoDB Atlas:</strong> almacenamiento de datos en la nube</li>
                <li><strong className="text-white">Administraciones públicas:</strong> cuando exista obligación legal</li>
              </ul>
              <p className="mt-2">No vendo ni cedo tus datos a terceros con fines comerciales.</p>
            </LegalSection>

            <LegalSection title="7. Transferencias internacionales">
              <p>
                Algunos proveedores de servicios (Vercel, MongoDB Atlas, Stripe) pueden tratar datos fuera del Espacio
                Económico Europeo, siempre bajo las garantías adecuadas establecidas en el RGPD (cláusulas
                contractuales tipo o decisiones de adecuación de la Comisión Europea).
              </p>
            </LegalSection>

            <LegalSection title="8. Tus derechos">
              <p>Puedes ejercer los siguientes derechos:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 marker:text-accent">
                <li><strong className="text-white">Acceso:</strong> conocer qué datos tuyos trato</li>
                <li><strong className="text-white">Rectificación:</strong> modificar datos inexactos</li>
                <li><strong className="text-white">Supresión:</strong> solicitar la eliminación de tus datos</li>
                <li><strong className="text-white">Oposición:</strong> oponerte al tratamiento</li>
                <li><strong className="text-white">Limitación:</strong> restringir el tratamiento en determinados casos</li>
                <li><strong className="text-white">Portabilidad:</strong> recibir tus datos en un formato estructurado</li>
              </ul>
              <p className="mt-3">
                Para ejercer tus derechos, escríbeme a{' '}
                <a href="mailto:info@wellnessreal.es" className="text-accent underline underline-offset-2 hover:opacity-80">
                  info@wellnessreal.es
                </a>.
              </p>
              <p className="mt-2">
                Si consideras que tus derechos no han sido atendidos, puedes presentar una reclamación ante la{' '}
                <strong className="text-white">Agencia Española de Protección de Datos</strong> (www.aepd.es).
              </p>
            </LegalSection>

            <LegalSection title="9. Cookies">
              <p>
                Este sitio web utiliza cookies propias y de terceros. Puedes consultar la política de cookies y
                gestionar tus preferencias a través del banner de cookies que aparece en tu primera visita.
              </p>
            </LegalSection>

            <LegalSection title="10. Seguridad">
              <p>
                Aplico medidas técnicas y organizativas para proteger tus datos personales frente a accesos no
                autorizados, pérdida o destrucción. Los pagos con tarjeta se procesan de forma segura a través de
                Stripe, certificado PCI DSS.
              </p>
            </LegalSection>
          </div>
        </div>
      </Container>
    </section>
  )
}
