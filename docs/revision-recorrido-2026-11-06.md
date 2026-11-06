# Comprobación del recorrido · 6 de noviembre de 2026

El recorrido funcional está comprobado con datos ficticios hasta consultar el plan aprobado, descargarlo y guardar el check-in. Se han corregido dos fallos: recuperación de enlaces caducados y confirmación de pagos manuales. Los ajustes del commit `ec4f9db` se publicaron el 6 de noviembre a las 09:35, hora de Madrid. El recorrido comercial de MailerLite sigue sin activar y sin pasos configurados.

## Resultado por etapa

| Etapa | Comprobación | Resultado y alcance |
| --- | --- | --- |
| Contenido → siguiente paso | Portada, guías de ejercicio y Hashimoto, artículo de masa muscular, comunidad y programa | Destinos y enlaces coherentes. 24 comprobaciones de páginas públicas en producción, contando móvil y escritorio: sin errores de JavaScript ni desbordamientos detectados. |
| Acceso gratuito | Email → solicitud → confirmación → comunidad | Producción aceptó una solicitud a `info@wellnessreal.es`. La confirmación con sesión y la conservación del destino se probaron con Supabase ficticio local. El GET del enlace no lo canjea: exige pulsar «Confirmar acceso». |
| Enlace caducado | Error → pedir otro enlace → volver al destino original | Corregido: la pantalla tenía la explicación, pero faltaba el acceso directo para pedir otro. Ahora ofrece el enlace y conserva un destino interno validado, sin copiar el token anterior. |
| Primera visita | Bienvenida, primera lección, recursos y programa | Las cuatro zonas enlazadas existen y están publicadas. «Por qué empezar con fuerza» es gratuita y está disponible desde el día cero. Los cuatro PDF gratuitos devuelven HTTP 200 y contenido PDF válido. |
| Suscripción comercial | Casilla opcional, email verificado, exclusión de clientas | Comprobado localmente: no es requisito para usar la comunidad; una clienta de pago queda excluida, también al llamar directamente a la API. La preferencia queda retenida mientras la secuencia está apagada. |
| Solicitud | Formulario → solicitud guardada → CRM | Comprobado con backend ficticio real por HTTP: conserva teléfono y origen comunidad, registra la oportunidad y muestra confirmación sin generar un cobro. |
| Pago mediante Stripe | Firma, pago confirmado, reintentos y acceso | Lógica cubierta con dobles en las pruebas unitarias. La configuración de producción usa modo real y tiene habilitado `https://wellnessreal.es/api/stripe/webhook` para `checkout.session.completed`. No se efectuó una compra real. |
| Pago manual | Confirmación administrativa → acceso y pasos de inicio | Corregido: ahora registra el pago y la bienvenida de forma atómica, concede acceso al perfil existente, conserva la primera fecha y retira las invitaciones comerciales. Los reintentos mantienen una única confirmación. |
| Evaluación | Ocho pasos → autorización → envío → error y reintento | Comprobado en móvil y escritorio: email de sesión de solo lectura, autorización de datos de salud obligatoria, conservación de respuestas tras un fallo y pantalla de recepción. La generación de IA se sustituyó por un borrador determinista de prueba. |
| Preparación y aprobación | Borrador privado → aprobación → semana 1 | El plan y su PDF permanecen ocultos antes de la aprobación. Aprobarlo inicia las 12 semanas; repetir la aprobación conserva la fecha. No se muestra como entregado por el mero hecho de haber pagado. |
| Entrega y seguimiento | Consultar plan → descargar PDF → check-in | Comprobado en móvil y escritorio con datos ficticios. El PDF válido se sirve con caché privada y `no-store`; el check-in se guarda para la identidad autenticada. |
| Recorrido sin vídeo | Clase práctica y programa escrito | La alternativa escrita conserva contenido y enlaces. Los vídeos pendientes no bloquean el recorrido probado. |

## Correcciones

1. `ConfirmarForm.tsx`, `entrar.module.css` y `actions.ts`: recuperación visible tras un enlace caducado, con destino seguro y mensaje que coincide con la acción disponible. Revisión visual a 375 y 1440 px; Axe sin incidencias en la superficie modificada.
2. `db/comunidad.ts`: el pago manual utiliza `mutateApplication` y `enqueueNotice`, ya existentes, para guardar el estado y la confirmación conjuntamente. Reutiliza el envío y sus reintentos. Un fallo posterior no borra el pago ni crea otra bienvenida al repetir la operación. Se conserva la fecha de pago de un perfil existente.
3. `metodo-tiroides-template.ts`: corregida una palabra con codificación dañada en la descripción del recorrido.

