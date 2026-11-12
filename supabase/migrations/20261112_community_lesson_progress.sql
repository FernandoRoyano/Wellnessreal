-- Progreso por cuenta. Las marcas antiguas se importan solo con confirmación.
begin;

create table if not exists public.lesson_progress (
  member_id uuid not null references public.member_profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (member_id, lesson_id)
);

alter table public.lesson_progress enable row level security;
-- Solo servidor: valida sesión, estado del miembro y acceso a cada lección.
revoke all on table public.lesson_progress from anon, authenticated;
grant select, insert, delete on table public.lesson_progress to service_role;

commit;
