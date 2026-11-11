# Entrada, búsqueda y continuidad — 10 de noviembre de 2026

## Cambios visibles

- Confirmación de guía fitness: invitación principal a la comunidad para mujeres con hipotiroidismo o Hashimoto; retirada la bifurcación test/venta individual. BASE queda como continuación opcional de pago.
- Confirmación de tiroides: mensajes sin promesas de diez segundos, diagnóstico del metabolismo ni resultados más rápidos; BASE identificado como acompañamiento de pago.
- Acceso por email: confirmación de la dirección normalizada realmente utilizada por el servidor y posibilidad de corregirla.
- Buscador: sinónimos cotidianos, acentos y palabras en distinto orden; tiempo restante o condición de desbloqueo sin exponer el cuerpo de lecciones bloqueadas.

## Continuidad interna

Se reutiliza `thyroid_funnel_events` y el panel existente. Dos eventos nuevos: `community_active_day` y `community_resource_click`. Ambos requieren sesión aprobada y consentimiento; la identidad de miembro se establece en el servidor. No contienen título, URL de lección, búsqueda ni respuestas de salud y no se envían a Google ni Meta.

- Deducción de duplicados mediante el índice único `external_id`: como máximo un registro por miembro, acción y día UTC.
- Métricas: miembros activos, miembros con clic en recursos y retorno durante los días 1–7 posteriores al alta.
- El retorno excluye el día inicial, requiere una ventana completa y solo usa altas desde el inicio de la medición. No se inventan datos históricos.
- El panel indica medición pendiente si no está activada y advierte si el rango supera el límite de eventos.
- Un clic no confirma descarga, lectura o aplicación del recurso.

## Activación de producción

Fernando confirmó el 11 de noviembre de 2026 la ejecución de `supabase/migrations/20261110_community_activity_events.sql` en el SQL Editor. El script amplía la validación de nombres sin eliminar datos y conserva la validación anterior; se ejecuta en una transacción y admite repetición.

Configurado `COMMUNITY_ACTIVITY_SINCE=2026-11-11T07:31:17Z` en Vercel para producción. Despliegue activado: `dpl_2x1A8WmTsAqignTsMYGiBJP4Xwni`. Se conservó la versión de aplicación existente y se comprobó antes de promover que producción no había cambiado. Mantener esta fecha en futuros despliegues para no reiniciar las cohortes.

## Comprobaciones

- Cuatro pruebas unitarias: sinónimos, ventanas de retorno, miembros distintos y ausencia de datos históricos.
- Diez casos de navegador entre móvil y escritorio con proveedores ficticios locales: confirmaciones, email, búsquedas bloqueadas, consentimiento, deduplicación, sesión, origen y panel administrativo.
- TypeScript, ESLint y revisión del diff correctos.
- Confirmaciones revisadas también a 320 px sin desbordamiento.
- No se enviaron correos ni pagos reales durante las pruebas.

Verificación autenticada del panel en producción: HTTP 200, `communityRetention.enabled=true` e inicio coincidente con la configuración. En el día de activación devuelve cero altas elegibles y porcentaje de retorno nulo, como corresponde a la ausencia de ventanas completas. No se insertaron eventos ficticios ni se utilizaron sesiones de miembros para verificarlo; la comprobación de la migración se basa en la confirmación de Fernando. Comprobante local: `output/community-discovery-2026-11-10/activation-verification.json` del espacio principal.
