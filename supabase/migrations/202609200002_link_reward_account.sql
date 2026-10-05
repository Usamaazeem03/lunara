-- Run after 202609200001_rewards_for_salon_clients.sql.
begin;
create or replace function public.link_reward_account(p_reward_id uuid, p_email text)
returns public.client_rewards
language plpgsql security definer set search_path = '' as $$
declare reward public.client_rewards; recipient uuid; matches integer;
begin
  if auth.uid() is null then raise exception 'Please sign in.'; end if;
  select * into reward from public.client_rewards
    where id = p_reward_id and owner_id = auth.uid() for update;
  if not found then raise exception 'This reward is not available for your salon.'; end if;
  if reward.client_id is not null then raise exception 'This reward already belongs to an online account.'; end if;
  if reward.redeemed_at is not null or reward.revoked_at is not null or reward.expires_at <= now() then
    raise exception 'Only an available reward can be connected to an account.';
  end if;
  if nullif(trim(p_email), '') is null then raise exception 'Enter the client''s login email.'; end if;
  -- The salon owner explicitly chooses the recipient. Do not accept claims based on
  -- profile names, editable contact details, or possession of a reward code.
  select count(*) into matches from auth.users u
    where lower(trim(u.email)) = lower(trim(p_email)) and u.email_confirmed_at is not null;
  if matches <> 1 then
    raise exception 'No verified account was found for that email. Ask the client to sign up and verify their email first.';
  end if;
  select u.id into recipient from auth.users u
    where lower(trim(u.email)) = lower(trim(p_email)) and u.email_confirmed_at is not null;
  if recipient = auth.uid() then raise exception 'Enter the client''s email, not your salon login.'; end if;
  update public.client_rewards set client_id = recipient where id = reward.id returning * into reward;
  return reward;
end; $$;
revoke all on function public.link_reward_account(uuid, text) from public, anon;
grant execute on function public.link_reward_account(uuid, text) to authenticated;
notify pgrst, 'reload schema';
commit;
