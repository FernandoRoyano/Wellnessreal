# Modelo de negocio de WellnessReal y Método BASE

> Estado: estrategia acordada para validación  
> Última revisión: 26 de septiembre de 2026  
> Propietario: Fernando Royano

## Propósito del documento

Este documento recoge las decisiones comerciales acordadas para ordenar WellnessReal, Método BASE y Método BASE Tiroides. Es la referencia para futuras revisiones de producto, precios, páginas, campañas y métricas.

Las decisiones marcadas como **acordadas** no deben modificarse sin revisar el modelo completo. Las cifras de lanzamiento son **hipótesis por validar**, no compromisos permanentes.

## 1. Posicionamiento

### Decisiones acordadas

- **WellnessReal** es la marca principal.
- **Método BASE** es el sistema general de trabajo de Fernando.
- **Método BASE Tiroides** es la especialización y oferta comercial prioritaria.
- El entrenamiento personalizado general continúa como servicio secundario.
- La modalidad automática de bajo precio de 19 €/mes fue una prueba y se retira de la oferta.
- WellnessReal no diagnostica ni trata enfermedades. Organiza entrenamiento y hábitos dentro del ámbito profesional del entrenador.

### Posicionamiento propuesto

> WellnessReal ayuda a personas con hipotiroidismo o Hashimoto a recuperar una rutina sostenible de fuerza, alimentación y descanso mediante un programa adaptado a su energía y vida real.

### Promesa principal

> Vuelve a entrenar con una estructura que puedas sostener, incluso cuando tu energía no sea igual cada semana.

### Qué se vende realmente

No se vende una cura, información sobre tiroides ni una colección de rutinas. Se vende un proceso acompañado que convierte recomendaciones generales en un plan individual que se ejecuta, observa y ajusta durante 12 semanas.

## 2. Arquitectura de productos

```text
WellnessReal
├── Comunidad Tiroides — gratuita
│   └── Método BASE Tiroides — programa principal de 12 semanas
└── Entrenamiento personalizado — servicio secundario y plazas limitadas
```

La continuidad tras las 12 semanas se diseñará después de observar las necesidades de las primeras cohortes. No se lanza todavía una membresía de pago.

### Comunidad Tiroides

Su función es educar, activar, generar confianza y preparar a la persona para decidir si necesita acompañamiento.

Incluye:

- Contenido educativo.
- Test inicial.
- Rutinas y recursos generales.
- Newsletter.
- Comunidad y preguntas generales.

No incluye planes personales, ajustes individuales, seguimiento clínico ni revisión semanal de Fernando.

### Método BASE Tiroides

Es el producto protagonista de WellnessReal.

Resultado esperado:

> Construir durante 12 semanas una rutina de entrenamiento y hábitos adaptada a la energía, el contexto y las necesidades reales de cada participante.

Formato:

- Programa semipersonalizado.
- Grupo inicial de 8–10 personas; máximo operativo previsto de 12.
- Valoración inicial individual.
- Plan de entrenamiento adaptado.
- Check-in semanal estructurado.
- Ajustes periódicos.
- Un directo grupal semanal.
- Dos revisiones individuales de 20–30 minutos.
- Comunidad privada y materiales educativos.
- Evaluación final y recomendación de continuidad.

No incluye atención ilimitada, cambios diarios, dieta clínica, interpretación de analíticas ni consultas sanitarias.

### Entrenamiento personalizado

Servicio para:

- Personas de fitness general que llegan mediante contenido, buscadores, asistentes de IA o recomendación.
- Casos de tiroides que necesitan más individualización que el programa grupal.

Incluye valoración, programación completamente individual, seguimiento directo y mayor acceso a Fernando. Debe mantenerse con pocas plazas y claramente por encima del programa grupal en precio.

## 3. Entrega de Método BASE Tiroides

### Recorrido de 12 semanas

- **Semana 1:** valoración, punto de partida y primera semana ejecutable.
- **Semanas 2–4:** regularidad, técnica, adaptación por energía y hábitos básicos.
- **Semanas 5–8:** progresión de cargas o repeticiones, RIR/RPE y recuperación.
- **Semanas 9–12:** consolidación, autonomía y preparación del siguiente bloque.

