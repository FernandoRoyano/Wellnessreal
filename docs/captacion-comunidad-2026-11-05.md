# Captación desde la comunidad · revisión del 5 de noviembre de 2026

Implementación local en la rama `feat/community-acquisition`, en el checkout `wellnessreal-cookie-publish`. El checkout principal del usuario conserva sus cambios. Esta tanda no se despliega, no modifica datos reales y no activa campañas. Los vídeos siguen pendientes; los pasos disponibles funcionan por escrito.

## Recorridos

- Visitante que empieza a conocer a Fernando: contenido → comunidad por email → bienvenida y primera acción → Método BASE → solicitud → conversación → pago.
- Visitante preparado para contratar: contenido o navegación → Método BASE → solicitud → conversación → pago. Entrar a la comunidad y hacer el test son opcionales.
- Clienta actual: comunidad → acceso a su programa. No se repite la invitación de compra ni el formulario de captación comercial.

## Cambios

| Zona | Archivos principales | Resultado |
| --- | --- | --- |
| Captación pública | `src/app/(public)/page.tsx`, `Header.tsx`, `Footer.tsx`, `BlogContentWithCTAs.tsx` | Comunidad como acción principal; programa y entrenamiento general accesibles. Extracto real de «Por qué empezar con fuerza», verificado como publicado, y enlace al planificador existente. |
| Acceso | `comunidad/entrar/`, `comunidad/confirmar/`, `comunidad/actions.ts` | Alcance gratuito y primera visita explicados; reintento, conservación del email tras error y acceso al formulario desde el primer bloque móvil. La sesión existente conserva el destino sin repetir alta. |
| Inicio y lecciones | `comunidad/page.tsx`, `[space]/[slug]/page.tsx`, `ProgramInvitation.tsx` | Tres primeros pasos vinculados al contenido existente. Se retiran al tener progreso. Invitación contextual al programa y acceso propio para clientas. |
| Consentimiento | `db/comunidad.ts`, `FooterNewsletterForm.tsx`, `api/newsletter/route.ts` | Entrar o aprobar un miembro deja de suscribirlo automáticamente. Elección comercial separada, casilla sin marcar y registro de versión y fecha en el CRM. Sin segundo correo de bienvenida al solicitarla. |
| Solicitudes | `thyroid-application-lead.ts`, acciones públicas y de asesoría | Ambas entradas reutilizan el registro comercial y mantienen la procedencia. Se conservan validación, solicitudes y mensajes existentes. |
| Correos | `community-email-drafts.ts`, `emailTemplates.ts`, `CampaignForm.tsx` | Cuatro borradores editables en el editor habitual; la bienvenida de día 0 sigue siendo transaccional y única para el perfil nuevo. |
| Pago | `mailerlite.ts`, `api/stripe/webhook/route.ts` | Después de confirmar el pago y el acceso, se retira únicamente el grupo de invitaciones de compra, sin borrar al suscriptor ni cancelar otras suscripciones. Si falla el proveedor, el webhook permite reintentar; acceso ya confirmado y mensajes mantienen sus protecciones existentes. |
| Medición | `analytics.ts`, `community-tracking.ts`, acciones, panel existente de funnel | Hitos propios de comunidad con consentimiento; alta solo tras crear realmente el perfil, progreso tras comprobar autorización. Hitos de servidor no aceptados desde el endpoint público. Primera lección y alta deduplicadas mediante el índice existente de `external_id`. |
| Privacidad | `meta-pixel.ts`, `tracking.ts`, `layout.tsx`, `PrivacyAnalytics.tsx` | La portada ahora trata expresamente de salud y se excluye de Meta. Nuevos eventos de comunidad solo a la base propia, sin enviar respuestas ni datos personales a Google o Meta. Confirmación por email sin inicializar GA; URL privada excluida de Vercel Analytics y Speed Insights. |

El progreso reutiliza la cookie actual del navegador. No se ha creado otro sistema ni se promete sincronización entre dispositivos. Los hitos con consentimiento describen una muestra; no equivalen a todas las altas o a una atribución completa entre dispositivos. La conexión con solicitudes usa el identificador anónimo existente cuando está disponible. Conversaciones y cierres se consultan en el CRM actual; los pagos siguen confirmándose mediante Stripe.

## Secuencia preparada, sin activar

| Día | Contenido | Acción principal |
| --- | --- | --- |
| 0 | Bienvenida transaccional existente, ajustada con el primer paso | Entrar a la comunidad y consultar la bienvenida |
| 2 | Primera decisión sobre fuerza | Lección publicada `entrena-organizate/por-que-empezar-con-fuerza` |
| 5 | Herramientas para una semana difícil y dónde preguntar | `/comunidad#recursos` |
| 8 | Formación, enfoque y límites de Fernando | `/sobre-mi` |
| 12 | Diferencia entre recursos gratuitos y acompañamiento | `/metodo-tiroides?origen=comunidad` |

