# Colaboración editorial con Método Osteofit

Fernando ha comunicado el acuerdo con Javier para recomendarse contenidos mutuamente. Se revisaron el blog de Osteofit, su artículo sobre caminar, su guía de ejercicios y la presentación de su método. Se eligió [el artículo sobre caminar](https://metodoosteofit.com/caminar-y-osteoporosis/) por encajar con una pregunta frecuente antes de buscar orientación sobre salud ósea. La guía general de ejercicios queda como recurso de referencia de su propia web.

## Pieza preparada

- Título: «Caminar y salud ósea: una lectura de Osteofit».
- Autor de la recomendación: Fernando Royano. Atribución expresa del recurso original a Javier Giménez.
- Estado: **publicado** en Supabase el 6 de noviembre a las 10:37, hora de Madrid, por indicación de Fernando. ID `88d4321e-d650-4d40-8aea-3b31c46c0eb7`. [Artículo publicado](https://wellnessreal.es/blog/caminar-salud-osea-osteofit).
- Revisión: [abrir en administración](https://wellnessreal.es/admin/blog/88d4321e-d650-4d40-8aea-3b31c46c0eb7).
- Slug protegido: `caminar-salud-osea-osteofit`. No cambiarlo sin actualizar `src/lib/blog-partners.ts` y las pruebas.
- Texto original de recomendación; no se reproduce el artículo completo ni sus imágenes. Dos enlaces al recurso original y uno a la explicación del método de Javier, sin redirección automática.
- El contexto sobre ejercicio se apoya también en el [consenso de 2022](https://pubmed.ncbi.nlm.nih.gov/35577538/) y en la [Royal Osteoporosis Society](https://theros.org.uk/information-and-support/exercise/exercise-to-help-your-balance/). No se atribuye a Javier una revisión clínica de nuestra pieza.

## Indexación y lectura

La plantilla emite `noindex, follow` tanto para robots generales como para Googlebot, comprobado en producción tras publicar. El sitemap excluye ese slug aunque el post esté publicado. No se bloquea su rastreo mediante `robots.txt`, para que el buscador pueda leer la directiva, conforme a [la documentación de Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

No se insertan las promociones automáticas de nuestros programas ni artículos relacionados en esta colaboración. Se mantienen la navegación y el pie comunes de la web. Las pruebas comparan también un artículo normal para conservar su comportamiento.

El objetivo verificable es recomendar un recurso y derivar lectores. `noindex` evita competir en los resultados con esta página; no garantiza un incremento de posicionamiento para ninguna de las dos webs. No se ha contactado con Javier desde las herramientas ni modificado su sitio. Para su recomendación recíproca puede valorarse nuestra [guía de ejercicio e hipotiroidismo](https://wellnessreal.es/hipotiroidismo/ejercicio), si encaja con su audiencia.

## Portada

Ilustración generada con IA siguiendo como referencias propias la portada `masa-muscular-tiroides-plantilla-v1.webp` y la escena `recuperacion-paseo.webp`: panel oscuro, tipografía blanca y amarilla, mujer caminando y atribución a Osteofit. La pieza identifica el carácter ilustrativo de la escena; no presenta a la persona como clienta.

Original conservado en `output/osteofit-collaboration-20261106/cover-source.png` (ignorado por Git). Versión web: `public/blog/editorial/caminar-salud-osea-osteofit.webp`, 1672 × 941 px, 182.586 bytes. No se han reutilizado fotografías de Osteofit.

## Verificación

Pruebas unitarias de metadatos, enlaces, promociones y exclusión del sitemap. Revisión local en móvil y escritorio. Tras publicar se confirmó en producción: HTTP 200, portada cargada, ambas directivas `noindex, follow`, dos enlaces al original, uno al método y exclusión del sitemap. La primera petición recibió el 404 anterior en caché; la regeneración de la ruta lo sustituyó por la página publicada. Evidencias locales en `output/osteofit-collaboration-20261106/`, incluido `publication-receipt.json`.
