-- إنابة (Enaba) — اشتراكات Web Push الفعلية (endpoint/keys من المتصفح)
-- تختلف عن notification_subscriptions (تفضيلات الفلترة: أي محافظة/محكمة/نوع)
-- SPEC.md §9

create table push_subscriptions (
  id bigserial primary key,
  lawyer_id uuid not null references lawyer_profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);
create index idx_push_subscriptions_lawyer_id on push_subscriptions (lawyer_id);

alter table push_subscriptions enable row level security;

create policy "owner manages own push subscription" on push_subscriptions
  for all using (lawyer_id = (select auth.uid()))
  with check (lawyer_id = (select auth.uid()));

create policy "admin manages push subscriptions" on push_subscriptions
  for all using (is_admin()) with check (is_admin());
