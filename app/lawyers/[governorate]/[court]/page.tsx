import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { getCourtBySlug, getCourts, getGovernorateBySlug, getGovernorates } from "@/lib/data/reference";
import { getLawyers } from "@/lib/data/lawyers";
import { LawyerGrid } from "@/components/lawyer/LawyerGrid";

export const revalidate = 3600;

export async function generateStaticParams() {
  // لا يجوز أن يفشل الـ build بالكامل بسبب انقطاع مؤقت في Supabase أثناء
  // التوليد الثابت — الصفحات غير المُولَّدة مسبقًا تُصيَّر عند الطلب (dynamicParams).
  try {
    const supabase = createPublicClient();
    const governorates = await getGovernorates(supabase);
    const params: { governorate: string; court: string }[] = [];

    for (const governorate of governorates) {
      const courts = await getCourts(governorate.id, supabase);
      for (const court of courts) {
        params.push({ governorate: governorate.slug, court: court.slug });
      }
    }
    return params;
  } catch (error) {
    console.error("تعذّر توليد مسارات المحاكم الثابتة:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ governorate: string; court: string }>;
}): Promise<Metadata> {
  const { governorate: govSlug, court: courtSlug } = await params;
  const supabase = createPublicClient();
  const governorate = await getGovernorateBySlug(govSlug, supabase);
  if (!governorate) return {};
  const court = await getCourtBySlug(governorate.id, courtSlug, supabase);
  if (!court) return {};

  const title = `محامون للإنابة في ${court.name_ar} — ${governorate.name_ar} | إنابة`;
  const description = `دليل المحامين المتاحين لتنفيذ إنابات قضائية في ${court.name_ar} بمحافظة ${governorate.name_ar} — تواصل مباشرة عبر واتساب أو الهاتف.`;
  return { title, description };
}

export default async function CourtPage({
  params,
}: {
  params: Promise<{ governorate: string; court: string }>;
}) {
  const { governorate: govSlug, court: courtSlug } = await params;
  const supabase = createPublicClient();

  const [governorate, allGovernorates] = await Promise.all([
    getGovernorateBySlug(govSlug, supabase),
    getGovernorates(supabase),
  ]);
  if (!governorate) notFound();

  const court = await getCourtBySlug(governorate.id, courtSlug, supabase);
  if (!court) notFound();

  const lawyers = await getLawyers({ governorateId: governorate.id, courtId: court.id }, supabase);

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
              {
                "@type": "ListItem",
                position: 2,
                name: governorate.name_ar,
                item: `/lawyers/${governorate.slug}`,
              },
              { "@type": "ListItem", position: 3, name: court.name_ar },
            ],
          }),
        }}
      />

      <nav className="text-sm text-navy-700" aria-label="مسار التصفح">
        <Link href="/" className="hover:text-gold-700">
          الرئيسية
        </Link>
        <span className="mx-1">/</span>
        <Link href={`/lawyers/${governorate.slug}`} className="hover:text-gold-700">
          {governorate.name_ar}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-navy-900">{court.name_ar}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">
          محامون للإنابة في {court.name_ar}
        </h1>
        <p className="mt-1 text-navy-700">
          {lawyers.length > 0
            ? `${lawyers.length} محامٍ موثَّق متاح للتواصل المباشر بـ${governorate.name_ar}.`
            : "لا يوجد محامون موثّقون في هذه المحكمة بعد."}
        </p>
      </div>

      <LawyerGrid lawyers={lawyers} governorates={allGovernorates} />
    </main>
  );
}
