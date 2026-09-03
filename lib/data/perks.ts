import { createClient } from "@/lib/supabase/server";

export interface Perk {
  id: string;
  category: string;
  partner_name: string;
  logo_url: string | null;
  title: string;
  description: string | null;
  discount_code: string | null;
  whatsapp: string | null;
  phone: string | null;
  governorate_id: number | null;
}

/** RLS "read active or admin" — عام بلا قيود على الأعمدة (بيانات شريك تجاري، لا بيانات شخصية). */
export async function getActivePerks(): Promise<Perk[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("perks")
    .select("id, category, partner_name, logo_url, title, description, discount_code, whatsapp, phone, governorate_id")
    .eq("is_active", true)
    .order("category");

  if (error) throw error;
  return data ?? [];
}
