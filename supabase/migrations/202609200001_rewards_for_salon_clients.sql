-- Run AFTER 202609190003_client_rewards.sql. Existing rewards are preserved.
begin;

-- A salon client record is not necessarily an auth.users account.
alter table public.client_rewards alter column client_id drop not null;
alter table public.client_rewards add column if not exists salon_client_id text;
alter table public.client_rewards drop constraint if exists client_rewards_recipient_check;
alter table public.client_rewards add constraint client_rewards_recipient_check
  check (client_id is not null or salon_client_id is not null);
create index if not exists client_rewards_salon_client_idx
  on public.client_rewards(owner_id, salon_client_id);
alter table public.appointments add column if not exists reward_profile_id text;

create or replace function public.issue_client_reward(p_client_id text, p_percent integer, p_days integer)
returns public.client_rewards language plpgsql security definer set search_path = '' as $$
declare
  recipient uuid;
  salon_client public.profiles%rowtype;
  profile_id text;
  reward public.client_rewards;
begin
  if auth.uid() is null then raise exception 'Please sign in.'; end if;
  if not exists (select 1 from public.profiles p where p.id::text = auth.uid()::text and p.role = 'owner') then
    raise exception 'Only salon owners can issue rewards.';
  end if;
  if p_percent is null or p_percent not between 1 and 100 or p_days is null or p_days not between 1 and 365 then
    raise exception 'Choose a discount from 1 to 100 and an expiry from 1 to 365 days.';
  end if;

  select * into salon_client from public.profiles p
  where p.id::text = p_client_id and p.owner_id::text = auth.uid()::text and p.role = 'client';
  if found then
    profile_id := salon_client.id::text;
    -- Snapshot an explicit account link only. Never guess accounts from contact details.
    select u.id into recipient from auth.users u
    where u.id::text = salon_client.auth_id::text or u.id::text = salon_client.id::text
    order by (u.id::text = salon_client.auth_id::text) desc nulls last limit 1;
  else
    -- Profiles reconstructed from bookings may already use the account ID.
    select u.id into recipient from auth.users u where u.id::text = p_client_id
      and exists (select 1 from public.appointments a
        where a.owner_id::text = auth.uid()::text and a.client_id::text = u.id::text);
    if recipient is null then
      raise exception 'Select a saved client belonging to your salon before issuing a reward.';
    end if;
  end if;

  insert into public.client_rewards(owner_id, client_id, salon_client_id, percent_off, expires_at)
    values(auth.uid(), recipient, profile_id, p_percent, now() + make_interval(days => p_days))
    returning * into reward;
  return reward;
end; $$;

create or replace function public.validate_booking_reward() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  reward public.client_rewards;
  subtotal numeric;
  service_count integer;
  duration integer;
  names text;
  recipient_matches boolean;
begin
  if TG_OP = 'UPDATE' then
    if new.reward_code is distinct from old.reward_code
      or new.reward_profile_id is distinct from old.reward_profile_id
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
  if new.reward_code is null then
    new.reward_service_ids := null;
    new.reward_profile_id := null;
    return new;
  end if;
  if auth.uid() is null or new.owner_id is null then
    raise exception 'This reward is not available for this booking.';
  end if;

  select * into reward from public.client_rewards where code = new.reward_code for update;
  if not found or reward.owner_id::text <> new.owner_id::text
    or reward.expires_at <= now() or reward.redeemed_at is not null or reward.revoked_at is not null then
    raise exception 'This reward is invalid, expired, used, or belongs to another client or salon.';
  end if;

  recipient_matches := false;
  if auth.uid()::text = new.owner_id::text then
    -- Owner-assisted bookings can use the salon profile, including guests without accounts.
    -- Keep that profile ID when a legacy appointments FK requires a null client_id.
    recipient_matches := (reward.client_id is not null and reward.client_id::text = new.client_id::text)
      or (reward.salon_client_id is not null
        and reward.salon_client_id = new.reward_profile_id
        and exists (select 1 from public.profiles p
          where p.id::text = reward.salon_client_id and p.owner_id::text = new.owner_id::text and p.role = 'client')
        and (new.client_id is null or new.client_id::text = reward.salon_client_id
          or new.client_id::text = reward.client_id::text));
  else
    -- Possession of a code or a profile ID never grants client-side redemption.
    recipient_matches := reward.client_id = auth.uid() and new.client_id::text = auth.uid()::text;
  end if;
  if recipient_matches is distinct from true then
    raise exception 'This reward belongs to another client, or must be applied by the salon when booking.';
  end if;
  new.reward_profile_id := reward.salon_client_id;

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
  return new;
end; $$;

revoke all on function public.issue_client_reward(text, integer, integer) from public, anon;
grant execute on function public.issue_client_reward(text, integer, integer) to authenticated;
revoke all on function public.validate_booking_reward() from public, anon, authenticated;
notify pgrst, 'reload schema';
commit;
