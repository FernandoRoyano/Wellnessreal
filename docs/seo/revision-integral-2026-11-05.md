# Revisión de contenido y recorridos de WellnessReal

Fecha: 5 de noviembre de 2026. Público prioritario: mujeres con hipotiroidismo o Hashimoto, inicialmente en España.

**Actualización de publicación, 5 de noviembre:** Fernando ha autorizado subir los ajustes y los dos artículos. Levotiroxina y ejercicio e Hipotiroidismo y colesterol alto ya se han publicado en Supabase con su fecha real de salida, manteniendo el contenido revisado y las portadas. El informe siguiente documenta el estado de la revisión previa; el despliegue y su comprobación pública se registran en `publicacion-tiroides-2026-11-05.md`.

## Resultado y estado de publicación

Los dos artículos de esta tanda están revisados y guardados en Supabase como **borradores**. Sus URLs públicas siguen devolviendo 404 y no aparecen en el sitemap. Las correcciones menores de interfaz y metadatos están preparadas y verificadas localmente; **esta revisión no incluye un nuevo despliegue del frontend**.

En las páginas y recorridos públicos comprobados no se han encontrado bloqueos de navegación ni enlaces internos rotos. Este resultado corresponde al alcance y las pruebas detalladas aquí; no equivale a una certificación de accesibilidad, una auditoría completa de seguridad o una revisión clínica independiente.

## Cambios realizados

### Levotiroxina y ejercicio

