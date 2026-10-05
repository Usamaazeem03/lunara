import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import {
  createBookingCrypto,
  createVerificationService,
  createOptionalBookingIdentity,
  generateBookingCode,
  hashBookingProof,
} from "../functions/_shared/bookingVerification.js";
import { createBookingEmailProvider } from "../functions/_shared/bookingEmail.js";
import { createBookingHandler } from "../functions/create-appointment/handler.js";
import { createVerificationHandler } from "../functions/booking-verification/handler.js";
import { createAppointmentTransport } from "../../src/services/appointmentTransport.js";

const owner = "11111111-1111-4111-8111-111111111111";
const clientId = "22222222-2222-4222-8222-222222222222";
const otherOwner = "33333333-3333-4333-8333-333333333333";
const db = new PGlite();
after(() => db.close());
await db.exec(`
  create role anon; create role authenticated; create role service_role;
  create schema auth;
  create table auth.users(id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$
    select coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''),
      nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'sub')::uuid $$;
  create function auth.role() returns text language sql stable as $$
    select coalesce(nullif(current_setting('request.jwt.claim.role', true), ''),
      nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role') $$;
  grant usage on schema public, auth to anon, authenticated, service_role;
  create table public.profiles(id uuid primary key, auth_id uuid, owner_id uuid, role text);
  create table public.services(id bigint primary key, owner_id uuid, name text, price numeric, duration_minutes integer, is_active boolean);
  create table public.staff(id bigint primary key, owner_id uuid);
  create table public.appointments(
    id bigint generated always as identity primary key,
    owner_id uuid references auth.users, client_id uuid references auth.users,
    client_name text, client_phone text, client_email text,
    service_id bigint references services, service_name text,
    staff_id bigint references staff, staff_name text, appointment_date date, appointment_time time,
    duration_minutes integer, price numeric check(price >= 0), status text, notes text,
    payment_option text, payment_method text, source text, created_at timestamptz default now()
  );
  insert into auth.users values ('${owner}'), ('${clientId}'), ('${otherOwner}');
  insert into profiles values ('${owner}', null, null, 'owner'), ('${clientId}', '${clientId}', '${owner}', 'client'), ('${otherOwner}', null, null, 'owner');
  insert into services values (1, '${owner}', 'Cut', 30, 30, true), (2, '${owner}', 'Wash', 20, 15, true);
  alter table appointments enable row level security;
  create policy "Client can insert" on appointments for insert to authenticated with check (auth.uid() = client_id);
  create policy "Owner can insert" on appointments for insert to authenticated with check (auth.uid() = owner_id);
  create policy "Client can select" on appointments for select to authenticated using (auth.uid() = client_id);
  create policy "Owner can select" on appointments for select to authenticated using (auth.uid() = owner_id);
  create policy "Owner can update" on appointments for update to authenticated using (auth.uid() = owner_id);
  create policy "Owner can delete" on appointments for delete to authenticated using (auth.uid() = owner_id);
  grant select, insert, update, delete on appointments to authenticated;
  grant select on profiles to authenticated;
  grant usage on all sequences in schema public to authenticated;
`);
for (const file of [
  "202609190003_client_rewards.sql",
  "202609200001_rewards_for_salon_clients.sql",
  "202610010001_booking_verifications.sql",
]) {
  await db.exec(
    await readFile(new URL(`../migrations/${file}`, import.meta.url), "utf8"),
  );
}
async function serverContext() {
  await db.exec(
    "reset role; select set_config('request.jwt.claims', '{\"role\":\"service_role\"}', false); select set_config('request.jwt.claim.role','service_role',false); select set_config('request.jwt.claim.sub','',false);",
  );
}
await serverContext();

