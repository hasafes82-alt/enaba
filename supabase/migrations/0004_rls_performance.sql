-- إنابة (Enaba) — تحسين أداء سياسات RLS
-- اكتُشف عبر Supabase Advisors (performance) بعد تطبيق 0001–0003 على مشروع حقيقي.
-- لم يكن مذكورًا في SPEC.md أصلًا — يوثَّق هنا وفي SPEC.md §6 كقاعدة إلزامية لأي
-- سياسة جديدة.
--
-- مشكلتان:
-- 1) auth_rls_initplan: استدعاء auth.uid() مباشرة داخل USING/WITH CHECK يجعل
--    Postgres يعيد تقييمه لكل صف بدلًا من مرة واحدة لكل استعلام. الإصلاح:
--    كتابته دائمًا كـ (select auth.uid()) ليُعامَل كـ InitPlan قابل للتخزين المؤقت.
-- 2) multiple_permissive_policies: أكثر من سياسة permissive على نفس الجدول
--    ونفس الأمر (select/insert/update/delete) تجعل Postgres يُقيِّم كل سياسة
--    على حدة ثم يجمعها بـ OR — تكلفة مضاعفة بلا داعٍ. الإصلاح: سياسة واحدة لكل
--    أمر تجمع كل الشروط بـ OR داخليًا، بدل توزيعها على سياسات "for all" متعددة.

-- ============================================================================
-- governorates
-- ============================================================================
drop policy "admin manages governorates" on governorates;
create policy "admin inserts governorates" on governorates for insert with check (is_admin());
create policy "admin updates governorates" on governorates for update using (is_admin()) with check (is_admin());
create policy "admin deletes governorates" on governorates for delete using (is_admin());

-- ============================================================================
-- courts
-- ============================================================================
drop policy "public reads active courts" on courts;
drop policy "admin manages courts" on courts;
create policy "read active or admin" on courts for select using (is_active or is_admin());
create policy "admin inserts courts" on courts for insert with check (is_admin());
create policy "admin updates courts" on courts for update using (is_admin()) with check (is_admin());
create policy "admin deletes courts" on courts for delete using (is_admin());

-- ============================================================================
-- lawyer_profiles
-- ============================================================================
drop policy "public reads verified" on lawyer_profiles;
drop policy "owner reads self" on lawyer_profiles;
drop policy "owner updates self" on lawyer_profiles;
drop policy "self registers" on lawyer_profiles;
drop policy "admin full access lawyer_profiles" on lawyer_profiles;

create policy "read verified or self or admin" on lawyer_profiles
  for select using (
    verification_status = 'verified'
    or id = (select auth.uid())
    or is_admin()
  );

create policy "self registers or admin inserts" on lawyer_profiles
  for insert with check (
    (
      id = (select auth.uid())
      and verification_status = 'pending'
      and role = 'lawyer'
    )
    or is_admin()
  );

create policy "owner updates self or admin" on lawyer_profiles
  for update using (id = (select auth.uid()) or is_admin())
  with check (
    (
      id = (select auth.uid())
      -- منع رفع الصلاحيات أو التوثيق الذاتي (SPEC.md §6)
      and role = (select role from lawyer_profiles where id = (select auth.uid()))
      and verification_status = (select verification_status from lawyer_profiles where id = (select auth.uid()))
    )
    or is_admin()
  );

create policy "admin deletes lawyer_profiles" on lawyer_profiles for delete using (is_admin());

-- العرض العام يعتمد على الجدول أعلاه؛ لا تغيير مطلوب في تعريفه.

-- ============================================================================
-- lawyer_courts
-- ============================================================================
drop policy "public reads lawyer_courts of verified" on lawyer_courts;
drop policy "owner manages own courts" on lawyer_courts;
drop policy "admin manages lawyer_courts" on lawyer_courts;

create policy "read of verified or own or admin" on lawyer_courts
  for select using (
    exists (select 1 from lawyer_profiles
            where id = lawyer_courts.lawyer_id and verification_status = 'verified')
    or lawyer_id = (select auth.uid())
    or is_admin()
  );
create policy "owner inserts own courts or admin" on lawyer_courts
  for insert with check (lawyer_id = (select auth.uid()) or is_admin());
create policy "owner deletes own courts or admin" on lawyer_courts
  for delete using (lawyer_id = (select auth.uid()) or is_admin());

-- ============================================================================
-- delegation_requests
-- ============================================================================
drop policy "anyone reads open requests" on delegation_requests;
drop policy "owner reads own requests regardless of status" on delegation_requests;
drop policy "verified lawyers create" on delegation_requests;
drop policy "owner updates own request" on delegation_requests;
drop policy "admin manages requests" on delegation_requests;

create policy "read open or own or admin" on delegation_requests
  for select using (
    status in ('open', 'assigned')
    or requester_id = (select auth.uid())
    or assigned_to = (select auth.uid())
    or is_admin()
  );

create policy "verified lawyer creates or admin" on delegation_requests
  for insert with check (
    (
      requester_id = (select auth.uid())
      and exists (select 1 from lawyer_profiles
                  where id = (select auth.uid()) and verification_status = 'verified')
    )
    or is_admin()
  );

