# Biblioteca de ejercicios — 12 de noviembre de 2026

## Entrega

Biblioteca gratuita para miembros aprobados en /comunidad/ejercicios y fichas en /comunidad/ejercicios/[slug]. Acceso desde el menú, las rutas y las lecturas del espacio Entrena y organízate. No se cambia contenido del CMS ni se requieren migraciones.

Siete fichas iniciales: sentadilla libre/goblet, sentadilla con barra, zancadas, flexiones, peso muerto, dominadas y remos. Cada una incluye ilustración ampliable, músculos implicados, ejecución en pasos, aspectos que revisar, variantes con material y fuente técnica enlazada. La ficha tiene título de navegador propio. No se añaden dosis, cargas individuales, marcas de entrenamiento realizado ni progresiones obligatorias.

La búsqueda reutiliza la normalización existente: reconoce acentos, músculos, variantes, material y términos como «fondos». El filtro de material indica que basta con que alguna variante utilice ese material; la ficha precisa sus requisitos. El filtro está plegado y vuelve a plegarse tras elegir. Hay estado sin resultados y limpieza conjunta de búsqueda y material.

## Recursos visuales

Se reutilizan las siete ilustraciones generadas previamente para la guía fitness, ubicadas en output/fitness-guide-2026-11-09/fundamentals/images del workspace principal. No se reproducen ilustraciones ajenas ni imágenes de las fuentes técnicas. Conversión de formato y tamaño a WebP, sin edición del contenido, con ancho máximo 1440 px; los originales permanecen intactos.

| Original | Recurso publicado | Contenido comprobado visualmente |
| --- | --- | --- |
| sentadilla.png | sentadilla-v1.webp | Inicio y descenso de sentadilla libre |
| sentadilla-barra.png | sentadilla-barra-v1.webp | Sentadilla trasera, barra sobre espalda alta |
| zancadas.png | zancadas-v1.webp | Sin carga arriba, mancuernas abajo |
| flexiones.png | flexiones-v1.webp | Pies arriba, rodillas abajo |
| peso-muerto.png | peso-muerto-v1.webp | Convencional desde el suelo y de pie |
| dominadas.png | dominadas-v1.webp | Vista posterior y agarre prono |
| remos.png | remos-v1.webp | Mancuerna con apoyo y polea sentada |

Destino: public/community/exercises. Peso total: 576372 bytes. Las imágenes usan object-contain para conservar todas las posturas, especialmente la composición más ancha del remo. Los pies de imagen distinguen lo mostrado de las variantes descritas. Se declara su generación y que el resaltado muscular es orientativo, sin porcentajes de activación. La revisión visual no equivale a revisión anatómica externa.

## Fuentes técnicas

Texto adaptado del material educativo propio de la guía y contrastado con fichas primarias de ACE: Bodyweight Squat (135), Back Squat (11), Forward Lunge (94), Push-up (41), Deadlift (6), Romanian Deadlift (317), Chin-ups (190) y Single-arm Row (126). Consultadas el 12 de noviembre de 2026. Se enlaza la fuente correspondiente y se aclara cuando representa un agarre o variante concretos. No se afirma aval de ACE ni revisión externa.

Ejemplo de variante distinta: la ilustración de peso muerto muestra el convencional; el rumano comienza de pie y no requiere tocar el suelo. La imagen de dominadas es prona; la referencia Chin-ups describe el agarre supino. El jalón se identifica como alternativa, no como dominada. «Fondos en suelo» se interpreta como flexiones y se diferencia de los fondos en banco/paralelas.

## Validación

- Tres pruebas unitarias: integridad de fichas y archivos WebP; búsqueda por acentos, músculos y sinónimos; correspondencia de materiales e identificadores conocidos.
- Seis casos de navegador entre móvil y escritorio: búsqueda y entrada a ficha; imágenes; variantes de pies y rodillas; filtro plegable; ausencia de resultados y limpieza; las siete fichas y sus recursos; identificador desconocido con 404.
- Capturas revisadas de biblioteca y ficha a 320 y 1440 px sin desbordamiento horizontal. TypeScript y ESLint focalizado pasan.
- Pruebas privadas con sesiones y servicios locales ficticios; sin registros ni marcas ficticias en producción.

Evidencias en output/community-exercises-2026-11-12 del workspace principal. No se añaden vídeos simulados ni anuncios de grabaciones futuras; los vídeos propios quedan como ampliación cuando exista material real.

## Publicación

Implementación final 6b40507 publicada en dpl_4kof6n1nCZPyuRZvWPg3xe3ba6Uh tras comprobar READY y la versión previa activa. Las primeras tres ilustraciones visibles se cargan eager y las restantes lazy. Se acorta la introducción móvil: la primera ficha aparece a unos 562 px a 320 px de anchura.

Comprobación real: índice y fichas probadas requieren acceso y conservan su destino al entrar; los siete WebP responden 200 con el tipo y tamaño esperados. No se crean cuentas ni marcas ficticias en producción. Comprobante: public-verification.json en el directorio de evidencias. Las interacciones privadas se han validado con cuentas locales de prueba.
