import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { getSafeSocialLinks, normalizeSocialUrl } from "../../src/Shared/lib/socialLinks.js";

test("social links accept web URLs and omit unsafe, empty, or unsupported values", () => {
  assert.equal(normalizeSocialUrl(" https://instagram.com/salon "), "https://instagram.com/salon");
  for (const value of ["", "javascript:alert(1)", "data:text/html,test", "ftp://example.com", "https://user:pass@example.com", "https://example.com/a b", "not a link", null]) {
    assert.equal(normalizeSocialUrl(value), null);
  }
  assert.deepEqual(getSafeSocialLinks({ instagram: "https://instagram.com/salon", facebook: "", x: "javascript:alert(1)", private: "https://example.com" }), [{ title: "Instagram", url: "https://instagram.com/salon" }]);
  assert.deepEqual(getSafeSocialLinks({}), []);
});

test("custom saved titles and URLs survive the public response and invalid entries are omitted", () => {
  const links = [{ title: "Facebook", url: "https://about.google/" }, { title: "google", url: "https://google/" }];
  assert.deepEqual(getSafeSocialLinks({ links }), links);
  assert.deepEqual(getSafeSocialLinks(links), links);
  assert.deepEqual(getSafeSocialLinks({ links: [...links, null, { title: "Bad", url: "javascript:alert(1)" }, { title: " ", url: "https://example.com" }] }), links);
});

test("all social link editor labels are translated in both languages", async () => {
  const component = await readFile(new URL("../../src/features/settings/SocialLinks.jsx", import.meta.url), "utf8");
  for (const language of ["en", "tr"]) {
    const locale = JSON.parse(await readFile(new URL(`../../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
    for (const [, key] of component.matchAll(/settings\.socialLinks\.(\w+)/g)) {
      assert.equal(typeof locale.settings.socialLinks[key], "string", `${language}: ${key}`);
    }
  }
});

test("SQL migration preserves settings and restricts public output to social links", async (t) => {
  const db = new PGlite();
  const owner = "11111111-1111-4111-8111-111111111111";
  const other = "22222222-2222-4222-8222-222222222222";
  const client = "33333333-3333-4333-8333-333333333333";
  try {
    await db.exec(`
      create role anon;
      create role authenticated;
      create role service_role;
      create table public.profiles (id uuid primary key, salon_slug text unique, role text);
      create table public.settings (owner_id uuid unique references public.profiles(id), currency_code text, external_website_url text);
      insert into public.profiles values ('${owner}', 'salon-one', 'owner'), ('${other}', 'salon-two', 'owner'), ('${client}', 'client-profile', 'client');
      insert into public.settings values ('${owner}', 'TRY', 'https://salon.example'), ('${other}', 'USD', null), ('${client}', 'EUR', null);
      alter table public.settings enable row level security;
      grant select, update on public.settings to authenticated;
      create policy owner_settings on public.settings to authenticated
        using (owner_id::text = current_setting('request.jwt.claim.sub', true))
        with check (owner_id::text = current_setting('request.jwt.claim.sub', true));
    `);
    const migration = await readFile(new URL("../migrations/202610030001_salon_social_links.sql", import.meta.url), "utf8");
    await db.exec(migration);
    await db.exec(migration);

    await t.test("migration is repeatable and preserves existing values", async () => {
      const { rows } = await db.query("select currency_code, external_website_url, social_links from public.settings where owner_id=$1", [owner]);
      assert.deepEqual(rows[0], { currency_code: "TRY", external_website_url: "https://salon.example", social_links: {} });
      await assert.rejects(db.query("update public.settings set social_links='[]'::jsonb where owner_id=$1", [owner]), /settings_social_links_object/);
    });

    await t.test("owner can add and remove links without editing another salon or other settings", async () => {
      await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub','${owner}',false);`);
      const links = { instagram: "https://instagram.com/salon-one", whatsapp: "https://wa.me/905551234567" };
      const saved = await db.query("update public.settings set social_links=$1::jsonb where owner_id=$2 returning social_links, currency_code, external_website_url", [JSON.stringify(links), owner]);
      assert.deepEqual(saved.rows[0], { social_links: links, currency_code: "TRY", external_website_url: "https://salon.example" });
      const denied = await db.query("update public.settings set social_links='{}'::jsonb where owner_id=$1 returning owner_id", [other]);
      assert.equal(denied.rows.length, 0);
      const cleared = await db.query("update public.settings set social_links='{}'::jsonb where owner_id=$1 returning social_links", [owner]);
      assert.deepEqual(cleared.rows[0].social_links, {});
      await db.exec("reset role");
    });

    await t.test("anonymous RPC returns only safe public fields and cannot read settings", async () => {
      await db.query("update public.settings set social_links=$1::jsonb where owner_id=$2", [JSON.stringify({ instagram: "https://instagram.com/salon-one", x: "javascript:alert(1)", facebook: { private: true }, internal_url: "https://private.example", youtube: "", whatsapp: "https://wa.me/905551234567" }), owner]);
      await db.query("update public.settings set social_links=$1::jsonb where owner_id=$2", [JSON.stringify({ instagram: "https://instagram.com/client" }), client]);
      await db.exec("set role anon");
      await assert.rejects(db.query("select * from public.settings"), /permission denied/);
      const result = await db.query("select public.get_public_salon_social_links($1) as links", ["salon-one"]);
      assert.deepEqual(result.rows[0].links, { instagram: "https://instagram.com/salon-one", whatsapp: "https://wa.me/905551234567" });
      for (const slug of ["missing", "salon-two", "client-profile", "salon-one' OR true --"]) {
        const response = await db.query("select public.get_public_salon_social_links($1) as links", [slug]);
        assert.deepEqual(response.rows[0].links, {});
      }
      await db.exec("reset role");
    });
  } finally {
    await db.close();
  }
});
