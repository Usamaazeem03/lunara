-- Run in the Supabase SQL Editor before using staff image uploads.
alter table public.staff add column if not exists image text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'Staff_images', 'Staff_images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists "Staff images public read" on storage.objects;
create policy "Staff images public read" on storage.objects
for select to public using (bucket_id = 'Staff_images');

drop policy if exists "Owners upload staff images" on storage.objects;
create policy "Owners upload staff images" on storage.objects
for insert to authenticated with check (
  bucket_id = 'Staff_images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Owners delete staff images" on storage.objects;
create policy "Owners delete staff images" on storage.objects
for delete to authenticated using (
  bucket_id = 'Staff_images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
