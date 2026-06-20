import { redirect } from "next/navigation";

// El webinar pasó a acceso inmediato: la reserva lleva directa a la clase.
// Mantenemos esta ruta como redirección por si hay enlaces antiguos.
export default function WebinarGracias() {
  redirect("/webinar/clase");
}
