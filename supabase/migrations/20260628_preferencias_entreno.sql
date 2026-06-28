-- ============================================================
--  Método BASE · Preferencias de entrenamiento (opcional)
--  Cómo le gusta entrenar al cliente (chips + texto libre).
--  Si lo deja vacío, Fernando/IA deciden el enfoque.
-- ============================================================

alter table onboarding_respuestas
  add column if not exists preferencias_entreno text;

alter table cliente_perfil
  add column if not exists preferencias_entreno text;
