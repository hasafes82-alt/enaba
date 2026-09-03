import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { AdSlot, Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export interface Ad {
  id: string;
  slot: AdSlot;
  title: string;
  body: string | null;
  image_url: string | null;
  target_url: string | null;
  target_whatsapp: string | null;
}

/**
 * إعلان واحد نشط لمساحة معيّنة، بأولوية الاستهداف الجغرافي أولًا ثم
 * priority — SPEC.md §10. RLS "read active or admin" تتحقق من is_active
 * والنافذة الزمنية، هنا فقط الفرز والاستهداف الجغرافي.
 */
export async function getAdForSlot(slot: AdSlot, governorateId?: number, client?: Client): Promise<Ad | null> {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("ads")
    .select("id, slot, title, body, image_url, target_url, target_whatsapp, governorate_id, priority")
    .eq("slot", slot)
    .or(governorateId ? `governorate_id.is.null,governorate_id.eq.${governorateId}` : "governorate_id.is.null")
    .order("priority", { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return null;

  // فضّل إعلانًا مستهدفًا جغرافيًا على إعلان عام بنفس الأولوية
  const targeted = governorateId ? data.find((a) => a.governorate_id === governorateId) : null;
  const chosen = targeted ?? data[0];

  return {
    id: chosen.id,
    slot: chosen.slot,
    title: chosen.title,
    body: chosen.body,
    image_url: chosen.image_url,
    target_url: chosen.target_url,
    target_whatsapp: chosen.target_whatsapp,
  };
}