### Seguimiento

El check-in semanal debe recoger, como mínimo:

- Sesiones completadas.
- Energía.
- Sueño.
- Problemas o molestias.
- Capacidad realista para la semana siguiente.
- Necesidad de mantener, reducir o progresar.

El sistema debe facilitar que Fernando atienda primero alertas, incidencias y participantes que necesitan intervención.

### Límites operativos

- Respuesta en la comunidad de lunes a viernes.
- Plazo habitual de 24–48 horas laborables.
- Sin WhatsApp personal ilimitado.
- Sin videollamada individual semanal.
- Sin modificaciones diarias.
- Dedicación objetivo: 5–7 horas semanales para 10 participantes.

## 4. Precios

### Primera edición

- Método BASE Tiroides: **349 € en un pago**.
- Pago fraccionado: **2 pagos de 185 €**; total de 370 €.
- Máximo recomendado: 10 participantes.
- El precio se presenta como condición especial de primera edición, no como descuento permanente.

### Después de validar

- Precio estándar propuesto: **590 € en un pago**.
- Pago fraccionado propuesto: **3 pagos de 210 €**; total de 630 €.
- Rango futuro posible tras demostrar resultados y demanda: 690–790 €.

### Entrenamiento personalizado

- Precio inicial: **750 € por 12 semanas**.
- Pago fraccionado: **3 pagos de 270 €**; total de 810 €.
- Servicio intensivo bajo propuesta: desde 1.200 € por 12 semanas.

### Productos retirados o pendientes

- Retirar comercialmente los planes de 19 y 49 €/mes.
- Sustituir el precio anterior de 249 € para Método BASE Tiroides.
- No presentar el programa de 12 semanas como suscripción.
- No lanzar aún el producto de continuidad.

## 5. Recorrido comercial

Recorrido principal:

```text
Contenido o recomendación
→ Página de Tiroides
→ Test gratuito
→ Resultado útil
→ Clase gratuita
→ Solicitud de plaza
→ Valoración breve
→ Método BASE Tiroides
```

Una persona con intención alta, por ejemplo procedente de una recomendación o de ChatGPT, puede acceder directamente a la página del programa y solicitar plaza.

### Principios del recorrido

- Cada página o contenido tiene una llamada a la acción principal.
- El test orienta y segmenta; no diagnostica.
- La clase gratuita debe enseñar el sistema y conducir a la solicitud.
- La solicitud filtra expectativas, disponibilidad, contexto y capacidad de inversión.
- La valoración dura 20–25 minutos y no es una sesión gratuita de entrenamiento.
- Pago, condiciones, cuestionario y acceso deben gestionarse mediante un proceso ordenado, no manualmente por WhatsApp.

## 6. Función de cada página

### Home de WellnessReal

Posiciona la marca y deriva hacia dos caminos:

- CTA principal: **Conocer Método BASE Tiroides**.
- CTA secundario: **Busco entrenamiento personalizado**.

Mensaje base:

> Entrenamiento basado en ciencia que se adapta a tu vida real.

### Página de Tiroides

Capta y educa a quienes todavía están entendiendo el problema.

- CTA principal: **Hacer el test gratuito**.
- CTA secundario: **Ver cómo funciona Método BASE Tiroides**.

### Página de Método BASE Tiroides

Explica el programa y obtiene solicitudes cualificadas.

Debe mostrar duración, formato, plazas, precio, pagos, inclusiones, exclusiones, perfil adecuado, proceso de solicitud y límites profesionales.

### Página de entrenamiento personalizado

Recoge demanda general y casos que necesitan máxima individualización.

- CTA: **Solicitar valoración individual**.
- Precio visible: desde 750 € por 12 semanas.

### Navegación propuesta

```text
Inicio
Método BASE Tiroides
Comunidad
Entrenamiento personal
Blog
Sobre mí
```

Botón destacado: **Hacer el test**.

## 7. Contenido y captación

Distribución editorial orientativa:

- **60 % tiroides:** captación principal.
- **30 % ciencia del entrenamiento:** autoridad.
- **10 % casos, proceso y confianza:** conversión.

