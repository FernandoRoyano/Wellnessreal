-- ============================================================
--  Método BASE · Token de acceso público del cliente
--  El cliente abre su plan en /programa/[token]. Usamos un token
--  propio (no el id) para no exponer el identificador interno.
-- ============================================================

alter table cliente_perfil
  add column if not exists token uuid not null default gen_random_uuid();

-- Cada fila existente recibe su propio token (default volátil por fila).
create unique index if not exists idx_cliente_perfil_token on cliente_perfil(token);
