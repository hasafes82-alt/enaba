import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database, RegistrationDegree } from "@/types/database";

type Client = SupabaseClient<Database>;

export interface DirectoryLawyer {
  id: string;
  full_name: string;
  registration_degree: RegistrationDegree;
  governorate_id: number;
  bio: string | null;
  avatar_url: string | null;
  avg_rating: number | null;
  ratings_count: number;
  completed_count: number;
  last_seen_at: string | null;
  courts: { id: number; name_ar: string; slug: string }[];
}

export interface LawyerFilters {
  governorateId?: number;
  courtId?: number;
  degree?: RegistrationDegree;
}

/** يبني خريطة lawyer_id → قائمة محاكمه، عبر استعلامين منفصلين بدل embedding
 * (النوع اليدوي في types/database.ts لا يحمل بيانات Relationships الحقيقية
 * التي يحتاجها parser الـ select المُدمج في postgrest-js). */
async function buildCourtsByLawyer(
  supabase: Client,
  lawyerIds: string[],
  courtId?: number,
): Promise<Map<string, { id: number; name_ar: string; slug: string }[]>> {
  let linkQuery = supabase.from("lawyer_courts").select("lawyer_id, court_id").in("lawyer_id", lawyerIds);
  if (courtId !== undefined) linkQuery = linkQuery.eq("court_id", courtId);

  const { data: links, error: linkError } = await linkQuery;
  if (linkError) throw linkError;
  if (!links || links.length === 0) return new Map();

  const courtIds = [...new Set(links.map((l) => l.court_id))];
  const { data: courts, error: courtsError } = await supabase
    .from("courts")
    .select("id, name_ar, slug")
    .in("id", courtIds);
  if (courtsError) throw courtsError;

  const courtById = new Map((courts ?? []).map((c) => [c.id, c]));
  const result = new Map<string, { id: number; name_ar: string; slug: string }[]>();
  for (const link of links) {
    const court = courtById.get(link.court_id);
    if (!court) continue;
    const list = result.get(link.lawyer_id) ?? [];
    list.push(court);
    result.set(link.lawyer_id, list);
  }
  return result;
}

/**
 * يقرأ حصريًا من عرض public_lawyers (بلا أعمدة اتصال) — CLAUDE.md → قواعد
 * أمنية حرجة. أرقام الهواتف تُجلب فرديًا فقط عبر app/api/contact.
 * يقبل عميلًا اختياريًا: عميل عام (createPublicClient) للصفحات الثابتة/ISR،
 * أو الافتراضي المرتبط بجلسة الطلب الحالية.
 */
export async function getLawyers(filters: LawyerFilters = {}, client?: Client): Promise<DirectoryLawyer[]> {
  const supabase = client ?? (await createClient());

  let query = supabase
    .from("public_lawyers")
    .select(
      "id, full_name, registration_degree, governorate_id, bio, avatar_url, avg_rating, ratings_count, completed_count, last_seen_at",
    )
    .order("avg_rating", { ascending: false, nullsFirst: false })
    .order("completed_count", { ascending: false })
    .order("last_seen_at", { ascending: false, nullsFirst: false });

  if (filters.governorateId !== undefined) {
    query = query.eq("governorate_id", filters.governorateId);
  }
  if (filters.degree !== undefined) {
    query = query.eq("registration_degree", filters.degree);
  }

  const { data: lawyers, error } = await query;
  if (error) throw error;
  if (!lawyers || lawyers.length === 0) return [];

  const courtsByLawyer = await buildCourtsByLawyer(
    supabase,
    lawyers.map((l) => l.id),
    filters.courtId,
  );

  const result: DirectoryLawyer[] = lawyers.map((lawyer) => ({
    ...lawyer,
    courts: courtsByLawyer.get(lawyer.id) ?? [],
  }));

  // لو فيه فلتر محكمة، استبعد أي محامٍ ما ظهرش في نتيجة lawyer_courts المفلترة
  return filters.courtId !== undefined ? result.filter((l) => courtsByLawyer.has(l.id)) : result;
}

export async function getLawyerById(id: string, client?: Client): Promise<DirectoryLawyer | null> {
  const supabase = client ?? (await createClient());

  const { data: lawyer, error } = await supabase
    .from("public_lawyers")
    .select(
      "id, full_name, registration_degree, governorate_id, bio, avatar_url, avg_rating, ratings_count, completed_count, last_seen_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!lawyer) return null;

  const courtsByLawyer = await buildCourtsByLawyer(supabase, [id]);

  return { ...lawyer, courts: courtsByLawyer.get(id) ?? [] };
}