### Principios editoriales

- Responder preguntas concretas desde el inicio.
- Identificar autor, credenciales y fecha de revisión.
- Enlazar publicaciones y DOI originales siempre que sea posible.
- Separar evidencia de interpretación práctica.
- Incluir ejemplos, preguntas frecuentes y límites médicos.
- Utilizar un único CTA por contenido.
- Conectar los artículos en grupos temáticos, no publicarlos de forma aislada.

### Ritmo sostenible

Cuatro artículos mensuales:

- Dos sobre tiroides.
- Uno sobre ciencia del entrenamiento.
- Uno práctico, de proceso o caso.

Cada artículo puede transformarse en un email, dos publicaciones cortas, un carrusel y un vídeo breve.

### Descubrimiento mediante Google y asistentes de IA

El contenido debe ser claro, atribuible y fácil de citar. El hecho de que ya haya llegado un cliente mediante una búsqueda en ChatGPT valida este canal como señal prometedora, pero todavía no demuestra una fuente de adquisición predecible.

## 8. Validación de la primera edición

### Objetivo comercial

- Conseguir 8–10 participantes a 349 €.
- Facturación objetivo: 2.792–3.490 €.
- Captación inicial orgánica: audiencia, newsletter, contenido, comunidad y recomendaciones.

### Hipótesis de funnel

| Etapa | Objetivo inicial |
|---|---:|
| Solicitudes cualificadas | 15–25 |
| Valoraciones realizadas | 12–18 |
| Participantes | 8–10 |
| Asistencia a valoración | >75 % |
| Conversión valoración → venta | 40–60 % |

### Métricas de producto

- Activación en la primera semana: al menos 90 %.
- Finalización del programa: al menos 85 %.
- Media mínima de sesiones completadas: 70 % de las previstas.
- Check-ins: al menos 8 de 12.
- Satisfacción media objetivo: 8/10 o superior.
- Casos de estudio útiles: al menos 3.

### Métricas operativas

- No superar 7 horas semanales de entrega habitual.
- No superar 85 horas totales en la primera edición.
- Alcanzar al menos 40 €/hora brutos en la edición inicial.
- Medir preparación, check-ins, consultas, ajustes y mensajes por participante.

### Criterio de validación

El programa se considera validado cuando vende al menos ocho plazas, conserva al 85 % de participantes, obtiene una satisfacción mínima de 8/10, genera tres casos sólidos, mejora la regularidad o confianza de la mayoría y puede entregarse dentro de la carga prevista.

## 9. Orden de ejecución

Leyenda: `[x]` completado · `[~]` en curso o completado parcialmente · `[ ]` pendiente.

### Registro de avances

