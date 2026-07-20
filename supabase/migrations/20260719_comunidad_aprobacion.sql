-- ============================================================
--  Comunidad Tiroides · Aprobación manual de miembros
--  Cualquiera puede solicitar acceso, pero queda en 'pending' y no
--  ve contenido ni foro hasta que un admin lo aprueba.
--  status: 'pending' | 'approved' | 'blocked'
-- ============================================================

-- Truco para no dejar fuera a quien ya estaba dentro:
-- 1) se crea la columna con default 'approved' -> las filas existentes quedan aprobadas
-- 2) se cambia el default a 'pending' -> los registros NUEVOS entran pendientes
-- Es idempotente: reejecutarlo no cambia el estado de nadie.
alter table member_profiles
  add column if not exists status text not null default 'approved';

alter table member_profiles
  alter column status set default 'pending';

create index if not exists idx_member_status on member_profiles(status);
