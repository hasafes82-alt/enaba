# إنابة (Enaba)

دليل الإنابات القضائية للمحامين بمصر — منصة مجانية لربط المحامين مباشرة لتبادل الإنابات.

**المرجع الوحيد للمشروع:** [`SPEC.md`](./SPEC.md) — كل قرار معماري ووظيفي موثَّق هناك.
إرشادات العمل البرمجي: [`CLAUDE.md`](./CLAUDE.md).

## التشغيل محليًا

```bash
npm install
cp .env.example .env.local   # ثم املأ متغيرات Supabase الفعلية
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

## إعداد قاعدة البيانات (Supabase)

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push          # يطبّق supabase/migrations/*.sql (المخطط + RLS)
npx supabase db reset --local # للتطوير المحلي فقط — يطبّق أيضًا supabase/seed.sql
```

بعد الربط، أعِد توليد الأنواع لتحل محل `types/database.ts` اليدوي:

```bash
npx supabase gen types typescript --project-id <id> > types/database.ts
```

## أوامر أساسية

| الأمر | الوصف |
|---|---|
| `npm run dev` | تشغيل خادم التطوير |
| `npm run build` | بناء الإنتاج |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | فحص الأنواع |

قبل أي دمج، راجع [قائمة Merge Blockers في CLAUDE.md](./CLAUDE.md#قبل-أي-دمج-merge-blockers).
