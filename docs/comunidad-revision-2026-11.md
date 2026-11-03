# Revisión de comunidad · noviembre de 2026

## Cambios editoriales

Se revisaron las 41 lecciones publicadas. La revisión preparada modifica 38, conserva sus identificadores y añade la lección del cuarto bloque. No modifica cuentas, mensajes del foro, pagos ni registros de progreso.

- Cuatro bloques de tres semanas, con títulos, enlaces y desbloqueos coherentes con la oferta actual. Los enlaces guardados de los tres bloques anteriores redirigen a los nuevos, conservando la identidad de cada lección.
- Doce lecciones semanales alineadas con el calendario común de `metodo-tiroides.ts`. Las revisiones individuales se preparan en semanas 4 y 9; los demás check-ins no se presentan como nuevas citas.
- Inicio y recursos explican el acceso, la evaluación, los vídeos pendientes, el plan aprobado y cómo participar sin compartir datos clínicos en el foro.
- Se retiran generalizaciones sobre pérdida de músculo, culpa del método, equivalencias automáticas de TSH y promesas de encontrarse bien por tener valores en rango. La lección de primera acción propone una comida repetible, sin imponer una ración universal.
- Los recursos premium incluyen los enlaces a sus PDF, y las lecciones escritas se identifican como lectura.

