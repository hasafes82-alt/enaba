-- إنابة (Enaba) — الهجرة الأساسية
-- المرجع: SPEC.md §5 (مخطط قاعدة البيانات)
-- يبني: الامتدادات، الأنواع، الجداول، الفهارس، الدوال، المشغّلات، العروض.
-- سياسات RLS في هجرة منفصلة: 0002_rls.sql

create extension if not exists pgcrypto;

-- ============================================================================
-- الأنواع المعدّدة (Enums) — SPEC.md §5
-- ============================================================================

create type registration_degree as enum ('general', 'primary', 'appeal', 'cassation');
create type verification_status as enum ('pending', 'verified', 'rejected', 'suspended');
create type delegation_type as enum (
  'session_attendance',
  'document_copying',
  'certificate_issuing',
  'filing_claim',
  'bailiff_notice',
  'case_inquiry',
  'prosecution_hearing'
);
create type request_status as enum ('open', 'assigned', 'completed', 'cancelled', 'expired');
create type ad_slot as enum ('top_leaderboard', 'in_feed', 'sticky_footer', 'board_inline');
create type ad_event_type as enum ('impression', 'click');
create type user_role as enum ('lawyer', 'admin', 'moderator');

-- ============================================================================
-- الجداول المرجعية
-- ============================================================================

create table governorates (
  id smallserial primary key,
  name_ar text not null unique,
  slug text not null unique,
  sort_order smallint not null default 0
);

create table courts (
  id serial primary key,
  governorate_id smallint not null references governorates(id) on delete restrict,
  name_ar text not null,
  slug text not null,
  court_type text not null,
  address text,
  is_active boolean not null default true,
  unique (governorate_id, slug)
);
create index idx_courts_governorate_active on courts (governorate_id) where is_active;

-- ============================================================================
-- ملفات المحامين
-- ============================================================================

create table lawyer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 5 and 100),
  phone text not null unique check (phone ~ '^\+20\d{10}$'),
  whatsapp text check (whatsapp is null or whatsapp ~ '^\+20\d{10}$'),
  bar_number text,
  registration_degree registration_degree not null,
  governorate_id smallint not null references governorates(id),
  bio text check (char_length(bio) <= 400),
  avatar_url text,
  carnet_path text,
  verification_status verification_status not null default 'pending',
  verified_at timestamptz,
  verified_by uuid references auth.users(id),
  rejection_reason text,
  role user_role not null default 'lawyer',
  accepts_notifications boolean not null default true,
  avg_rating numeric(2, 1),
  ratings_count int not null default 0,
  completed_count int not null default 0,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_lawyer_profiles_gov_status on lawyer_profiles (governorate_id, verification_status);
create index idx_lawyer_profiles_pending on lawyer_profiles (verification_status) where verification_status = 'pending';

create table lawyer_courts (
  lawyer_id uuid references lawyer_profiles(id) on delete cascade,
  court_id int references courts(id) on delete cascade,
  primary key (lawyer_id, court_id)
);
create index idx_lawyer_courts_court on lawyer_courts (court_id);

-- ============================================================================
-- طلبات الإنابة
-- ============================================================================

create table delegation_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references lawyer_profiles(id) on delete cascade,
  court_id int not null references courts(id),
  governorate_id smallint not null references governorates(id),
  delegation_type delegation_type not null,
  session_date date not null,
  details text not null check (char_length(details) between 10 and 1000),
  fee_note text,
  status request_status not null default 'open',
  assigned_to uuid references lawyer_profiles(id),
  assigned_at timestamptz,
  completed_at timestamptz,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now()
);
create index idx_requests_open_by_date on delegation_requests (status, session_date) where status = 'open';
create index idx_requests_gov_status on delegation_requests (governorate_id, status);
create index idx_requests_court_status on delegation_requests (court_id, status);

