import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";
import { getSafeSocialLinks } from "../../src/Shared/lib/socialLinks.js";

test("existing public-salon handler returns saved links on cache miss and hit", async () => {
  const source = await readFile(new URL("../functions/public-salon/index.ts", import.meta.url), "utf8");
  const code = stripTypeScriptTypes(source.replace(/^import .*;\r?\n/gm, ""));
  const links = [{ title: "Facebook", url: "https://about.google/" }, { title: "google", url: "https://google/" }];
  const records = {
    profiles: { id: "owner-one", full_name: "Salon", salon_slug: "salon-one" },
    services: [{ id: 1, name: "Haircut" }],
    staff: [{ id: 2, name: "Stylist" }],
    working_hours: [{ day_of_week: 1, is_open: true }],
    settings: { currency_code: "TRY", external_website_url: null, social_links: { links } },
  };
  let handler, cached, settingsError = null;
  const queries = [];
  const client = { from(table) {
    const query = { table, filters: [] };
    queries.push(query);
    const chain = {
      select(fields) { query.fields = fields; return chain; },
      eq(key, value) { query.filters.push([key, value]); return chain; },
      order() { return chain; },
      maybeSingle() { return chain; },
      then(resolve) { return Promise.resolve({ data: records[table], error: table === "settings" ? settingsError : null }).then(resolve); },
    };
    return chain;
  } };
  const redis = { get: async () => cached, set: async (key, value) => { assert.equal(key, "salon:salon-one:public"); cached = value; } };
  new Function("Deno", "createClient", "Redis", "getSafeSocialLinks", code)(
    { env: { get: () => "test" }, serve: fn => { handler = fn; } },
    () => client, function () { return redis; }, getSafeSocialLinks,
  );
  const request = () => handler(new Request("https://example.test/functions/v1/public-salon?slug=salon-one"));
  cached = { success: true, settings: { currencyCode: "TRY" } };
  let response = await request();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("X-Lunara-Cache"), "MISS");
  const data = await response.json();
  assert.deepEqual(data.settings, { currencyCode: "TRY", externalWebsiteUrl: null, socialLinks: links });
  assert.deepEqual(data.services, records.services);
  assert.deepEqual(data.staff, records.staff);
  assert.deepEqual(data.workingHours, records.working_hours);
  assert.equal(data.salon.id, "owner-one");
  const settingsQuery = queries.find(query => query.table === "settings");
  assert.match(settingsQuery.fields, /social_links/);
  assert.deepEqual(settingsQuery.filters, [["owner_id", "owner-one"]]);
  const count = queries.length;
  response = await request();
  assert.equal(response.headers.get("X-Lunara-Cache"), "HIT");
  assert.deepEqual(await response.json(), data);
  assert.equal(queries.length, count);
  cached = null;
  records.settings.social_links = {};
  response = await request();
  assert.deepEqual((await response.json()).settings.socialLinks, []);
  cached = null;
  settingsError = { message: "unavailable" };
  assert.equal((await request()).status, 500);
  assert.equal(cached, null);
  assert.equal((await handler(new Request("https://example.test/functions/v1/public-salon"))).status, 400);
  assert.equal((await handler(new Request("https://example.test/functions/v1/public-salon", { method: "POST" }))).status, 405);
});
