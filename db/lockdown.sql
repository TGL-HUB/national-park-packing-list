-- ── Lock down public access to person_lists ──────────────────────────────────
-- Run this ONLY after the gated app (with /api functions) is live in production.
-- Before this, the table is publicly readable/writable with the publishable key.
-- After this, the table is reachable ONLY through the serverless functions in
-- /api, which use the service-role key (and bypass RLS). The browser never
-- touches Supabase directly anymore.
--
-- This removes every existing RLS policy and leaves RLS enabled with no policy,
-- which denies all access to the anon/authenticated roles while the service role
-- continues to bypass RLS.

do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'person_lists'
  loop
    execute format('drop policy if exists %I on public.person_lists', p.policyname);
  end loop;
end $$;

alter table public.person_lists enable row level security;
