-- ============================================================
--  Método BASE · Pago del plan (gating)
--  Dos niveles: 'auto' (plan IA al instante) y 'revisado'
--  (Fernando lo revisa a mano antes de entregar). Se cobra en
--  el adelanto, con Stripe Checkout. El webhook rellena pagado_en.
-- ============================================================

alter table cliente_perfil
  add column if not exists plan_tier         text,        -- 'auto' | 'revisado'
  add column if not exists pagado_en         timestamptz, -- null = aún no ha pagado
  add column if not exists stripe_session_id text;
