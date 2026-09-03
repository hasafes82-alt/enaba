export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <span className="rounded-full bg-gold-100 px-4 py-1 text-sm font-semibold text-gold-700">
        قيد الإنشاء — المرحلة صفر
      </span>
      <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">
        إنابة — دليل الإنابات القضائية للمحامين بمصر
      </h1>
      <p className="max-w-xl text-navy-700">
        الأساس التقني للمنصة جاهز: Next.js وTailwind وSupabase ونظام التصميم.
        الدليل ولوحة الطلبات المستعجلة قادمان في المرحلة الأولى وفق{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-sm">SPEC.md</code>.
      </p>
    </main>
  );
}
