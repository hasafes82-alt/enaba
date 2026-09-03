import { createClient } from "@/lib/supabase/server";

export interface LegalForm {
  id: string;
  category: string;
  title: string;
  description: string | null;
  price_egp: number;
  file_type: "docx" | "pdf";
}

/** RLS "public reads published legal forms" — عام، بلا file_path (لا يُكشف مسار الملف الخاص). */
export async function getPublishedLegalForms(): Promise<LegalForm[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("legal_forms")
    .select("id, category, title, description, price_egp, file_type")
    .eq("is_published", true)
    .order("category");

  if (error) throw error;
  return data ?? [];
}
