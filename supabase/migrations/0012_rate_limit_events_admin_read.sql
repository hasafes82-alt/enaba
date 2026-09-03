-- إتاحة قراءة سجل تحديد المعدل للمشرف فقط — نفس نمط contact_reveals
-- (SPEC.md §6)، للتدقيق عند التحقيق في إساءة استخدام.
create policy "admin reads rate_limit_events" on rate_limit_events
  for select using (is_admin());
