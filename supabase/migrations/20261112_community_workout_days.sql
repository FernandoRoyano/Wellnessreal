-- Elección educativa de sesiones por cuenta y fecha. No registra entrenamiento realizado.
begin;

create table if not exists public.community_workout_days (
  member_id uuid not null references public.member_profiles(id) on delete cascade,
  workout_date date not null,
  workout_id text check (workout_id in ('mancuernas', 'gimnasio')),
  updated_at timestamptz not null default now(),
  primary key (member_id, workout_date)
);

alter table public.community_workout_days enable row level security;
-- Solo servidor: la identidad se obtiene de la sesión y se exige cuenta aprobada.
revoke all on table public.community_workout_days from anon, authenticated;
grant select, insert, update on table public.community_workout_days to service_role;

commit;
