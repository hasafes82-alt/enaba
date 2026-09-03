-- إنابة (Enaba) — سياسات أمان مستوى الصف (RLS)
-- المرجع: SPEC.md §6 (الأمان وسياسات RLS)
--
-- قاعدة ملزِمة (SPEC.md §16): RLS مفعّل على كل جدول بلا استثناء. جدول واحد بدونها
-- يعني أن أي زائر يستطيع قراءة أو تعديل كامل محتواه عبر واجهة Supabase العامة.
--
-- السياسات المذكورة صراحةً في SPEC.md §6 منقولة حرفيًا (lawyer_profiles،
-- delegation_requests، is_admin()). باقي الجداول تتبع نفس المبدأ الثلاثي:
-- قراءة عامة للبيانات المُعلَنة، كتابة مقصورة على المالك أو محامٍ موثَّق،
-- وصول كامل للمشرف عبر is_admin().

-- ============================================================================
-- تفعيل RLS على كل جدول
-- ============================================================================

alter table governorates              enable row level security;
alter table courts                    enable row level security;
alter table lawyer_profiles           enable row level security;
alter table lawyer_courts             enable row level security;
alter table delegation_requests       enable row level security;
alter table request_responses         enable row level security;
alter table reviews                   enable row level security;
alter table sponsors                  enable row level security;
alter table ads                       enable row level security;
alter table ad_events                 enable row level security;
alter table perks                     enable row level security;
alter table perk_redemptions          enable row level security;
alter table notification_subscriptions enable row level security;
alter table notifications_outbox      enable row level security;
alter table contact_reveals           enable row level security;
alter table reports                   enable row level security;
alter table admin_actions             enable row level security;

-- ============================================================================
-- البيانات المرجعية — قراءة عامة، تعديل للمشرف فقط
-- ============================================================================

create policy "public reads governorates" on governorates
  for select using (true);
create policy "admin manages governorates" on governorates
  for all using (is_admin()) with check (is_admin());

create policy "public reads active courts" on courts
  for select using (is_active);
create policy "admin manages courts" on courts
  for all using (is_admin()) with check (is_admin());

-- ============================================================================
-- ملفات المحامين — SPEC.md §6 (منقولة حرفيًا)
-- ============================================================================

create policy "public reads verified" on lawyer_profiles
  for select using (verification_status = 'verified');

create policy "owner reads self" on lawyer_profiles
  for select using (id = auth.uid());

create policy "owner updates self" on lawyer_profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    -- منع رفع الصلاحيات أو التوثيق الذاتي (SPEC.md §6)
    and role = (select role from lawyer_profiles where id = auth.uid())
    and verification_status = (select verification_status from lawyer_profiles where id = auth.uid())
  );

-- التسجيل الأولي: المستخدم المصادَق يُنشئ صف نفسه فقط، بحالة pending دائمًا
create policy "self registers" on lawyer_profiles
  for insert with check (
    id = auth.uid()
    and verification_status = 'pending'
    and role = 'lawyer'
  );

create policy "admin full access lawyer_profiles" on lawyer_profiles
  for all using (is_admin()) with check (is_admin());

-- العرض العام بلا بيانات اتصال — الواجهة تقرأ منه حصريًا (SPEC.md §6)
create view public_lawyers as
select id, full_name, registration_degree, governorate_id, bio, avatar_url,
       avg_rating, ratings_count, completed_count, verification_status, last_seen_at
from lawyer_profiles
where verification_status = 'verified';

-- ============================================================================
-- محاكم كل محامٍ (تغطية العمل)
-- ============================================================================

create policy "public reads lawyer_courts of verified" on lawyer_courts
  for select using (
    exists (select 1 from lawyer_profiles
            where id = lawyer_courts.lawyer_id and verification_status = 'verified')
  );

create policy "owner manages own courts" on lawyer_courts
  for all using (lawyer_id = auth.uid()) with check (lawyer_id = auth.uid());

create policy "admin manages lawyer_courts" on lawyer_courts
  for all using (is_admin()) with check (is_admin());

-- ============================================================================
-- طلبات الإنابة — SPEC.md §6 (منقولة حرفيًا)
-- ============================================================================

create policy "anyone reads open requests" on delegation_requests
  for select using (status in ('open', 'assigned'));

