import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { getCourts, getGovernorateBySlug, getGovernorates } from "@/lib/data/reference";
import { getLawyers } from "@/lib/data/lawyers";
import { getAdForSlot } from "@/lib/data/ads";
import { LawyerGrid } from "@/components/lawyer/LawyerGrid";

export const revalidate = 3600;

export async function generateStaticParams() {
  // لا يجوز أن يفشل الـ build بالكامل بسبب انقطاع مؤقت في Supabase أثناء
  // التوليد الثابت — الصفحات غير المُولَّدة مسبقًا تُصيَّر عند الطلب (dynamicParams).
  try {
    const supabase = createPublicClient();
    const governorates = await getGovernorates(supabase);
    return governorates.map((g) => ({ governorate: g.slug }));
  } catch (error) {
    console.error("تعذّر توليد مسارات المحافظات الثابتة:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ governorate: string }>;
}): Promise<Metadata> {
  const { governorate: slug } = await params;
  const supabase = createPublicClient();
  const governorate = await getGovernorateBySlug(slug, supabase);
  if (!governorate) return {};

  const title = `محامون للإنابة في ${governorate.name_ar} | إنابة`;
  const description = `دليل المحامين المتاحين لتنفيذ إنابات قضائية في محافظة ${governorate.name_ar} — تواصل مباشرة عبر واتساب أو الهاتف.`;
  return { title, description };
}

export default async function GovernoratePage({
  params,
}: {
  params: Promise<{ governorate: string }>;
}) {
  const { governorate: slug } = await params;
  const supabase = createPublicClient();

  const [governorate, allGovernorates] = await Promise.all([
    getGovernorateBySlug(slug, supabase),
    getGovernorates(supabase),
  ]);
  if (!governorate) notFound();

  const [lawyers, courts, inFeedAd] = await Promise.all([
    getLawyers({ governorateId: governorate.id }, supabase),
    getCourts(governorate.id, supabase),
    getAdForSlot("in_feed", governorate.id, supabase),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "الرئيسية", item: "/" },
              { "@type": "ListItem", position: 2, name: governorate.name_ar },
            ],
          }),
        }}
      />

      <nav className="text-sm text-navy-700" aria-label="مسار التصفح">
        <Link href="/" className="hover:text-gold-700">
          الرئيسية
        </Link>
        <span className="mx-1">/</span>
        <span className="text-navy-900">{governorate.name_ar}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">
          محامون للإنابة في {governorate.name_ar}
        </h1>
        <p className="mt-1 text-navy-700">
          {lawyers.length > 0
            ? `${lawyers.length} محامٍ موثَّق متاح للتواصل المباشر.`
            : "لا يوجد محامون موثّقون في هذه المحافظة بعد."}
        </p>
      </div>

      {courts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {courts.map((c) => (
            <Link
              key={c.id}
              href={`/lawyers/${governorate.slug}/${c.slug}`}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-navy-700 hover:border-gold-600 hover:text-gold-700"
            >
              {c.name_ar}
            </Link>
          ))}
        </div>
      )}

      <LawyerGrid
        lawyers={lawyers}
        governorates={allGovernorates}
        inFeedAd={inFeedAd}
        governorateId={governorate.id}
      />
    </main>
  );
}
