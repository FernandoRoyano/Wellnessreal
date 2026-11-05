# Ganar masa muscular con hipotiroidismo

Fecha de primera publicación: 5 de noviembre de 2026.

URL: `/blog/ganar-masa-muscular-con-hipotiroidismo`.

## Decisión editorial

Se publica el borrador existente, conservando su identificador, URL, autor y categoría. La intención es desarrollar el entrenamiento de fuerza para mujeres con hipotiroidismo, diferenciando este objetivo de las guías de inicio, fatiga y pérdida de peso. Es una prioridad por encaje con el servicio: el informe de Search Console recibido no demuestra volumen de búsqueda para esta consulta.

El borrador tenía una fecha futura del 13 de noviembre. Al publicarlo ahora se establece la fecha real del 5 de noviembre. La categoría de tiroides pasa de nueve a diez artículos publicados; el blog, de 56 a 57.

## Contenido

- Diferencia entre evidencia general de hipertrofia y resultados estudiados específicamente en hipotiroidismo.
- Selección de movimientos, volumen, esfuerzo y repetición de condiciones para comparar sesiones.
- Dos sesiones didácticas y un ejemplo de progresión sin aumentos semanales obligatorios.
- Alimentación como apoyo, sin dosis dietéticas o suplementos tiroideos universales.
- Recuperación, registro y límites ante cambios importantes; fuerza y peso no se presentan como mediciones directas de músculo.
- Cinco preguntas frecuentes y continuidad hacia las guías, la comunidad privada con email y el programa de pago, con alcances diferenciados.

Se han consultado los resúmenes de [ACSM, 2026](https://pubmed.ncbi.nlm.nih.gov/41843416/), [Duñabeitia y colaboradores](https://pubmed.ncbi.nlm.nih.gov/37999992/), [Ahmad y colaboradores, 2023](https://pubmed.ncbi.nlm.nih.gov/37659172/) y [Nunes y colaboradores, 2022](https://pubmed.ncbi.nlm.nih.gov/35187864/), además de documentos institucionales de [NIDDK](https://www.niddk.nih.gov/health-information/endocrine-diseases/hypothyroidism), [ATA](https://www.thyroid.org/hashimotos-thyroiditis/) y [NHS](https://www.nhs.uk/symptoms/chest-pain/). No se atribuye una revisión sanitaria independiente ni una validación clínica a los ejemplos del artículo.

## Imagen y enlaces

La portada reutiliza `/community/editorial/progresion-fuerza.webp`, ya desplegada y registrada como imagen ilustrativa generada con IA en la revisión de comunidad. El artículo indica su procedencia y no la presenta como una clienta real ni una sesión con Fernando. No se genera ni sobrescribe ningún recurso visual.

Se añade un enlace desde `/hipotiroidismo` y se sustituye la tarjeta relacionada de gluten por la de masa muscular en `/hashimoto/entrenamiento`. El artículo de gluten sigue disponible desde el centro temático. Se actualizan las fechas de modificación de los dos centros en el sitemap; la nueva URL de blog se incorpora desde los artículos publicados de Supabase.

## Publicación

`scripts/publish-muscle-hypothyroidism.mjs` prepara una vista previa y copia del borrador. `--apply` exige coincidencia del material editorial y del registro previo, comprueba que la portada está disponible y actualiza solo el artículo previsto, con control de concurrencia. La verificación de fechas compara instantes, admitiendo la normalización de UTC de Postgres (`Z` y `+00:00`). Repetir la aplicación del mismo contenido no vuelve a escribir.

La copia, la vista previa y el recibo quedan en `output/muscle-hypothyroidism-20261105`, excluido de Git. No se modifican cuentas, pagos, autenticación, conversaciones ni otros artículos. El espacio de trabajo principal y sus borradores ajenos se conservan.

## Verificación local

Sintaxis Node, ESLint focalizado y comprobación de diff correctos. Compilación de producción con webpack correcta, incluido TypeScript, con 169 páginas generadas. Vista previa con título de 53 caracteres, descripción de 145, 22 encabezados y cinco preguntas frecuentes.

Cuatro comprobaciones de navegador a 320, 375, 768 y 1440 px: H1 único, metadatos, imagen, autoría, fechas, 22 encabezados previstos y texto de procedencia presentes; sin desbordamiento ni errores de página. Axe no detecta incidencias automáticas WCAG A/AA en el contenido principal. Se verifican enlaces internos, dos entradas desde guías navegables con teclado, presencia en el listado y entrada única del sitemap. La comunidad sigue exigiendo acceso. Capturas de móvil y escritorio revisadas.