create policy "owner updates own or admin" on delegation_requests
  for update using (requester_id = (select auth.uid()) or is_admin());

create policy "admin deletes requests" on delegation_requests for delete using (is_admin());

-- ============================================================================
-- request_responses
-- ============================================================================
drop policy "parties read responses" on request_responses;
drop policy "verified lawyers respond" on request_responses;
drop policy "admin manages responses" on request_responses;

create policy "parties read or admin" on request_responses
  for select using (
    lawyer_id = (select auth.uid())
    or exists (select 1 from delegation_requests
               where id = request_responses.request_id and requester_id = (select auth.uid()))
    or is_admin()
  );

create policy "verified lawyer responds or admin" on request_responses
  for insert with check (
    (
      lawyer_id = (select auth.uid())
      and exists (select 1 from lawyer_profiles
                  where id = (select auth.uid()) and verification_status = 'verified')
    )
    or is_admin()
  );

create policy "admin updates responses" on request_responses for update using (is_admin()) with check (is_admin());
create policy "admin deletes responses" on request_responses for delete using (is_admin());

-- ============================================================================
-- reviews (القراءة العامة أصلًا using(true) — لا تعارض؛ الإدخال فقط يحتاج توحيد)
-- ============================================================================
drop policy "verified party reviews after completion" on reviews;
drop policy "admin manages reviews" on reviews;

create policy "verified party reviews or admin" on reviews
  for insert with check (
    (
      reviewer_id = (select auth.uid())
      and exists (select 1 from lawyer_profiles
                  where id = (select auth.uid()) and verification_status = 'verified')
    )
    or is_admin()
  );

create policy "admin updates reviews" on reviews for update using (is_admin()) with check (is_admin());
create policy "admin deletes reviews" on reviews for delete using (is_admin());

-- ============================================================================
-- ads
-- ============================================================================
drop policy "public reads active ads" on ads;
drop policy "admin manages ads" on ads;

create policy "read active or admin" on ads
  for select using ((is_active and now() between starts_at and ends_at) or is_admin());
create policy "admin inserts ads" on ads for insert with check (is_admin());
create policy "admin updates ads" on ads for update using (is_admin()) with check (is_admin());
create policy "admin deletes ads" on ads for delete using (is_admin());

-- ============================================================================
-- perks
-- ============================================================================
drop policy "public reads active perks" on perks;
drop policy "admin manages perks" on perks;

create policy "read active or admin" on perks for select using (is_active or is_admin());
create policy "admin inserts perks" on perks for insert with check (is_admin());
create policy "admin updates perks" on perks for update using (is_admin()) with check (is_admin());
create policy "admin deletes perks" on perks for delete using (is_admin());

-- ============================================================================
-- perk_redemptions (auth_rls_initplan فقط — لا تعدد سياسات على نفس الأمر)
-- ============================================================================
drop policy "anyone logs perk redemption" on perk_redemptions;
create policy "anyone logs perk redemption" on perk_redemptions
  for insert with check (lawyer_id is null or lawyer_id = (select auth.uid()));

-- ============================================================================
-- notification_subscriptions
-- ============================================================================
drop policy "owner manages own subscriptions" on notification_subscriptions;
drop policy "admin manages subscriptions" on notification_subscriptions;

create policy "owner reads own or admin" on notification_subscriptions
  for select using (lawyer_id = (select auth.uid()) or is_admin());
create policy "owner inserts own or admin" on notification_subscriptions
  for insert with check (lawyer_id = (select auth.uid()) or is_admin());
create policy "owner updates own or admin" on notification_subscriptions
  for update using (lawyer_id = (select auth.uid()) or is_admin())
  with check (lawyer_id = (select auth.uid()) or is_admin());
create policy "owner deletes own or admin" on notification_subscriptions
  for delete using (lawyer_id = (select auth.uid()) or is_admin());

-- ============================================================================
-- notifications_outbox
-- ============================================================================
drop policy "owner reads own notifications" on notifications_outbox;
drop policy "admin manages notifications_outbox" on notifications_outbox;

create policy "owner reads own or admin" on notifications_outbox
  for select using (lawyer_id = (select auth.uid()) or is_admin());
create policy "admin inserts notifications_outbox" on notifications_outbox for insert with check (is_admin());
create policy "admin updates notifications_outbox" on notifications_outbox for update using (is_admin()) with check (is_admin());
create policy "admin deletes notifications_outbox" on notifications_outbox for delete using (is_admin());
-- لا سياسة insert للعميل العادي — القائمة تُملأ حصريًا عبر Edge Function
-- بصلاحية service_role التي تتجاوز RLS بالكامل، وليس من متصفح المستخدم.

-- ============================================================================
-- reports
-- ============================================================================
drop policy "reporter creates report" on reports;
drop policy "admin manages reports" on reports;

create policy "admin reads reports" on reports for select using (is_admin());
create policy "reporter creates or admin" on reports
  for insert with check ((reporter_id is null or reporter_id = (select auth.uid())) or is_admin());
create policy "admin updates reports" on reports for update using (is_admin()) with check (is_admin());
create policy "admin deletes reports" on reports for delete using (is_admin());