const rpcArgs = {
  request_booking_verification: [
    "p_id",
    "p_owner_id",
    "p_email",
    "p_code_hash",
    "p_auth_user_id",
  ],
  set_booking_verification_delivery: ["p_id", "p_sent"],
  verify_booking_code: ["p_id", "p_code_matches", "p_proof_hash"],
  create_verified_public_appointment: [
    "p_verification_id",
    "p_proof_hash",
    "p_auth_user_id",
    "p_appointment",
  ],
};
const admin = {
  async rpc(name, args) {
    const keys = rpcArgs[name];
    assert.ok(keys);
    try {
      const result = await db.query(
        `select public.${name}(${keys.map((_, i) => `$${i + 1}`).join(",")}) as data`,
        keys.map((key) => args[key]),
      );
      return { data: result.rows[0].data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  from(table) {
    assert.equal(table, "booking_verifications");
    return {
      select(fields) {
        assert.equal(fields, "code_hash");
        return {
          eq(key, id) {
            assert.equal(key, "id");
            return {
              async maybeSingle() {
                return {
                  data:
                    (
                      await db.query(
                        "select code_hash from booking_verifications where id=$1",
                        [id],
                      )
                    ).rows[0] ?? null,
                  error: null,
                };
              },
            };
          },
        };
      },
    };
  },
};
const cryptography = await createBookingCrypto(
  "a-strong-test-only-secret-that-is-at-least-32-bytes",
);
let mail = [];
let failDelivery = false;
const service = createVerificationService({
  admin,
  otpCrypto: cryptography,
  getOptionalUser: async (authorization) =>
    authorization === "Bearer client" ? { id: clientId } : null,
  emailProvider: {
    assertConfigured() {},
    async sendCode(message) {
      if (failDelivery) throw new Error("provider failure");
      mail.push(message);
    },
  },
});
const email = () => `test-${crypto.randomUUID()}@example.test`;
async function requestCode({ address = email(), authorization = null } = {}) {
  const result = await service.request(
    { ownerId: owner, email: address },
    authorization,
  );
  return {
    ...result,
    email: address.trim().toLowerCase(),
    code: mail.at(-1).code,
    authorization,
  };
}
async function verified(options) {
  const challenge = await requestCode(options);
  const proof = await service.verify({
    verificationId: challenge.verificationId,
    code: challenge.code,
  });
  return { ...challenge, proof };
}
const payload = (challenge, extra = {}) => ({
  owner_id: owner,
  client_id: "forged",
  client_email: challenge.email,
  client_name: "Guest",
  service_id: 1,
  service_name: "Cut, Wash",
  duration_minutes: 45,
  price: 50,
  appointment_date: "2026-10-10",
  appointment_time: "10:00",
  staff_id: null,
  staff_name: "No Preference",
  source: "owner",
  status: "Confirmed",
  ...extra,
});
async function record(id) {
  return (
    await db.query("select * from booking_verifications where id=$1", [id])
  ).rows[0];
}
const rejectsCode = (promise, code) =>
  assert.rejects(promise, (error) => error.code === code);

test("cryptographic six-digit generation and HMAC bind code to challenge; no plaintext stored", async () => {
  for (let i = 0; i < 50; i++) assert.match(generateBookingCode(), /^\d{6}$/);
  const c = await requestCode({ address: `  ${email().toUpperCase()}  ` });
  const row = await record(c.verificationId);
  assert.match(row.code_hash, /^[0-9a-f]{64}$/);
  assert.notEqual(row.code_hash, c.code);
  assert.equal(row.email, c.email);
  assert.equal(
    await cryptography.matchesCode(c.verificationId, c.code, row.code_hash),
    true,
  );
  assert.equal(
    await cryptography.matchesCode(crypto.randomUUID(), c.code, row.code_hash),
    false,
  );
});

test("correct OTP returns minimal proof, guest booking saves compatible row and consumes atomically", async () => {
  const c = await verified();
  assert.deepEqual(Object.keys(c.proof).sort(), [
    "expiresAt",
    "token",
    "verificationId",
  ]);
  assert.equal(
    (await record(c.verificationId)).proof_hash,
    await hashBookingProof(c.proof.token),
  );
  const rows = await service.createAppointment(payload(c), c.proof, null);
  assert.equal(rows.length, 1);
  assert.ok(rows[0].id);
  assert.equal(rows[0].client_id, null);
  assert.equal(rows[0].client_email, c.email);
  assert.equal(rows[0].source, "client");
  assert.equal(rows[0].status, "Pending");
  assert.equal(rows[0].service_name, "Cut, Wash");
  assert.ok((await record(c.verificationId)).consumed_at);
});

test("incorrect/malformed codes commit attempts; fifth failure locks even the correct code", async () => {
  const c = await requestCode();
  const wrong = c.code === "000000" ? "000001" : "000000";
  for (let i = 0; i < 5; i++)
    await rejectsCode(
      service.verify({
        verificationId: c.verificationId,
        code: i === 0 ? 123 : wrong,
      }),
      "INCORRECT_CODE",
    );
  assert.equal((await record(c.verificationId)).attempt_count, 5);
  await rejectsCode(
    service.verify({ verificationId: c.verificationId, code: c.code }),
    "TOO_MANY_ATTEMPTS",
  );
});

test("expired OTP and expired authorization are rejected", async () => {
  const c = await requestCode();
  await db.query(
    "update booking_verifications set expires_at=now()-interval '1 second' where id=$1",
    [c.verificationId],
  );
  await rejectsCode(
    service.verify({ verificationId: c.verificationId, code: c.code }),
    "EXPIRED_CODE",
  );
  const v = await verified();
  await db.query(
    "update booking_verifications set authorization_expires_at=now()-interval '1 second' where id=$1",
    [v.verificationId],
  );
  await rejectsCode(
    service.createAppointment(payload(v), v.proof, null),
    "VERIFICATION_REQUIRED",
  );
});

test("wrong email/salon/account and forged proof fail without consuming", async () => {
  const c = await verified({ authorization: "Bearer client" });
  await rejectsCode(
    service.createAppointment(
      payload(c, { client_email: "other@example.test" }),
      c.proof,
      c.authorization,
    ),
    "VERIFICATION_MISMATCH",
  );
  await rejectsCode(
    service.createAppointment(
      payload(c, { owner_id: otherOwner }),
      c.proof,
      c.authorization,
    ),
    "VERIFICATION_MISMATCH",
  );
  await rejectsCode(
    service.createAppointment(payload(c), c.proof, null),
    "VERIFICATION_MISMATCH",
  );
  await rejectsCode(
    service.createAppointment(
      payload(c),
      { ...c.proof, token: "0".repeat(64) },
      c.authorization,
    ),
    "VERIFICATION_REQUIRED",
  );
  assert.equal((await record(c.verificationId)).consumed_at, null);
});

test("verification cannot be reused or verified twice; racing requests save only once", async () => {
  const c = await verified();
  await rejectsCode(
    service.verify({ verificationId: c.verificationId, code: c.code }),
    "INVALID_VERIFICATION",
  );
  const results = await Promise.allSettled([
    service.createAppointment(payload(c), c.proof, null),
    service.createAppointment(payload(c), c.proof, null),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  await rejectsCode(
    service.createAppointment(payload(c), c.proof, null),
    "VERIFICATION_REQUIRED",
  );
  await rejectsCode(
    service.verify({ verificationId: c.verificationId, code: c.code }),
    "INVALID_VERIFICATION",
  );
});

test("failed INSERT rolls back consumption; same proof can succeed after correcting payload", async () => {
  const c = await verified();
  await rejectsCode(
    service.createAppointment(payload(c, { price: -1 }), c.proof, null),
    "23514",
  );
  assert.equal((await record(c.verificationId)).consumed_at, null);
  assert.equal(
    (await service.createAppointment(payload(c), c.proof, null)).length,
    1,
  );
});

test("authenticated identity and real reward trigger retain auth.uid, totals and redemption", async () => {
  const c = await verified({ authorization: "Bearer client" });
  const code = crypto.randomUUID().toUpperCase();
  await db.query(
    "insert into client_rewards(owner_id,client_id,code,percent_off,expires_at) values($1,$2,$3,10,now()+interval '1 day')",
    [owner, clientId, code],
  );
  // An AFTER trigger failure occurs after the real reward BEFORE trigger has
  // redeemed the code. Both reward and proof effects must still roll back.
  await db.exec(
    "create function test_booking_failure() returns trigger language plpgsql as $$ begin if new.notes = 'fail-after-reward' then raise exception 'Test insert failure'; end if; return new; end $$; create trigger test_booking_failure after insert on appointments for each row execute function test_booking_failure();",
  );
  await assert.rejects(
    service.createAppointment(
      payload(c, {
        notes: "fail-after-reward",
        reward_code: code,
        reward_service_ids: ["1", "2"],
      }),
      c.proof,
      c.authorization,
    ),
  );
  assert.equal((await record(c.verificationId)).consumed_at, null);
  assert.equal(
    (
      await db.query("select redeemed_at from client_rewards where code=$1", [
        code,
      ])
    ).rows[0].redeemed_at,
    null,
  );
  const rows = await service.createAppointment(
    payload(c, { reward_code: code, reward_service_ids: ["1", "2"] }),
    c.proof,
    c.authorization,
  );
  assert.equal(rows[0].client_id, clientId);
  assert.equal(rows[0].price, 45);
  assert.equal(rows[0].reward_discount, 5);
  assert.ok(
    (
      await db.query(
        "select redeemed_at from client_rewards where code=upper($1)",
        [code],
      )
    ).rows[0].redeemed_at,
  );
  assert.equal(
    (await db.query("select auth.role() as role, auth.uid() as id")).rows[0]
      .role,
    "service_role",
  );
  assert.equal((await db.query("select auth.uid() as id")).rows[0].id, null);
});

test("guest cannot claim an account reward; invalid reward rolls back proof", async () => {
  const guest = await verified();
  await rejectsCode(
    service.createAppointment(
      payload(guest, { reward_code: "ANY" }),
      guest.proof,
      null,
    ),
    "REWARD_ACCOUNT_REQUIRED",
  );
  const c = await verified({ authorization: "Bearer client" });
  await assert.rejects(
    service.createAppointment(
      payload(c, { reward_code: "INVALID", reward_service_ids: ["1"] }),
      c.proof,
      c.authorization,
    ),
  );
  assert.equal((await record(c.verificationId)).consumed_at, null);
  await service.createAppointment(payload(c), c.proof, c.authorization);
});

test("persistent email cooldown and hourly cap; failed deliveries count and cannot verify", async () => {
  const address = email();
  const c = await requestCode({ address });
  await rejectsCode(
    service.request({ ownerId: owner, email: address.toUpperCase() }, null),
    "RATE_LIMITED",
  );
  for (let i = 1; i < 5; i++) {
    await db.query(
      "update booking_verifications set created_at=now()-interval '2 minutes' where email=$1",
      [address],
    );
    await requestCode({ address });
  }
  await db.query(
    "update booking_verifications set created_at=now()-interval '2 minutes' where email=$1",
    [address],
  );
  await rejectsCode(
    service.request({ ownerId: owner, email: address }, null),
    "RATE_LIMITED",
  );
  failDelivery = true;
  const failedEmail = email();
  await rejectsCode(
    service.request({ ownerId: owner, email: failedEmail }, null),
    "DELIVERY_FAILED",
  );
  failDelivery = false;
  const failed = (
    await db.query("select * from booking_verifications where email=$1", [
      failedEmail,
    ])
  ).rows[0];
  assert.equal(failed.delivery_state, "failed");
  await rejectsCode(
    service.verify({ verificationId: failed.id, code: "000000" }),
    "INVALID_VERIFICATION",
  );
  assert.ok(c.verificationId);
});

test("Resend adapter sends booking email with onboarding sender and fails closed", async () => {
  assert.throws(() => createBookingEmailProvider({}).assertConfigured());
  let calls = 0;
  const provider = createBookingEmailProvider({
    apiKey: "resend_test_key",
    fetchImpl: async (_url, options) => {
      calls++;
      assert.equal(_url, "https://api.resend.com/emails");
      assert.equal(options.method, "POST");
      assert.equal(options.redirect, "error");
      assert.ok(options.headers.Authorization.startsWith("Bearer "));
      assert.equal(options.headers["Idempotency-Key"], "test-verification-id");
      assert.ok(options.signal);
      const message = JSON.parse(options.body);
      assert.equal(message.from, "Lunara <onboarding@resend.dev>");
      assert.deepEqual(message.to, ["client@example.test"]);
      assert.match(message.text, /Lunara/);
      assert.match(message.text, /123456/);
      assert.match(message.text, /confirm your booking/);
      assert.match(message.text, /10 minutes/);
      assert.match(message.text, /If you didn't request this booking/);
      assert.match(message.html, /123456/);
      assert.match(message.html, /If you didn't request this booking/);
      return new Response("failure", { status: 500 });
    },
  });
  await assert.rejects(
    provider.sendCode({
      email: "client@example.test",
      code: "123456",
      verificationId: "test-verification-id",
      expiresInMinutes: 10,
    }),
    /delivery failed/,
  );
  assert.equal(calls, 1);

  const accepted = createBookingEmailProvider({
    apiKey: "resend_test_key",
    fetchImpl: async () => new Response("", { status: 200 }),
  });
  await assert.doesNotReject(
    accepted.sendCode({
      email: "client@example.test",
      code: "012345",
      verificationId: crypto.randomUUID(),
      expiresInMinutes: 10,
    }),
  );
});

test("optional auth accepts guest/SDK anon key but validates any supplied user JWT", async () => {
  const getUser = createOptionalBookingIdentity(
    () => ({
      auth: {
        getUser: async (token) => ({
          data: { user: token === "valid" ? { id: clientId } : null },
          error: null,
        }),
      },
    }),
    "anon-key",
  );
  assert.equal(await getUser(null), null);
  assert.equal(await getUser("Bearer anon-key"), null);
  assert.equal((await getUser("Bearer valid")).id, clientId);
  await rejectsCode(getUser("Bearer forged"), "INVALID_AUTH");
});

test("OTP boundary denies forged flags, accepts guest proof, and never calls compatibility insertion", async () => {
  const handler = createBookingHandler({
    publicMode: "otp",
    createUserClient() {
      assert.fail("Unexpected direct insert");
    },
    createVerifiedAppointment: service.createAppointment,
  });
  const request = (body) =>
    handler(
      new Request("https://test/create-appointment/public", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    );
  assert.equal(
    (
      await request({
        appointment: payload({ email: email() }),
        skipVerification: true,
        mode: "owner",
        source: "owner",
      })
    ).status,
    403,
  );
  const c = await verified();
  const response = await request({
    appointment: payload(c),
    verification: c.proof,
  });
  assert.equal(response.status, 200);
  assert.ok((await response.json()).data[0].id);
  assert.equal(
    (await request({ appointment: payload(c), verification: c.proof })).status,
    400,
  );
});

test("verification endpoint returns minimal data, no-store and sanitized failures", async () => {
  const handler = createVerificationHandler({
    getService: async () => service,
  });
  const response = await handler(
    new Request("https://test/booking-verification/request", {
      method: "POST",
      body: JSON.stringify({ ownerId: owner, email: email() }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(Object.keys((await response.json()).data).sort(), [
    "expiresAt",
    "verificationId",
  ]);
});

test("proof travels outside appointment payload and can never use direct transport", async () => {
  const proof = { verificationId: crypto.randomUUID(), token: "a".repeat(64) };
  const direct = createAppointmentTransport({
    from() {
      assert.fail("Direct write");
    },
  });
  assert.equal(
    (await direct("public", {}, proof)).error.code,
    "BOOKING_CONFIGURATION",
  );
  const edge = createAppointmentTransport(
    {
      functions: {
        async invoke(_path, args) {
          assert.deepEqual(args.body.verification, proof);
          assert.deepEqual(args.body.appointment, {});
          return { data: { data: [{ id: 1 }], error: null }, error: null };
        },
      },
    },
    "edge",
  );
  assert.equal((await edge("public", {}, proof)).data[0].id, 1);
});

test("browser roles cannot select OTP hashes or call privileged proof RPCs", async () => {
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`set role ${role}`);
    await assert.rejects(
      db.query("select code_hash from booking_verifications"),
      (e) => e.code === "42501",
    );
    await assert.rejects(
      db.query("select verify_booking_code($1,true,$2)", [
        crypto.randomUUID(),
        "0".repeat(64),
      ]),
      (e) => e.code === "42501",
    );
    await assert.rejects(
      db.query("select create_verified_public_appointment($1,$2,null,'{}')", [
        crypto.randomUUID(),
        "0".repeat(64),
      ]),
      (e) => e.code === "42501",
    );
    await db.exec("reset role");
  }
});

test("salon-wide hourly cap cannot be evaded with new email identities", async () => {
  const before = Number(
    (
      await db.query(
        "select count(*) as n from booking_verifications where owner_id=$1 and created_at>now()-interval '1 hour'",
        [owner],
      )
    ).rows[0].n,
  );
  const filler = 100 - before;
  await db.query(
    "insert into booking_verifications(id,owner_id,email,code_hash,expires_at) select gen_random_uuid(),$1,'cap-'||n||'@example.test',repeat('a',64),now()+interval '10 minutes' from generate_series(1,$2::integer) n",
    [owner, filler],
  );
  await rejectsCode(
    service.request({ ownerId: owner, email: email() }, null),
    "RATE_LIMITED",
  );
  await db.exec(
    "delete from booking_verifications where email like 'cap-%@example.test'",
  );
});

test("owner remains OTP-independent even when public enforcement is on", async () => {
  const client = {
    auth: {
      getUser: async () => ({ data: { user: { id: owner } }, error: null }),
    },
    from(table) {
      if (table === "profiles") {
        const q = {
          select() {
            return q;
          },
          eq() {
            return q;
          },
          maybeSingle: async () => ({
            data: { id: owner, role: "owner" },
            error: null,
          }),
        };
        return q;
      }
      return {
        insert: (p) => ({
          select: async () => ({ data: [{ ...p, id: 1 }], error: null }),
        }),
      };
    },
  };
  const handler = createBookingHandler({
    publicMode: "otp",
    createUserClient: () => client,
    createVerifiedAppointment() {
      assert.fail("Owner must not use OTP");
    },
  });
  const response = await handler(
    new Request("https://test/create-appointment/owner", {
      method: "POST",
      headers: { Authorization: "Bearer valid-owner" },
      body: JSON.stringify({ appointment: { owner_id: owner } }),
    }),
  );
  assert.equal(response.status, 200);
});

test("manual cutover blocks client INSERT and self-claimed owner while preserving real owner and verified booking", async () => {
  await db.exec(
    await readFile(
      new URL("../manual/enable_booking_otp_rls.sql", import.meta.url),
      "utf8",
    ),
  );
  await db.exec(
    `set role authenticated; select set_config('request.jwt.claim.sub','${clientId}',false);`,
  );
  await assert.rejects(
    db.query("insert into appointments(owner_id,client_id) values($1,$2)", [
      owner,
      clientId,
    ]),
    (e) => e.code === "42501",
  );
  await assert.rejects(
    db.query("insert into appointments(owner_id,client_id) values($1,$1)", [
      clientId,
    ]),
    (e) => e.code === "42501",
  );
  await db.exec(`select set_config('request.jwt.claim.sub','${owner}',false);`);
  await db.query(
    "insert into appointments(owner_id,client_name) values($1,'Walk-in')",
    [owner],
  );
  await serverContext();
  const c = await verified();
  assert.equal(
    (await service.createAppointment(payload(c), c.proof, null)).length,
    1,
  );
  assert.equal(
    (
      await db.query(
        "select count(*) as n from pg_policies where tablename='appointments' and cmd in ('SELECT','UPDATE','DELETE')",
      )
    ).rows[0].n,
    4,
  );
});
