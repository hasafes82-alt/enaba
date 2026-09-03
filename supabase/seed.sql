-- إنابة (Enaba) — بيانات مرجعية وبيانات تجريبية
-- المرجع: SPEC.md §11 (البيانات المرجعية)
--
-- ⚠️ تحذير: القسم الخاص بـ auth.users والمحامين التجريبيين مخصص حصريًا للتطوير
-- المحلي (`supabase start` / `supabase db reset`). لا يُشغَّل هذا الملف على أي
-- بيئة إنتاج. أرقام الهواتف التجريبية وهمية بالصيغة +2010000000X كما ينص §11.

-- ============================================================================
-- المحافظات — القائمة الكاملة (27) — SPEC.md §11
-- ============================================================================

insert into governorates (name_ar, slug, sort_order) values
  ('القاهرة', 'cairo', 1),
  ('الجيزة', 'giza', 2),
  ('الإسكندرية', 'alexandria', 3),
  ('القليوبية', 'qalyubia', 4),
  ('الشرقية', 'sharqia', 5),
  ('الدقهلية', 'dakahlia', 6),
  ('البحيرة', 'beheira', 7),
  ('المنوفية', 'monufia', 8),
  ('الغربية', 'gharbia', 9),
  ('كفر الشيخ', 'kafr-el-sheikh', 10),
  ('دمياط', 'damietta', 11),
  ('بورسعيد', 'port-said', 12),
  ('الإسماعيلية', 'ismailia', 13),
  ('السويس', 'suez', 14),
  ('شمال سيناء', 'north-sinai', 15),
  ('جنوب سيناء', 'south-sinai', 16),
  ('البحر الأحمر', 'red-sea', 17),
  ('مطروح', 'matrouh', 18),
  ('الفيوم', 'fayoum', 19),
  ('بني سويف', 'beni-suef', 20),
  ('المنيا', 'el-minya', 21),
  ('أسيوط', 'asyut', 22),
  ('سوهاج', 'sohag', 23),
  ('قنا', 'qena', 24),
  ('الأقصر', 'luxor', 25),
  ('أسوان', 'aswan', 26),
  ('الوادي الجديد', 'new-valley', 27);

-- ============================================================================
-- نماذج محاكم للتحميل الأولي — SPEC.md §11
-- ملاحظة تشغيلية من SPEC.md: قائمة بذرة للانطلاق، تُستكمل تدريجيًا، ويجب
-- مراجعة الأسماء مع محامٍ ممارس قبل الإطلاق.
-- ============================================================================

