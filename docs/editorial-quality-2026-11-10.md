# Oferta y revisión editorial — 10 de noviembre de 2026

## Cambios

- Inicio: dos entradas, aprender gratis o recibir acompañamiento. Guía y test quedan como recursos dentro del primer recorrido.
- Comparación existente de Método BASE e individual reutilizada en inicio. Precios, duración y condiciones conservados.
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
