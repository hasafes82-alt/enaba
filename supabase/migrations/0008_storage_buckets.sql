-- إنابة (Enaba) — Storage buckets وسياساتها — SPEC.md §6 (التخزين)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('carnets', 'carnets', false, 5242880, array['image/jpeg','image/png','image/webp']),
  ('avatars', 'avatars', true, 2097152, array['image/jpeg','image/png','image/webp']),
  ('sponsors', 'sponsors', true, 2097152, array['image/jpeg','image/png','image/webp']);

-- carnets: خاص تمامًا. المستخدم يرفع صورته فقط (المسار = <user_id>/...)، ولا
-- يقرأها أحد عبر RLS مباشرة — تُعرض للمشرف حصريًا عبر رابط موقّع من service_role.
create policy "owner uploads own carnet" on storage.objects
  for insert with check (
    bucket_id = 'carnets'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "owner replaces own carnet" on storage.objects
  for update using (
    bucket_id = 'carnets'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "admin reads carnets" on storage.objects
  for select using (bucket_id = 'carnets' and is_admin());

create policy "admin deletes carnets" on storage.objects
  for delete using (bucket_id = 'carnets' and is_admin());

-- avatars: عام. المستخدم يرفع/يحدّث صورته فقط، وأي زائر يقرأ.
create policy "public reads avatars" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "owner uploads own avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "owner replaces own avatar" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

-- sponsors: عام. المشرف فقط يرفع بانرات الرعاة.
create policy "public reads sponsor banners" on storage.objects
  for select using (bucket_id = 'sponsors');

create policy "admin manages sponsor banners" on storage.objects
  for all using (bucket_id = 'sponsors' and is_admin())
  with check (bucket_id = 'sponsors' and is_admin());