No se ha aplicado ninguna migración ni modificado datos de clientas para estas correcciones.

## Servicios reales

- **Web publicada:** Vercel confirma el despliegue `dpl_HUYTTijeRufvKGXr1TtQDUdsSgdt` como `Ready`, creado el 6 de noviembre y asignado a `wellnessreal.es`. Tras desplegar se comprobó `/comunidad/entrar`: HTTP 200, aviso de cookies presente y caché privada sin almacenamiento.
- **Supabase Auth:** solicitud de acceso a la cuenta de prueba aceptada por la web publicada. La recepción y apertura desde el buzón real siguen sin confirmar. La comprobación local no acredita ese paso externo.
- **Correo de la aplicación:** diagnóstico autenticado de producción correcto. Usa Resend desde `noreply@wellnessreal.es`; el acompañamiento fija respuesta en `info@wellnessreal.es`. El cron está configurado y las tablas consultadas por el diagnóstico existen. No se ha cambiado el remitente.
- **Stripe:** comprobación de lectura con la configuración de producción, separada de la clave de pruebas local. El webhook actual está activo; se conserva otro endpoint deshabilitado. No se han creado sesiones de pago ni modificado endpoints. La comprobación de configuración no sustituye una compra real ni demuestra una entrega reciente de un evento de Stripe.
- **MailerLite:** la copia interna del 5 de noviembre registra **un envío y una entrega**, sin rebotes. El informe de destinatarios contiene únicamente `info@wellnessreal.es`. No se acredita la carpeta del buzón. El grupo comercial sigue vacío, sus cuatro correos en borrador y la automatización apagada.

Las credenciales temporales de producción se utilizaron solo para comprobar configuración y se eliminaron al finalizar la consulta. Los recibos locales contienen resultados y estados; no claves ni sesiones administrativas.

## Validación

- **100 pruebas unitarias correctas**, incluida la lógica de Stripe y de reintento de los avisos.
- **42 escenarios distintos de navegador comprobados** en Chrome móvil y escritorio mediante la suite y reejecuciones enfocadas; el recorrido integrado incluye confirmación de acceso, solicitud, pago manual, evaluación completa, aprobación, PDF y check-in.
- La navegación de la clase admite la compilación inicial del servidor de desarrollo en su espera de prueba. Se repitió correctamente el caso que excedió la espera inicial.
- Detector de diseño sin hallazgos en la recuperación modificada; revisión visual y Axe correctos a 375 y 1440 px.
- **TypeScript, lint y compilación de producción correctos** tras las correcciones.

Los fixtures solo escuchan en `127.0.0.1`, usan identidades ficticias y bloquean SMTP externo. La prueba de IA devuelve una plantilla local y simula primero un error recuperable. Ninguna prueba local ha realizado cobros, generado programas de clientas o enviado correos a terceras personas.

## Pendiente para operar todo en producción

1. Ajustes publicados y comprobados. La integración posterior de los grupos de MailerLite también está [publicada y verificada](email/verificacion-integracion-2026-11-06.md); la automatización permanece inactiva.
2. Confirmar en el buzón la recepción del acceso de Supabase y completar una entrada real. La entrega técnica de MailerLite está registrada, pero no sustituye esa comprobación de acceso.
3. Resolver una dirección postal alternativa que respete la decisión de no publicar el domicilio particular; comprobar también el pie automático del proveedor.
4. El recorrido de MailerLite ya está montado y la exclusión de clientes probada. Antes de activarlo quedan la confirmación del buzón y la revisión final del contenido y pie de los mensajes del panel.

Los detalles de configuración y los identificadores están en [el informe del ecosistema](email/ecosistema-y-activacion-2026-11-05.md). Los vídeos continúan pendientes de grabar.

Evidencia local ignorada por Git: `output/email-ecosystem-20261105/public-journey.json`, `public-class-journey.json`, `journey-content.json`, `live-community-access.json`, `production-services.json`, `deployed-payment-email.json`, `internal-test-receipt.json` y `confirmation-recovery-review.json`.
