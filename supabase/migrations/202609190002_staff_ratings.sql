-- Run in Supabase SQL Editor. ID types are inherited from appointments.
begin;

create table public.staff_ratings as
select id as appointment_id, staff_id, owner_id, client_id,
       null::smallint as rating, now() as created_at
from public.appointments with no data;

alter table public.staff_ratings
  alter column appointment_id set not null,
  alter column staff_id set not null,
  alter column owner_id set not null,
  alter column client_id set not null,
  alter column rating set not null,
  alter column created_at set not null,
  alter column created_at set default now(),
  add primary key (appointment_id),
  add foreign key (appointment_id) references public.appointments(id) on delete cascade,
  add foreign key (staff_id) references public.staff(id) on delete cascade,
  add check (rating between 1 and 5);

create index staff_ratings_owner_staff_idx on public.staff_ratings(owner_id, staff_id);
alter table public.staff_ratings enable row level security;
revoke all on public.staff_ratings from anon, authenticated;
grant select on public.staff_ratings to authenticated;
create policy "Clients and owners read their ratings" on public.staff_ratings
for select to authenticated using (
  client_id::text = (select auth.uid())::text
  or owner_id::text = (select auth.uid())::text
);

create or replace function public.rate_staff_appointment(p_appointment_id text, p_rating integer)
returns void
language plpgsql security definer set search_path = '' as $$
declare
  visit public.appointments%rowtype;
begin
  if auth.uid() is null then raise exception 'Please sign in to rate your visit.'; end if;
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'Choose a rating from 1 to 5.';
  end if;
  select * into visit from public.appointments
  where id::text = p_appointment_id and client_id::text = auth.uid()::text
  for update;
  if not found then raise exception 'This appointment is not available for rating.'; end if;
  if lower(trim(visit.status)) is distinct from 'completed' then
    raise exception 'You can rate staff after your appointment is completed.';
  end if;
  if visit.staff_id is null or not exists (
    select 1 from public.staff where id = visit.staff_id and owner_id = visit.owner_id
  ) then raise exception 'This appointment has no assigned staff member.'; end if;
  if exists (select 1 from public.staff_ratings where appointment_id = visit.id) then
    raise exception 'You have already rated this appointment.';
  end if;
  insert into public.staff_ratings (appointment_id, staff_id, owner_id, client_id, rating)
  values (visit.id, visit.staff_id, visit.owner_id, visit.client_id, p_rating);
end;
$$;
revoke all on function public.rate_staff_appointment(text, integer) from public, anon;
grant execute on function public.rate_staff_appointment(text, integer) to authenticated;

-- Expose only anonymous aggregates to the public booking picker.
create or replace function public.get_staff_rating_summaries(p_owner_id text)
returns table (staff_id text, average_rating numeric, rating_count bigint)
language sql stable security definer set search_path = '' as $$
  select r.staff_id::text, avg(r.rating), count(*)
  from public.staff_ratings r
  where r.owner_id::text = p_owner_id
  group by r.staff_id;
$$;
revoke all on function public.get_staff_rating_summaries(text) from public;
grant execute on function public.get_staff_rating_summaries(text) to anon, authenticated;

commit;