- **26/09/2026 — Oferta, primera tanda:** retirados los accesos públicos a los planes automáticos de 19/49 €, actualizado Método BASE Tiroides a 349 €, grupo de 8–10 personas, directo de 60 minutos, check-in semanal y dos revisiones individuales. El checkout de pago único cobra 349 €. El fraccionamiento se comunica, pero su cobro automático sigue pendiente.
- **26/09/2026 — Retirada del experimento automático:** confirmado que no existen usuarios antiguos. Eliminados checkout, portal, cancelación, muro de pago, componentes y lógica activa de las suscripciones de 19/49 €. El cuestionario completo queda reservado al onboarding posterior al pago de Método BASE Tiroides; cualquier acceso general se redirige a valoración. Se conservan únicamente las migraciones históricas de base de datos.
- **26/09/2026 — Oferta general simplificada:** sustituidos los paquetes públicos de 450/750/990 € por un único entrenamiento personalizado de 12 semanas a 750 €, con alternativa de tres pagos de 270 €. Actualizados home, tarifas, valoración, propuestas administrativas, metadatos, datos estructurados y guiones. Retiradas las promesas de garantía de resultados, atención inmediata y permanencia propias del modelo anterior.
- **26/09/2026 — Separación educación/venta:** `/tiroides` queda posicionada como centro gratuito de información y test, con metadatos propios y sin presión de compra. `/metodo-tiroides` queda como página comercial del programa de 12 semanas, con promesa concreta, inclusiones, exclusiones, preguntas frecuentes, precio y solicitud de plaza.
- **26/09/2026 — Página de entrenamiento personalizado:** mantenida la ruta `/servicios/entrenamiento-online` para conservar enlaces y posicionamiento, pero simplificada a una única oferta individual de 12 semanas. Añadidos precio, pagos, límites del contacto, valoración previa y lenguaje sin promesas de resultados o plazos universales.
- **26/09/2026 — Home reordenada:** WellnessReal se presenta como marca general de entrenamiento y hábitos basados en ciencia. Método BASE Tiroides ocupa la ruta principal y el entrenamiento personalizado queda como alternativa secundaria. Reescritos propuesta, beneficios, proceso, papel de la tecnología y CTA final para evitar promesas absolutas y mantener claras ambas opciones.
- **27/09/2026 — Navegación y CTA unificados:** la cabecera prioriza Tiroides, entrenamiento, blog y autor, con Método BASE Tiroides como acción principal. El pie replica esta arquitectura y explica la marca sin resultados no acreditados. Los CTA recurrentes del blog, servicios, contacto, caso real y página posterior a la guía conducen ahora a la página específica del programa tiroideo o del entrenamiento individual, en lugar de enviar de forma genérica a tarifas o valoración.
- **27/09/2026 — Test y resultados revisados:** el resultado se presenta como orientación, no como evaluación clínica. Las personas sin diagnóstico tiroideo salen del itinerario específico hacia recursos generales o entrenamiento individual; quienes necesitan seguimiento médico no reciben una recomendación comercial directa. El programa se presenta antes de la solicitud, la captura del email explica qué se recibirá y la analítica y ficha del lead dejan de guardar la señal de revisión médica y las respuestas sanitarias detalladas.
- **27/09/2026 — Clase gratuita ajustada:** la promesa se centra en aprender a decidir entre mantener, reducir o pausar una sesión. Si todavía no existe una URL de vídeo, la persona recibe una guía escrita aplicable en lugar de una pantalla de “pendiente de grabación”. El registro explica el uso del email y enlaza la privacidad. El cierre conduce primero a conocer alcance, límites y precio de Método BASE Tiroides, y el guion deja de atribuir experiencias no demostradas o enviar directamente a una solicitud.
- **27/09/2026 — Solicitudes simplificadas:** la solicitud de Método BASE Tiroides elimina teléfono y disponibilidad para el directo; conserva solo contacto por email, objetivo, días disponibles y limitaciones opcionales. La valoración individual pasa de seis pasos a un único formulario con los datos necesarios para valorar objetivo, experiencia y disponibilidad. Se eliminan edad, dieta, condiciones médicas, presupuesto, fuente y la mezcla con el embudo tiroideo. La API valida los datos, escapa el contenido de los emails y deja de suscribir automáticamente al newsletter.
- **27/09/2026 — Pago e incorporación asegurados:** el enlace de Stripe solo puede generarse para solicitudes aceptadas, cobra 349 € mediante tarjeta y vuelve con un identificador de sesión. La página de confirmación verifica en Stripe que el pago pertenece a Método BASE Tiroides antes de mostrarlo como confirmado, oculta parcialmente el email y explica evaluación, revisión y acceso a comunidad. El webhook solo concede acceso con estado pagado y ahora devuelve error ante fallos para que Stripe reintente. Los pagos de propuestas generales dejan de contaminar la analítica tiroidea. El fraccionamiento automático sigue pendiente.
- **27/09/2026 — Atribución y eventos auditados:** el panel cuenta personas identificables en vez de sumar acciones repetidas. Se separan clic en CTA, visita a oferta, solicitud, venta e incorporación; se añaden recorridos de clase y oferta al panel. Clase y solicitud enlazan la navegación anónima con el lead, conservan la primera atribución UTM y permiten atribuir una venta aunque el comprador no completara antes el test. Los eventos enviados al sistema analítico quedan limitados a datos operativos y excluyen respuestas, perfil, intención, medicación y datos de salud. La migración `20260927_thyroid_funnel_business_events.sql` está aplicada en la base de datos y los nuevos eventos quedan habilitados en producción.
- **27/09/2026 — Primera edición calendarizada:** solicitudes del 5 al 25 de octubre, valoraciones del 12 al 28 de octubre e inicio el lunes 2 de noviembre de 2026. La edición termina el 24 de enero de 2027, admite un máximo real de 10 participantes y mantiene 8 como mínimo para validar el formato. Las fechas y plazas quedan visibles en la página comercial y en el guion de la clase.
- **27/09/2026 — Campaña de apertura preparada:** creada la secuencia orgánica con cinco emails y seis publicaciones entre el 1 y el 25 de octubre. Cada pieza utiliza un único CTA hacia la solicitud, explica alcance y límites sin afirmaciones clínicas ni testimonios inventados y contempla excluir a quienes ya hayan solicitado. Los textos y la revisión previa al envío quedan guardados en `docs/marketing/lanzamiento-metodo-base-tiroides-2026.md`.
- **27/09/2026 — Lista prioritaria y apertura automática:** antes del 5 de octubre la página comercial muestra el registro prioritario y envía la clase gratuita; durante la ventana muestra la solicitud, y después del 25 de octubre bloquea nuevas solicitudes. El servidor aplica las mismas fechas para impedir envíos fuera de plazo. Los contactos se guardan como leads, conservan su atribución y entran en el grupo específico de MailerLite cuando está configurado.
- **27/09/2026 — Fraccionamiento cerrado sin suscripción:** el panel permite crear un pago único de 349 € o el primer pago de 185 €. Treinta días después, una tarea diaria genera y envía automáticamente el segundo y último enlace de 185 €. Ambos son pagos únicos, quedan registrados de forma idempotente y nunca crean una renovación indefinida.
- **27/09/2026 — Página Sobre mí completada:** creada `/sobre-mi` para resolver el enlace roto de cabecera, pie y home. Presenta a Fernando Royano con fotografía y credenciales ya verificadas en el proyecto, explica principios, forma de trabajo y límites profesionales, conecta con ambas ofertas y añade metadatos, datos estructurados y entrada en el sitemap.
- **27/09/2026 — Centro de campaña visible:** añadido `/admin/lanzamiento` y un bloque prioritario en `/admin/enlaces` para consultar en una sola pantalla los cinco emails, las seis publicaciones sociales, el calendario, el modelo de negocio, el checklist y la secuencia histórica. Incluye accesos directos a campañas, suscriptores, grupos, artículos, embudo, guiones y solicitudes.
- **27/09/2026 — Enlaces de campaña desglosados:** el bloque de campaña en `/admin/enlaces` muestra ahora los diez recursos como accesos independientes y numerados. Los emails, redes, calendario, modelo y secuencia histórica enlazan directamente a su sección dentro del Centro de campaña.
- **28/09/2026 — Creatividades sociales terminadas:** generadas seis imágenes verticales 4:5 para las publicaciones del 1, 5, 12, 15, 20 y 25 de octubre. Mantienen una familia visual común, texto principal legible y conceptos de adaptación, apertura, autorregulación, límites, continuidad y cierre. Se guardan en `public/social/metodo-base-tiroides-2026/` y se muestran con descarga directa en el Centro de campaña.
- **28/09/2026 — Clase de venta reforzada:** revisado el guion de Método BASE Tiroides frente a la VSL de Osteofit. El nuevo guion concentra la propuesta en un mecanismo de tres niveles —sesión completa, ajustada y mínima—, aumenta la tensión del problema sin recurrir a promesas clínicas, añade una demostración práctica, refuerza la autoridad profesional y concreta el CTA. Se deja un bloque interno, no grabable, para incorporar un caso real cuando esté documentado y autorizado.
- **28/09/2026 — Prueba social incorporada:** sustituidos los marcadores provisionales de la clase por tres casos reales anonimizados —Elena, Marta y Antonio— que muestran tres necesidades distintas: recuperar capacidad y seguridad, sostener un proceso de pérdida de peso y reorganizar la carga para volver a progresar. Se indican expresamente el cambio de nombres, el carácter individual de los resultados y la separación entre entrenamiento y tratamiento sanitario.

