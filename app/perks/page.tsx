import { Gift } from "lucide-react";
import { getActivePerks } from "@/lib/data/perks";
import { PerkCard } from "@/components/perks/PerkCard";

export const metadata = {
  title: "عروض ومزايا الزملاء",
  description: "خصومات حصرية للمحامين على بدل المحاماة والمكتبات القانونية وأجهزة المكاتب والدورات.",
};

export default async function PerksPage() {
  const perks = await getActivePerks();

  if (perks.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
        <Gift className="h-10 w-10 text-gold-600" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-navy-900">عروض ومزايا الزملاء</h1>
        <p className="max-w-md text-navy-700">لا توجد عروض متاحة حاليًا — تابعنا قريبًا.</p>
      </main>
    );
  }

  const byCategory = new Map<string, typeof perks>();
  for (const perk of perks) {
    const list = byCategory.get(perk.category) ?? [];
    list.push(perk);
    byCategory.set(perk.category, list);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="text-center sm:text-right">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">عروض ومزايا الزملاء</h1>
        <p className="mt-1 text-navy-700">خصومات حصرية من شركائنا — اعرض الكود عند الشراء أو تواصل مباشرة.</p>
      </div>

      {[...byCategory.entries()].map(([category, categoryPerks]) => (
        <section key={category} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-navy-900">{category}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryPerks.map((perk) => (
              <PerkCard key={perk.id} perk={perk} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
