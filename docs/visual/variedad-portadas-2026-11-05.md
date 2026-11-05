# Variedad en las portadas del blog

Fecha: 5 de noviembre de 2026.

La revisión visual de las 59 portadas mostró que la repetición de la imagen de Fernando se concentraba en las entradas recientes: 9 de las 12 primeras. Se sustituyen ocho portadas y se conserva una presencia del entrenador en el artículo que compara acompañamiento online y apps. El resultado combina personas, objetos, alimentación, actividad al aire libre y esquemas.

## Recursos finales y procedencia

| Artículo | Archivo guardado en el proyecto | Procedencia |
|---|---|---|
| Levotiroxina y ejercicio | [levotiroxina-rutina-manana-v2.webp](../../public/blog/editorial/levotiroxina-rutina-manana-v2.webp) | Nueva imagen ilustrativa, herramienta integrada `image_gen` |
| Hipotiroidismo y colesterol | [colesterol-alimentacion-cotidiana-v2.webp](../../public/blog/editorial/colesterol-alimentacion-cotidiana-v2.webp) | Copia optimizada de `public/community/editorial/alimentacion-cotidiana.webp`, generada previamente con IA |
| Péptidos y evidencia | [peptidos-preguntas-evidencia-v2.webp](../../public/blog/editorial/peptidos-preguntas-evidencia-v2.webp) | Esquema conceptual nativo, con [SVG editable](../../public/blog/editorial/peptidos-preguntas-evidencia.svg) |
| Terapia hormonal y antienvejecimiento | [terapia-hormonal-actividad-cotidiana-v2.webp](../../public/blog/editorial/terapia-hormonal-actividad-cotidiana-v2.webp) | Copia optimizada de `public/community/editorial/recuperacion-paseo.webp`, generada previamente con IA |
| Edad biológica y wearables | [wearables-actividad-cotidiana-v2.webp](../../public/blog/editorial/wearables-actividad-cotidiana-v2.webp) | Nueva imagen ilustrativa, herramienta integrada `image_gen` |
| Fuerza y longevidad | [fuerza-longevidad-mujer-v2.webp](../../public/blog/editorial/fuerza-longevidad-mujer-v2.webp) | Nueva imagen ilustrativa, herramienta integrada `image_gen` |
| Biohacking y longevidad | [biohacking-base-habitos-v2.webp](../../public/blog/editorial/biohacking-base-habitos-v2.webp) | Esquema conceptual nativo, con [SVG editable](../../public/blog/editorial/biohacking-base-habitos.svg) |
| Precio del entrenador online | [entrenador-online-planificacion-v2.webp](../../public/blog/editorial/entrenador-online-planificacion-v2.webp) | Copia optimizada de `public/community/editorial/seguimiento-cuaderno.webp`, generada previamente con IA |

Los archivos finales pesan aproximadamente entre 31 y 173 kB. Los recursos nuevos se guardan además en Supabase Storage, con nombres versionados y sin sobrescribir imágenes anteriores. La [selección editorial](../../content/blog/cover-variety-2026-11.json) registra destinos, descripciones y pies.

Las fotografías son ilustrativas. No se presentan como clientes, consultas, sesiones de Fernando ni resultados reales. Los esquemas representan preguntas y hábitos que ya se explican en los artículos; no añaden dosis, diagnósticos, resultados clínicos ni puntuaciones ficticias.

## Aplicación y comprobaciones

`scripts/refresh-cover-variety.mjs` limita la intervención a los ocho artículos seleccionados. Primero copia sus registros y prepara un plan; `--upload` añade los recursos versionados, y `--apply` comprueba conflictos y actualiza imagen, texto alternativo y pie de portada. Se conservan identificadores, títulos, descripciones, autores, categorías, estado publicado y fechas originales de publicación. El contenido restante no se reescribe.

Las fuentes Markdown se sincronizan con los destinos de las portadas. Las copias y recibos quedan en `output/cover-variety-20261105/`, excluida de Git, junto a las capturas de antes, después y recortes móviles. Los originales nuevos PNG se conservan allí y en el directorio de imágenes generadas de Codex.

La imagen para compartir el centro de biohacking y longevidad se alinea también con el nuevo esquema de hábitos.

