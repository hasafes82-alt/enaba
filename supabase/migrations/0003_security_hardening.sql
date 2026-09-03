-- إنابة (Enaba) — تحصين أمني إضافي اكتشفه فاحص Supabase Advisors بعد تطبيق
-- الهجرتين 0001 و0002 على مشروع حقيقي — لم يكن مذكورًا صراحةً في SPEC.md.

-- خطأ (ERROR): public_lawyers كانت SECURITY DEFINER ضمنيًا (تشتغل بصلاحيات
-- مالك الـ view الذي يتجاوز RLS، بدلًا من صلاحيات المستخدم المستعلم). حاليًا
-- غير مستغَل عمليًا لأن شرط الـ view (verification_status = 'verified') مطابق
-- لسياسة RLS، لكنه يكسر مبدأ الدفاع المتعدد الطبقات: لو تغيّر أحدهما مستقبلًا
-- بدون الآخر تظهر ثغرة كشف بيانات. الإصلاح: تشغيل الـ view بصلاحيات المستعلم.
alter view public_lawyers set (security_invoker = true);

-- تحذير (WARN) على كل الدوال: search_path غير مثبَّت، وهو ثغرة معروفة
-- (search_path hijacking) — استدعاء الدالة من جلسة بها search_path مُعدَّل
-- خبيثًا قد يُوجِّه استدعاءات الجداول غير المؤهَّلة (unqualified) إلى كائنات
-- مزيَّفة بدلًا من public.*. التثبيت الصريح يمنع ذلك.
alter function is_admin() set search_path = public;
alter function validate_session_date_on_insert() set search_path = public;
alter function set_delegation_request_expiry() set search_path = public;
alter function expire_stale_delegation_requests() set search_path = public;
alter function refresh_lawyer_rating() set search_path = public;
alter function validate_review() set search_path = public;
alter function increment_completed_count() set search_path = public;

-- ملاحظة مقصودة (WARN مقبول، غير مُصلَح عمدًا):
-- is_admin() قابلة للاستدعاء المباشر عبر /rest/v1/rpc/is_admin من anon
-- وauthenticated. هذا متوقَّع وضروري: سياسات RLS من نوع "admin manages *"
-- تستدعي is_admin() أثناء تقييمها للدور الحالي، وهذا يتطلب صلاحية EXECUTE
-- على الدالة لنفس الأدوار (anon، authenticated) — سحبها يكسر كل سياسات
-- المشرف. الدالة لا تُسرّب بيانات عند استدعائها مباشرة؛ تُرجع فقط true/false
-- عن صلاحية المستخدم الحالي (auth.uid()) نفسه.
