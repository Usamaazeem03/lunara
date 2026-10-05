-- Run this whole file in Supabase > SQL Editor.
-- Owner reads/updates use the same existing settings RLS as the website field.
begin;

alter table public.settings
  add column if not exists social_links jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_catalog.pg_constraint
    where conname = 'settings_social_links_object'
      and conrelid = 'public.settings'::regclass
  ) then
    alter table public.settings add constraint settings_social_links_object
      check (jsonb_typeof(social_links) = 'object');
  end if;
end;
$$;

comment on column public.settings.social_links is
  'Public salon profile URLs: instagram, facebook, tiktok, youtube, whatsapp, x. Empty object means no links.';

-- Expose only the six public links for an owner salon, not the settings row.
-- The deployed public-salon Edge Function does not need to be changed.
create or replace function public.get_public_salon_social_links(salon_slug text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_object_agg(link.key, link.value), '{}'::jsonb)
  from public.settings as settings
  join public.profiles as profile on profile.id = settings.owner_id
  cross join lateral jsonb_each(settings.social_links) as link
  where profile.salon_slug = $1
    and profile.role = 'owner'
    and link.key in ('instagram', 'facebook', 'tiktok', 'youtube', 'whatsapp', 'x')
    and jsonb_typeof(link.value) = 'string'
    and length(link.value #>> '{}') <= 2048
    and (link.value #>> '{}') ~* '^https?://[^[:space:]]+$';
$$;

revoke all on function public.get_public_salon_social_links(text)
  from public, anon, authenticated;
grant execute on function public.get_public_salon_social_links(text)
  to anon, authenticated, service_role;

notify pgrst, 'reload schema';
commit;