Los días 2, 5, 8 y 12 están en el selector del editor como «Borrador comunidad · día N». Se pueden editar antes de crear una campaña. Una sola acción principal por correo; el formato habitual conserva el enlace de baja de MailerLite. El día 0 no debe añadirse de nuevo a una automatización comercial. La persona puede solicitar plaza desde el primer día.

Inspección de MailerLite mediante GET, sin mutaciones: existe una automatización activa «Grupo Tiroides - Bienvenida», no repetible, con un correo «Entrega guía». No se ha modificado. En la configuración local no está definido `MAILERLITE_COMUNIDAD_GROUP_ID`; esto no demuestra qué hay configurado en producción.

## Configuración manual antes de publicar o activar

1. Revisar esta tanda local y aplicar `supabase/migrations/20261105_community_acquisition_events.sql` en el entorno de destino antes de desplegar. Solo amplía los nombres admitidos en la tabla existente; no migra ni borra contactos. No se ha ejecutado contra producción.
2. Mantener `COMMUNITY_EMAIL_SEQUENCE_ENABLED=false` hasta revisar el flujo de MailerLite. Con el valor predeterminado, el CRM guarda las elecciones comerciales nuevas sin incorporarlas a ninguna campaña.
3. Preparar en MailerLite un grupo exclusivo y su automatización en borrador, reutilizando el editor y los borradores disponibles. No reutilizar el grupo que dispara la entrega de guía. Configurar `MAILERLITE_COMUNIDAD_GROUP_ID` con ese grupo, sin publicar secretos en el repositorio.
4. La entrada comercial comienza al solicitar expresamente la suscripción. Si sucede después del alta, los retrasos se cuentan desde esa elección, manteniendo la bienvenida transaccional ya recibida. Retrasos sucesivos: 2, 3, 3 y 4 días; no repetir la automatización al volver al grupo.
5. Antes de cada envío, exigir estado activo y permanencia en el grupo; al salir del grupo debe finalizar el recorrido. El webhook retira del grupo al confirmar pago. Revisar clientas con acceso concedido manualmente y pagos anteriores antes de importar contactos: solo incorporar consentimientos acreditados, nunca toda la lista histórica de miembros. Conservar bajas y excluir clientas del recorrido de compra.
6. Verificar con una cuenta propia de prueba la entrega real de acceso, baja y salida al pagar en el entorno de pruebas del proveedor. Solo después activar la secuencia mediante la configuración. Esta tarea no realiza envíos reales ni cobros.

Fuentes técnicas de la integración: [grupos de MailerLite](https://developers.mailerlite.com/api/groups), [suscriptores](https://developers.mailerlite.com/api/subscribers), [automatizaciones](https://developers.mailerlite.com/api/automations). No se infiere ninguna automatización de Osteofit.

## Pruebas y reproducción local

Se incluye `tests/fixtures/community-service.cjs`, un servicio HTTP en `127.0.0.1:54329` con miembros gratuitos, de pago y bloqueados ficticios. `no-external-mail.cjs` bloquea las conexiones SMTP y rechaza su uso fuera de ese servicio local. No es un modo de autenticación del producto ni puede habilitarse mediante una petición web.

En una terminal: `node tests/fixtures/community-service.cjs`. En otra, iniciar Next con la URL de Supabase del fixture, claves `fixture-anon` y `fixture-service-role`, `NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3100`, credenciales de Resend/Gmail/MailerLite vacías y `NODE_OPTIONS=--require=./tests/fixtures/no-external-mail.cjs`. Ejecutar `node node_modules/next/dist/bin/next dev --webpack -H 127.0.0.1 -p 3100`. Estas variables son solo de esa terminal; no se guardan en `.env.local`.

Para Playwright, `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100` y `COMMUNITY_LOCAL_FIXTURE=1`. Las pruebas que solicitan acceso o envían formularios sin interceptarlos se omiten fuera del fixture. Los navegadores bloquean servicios HTTPS externos. Las pruebas unitarias usan dobles de proveedor y datos ficticios.

La revisión visual se guarda localmente en `output/community-acquisition/` (ignorado por Git). La entrega real por correo, la propiedad de Google Analytics, la migración en el servidor y los cambios de estado dentro de MailerLite no se dan por verificados mediante estos dobles.

Resultados de la revisión: compilación de producción y TypeScript correctos; lint sin incidencias; 83 pruebas unitarias correctas. Cubren también el fallo temporal de MailerLite después de pagar y su reintento sin duplicar bienvenida. Se han probado 30 casos del recorrido en Chrome móvil y escritorio sobre el servidor de desarrollo con servicios ficticios, incluyendo formulario real contra el backend local; la revisión visual y Axe en 320, 375 y 1440 px no detecta desbordamientos ni incidencias WCAG en las superficies públicas modificadas. El detector de diseño no devuelve hallazgos en los archivos cambiados.

La revisión automática de herramientas rechazó el arranque adicional de `next start` para repetir el recorrido sobre la compilación, con el motivo «blocked by policy». Esa repetición sobre el servidor compilado no se ha realizado. No afecta al resultado de la compilación ni a las pruebas ya ejecutadas en desarrollo.