insert into courts (governorate_id, name_ar, slug, court_type) values
  -- القاهرة
  ((select id from governorates where slug = 'cairo'), 'محكمة شمال القاهرة الابتدائية', 'north-cairo-primary-court', 'ابتدائية'),
  ((select id from governorates where slug = 'cairo'), 'محكمة جنوب القاهرة الابتدائية', 'south-cairo-primary-court', 'ابتدائية'),
  ((select id from governorates where slug = 'cairo'), 'محكمة مدينة نصر', 'nasr-city-court', 'ابتدائية'),
  ((select id from governorates where slug = 'cairo'), 'محكمة القاهرة الجديدة', 'new-cairo-court', 'ابتدائية'),
  ((select id from governorates where slug = 'cairo'), 'مجلس الدولة (الدقي)', 'state-council-dokki', 'مجلس دولة'),
  ((select id from governorates where slug = 'cairo'), 'محكمة الأسرة بالعباسية', 'abbasiya-family-court', 'أسرة'),

  -- الجيزة
  ((select id from governorates where slug = 'giza'), 'محكمة الجيزة الابتدائية', 'giza-primary-court', 'ابتدائية'),
  ((select id from governorates where slug = 'giza'), 'محكمة 6 أكتوبر', '6th-october-court', 'ابتدائية'),
  ((select id from governorates where slug = 'giza'), 'محكمة إمبابة', 'imbaba-court', 'ابتدائية'),
  ((select id from governorates where slug = 'giza'), 'محكمة الصف', 'al-saff-court', 'ابتدائية'),

  -- الإسكندرية
  ((select id from governorates where slug = 'alexandria'), 'محكمة المنشية', 'manshiya-court', 'ابتدائية'),
  ((select id from governorates where slug = 'alexandria'), 'محكمة محرم بك', 'moharam-bek-court', 'ابتدائية'),
  ((select id from governorates where slug = 'alexandria'), 'مجمع محاكم الدخيلة', 'dekheila-courts-complex', 'ابتدائية'),
  ((select id from governorates where slug = 'alexandria'), 'محكمة سموحة الاقتصادية', 'smouha-economic-court', 'اقتصادية'),

  -- المنيا
  ((select id from governorates where slug = 'el-minya'), 'محكمة المنيا الابتدائية', 'minya-primary-court', 'ابتدائية'),
  ((select id from governorates where slug = 'el-minya'), 'محكمة ملوي', 'mallawi-court', 'ابتدائية'),
  ((select id from governorates where slug = 'el-minya'), 'محكمة بني مزار', 'beni-mazar-court', 'ابتدائية'),

  -- أسيوط
  ((select id from governorates where slug = 'asyut'), 'محكمة أسيوط الابتدائية', 'asyut-primary-court', 'ابتدائية'),
  ((select id from governorates where slug = 'asyut'), 'محكمة استئناف أسيوط', 'asyut-appeal-court', 'استئناف'),
  ((select id from governorates where slug = 'asyut'), 'محكمة ديروط', 'dayrout-court', 'ابتدائية'),

  -- الدقهلية
  ((select id from governorates where slug = 'dakahlia'), 'محكمة المنصورة الابتدائية', 'mansoura-primary-court', 'ابتدائية'),
  ((select id from governorates where slug = 'dakahlia'), 'محكمة استئناف المنصورة', 'mansoura-appeal-court', 'استئناف'),
  ((select id from governorates where slug = 'dakahlia'), 'محكمة ميت غمر', 'mit-ghamr-court', 'ابتدائية'),

  -- الغربية
  ((select id from governorates where slug = 'gharbia'), 'محكمة طنطا الابتدائية', 'tanta-primary-court', 'ابتدائية'),
  ((select id from governorates where slug = 'gharbia'), 'محكمة استئناف طنطا', 'tanta-appeal-court', 'استئناف'),
  ((select id from governorates where slug = 'gharbia'), 'محكمة المحلة الكبرى', 'mahalla-court', 'ابتدائية'),

  -- سوهاج
  ((select id from governorates where slug = 'sohag'), 'محكمة سوهاج الابتدائية', 'sohag-primary-court', 'ابتدائية'),
  ((select id from governorates where slug = 'sohag'), 'محكمة طهطا', 'tahta-court', 'ابتدائية'),

  -- قنا
  ((select id from governorates where slug = 'qena'), 'محكمة قنا الابتدائية', 'qena-primary-court', 'ابتدائية'),
  ((select id from governorates where slug = 'qena'), 'محكمة نجع حمادي', 'naga-hammadi-court', 'ابتدائية'),

  -- الشرقية
  ((select id from governorates where slug = 'sharqia'), 'محكمة الزقازيق الابتدائية', 'zagazig-primary-court', 'ابتدائية'),
  ((select id from governorates where slug = 'sharqia'), 'محكمة بلبيس', 'bilbeis-court', 'ابتدائية'),
  ((select id from governorates where slug = 'sharqia'), 'محكمة العاشر من رمضان', '10th-ramadan-court', 'ابتدائية');

-- ============================================================================
-- محامون تجريبيون (8 على الأقل) — SPEC.md §11
-- تطوير محلي فقط: إنشاء صف auth.users مطابق لكل lawyer_profiles.
-- ============================================================================

