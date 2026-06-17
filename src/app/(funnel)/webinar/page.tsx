import type { Metadata } from "next";
import WebinarLanding from "./WebinarLanding";

export const metadata: Metadata = {
  title: "Clase gratuita | WellnessReal — Entrena con cabeza, no con culpa",
  description:
    "Clase online gratuita: por qué tu cuerpo deja de responder a partir de los 35 y el sistema que usan mis clientes para transformarse sin dietas extremas. Reserva tu plaza.",
  alternates: { canonical: "https://wellnessreal.es/webinar" },
  // Landing de captación: no indexar para no competir con la web principal
  robots: { index: false, follow: true },
  openGraph: {
    title: "Clase gratuita | WellnessReal",
    description:
      "Por qué tu cuerpo deja de responder a partir de los 35 y el sistema para transformarte sin dietas extremas.",
    url: "https://wellnessreal.es/webinar",
    siteName: "WellnessReal",
    locale: "es_ES",
    type: "website",
  },
};

export default function Page() {
  return <WebinarLanding />;
}
