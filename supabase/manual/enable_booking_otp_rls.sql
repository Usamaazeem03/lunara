-- MANUAL CUTOVER ONLY. Not in migrations: never picked up by db push.
-- Apply ONLY after OTP UI + Edge deployment + BOOKING_PUBLIC_MODE=otp + removal
-- of direct frontend transport, after all staging tests in OTP_FOUNDATION.md.
begin;
do $$
begin
  if not exists (select 1 from pg_class where oid = 'public.appointments'::regclass and relrowsecurity) then
    raise exception 'Appointments RLS must already be enabled; inspect production.';
  end if;
  if (select count(*) from pg_policies where schemaname = 'public' and tablename = 'appointments' and cmd in ('INSERT', 'ALL')) <> 2
    or not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'appointments' and policyname = 'Client can insert' and cmd = 'INSERT')
    or not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'appointments' and policyname = 'Owner can insert' and cmd = 'INSERT') then
    raise exception 'INSERT policies differ from the inspected live inventory. Re-audit first.';
  end if;
end $$;
drop policy "Client can insert" on public.appointments;
-- The old owner check only compared IDs. A client could otherwise claim its own
-- user ID as owner_id. Require a real owner profile as the server route does.
alter policy "Owner can insert" on public.appointments to authenticated
  with check (auth.uid() = owner_id and exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'
  ));
-- Preserve owner INSERT grants and all SELECT/UPDATE/DELETE policies. Public
-- verified inserts use the service-only transaction; clients cannot invoke it.
notify pgrst, 'reload schema';
commit;
