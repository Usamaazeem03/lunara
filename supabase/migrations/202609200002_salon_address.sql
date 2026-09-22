-- Salon contact details use the existing owner profile and its existing RLS.
alter table public.profiles add column if not exists address text;