- Título: **Levotiroxina y ejercicio: horarios, café y suplementos**. Descripción de 134 caracteres; lectura estimada de 7 minutos.
- Contrastadas las instrucciones con el [prospecto español de Eutirox de la AEMPS](https://cima.aemps.es/cima/dochtml/p/64012/Prospecto_64012.html). Se identifica el producto de referencia y se respetan las pautas individuales.
- Separadas las interferencias de absorción del efecto de la biotina en las pruebas de laboratorio.
- Eliminada la afirmación tajante de que el ejercicio no bloquea la medicación. La espera antes del desayuno no se convierte en una prescripción sobre cuándo entrenar.
- Incluidas alternativas para desayunar antes de entrenar y criterios de consulta. El entrenador no modifica dosis ni pautas farmacológicas.
- Portada conservada, descripción neutral y uso ilustrativo identificado.
- Relectura del registro guardado: coincide con la versión editorial revisada y continúa sin publicar.

### Hipotiroidismo y colesterol alto

- Título conservado: **Hipotiroidismo y colesterol alto: qué relación tienen**. Descripción de 136 caracteres; lectura estimada de 7 minutos.
- Revisada la evidencia de la [revisión sistemática sobre tratamiento tiroideo y lípidos](https://pubmed.ncbi.nlm.nih.gov/32954428/) y la [guía de la Endocrine Society](https://www.endocrine.org/clinical-practice-guidelines/lipid-management-guideline). Se distingue la respuesta media de una predicción individual y se explica que el orden del tratamiento corresponde al equipo médico.
- La recomendación de actividad de la [AHA](https://professional.heart.org/en/science-news/physical-activity-as-a-critical-component-of-first-line-treatment-for-elevated-bp-or-cholesterol/top-things-to-know) se presenta como referencia general para adultos. La tabla semanal es un ejemplo de inicio y no se afirma que alcance por sí sola los 150 minutos aeróbicos.
- Actualizada la referencia alimentaria con la [orientación de la AHA de 2026](https://professional.heart.org/en/science-news/2026-dietary-guidance-to-improve-cardiovascular-health/top-things-to-know). Sin dietas clínicas, suplementos pautados ni promesas sobre cifras de LDL.
- Precisadas las señales que requieren atención urgente.
- Retirado el enlace al borrador de levotiroxina para evitar una dependencia de publicación. Enlaces a las guías públicas, suplementos, comunidad y programa comprobados.
- Corregida la atribución de la imagen a Fernando. La descripción recoge lo visible y se aclara que los gráficos de la portada no son resultados clínicos.

Las escrituras se limitaron a los campos editoriales previstos. Se conservaron identidad, autor, categoría, URL de portada, fecha y estado de publicación. Hay copias previas y recibos locales excluidos de Git.

### Interfaz, títulos y proceso editorial

- Eliminada la repetición de WellnessReal en los títulos de entrada a la comunidad, clase gratuita, contenido de la clase y caso real. La plantilla global ya añade la marca.
- Retirado el foco automático del email al entrar en la comunidad y desactivada su corrección ortográfica. Se conserva el autocompletado de email y la validación nativa.
- Corregida la documentación de publicación: la API administrativa no invalida explícitamente las rutas. El artículo usa revalidación de 60 segundos y el sitemap de una hora; el refresco no debe darse por inmediato.

## Comprobaciones realizadas

| Área | Alcance | Resultado |
|---|---|---|
| Blog público | 57 artículos y 57 portadas | Sin incidencias de disponibilidad ni portadas ausentes |
| Enlaces internos | 95 destinos únicos, incluidos enlaces del blog, páginas principales y sitemap | Sin errores HTTP ni anclas ausentes en los destinos comprobados |
| Sitemap | 83 URLs únicas | Incluye los 57 artículos publicados; excluye los dos borradores |
| SEO de URLs del sitemap | H1, descripción, canonical y ausencia de noindex | Sin incidencias detectadas |
| Páginas principales | 13 páginas, a 375 y 1440 px | Un H1 por página, sin desbordamiento horizontal ni errores JavaScript observados |
| Accesibilidad automática | Las 26 vistas anteriores; reglas WCAG 2 A/AA y 2.1 A/AA de axe | Sin infracciones detectadas por esas reglas |
| Borradores | Dos vistas previas, cada una a 320, 375 y 1440 px | Portadas, encabezados, enlaces y tabla comprobados; sin desbordamientos ni infracciones automáticas en el cuerpo |
| Recorrido comercial | 10 pruebas de navegador, en Chrome móvil y escritorio | Test, solicitud con precio, clase escrita, valoración y rechazo de confirmación de pago no verificada: correctos |
| Lógica de programa y permisos | 33 pruebas unitarias | Correctas: acceso, currículo, calendario, pagos, concurrencia y avisos |
| Cookies | Portada, test y programa a 320×568, 375×812 y 667×375 | Rechazo operativo; acceso secundario de portada accesible sin superposición del aviso |
| Meta | Portada general y cinco rutas de salud/acceso, con solicitudes al proveedor interceptadas | Sin carga al rechazar; carga permitida en portada con consentimiento y ausente en las cinco rutas excluidas comprobadas |
| Comunidad privada | Cuatro rutas sin sesión | Redirección a la entrada por email |
| Correcciones locales | Cuatro páginas, a 375 y 1440 px | Títulos sin marca duplicada, indexabilidad conservada, sin desbordamiento; entrada de email comprobada con configuración de interfaz simulada |
| Código | ESLint de los cinco archivos de interfaz, sintaxis del script, diff y compilación de producción | Correctos; TypeScript incluido y 169 páginas generadas |

Las 13 páginas principales fueron portada, centro de hipotiroidismo, guía de ejercicio, guía de Hashimoto, Método BASE, test, clase gratuita, entrada a la comunidad, blog, artículos de masa muscular, cansancio y debilidad, y guía para perder peso.

Las vistas previas de borradores se montaron únicamente en el navegador sobre la plantilla del blog: no se crearon rutas públicas de previsualización ni se alteraron permisos.

## Límites de la verificación

Los envíos de formularios de las pruebas se simularon. No se verifica con ello la entrega de un email real, el canje de un enlace real o una compra completa en Stripe. La entrada pública y las redirecciones privadas sí se comprobaron en producción. La configuración local de interfaz de comunidad se simuló porque su clave de acceso protegida no se puede recuperar con la exportación de variables; no se modificaron las variables de producción.

Las pruebas automáticas de permisos y currículo usan datos simulados. No se inició sesión en una cuenta real de cliente ni se alteraron sus datos.

No se consultaron nuevos datos de Search Console ni métricas reales de Core Web Vitals. La exportación aportada anteriormente termina el 2 de noviembre, por lo que no demuestra efectos de los cambios posteriores. Las páginas prioritarias de ejercicio, Hashimoto y programa ya están indexadas según la confirmación de Fernando.

## Siguientes pasos, por prioridad

1. Subir las pequeñas correcciones de títulos e interacción preparadas y repetir su comprobación en el dominio público. Los artículos pueden seguir en borrador durante ese despliegue.
2. Publicar los dos artículos cuando se decida su salida, con fecha real de publicación. Revisar listado, artículo, portada y sitemap tras el refresco; después inspeccionar esas URLs nuevas en Search Console.
3. Hacer una prueba real de recepción y canje del enlace de comunidad con un correo propio. El recorrido público sigue disponible sin grabar vídeos: la clase escrita ha pasado las pruebas.
4. Obtener el informe de rendimiento Web de Search Console filtrado por España, sin filtro inicial de consulta, y desglosar consultas y páginas. Es el dato que falta para priorizar la siguiente mejora de contenidos. [Google documenta estas dimensiones y filtros](https://support.google.com/webmasters/answer/7576553?hl=es).
5. Revisar tendencias a las dos y cuatro semanas desde cada publicación, con periodos comparables y sin atribuir automáticamente todos los cambios a una edición. Es un calendario de seguimiento propuesto, no un plazo prometido para posicionar: [Google explica que los efectos pueden tardar desde horas hasta meses](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=es).
6. Mantener los vídeos pendientes de grabación y revisar Core Web Vitals con datos reales cuando estén disponibles. No hace falta detener los contenidos escritos ni convertir la comunidad en pública para continuar.

Evidencias locales: `output/review-20261105/`, `output/levothyroxine-review-20261105/` y `output/cholesterol-review-20261105/`. Contienen resultados de las comprobaciones, vistas previas, capturas, copias y recibos; están excluidas de Git.
