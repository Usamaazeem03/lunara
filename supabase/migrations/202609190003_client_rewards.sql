-- Apply in Supabase SQL Editor before enabling rewards in the application.
begin;

create table public.client_rewards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  client_id uuid not null references auth.users(id),
  code text not null unique default upper(replace(gen_random_uuid()::text, '-', '')),
  percent_off integer not null check (percent_off between 1 and 100),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  redeemed_at timestamptz,
  redeemed_appointment_id text,
  revoked_at timestamptz
);
alter table public.client_rewards enable row level security;
revoke all on public.client_rewards from anon, authenticated;
grant select on public.client_rewards to authenticated;
create policy "Read own rewards" on public.client_rewards for select to authenticated
using (owner_id = (select auth.uid()) or client_id = (select auth.uid()));
create index client_rewards_client_idx on public.client_rewards(client_id, owner_id);

create function public.issue_client_reward(p_client_id text, p_percent integer, p_days integer)
returns public.client_rewards language plpgsql security definer set search_path = '' as $$
declare recipient uuid; reward public.client_rewards;
begin
  if auth.uid() is null then raise exception 'Please sign in.'; end if;
  if not exists (select 1 from public.profiles p where p.id::text = auth.uid()::text and p.role = 'owner') then
    raise exception 'Only salon owners can issue rewards.';
  end if;
  if p_percent is null or p_percent not between 1 and 100 or p_days is null or p_days not between 1 and 365 then
    raise exception 'Choose a discount from 1 to 100 and an expiry from 1 to 365 days.';
  end if;
  -- Resolve explicit account IDs only. Never match recipients by name, phone or email.
  select u.id into recipient from public.profiles p join auth.users u
    on u.id::text = coalesce(p.auth_id::text, p.id::text)
    where p.id::text = p_client_id and p.owner_id::text = auth.uid()::text and p.role = 'client';
  if recipient is null then
    select u.id into recipient from auth.users u where u.id::text = p_client_id
    and exists (select 1 from public.appointments a where a.owner_id::text = auth.uid()::text and a.client_id::text = u.id::text);
  end if;
  if recipient is null then raise exception 'This client needs a linked booking account before receiving a reward.'; end if;
  insert into public.client_rewards(owner_id, client_id, percent_off, expires_at)
    values(auth.uid(), recipient, p_percent, now() + make_interval(days => p_days)) returning * into reward;
  return reward;
end; $$;

create function public.revoke_client_reward(p_reward_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.client_rewards set revoked_at = now()
  where id = p_reward_id and owner_id = auth.uid() and redeemed_at is null and revoked_at is null;
  if not found then raise exception 'This reward cannot be revoked.'; end if;
end; $$;

alter table public.appointments
  add column reward_code text,
  add column reward_service_ids text[],
  add column reward_discount numeric not null default 0,
  add column reward_original_price numeric;

create function public.validate_booking_reward() returns trigger
language plpgsql security definer set search_path = '' as $$
declare reward public.client_rewards; subtotal numeric; service_count integer; duration integer; names text;
begin
  if TG_OP = 'UPDATE' then
    if new.reward_code is distinct from old.reward_code
      or new.reward_service_ids is distinct from old.reward_service_ids
      or new.reward_discount is distinct from old.reward_discount
      or new.reward_original_price is distinct from old.reward_original_price then
      raise exception 'Reward details cannot be changed after booking.';
    end if;
    if old.reward_code is not null and (new.price is distinct from old.price
      or new.owner_id is distinct from old.owner_id or new.client_id is distinct from old.client_id
      or new.service_id is distinct from old.service_id or new.service_name is distinct from old.service_name
      or new.duration_minutes is distinct from old.duration_minutes) then
      raise exception 'Discounted booking prices, services and recipients cannot be changed.';
    end if;
    return new;
  end if;
  new.reward_code := nullif(upper(trim(new.reward_code)), '');
  new.reward_discount := 0;
  new.reward_original_price := null;
  if new.reward_code is null then new.reward_service_ids := null; return new; end if;
  if auth.uid() is null or (auth.uid()::text <> new.client_id::text and auth.uid()::text <> new.owner_id::text)
    or new.client_id is null or new.owner_id is null then raise exception 'This reward is not available for this booking.'; end if;
  -- The row lock and consumption share the appointment transaction: concurrent reuse fails,
  -- and a failed appointment insert rolls consumption back.
  select * into reward from public.client_rewards where code = new.reward_code for update;
  if not found or reward.owner_id::text <> new.owner_id::text or reward.client_id::text <> new.client_id::text
    or reward.expires_at <= now() or reward.redeemed_at is not null or reward.revoked_at is not null then
    raise exception 'This reward is invalid, expired, used, or belongs to another client or salon.';
  end if;
  if coalesce(cardinality(new.reward_service_ids), 0) = 0 then raise exception 'Select services for this reward.'; end if;
  select count(*), sum(s.price), sum(s.duration_minutes), string_agg(s.name, ', ' order by s.id)
    into service_count, subtotal, duration, names from public.services s
    where s.id::text = any(new.reward_service_ids) and s.owner_id = new.owner_id and s.is_active = true
      and s.price is not null and s.price >= 0 and s.duration_minutes > 0;
  if service_count <> cardinality(new.reward_service_ids) or subtotal is null
    or new.service_id is null or not (new.service_id::text = any(new.reward_service_ids)) then
    raise exception 'One or more selected services are unavailable.';
  end if;
  new.reward_original_price := subtotal;
  new.reward_discount := round(subtotal * reward.percent_off / 100, 2);
  new.price := subtotal - new.reward_discount;
  new.duration_minutes := duration;
  new.service_name := names;
  update public.client_rewards set redeemed_at = now(), redeemed_appointment_id = new.id::text where id = reward.id;
  -- Cancellation or deletion never restores a used code. The salon can issue a new reward.
  return new;
end; $$;
create trigger validate_booking_reward before insert or update on public.appointments
for each row execute function public.validate_booking_reward();

revoke all on function public.issue_client_reward(text, integer, integer) from public, anon;
revoke all on function public.revoke_client_reward(uuid) from public, anon;
revoke all on function public.validate_booking_reward() from public, anon, authenticated;
grant execute on function public.issue_client_reward(text, integer, integer) to authenticated;
grant execute on function public.revoke_client_reward(uuid) to authenticated;
commit;
