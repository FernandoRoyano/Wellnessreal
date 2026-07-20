-- ============================================================
--  Comunidad Tiroides · Solicitudes de la asesoría grupal
--  "Grupo Tiroides": 249 € / 12 semanas, directo semanal 45 min,
--  8-12 plazas, por cohortes. El alta NO es automática: la miembro
--  solicita plaza y Fernando cierra a mano (igual que la aprobación
--  de acceso). Esta tabla es su cola de trabajo comercial.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists asesoria_solicitudes (
  id            uuid primary key default gen_random_uuid(),
  creado_en     timestamptz not null default now(),

  -- Quién la pide (miembro de la comunidad).
  member_id     uuid references member_profiles(id) on delete set null,
  nombre        text not null,
  email         text not null,
  telefono      text,

  -- Cualificación: lo mínimo para decidir si encaja en el grupo.
  objetivo               text,
  dias_semana            text,
  lesiones               text,
  disponibilidad_directo text,   -- si puede asistir al directo semanal

  -- 'nueva' | 'contactada' | 'aceptada' | 'descartada'
  estado        text not null default 'nueva',
  notas         text
);

create index if not exists idx_asesoria_estado on asesoria_solicitudes(estado, creado_en desc);
create index if not exists idx_asesoria_member on asesoria_solicitudes(member_id);

alter table asesoria_solicitudes enable row level security;
