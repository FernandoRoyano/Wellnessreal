import Container from '@/components/common/Container'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | WellnessReal',
  description: 'Términos y condiciones de uso de los servicios de WellnessReal.',
}

export default function TerminosPage() {
  return (
    <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-28">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-10 tracking-widest">
            TÉRMINOS Y CONDICIONES
          </h1>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <p className="text-sm text-gray-500">Última actualización: febrero 2026</p>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">1. Identificación</h2>
              <p>
                El presente sitio web es propiedad de:<br />
                <strong className="text-white">Fernando Royano Cabrero</strong>, operando bajo la marca WellnessReal.<br />
                <strong className="text-white">CIF:</strong> 72171129G<br />
                <strong className="text-white">Email:</strong> info@wellnessreal.es<br />
                <strong className="text-white">Teléfono:</strong> +34 633 261 963
              </p>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">2. Objeto</h2>
              <p>
                Estos términos regulan el uso del sitio web wellnessreal.es y la contratación de los
                servicios ofrecidos: entrenamiento personal (online y presencial), nutrición personalizada,
                osteopatía y servicios combinados.
              </p>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">3. Servicios y contratación</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  La contratación de servicios se realiza a través de propuestas personalizadas
                  enviadas de forma individual a cada cliente.
                </li>
                <li>
                  El cliente recibirá un enlace único donde podrá revisar la propuesta, aceptar
                  las condiciones y realizar el pago.
                </li>
                <li>
                  La aceptación digital del contrato (nombre completo + checkbox de aceptación)
                  tiene la misma validez que una firma manuscrita conforme a la Ley 59/2003
                  de Firma Electrónica.
                </li>
                <li>
                  El servicio comenzará una vez confirmado el pago.
                </li>
              </ul>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">4. Precios y pago</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Los precios están indicados en euros (€) e incluyen impuestos cuando corresponda.</li>
                <li>
                  Métodos de pago aceptados:
                  <ul className="list-disc pl-6 mt-1 space-y-1">
                    <li><strong className="text-white">Tarjeta de crédito/débito:</strong> procesado de forma segura por Stripe.</li>
                    <li><strong className="text-white">Transferencia bancaria:</strong> a la cuenta indicada en la propuesta.</li>
                  </ul>
                </li>
                <li>El pago trimestral se abona íntegramente al inicio del periodo.</li>
                <li>Los precios pueden ser actualizados. El precio vigente será el indicado en la propuesta aceptada.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">5. Cancelación y reembolsos</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Puedes cancelar tu suscripción en cualquier momento comunicándolo a info@wellnessreal.es.
                </li>
                <li>
                  <strong className="text-white">Derecho de desistimiento:</strong> Dispones de 14 días naturales
                  desde la contratación para desistir sin necesidad de justificación, siempre que no se haya
                  comenzado la prestación del servicio.
                </li>
                <li>
                  Si el servicio ya ha comenzado, no se realizarán reembolsos por el periodo en curso.
                </li>
                <li>
                  <strong className="text-white">Sesiones presenciales:</strong> se pueden cancelar o reprogramar
                  con un mínimo de 48 horas de antelación. Las cancelaciones con menos de 48h no serán reembolsadas.
                </li>
              </ul>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">6. Obligaciones del cliente</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proporcionar información veraz sobre tu estado de salud y condición física.</li>
                <li>Consultar con un médico antes de iniciar cualquier programa de entrenamiento si tienes condiciones de salud preexistentes.</li>
                <li>Seguir las indicaciones del profesional para obtener los mejores resultados.</li>
                <li>No compartir ni redistribuir el material proporcionado (planes, vídeos, guías).</li>
              </ul>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">7. Limitación de responsabilidad</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  WellnessReal ofrece servicios de entrenamiento personal y bienestar.
                  No somos un servicio médico ni sustituimos la atención sanitaria profesional.
                </li>
                <li>
                  Los resultados dependen del compromiso, adherencia y circunstancias individuales de cada cliente.
                </li>
                <li>
                  No nos responsabilizamos de lesiones derivadas de una ejecución incorrecta de los ejercicios
                  o del incumplimiento de las indicaciones proporcionadas.
                </li>
              </ul>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">8. Propiedad intelectual</h2>
              <p>
                Todos los contenidos del sitio web (textos, imágenes, logos, vídeos, planes de entrenamiento,
                guías nutricionales) son propiedad de WellnessReal o se utilizan con autorización.
                Queda prohibida su reproducción, distribución o uso comercial sin autorización expresa.
              </p>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">9. Protección de datos</h2>
              <p>
                El tratamiento de datos personales se rige por nuestra{' '}
                <a href="/privacidad" className="underline" style={{ color: '#FCEE21' }}>
                  Política de Privacidad
                </a>.
              </p>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">10. Modificaciones</h2>
              <p>
                WellnessReal se reserva el derecho de modificar estos términos en cualquier momento.
                Los cambios serán publicados en esta página y entrarán en vigor desde su publicación.
                Para los servicios ya contratados, se aplicarán los términos vigentes en el momento de la contratación.
              </p>
            </div>

            <div>
              <h2 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3">11. Legislación aplicable</h2>
              <p>
                Estos términos se rigen por la legislación española. Para cualquier controversia,
                las partes se someten a los juzgados y tribunales de Madrid, salvo que la normativa
                de consumidores establezca otra jurisdicción.
              </p>
            </div>

            <div className="pt-4" style={{ borderTop: '1px solid #662D91' }}>
              <p className="text-gray-500 text-sm">
                Si tienes dudas sobre estos términos, escríbenos a{' '}
                <a href="mailto:info@wellnessreal.es" className="underline" style={{ color: '#FCEE21' }}>
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
