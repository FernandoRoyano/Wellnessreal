import type { Metadata } from "next";
import Cuestionario from "./Cuestionario";

export const metadata: Metadata = {
  title: "Tu plan personalizado | WellnessReal",
  description:
    "Cuéntanos tu situación y te preparamos un plan de entrenamiento y nutrición personalizado con el método de Fernando Royano.",
  alternates: { canonical: "https://wellnessreal.es/cuestionario" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Cuestionario />;
}
