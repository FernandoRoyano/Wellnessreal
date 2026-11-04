# Fatiga, recuperación y decisiones de entrenamiento

Fecha: 4 de noviembre de 2026.

## Alcance

Actualización de los dos artículos publicados `cansancio-e-hipotiroidismo` y `agujetas-cansancio-debilidad-tiroides`, sin crear otras URLs. Se conserva la versión de escenarios y preguntas frecuentes que ya estaba publicada en Supabase pero faltaba en la copia editorial del segundo artículo.

- Ejemplos hipotéticos para mantener, reducir, descansar o detener la progresión y consultar; las cantidades se identifican como ejemplos y no como protocolos clínicos.
- Registro breve de actividad, evolución e impacto en tareas habituales.
- Límites ante empeoramiento desproporcionado después del esfuerzo; la recomendación de NICE NG206 se identifica como específica de ME/CFS y no como un diagnóstico de Hashimoto.
- Resumen de las revisiones de ejercicio de 2023/2024 y 2025, sin prometer cambios hormonales individuales. Corrección de autoría y título de la referencia PMID 37999992.
- Enlaces entre las piezas, la guía de Hashimoto y la comunidad privada con entrada por email.
- Descripción de cansancio abreviada a 150 caracteres y tiempos de lectura recalculados.

## Fuentes comprobadas

[NIDDK, hipotiroidismo](https://www.niddk.nih.gov/health-information/endocrine-diseases/hypothyroidism), [revisión de síntomas persistentes de 2024](https://pubmed.ncbi.nlm.nih.gov/38622434/), [Duñabeitia y colaboradores](https://pubmed.ncbi.nlm.nih.gov/37999992/), [Sundus y colaboradores, 2025](https://pubmed.ncbi.nlm.nih.gov/40446861/), [NICE NG206](https://www.nice.org.uk/guidance/ng206/chapter/recommendations), [ACSM, dolor muscular tardío](https://www.acsm.org/docs/default-source/files-for-resource-library/delayed-onset-muscle-soreness-%28doms%29.pdf), [CDC, signos de rabdomiólisis](https://www.cdc.gov/niosh/rhabdo/signs-symptoms/) y [NHS, dolor torácico](https://www.nhs.uk/symptoms/chest-pain/).

Se contrastaron resúmenes de investigación y documentos institucionales, sin presentar una revisión exhaustiva ni atribuir revisión sanitaria independiente.

## Publicación protegida

`scripts/refresh-fatigue-decisions.mjs` prepara el HTML desde Markdown y guarda una vista previa. Sin `--apply` no escribe en Supabase. La copia previa completa, los HTML y los recibos se conservan en `output/fatigue-decisions-20261104`; no se suben al repositorio.

El modo de aplicación limita el alcance a esos dos artículos publicados, comprueba la copia y la huella del material editorial, detecta conflictos y condiciona la escritura a la fecha de modificación leída. Solo cambia cuerpo, descripción, tiempo de lectura y fecha de modificación. Conserva título, URL, autor, categoría, publicación e imágenes; mantiene las URLs de Storage de las imágenes interiores. Una repetición con el mismo contenido no escribe.

No se modifican cuentas, pagos, formularios, autenticación ni conversaciones de miembros. La actualización editorial se aplica en Supabase y el despliegue posterior regenera las páginas estáticas y el sitemap con los datos actuales. No hay recursos visuales nuevos que deban desplegarse antes.

## Verificación previa

Sintaxis Node, ESLint del script y comprobación de diff correctas. Vista previa comprobada: alcance de campos, títulos conservados, ausencia de H1 duplicados y elementos ejecutables, escenarios y FAQ anteriores preservados, enlaces de continuidad, imágenes interiores y un único marcador de revisión por artículo. Aplicación de los dos artículos verificada y repetición sin escrituras comprobada.

## Verificación pública

Seis comprobaciones de navegador sobre los dos artículos a 320, 375 y 1440 px: un solo H1, títulos y canónicas conservados, descripciones y revisión actualizadas, todos los encabezados previstos presentes, enlaces internos con respuesta 200, imágenes cargadas, fechas estructuradas coherentes y ausencia de errores de página o desbordamiento horizontal. Axe no encuentra incidencias automáticas WCAG A/AA en el contenido principal. Capturas de móvil y escritorio revisadas.

`npm run check:content`: 56 artículos, 56 imágenes y cero incidencias. No se enviaron formularios, correos ni solicitudes de clientes como prueba.
