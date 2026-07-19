-- ============================================================
--  Comunidad Tiroides · Ficha de perfil ampliada + "en línea"
--  Campos extra del miembro (para saber quiénes son) y marca de
--  última actividad para mostrar quién está en línea (activo < 5 min).
-- ============================================================

alter table member_profiles
  add column if not exists last_seen_at  timestamptz,
  add column if not exists birth_date    date,
  add column if not exists gender        text,   -- 'mujer' | 'hombre' | 'otro' | 'na'
  add column if not exists location      text;

-- Índice para resolver rápido "quién está en línea".
create index if not exists idx_member_last_seen on member_profiles(last_seen_at desc);
