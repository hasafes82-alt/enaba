-- تصحيح فوري: السياستان السابقتان على push_subscriptions (0009) كانتا كلتاهما
-- "for all" (owner + admin) على نفس الجدول، وهو نفس نمط multiple_permissive_policies
-- الذي وثّقناه كقاعدة إلزامية في SPEC.md §6 بعد 0004_rls_performance.sql.
-- توحيد إلى سياسة واحدة لكل أمر.

drop policy "owner manages own push subscription" on push_subscriptions;
drop policy "admin manages push subscriptions" on push_subscriptions;

create policy "read own or admin" on push_subscriptions
  for select using (lawyer_id = (select auth.uid()) or is_admin());
create policy "insert own or admin" on push_subscriptions
  for insert with check (lawyer_id = (select auth.uid()) or is_admin());
create policy "update own or admin" on push_subscriptions
  for update using (lawyer_id = (select auth.uid()) or is_admin())
  with check (lawyer_id = (select auth.uid()) or is_admin());
create policy "delete own or admin" on push_subscriptions
  for delete using (lawyer_id = (select auth.uid()) or is_admin());
