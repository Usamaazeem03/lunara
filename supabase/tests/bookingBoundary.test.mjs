import assert from "node:assert/strict";
import test from "node:test";
import { createBookingHandler } from "../functions/create-appointment/handler.js";
import { createAppointmentTransport } from "../../src/services/appointmentTransport.js";

const appointment = {
  owner_id: "salon-owner",
  client_id: "salon-client",
  client_name: "Walk-in",
  client_email: "client@example.test",
  client_phone: "+905551234567",
  service_id: 1,
  service_name: "Cut, Wash",
  staff_id: null,
  staff_name: "No Preference",
  appointment_date: "2026-10-10",
  appointment_time: "10:00",
  duration_minutes: 45,
  price: 50,
  status: "Confirmed",
  notes: "Keep this note",
  payment_option: "Pay at Salon",
  payment_method: null,
  source: "owner",
};

function fixture({
  userId = "salon-owner",
  role = "owner",
  authError = null,
  profileError = null,
  insertError = null,
} = {}) {
  const calls = { tokens: [], filters: [], inserts: [], authorizations: [] };
  const client = {
    auth: {
      async getUser(token) {
        calls.tokens.push(token);
        return {
          data: { user: userId ? { id: userId } : null },
          error: authError,
        };
      },
    },
    from(table) {
      if (table === "profiles") {
        const query = {
          select() {
            return query;
          },
          eq(key, value) {
            calls.filters.push([key, value]);
            return query;
          },
          async maybeSingle() {
            return { data: { id: userId, role }, error: profileError };
          },
        };
        return query;
      }
      assert.equal(table, "appointments");
      return {
        insert(payload) {
          calls.inserts.push(payload);
          return {
            async select(fields) {
              assert.equal(fields, "*");
              return {
                data: insertError
                  ? null
                  : [{ ...payload, id: "saved-id", reward_discount: 5 }],
                error: insertError,
              };
            },
          };
        },
      };
    },
  };
  const handler = createBookingHandler({
    createUserClient(authorization) {
      calls.authorizations.push(authorization);
      return client;
    },
  });
  async function request(
    path = "owner",
    payload = appointment,
    authorization = "Bearer real-session",
  ) {
    const response = await handler(
      new Request(
        `https://example.test/functions/v1/create-appointment/${path}`,
        {
          method: "POST",
          headers: authorization ? { Authorization: authorization } : {},
          body: JSON.stringify({
            appointment: payload,
            mode: "owner",
            skipVerification: true,
          }),
        },
      ),
    );
    return { status: response.status, body: await response.json() };
  }
  return { calls, handler, request };
}

test("owner requires Auth validation and matching owner profile; preserves saved row and rewards", async () => {
  const f = fixture();
  const payload = {
    ...appointment,
    reward_code: "REWARD",
    reward_service_ids: ["1", "2"],
    reward_profile_id: "salon-client",
  };
  const result = await f.request("owner", payload);
  assert.equal(result.status, 200);
  assert.equal(result.body.error, null);
  assert.deepEqual(f.calls.inserts, [payload]);
  assert.deepEqual(f.calls.tokens, ["real-session"]);
  assert.deepEqual(f.calls.authorizations, ["Bearer real-session"]);
  assert.deepEqual(f.calls.filters, [
    ["id", "salon-owner"],
    ["role", "owner"],
  ]);
  assert.equal(result.body.data[0].id, "saved-id");
  assert.equal(result.body.data[0].reward_discount, 5);
});

test("owner route denies other salon, even with ownership/verification flags", async () => {
  const f = fixture({ userId: "different-owner" });
  const result = await f.request("owner", {
    ...appointment,
    isOwner: true,
    skipVerification: true,
    mode: "owner",
  });
  assert.equal(result.status, 403);
  assert.deepEqual(f.calls.inserts, []);
});

test("matching JWT subject without owner role is denied", async () => {
  const f = fixture({ role: "client" });
  assert.equal((await f.request()).status, 403);
  assert.deepEqual(f.calls.inserts, []);
});

test("ownership lookup failure fails closed", async () => {
  const f = fixture({ profileError: { message: "unavailable" } });
  assert.equal((await f.request()).status, 403);
  assert.deepEqual(f.calls.inserts, []);
});

for (const path of ["owner", "public"]) {
  test(`${path} rejects missing, malformed, invalid and expired credentials before INSERT`, async () => {
    for (const authorization of [
      null,
      "Basic credentials",
      "Bearer",
      "Bearer one two",
    ]) {
      const f = fixture();
      assert.equal(
        (await f.request(path, appointment, authorization)).status,
        401,
      );
      assert.equal(f.calls.tokens.length, 0);
      assert.equal(f.calls.inserts.length, 0);
    }
    for (const auth of [
      { userId: null },
      { authError: { message: "expired" } },
    ]) {
      const f = fixture(auth);
      assert.equal((await f.request(path)).status, 401);
      assert.equal(f.calls.inserts.length, 0);
    }
  });
}

