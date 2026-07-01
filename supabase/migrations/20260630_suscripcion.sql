-- ============================================================
--  Método BASE · Suscripción mensual (Stripe)
--  Pasamos de pago único a suscripción recurrente (19€/49€ al mes)
--  con permanencia mínima de 3 meses. El acceso deja de ser
--  "pagado para siempre" y pasa a una ventana temporal:
--  acceso_hasta (fin del periodo pagado) + estado de la suscripción.
-- ============================================================

alter table cliente_perfil
  add column if not exists stripe_customer_id     text,
  add column if not exists stripe_subscription_id text,
  -- 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'unpaid'
  add column if not exists estado_suscripcion     text,
  -- Fin del periodo mensual ya pagado: mientras esté en el futuro y el estado
  -- sea active/past_due, el cliente conserva acceso (la gracia la da el past_due).
  add column if not exists acceso_hasta           timestamptz,
  -- Permanencia mínima: no puede quedar cancelado antes de esta fecha
  -- (alta + 3 meses). La cancelación se programa para esta fecha si es antes.
  add column if not exists permanencia_hasta      timestamptz,
  -- Cancelación programada (cancel_at de Stripe), informativo para el cliente.
  add column if not exists cancela_en             timestamptz,
  -- Acceso manual concedido por admin (pruebas / planes de cortesía), al margen
  -- de Stripe. Si es true, el cliente ve su plan aunque no tenga suscripción.
  add column if not exists acceso_manual          boolean not null default false;

-- Índice para resolver rápido por suscripción desde el webhook.
create index if not exists idx_cliente_perfil_subscription
  on cliente_perfil (stripe_subscription_id);
