# Correcciones de la auditoría · 2 de noviembre de 2026

Se ha trabajado sobre la versión publicada, en un worktree independiente, sin incluir los borradores y cambios locales de otros trabajos. No se han migrado, eliminado ni sobrescrito registros de clientes. La imagen de edad biológica se publicó previamente en `55d8ad6`.

## Cambios

| Hallazgo | Corrección |
|---|---|
| A01 · generación | Todos los caminos exigen una sesión administrativa o una cuenta autenticada propietaria del email con pago confirmado. El origen del cuerpo no concede permisos. El cuestionario requiere acceso y conserva su destino tras el magic link. El email de la cuenta no se cambia en el formulario. |
| A01 · duplicados | Reserva atómica sobre las notas de la solicitud pagada, con expiración y comparación del valor previo. Repetir una evaluación ya generada devuelve su estado sin sustituir el plan. El cliente no recibe el JSON del borrador sin revisar. |
| A02 · consentimiento | La atribución y los identificadores propios esperan a la aceptación. Rechazar o retirar limpia los datos de tracking gestionados por la web y revoca el consentimiento de los SDK cargados. Los eventos de navegación del funnel tampoco se persisten sin aceptación. |
| A03 · Meta | La primera visita se registra después de ejecutar la inicialización; se deduplica por página y se prueba aceptación, recarga y navegación. Se conservan las exclusiones de salud, áreas privadas y URLs no permitidas. |
| A04 · vídeos | Pendiente de grabación por indicación de Fernando. No se han inventado vídeos ni configurado recursos sustitutos. No lanzar campañas de vídeo hasta completar entrega y reproducción. |
| A05–A06 · móvil | Wrapper del hero limitado al viewport, título adaptable y aviso de cookies presente desde el HTML inicial. La elección previa se aplica antes del pintado, evitando el salto al hidratar. |
| A07 · fechas | Formato con zona horaria explícita Europe/Madrid en listado y artículos. |
| A08 · imagen | Asset publicado y comprobado en producción. |
| A09 · oferta | Comparación común de Método BASE y entrenamiento individual en Servicios y Tarifas: alcance, revisión, acceso y precios. |
| A10 · mensajes | Retiradas promesas absolutas de recuperación, prevención y disponibilidad. Retirados testimonios publicitarios sobre abandonar medicación; definidos límites de educación alimentaria y técnicas manuales. No se han atribuido nuevas titulaciones. |
| A11 · información | Actualizados proveedores, apoyo de IA, consentimiento, contratación, duración, cuotas, firma electrónica y desistimiento. La evaluación pide autorización explícita y la registra antes de enviar datos a IA; el nombre no se incorpora al prompt. |
| A12 · formularios | Zod, límites de longitud, escape de HTML y asuntos, protección de frecuencia y guardado del contacto antes del correo. La newsletter del pie tiene origen y bienvenida propios, sin entregar una guía no solicitada. |
| A13 · blog | Consulta de campos resumidos y paginación de 12 artículos en servidor; no se serializan todos los cuerpos en el listado. |
| A14 · relacionados | Consulta primero la misma categoría y después completa; ya no limita la selección temática a los últimos 12 artículos globales. |
| A15 · schema | Retiradas puntuaciones 5/5 no acreditadas; Organization y Person tienen identificadores estables y el autor enlaza a su perfil. |
| A16 · URLs | Redirección de www al host principal y seis equivalencias de WordPress a artículos pertinentes. |
| A17 · contacto | Enlace visible en navegación del pie. |
| A18–A19 · accesibilidad | Contraste del CTA corregido y reducción de movimiento respetada en hero y reproductor antiguo. |
| A20 · filtros | Categoría y página en la URL, conservación al recargar, paginación rastreable y canonical de cada página general. Los filtros no se indexan. |
| A21 · publicación | Comando de verificación de artículos y assets más procedimiento documentado. Markdown editorial y contenido servido por Supabase se distinguen expresamente. |
| A22 · cuotas | Total del fraccionado y calendario visibles: 370 € en Método BASE y 810 € en individual. |

## Verificación

- TypeScript y ESLint sin errores.
- 26 pruebas unitarias, incluidas identidad ajena, ausencia de sesión, pago requerido, reserva concurrente y escape del correo.
- 32 pruebas de navegador en Chrome móvil y escritorio sobre la compilación de producción: hero a 320 px, CLS inicial, cookies, atribución, primera visita Meta, filtros, relacionados, contraste, rechazo de generación anónima y recorridos de guía, test, solicitud, valoración y confirmación de pago no verificado.
- Compilación de producción de Next.js con webpack.
- Comprobación pública: 56 artículos, 56 imágenes principales y cero incidencias.
- Diagnóstico autenticado del despliegue anterior: configuración de autenticación disponible y tablas de comunidad presentes. La descarga local de Vercel no devolvía el valor de la clave pública, aunque el runtime sí lo tenía; no se sustituyeron claves por ese motivo.

No se han efectuado cobros, enviado correos reales ni generado planes válidos como prueba. Los controles de identidad y concurrencia se prueban con dobles de dependencias, sin registros personales. Los límites de frecuencia de formularios reutilizan el limitador existente por instancia; la reserva de generación sí se arbitra en base de datos entre instancias.

La actualización documental no sustituye la revisión de los contratos de encargados, regiones y garantías efectivamente contratadas. Las pruebas con dos clientes reales y un pago de Stripe en modo test siguen siendo verificaciones operativas, no acciones realizadas sobre producción durante este trabajo.

## Mantenimiento

Ejecutar `npm run check:content` tras publicar y seguir [el procedimiento de publicación](publicacion-contenido.md). No añadir al commit archivos `.env`, credenciales, artefactos de pruebas ni cambios ajenos al trabajo.
