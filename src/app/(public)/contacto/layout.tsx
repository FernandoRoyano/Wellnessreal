import { buildMetadata } from '@/lib/seo'
import JsonLd, { faqSchema } from '@/components/seo/JsonLd'

export const metadata = buildMetadata({
  title: 'Contacto | Valoración Gratuita',
  description:
    'Contacta con WellnessReal. Solicita tu valoración gratuita de entrenamiento online personalizado. Respondemos en menos de 24 horas.',
  path: '/contacto',
  keywords: [
    'contacto entrenador personal',
    'valoración gratuita entrenamiento',
    'contactar WellnessReal',
    'entrenamiento online contacto',
  ],
})

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={faqSchema([
          {
            question: '¿Cuándo recibiré respuesta a mi mensaje?',
            answer: 'Nos comprometemos a responder todos los mensajes en menos de 24 horas hábiles. Generalmente respondemos en la primera hora de horas de oficina.',
          },
          {
            question: '¿Puedo llamar directamente?',
            answer: 'Sí, puedes llamarnos en horario de oficina al +34 633 261 963. También puedes solicitar una llamada programada.',
          },
          {
            question: '¿Dónde están ubicados?',
            answer: 'Trabajamos online para toda España y ofrecemos servicio presencial en Madrid. Entrenamientos personalizados, osteopatía y consultas directas donde tú estés.',
          },
          {
            question: '¿Hacen consultas online?',
            answer: 'Sí, ofrecemos valoración profesional 100% online. Todo nuestro entrenamiento es digital, flexible y personalizado.',
          },
        ])}
      />
      {children}
    </>
  )
}
