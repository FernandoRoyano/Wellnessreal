export function getDefaultContractText(params: {
  clientName: string
  serviceLabel: string
  price: number
  duration: string
}): string {
  return `CONTRATO DE PRESTACIÓN DE SERVICIOS

Entre WellnessReal (en adelante, "el Profesional") y ${params.clientName} (en adelante, "el Cliente").

SERVICIO CONTRATADO: ${params.serviceLabel}
DURACIÓN: ${params.duration}
PRECIO: ${params.price}€

CONDICIONES GENERALES:

1. El Cliente se compromete al pago del importe total antes del inicio del servicio.
2. El Profesional se compromete a prestar el servicio descrito con la máxima profesionalidad.
3. El servicio es personal e intransferible.
4. Política de cancelación: Se permite cancelación con 48h de antelación para servicios presenciales.
5. Los resultados dependen del compromiso y adherencia del Cliente al plan proporcionado.
6. Los datos personales serán tratados conforme a la LOPD y el RGPD.
7. Ambas partes aceptan resolver cualquier disputa de forma amistosa.

En Madrid, a la fecha de firma digital.`
}
