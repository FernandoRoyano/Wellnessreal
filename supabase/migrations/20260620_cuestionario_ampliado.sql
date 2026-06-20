-- ============================================================
--  Método BASE · Cuestionario ampliado
--  Más contexto para el plan (entreno + nutrición + recuperación)
--  sin disparar la fricción: la mayoría se rellena con chips.
-- ============================================================

alter table onboarding_respuestas
  add column if not exists horario_entreno text,
  add column if not exists dormir_calidad  text,
  add column if not exists dormir_horas    text,
  add column if not exists medicacion      text,
  add column if not exists no_le_gusta     text,
  add column if not exists comidas_dia     text,
  add column if not exists hambre          text,
  add column if not exists digestion       text;

alter table cliente_perfil
  add column if not exists horario_entreno text,
  add column if not exists dormir_calidad  text,
  add column if not exists dormir_horas    text,
  add column if not exists medicacion      text,
  add column if not exists no_le_gusta     text,
  add column if not exists comidas_dia     text,
  add column if not exists hambre          text,
  add column if not exists digestion       text;
