-- Execute no SQL Editor do Supabase da Agência Maravilha
alter table public.kwai_gravacoes
  add column if not exists fim timestamptz;

-- A hora final só será preenchida quando existir na resposta do Voyager.
-- Nenhuma data anterior é inventada.
