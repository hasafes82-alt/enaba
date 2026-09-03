-- إنابة (Enaba) — سجل تحديد معدل عام (غير مخصَّص لكشف الأرقام مثل
-- contact_reveals) — يُستخدم أولًا للحد من محاولات التسجيل من نفس البصمة
-- (3/يوم — SPEC.md §6)، وقابل لإعادة الاستخدام لأي إجراء مستقبلي مشابه.

create table rate_limit_events (
  id bigserial primary key,
  action text not null,
  viewer_hash text not null,
  created_at timestamptz not null default now()
);
create index idx_rate_limit_events_lookup on rate_limit_events (action, viewer_hash, created_at);

alter table rate_limit_events enable row level security;
-- لا سياسات عامة عمدًا — يُكتب ويُقرأ حصريًا عبر service_role من Route
-- Handlers الخادمية، لمنع أي تلاعب من العميل بحدود المعدل (نفس مبدأ
-- contact_reveals في SPEC.md §6).
