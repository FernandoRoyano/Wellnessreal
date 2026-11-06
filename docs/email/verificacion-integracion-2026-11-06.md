# Integración de la web con MailerLite · 6 de noviembre de 2026

## Estado comprobado

La API confirma que la automatización `203311548753511896` está inactiva, sin reentrada y con salida cuando dejan de cumplirse sus condiciones. Entra desde `WR Comunidad · Suscripción voluntaria` (`203311548630828365`) y excluye `WR Método BASE · Clientes` (`203388390885820212`). Cero envíos y cero personas en cola, también después de la prueba de grupos.

El recorrido montado contiene **cinco correos**: bienvenida comercial en día 0 y los días 2, 5, 8 y 12. Las cuatro esperas son 2, 3, 3 y 4 días. Todos los pasos figuran completos y los correos usan remitente y respuesta `info@wellnessreal.es`. Esta consulta verifica configuración, no acredita recepción de los cinco mensajes ni sustituye la revisión de su contenido en el panel.

## Corrección de la web

Antes de esta revisión, producción no tenía configurados los grupos específicos. Además, confirmar un pago retiraba el grupo de captación, pero no clasificaba al contacto en clientes. Ahora se declaran en producción:

```dotenv
MAILERLITE_COMUNIDAD_GROUP_ID=203311548630828365
MAILERLITE_CLIENTES_GROUP_ID=203388390885820212
COMMUNITY_EMAIL_SEQUENCE_ENABLED=false
```

La elección comercial continúa guardándose como `held` mientras el interruptor sea `false`; no se incorporan nuevas altas al proveedor desde la web. Al habilitarlo, solo se sincronizan las peticiones voluntarias de miembros autenticados, aprobados, con identidad coincidente y sin acceso de pago. No se importan contactos históricos.

El pago por Stripe, la confirmación manual y la concesión administrativa de acceso reutilizan `stopCommunityPurchaseInvitations`: retira el grupo comercial y añade el de clientes para contactos que ya existen en MailerLite. No crea suscripciones a partir de una compra ni reactiva bajas. Un fallo se propaga para permitir reintentar sin repetir el pago ni la bienvenida. Si el proveedor ya clasifica al contacto como cliente, la sincronización comercial tampoco lo reincorpora.

## Verificación

- 52 pruebas unitarias correctas: consentimiento y sesión, interruptor apagado, exclusión de clientas, bajas, grupos, errores del proveedor, webhook repetido y confirmación manual.
- TypeScript, lint y compilación de producción correctos. Publicado el commit `1edd13c` en el despliegue `dpl_C1vxnB2AL4x2euVcvFN5cfoMM25h`, confirmado `Ready` y asignado a `wellnessreal.es`. Los tres valores de entorno de producción se comprobaron exactamente, sin saltos de línea.
- Prueba real de las funciones de integración con la única cuenta autorizada, `info@wellnessreal.es`: alta en el grupo voluntario, retirada del comercial, incorporación a clientes, pago repetido y bloqueo de nueva entrada. Después se restauraron exactamente los grupos y el estado anteriores de la cuenta. No se registró una compra real ni se alteró el acceso al programa.
- La prueba real utiliza el código de integración con la API del proveedor; el recorrido autenticado de la web y los eventos de pago se verifican mediante las pruebas automatizadas. No se presenta como una compra real en producción.
- Copia interna del correo preparado del día 2 enviada únicamente a esa misma cuenta, mediante campaña separada `203389166783825581`. A las 13:17, hora de Madrid, el proveedor registra **un envío y una entrega**, sin rebotes; su informe de destinatarios contiene solo la cuenta autorizada. No se ha activado la automatización ni enviado a suscriptoras. La carpeta de recepción en el buzón sigue pendiente de confirmación.
- En producción, acceso público HTTP 200 y rechazo HTTP 401 de una suscripción comercial sin sesión, antes de guardar datos. El artículo de Osteofit conserva `noindex, follow` y sigue fuera del sitemap.

Evidencias locales ignoradas por Git: `output/email-ecosystem-20261105/wiring-verification-20261106.json` y `wiring-test-email-20261106.json`.

## Antes de activar

Confirmar recepción de la prueba y revisar remitente, respuesta, enlaces y pie de los correos del panel. La dirección postal alternativa al domicilio particular sigue sin estar confirmada en este repositorio; no se ha inventado ninguna ni modificado el perfil postal del proveedor. La automatización y el interruptor de la aplicación permanecen apagados.

## Limpieza temporal bloqueada

La revisión automática rechazó eliminar `output/email-ecosystem-20261105/production-config-check.env` con «blocked by policy», sin explicar un motivo adicional. El archivo exportado contiene configuración y credenciales de producción; está excluido de Git y debe retirarse manualmente. No se ha intentado eludir el bloqueo con otra herramienta de borrado.
