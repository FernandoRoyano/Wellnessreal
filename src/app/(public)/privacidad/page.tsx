import Container from '@/components/common/Container'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | WellnessReal',
  description: 'Política de privacidad y protección de datos de WellnessReal.',
}

export default function PrivacidadPage() {
  return (
    <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-28">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-10 tracking-widest">
            POLÍTICA DE PRIVACIDAD
          </h1>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <p className="text-sm text-gray-500">Última actualización: febrero 2026</p>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">1. Responsable del tratamiento</h2>
              <p>
                <strong className="text-white">Identidad:</strong> Fernando Royano Cabrero (WellnessReal)<br />
                <strong className="text-white">CIF:</strong> 72171129G<br />
                <strong className="text-white">Email:</strong> info@wellnessreal.es<br />
                <strong className="text-white">Teléfono:</strong> +34 633 261 963
              </p>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">2. Datos que recopilamos</h2>
              <p>Recopilamos los siguientes datos personales:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Datos de salud y actividad física (proporcionados voluntariamente en las consultas)</li>
                <li>Datos de navegación (cookies técnicas y analíticas)</li>
                <li>Datos de pago (procesados directamente por Stripe, no almacenamos datos bancarios de tarjeta)</li>
              </ul>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">3. Finalidad del tratamiento</h2>
              <p>Tus datos se utilizan para:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Gestionar la prestación de nuestros servicios de entrenamiento, nutrición y osteopatía</li>
                <li>Responder a tus consultas y solicitudes de información</li>
                <li>Enviar comunicaciones comerciales si has dado tu consentimiento (newsletter)</li>
                <li>Gestionar la facturación y cobros de los servicios contratados</li>
                <li>Cumplir con obligaciones legales y fiscales</li>
              </ul>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">4. Base legal</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong className="text-white">Ejecución del contrato:</strong> para prestar los servicios contratados</li>
                <li><strong className="text-white">Consentimiento:</strong> para el envío de comunicaciones comerciales y uso de cookies no esenciales</li>
                <li><strong className="text-white">Interés legítimo:</strong> para la mejora de nuestros servicios</li>
                <li><strong className="text-white">Obligación legal:</strong> para cumplir con la normativa fiscal y mercantil</li>
              </ul>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">5. Conservación de datos</h2>
              <p>
                Los datos personales se conservarán mientras dure la relación contractual y, una vez finalizada,
                durante los plazos legalmente establecidos. Los datos de contacto para comunicaciones comerciales
                se conservarán hasta que solicites la baja.
              </p>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">6. Destinatarios</h2>
              <p>Tus datos podrán ser comunicados a:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong className="text-white">Stripe:</strong> para el procesamiento de pagos con tarjeta</li>
                <li><strong className="text-white">Proveedores de hosting:</strong> Vercel (alojamiento web)</li>
                <li><strong className="text-white">MongoDB Atlas:</strong> almacenamiento de datos en la nube</li>
                <li><strong className="text-white">Administraciones públicas:</strong> cuando exista obligación legal</li>
              </ul>
              <p className="mt-2">No vendemos ni cedemos tus datos a terceros con fines comerciales.</p>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">7. Transferencias internacionales</h2>
              <p>
                Algunos de nuestros proveedores de servicios (Vercel, MongoDB Atlas, Stripe) pueden tratar datos
                fuera del Espacio Económico Europeo, siempre bajo las garantías adecuadas establecidas
                en el RGPD (cláusulas contractuales tipo o decisiones de adecuación de la Comisión Europea).
              </p>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">8. Tus derechos</h2>
              <p>Puedes ejercer los siguientes derechos:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong className="text-white">Acceso:</strong> conocer qué datos tuyos tratamos</li>
                <li><strong className="text-white">Rectificación:</strong> modificar datos inexactos</li>
                <li><strong className="text-white">Supresión:</strong> solicitar la eliminación de tus datos</li>
                <li><strong className="text-white">Oposición:</strong> oponerte al tratamiento de tus datos</li>
                <li><strong className="text-white">Limitación:</strong> restringir el tratamiento en determinados casos</li>
                <li><strong className="text-white">Portabilidad:</strong> recibir tus datos en un formato estructurado</li>
              </ul>
              <p className="mt-3">
                Para ejercer tus derechos, escríbenos a{' '}
                <a href="mailto:info@wellnessreal.es" className="underline" style={{ color: '#FCEE21' }}>
                  info@wellnessreal.es
                </a>.
              </p>
              <p className="mt-2">
                Si consideras que tus derechos no han sido atendidos, puedes presentar una reclamación ante la{' '}
                <strong className="text-white">Agencia Española de Protección de Datos</strong> (www.aepd.es).
              </p>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">9. Cookies</h2>
              <p>
                Este sitio web utiliza cookies propias y de terceros. Puedes consultar nuestra política de cookies
                y gestionar tus preferencias a través del banner de cookies que aparece en tu primera visita.
              </p>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">10. Seguridad</h2>
              <p>
                Aplicamos medidas técnicas y organizativas para proteger tus datos personales frente a
                accesos no autorizados, pérdida o destrucción. Los pagos con tarjeta se procesan de forma
                segura a través de Stripe, certificado PCI DSS.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
