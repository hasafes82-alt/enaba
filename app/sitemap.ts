import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { getCourts, getGovernorates } from "@/lib/data/reference";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const entries: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/board`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/perks`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/join`, changeFrequency: "monthly", priority: 0.4 },
  ];

  // لا يجوز أن يفشل توليد الخريطة بالكامل بسبب انقطاع مؤقت في Supabase —
  // أفضل خريطة ناقصة من صفحة sitemap.xml تُرجع 500.
  try {
    const supabase = createPublicClient();
    const governorates = await getGovernorates(supabase);

    for (const governorate of governorates) {
      entries.push({
        url: `${base}/lawyers/${governorate.slug}`,
        changeFrequency: "daily",
        priority: 0.8,
      });

      const courts = await getCourts(governorate.id, supabase);
      for (const court of courts) {
        entries.push({
          url: `${base}/lawyers/${governorate.slug}/${court.slug}`,
          changeFrequency: "daily",
          priority: 0.7,
        });
      }
    }
  } catch (error) {
    console.error("تعذّر إضافة صفحات المحافظات/المحاكم لخريطة الموقع:", error);
  }

  return entries;
}
