# Guía específica de entrenamiento con Hashimoto

Fecha: 4 de noviembre de 2026.

URL: `/hashimoto/entrenamiento`.

## Intención y contenido

Guía pública para mujeres con Hashimoto interesadas en empezar o retomar el entrenamiento de fuerza. Distingue el contexto clínico de las decisiones de planificación, explica cómo observar recuperación y ofrece tres situaciones orientativas para mantener, reducir o detener la progresión.

Incluye autoría enlazada al perfil de Fernando, fecha, índice, seis apartados, seis preguntas frecuentes y enlaces al programa y a la comunidad con registro por email. La guía general conserva los ejemplos semanales y las cuatro imágenes de ejercicios; esta nueva pieza profundiza en el contexto de Hashimoto y los ajustes. Se reutiliza la ilustración compacta de silla y banco, con su procedencia generada con IA visible.

## Fuentes comprobadas

- [NIDDK, Hashimoto](https://www.niddk.nih.gov/health-information/endocrine-diseases/hashimotos-disease).
- [American Thyroid Association, tiroiditis de Hashimoto](https://www.thyroid.org/hashimotos-thyroiditis/).
- [Sundus y colaboradores, 2025: revisión de ejercicio en hipotiroidismo](https://pubmed.ncbi.nlm.nih.gov/40446861/).
- [NHS, dolor en el pecho](https://www.nhs.uk/symptoms/chest-pain/).

La evidencia revisada en hipotiroidismo no se convierte en un protocolo universal para Hashimoto ni en una validación de los ejemplos de esta guía. No se atribuyen resultados clínicos al programa ni se presenta una revisión sanitaria independiente. La publicación y la revisión de fuentes se realizan desde el ámbito educativo del entrenamiento ya declarado por Fernando.

## Integración

- Enlaces desde `/hipotiroidismo`, `/hipotiroidismo/ejercicio` y `/tiroides`.
- Entrada propia en el sitemap, canónica y metadatos de la nueva URL.
- Diseño y componentes existentes de centros temáticos, con lectura adaptable y una imagen de un máximo de 320 px.
- Comunidad, datos de clientes, pagos y contenido privado conservan su funcionamiento.

## Verificación

- ESLint de los archivos modificados, TypeScript y compilación de producción con webpack correctos; nueva ruta estática generada.
- Revisión en 320, 375, 768 y 1440 px: sin desbordamiento horizontal, imagen compacta cargada y sin errores de página. Revisión visual de móvil y escritorio.
- Índice y enlaces internos operativos, seis respuestas visibles coincidentes con sus datos estructurados y cero incidencias automáticas de accesibilidad en el contenido principal con axe (WCAG A/AA).
- Canónica, indexabilidad, Open Graph, tres enlaces de entrada y entrada única del sitemap comprobados. Acceso anónimo al contenido privado sigue requiriendo registro.
- La lista explícita de páginas permitidas de Meta ya excluye esta nueva URL; no fue necesario cambiar el seguimiento. Comprobación en navegador con consentimiento aceptado: cero solicitudes al SDK de Meta y ningún pixel cargado. No se enviaron formularios ni se modificaron datos de clientes.
