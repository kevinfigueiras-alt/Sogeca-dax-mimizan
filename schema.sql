-- À exécuter une seule fois dans l'éditeur SQL de votre projet Supabase
-- (Supabase > SQL Editor > New query > coller ce fichier > Run)
--
-- Ce script peut être exécuté plusieurs fois sans erreur (par exemple si
-- vous recommencez après un souci) : il supprime d'abord les anciennes
-- règles d'accès avant de les recréer.

create table if not exists kv_store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Autorise l'application (clé publique "anon") à lire et écrire cette table.
-- C'est volontairement permissif : la protection de l'accès au site se fait
-- via le code d'accès (VITE_ACCESS_CODE), pas via Supabase. Si vous voulez
-- une sécurité plus fine (comptes utilisateurs, permissions par site...),
-- il faudra mettre en place l'authentification Supabase et des policies RLS
-- plus strictes.
alter table kv_store enable row level security;

drop policy if exists "Lecture publique" on kv_store;
create policy "Lecture publique" on kv_store
  for select using (true);

drop policy if exists "Écriture publique" on kv_store;
create policy "Écriture publique" on kv_store
  for insert with check (true);

drop policy if exists "Mise à jour publique" on kv_store;
create policy "Mise à jour publique" on kv_store
  for update using (true);
