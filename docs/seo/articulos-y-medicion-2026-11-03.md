# Artículos y medición comercial · 3 de noviembre de 2026

## Alcance

Trabajo basado en la versión publicada `0f8fa50`, rama `feat/seo-lead-measurement-20261103`. No incorporar la copia de trabajo antigua del repositorio principal al publicar.

### Contenido

Revisados `mejor-ejercicio-hipotiroidismo`, `agujetas-cansancio-debilidad-tiroides` y `por-que-no-adelgazo-con-hipotiroidismo`:

- Título y descripción específicos de cada búsqueda, sin prometer resultados.
- Primer párrafo orientado a la duda del lector.
- Enlaces hacia las guías relacionadas y los dos formatos de acompañamiento.
- Conservación de URL, imagen, autor y fecha de publicación; contenido clínico y bibliografía preservados después del primer párrafo.
- Markdown editorial actualizado. El contenido público se sirve desde Supabase; editar Markdown no actualiza por sí solo la web.

El script `scripts/seo-thyroid-conversion-refresh.mjs` prepara una vista previa y copia del contenido actual en `output/seo-leads-20261103`. No escribe en base de datos por defecto. `--apply` usa la vista previa existente, comprueba su alcance y exige que coincida la fecha de modificación del registro antes de actualizar título, descripción, cuerpo y fecha de modificación. Guarda un recibo por artículo; no toca `published_at`, `published`, imagen ni slug. No regenerar o sobrescribir una vista previa que ya sirve como copia.

Las aperturas se contrastaron con NHS y American Thyroid Association. La revisión SEO sigue las indicaciones de Google sobre descripciones específicas; Google puede elegir otro snippet:

- https://www.nhs.uk/conditions/underactive-thyroid-hypothyroidism/
- https://www.thyroid.org/thyroid-and-weight/
- https://developers.google.com/search/docs/appearance/snippet

### Medición

El panel `/admin/leads` distingue tipo de contacto y fase comercial usando las etiquetas existentes, sin migración de base de datos:

- Tipo: sin revisar, prueba, descarga/suscripción o solicitud comercial.
- Fase: sin revisar, pendiente de contacto, contactado, conversación realizada, propuesta enviada, pago confirmado o no continúa.
- Las nuevas capturas de guía/newsletter se identifican como suscripción; las solicitudes de valoración como comerciales. Si un suscriptor solicita una valoración, se conserva su atribución original y pasa a solicitud comercial. Una prueba ya marcada permanece como prueba.
- Los contactos anteriores no se reclasifican por su nombre, email o etiqueta «cliente». Los 23 registros reales consultados siguen sin cambios.
- Un pago se cuenta solo después de confirmarlo expresamente desde una sesión administrativa. El webhook antiguo puede conservar el estado «cliente», pero ese estado por sí solo no equivale a confirmación en esta medición. No se añade conciliación automática de pagos en esta tarea.
- Conversaciones y propuestas registradas se conservan al avanzar de fase. Si se salta directamente a pago, no se inventan fases intermedias.
- Las cifras son históricas y se agrupan por canal de captación, no por fecha de cobro. No representan importes ni una contabilidad de ingresos. Una referencia no se etiqueta automáticamente como Google orgánico; sin evidencia se muestra «Sin atribución».
- Se conservan las etiquetas de origen; los cambios concurrentes devuelven un conflicto y no cierran la ficha ni ocultan errores.
- La lista pagina 200 contactos; el resumen recorre todos los registros, evitando truncar métricas al límite de Supabase.
- El dashboard deja de mostrar porcentajes calculados entre estados independientes como si fueran conversiones sucesivas. Remite al seguimiento comercial revisado.

Para revisar el histórico: abrir cada ficha y elegir su tipo. En solicitudes reales, registrar la fase comprobada; marcar pago únicamente después de verificarlo. No es necesario borrar pruebas ni descargas para excluirlas de las cifras comerciales.

## Verificación

- TypeScript y ESLint de los archivos afectados correctos.
- 29 pruebas de captura, clasificación y API: aislamiento de pruebas/suscripciones, cliente antiguo sin pago confirmado, preservación de origen y fechas, confirmación explícita de pago, autorización y conflicto concurrente.
- Cuatro pruebas de navegador con datos simulados en Chrome móvil y escritorio: pago confirmado, error de guardado y conservación de la ficha. Se corrigió la superposición de la navegación móvil sobre Guardar.
- Filtros Supabase comprobados mediante consultas de lectura, sin imprimir datos personales ni modificar contactos.
- Comprobación de preservación del cuerpo de los tres artículos y de los enlaces comerciales en las vistas previas.
- El bloque comercial usa un H2 independiente, sin envolver varios párrafos en una sección: el renderizador del blog divide el HTML por párrafos y necesita fragmentos independientes. Dos pruebas adicionales cubren este formato y la prevención de aplicaciones duplicadas.

## Estado

Publicado el 3 de noviembre de 2026 desde `597e2f8`. Artículos aplicados en Supabase, conservando copia previa y recibos en `output/seo-leads-20261103`. El panel y sus métricas se han comprobado mediante acceso administrativo de lectura; los 23 contactos conservan su contenido anterior. No se han enviado emails, mensajes ni solicitudes comerciales de prueba a producción. Los registros antiguos siguen pendientes de clasificación manual.
