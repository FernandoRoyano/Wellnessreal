# Participación después de una lección y claridad de BASE

## Cambios

- Cinco lecciones gratuitas conocidas ofrecen una pregunta opcional relacionada con la lectura. Bienvenida y primera lección usan una pregunta sobre una idea que se quiere probar, sin exigir haber entrenado.
- Se reutiliza el formulario del foro y su borrador editable. Abrirlo no publica, no completa la lección ni envía notificaciones. No se solicita información clínica.
- No se añade invitación a lecciones bloqueadas ni a contenido premium. Otros temas clínicos no reciben una pregunta genérica automática.
- La invitación a BASE explica encaje, check-in, dos revisiones individuales, directos cuando estén programados y límites de atención. Precio y pagos proceden de la configuración existente.
- El recorrido comparativo enlaza a la página principal del programa y su solicitud. Se aclara que enviar el formulario no implica pago ni admisión; las semanas empiezan con el primer plan aprobado.
- La página antigua de asesoría deja de prometer un directo semanal fijo o resultados por cumplir tres meses. Se mantienen su formulario y las condiciones económicas configuradas, sin cambiar pagos, permisos ni automatizaciones.

## Análisis de uso

Realizada una revisión de los datos propios disponibles, separando cuentas identificables como internas/de prueba, eventos sujetos a consentimiento y estado guardado por cuenta. No se calculan conversiones con cohortes diferentes ni tasas de retorno con periodos inmaduros o denominador cero.

El informe de uso y los agregados se conservan localmente en `output/community-use-review-2026-11-13` del workspace principal. No se publican en el repositorio los recuentos privados de negocio ni datos personales.

Comprobación controlada en producción: navegador con consentimiento de una cuenta temporal, visita y clic PDF guardados correctamente; eventos y cuenta de prueba eliminados después. No se reinicia `COMMUNITY_ACTIVITY_SINCE`, no se reduce la protección de datos y no se crean eventos nuevos de seguimiento.

## Verificación

Cuatro pruebas unitarias de calendario/preguntas y seis casos de navegador en Chrome móvil y escritorio correctos: borrador opcional editable sin POST, encaje/precio/condiciones de BASE, acceso a la solicitud sin enviarla, coherencia de la página antigua y conservación del acceso premium. TypeScript y ESLint de archivos afectados correctos. Las pruebas de texto y navegación no sustituyen una prueba de comprensión con personas reales; el informe incluye un protocolo breve para esa validación.

## Publicación

Implementación 343d0fb publicada el 13/11/2026. Deployment activo dpl_Bvc3wThejyg4F5sVcvTkzb1JAhci (READY), promovido tras comprobar la versión anterior. La bienvenida, asesoría y recorrido conservan redirección a login sin sesión (307); la oferta pública responde 200. Revisadas capturas de participación y BASE a 390 y 1440 px, con selector de detalles plegado por defecto y sin desbordamiento. No se han enviado solicitudes, mensajes al foro ni pagos de prueba. Los recuentos privados permanecen en el informe local.