create policy "owner reads own requests regardless of status" on delegation_requests
  for select using (requester_id = auth.uid() or assigned_to = auth.uid());

create policy "verified lawyers create" on delegation_requests
  for insert with check (
    requester_id = auth.uid()
    and exists (select 1 from lawyer_profiles
                where id = auth.uid() and verification_status = 'verified')
  );

create policy "owner updates own request" on delegation_requests
  for update using (requester_id = auth.uid());

create policy "admin manages requests" on delegation_requests
  for all using (is_admin()) with check (is_admin());

-- ============================================================================
-- الاستجابات لطلبات الإنابة
-- ============================================================================

create policy "parties read responses" on request_responses
  for select using (
    lawyer_id = auth.uid()
    or exists (select 1 from delegation_requests
               where id = request_responses.request_id and requester_id = auth.uid())
  );

create policy "verified lawyers respond" on request_responses
  for insert with check (
    lawyer_id = auth.uid()
    and exists (select 1 from lawyer_profiles
                where id = auth.uid() and verification_status = 'verified')
  );

create policy "admin manages responses" on request_responses
  for all using (is_admin()) with check (is_admin());

-- ============================================================================
-- التقييمات — تُقرأ علنًا (تغذي السمعة العامة)، والتحقق من الأهلية عبر
-- trigger validate_review() في 0001_init.sql إضافة إلى الشرط أدناه
-- ============================================================================

create policy "public reads reviews" on reviews
  for select using (true);

create policy "verified party reviews after completion" on reviews
  for insert with check (
    reviewer_id = auth.uid()
    and exists (select 1 from lawyer_profiles
                where id = auth.uid() and verification_status = 'verified')
  );

create policy "admin manages reviews" on reviews
  for all using (is_admin()) with check (is_admin());

-- ============================================================================
-- الإعلانات والرعاة
-- ============================================================================

create policy "admin manages sponsors" on sponsors
  for all using (is_admin()) with check (is_admin());

create policy "public reads active ads" on ads
  for select using (is_active and now() between starts_at and ends_at);

create policy "admin manages ads" on ads
  for all using (is_admin()) with check (is_admin());

-- أحداث الإعلانات: كتابة مفتوحة (لتسجيل ظهور/نقرة من أي زائر)، قراءة للمشرف فقط
create policy "anyone logs ad events" on ad_events
  for insert with check (true);

create policy "admin reads ad events" on ad_events
  for select using (is_admin());

-- ============================================================================
-- العروض والمزايا
-- ============================================================================

create policy "public reads active perks" on perks
  for select using (is_active);

create policy "admin manages perks" on perks
  for all using (is_admin()) with check (is_admin());

create policy "anyone logs perk redemption" on perk_redemptions
  for insert with check (lawyer_id is null or lawyer_id = auth.uid());

create policy "admin reads perk redemptions" on perk_redemptions
  for select using (is_admin());

-- ============================================================================
-- الإشعارات
-- ============================================================================

create policy "owner manages own subscriptions" on notification_subscriptions
  for all using (lawyer_id = auth.uid()) with check (lawyer_id = auth.uid());

create policy "admin manages subscriptions" on notification_subscriptions
  for all using (is_admin()) with check (is_admin());

create policy "owner reads own notifications" on notifications_outbox
  for select using (lawyer_id = auth.uid());

create policy "admin manages notifications_outbox" on notifications_outbox
  for all using (is_admin()) with check (is_admin());
-- ملاحظة: لا سياسة insert للعميل — القائمة تُملأ حصريًا عبر Edge Function
-- بصلاحية service_role التي تتجاوز RLS، وليس من متصفح المستخدم.

-- ============================================================================
-- جداول الأمان والتشغيل الداخلية — بلا سياسات عامة عمدًا
-- تُكتب وتُقرأ حصريًا عبر عميل service_role (يتجاوز RLS) من Route Handlers
-- الخادمية، لمنع أي تلاعب من العميل بحدود المعدل أو سجل التدقيق
-- ============================================================================

create policy "admin reads contact_reveals" on contact_reveals
  for select using (is_admin());

create policy "reporter creates report" on reports
  for insert with check (reporter_id is null or reporter_id = auth.uid());

create policy "admin manages reports" on reports
  for all using (is_admin()) with check (is_admin());

create policy "admin reads admin_actions" on admin_actions
  for select using (is_admin());