test("public compatibility path binds client identity to JWT; forged owner fields grant nothing", async () => {
  const f = fixture({ userId: "authenticated-client", role: "client" });
  const result = await f.request("public", {
    ...appointment,
    client_id: "victim",
    source: "owner",
    isOwner: true,
    skipVerification: true,
    id: "forged-id",
    mode: "owner",
    email_verified: true,
    reward_profile_id: "victim-profile",
    reward_code: "REWARD",
    reward_service_ids: ["1", "2"],
  });
  assert.equal(result.status, 200);
  const saved = result.body.data[0];
  assert.equal(saved.client_id, "authenticated-client");
  assert.equal(saved.source, "client");
  assert.equal(saved.status, "Pending");
  assert.equal(saved.service_name, "Cut, Wash");
  assert.deepEqual(saved.reward_service_ids, ["1", "2"]);
  for (const key of [
    "reward_profile_id",
    "isOwner",
    "skipVerification",
    "mode",
    "email_verified",
  ]) {
    assert.equal(Object.hasOwn(saved, key), false);
  }
  assert.equal(f.calls.filters.length, 0);
});

test("owner source is assigned by the authorized route and null client retry remains supported", async () => {
  const f = fixture();
  const result = await f.request("owner", {
    ...appointment,
    source: "client",
    client_id: null,
  });
  assert.equal(result.body.data[0].source, "owner");
  assert.equal(result.body.data[0].client_id, null);
});

for (const code of ["23503", "42P01", "42501"]) {
  test(`database ${code} error survives HTTP with code, details and hint`, async () => {
    const error = {
      code,
      message: "Database rejection",
      details: "appointments_client_id_fkey",
      hint: "existing hint",
    };
    const f = fixture({ insertError: error });
    const result = await f.request();
    assert.equal(result.status, 400);
    assert.deepEqual(result.body, { data: null, error });
  });
}

test("invalid routes and payloads never write; CORS preflight does not require auth", async () => {
  const f = fixture();
  assert.equal((await f.request("unknown")).status, 404);
  for (const payload of [null, [], {}, { owner_id: 5 }]) {
    assert.equal((await f.request("owner", payload)).status, 400);
  }
  const url = "https://example.test/functions/v1/create-appointment/owner";
  assert.equal(
    (
      await f.handler(
        new Request(url, { method: "POST", body: "invalid json" }),
      )
    ).status,
    400,
  );
  assert.equal((await f.handler(new Request(url))).status, 405);
  const preflight = await f.handler(new Request(url, { method: "OPTIONS" }));
  assert.equal(preflight.status, 204);
  assert.match(
    preflight.headers.get("Access-Control-Allow-Headers"),
    /authorization/,
  );
  assert.deepEqual(f.calls.inserts, []);
});

test("unexpected failures are sanitized", async () => {
  const handler = createBookingHandler({
    createUserClient() {
      throw new Error("secret configuration");
    },
  });
  const response = await handler(
    new Request("https://example.test/create-appointment/owner", {
      method: "POST",
      body: JSON.stringify({ appointment }),
    }),
  );
  assert.equal(response.status, 500);
  assert.doesNotMatch(await response.text(), /secret configuration/);
});

test("edge transport preserves rows, route and complete reward payload", async () => {
  const response = { data: [{ ...appointment, id: "saved" }], error: null };
  const client = {
    functions: {
      async invoke(path, options) {
        assert.equal(path, "create-appointment/owner");
        assert.deepEqual(options, { method: "POST", body: { appointment } });
        return { data: response, error: null };
      },
    },
    from() {
      assert.fail("Must not fall back to a direct write");
    },
  };
  assert.deepEqual(
    await createAppointmentTransport(client, "edge")("owner", appointment),
    response,
  );
});

test("edge transport unwraps DB errors and never falls back for auth, network or invalid responses", async () => {
  const dbError = {
    code: "23503",
    message: "Client link failed",
    details: "appointments_client_id_fkey",
    hint: "hint",
  };
  const forbidden = { code: "OWNER_REQUIRED", message: "Forbidden" };
  const networkError = { message: "Network unavailable" };
  for (const error of [dbError, forbidden]) {
    const client = {
      functions: {
        async invoke() {
          return {
            data: null,
            error: {
              context: new Response(JSON.stringify({ data: null, error }), {
                status: 400,
              }),
            },
          };
        },
      },
      from() {
        assert.fail("Direct fallback");
      },
    };
    assert.deepEqual(
      await createAppointmentTransport(client, "edge")("public", appointment),
      { data: null, error },
    );
  }
  for (const response of [
    { data: null, error: networkError },
    { data: {}, error: null },
  ]) {
    const client = {
      functions: {
        async invoke() {
          return response;
        },
      },
      from() {
        assert.fail("Direct fallback");
      },
    };
    const result = await createAppointmentTransport(client, "edge")(
      "public",
      appointment,
    );
    assert.equal(result.data, null);
    assert.ok(result.error);
  }
});

test("direct staging transport preserves payload and row-array contract", async () => {
  let count = 0;
  const rows = [{ ...appointment, id: "saved" }];
  const client = {
    from(table) {
      count++;
      assert.equal(table, "appointments");
      return {
        insert(payload) {
          assert.deepEqual(payload, appointment);
          return {
            async select(fields) {
              assert.equal(fields, "*");
              return { data: rows, error: null };
            },
          };
        },
      };
    },
  };
  assert.deepEqual(
    await createAppointmentTransport(client)("owner", appointment),
    { data: rows, error: null },
  );
  assert.equal(count, 1);
  assert.equal(
    (await createAppointmentTransport(client, "typo")("owner", appointment))
      .error.code,
    "BOOKING_CONFIGURATION",
  );
  assert.equal(count, 1);
});