### Calendario de la primera edición

| Hito | Fecha |
|---|---|
| Apertura de solicitudes | 5 de octubre de 2026 |
| Inicio de valoraciones | 12 de octubre de 2026 |
| Cierre público de solicitudes | 25 de octubre de 2026 |
| Últimas valoraciones y admisiones | 28 de octubre de 2026 |
| Pago, onboarding y acceso | 26–31 de octubre de 2026 |
| Inicio del programa | 2 de noviembre de 2026 |
| Final de las 12 semanas | 24 de enero de 2027 |

Objetivo: 8 participantes. Capacidad máxima operativa: 10. Si no se alcanza el mínimo, la primera edición puede realizarse igualmente como cohorte piloto, pero no se considerará validado el formato grupal.

### Mapa de medición del funnel tiroideo

| Recorrido | Eventos de negocio |
|---|---|
| Contenido y test | visita, clic para empezar, inicio, finalización y lead |
| Clase gratuita | visita de registro, registro, visualización y clic hacia la oferta |
| Programa | visita a oferta, solicitud, venta confirmada e incorporación completada |
| Continuidad | cobro de continuidad, solo cuando exista una oferta validada |

Los porcentajes del panel son indicadores del periodo seleccionado, no cohortes cerradas. Para tomar decisiones de inversión se necesitará suficiente volumen y una vista por cohorte.

