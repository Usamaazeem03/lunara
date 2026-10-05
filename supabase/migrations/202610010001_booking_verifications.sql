-- FOUNDATION ONLY. Review/apply manually after existing reward migrations.
-- Does NOT change appointments RLS or enable public OTP enforcement.
begin;

create table public.booking_verifications (
  id uuid primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  email text not null check (email = lower(btrim(email)) and length(email) between 3 and 254),
  auth_user_id uuid references auth.users(id) on delete cascade,
  code_hash text not null check (code_hash ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz not null,
  verified_at timestamptz,
  authorization_expires_at timestamptz,
  proof_hash text check (proof_hash ~ '^[0-9a-f]{64}$'),
  consumed_at timestamptz,
  appointment_id text,
  attempt_count integer not null default 0 check (attempt_count between 0 and 5),
  delivery_state text not null default 'pending' check (delivery_state in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default clock_timestamp()
);
create index booking_verifications_email_created on public.booking_verifications(email, created_at);
create index booking_verifications_owner_created on public.booking_verifications(owner_id, created_at);
alter table public.booking_verifications enable row level security;
revoke all on public.booking_verifications from public, anon, authenticated;
-- No client SELECT policy: hashes and proof digests are server-only.
grant select on public.booking_verifications to service_role;

create function public.request_booking_verification(
  p_id uuid, p_owner_id uuid, p_email text, p_code_hash text, p_auth_user_id uuid default null
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare deadline timestamptz;
begin
  if auth.role() is distinct from 'service_role' then raise exception 'Server access required.' using errcode = '42501'; end if;
  if p_email is null or p_email <> lower(btrim(p_email)) or length(p_email) not between 3 and 254 then
    return jsonb_build_object('error', 'INVALID_EMAIL', 'message', 'Invalid email.');
  end if;
  if not exists (select 1 from public.profiles where id = p_owner_id and role = 'owner') then
    return jsonb_build_object('error', 'INVALID_SALON', 'message', 'This salon is unavailable.');
  end if;
  -- Shared DB locks work across Edge instances; never rely on in-memory limits.
  -- Lock ordering is stable: salon first, then global normalized email.
  perform pg_advisory_xact_lock(hashtextextended('booking-salon:' || p_owner_id::text, 0));
  perform pg_advisory_xact_lock(hashtextextended('booking-email:' || p_email, 0));
  if exists (select 1 from public.booking_verifications where email = p_email and created_at > clock_timestamp() - interval '60 seconds')
    or (select count(*) from public.booking_verifications where email = p_email and created_at > clock_timestamp() - interval '1 hour') >= 5
    or (select count(*) from public.booking_verifications where owner_id = p_owner_id and created_at > clock_timestamp() - interval '1 hour') >= 100 then
    return jsonb_build_object('error', 'RATE_LIMITED', 'message', 'Too many requests. Please try again later.');
  end if;
  deadline := clock_timestamp() + interval '10 minutes';
  insert into public.booking_verifications(id, owner_id, email, auth_user_id, code_hash, expires_at)
    values(p_id, p_owner_id, p_email, p_auth_user_id, p_code_hash, deadline);
  return jsonb_build_object('expires_at', deadline);
end; $$;

create function public.set_booking_verification_delivery(p_id uuid, p_sent boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if auth.role() is distinct from 'service_role' then raise exception 'Server access required.' using errcode = '42501'; end if;
  update public.booking_verifications set delivery_state = case when p_sent then 'sent' else 'failed' end
    where id = p_id and verified_at is null and (not p_sent or delivery_state = 'pending');
  if not found then return jsonb_build_object('error', 'INVALID_VERIFICATION', 'message', 'Verification is unavailable.'); end if;
  return '{}'::jsonb;
end; $$;

create function public.verify_booking_code(p_id uuid, p_code_matches boolean, p_proof_hash text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v public.booking_verifications;
begin
  if auth.role() is distinct from 'service_role' then raise exception 'Server access required.' using errcode = '42501'; end if;
  select * into v from public.booking_verifications where id = p_id for update;
  if not found or v.delivery_state <> 'sent' or v.consumed_at is not null or v.verified_at is not null then
    return jsonb_build_object('error', 'INVALID_VERIFICATION', 'message', 'Verification is unavailable or already used.');
  end if;
  if v.expires_at <= clock_timestamp() then return jsonb_build_object('error', 'EXPIRED_CODE', 'message', 'The code has expired.'); end if;
  if v.attempt_count >= 5 then return jsonb_build_object('error', 'TOO_MANY_ATTEMPTS', 'message', 'Request a new code.'); end if;
  update public.booking_verifications set attempt_count = attempt_count + 1 where id = p_id;
  -- Return an error value, not an exception: failed attempts must COMMIT.
  if p_code_matches is distinct from true then
    return jsonb_build_object('error', 'INCORRECT_CODE', 'message', 'The code is incorrect.');
  end if;
  if p_proof_hash is null or p_proof_hash !~ '^[0-9a-f]{64}$' then raise exception 'Invalid server proof digest.'; end if;
  update public.booking_verifications set verified_at = clock_timestamp(), proof_hash = p_proof_hash,
    authorization_expires_at = least(expires_at, clock_timestamp() + interval '5 minutes') where id = p_id
    returning * into v;
  return jsonb_build_object('expires_at', v.authorization_expires_at);
end; $$;

create function public.create_verified_public_appointment(
  p_verification_id uuid, p_proof_hash text, p_auth_user_id uuid, p_appointment jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v public.booking_verifications;
  input public.appointments;
  saved public.appointments;
  old_claims text;
  old_sub text;
  old_role text;
begin
  if auth.role() is distinct from 'service_role' then raise exception 'Server access required.' using errcode = '42501'; end if;
  select * into v from public.booking_verifications where id = p_verification_id for update;
  if not found or v.verified_at is null or v.consumed_at is not null or v.delivery_state <> 'sent'
    or v.authorization_expires_at is null or v.authorization_expires_at <= clock_timestamp()
    or v.expires_at <= clock_timestamp() or v.proof_hash is distinct from p_proof_hash then
    return jsonb_build_object('error', 'VERIFICATION_REQUIRED', 'message', 'Verification is invalid, expired or already used.');
  end if;
  if v.owner_id::text is distinct from (p_appointment->>'owner_id')
    or v.email is distinct from lower(btrim(p_appointment->>'client_email'))
    or v.auth_user_id is distinct from p_auth_user_id then
    return jsonb_build_object('error', 'VERIFICATION_MISMATCH', 'message', 'Verification does not match this booking identity or salon.');
  end if;
  if v.auth_user_id is null and nullif(btrim(p_appointment->>'reward_code'), '') is not null then
    return jsonb_build_object('error', 'REWARD_ACCOUNT_REQUIRED', 'message', 'This reward requires its linked customer account.');
  end if;
  -- Use the existing row's column types, while INSERT names only existing input
  -- columns. Never accept an appointment id, reward discount or arbitrary fields.
  input := jsonb_populate_record(null::public.appointments, p_appointment || jsonb_build_object(
    'owner_id', v.owner_id, 'client_id', v.auth_user_id, 'client_email', v.email,
    'source', 'client', 'status', 'Pending', 'payment_option', 'Pay at Salon', 'reward_profile_id', null));
  if not exists (select 1 from public.services s where s.id = input.service_id and s.owner_id = v.owner_id and s.is_active = true)
    or (input.staff_id is not null and not exists (select 1 from public.staff s where s.id = input.staff_id and s.owner_id = v.owner_id)) then
    return jsonb_build_object('error', 'INVALID_SELECTION', 'message', 'Selected service or staff is unavailable at this salon.');
  end if;

  -- Existing reward triggers require auth.uid(). Only this service-only function
  -- may establish it from the stored, server-validated identity. No browser claim
  -- is accepted here. Restore the request context after INSERT.
  old_claims := current_setting('request.jwt.claims', true);
  old_sub := current_setting('request.jwt.claim.sub', true);
  old_role := current_setting('request.jwt.claim.role', true);
  perform set_config('request.jwt.claim.sub', coalesce(v.auth_user_id::text, ''), true);
  perform set_config('request.jwt.claim.role', case when v.auth_user_id is null then 'anon' else 'authenticated' end, true);
  perform set_config('request.jwt.claims', jsonb_build_object('sub', v.auth_user_id,
    'role', case when v.auth_user_id is null then 'anon' else 'authenticated' end)::text, true);

  insert into public.appointments(owner_id, client_id, client_name, client_phone, client_email,
    service_id, service_name, staff_id, staff_name, appointment_date, appointment_time,
    duration_minutes, price, status, notes, payment_option, payment_method, source,
    reward_code, reward_service_ids, reward_profile_id)
  values(input.owner_id, input.client_id, input.client_name, input.client_phone, input.client_email,
    input.service_id, input.service_name, input.staff_id, input.staff_name, input.appointment_date, input.appointment_time,
    input.duration_minutes, input.price, input.status, input.notes, input.payment_option, input.payment_method, input.source,
    input.reward_code, input.reward_service_ids, input.reward_profile_id)
  returning * into saved;

  perform set_config('request.jwt.claims', coalesce(old_claims, ''), true);
  perform set_config('request.jwt.claim.sub', coalesce(old_sub, ''), true);
  perform set_config('request.jwt.claim.role', coalesce(old_role, ''), true);
  update public.booking_verifications set consumed_at = clock_timestamp(), appointment_id = saved.id::text where id = v.id;
  -- All effects (including reward redemption and proof consumption) roll back
  -- together on INSERT/trigger failure. The row lock serializes proof reuse.
  return jsonb_build_array(to_jsonb(saved));
end; $$;

revoke all on function public.request_booking_verification(uuid, uuid, text, text, uuid) from public, anon, authenticated;
revoke all on function public.set_booking_verification_delivery(uuid, boolean) from public, anon, authenticated;
revoke all on function public.verify_booking_code(uuid, boolean, text) from public, anon, authenticated;
revoke all on function public.create_verified_public_appointment(uuid, text, uuid, jsonb) from public, anon, authenticated;
grant execute on function public.request_booking_verification(uuid, uuid, text, text, uuid) to service_role;
grant execute on function public.set_booking_verification_delivery(uuid, boolean) to service_role;
grant execute on function public.verify_booking_code(uuid, boolean, text) to service_role;
grant execute on function public.create_verified_public_appointment(uuid, text, uuid, jsonb) to service_role;
notify pgrst, 'reload schema';
commit;
