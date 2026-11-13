# Revisión editorial de fuentes — 13 de noviembre de 2026

## Alcance

Revisados diez artículos publicados en Supabase, fuente de contenido de la web. Nueve actualizados y releídos; hierro se conserva. Búsqueda dirigida de guías oficiales, registros bibliográficos y revisiones relevantes: no es una revisión sistemática de toda la literatura ni una validación clínica externa. No se añaden credenciales médicas, diagnósticos, tratamientos o casos reales inventados.

| Artículo | Resultado de la revisión |
|---|---|
| Suplementos y tiroides | Añadida la interferencia de biotina con algunos inmunoanálisis, diferenciada de la absorción de levotiroxina. Sin plazo universal de suspensión. Revisada la referencia de selenio de 2024 y su alcance sobre marcadores. |
| Guía de suplementos para mujeres | Actualizada la evidencia femenina de creatina y añadido contexto sobre biotina y pruebas tiroideas. |
| Creatina para mujeres | Incorporada una revisión con metaanálisis de 2026, manteniendo la de 2025 y explicando sus métodos y límites. La composición corporal no se presenta como prueba general de pérdida de grasa. |
| Vitamina D | Separados los desenlaces de VITAL, fracturas y D-Health, con referencias directas. No se resume toda la investigación como un único resultado ni se invita a suspender pautas indicadas. |
| Omega-3 | ALA identificado como esencial, sin reducir toda la familia a EPA/DHA. Alimento, complemento y tratamiento de prescripción mantienen su distinción. |
| Berberina | Corregido el primer autor de la referencia de 2022: Xie W, no Liang Y. Verificados título, identificador y cautelas sobre eficacia, embarazo e interacciones. |
| Dietas extremas | Aclarado que no hay un umbral universal de disponibilidad energética para autodiagnosticarse REDs; se conserva el contexto deportivo y la exclusión de otras causas. |
| Menopausia e hipotiroidismo | Eliminada la posible lectura de que haya que esperar semanas para consultar. Diferenciado el sangrado posmenopáusico que merece consulta de un cuadro que requiere atención urgente. |
| Agujetas, cansancio y debilidad | Diferenciada la debilidad repentina con signos neurológicos, que requiere atención de emergencia, de la evolución progresiva. Se conservan las cautelas sobre rabdomiólisis y síntomas persistentes. |
| Hierro | Sin cambios: hemoglobina/ferritina, inflamación, prevención poblacional, interacciones y seguimiento ya estaban delimitados. Revisadas las fuentes principales. |

## Fuentes principales

- [AEMPS, ficha técnica de levotiroxina](https://cima.aemps.es/cima/dochtml/ft/64018/FT_64018.html): interferencia de biotina con pruebas de laboratorio.
- [Huwiler et al., selenio, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10951571/).
- [Tam, Mitchell y Forsyth, creatina, 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC11767391/).
- [Lin, Zhu y Hong, creatina, 2026](https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2026.1921827/full).
- [Endocrine Society, vitamina D, 2024](https://www.endocrine.org/clinical-practice-guidelines/vitamin-d-for-prevention-of-disease).
- [VITAL, prevención de cáncer y enfermedad cardiovascular](https://pubmed.ncbi.nlm.nih.gov/30415629/), [VITAL, fracturas](https://pubmed.ncbi.nlm.nih.gov/35939577/), [D-Health, mortalidad](https://pubmed.ncbi.nlm.nih.gov/35026158/) y [D-Health, eventos cardiovasculares](https://pubmed.ncbi.nlm.nih.gov/37380191/).
- [NIH ODS, omega-3](https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/) y [hierro](https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/).
- [OMS, ferritina](https://www.who.int/publications/i/item/9789240000124).
- [NCCIH, berberina](https://www.nccih.nih.gov/health/berberine-and-weight-loss-what-you-need-to-know) y [Xie et al., 2022](https://pubmed.ncbi.nlm.nih.gov/36467075/).
- [COI, consenso REDs 2023](https://bjsm.bmj.com/content/57/17/1073).
- [NICE NG23, menopausia](https://www.nice.org.uk/guidance/ng23/chapter/Recommendations) y [NHS, sangrado posmenopáusico](https://www.nhs.uk/symptoms/post-menopausal-bleeding/).
- [NHS, signos de ictus](https://www.nhs.uk/conditions/stroke/symptoms/), [CDC, rabdomiólisis](https://www.cdc.gov/niosh/rhabdo/signs-symptoms/index.html) y [NIDDK, hipotiroidismo](https://www.niddk.nih.gov/health-information/endocrine-diseases/hypothyroidism).

Cuando PubMed no devolvía el contenido completo a la herramienta web, se contrastaron títulos, primeros autores y resúmenes con EFetch de NCBI. El XML se conserva en el respaldo. Se revisan afirmaciones y referencias concretas, sin atribuir a un resumen más información de la que proporciona.

## Publicación segura

Preparación reproducible: `scripts/prepare-science-calendar-20261113.mjs`. Aplicación: `scripts/apply-science-calendar-20261113.mjs`, primero sin `--apply` y luego con él. Antes de escribir se comprueban contenido original y `updated_at`. Cada escritura exige esa versión y se relee inmediatamente.

En las nueve actualizaciones se comprobó que todos los campos distintos de contenido y fecha de modificación seguían iguales, incluidas fechas originales, URL, título, extracto e imágenes. Los respaldos, HTML original y cambios, metadatos de fuentes y recibos están en `output/science-calendar-2026-11-13` del workspace principal.

El calendario de ocho semanas está en [el plan editorial](community-editorial-calendar-2026-11-13.md). Reutiliza material confirmado, conserva el desbloqueo gradual y no anuncia estrenos ni reuniones sin preparar.

## Validación del calendario

Tres pruebas unitarias del ciclo y seis ejecuciones de navegador en Chrome móvil/escritorio correctas, incluido desbloqueo futuro a 320 px, acceso gratuito, participación opcional editable y conservación del acceso de pago. TypeScript y ESLint de archivos afectados correctos. No se envían mensajes ni se crean hilos automáticamente.

## Verificación pública y despliegue

Implementación fd64d3f. Deployment activo dpl_DzZNgbZ3bnw6PkJ1wyphfSn3JFvb (READY), promovido tras comprobar la versión anterior. Las nueve páginas actualizadas responden HTTP 200 y muestran la revisión del 13/11/2026; verificación después de renovar la versión servida. Dos comprobaciones visuales en producción: biotina a 390 px y evidencia de creatina a 1440 px, sin desbordamiento horizontal. El bloque de comunidad mantiene las seis pruebas de navegador con datos ficticios locales, sin generar publicaciones ni correos reales. El plan de ocho semanas queda activo como rotación de material existente; los recursos nuevos propuestos siguen pendientes de producción y no se anuncian como confirmados.
