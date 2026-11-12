# Press militar y press con mancuernas — 12 de noviembre de 2026

Ampliación de la biblioteca de siete a nueve fichas. Se añaden press militar con barra y press de hombros con mancuernas (también localizado al buscar «press militar»). Incluyen músculos, ejecución, aspectos que revisar y variantes. El push press se distingue del press estricto por el impulso de piernas; la ilustración con mancuernas es sentada y su texto diferencia la opción de pie.

Fuentes primarias consultadas:

- [ACE · Standing Shoulder Press](https://www.acefitness.org/resources/everyone/exercise-library/71/standing-shoulder-press/).
- [ACE · Seated Overhead Press](https://www.acefitness.org/resources/everyone/exercise-library/45/seated-overhead-press/).

## Imágenes y procedencia

Generadas con la herramienta integrada image_gen, sin CLI ni imágenes de terceros. Revisadas visualmente: colocación por delante de hombros, empuje vertical, apoyos, número y continuidad de cargas y extremidades, ausencia de impulso en el press estricto y correspondencia de las regiones resaltadas. No equivale a revisión anatómica externa. Las imágenes se declaran ilustrativas en las fichas.

Archivos finales del proyecto:

- [Press con barra](../public/community/exercises/press-militar-barra-v1.webp), 1440 × 960, 72452 bytes.
- [Press con mancuernas](../public/community/exercises/press-hombros-mancuernas-v1.webp), 1440 × 960, 100442 bytes.

Los originales PNG se conservan en output/community-overhead-press-2026-11-12 del workspace principal, como press-militar-barra-source.png y press-hombros-mancuernas-source.png. Solo se convierten tamaño y formato para web; no se modifica el contenido durante la conversión. Los originales del generador también se conservan.

## Prompt final: barra

Create an original educational exercise illustration for WellnessReal's anatomical fitness library. Landscape 3:2 composition, warm near-white untextured background, realistic fine graphite linework and restrained watercolor shading, like a polished contemporary exercise textbook. Two full-body poses side by side of the SAME adult woman, grey sleeveless gym shirt, grey shorts, grey trainers, realistic non-exaggerated proportions. THREE-QUARTER FRONT VIEW. Show STANDING STRICT BARBELL OVERHEAD PRESS (military press). LEFT: stable hip-width standing stance, knees extended but comfortable, barbell in FRONT of the upper chest/clavicles, pronated closed grip just outside shoulders, forearms approximately vertical and elbows slightly in front of bar, wrists stacked sensibly. RIGHT: same woman standing upright, same stance, straight rigid barbell held directly overhead with both arms extended comfortably, bar aligned over mid-foot, natural upward shoulder-blade movement; head positioned naturally between arms, no lumbar hyperextension. Exactly one straight barbell per pose with symmetric modest small plates, all equipment and feet entirely visible with clear margins. Subtle muted red anatomical overlays on front/lateral deltoids and visible triceps ONLY to indicate principal working regions. Make both hands grip the bar correctly; consistent number of fingers, no extra limbs, no disconnected weights. The lift begins in front of shoulders, NEVER behind neck; no squat, no leg drive, no bench, no push press. No text, no labels, no arrows, no logos, no watermark. This is an explanatory illustration, not a real client or medical scan.

## Prompt final: mancuernas

Original educational anatomical exercise illustration for WellnessReal. Landscape 3:2 image, warm near-white plain background, delicate realistic graphite linework and restrained watercolor shading, contemporary exercise textbook aesthetic. Two full-body poses side by side of the SAME adult woman, grey sleeveless gym top, grey shorts, grey trainers, natural proportions. Show SEATED DUMBBELL OVERHEAD SHOULDER PRESS. Each pose on its own identical simple stable exercise bench with a nearly upright backrest (about 80-85 degrees), feet flat on the ground, butt and upper back supported, natural spine without exaggerated low back arch. Three-quarter FRONT view with all equipment and body parts visible. LEFT starting position: one modest hex dumbbell in EACH hand at shoulder level, palms facing mostly forward or slightly inward, elbows slightly forward of the torso, forearms approximately vertical, wrists stacked over elbows. RIGHT finishing position: same two dumbbells overhead, each held in its own hand, arms comfortably extended, weights separated above respective shoulders and not colliding, upright supported torso, no excessive shoulder shrug forced down. Subtle muted red muscle overlays on anterior/lateral deltoids and visible triceps, grey clothing elsewhere. EXACTLY TWO DUMBBELLS per pose, four total across image. No barbells, no extra limbs, no floating or disconnected weights, no hands attached incorrectly. This is a vertical press, not an incline chest press or lateral raise. All heads, feet, benches and top weights inside generous margins, no cropping. No text, arrows, labels, logos or watermarks. Illustrative generated teaching image, not a real person or patient.

## Validación

Se amplían los controles del catálogo y los casos de navegador para nueve ejercicios, búsqueda de ambos press y filtro por barra/mancuernas. Sin cambios de esquema, de permisos o del PDF fitness. Los nuevos ejercicios se añaden a la biblioteca de la comunidad.

Verificado: 4 pruebas unitarias y 8 ejecuciones de navegador (móvil y escritorio) correctas; TypeScript y ESLint sin errores. Capturas revisadas a 320 y 1440 px, sin desbordamiento horizontal.

## Publicación

Publicado en wellnessreal.es el 12 de noviembre de 2026. Implementación: 20921dc. Deployment activo: dpl_96VhFaRse5Cc2yD4cVCrmgWhkgAF (READY), promovido tras comprobar la versión anterior. En producción: ambas imágenes HTTP 200 WebP y ambas fichas conservan el acceso protegido (307 al inicio de sesión con destino correcto). La navegación autenticada se verificó con datos locales de prueba, sin crear actividad ni usuarios en producción.
