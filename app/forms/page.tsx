import { FileText } from "lucide-react";
import { getPublishedLegalForms } from "@/lib/data/legal-forms";
import { LegalFormCard } from "@/components/forms/LegalFormCard";

export const metadata = {
  title: "مكتبة النماذج القانونية",
  description: "صحف دعاوى ومذكرات وإنذارات وعقود جاهزة Word/PDF — طلب مباشر عبر واتساب.",
};

export default async function LegalFormsPage() {
  const forms = await getPublishedLegalForms();

  if (forms.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
        <FileText className="h-10 w-10 text-gold-600" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-navy-900">مكتبة النماذج القانونية</h1>
        <p className="max-w-md text-navy-700">لا توجد نماذج متاحة حاليًا — تابعنا قريبًا.</p>
      </main>
    );
  }

  const byCategory = new Map<string, typeof forms>();
  for (const form of forms) {
    const list = byCategory.get(form.category) ?? [];
    list.push(form);
    byCategory.set(form.category, list);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="text-center sm:text-right">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">مكتبة النماذج القانونية</h1>
        <p className="mt-1 text-navy-700">
          صحف دعاوى ومذكرات وإنذارات وعقود جاهزة — اطلب النموذج وسيصلك عبر واتساب بعد تأكيد الدفع.
        </p>
      </div>

      {[...byCategory.entries()].map(([category, categoryForms]) => (
        <section key={category} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-navy-900">{category}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryForms.map((form) => (
              <LegalFormCard key={form.id} form={form} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
