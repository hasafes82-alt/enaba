-- إنابة (Enaba) — مكتبة النماذج القانونية الرقمية (F7 — SPEC.md §5/§6/§8/§14)
-- أول مصدر دخل فعلي للمنصة. التسليم يدوي عبر واتساب في هذا الإصدار — بلا بوابة
-- دفع مدمجة بعد، قرار مؤجَّل عمدًا وموثَّق في SPEC.md §8/F7.

create table legal_forms (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  description text,
  price_egp numeric(6, 2) not null check (price_egp >= 0),
  file_path text not null,
  file_type text not null default 'docx' check (file_type in ('docx', 'pdf')),
  is_published boolean not null default false,
  download_count int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_legal_forms_category_published on legal_forms (category) where is_published;

create table legal_form_orders (
  id bigserial primary key,
  form_id uuid not null references legal_forms(id) on delete cascade,
  buyer_name text,
  buyer_whatsapp text not null check (buyer_whatsapp ~ '^\+20\d{10}$'),
  status text not null default 'pending' check (status in ('pending', 'paid', 'delivered', 'cancelled')),
  admin_note text,
  created_at timestamptz not null default now()
);
create index idx_legal_form_orders_status_time on legal_form_orders (status, created_at);

alter table legal_forms       enable row level security;
alter table legal_form_orders enable row level security;

create policy "public reads published legal forms" on legal_forms
  for select using (is_published);

create policy "admin manages legal forms" on legal_forms
  for all using (is_admin()) with check (is_admin());

-- طلب الشراء مفتوح بلا تسجيل دخول — التحديد يقع في route handler (rate_limit_events)،
-- نفس مبدأ perk_redemptions/reports.
create policy "anyone creates legal form order" on legal_form_orders
  for insert with check (true);

create policy "admin manages legal form orders" on legal_form_orders
  for all using (is_admin()) with check (is_admin());

-- ============================================================================
-- Storage — bucket خاص تمامًا، رفع وقراءة للمشرف فقط (نفس نمط carnets)
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'legal-forms',
  'legal-forms',
  false,
  10485760,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
);

create policy "admin manages legal form files" on storage.objects
  for all using (bucket_id = 'legal-forms' and is_admin())
  with check (bucket_id = 'legal-forms' and is_admin());
