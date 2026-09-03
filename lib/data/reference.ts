import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export interface Governorate {
  id: number;
  name_ar: string;
  slug: string;
  sort_order: number;
}

export interface Court {
  id: number;
  governorate_id: number;
  name_ar: string;
  slug: string;
  court_type: string;
}

/** يقبل عميلًا اختياريًا: عميل عام (createPublicClient) للصفحات الثابتة/ISR،
 * أو الافتراضي المرتبط بجلسة الطلب الحالية. */
export async function getGovernorates(client?: Client): Promise<Governorate[]> {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("governorates")
    .select("id, name_ar, slug, sort_order")
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

export async function getCourts(governorateId?: number, client?: Client): Promise<Court[]> {
  const supabase = client ?? (await createClient());
  let query = supabase
    .from("courts")
    .select("id, governorate_id, name_ar, slug, court_type")
    .order("name_ar");

  if (governorateId !== undefined) {
    query = query.eq("governorate_id", governorateId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getGovernorateBySlug(slug: string, client?: Client): Promise<Governorate | null> {
  const supabase = client ?? (await createClient());
  const { data } = await supabase
    .from("governorates")
    .select("id, name_ar, slug, sort_order")
    .eq("slug", slug)
    .single();
  return data ?? null;
}

export async function getCourtBySlug(
  governorateId: number,
  slug: string,
  client?: Client,
): Promise<Court | null> {
  const supabase = client ?? (await createClient());
  const { data } = await supabase
    .from("courts")
    .select("id, governorate_id, name_ar, slug, court_type")
    .eq("governorate_id", governorateId)
    .eq("slug", slug)
    .single();
  return data ?? null;
}