Fuentes contrastadas para las explicaciones generales: [American Thyroid Association: pruebas](https://www.thyroid.org/thyroid-function-tests/), [ATA: peso](https://www.thyroid.org/thyroid-and-weight/), [NIDDK: hipotiroidismo](https://www.niddk.nih.gov/health-information/endocrine-diseases/hypothyroidism) y [NIDDK: Hashimoto](https://www.niddk.nih.gov/health-information/endocrine-diseases/hashimotos-disease). Se incluyen enlaces en las lecciones revisadas. No se ofrecen diagnósticos, rangos para autointerpretar resultados ni instrucciones de medicación.

## Fotos y esquemas

Se mantiene la foto existente de Fernando en su presentación. Las fotografías nuevas son ilustrativas, generadas con la herramienta integrada `image_gen`, y se identifican como tales en el lector; no son testimonios ni clientes reales. Los esquemas se dibujan en SVG editable, con etiquetas y alternativas textuales, y se pueden abrir para ampliar.

| Archivo en `public/community/` | Función |
|---|---|
| `editorial/progresion-fuerza.webp` | Fuerza, progresión y aplicación del plan |
| `editorial/recuperacion-paseo.webp` | Movimiento cotidiano, recuperación y continuidad |
| `editorial/seguimiento-cuaderno.webp` | Check-in, revisión y registro |
| `editorial/alimentacion-cotidiana.webp` | Ejemplo de comida cotidiana |
| `diagrams/tiroides-senales.svg` | Circuito general de señales tiroideas |
| `diagrams/analitica-contexto.svg` | TSH, T4 libre y contexto clínico |
| `diagrams/hashimoto-contexto.svg` | Diferenciar seguimiento sanitario y apoyo a los hábitos |

Cada fotografía tiene una variante `-400.webp` para miniaturas; las imágenes principales tienen 1600 px de ancho. La selección de tamaños se hace con `srcset`, porque la optimización de imágenes de Vercel está desactivada por cuota. Las miniaturas aparecen también en móvil y los esquemas se muestran completos, con texto de apoyo, sin duplicarlos como portada y contenido.

Prompts finales utilizados con `image_gen` (una llamada por imagen, sin imágenes de referencia):

1. **progresion-fuerza**: Use case: photorealistic-natural. Asset type: editorial cover photograph for a Spanish educational strength-training community. Generate a new landscape 16:9 photograph, premium but genuinely candid and natural, consistent with warm daylight, wood, linen and restrained muted plum in an ordinary lived-in home. An anonymous woman around 40 with an ordinary healthy non-model build, wearing a plain muted plum training top and charcoal leggings, stands naturally beside a small training bench, setting down a pair of realistic moderately sized dumbbells after a comfortable set. Subject and dumbbells fully within the central crop-safe area, plausible hands and body, believable home exercise space, gentle window light, documentary photography, natural skin and material texture. This is illustrative content, not a client testimonial or a real identifiable trainer. No text, logos, watermark, overlays, before/after imagery, dramatic exertion or idealised fitness-ad body. Show the concrete relationship of a person and manageable training equipment, not a posed stock smile.
2. **recuperacion-paseo**: Use case: photorealistic-natural. Asset type: educational community lesson cover about everyday movement and recovery. Create a new landscape 16:9 candid editorial photograph. An anonymous woman around 50 with an ordinary body in comfortable olive jacket and plain neutral trousers walking at an easy pace on a tree-lined park path, early soft natural daylight, subtle warm colors, honest ordinary life rather than sports advertising. Full person and feet visible near the center with crop-safe surroundings, medium-wide framing, calm unposed expression, believable walking posture, natural skin and textures. Quiet green foliage, warm gravel, no crowds. Illustrative scene, not a claim about anyone's medical history. No writing, logos, watermark, infographic, idealised athletic physique or dramatic wellness glow.
3. **seguimiento-cuaderno**: Use case: photorealistic-natural. Asset type: editorial lesson cover for checking in and preparing an individual training review. Create a new landscape 16:9 close editorial photo of an anonymous adult's hands making a brief training note in an open notebook at a warm wooden desk. A normal pen held correctly, a few subtle unreadable short handwritten rows and simple tick boxes; a glass of water and one resistance band in the background. Soft window daylight, warm natural wood, neutral linen and a small muted plum fabric detail, believable lived-in home, careful depth of field, real material textures. Center the notebook and hands with generous safe crop; no face required. It must look like an achievable two-minute habit, not a medical consultation or productivity advertisement. No readable words, numbers, brands, computer interfaces, fake reports or watermark.
4. **alimentacion-cotidiana**: Use case: photorealistic-natural. Asset type: editorial lesson cover for practical everyday meals, not a clinical diet. Create a new landscape 16:9 slightly overhead editorial photograph of an ordinary affordable home lunch being served: ceramic plate with lentils, a boiled egg cut in halves and colorful roasted vegetables, bread and a small bowl of salad nearby. Anonymous adult hands setting the plate on a warm wooden table, casual light linen, soft daylight, authentic food texture, quiet natural colors with a subtle muted plum napkin, appetizing but not overly styled or glossy. Keep the plate central and fully visible in a crop-safe composition. Illustrative meal example with no quantified portion prescription. No text, nutritional labels, weighing scales, supplement bottles, logos, watermark or diet/body transformation messaging.

## Desbloqueo y publicación

Las lecciones gratuitas conservan el desbloqueo por registro. Las semanas y bloques premium usan la primera aprobación del plan, igual que el calendario; antes de aprobar se muestra el motivo de espera. El equipo conserva su previsualización. Los controles de acceso de acciones sobre una lección comprueban también el desbloqueo.

`scripts/refresh-community-v3.cjs` genera un plan y una previsualización a partir de una copia de las lecciones. El modo `--apply` comprueba conflictos antes de escribir, guarda una copia previa y actualiza únicamente los campos previstos. Es idempotente y conserva los identificadores de las lecciones existentes. No borra registros. Los nuevos archivos deben estar desplegados antes de aplicar el plan.

La revisión visual utiliza componentes reales y contenido de Supabase en una previsualización local de solo lectura con un miembro ilustrativo; no usa una sesión de cliente real ni publica una vía alternativa de autenticación. Las pruebas cubren los bloqueos y los enlaces de entrada, y los controles reales del panel conservan su autorización.

## Verificación

- 73 pruebas unitarias: coherencia del currículo, activos, bloqueos por aprobación y registro, permisos del equipo, enlaces antiguos y regresiones del programa y de captación.
- 18 pruebas de navegador en Chrome móvil y escritorio, incluidos enlaces compartidos con retorno tras iniciar sesión.
- Previsualización a 390, 768 y 1440 px sin imágenes rotas ni desbordamientos. La confirmación comprueba también la navegación con títulos largos y que el esquema no se duplica.
- TypeScript, ESLint y compilación de producción correctos.
- Escaneo mecánico de Impeccable: doce avisos del CSS global ya presentes en la versión anterior y ninguno en las líneas añadidas. Se conserva la identidad vigente; no se presenta esta revisión acotada como una certificación de toda la web.
