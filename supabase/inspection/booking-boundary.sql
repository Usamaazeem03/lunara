-- READ ONLY. Run in the target project's SQL Editor before enforcing OTP.
-- This is an inspection script, intentionally not a migration.

-- Confirm table existence and RLS state (appointment_services may not exist).
select n.nspname as schema_name, c.relname as table_name,
       c.relrowsecurity as rls_enabled, c.relforcerowsecurity as force_rls
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r', 'p')
  and c.relname in ('appointments', 'appointment_services', 'profiles', 'services', 'staff')
order by c.relname;

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('appointments', 'appointment_services', 'profiles', 'services', 'staff')
order by tablename, policyname;

select table_name, column_name, data_type, udt_name, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('appointments', 'appointment_services', 'profiles')
order by table_name, ordinal_position;

select c.relname as table_name, con.conname,
       pg_get_constraintdef(con.oid) as definition
from pg_constraint con join pg_class c on c.oid = con.conrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('appointments', 'appointment_services', 'profiles')
order by c.relname, con.conname;

select table_name, grantee, privilege_type
from information_schema.table_privileges
where table_schema = 'public'
  and table_name in ('appointments', 'appointment_services', 'profiles')
order by table_name, grantee, privilege_type;

-- Review trigger code, especially reward identity and any implicit service rows.
select c.relname as table_name, t.tgname,
       pg_get_triggerdef(t.oid) as trigger_definition,
       pg_get_functiondef(t.tgfoid) as function_definition
from pg_trigger t join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and not t.tgisinternal
  and c.relname in ('appointments', 'appointment_services', 'profiles')
order by c.relname, t.tgname;

-- Inventory existing RPCs that might create bookings outside this boundary.
-- Inspect any additional routines referenced by these definitions separately.
select p.oid::regprocedure as routine, p.prosecdef as security_definer,
       p.proacl as privileges, pg_get_functiondef(p.oid) as definition
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prokind = 'f'
  and (p.proname ilike '%booking%' or p.proname ilike '%appointment%'
       or p.prosrc ilike '%appointments%');
