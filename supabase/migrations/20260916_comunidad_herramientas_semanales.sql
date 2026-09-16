-- Herramientas de utilidad recurrente para la Comunidad Tiroides.
create table if not exists community_checkins (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references member_profiles(id) on delete cascade,
  week_start date not null,
  energy smallint not null check (energy between 1 and 5),
  sleep smallint not null check (sleep between 1 and 5),
  confidence smallint not null check (confidence between 1 and 5),
  training_sessions smallint not null check (training_sessions between 0 and 7),
  note text,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (member_id, week_start)
);

create table if not exists lesson_favorites (
  member_id uuid not null references member_profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  creado_en timestamptz not null default now(),
  primary key (member_id, lesson_id)
);

create table if not exists lesson_feedback (
  member_id uuid not null references member_profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  helpful boolean not null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  primary key (member_id, lesson_id)
);

create index if not exists idx_community_checkins_member_week on community_checkins(member_id, week_start desc);
create index if not exists idx_lesson_favorites_member on lesson_favorites(member_id, creado_en desc);

alter table community_checkins enable row level security;
alter table lesson_favorites enable row level security;
alter table lesson_feedback enable row level security;
