# Oferta y revisión editorial — 10 de noviembre de 2026

## Cambios

- Prioridad comercial confirmada por Fernando: contenido de valor → comunidad gratuita → Método BASE de pago. El entrenamiento individual general no es la venta prioritaria ahora.
- Inicio: acceso directo a la comunidad como acción principal y explicación de lo que hay dentro como acción secundaria. Guía y test son recursos complementarios.
- Método BASE se presenta más abajo como continuación opcional de pago. Se retiraron de inicio la comparación entre formatos, el bloque de 750 €, la promoción de la app y los testimonios del entrenamiento individual. La página de servicio individual sigue disponible; precios y condiciones conservados.
- Blog: la llamada final prioriza la comunidad y la invitación intermedia de artículos generales deja de vender entrenamiento individual. Se identifica el público actual de la comunidad: mujeres con hipotiroidismo o Hashimoto. En artículos de tiroides, BASE queda como paso opcional de pago.
- Inicio y servicio individual: tres ejemplos didácticos de decisiones sobre carga, tiempo disponible y variantes. No representan clientes ni resultados reales.
- Política editorial: ejemplos identificados, aplicación práctica, coherencia de portadas y resúmenes, fecha de revisión separada de publicación original.

## Alcance de contenido

Se hizo una búsqueda automatizada de expresiones a revisar en 63 artículos publicados. No equivale a una revisión clínica completa del blog.

Se actualizaron cinco artículos existentes en Supabase, sin cambiar slug, publicación original, categoría ni autor:

1. Creatina: reescritura, evidencia específica en mujeres, límites, compra y seguridad con contexto; portada sin «tómala ya».
2. Guía de suplementos: reescritura por necesidad y contexto, sin listado universal de productos que tomar.
3. Proteína en polvo: controles independientes, ingredientes y distinción entre alergia a leche e intolerancia a lactosa.
4. Vitamina D: cribado, indicaciones y pauta; corregida la contradicción entre cuerpo y resumen.
5. Omega 3: dosis y prescripción, etiqueta, límites de calidad y resumen coherente.

Las fuentes principales incluyen NIH ODS, Endocrine Society 2024, AESAN, AIS, NIDDK, revisión de Tam et al. 2025 y ensayo de Chilibeck et al. 2023. Los artículos enlazan cada fuente en su contexto. No se presenta esta revisión editorial como evaluación sanitaria individual.

## Verificación

- Copia de los 63 artículos y copia completa de las cinco filas antes de modificar.
- Comparación previa de contenido y control de concurrencia con `updated_at` en cada actualización.
- Lectura posterior: coincidencia de campos editados y preservación de datos de publicación.
- Integridad del HTML, tablas, encabezados, imágenes e internos del blog.
- Cuatro pruebas unitarias del separador de contenido: correctas.
- TypeScript y ESLint de los archivos afectados: correctos.
- Navegador local: ocho rutas, anclas, precios, contenido e imágenes; móvil y escritorio sin desbordamiento y sin errores JavaScript.

Preparación reproducible: `scripts/prepare-editorial-quality-20261110.mjs`. La preparación no modifica la base de datos. Los respaldos y comprobantes están en el directorio local `output/editorial-quality-2026-11-10` del espacio principal; no contienen credenciales.

## Segunda revisión: coherencia de encabezados y recomendaciones

Se revisaron los títulos y entradillas de los 63 artículos publicados. Se corrigieron seis publicaciones; esto no equivale a validar clínicamente todo el catálogo:

- Vitamina D: título y entradilla sin analítica universal; resumen, pruebas, toxicidad y explicación de síntesis coherentes; ejemplo didáctico.
- Hierro: texto reescrito, diferenciando déficit, anemia, prevención y seguimiento. Eliminadas las reglas «NUNCA sin analítica» y «reanalítica para parar», las promesas de tolerancia y la atribución diagnóstica al entrenamiento. Ejemplo didáctico y portada «Déficit y valoración».
- Suplementos y tiroides: corregida la regla «si no sabes tus niveles, primero se mide» y la entradilla; pruebas según indicación clínica.
- Omega 3: no comer pescado no convierte automáticamente un complemento en necesario.
- Proteína: título y entradilla sobrios; precios identificados como históricos y retirada la declaración comercial no verificada.
- Gluten: entradilla compatible con los distintos escenarios explicados en el cuerpo.

Se conservaron URL, publicación original, autor y categoría. Dos llamadas del cuerpo de artículos se orientaron a la comunidad gratuita, manteniendo su público y los límites sanitarios. Las decisiones clínicas no se ofrecen como parte de la comunidad.

Fuentes contrastadas: Endocrine Society 2024, NIH ODS sobre vitamina D y hierro, OMS sobre ferritina y prevención del déficit, NHS sobre anemia y sulfato ferroso. Cada artículo enlaza las fuentes en contexto. Preparación: `scripts/prepare-editorial-coherence-20261110.mjs`; no escribe en Supabase.