### Fase 1 — Oferta

- [x] Retirar completamente los planes automáticos de 19/49 € del producto y del código activo.
- [x] Actualizar Método BASE Tiroides a 349 € y ofrecer dos pagos únicos de 185 €, con envío automático del segundo enlace a los 30 días.
- [x] Alinear inclusiones, tamaño del grupo y límites básicos de la entrega.
- [x] Mantener el entrenamiento individual como alternativa secundaria desde 750 €.

### Fase 2 — Mensajes y páginas

- [x] Ordenar la home.
- [x] Crear la página Sobre mí y conectarla con la navegación, el SEO y las ofertas.
- [x] Centralizar campaña, documentos y accesos operativos en el apartado administrativo Enlaces.
- [x] Diferenciar página educativa de Tiroides y página comercial de Método BASE Tiroides.
- [x] Simplificar la página de entrenamiento personalizado y alinearla con la oferta de 750 € por 12 semanas.
- [x] Unificar CTA y navegación en las superficies públicas principales.
- [x] Eliminar los precios antiguos y las promesas contradictorias del código activo.

### Fase 3 — Funnel

- [x] Revisar test y resultados.
- [x] Ajustar la clase gratuita de tiroides.
- [x] Reforzar la clase frente al referente Osteofit: gancho, mecanismo, demostración, autoridad, objeciones y CTA.
- [x] Incorporar tres casos reales anonimizados como prueba social, pendientes únicamente de autorización para publicación y uso de imágenes.
- [x] Simplificar solicitud y valoración.
- [x] Ordenar pago e incorporación: pago único, dos plazos controlados, confirmación, onboarding y acceso.
- [x] Verificar atribución y eventos del funnel: eventos operativos sin datos de salud, identidades únicas, atribución de solicitud/venta y medición hasta incorporación.

### Fase 4 — Lanzamiento

- [x] Definir fecha de inicio y plazas: 2 de noviembre de 2026, objetivo de 8 y máximo de 10 participantes.
- [x] Preparar emails y contenidos de apertura: cinco emails y seis publicaciones fechadas, listas para programar.
- [x] Crear las seis imágenes 4:5 de las publicaciones sociales y añadirlas al Centro de campaña.
- [x] Abrir lista prioritaria: formulario, email con la clase, atribución, MailerLite y cambio automático por fechas.
- [ ] Realizar valoraciones.
- [ ] Cerrar plazas e incorporar al grupo.

## 10. Decisiones pendientes de datos reales

No decidir todavía:

- Producto y precio de continuidad.
- Escalar mediante publicidad pagada.
- Aumentar el grupo por encima de 12 participantes.
- Crear nuevas verticales del Método BASE.
- Incorporar otros entrenadores.
- Subir el programa al rango de 690–790 €.

Estas decisiones se revisarán después de la primera edición usando datos de ventas, adherencia, resultados, satisfacción y carga operativa.
