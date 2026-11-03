# Correos del recorrido del Método BASE

## Cuándo se envían

- **Solicitud:** confirmación al guardar la solicitud. Fernando conserva su aviso y el primer contacto personal.
- **Pago inicial confirmado por Stripe:** instrucciones para acceder con el correo de compra y completar la evaluación. El segundo pago no repite la bienvenida.
- **Plan aprobado:** aviso al aprobar una versión vigente asociada a una solicitud pagada. Las 12 semanas empiezan con la primera aprobación; las siguientes versiones no reinician el calendario.
- **Check-in:** un aviso al final de las semanas 1–11 si no se ha completado el check-in de la semana natural. Las semanas 4 y 9 se sustituyen por la preparación de la revisión individual. No se inventan citas: el cliente debe coordinarla con Fernando.
- **Cierre:** al cumplir 84 días desde la primera aprobación. Incluye el último check-in, balance y coordinación del cierre con Fernando. No promete un informe personalizado que todavía no se haya redactado, ni renueva ni cobra nada.

Los vídeos no son un requisito para este recorrido.

## Calendario y avisos a Fernando

El área privada y los correos comparten el cálculo de semana desde la primera aprobación. El registro del recorrido conserva la fecha entre versiones; los clientes anteriores que todavía no tengan registro usan su primera aprobación guardada. Un borrador inicial muestra «Pendiente de aprobación», y una actualización pendiente mantiene disponible el último plan aprobado. Pausa, finalización y cierre tienen estados explícitos.

La apertura de cada siguiente bloque de Tiroides exige 21 días desde la aprobación de la versión vigente, tanto en la interfaz como en `/api/checkin`. Crear el borrador o registrar el pago antes no adelanta la apertura. Si falta la fecha de aprobación, se pide confirmarla con Fernando. Los programas generales conservan su criterio anterior de cuatro semanas.

Los nuevos borradores guardan `meta.notify_review` y generan un aviso a `info@wellnessreal.es` con enlace al panel. El cron recupera avisos interrumpidos; no incorpora borradores históricos sin esa marca. Si el cliente vuelve a enviar su evaluación, se reutiliza el mismo aviso del borrador existente.

Los rechazos y resultados de envío sin confirmar generan un aviso administrativo por cada correo afectado. Si el correo original se recupera antes de enviar el aviso, este se omite. Los fallos de un aviso administrativo no crean cadenas de nuevos avisos. Si el propio proveedor de correo está caído, el aviso permanece registrado para gestionar el incidente en el panel; no se puede garantizar una alerta por ese mismo canal durante su caída.

## Persistencia y operación

Se reutiliza `asesoria_solicitudes.notas`, ya empleada para pagos y reservas de generación. El marcador versionado `[lifecycle:v1:…]` contiene el registro de avisos. Los cambios comparan la versión anterior de las notas para conservar las escrituras concurrentes. No requiere migración ni cambia RLS. No editar a mano el marcador.

Los avisos inmediatos se guardan antes de intentar enviarlos. Los pendientes se revisan con el cron existente `/api/cron/thyroid-installments`, a las 09:00 UTC cada día, con `Authorization: Bearer CRON_SECRET`. El segundo pago mantiene su flujo. El diagnóstico administrativo informa de la presencia del secreto sin revelarlo.

Cada aviso tiene una clave estable y una reserva persistida. Se guardan los datos del destinatario y la huella del primer contenido; si cambia la plantilla durante un envío ambiguo, se requiere revisión. El HTML no se acumula en las notas y los datos temporales se eliminan al terminar el intento. Resend usa la misma `Idempotency-Key`; su [ventana de deduplicación es de 24 horas](https://resend.com/docs/dashboard/emails/idempotency-keys). Los intentos ambiguos se repiten únicamente dentro de una ventana conservadora de 23 horas y con Resend. SMTP no permite confirmar un resultado ambiguo: se marca para revisión. Nunca se marca un envío como rechazado porque falle guardar su aceptación.

`Admin → Comunidad → Solicitudes` muestra cada aviso como pendiente, en curso, aceptado por el proveedor, rechazado, sin confirmar u omitido. Una aceptación del proveedor no garantiza la llegada a la bandeja de entrada. Ante un resultado sin confirmar, revisar el proveedor antes de enviar un correo manual; el sistema no repite esos casos fuera de la ventana segura. La aprobación del plan muestra también su estado de aviso y conserva el botón para escribir personalmente al cliente.

No se programan recordatorios con el programa pausado, finalizado o sin acceso activo. El calendario transcurre desde la aprobación; pausar suspende avisos, pero no cambia automáticamente la duración contratada. Al recuperar el acceso no se envían recordatorios semanales atrasados. El cierre no revoca por sí mismo el acceso: Fernando acuerda el cierre y el estado del programa.

No se importa ni se envía una campaña al histórico. Solo las solicitudes nuevas, pagos iniciales nuevos y nuevas aprobaciones generan registros. Repetir un webhook o aprobar otra vez la misma versión no crea otro aviso. Si se aprueba un borrador existente después del despliegue, esa aprobación sí inicia su recorrido.

## Comprobación

Pruebas unitarias cubren concurrencia, reintentos, fallos de persistencia y proveedor, recibo guardado, webhook repetido y segundo pago, acceso revocado, check-in completado, calendario y exclusión del histórico. Los proveedores se simulan; no se envían correos de prueba a clientes ni se realizan cargos.
