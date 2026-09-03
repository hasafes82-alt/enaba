# إنابة (Enaba) — المستند المرجعي للمشروع

> **الإصدار:** 2.0 · **الحالة:** معتمد ونافذ · **تاريخ الاعتماد:** 2026-09-03
>
> ## ⚠️ بند الحصرية
> **هذا المستند هو المرجع الوحيد والنهائي للمشروع.** كل ما سبقه من مستندات أو برومبتات أو
> مواصفات أو رسائل تعريفية — بما في ذلك برومبت الإصدار الأول (v1) — **ملغى بالكامل** ولا يُعتد به.
> عند أي تعارض بين هذا المستند وأي مصدر آخر، **هذا المستند هو الحاكم**.
> أي تعديل على نطاق المشروع لا يُعتبر نافذًا إلا بعد تحديث هذا الملف ورفعه على الفرع الرئيسي.

---

## الفهرس

1. [الرؤية والمشكلة](#1-الرؤية-والمشكلة)
2. [المستخدمون وحالات الاستخدام](#2-المستخدمون-وحالات-الاستخدام)
3. [القرارات المعمارية الملزِمة](#3-القرارات-المعمارية-الملزِمة)
4. [نظام التصميم](#4-نظام-التصميم)
5. [مخطط قاعدة البيانات](#5-مخطط-قاعدة-البيانات)
6. [الأمان وسياسات RLS](#6-الأمان-وسياسات-rls)
7. [المصادقة والصلاحيات](#7-المصادقة-والصلاحيات)
8. [المواصفات الوظيفية](#8-المواصفات-الوظيفية)
9. [نظام الإشعارات](#9-نظام-الإشعارات)
10. [نظام الإعلانات والقياس](#10-نظام-الإعلانات-والقياس)
11. [البيانات المرجعية](#11-البيانات-المرجعية)
12. [SEO والأداء](#12-seo-والأداء)
13. [الامتثال القانوني](#13-الامتثال-القانوني)
14. [نموذج الأعمال ومصادر الدخل](#14-نموذج-الأعمال-ومصادر-الدخل)
15. [خارطة الطريق](#15-خارطة-الطريق)
16. [معايير الجودة والقبول](#16-معايير-الجودة-والقبول)
17. [هيكل المشروع ومتغيرات البيئة](#17-هيكل-المشروع-ومتغيرات-البيئة)

---

## 1. الرؤية والمشكلة

### المشكلة
المحامي المصري يحتاج باستمرار إلى زميل في محافظة أخرى لتنفيذ مهمة قضائية: حضور جلسة وطلب أجل،
تصوير أوراق، إيداع صحيفة دعوى، أو إعلان على يد محضر. الوسيلة الحالية هي مجموعات واتساب عشوائية
وشبكة معارف شخصية — بلا تنظيم، بلا بحث، بلا تحقق من الهوية، وبلا سجل سمعة.

### الحل
**دليل مهني رقمي مجاني** يربط المحامين ببعضهم مباشرة (Peer-to-Peer)، مبني على ثلاثة أعمدة:

| العمود | الوصف |
|---|---|
| **الدليل** | بحث فوري عن محامٍ حسب المحافظة والمحكمة ودرجة القيد |
| **لوحة الطلبات المستعجلة** | نشر مهمة عاجلة ووصولها **فورًا كإشعار** لمحاميي المنطقة المستهدفة |
| **الثقة** | توثيق إجباري لكارنيه النقابة + تقييم بعد التنفيذ |

### المبادئ الحاكمة
1. **مجاني 100% للمحامين.** لا عمولة، لا ضمان مالي (Escrow)، لا وساطة في الاتفاق.
2. **المنصة دليل، وليست طرفًا.** الاتفاق المالي والتنفيذ مسؤولية الطرفين حصريًا.
3. **الجوال أولًا.** أكثر من 80% من الاستخدام سيكون من هاتف داخل أو بجوار مقر المحكمة.
4. **العربية أولًا و RTL أصيل.** ليس ترجمة لواجهة إنجليزية.
5. **السرعة شرط بقاء.** المستخدم واقف في طابور المحكمة ومعه شبكة ضعيفة.

---

## 2. المستخدمون وحالات الاستخدام

### الشخصيات (Personas)

**أ. الطالب (طالب الإنابة)** — محامٍ لديه قضية في محافظة بعيدة ولا يستطيع السفر.
- الحاجة: إيجاد زميل موثوق **خلال ساعات**، لا أيام.
- نقطة الفشل: ينشر طلبًا ولا يرد عليه أحد قبل موعد الجلسة → يترك المنصة نهائيًا.

**ب. المنفّذ (المُناب)** — محامٍ متواجد يوميًا في محاكم محافظته، يبحث عن دخل إضافي.
- الحاجة: أن يعرف بالطلبات الجديدة في محكمته **دون فتح الموقع**.
- نقطة الفشل: يفتح اللوحة فيجدها قديمة/فارغة → لا يعود.

**ج. المشرف (Admin)** — يراجع الكارنيهات، يدير الإعلانات، يتعامل مع البلاغات.

**د. الراعي (Sponsor)** — متجر بدل، مكتبة قانونية، مركز تدريب. يدفع مقابل ظهور مُقاس.

### الرحلة الحرجة (Critical Path)
```
محامي يسجل → يرفع الكارنيه → يُوثَّق خلال 24 ساعة → يشترك في إشعارات محافظته
                                                              ↓
طالب ينشر طلبًا في "محكمة المنيا الابتدائية" ← ────────── إشعار فوري
                                                              ↓
منفّذ يستقبل الإشعار → يضغط "أقبل" → يفتح واتساب برسالة جاهزة → يتفقان
                                                              ↓
الطلب يتحول تلقائيًا إلى "تم الاستلام" → بعد التنفيذ: تقييم متبادل
```
**كل ميزة لا تخدم هذه الرحلة تُؤجَّل إلى ما بعد الإطلاق.**

---

## 3. القرارات المعمارية الملزِمة

> هذه القرارات **نهائية وغير قابلة للتفاوض** أثناء التنفيذ. لا يوجد "أو".

### ADR-01 — الإطار: Next.js (أحدث إصدار مستقر، App Router)
**القرار:** Next.js حصريًا. **Vite ممنوع.**
**السبب:** المنتج دليل (Directory)، ومصدر النمو المجاني الأساسي هو البحث العضوي على جوجل
(«إنابة محامي المنيا»، «محامي حضور جلسة طنطا»). هذا يستلزم توليد صفحات ثابتة/خادمية لكل
محافظة ولكل محكمة (`/lawyers/[governorate]/[court]`). تطبيق SPA بـ Vite يفقد هذه القناة بالكامل.

### ADR-02 — قاعدة البيانات: Supabase (PostgreSQL)
**القرار:** Supabase حصريًا. **LocalStorage كمخزن بيانات ممنوع.**
**السبب:** «لوحة طلبات عامة» + LocalStorage **تناقض مستحيل** — LocalStorage معزول داخل متصفح
كل مستخدم، فلن يرى أحد طلبات أحد وستبدو اللوحة فارغة للجميع.
LocalStorage يُستخدم **فقط** لتفضيلات الواجهة (المحافظة الافتراضية، إغلاق البانر، الوضع الليلي).

### ADR-03 — الحزمة التقنية
| الطبقة | الاختيار |
|---|---|
| الإطار | Next.js (أحدث إصدار مستقر عند بدء التنفيذ — الحالي 16) · App Router · TypeScript (strict) |
| التنسيق | Tailwind CSS v4 |
| الأيقونات | `lucide-react` |
| قاعدة البيانات | Supabase Postgres + RLS |
| المصادقة | Supabase Auth (OTP عبر SMS/واتساب — رقم الهاتف هو الهوية) |
| التخزين | Supabase Storage (bucket خاص للكارنيهات، عام للشعارات) |
| المهام الخلفية | Supabase Edge Functions + `pg_cron` |
| الاستضافة | Vercel |
| التحليلات | Vercel Analytics + جدول `ad_events` داخلي |

### ADR-04 — استراتيجية العرض (Rendering)
| المسار | الأسلوب | التبرير |
|---|---|---|
| `/` , `/lawyers/*` , `/perks` | **ISR** (`revalidate: 3600`) | SEO + سرعة |
| `/board` (لوحة الطلبات) | **SSR + Realtime** | الاستعجال يمنع التخزين المؤقت |
| `/admin/*` | **CSR محمي** | لا فهرسة، خلف مصادقة |

### ADR-05 — لا يوجد كشف تلقائي لأرقام الهواتف
الأرقام **لا تُرسَل ضمن HTML الصفحة إطلاقًا**. تُجلب عبر Route Handler عند الضغط على الزر فقط،
مع تسجيل الحدث وتحديد معدل (Rate Limit). راجع [§13](#13-الامتثال-القانوني).

---

## 4. نظام التصميم

### الاتجاه واللغة
```html
<html lang="ar" dir="rtl">
```
كل الأيقونات ذات الاتجاه (الأسهم، الشيفرون) تُعكس عبر `rtl:rotate-180` أو `rtl:-scale-x-100`.

### الخطوط
- **الأساسي:** `Cairo` (الأوزان: 400 / 600 / 700)
- **البديل:** `IBM Plex Sans Arabic`, `system-ui`, `sans-serif`
- تُحمَّل عبر `next/font/google` مع `display: swap` و `preload` — **ممنوع** استيراد الخط عبر `<link>` في CSS (يعطّل LCP).

### الرموز اللونية (Design Tokens)
```css
@theme {
  /* الأساسي — كحلي قانوني */
  --color-navy-900: #0F172A;   /* الهيدر، الفوتر، العناوين */
  --color-navy-800: #1E293B;   /* البطاقات الداكنة */
  --color-navy-700: #334155;   /* النص الثانوي على داكن */

  /* اللون المميز — ذهبي قانوني */
  --color-gold-700: #B45309;   /* الأزرار الأساسية، الروابط */
  --color-gold-600: #D97706;   /* التحويم (hover)، الشارات */
  --color-gold-100: #FEF3C7;   /* خلفية الشارات */

  /* الحالات */
  --color-verified: #059669;   /* موثّق (زمردي) */
  --color-urgent:   #DC2626;   /* عاجل / أقل من 48 ساعة */
  --color-warn:     #EA580C;   /* قيد المراجعة */

  /* الأسطح */
  --color-bg:      #F8FAFC;
  --color-surface: #FFFFFF;
  --color-border:  #E2E8F0;
}
```

### قواعد المكوّنات
- **الحواف:** `rounded-xl` للبطاقات، `rounded-lg` للأزرار وحقول الإدخال.
- **الظلال:** `shadow-sm` افتراضيًا، `shadow-md` عند التحويم. **ممنوع** `shadow-2xl` (يبدو رخيصًا).
- **مساحة اللمس:** كل عنصر تفاعلي **44×44 بكسل كحد أدنى** (يُستخدم بإصبع واقفًا).
- **أزرار الاتصال:** واتساب `bg-[#25D366]`، الاتصال الهاتفي `bg-navy-900`. متجاوران دائمًا وبعرض كامل على الجوال.
- **الحالات الإجبارية لكل قائمة:** `loading` (هيكل عظمي Skeleton) · `empty` (رسالة + إجراء مقترح) · `error` (رسالة + زر إعادة المحاولة). **لا يُقبل مكوّن قائمة بدون الثلاثة.**

### إمكانية الوصول
- تباين ألوان لا يقل عن **AA (4.5:1)** للنصوص.
- كل أيقونة بمفردها لها `aria-label` بالعربية.
- التنقل بلوحة المفاتيح كامل، مع `:focus-visible` ظاهر بوضوح.

### الهوية البصرية (شعار وأيقونة)

اعتُمدت هوية بصرية حقيقية أثناء المرحلة 1، مبنية من صورتين مرجعيتين قدَّمهما صاحب المنتج
(محفوظتان في `public/brand/` للرجوع إليهما):

| الأصل | الملف | الاستخدام |
|---|---|---|
| أيقونة الميزان الجغرافي (كحلي/ذهبي، مقصوصة وبخلفية شفافة) | `public/brand/icon-mark-transparent.png` | شارة الشعار في الهيدر (`app/icon.png` أيضًا — favicon) |
| نفس الأيقونة بخلفية كريمية معتمة | `public/brand/icon-mark-cream.png` | `app/apple-icon.png` (أيقونات iOS لا يجوز أن تكون شفافة) |
| التصميم الأول الكامل (خط الرقعة الذهبي على كحلي) | `public/brand/wordmark-reference.png` | مرجع تصميمي فقط — **لا يُستخدم كصورة في الواجهة** |
| التصميم الثاني الكامل | `public/brand/icon-reference-full.png` | مرجع تصميمي فقط |

**قواعد ملزِمة:**
- اسم «إنابة» في الواجهة **نص حقيقي دائمًا**، وليس صورة — لإمكانية الوصول وSEO وقابلية التحجيم.
  يُكتب بخط `--font-logo` (Aref Ruqaa، وزن 700 فقط) بلون `text-gold-600`، **ولا يُستخدم هذا
  الخط في أي نص آخر بالموقع** — مقصور على شعار الهيدر حصريًا.
- أيقونة الميزان تُعرض دائمًا داخل شارة دائرية بخلفية فاتحة (`bg-white/95`) عند وضعها على أي
  خلفية كحلية (الهيدر)، لأن خطوط الأيقونة نفسها كحلي/ذهبي ولن تظهر على كحلي مباشرة.
- `app/icon.png` و`app/apple-icon.png` يتبعان اتفاقية Next.js التلقائية (لا حاجة لتعريف
  `metadata.icons` يدويًا) — أي تغيير في الشعار يعني استبدال هذين الملفين فقط.

---

## 5. مخطط قاعدة البيانات

> ملف الهجرة: `supabase/migrations/0001_init.sql`

### الأنواع المعدّدة (Enums)
```sql
create type registration_degree as enum ('general','primary','appeal','cassation');
create type verification_status as enum ('pending','verified','rejected','suspended');
create type delegation_type as enum (
  'session_attendance',   -- حضور جلسة وتأجيل
  'document_copying',     -- تصوير أوراق ومذكرات
  'certificate_issuing',  -- استخراج شهادة / إعلام وراثة
  'filing_claim',         -- تقديم طلب / إيداع صحيفة دعوى
  'bailiff_notice',       -- إنذار على يد محضر
  'case_inquiry',         -- استعلام ومتابعة حالة قضية
  'prosecution_hearing'   -- حضور تحقيق نيابة
);
create type request_status as enum ('open','assigned','completed','cancelled','expired');
create type ad_slot as enum ('top_leaderboard','in_feed','sticky_footer','board_inline');
create type ad_event_type as enum ('impression','click');
create type user_role as enum ('lawyer','admin','moderator');
```

### الجداول المرجعية
```sql
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
  court_type text not null,          -- ابتدائية / استئناف / أسرة / اقتصادية / مجلس دولة / نيابة / شهر عقاري
  address text,
  is_active boolean not null default true,
  unique (governorate_id, slug)
);
create index on courts (governorate_id) where is_active;
```

### ملفات المحامين
```sql
create table lawyer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 5 and 100),
  phone text not null unique,                 -- مخزن بصيغة E.164: +20XXXXXXXXXX
  whatsapp text,                              -- إن كان مختلفًا عن phone
  bar_number text,                            -- رقم الكارنيه
  registration_degree registration_degree not null,
  governorate_id smallint not null references governorates(id),
  bio text check (char_length(bio) <= 400),
  avatar_url text,
  carnet_path text,                           -- مسار داخل bucket خاص — لا يُعرض علنًا أبدًا
  verification_status verification_status not null default 'pending',
  verified_at timestamptz,
  verified_by uuid references auth.users(id),
  rejection_reason text,
  role user_role not null default 'lawyer',
  accepts_notifications boolean not null default true,
  avg_rating numeric(2,1),                    -- محدَّث بواسطة trigger
  ratings_count int not null default 0,
  completed_count int not null default 0,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);
create index on lawyer_profiles (governorate_id, verification_status);
create index on lawyer_profiles (verification_status) where verification_status = 'pending';

-- المحاكم التي يغطيها المحامي (علاقة متعدد-لمتعدد)
create table lawyer_courts (
  lawyer_id uuid references lawyer_profiles(id) on delete cascade,
  court_id int references courts(id) on delete cascade,
  primary key (lawyer_id, court_id)
);
create index on lawyer_courts (court_id);
```

### طلبات الإنابة
```sql
create table delegation_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references lawyer_profiles(id) on delete cascade,
  court_id int not null references courts(id),
  governorate_id smallint not null references governorates(id),
  delegation_type delegation_type not null,
  session_date date not null,
  details text not null check (char_length(details) between 10 and 1000),
  fee_note text,                              -- «الأتعاب بالاتفاق» أو مبلغ مقترح — نصي فقط، لا معالجة مالية
  status request_status not null default 'open',
  assigned_to uuid references lawyer_profiles(id),
  assigned_at timestamptz,
  completed_at timestamptz,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null             -- = session_date + 1 يوم (يُضبط عبر trigger)
);
create index on delegation_requests (status, session_date) where status = 'open';
create index on delegation_requests (governorate_id, status);
create index on delegation_requests (court_id, status);
```

**قاعدة الانتهاء التلقائي (إلزامية):** مهمة `pg_cron` تعمل كل ساعة وتحوّل كل طلب
`status = 'open' AND expires_at < now()` إلى `'expired'`. بدونها تتحول اللوحة إلى مقبرة طلبات ميتة.

**منع تاريخ جلسة في الماضي — `trigger`، وليس `CHECK`:** يجب رفض `session_date` الأقدم من
اليوم **عند الإنشاء فقط**، عبر `BEFORE INSERT trigger`. **ممنوع** استخدام
`CHECK (session_date >= current_date)` كقيد على الجدول: القيد يُعاد تقييمه عند أي `UPDATE`
لاحق على الصف — بما فيها تحويل الحالة إلى `expired` بواسطة `pg_cron`، أو `completed` بعد مرور
تاريخ الجلسة — وسيفشل حتمًا بمجرد أن يصبح `session_date` أقدم من `current_date`، أي يمنع إغلاق
أي طلب فات موعده. هذا عكس السلوك المطلوب تمامًا.

### الاستجابات والتقييمات
```sql
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
```
> **قيد:** لا يُسمح بإنشاء تقييم إلا إذا كان الطلب `status = 'completed'` وكان المُقيِّم أحد طرفيه
> (`requester_id` أو `assigned_to`). يُفرَض عبر سياسة RLS + دالة تحقق.

### الإعلانات
```sql
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
  governorate_id smallint references governorates(id),  -- null = كل المحافظات
  priority smallint not null default 0,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index on ads (slot, is_active, starts_at, ends_at);

create table ad_events (
  id bigserial primary key,
  ad_id uuid not null references ads(id) on delete cascade,
  event_type ad_event_type not null,
  viewer_hash text,                -- SHA-256(ip + user_agent + ملح يومي) — لا يُخزَّن IP خام
  governorate_id smallint,
  created_at timestamptz not null default now()
);
create index on ad_events (ad_id, event_type, created_at);

-- عرض مجمَّع لتقرير الراعي
create materialized view ad_stats_daily as
select ad_id, date_trunc('day', created_at)::date as day,
       count(*) filter (where event_type = 'impression') as impressions,
       count(*) filter (where event_type = 'click')      as clicks
from ad_events group by 1, 2;
```

### العروض والمزايا
```sql
create table perks (
  id uuid primary key default gen_random_uuid(),
  category text not null,          -- بدل وأرواب / مكتبات قانونية / أجهزة ومكاتب / دورات ودبلومات
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
```

### الأمان والتشغيل
```sql
create table contact_reveals (
  id bigserial primary key,
  viewer_id uuid references lawyer_profiles(id) on delete set null,
  viewer_hash text not null,
  target_lawyer_id uuid references lawyer_profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index on contact_reveals (viewer_hash, created_at);

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references lawyer_profiles(id) on delete set null,
  entity_type text not null,       -- lawyer / request / ad / review
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
```

---

## 6. الأمان وسياسات RLS

> **تفعيل RLS إجباري على كل جدول بلا استثناء.** جدول واحد بدون RLS يعني أن أي زائر يستطيع
> قراءة أو تعديل كامل محتواه مباشرة عبر واجهة Supabase العامة، متجاوزًا كل منطق الواجهة.

```sql
alter table lawyer_profiles      enable row level security;
alter table delegation_requests  enable row level security;
alter table request_responses    enable row level security;
alter table reviews              enable row level security;
alter table ads                  enable row level security;
alter table ad_events            enable row level security;
alter table perks                enable row level security;
alter table reports              enable row level security;
alter table admin_actions        enable row level security;
alter table contact_reveals      enable row level security;

-- دالة مساعدة للتحقق من صلاحية الإدارة
create or replace function is_admin() returns boolean
language sql security definer stable as $$
  select exists (
    select 1 from lawyer_profiles
    where id = auth.uid() and role in ('admin','moderator')
  );
$$;
```

### ملفات المحامين
```sql
-- القراءة العامة: الموثّقون فقط. الأعمدة الحساسة (phone, whatsapp, carnet_path)
-- تُحجب عبر عرض عام view، ولا يُستعلم عن الجدول مباشرة من العميل.
create policy "public reads verified" on lawyer_profiles
  for select using (verification_status = 'verified');

create policy "owner reads self" on lawyer_profiles
  for select using (id = auth.uid());

create policy "owner updates self" on lawyer_profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    -- منع رفع الصلاحيات أو التوثيق الذاتي
    and role = (select role from lawyer_profiles where id = auth.uid())
    and verification_status = (select verification_status from lawyer_profiles where id = auth.uid())
  );

create policy "admin full access" on lawyer_profiles
  for all using (is_admin()) with check (is_admin());
```

**العرض العام (بدون بيانات اتصال):**
```sql
create view public_lawyers as
select id, full_name, registration_degree, governorate_id, bio, avatar_url,
       avg_rating, ratings_count, completed_count, verification_status, last_seen_at
from lawyer_profiles
where verification_status = 'verified';
```
> **الواجهة تقرأ من `public_lawyers` حصريًا.** لا يوجد أي مسار يُرجع `phone` ضمن قائمة.

### طلبات الإنابة
```sql
create policy "anyone reads open requests" on delegation_requests
  for select using (status in ('open','assigned'));

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
```

### التخزين (Storage)
| Bucket | الوصول | المحتوى |
|---|---|---|
| `carnets` | **خاص تمامًا** | صور كارنيهات النقابة — تُقرأ فقط عبر رابط موقّع مؤقت للمشرف |
| `avatars` | عام | صور شخصية · حد أقصى 2MB · jpeg/png/webp |
| `sponsors` | عام | شعارات وبانرات الرعاة |

> **مخالفة جسيمة:** جعل bucket الكارنيهات عامًا. صورة الكارنيه تحتوي على الاسم الكامل ورقم القيد
> وصورة شخصية — تسريبها انتهاك مباشر لقانون حماية البيانات الشخصية.

### تحديد المعدل (Rate Limiting)
| الإجراء | الحد |
|---|---|
| كشف رقم هاتف | 20 / ساعة لكل مستخدم موثّق · 5 / ساعة لغير المسجّل |
| نشر طلب إنابة | 5 / يوم لكل محامٍ |
| التسجيل من نفس IP | 3 / يوم |
| الاستجابة لطلب | 30 / يوم |

### تحصين إضافي إلزامي — Supabase Advisors

**كل عرض (`view`) أو دالة (`function`) جديدة تُضاف للمخطط يجب أن تمر على فاحص
Supabase الأمني (`get_advisors` / Database Linter) قبل الدمج، وتُصلَح أي نتيجة
`ERROR` فورًا.** اكتُشفت هاتان النقطتان أثناء تطبيق 0001/0002 على مشروع حقيقي
ولم تكونا مذكورتين هنا أصلًا — أي عرض أو دالة تُضاف لاحقًا معرَّضة لنفس الخطأ:

1. **كل `view` تُنشأ بامتياز مالك مرتفع (مثل دور الهجرات) تشتغل ضمنيًا كـ
   `SECURITY DEFINER`** — أي تتجاوز RLS على الجداول التي تستعلم عنها، معتمدة
   فقط على شرطها الداخلي (`WHERE`) كحارس وحيد. **يجب دائمًا:**
   `ALTER VIEW <name> SET (security_invoker = true);` فور إنشائها، حتى لو كان
   شرط الـ `WHERE` مطابقًا لسياسة RLS حاليًا — الدفاع المتعدد الطبقات يحمي من
   انحراف الاثنين عن بعض مستقبلًا.
2. **كل دالة `plpgsql`/`sql` يجب أن تُثبِّت `search_path` صراحةً** (`SET
   search_path = public`) لمنع هجوم search_path hijacking. ينطبق على أي دالة
   جديدة (Trigger أو RPC)، وليس فقط `SECURITY DEFINER`.

**استثناء موثَّق ومقبول:** ستظل `is_admin()` تُصدر تحذير "قابلة للاستدعاء
المباشر عبر RPC من anon/authenticated" — هذا متوقَّع وضروري لأن سياسات
`admin manages *` تستدعيها أثناء تقييم RLS، وسحب `EXECUTE` يكسرها. الدالة لا
تُسرّب بيانات (تُرجع فقط حالة صلاحية `auth.uid()` الحالي).

---

## 7. المصادقة والصلاحيات

### طريقة الدخول
**رمز لمرة واحدة (OTP) عبر رسالة نصية** إلى رقم الهاتف. رقم الهاتف هو الهوية الوحيدة.
- **لا كلمات مرور** — الجمهور المستهدف لن يتذكرها، وهي عبء أمني بلا مقابل.
- الرقم يُخزَّن بصيغة **E.164** (`+201XXXXXXXXX`) ويُطبَّع عند الإدخال (حذف الصفر البادئ، إزالة المسافات والرموز).

### مصفوفة الصلاحيات
| الإجراء | زائر | مسجَّل (قيد المراجعة) | موثَّق | مشرف |
|---|:--:|:--:|:--:|:--:|
| تصفح الدليل | ✅ | ✅ | ✅ | ✅ |
| رؤية لوحة الطلبات | ✅ | ✅ | ✅ | ✅ |
| كشف رقم هاتف | ⛔ | ✅ (محدود) | ✅ | ✅ |
| الظهور في الدليل | — | ⛔ | ✅ | ✅ |
| نشر طلب إنابة | ⛔ | ⛔ | ✅ | ✅ |
| قبول طلب | ⛔ | ⛔ | ✅ | ✅ |
| كتابة تقييم | ⛔ | ⛔ | ✅ (بعد إتمام) | ✅ |
| لوحة الإدارة | ⛔ | ⛔ | ⛔ | ✅ |

### حماية مسار `/admin`
1. **Middleware** يفحص الجلسة و `role` قبل عرض أي شيء، ويعيد التوجيه فورًا عند الفشل.
2. **RLS** تمنع أي عملية إدارية حتى لو تم تجاوز الواجهة.
3. `robots.txt` يمنع فهرسة `/admin`.
4. كل عملية إدارية تُسجَّل في `admin_actions`.

> **المطلوب طبقتان مستقلتان (Middleware + RLS).** الاعتماد على إخفاء الرابط وحده ليس أمانًا.

---

## 8. المواصفات الوظيفية

### F1 — الهيدر والتنويه القانوني
- شريط تنقل ثابت: الشعار «إنابة» · دليل المحامين · لوحة الطلبات · عروض الزملاء · انضم للدليل.
- زر أساسي بارز: **«أضف طلب إنابة مستعجل»**.
- شريط تنويه أسفل الهيدر:
  > *«تنويه قانوني: المنصة دليل مهني مجاني لربط الزملاء، ولا تتدخل في الاتفاق المالي أو جودة التنفيذ بين الطرفين، ولا تتحمل أي مسؤولية عن ذلك.»*
- يمكن للمستخدم إغلاق الشريط، ويُحفظ الاختيار في `localStorage`، **ويُعاد إظهاره عند كل نشر طلب جديد**.

**معايير القبول:** الهيدر ثابت عند التمرير · القائمة تتحول إلى Drawer جانبي تحت 768px · التنويه مقروء دون تكبير على شاشة 360px.

---

### F2 — الدليل والبحث
**المسارات:**
- `/` — الصفحة الرئيسية مع البحث
- `/lawyers/[governorate]` — صفحة مفهرسة لكل محافظة
- `/lawyers/[governorate]/[court]` — صفحة مفهرسة لكل محكمة

**المرشّحات:** المحافظة · المحكمة (تعتمد على المحافظة) · درجة القيد · نوع الإنابة.
- التصفية تتم **دون إعادة تحميل الصفحة**، والحالة تُعكس في `searchParams` عبر `router.replace` (حتى يكون الرابط قابلًا للمشاركة).
- ترتيب النتائج: `avg_rating DESC` ← `completed_count DESC` ← `last_seen_at DESC`. الإعلانات المميزة تُوضع في مواضع محددة وتُعلَّم بوضوح بكلمة **«إعلان»**.

**بطاقة المحامي تعرض:** الاسم · شارة درجة القيد · المحافظة · المحاكم المغطاة (أول 3 + «و n غيرها») · التقييم وعدد المهام المنفَّذة · شارة **«كارنيه موثّق»** (فقط عند `verified`) · زر واتساب · زر اتصال.

**رسالة واتساب الجاهزة:**
```
السلام عليكم أستاذ {الاسم}، بخصوص إنابة في {المحكمة} — {نوع الإنابة}.
وصلت إليك عبر منصة إنابة.
```
**صيغة الرابط الإلزامية:**
```ts
// الرقم مخزن كـ +201XXXXXXXXX → يُحوَّل إلى 201XXXXXXXXX
const wa = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
```

---

### F3 — لوحة الطلبات المستعجلة
**المسار:** `/board`

**البطاقة تعرض:** المحكمة والمحافظة · تاريخ الجلسة مع **عدّاد تنازلي** · نوع الإنابة · تفاصيل مختصرة · ملاحظة الأتعاب · شارة الحالة.

**الحالات ومظهرها:**
| الحالة | المظهر |
|---|---|
| `open` وأقل من 48 ساعة | إطار أحمر + وسم **«عاجل»** |
| `open` | عادي |
| `assigned` | باهت + وسم **«تم الاستلام»** + الأزرار معطّلة |
| `expired` / `completed` | لا تظهر في اللوحة الافتراضية |

**زر «أقبل الطلب»:**
1. يُنشئ سجلًا في `request_responses`.
2. يفتح واتساب على رقم الطالب برسالة جاهزة.
3. يُخطر الطالب بإشعار.
4. **لا يغيّر الحالة تلقائيًا** — الطالب وحده هو من يضغط «تم الإسناد» ويحدد المنفّذ. (تجنّبًا لاحتكار الطلب من أول ضاغط).

**التحديث الفوري:** اشتراك Supabase Realtime على `delegation_requests` — البطاقات الجديدة تظهر أعلى القائمة دون إعادة تحميل.

**نموذج نشر طلب:** المحافظة · المحكمة · نوع الإنابة · تاريخ الجلسة · التفاصيل · ملاحظة الأتعاب.
> الاسم والهاتف يُؤخذان من الملف الشخصي تلقائيًا — **ممنوع** إدخالهما يدويًا (مصدر انتحال وسبام).

---

### F4 — عروض ومزايا الزملاء
**المسار:** `/perks`
تصنيفات: محلات البدل والأرواب · المكتبات ودور النشر القانونية · أجهزة وسكانرات المكاتب · دورات ودبلومات (لغات وتحكيم).
كل بطاقة: شعار الشريك · العنوان · الوصف · **كود الخصم** (زر نسخ) · زر واتساب للاستفادة.
عند الضغط يُسجَّل صف في `perk_redemptions` — وهو دليل الأداء الذي تُحاسَب به الشركات الشريكة.

---

### F5 — التسجيل والتوثيق
**النموذج (خطوتان، أقل من دقيقتين):**
1. الاسم الكامل · الهاتف (OTP) · المحافظة · درجة القيد · المحاكم المتواجد بها.
2. رفع صورة الكارنيه · رقم القيد.

**سير التوثيق:**
```
pending → [مراجعة المشرف] → verified  (يظهر في الدليل ويستقبل الإشعارات)
                          ↘ rejected  (سبب واضح + إمكانية إعادة الرفع)
```
- المحامي `pending` **لا يظهر في الدليل ولا يستطيع نشر طلبات**، ويرى شريطًا واضحًا: «حسابك قيد المراجعة (عادةً خلال 24 ساعة)».
- **هدف تشغيلي:** مراجعة كل طلب توثيق خلال **24 ساعة**. التأخير هنا يقتل التفعيل (Activation).

> **قاعدة ملزِمة:** شارة «كارنيه موثّق» لا تُمنح إلا بمراجعة بشرية فعلية. عرض شارة ثقة بلا آلية
> تحقق حقيقية يُنشئ مسؤولية قانونية مباشرة على المنصة. راجع [§13](#13-الامتثال-القانوني).

---

### F6 — لوحة الإدارة
**المسار:** `/admin` (محمي بطبقتين)

| القسم | الوظائف |
|---|---|
| **طلبات التوثيق** | عرض الكارنيه برابط موقّع · قبول / رفض بسبب · **الأولوية القصوى في الواجهة** |
| **المحامون** | بحث · تعليق حساب · تعديل · حذف |
| **طلبات الإنابة** | عرض · إغلاق · حذف السبام |
| **الإعلانات** | إضافة/تعديل: الراعي، المساحة، الصورة، الرابط، الاستهداف الجغرافي، تاريخ الانتهاء · **عرض الظهور والنقرات** |
| **العروض** | إدارة شركاء الخصومات وأكواد الخصم |
| **البلاغات** | مراجعة والتصرف |
| **الإحصاءات** | محامون موثقون · طلبات مفتوحة/مكتملة · معدل الاستجابة · أداء الإعلانات |

---

## 9. نظام الإشعارات

> **هذه هي الميزة الأهم في المنتج بأكمله.** بدونها، لوحة الطلبات صندوق فارغ لا يفتحه أحد،
> ويموت المنتج خلال أسابيع. لا يجوز إطلاق النسخة الأولى بدون F-Notify.

### آلية العمل
1. عند التوثيق، يشترك المحامي تلقائيًا في إشعارات **محافظته**، ويمكنه تخصيص محاكم وأنواع إنابة بعينها.
2. عند إدراج طلب جديد، يُشغَّل Database Trigger يستدعي Edge Function.
3. الدالة تجلب المحامين المطابقين (نفس المحافظة/المحكمة + الاشتراك مفعّل + موثَّق) وتضع رسائل في `notifications_outbox`.
4. عامل خلفي يرسل عبر القنوات ويحدّث الحالة.

```sql
create table notification_subscriptions (
  id bigserial primary key,
  lawyer_id uuid not null references lawyer_profiles(id) on delete cascade,
  governorate_id smallint references governorates(id),
  court_id int references courts(id),
  delegation_types delegation_type[],
  channel text not null default 'push',       -- push / whatsapp / sms
  is_active boolean not null default true
);
create index on notification_subscriptions (governorate_id, is_active);

create table notifications_outbox (
  id bigserial primary key,
  lawyer_id uuid not null references lawyer_profiles(id) on delete cascade,
  request_id uuid references delegation_requests(id) on delete cascade,
  channel text not null,
  payload jsonb not null,
  status text not null default 'queued',      -- queued / sent / failed
  attempts smallint not null default 0,
  sent_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);
create index on notifications_outbox (status, created_at) where status = 'queued';
```

### القنوات حسب المرحلة
| المرحلة | القناة | ملاحظة |
|---|---|---|
| MVP | **Web Push** (PWA) | مجاني بالكامل، يعمل على أندرويد بكفاءة عالية |
| MVP | بريد إلكتروني (اختياري) | احتياطي |
| V1 | **واتساب Business API** | الأعلى فتحًا، لكن بتكلفة لكل رسالة — يُفعَّل بعد إثبات الجدوى |

### ضوابط منع الإزعاج
- **حد أقصى 5 إشعارات يوميًا** لكل محامٍ.
- تجميع الطلبات المتقاربة في إشعار واحد عند تجاوز 3 طلبات في الساعة.
- إلغاء الاشتراك بضغطة واحدة من داخل الإشعار.
- **ساعات صمت** من 11 مساءً حتى 7 صباحًا (تُؤجَّل الرسائل، ولا تُلغى).

### ملاحظة تنفيذ: جدولة `dispatch-notifications`

`vercel.json` يُعرِّف Cron واحد يستدعي `/api/internal/dispatch-notifications` — لكن **خطة
Vercel Hobby تسمح بمرة واحدة يوميًا كحد أقصى لكل Cron**، وليس كل 15 دقيقة كما قد يُفهَم من "معالجة
دورية". الجدولة الحالية `0 5 * * *` (5:00 UTC ≈ 7 صباحًا بتوقيت القاهرة) تعمل فور انتهاء ساعات
الصمت مباشرة، فتُفرِّغ كل ما تجمَّع بين عشية وضحاها. الإشعارات التي تُرسَل فورًا (خارج ساعات
الصمت، الحالة الغالبة) لا تنتظر هذا الـ Cron إطلاقًا — يحدث إرسالها مباشرة من `lib/notify.ts` عند
إنشاء الطلب. الترقية لخطة Pro تتيح جدولة أكثر تكرارًا لو لزم الأمر مستقبلًا.

---

## 10. نظام الإعلانات والقياس

### المساحات
| المساحة | الموضع | الأبعاد المقترحة |
|---|---|---|
| `top_leaderboard` | أسفل مرشّحات البحث | 970×90 حاسوب · 320×100 جوال |
| `in_feed` | بعد كل 4 بطاقات في الدليل | بطاقة بنفس مقاس بطاقة المحامي |
| `board_inline` | داخل لوحة الطلبات | بطاقة |
| `sticky_footer` | شريط سفلي ثابت (قابل للإغلاق) | 320×50 |

### قواعد إلزامية
1. **وسم «إعلان»** ظاهر على كل مساحة — إخفاؤه خداع للمستخدم وقد يخالف قواعد الإعلان المهني.
2. `sticky_footer` **قابل للإغلاق دائمًا**، ولا يعود قبل 24 ساعة.
3. الإعلان لا يزيح المحتوى بعد التحميل (يُحجز مكانه مسبقًا) — حماية لمؤشر **CLS**.
4. الاستهداف الجغرافي: `governorate_id` — إعلان متجر بدل في المنيا لا يُعرض لمحامٍ في الإسكندرية.

### القياس (شرط أساسي للتحصيل)
```
الظهور (Impression): يُسجَّل عبر IntersectionObserver عند رؤية 50% من الإعلان لمدة ثانية واحدة.
النقرة (Click):      تُسجَّل عبر Route Handler ثم إعادة توجيه إلى وجهة الإعلان.
```
- الأحداث تُرسَل مجمَّعة (batched) لتفادي إبطاء الصفحة.
- `viewer_hash = SHA256(ip + user_agent + ملح_يومي)` — **لا يُخزَّن IP خام إطلاقًا**.
- **تقرير شهري لكل راعٍ:** الظهور · النقرات · معدل النقر (CTR) · التوزيع الجغرافي.

> بدون هذه الطبقة لا يمكن تجديد اشتراك ولا رفع سعر ولا إثبات قيمة. **بيع مساحة إعلانية بلا أرقام
> = بيع مرة واحدة فقط.**

### ملاحظات تنفيذ (المرحلة 2)

- **`layout.tsx` الجذري يجلب إعلان `sticky_footer` عبر `createPublicClient()` (بلا `cookies()`) حصريًا.**
  الـ layout يغلّف كل صفحة في التطبيق؛ لو استخدم عميل الجلسة العادي هنا لأصبحت حتى صفحات
  `/lawyers/[gov]/[court]` الثابتة (ISR) ديناميكية قسرًا، وينهار الأساس الذي بُني عليه ADR-01. أي
  بيانات عامة تُقرأ من داخل `layout.tsx` **يجب** أن تمر بنفس العميل العام.
- **`board_inline` لم يُفعَّل بعد** — البنية التحتية (الجدول، RLS، `AdSlot`) جاهزة، لكن لم يُقحَم
  في `RequestBoard` بعد؛ إضافته لاحقًا مجرد استدعاء `getAdForSlot("board_inline", …)` وتمريره.
- **الأحداث تُرسَل فرديًا حاليًا لا مجمَّعة (batched)** — كل ظهور/نقرة طلب HTTP مستقل. مقبول عند
  حجم الزيارات الحالي؛ التجميع (تخزين محلي ثم إرسال دفعة كل بضع ثوانٍ) تحسين أداء مؤجَّل، وليس
  خللًا وظيفيًا.
- **تقرير الراعي حاليًا إجمالي تراكمي حي** في `/admin/ads` (ظهور/نقرات/CTR لكل إعلان منذ إنشائه)،
  وليس تقريرًا شهريًا بفلترة تاريخ — يكفي للمرحلة الحالية، ويُبنى الفلتر لاحقًا فوق نفس البيانات
  (`ad_events`) دون أي تغيير في المخطط.

---

## 11. البيانات المرجعية

### درجات القيد
| المفتاح | العربية |
|---|---|
| `general` | جدول عام |
| `primary` | ابتدائي |
| `appeal` | استئناف عالي ومجلس الدولة |
| `cassation` | نقض |

### المحافظات — القائمة الكاملة (27)
القاهرة · الجيزة · الإسكندرية · القليوبية · الشرقية · الدقهلية · البحيرة · المنوفية · الغربية ·
كفر الشيخ · دمياط · بورسعيد · الإسماعيلية · السويس · شمال سيناء · جنوب سيناء · البحر الأحمر ·
مطروح · الفيوم · بني سويف · المنيا · أسيوط · سوهاج · قنا · الأقصر · أسوان · الوادي الجديد

> **إلزامي:** القائمة الكاملة تُحمَّل في قاعدة البيانات منذ اليوم الأول. محافظة ناقصة = محامٍ
> لا يستطيع التسجيل = مستخدم مفقود نهائيًا.

### نماذج محاكم للتحميل الأولي (Seed)
| المحافظة | المحاكم |
|---|---|
| القاهرة | محكمة شمال القاهرة الابتدائية · محكمة جنوب القاهرة الابتدائية · محكمة مدينة نصر · محكمة القاهرة الجديدة · مجلس الدولة (الدقي) · محكمة الأسرة بالعباسية |
| الجيزة | محكمة الجيزة الابتدائية · محكمة 6 أكتوبر · محكمة إمبابة · محكمة الصف |
| الإسكندرية | محكمة المنشية · محكمة محرم بك · مجمع محاكم الدخيلة · محكمة سموحة الاقتصادية |
| المنيا | محكمة المنيا الابتدائية · محكمة ملوي · محكمة بني مزار |
| أسيوط | محكمة أسيوط الابتدائية · محكمة استئناف أسيوط · محكمة ديروط |
| الدقهلية | محكمة المنصورة الابتدائية · محكمة استئناف المنصورة · محكمة ميت غمر |
| الغربية | محكمة طنطا الابتدائية · محكمة استئناف طنطا · محكمة المحلة الكبرى |
| سوهاج | محكمة سوهاج الابتدائية · محكمة طهطا |
| قنا | محكمة قنا الابتدائية · محكمة نجع حمادي |
| الشرقية | محكمة الزقازيق الابتدائية · محكمة بلبيس · محكمة العاشر من رمضان |

> هذه قائمة بذرة (Seed) للانطلاق فقط، وتُستكمل تدريجيًا. **ملاحظة تشغيلية:** يجب مراجعة الأسماء
> مع محامٍ ممارس قبل الإطلاق — اسم محكمة خاطئ يُفقد المنصة مصداقيتها فورًا أمام جمهور متخصص.

### أنواع الإنابات
حضور جلسة وتأجيل · تصوير أوراق ومذكرات قضية · استخراج شهادة أو إعلام وراثة ·
تقديم طلب أو إيداع صحيفة دعوى · إنذار على يد محضر · استعلام ومتابعة حالة قضية · حضور تحقيق نيابة

### بيانات تجريبية
**8 محامين على الأقل** موزعين على القاهرة والجيزة والمنيا والإسكندرية، بدرجات قيد مختلفة،
مع تقييمات وأعداد مهام متباينة، **و6 طلبات إنابة** بحالات مختلفة (عاجل، عادي، تم الاستلام).
> أرقام الهواتف في البيانات التجريبية **يجب أن تكون وهمية** بالصيغة `+2010000000X`.

---

## 12. SEO والأداء

### ميزانية الأداء (Performance Budget)
| المؤشر | الحد |
|---|---|
| LCP (جوال، 4G) | **< 2.5s** |
| CLS | **< 0.1** |
| INP | **< 200ms** |
| حجم JS للصفحة الرئيسية | **< 180KB** مضغوطًا |
| Lighthouse (جوال) | **≥ 90** في الأداء وإمكانية الوصول وSEO |

### التنفيذ
- كل الصور عبر `next/image` بصيغة WebP/AVIF مع أبعاد صريحة.
- خط Cairo محمَّل عبر `next/font` مع `subset: arabic` فقط.
- مكوّنات العميل (`"use client"`) في أضيق نطاق ممكن — الافتراضي هو Server Component.
- بيانات المرجع (المحافظات/المحاكم) تُخزَّن مؤقتًا على مستوى البناء، لا تُجلب في كل طلب.

### SEO
- بيانات وصفية عربية لكل صفحة محافظة ومحكمة:
  `«محامون للإنابة في {المحكمة} — {المحافظة} | إنابة»`
- **Schema.org** `LegalService` + `BreadcrumbList` لكل صفحة محامٍ ومحكمة.
- `sitemap.xml` مولَّد ديناميكيًا يشمل كل صفحات المحافظات والمحاكم.
- روابط عربية نظيفة (slug) مثل: `/lawyers/el-minya/minya-primary-court`.
- `robots.txt` يمنع `/admin` و `/api`.

---

## 13. الامتثال القانوني

> ⚠️ **هذا القسم ليس اختياريًا.** المنتج موجَّه إلى محامين — أي خلل قانوني فيه سيُكتشف فورًا
> ومن أشد الجمهور قدرة على المساءلة.

### 13.1 حماية البيانات الشخصية (القانون 151/2018)
| المتطلب | التنفيذ |
|---|---|
| موافقة صريحة | مربع اختيار غير مُفعَّل مسبقًا عند التسجيل، مع رابط سياسة الخصوصية |
| تقليل البيانات | لا تُجمع بيانات غير لازمة (لا رقم قومي، لا عنوان تفصيلي) |
| منع الكشف الجماعي | الأرقام لا تظهر في HTML، وتُجلب فردًا فردًا مع تحديد معدل |
| حق الحذف | زر «حذف حسابي نهائيًا» في الملف الشخصي، ينفَّذ خلال 30 يومًا |
| تأمين المستندات | كارنيهات النقابة في bucket خاص، وروابط موقّعة صالحة 5 دقائق فقط |
| عدم تخزين IP خام | تُخزَّن بصمة مجزّأة (hash) بملح يومي فقط |

### 13.2 قانون المحاماة 17/1983 — قيود الإعلان
المهنة تخضع لقيود على الإعلان الشخصي. لتفادي المخالفة:
- الموضع اللغوي للمنصة: **«دليل مهني لتبادل الإنابات بين الزملاء»** — وليس «إعلانات محامين».
- **ممنوع** أي صياغة تسويقية مقارنة: «الأفضل»، «الأشهر»، «الأسرع»، أو ضمان نتائج.
- الاشتراك المميز يُوصف بأنه **«أولوية في ترتيب الظهور»**، لا «إعلان عن المحامي».
- **إجراء ملزم قبل الإطلاق:** مراجعة نصوص المنصة كاملة مع محامٍ ممارس، ويفضّل الاستئناس برأي
  النقابة الفرعية. هذه بند مانع للإطلاق (Blocker).

### 13.3 المستندات المطلوبة قبل الإطلاق
1. **شروط الاستخدام** — تتضمن صراحة إخلاء مسؤولية عن: عدم التنفيذ، التأخير، جودة العمل،
   الخلافات المالية، وأي ضرر ناشئ عن التعامل بين الطرفين.
2. **سياسة الخصوصية** — ما يُجمع، لماذا، مدة الحفظ، وحقوق المستخدم.
3. **سياسة المحتوى** — حظر السبام والانتحال وعرض خدمات غير مهنية.

### 13.4 مسؤولية شارة التوثيق
منح شارة «موثّق» بلا مراجعة فعلية يُنشئ **مسؤولية تقصيرية مباشرة**: إذا انتحل شخص صفة محامٍ،
وقبل إنابة، ولم يحضر الجلسة فصدر حكم في غيبة الموكل — ستكون الشارة التي منحتها المنصة دليلًا
ضدها. لذلك:
- **التوثيق إجباري ويدوي** قبل الظهور في الدليل. لا استثناء «مؤقت» ولا «Optional in MVP».
- سجل كامل لكل عملية توثيق في `admin_actions` (من وثّق، متى، بناءً على أي مستند).

---

## 14. نموذج الأعمال ومصادر الدخل

### المبدأ
**مجاني تمامًا للمحامي، ومربح من الأطراف التي تستفيد من وجوده.** الاعتماد على الإعلانات وحدها
هشّ في البداية (لا أحد يدفع قبل وجود جمهور)، لذلك تُبنى عدة طبقات تعمل على جداول زمنية مختلفة.

### مصادر الدخل مرتّبة حسب سرعة التحقق

| # | المصدر | متى يبدأ | نموذج التسعير | الجهد | الملاحظة الحاسمة |
|---|---|---|---|---|---|
| 1 | **مكتبة النماذج القانونية الرقمية** | فورًا | 30–80 ج للنموذج · 199 ج/سنة اشتراك | متوسط | **الأسرع تحقيقًا للدخل.** صحف دعاوى، مذكرات دفاع، إنذارات، عقود — جاهزة Word/PDF. الهامش ≈100% والتسليم آلي. الجمهور يحتاجها يوميًا. |
| 2 | **عمولة شركاء العروض** | أسبوع 2 | 10–15% أو رسم شهري ثابت | منخفض | كود خصم مميز لكل شريك = قياس دقيق. لا تكلفة مقدّمة عليك. |
| 3 | **إعلانات الرعاة** | شهر 2 | 500–3000 ج/شهر حسب المساحة والاستهداف | منخفض | يتطلب أرقام ظهور — لهذا القياس في [§10](#10-نظام-الإعلانات-والقياس) شرط وجودي. |
| 4 | **اشتراك «أولوية الظهور»** | شهر 3 | 99–199 ج/شهر | منخفض | أعلى عائد لكل مستخدم. الصياغة القانونية حاسمة — راجع [§13.2](#132-قانون-المحاماة-171983--قيود-الإعلان). |
| 5 | **وساطة عملاء للدورات والدبلومات** | شهر 3 | 100–300 ج لكل عميل محتمل | منخفض | مراكز التحكيم واللغة القانونية تدفع جيدًا لكل تسجيل. |
| 6 | **أدوات مدفوعة**: حاسبة الرسوم القضائية · منبّه الجلسات · أرشيف قضايا | شهر 6 | ضمن اشتراك احترافي | مرتفع | يرفع الاحتفاظ (Retention) ويجعل المنصة أداة يومية لا موقعًا يُزار عند الحاجة. |
| 7 | **ترخيص أبيض (White-label)** للنقابات الفرعية | سنة 1+ | سنوي | مرتفع | تحوّل مؤسسي — أعلى قيمة وأبعد أجلًا. |

### التسلسل الموصى به
```
الشهر 1-2:  بناء الجمهور + إطلاق مكتبة النماذج الرقمية (دخل فوري بلا حاجة لحجم كبير)
الشهر 2-3:  تفعيل شركاء العروض (البدل والمكتبات) بعمولة
الشهر 3-4:  بيع أول مساحات إعلانية مدعومة بأرقام ظهور حقيقية
الشهر 4-6:  إطلاق اشتراك أولوية الظهور بعد ثبات قاعدة الطلبات
```

> **الملاحظة الأهم:** البند رقم 1 — **مكتبة النماذج القانونية** — هو المنتج الرقمي الوحيد هنا
> الذي يمكن أن يدرّ دخلًا **قبل** الوصول إلى حجم مستخدمين كبير، لأنه لا يعتمد على أثر الشبكة.
> ابدأ به بالتوازي مع بناء المنصة، لا بعدها.

### مؤشرات الأداء الأساسية
| المؤشر | هدف 90 يومًا |
|---|---|
| محامون موثّقون | 500 |
| طلبات منشورة أسبوعيًا | 100 |
| **معدل التلبية** (طلب حصل على استجابة) | **> 70%** |
| متوسط زمن أول استجابة | < 3 ساعات |
| احتفاظ 30 يومًا | > 35% |

> **معدل التلبية هو مؤشر الصحة الحقيقي.** طلب بلا استجابة = مستخدم مفقود إلى الأبد.

---

## 15. خارطة الطريق

### المرحلة 0 — الأساس (أسبوع 1)
مشروع Next.js · Tailwind · اتصال Supabase · الهجرات · سياسات RLS · تحميل البيانات المرجعية · نظام التصميم.

### المرحلة 1 — النسخة الأولى القابلة للإطلاق (أسابيع 2–4)
**النطاق الملزِم:**
- ✅ الدليل والبحث والتصفية (F2)
- ✅ صفحات المحافظات والمحاكم المفهرسة
- ✅ التسجيل والتوثيق اليدوي (F5)
- ✅ لوحة الطلبات مع الحالات والانتهاء التلقائي (F3)
- ✅ **إشعارات Web Push** (§9) — **شرط إطلاق، لا ميزة إضافية**
- ✅ كشف الأرقام المحمي مع تحديد المعدل
- ✅ لوحة إدارة بالحد الأدنى (توثيق + إدارة طلبات)
- ✅ شروط الاستخدام وسياسة الخصوصية

**خارج النطاق:** التقييمات · العروض · نظام الإعلانات الكامل · واتساب API.

### المرحلة 2 — الثقة والدخل (أسابيع 5–8)
التقييمات بعد الإتمام · صفحة العروض والمزايا · نظام الإعلانات الكامل مع القياس ·
تقارير الرعاة · **إطلاق مكتبة النماذج الرقمية**.

### المرحلة 3 — التوسّع (أسابيع 9–16)
إشعارات واتساب Business API · اشتراك أولوية الظهور · تحويل المنصة إلى PWA قابلة للتثبيت ·
منبّه الجلسات · لوحة تحكم للراعي.

---

## 16. معايير الجودة والقبول

### شروط مانعة للدمج (Merge Blockers)
- [ ] `tsc --noEmit` بلا أخطاء · `next lint` نظيف · **`any` ممنوع** إلا بتعليق مبرِّر.
- [ ] كل جدول عليه RLS مفعّل ومختبر.
- [ ] لا مفاتيح سرية في كود العميل — `SUPABASE_SERVICE_ROLE_KEY` على الخادم فقط.
- [ ] كل قائمة لها الحالات الثلاث: تحميل · فارغة · خطأ.
- [ ] Lighthouse للجوال ≥ 90 في الأداء وإمكانية الوصول وSEO.
- [ ] لا انزياح تخطيطي (CLS) عند تحميل الإعلانات.

### اختبارات القبول الإلزامية
| # | السيناريو | النتيجة المتوقعة |
|---|---|---|
| 1 | زائر غير مسجّل يفتح `/admin` | إعادة توجيه فورية، ولا يظهر أي محتوى |
| 2 | استعلام مباشر عن `lawyer_profiles` بمفتاح `anon` | لا يُرجِع عمود `phone` |
| 3 | محامٍ `pending` يحاول نشر طلب | ترفضه RLS، ورسالة واضحة في الواجهة |
| 4 | طلب تجاوز تاريخ جلسته | يتحول إلى `expired` ويختفي من اللوحة خلال ساعة |
| 5 | نشر طلب في «محكمة المنيا» | يصل إشعار لمحامي المنيا المشترك خلال 60 ثانية |
| 6 | فتح الموقع على 360×640 | لا تمرير أفقي · كل الأزرار ≥ 44px |
| 7 | محاولة تعديل `role` الخاص عبر API | ترفضه سياسة `with check` |
| 8 | الوصول لصورة كارنيه برابط مباشر | 403 مرفوض |
| 9 | تعطيل JavaScript | الدليل والمحتوى يظهران (SSR) |
| 10 | 25 كشف رقم في ساعة | يُحجب بعد الحد المقرر برسالة واضحة |

### RTL — نقاط فشل شائعة يجب اختبارها
الأرقام والتواريخ لا تنعكس · الأسهم والشيفرون تنعكس · حقول الإدخال محاذاة يمين مع مؤشر صحيح ·
النصوص المختلطة (عربي + رقم هاتف لاتيني) بلا تشوّه · القوائم المنسدلة تُفتح من اليمين.

---

## 17. هيكل المشروع ومتغيرات البيئة

```
enaba/
├── SPEC.md                     ← هذا المستند (المرجع الوحيد)
├── CLAUDE.md                   ← إرشادات المساعد البرمجي
├── app/
│   ├── layout.tsx              (dir="rtl" lang="ar")
│   ├── page.tsx                (الرئيسية + البحث)
│   ├── lawyers/[gov]/[court]/page.tsx
│   ├── board/page.tsx          (لوحة الطلبات)
│   ├── perks/page.tsx
│   ├── join/page.tsx
│   ├── profile/page.tsx
│   ├── legal/{terms,privacy}/page.tsx
│   ├── admin/                  (محمي بـ middleware)
│   └── api/
│       ├── contact/route.ts    (كشف رقم + تحديد معدل)
│       ├── ads/[id]/click/route.ts
│       └── ads/events/route.ts
├── components/
│   ├── ui/                     (مكوّنات أساسية)
│   ├── lawyer/                 (بطاقة، شبكة، مرشّحات)
│   ├── board/                  (بطاقة طلب، نموذج نشر)
│   └── ads/                    (مساحة إعلانية + مراقب الظهور)
├── lib/
│   ├── supabase/{client,server,proxy}.ts
│   ├── phone.ts                (تطبيع E.164 + بناء رابط واتساب)
│   ├── rate-limit.ts
│   └── constants.ts
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── functions/notify-new-request/
├── proxy.ts                    (حماية /admin — اتفاقية Next.js 16 بديلة عن middleware.ts)
└── types/database.ts           (مولَّد من Supabase)
```

### متغيرات البيئة
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # الخادم فقط — لا يُستخدم في أي مكوّن عميل إطلاقًا
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=     # Web Push — يحتاجه المتصفح عند الاشتراك، لذا NEXT_PUBLIC_ إلزامي هنا
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=                    # mailto: للتواصل حسب معيار Web Push
DAILY_HASH_SALT=                  # لتجزئة بصمة الزائر
CRON_SECRET=                      # اسم إلزامي حرفيًا — Vercel يُرسله تلقائيًا كـ Authorization لاستدعاءات vercel.json crons
```

> **قاعدة أمنية:** أي متغير بلا بادئة `NEXT_PUBLIC_` **ممنوع** استيراده داخل ملف يحتوي
> `"use client"`. مراجعة هذه النقطة إلزامية قبل كل دمج.

---

## ملحق: ملخص التغييرات عن الإصدار الأول (v1)

| # | v1 | v2 (النافذ) | السبب |
|---|---|---|---|
| 1 | «Next.js أو Vite» | **Next.js إلزامي** | البحث العضوي هو قناة النمو المجانية الأساسية |
| 2 | «LocalStorage أو Supabase» | **Supabase إلزامي** | لوحة عامة على LocalStorage تناقض مستحيل |
| 3 | `/admin` بلا حماية | Middleware + RLS + سجل تدقيق | ثغرة حذف كامل لقاعدة البيانات |
| 4 | أرقام مكشوفة في الصفحة | كشف عند الطلب + تحديد معدل | سحب آلي + مخالفة القانون 151/2018 |
| 5 | توثيق الكارنيه اختياري | **إجباري قبل الظهور** | شارة ثقة بلا تحقق = مسؤولية قانونية |
| 6 | لا إشعارات | **Web Push شرط إطلاق** | بدونها لوحة الطلبات تموت |
| 7 | طلبات بلا حالة أو انتهاء | حالات + انتهاء تلقائي | تراكم طلبات ميتة وازدواج اتصال |
| 8 | إعلانات بلا قياس | ظهور + نقرات + تقارير | لا يمكن بيع أو تجديد بلا أرقام |
| 9 | 11 محافظة | **27 محافظة كاملة** | محافظة ناقصة = مستخدم مفقود |
| 10 | لا تقييمات | تقييم بعد الإتمام | السمعة هي العملة الوحيدة بلا ضمان مالي |
| 11 | لا مخطط بيانات | مخطط كامل + RLS | ترك التصميم للتخمين = فوضى وثغرات |
| 12 | دخل من الإعلانات فقط | 7 مصادر متدرجة | الإعلانات وحدها لا تعمل قبل وجود حجم |
| 13 | لا ذكر للامتثال | PDPL + قانون المحاماة | الجمهور محامون — الخطأ سيُكتشف فورًا |