insert into auth.users (
  instance_id, id, aud, role, phone, phone_confirmed_at,
  encrypted_password, confirmation_token, email_change, email_change_token_new, recovery_token,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', '+201000000001', now(), '', '', '', '', '', '{"provider":"phone","providers":["phone"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', '+201000000002', now(), '', '', '', '', '', '{"provider":"phone","providers":["phone"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', '+201000000003', now(), '', '', '', '', '', '{"provider":"phone","providers":["phone"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', '+201000000004', now(), '', '', '', '', '', '{"provider":"phone","providers":["phone"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', '+201000000005', now(), '', '', '', '', '', '{"provider":"phone","providers":["phone"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated', '+201000000006', now(), '', '', '', '', '', '{"provider":"phone","providers":["phone"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated', '+201000000007', now(), '', '', '', '', '', '{"provider":"phone","providers":["phone"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000008', 'authenticated', 'authenticated', '+201000000008', now(), '', '', '', '', '', '{"provider":"phone","providers":["phone"]}', '{}', now(), now());

insert into lawyer_profiles (
  id, full_name, phone, bar_number, registration_degree, governorate_id, bio,
  verification_status, verified_at, role, avg_rating, ratings_count, completed_count, last_seen_at
) values
  ('00000000-0000-0000-0000-000000000001', 'أحمد فتحي السيد', '+201000000001', 'BAR-10001', 'appeal', (select id from governorates where slug = 'cairo'), 'محامٍ متخصص في قضايا الأسرة والأحوال الشخصية، متواجد يوميًا بمحاكم شرق وشمال القاهرة.', 'verified', now() - interval '20 days', 'lawyer', 4.8, 24, 31, now() - interval '2 hours'),
  ('00000000-0000-0000-0000-000000000002', 'مروة عبد الحليم', '+201000000002', 'BAR-10002', 'primary', (select id from governorates where slug = 'cairo'), 'متابعة جلسات وإيداع صحف دعاوى بمحكمتي جنوب القاهرة ومدينة نصر.', 'verified', now() - interval '15 days', 'lawyer', 4.5, 12, 18, now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000003', 'خالد إبراهيم منصور', '+201000000003', 'BAR-10003', 'cassation', (select id from governorates where slug = 'giza'), 'خبرة في الطعون بالنقض وتمثيل الزملاء أمام محاكم الجيزة الاقتصادية والجنائية.', 'verified', now() - interval '40 days', 'lawyer', 4.9, 37, 52, now() - interval '5 hours'),
  ('00000000-0000-0000-0000-000000000004', 'ياسمين عادل توفيق', '+201000000004', 'BAR-10004', 'primary', (select id from governorates where slug = 'giza'), 'استخراج شهادات وإعلامات وراثة، ومتابعة يومية بمحكمة 6 أكتوبر.', 'verified', now() - interval '8 days', 'lawyer', 4.2, 6, 9, now() - interval '3 hours'),
  ('00000000-0000-0000-0000-000000000005', 'محمود سعد الدين', '+201000000005', 'BAR-10005', 'general', (select id from governorates where slug = 'el-minya'), 'متواجد يوميًا بمحكمة المنيا الابتدائية، متخصص في إنابات حضور الجلسات والتأجيل.', 'verified', now() - interval '60 days', 'lawyer', 4.6, 19, 27, now() - interval '30 minutes'),
  ('00000000-0000-0000-0000-000000000006', 'هبة الله كامل', '+201000000006', 'BAR-10006', 'appeal', (select id from governorates where slug = 'el-minya'), 'تصوير أوراق ومذكرات، وتقديم طلبات بمحكمتي ملوي وبني مزار.', 'verified', now() - interval '10 days', 'lawyer', 4.0, 4, 5, now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000007', 'عمرو حسن الجندي', '+201000000007', 'BAR-10007', 'primary', (select id from governorates where slug = 'alexandria'), 'متابعة قضايا اقتصادية وحضور جلسات بمحكمة سموحة الاقتصادية ومجمع الدخيلة.', 'verified', now() - interval '25 days', 'lawyer', 4.7, 21, 29, now() - interval '4 hours'),
  ('00000000-0000-0000-0000-000000000008', 'سارة وجدي فرغلي', '+201000000008', null, 'general', (select id from governorates where slug = 'alexandria'), 'محامية حديثة القيد بجدول عام، متاحة لتصوير الأوراق والاستعلامات بالإسكندرية.', 'pending', null, 'lawyer', null, 0, 0, now() - interval '10 minutes');

insert into lawyer_courts (lawyer_id, court_id) values
  ('00000000-0000-0000-0000-000000000001', (select id from courts where slug = 'north-cairo-primary-court')),
  ('00000000-0000-0000-0000-000000000001', (select id from courts where slug = 'abbasiya-family-court')),
  ('00000000-0000-0000-0000-000000000002', (select id from courts where slug = 'south-cairo-primary-court')),
  ('00000000-0000-0000-0000-000000000002', (select id from courts where slug = 'nasr-city-court')),
  ('00000000-0000-0000-0000-000000000003', (select id from courts where slug = 'giza-primary-court')),
  ('00000000-0000-0000-0000-000000000003', (select id from courts where slug = 'smouha-economic-court')),
  ('00000000-0000-0000-0000-000000000004', (select id from courts where slug = '6th-october-court')),
  ('00000000-0000-0000-0000-000000000005', (select id from courts where slug = 'minya-primary-court')),
  ('00000000-0000-0000-0000-000000000006', (select id from courts where slug = 'mallawi-court')),
  ('00000000-0000-0000-0000-000000000006', (select id from courts where slug = 'beni-mazar-court')),
  ('00000000-0000-0000-0000-000000000007', (select id from courts where slug = 'smouha-economic-court')),
  ('00000000-0000-0000-0000-000000000007', (select id from courts where slug = 'dekheila-courts-complex'));

-- ============================================================================
-- طلبات إنابة تجريبية (6) بحالات مختلفة — SPEC.md §11
-- session_date نسبي إلى اليوم الحالي كي يبقى الـ seed صالحًا في أي وقت تشغيل
-- ============================================================================

insert into delegation_requests (
  requester_id, court_id, governorate_id, delegation_type, session_date, details, fee_note, status
) values
  -- عاجل (أقل من 48 ساعة) — القاهرة
  ('00000000-0000-0000-0000-000000000001', (select id from courts where slug = 'nasr-city-court'), (select id from governorates where slug = 'cairo'), 'session_attendance', current_date + 1, 'مطلوب حضور جلسة تأجيل في قضية نفقة، الجلسة الساعة 10 صباحًا بالدائرة الثالثة.', 'الأتعاب بالاتفاق', 'open'),
  -- عادي — الجيزة
  ('00000000-0000-0000-0000-000000000003', (select id from courts where slug = 'giza-primary-court'), (select id from governorates where slug = 'giza'), 'document_copying', current_date + 10, 'تصوير كامل ملف القضية رقم 2026/1500 مدني كلي الجيزة.', '150 جنيه', 'open'),
  -- عاجل — المنيا
  ('00000000-0000-0000-0000-000000000005', (select id from courts where slug = 'minya-primary-court'), (select id from governorates where slug = 'el-minya'), 'filing_claim', current_date + 2, 'إيداع صحيفة دعوى مستعجلة قبل انتهاء الميعاد القانوني.', 'الأتعاب بالاتفاق', 'open'),
  -- تم الإسناد — الإسكندرية
  ('00000000-0000-0000-0000-000000000007', (select id from courts where slug = 'smouha-economic-court'), (select id from governorates where slug = 'alexandria'), 'session_attendance', current_date + 5, 'حضور جلسة استماع في نزاع تجاري، مطلوب محامٍ بدرجة قيد ابتدائي فأعلى.', '300 جنيه', 'assigned'),
  -- عادي — الجيزة (استعلام)
  ('00000000-0000-0000-0000-000000000004', (select id from courts where slug = '6th-october-court'), (select id from governorates where slug = 'giza'), 'case_inquiry', current_date + 7, 'استعلام عن حالة قضية وتحديد الجلسة القادمة.', 'الأتعاب بالاتفاق', 'open'),
  -- عاجل — القاهرة (إنذار محضر)
  ('00000000-0000-0000-0000-000000000002', (select id from courts where slug = 'abbasiya-family-court'), (select id from governorates where slug = 'cairo'), 'bailiff_notice', current_date + 1, 'إعلان إنذار على يد محضر لطرف مقيم بالقاهرة الجديدة قبل رفع الدعوى.', 'الأتعاب بالاتفاق', 'open');

update delegation_requests
set assigned_to = '00000000-0000-0000-0000-000000000003', assigned_at = now() - interval '1 day'
where status = 'assigned';