Se revisa la composición conjunta, el recorte en tarjetas y artículos, la carga de las imágenes y los metadatos en móvil y escritorio. La comprobación general `npm run check:content` verifica las 59 URLs y sus portadas publicadas.

## Criterio para las siguientes publicaciones

Elegir la imagen por el tema y el tipo de explicación. Alternar fotografía de una situación, detalles de objetos o material, escenas de actividad y diagramas cuando aclaren una idea. Usar la presencia de Fernando cuando el contenido trate de su acompañamiento, criterio o forma de trabajar, evitando encadenar retratos del mismo encuadre en artículos temáticos.

No sustituir un patrón repetido por otro: variar también planos, entornos, luminosidad y protagonistas. Mantener la relación con el artículo, una composición que resista el recorte y una descripción literal.

## Prompts finales de las tres imágenes nuevas

Modo utilizado: herramienta integrada `image_gen`, generación nueva, sin imágenes de referencia y sin fondo transparente. No se usó la vía CLI/API. Los resultados se convirtieron a WebP sin cambios semánticos.

### Rutina de mañana

Use case: photorealistic-natural. Create one new landscape 16:9 editorial photograph for a Spanish training article about organizing a morning when taking prescribed thyroid medication. Close still life on a pale warm stone bedside console by a window: one clear glass of plain water, a discreet small unbranded closed medicine carton and a plain sealed blister pack lying flat, with clean walking shoes softly out of focus farther back beside the doorway. No pills out of the blister, no food or coffee, no clock or dose information. No people and no visible faces. The photograph contextualizes a morning routine, it is not an instruction to take medication or train fasting. Natural soft daylight, linen and lightly textured surfaces, quiet warm off-white, soft grey and one small muted plum detail. Asymmetrical, uncluttered composition, main objects in the central safe area so mobile crops remain intelligible. Authentic editorial realism, ordinary Spanish home, no luxury product advertising, no glossy CGI. No text, labels, numbers, logos, arrows, collage or watermark. Output a single finished wide photograph.

### Reloj de actividad

Use case: photorealistic-natural. Create one new landscape 16:9 editorial photograph for an article on biological age, wearables and biomarkers. Close oblique view of an anonymous adult woman's forearm wearing a simple unbranded fitness watch with an abstract non-readable dark screen, as she pauses on a public park path after a walk. The focus is on the watch and natural skin texture, not on a person's portrait. A soft-focus pair of ordinary trainers and a green tree-lined path provide context farther back. No face visible, no dramatic muscular physique, no medical equipment or health claims. Cool fresh morning daylight, restrained greens, charcoal watch band, pale blue sleeve, natural documentary feeling. Keep the watch and wrist centrally crop-safe with room around them, no face or clinic. Do not show any biological age score, graphs, heart-rate numbers, logos, legible text or watermark. Single finished wide editorial photograph, not a collage.

### Fuerza y longevidad

Use case: photorealistic-natural. Create one new landscape 16:9 candid editorial photograph for a Spanish article about strength and healthy ageing. A realistic woman around sixty, with short silver-grey hair and an ordinary active body, is walking a farmer carry with one small dumbbell in each hand in a bright modest neighborhood training studio. Full body visible, natural upright posture, shoulders relaxed, arms by sides, two symmetrical light dumbbells, grounded feet with a clear natural walking stride. Camera at chest height, three-quarter side view and a wide environmental frame rather than a posed portrait. Both hands anatomically correct with natural grip and five fingers. Soft daylight from tall side windows, clean grey floor, a few simple resistance bands and benches in the background; muted teal top, navy trousers, ordinary trainers. No trainer present, no male model, no curly-haired man, no celebrity likeness. This is an illustrative scene, not a testimonial or an age-reversal result. Keep all subject and equipment inside central crop-safe area. No text, logos, clinical symbols, heavy barbell, intense strain or watermark. Single finished wide photograph, authentic textures, no advertising pose or glossy gym aesthetic.

Los prompts y la procedencia de las tres escenas reutilizadas se conservan en [la revisión visual de la comunidad](../comunidad-revision-2026-11.md). Los dos esquemas son SVG editables con texto, formas e iconografía nativa, no fotografías generadas.
