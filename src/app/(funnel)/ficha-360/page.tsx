import type { Metadata } from 'next'
import Ficha360Form from './Ficha360Form'

export const metadata: Metadata = {
  title: 'Ficha 360 del cliente | WellnessReal',
  description: 'Cuestionario privado para adaptar el entrenamiento y la alimentación a tu vida real.',
  robots: { index: false, follow: false, nocache: true },
}

export default function Ficha360Page() {
  return <Ficha360Form />
}