create table request_responses (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references delegation_requests(id) on delete cascade,
  lawyer_id uuid not null references lawyer_profiles(id) on delete cascade,
  message text check (char_length(message) <= 300),
  created_at timestamptz not null default now(),
  unique (request_id, lawyer_id)
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references delegation_requests(id) on delete cascade,
  reviewer_id uuid not null references lawyer_profiles(id) on delete cascade,
  reviewee_id uuid not null references lawyer_profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text check (char_length(comment) <= 300),
  created_at timestamptz not null default now(),
  unique (request_id, reviewer_id),
  check (reviewer_id <> reviewee_id)
);

-- ============================================================================
-- الإعلانات
-- ============================================================================

create table sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_phone text,
  contact_whatsapp text,
  notes text,
  created_at timestamptz not null default now()
);

create table ads (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid not null references sponsors(id) on delete cascade,
  slot ad_slot not null,
  title text not null,
  body text,
  image_url text,
  target_url text,
  target_whatsapp text,
  governorate_id smallint references governorates(id),
  priority smallint not null default 0,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_ads_slot_active_window on ads (slot, is_active, starts_at, ends_at);

create table ad_events (
  id bigserial primary key,
  ad_id uuid not null references ads(id) on delete cascade,
  event_type ad_event_type not null,
  viewer_hash text,
  governorate_id smallint,
  created_at timestamptz not null default now()
);
create index idx_ad_events_ad_type_time on ad_events (ad_id, event_type, created_at);

-- ============================================================================
-- العروض والمزايا
-- ============================================================================

create table perks (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  partner_name text not null,
  logo_url text,
  title text not null,
  description text,
  discount_code text,
  whatsapp text,
  phone text,
  governorate_id smallint references governorates(id),
  is_active boolean not null default true,
  ends_at timestamptz
);

create table perk_redemptions (
  id bigserial primary key,
  perk_id uuid not null references perks(id) on delete cascade,
  lawyer_id uuid references lawyer_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- الإشعارات — SPEC.md §9
-- ============================================================================

create table notification_subscriptions (
  id bigserial primary key,
  lawyer_id uuid not null references lawyer_profiles(id) on delete cascade,
  governorate_id smallint references governorates(id),
  court_id int references courts(id),
  delegation_types delegation_type[],
  channel text not null default 'push',
  is_active boolean not null default true
);
create index idx_notif_subs_gov_active on notification_subscriptions (governorate_id, is_active);

create table notifications_outbox (
  id bigserial primary key,
  lawyer_id uuid not null references lawyer_profiles(id) on delete cascade,
  request_id uuid references delegation_requests(id) on delete cascade,
  channel text not null,
  payload jsonb not null,
  status text not null default 'queued',
  attempts smallint not null default 0,
  sent_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);
create index idx_notif_outbox_queued on notifications_outbox (status, created_at) where status = 'queued';

-- ============================================================================
-- الأمان والتشغيل
-- ============================================================================

create table contact_reveals (
  id bigserial primary key,
  viewer_id uuid references lawyer_profiles(id) on delete set null,
  viewer_hash text not null,
  target_lawyer_id uuid references lawyer_profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index idx_contact_reveals_hash_time on contact_reveals (viewer_hash, created_at);

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references lawyer_profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table admin_actions (
  id bigserial primary key,
  admin_id uuid not null references lawyer_profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- الدوال والمشغّلات (Triggers)
-- ============================================================================

-- دالة مساعدة للتحقق من صلاحية الإدارة — تُستخدم في سياسات RLS (0002_rls.sql)
create or replace function is_admin()
returns boolean
language sql security definer stable as $$
  select exists (
    select 1 from lawyer_profiles
    where id = auth.uid() and role in ('admin', 'moderator')
  );
$$;

-- منع تاريخ جلسة في الماضي عند الإنشاء فقط — SPEC.md §5
-- ملاحظة تصحيحية: هذا الشرط قصدًا trigger على BEFORE INSERT فقط، وليس
-- table CHECK. الـ CHECK كان سيُعاد تقييمه عند أي UPDATE لاحق (بما فيها
-- تحويل الحالة إلى expired بواسطة pg_cron، أو completed بعد مرور تاريخ
-- الجلسة) ويفشل حتمًا بمجرد أن يصبح session_date أقدم من current_date —
-- أي يمنع إغلاق أي طلب فات موعده، وهو عكس المطلوب تمامًا.
create or replace function validate_session_date_on_insert()
returns trigger
language plpgsql as $$
begin
  if new.session_date < current_date then
    raise exception 'تاريخ الجلسة يجب ألا يكون في الماضي';
  end if;
  return new;
end;
$$;

create trigger trg_validate_session_date_on_insert
  before insert on delegation_requests
  for each row execute function validate_session_date_on_insert();

-- انتهاء الصلاحية التلقائي: expires_at = session_date + 1 يوم — SPEC.md §5
create or replace function set_delegation_request_expiry()
returns trigger
language plpgsql as $$
begin
  new.expires_at := (new.session_date + interval '1 day');
  return new;
end;
$$;

create trigger trg_set_delegation_request_expiry
  before insert or update of session_date on delegation_requests
  for each row execute function set_delegation_request_expiry();

-- تحويل الطلبات المنتهية تلقائيًا — تُستدعى بواسطة pg_cron كل ساعة (SPEC.md §5)
create or replace function expire_stale_delegation_requests()
returns void
language sql as $$
  update delegation_requests
  set status = 'expired'
  where status = 'open' and expires_at < now();
$$;

-- تحديث متوسط التقييم وعدده على ملف المحامي بعد كل تقييم جديد — SPEC.md §5
create or replace function refresh_lawyer_rating()
returns trigger
language plpgsql as $$
begin
  update lawyer_profiles
  set
    ratings_count = (select count(*) from reviews where reviewee_id = new.reviewee_id),
    avg_rating = (select round(avg(rating)::numeric, 1) from reviews where reviewee_id = new.reviewee_id)
  where id = new.reviewee_id;
  return new;
end;
$$;

create trigger trg_refresh_lawyer_rating
  after insert on reviews
  for each row execute function refresh_lawyer_rating();

-- تحقق من صلاحية التقييم: الطلب مكتمل والمُقيِّم أحد طرفيه — يُفرض بجانب RLS (SPEC.md §5)
create or replace function validate_review()
returns trigger
language plpgsql as $$
declare
  req delegation_requests;
begin
  select * into req from delegation_requests where id = new.request_id;

  if req.status <> 'completed' then
    raise exception 'لا يمكن التقييم إلا بعد اكتمال الطلب';
  end if;

  if new.reviewer_id not in (req.requester_id, req.assigned_to)
     or new.reviewee_id not in (req.requester_id, req.assigned_to) then
    raise exception 'التقييم مقصور على طرفَي الطلب';
  end if;

  return new;
end;
$$;

create trigger trg_validate_review
  before insert on reviews
  for each row execute function validate_review();

-- زيادة عدّاد المهام المنفَّذة للمحامي المُناب عند اكتمال الطلب — SPEC.md §5
create or replace function increment_completed_count()
returns trigger
language plpgsql as $$
begin
  if new.status = 'completed' and old.status <> 'completed' and new.assigned_to is not null then
    update lawyer_profiles set completed_count = completed_count + 1 where id = new.assigned_to;
  end if;
  return new;
end;
$$;

create trigger trg_increment_completed_count
  after update of status on delegation_requests
  for each row execute function increment_completed_count();

-- ============================================================================
-- جدولة pg_cron — تشغّل مهمة الانتهاء التلقائي كل ساعة
-- ملاحظة: على Supabase المُدار، فعّل امتداد pg_cron أولًا من لوحة التحكم
-- (Database → Extensions) قبل تطبيق هذا الجزء إن فشل تلقائيًا.
-- ============================================================================

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule(
      'expire-stale-delegation-requests',
      '0 * * * *',
      $cron$ select expire_stale_delegation_requests(); $cron$
    );
  end if;
end;
$$;
