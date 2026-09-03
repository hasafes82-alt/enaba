import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** يسجّل استفادة من عرض — دليل الأداء الذي يُحاسَب به الشركاء (SPEC.md §4/الملحق). */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: perkId } = await context.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("perk_redemptions").insert({ perk_id: perkId, lawyer_id: user?.id ?? null });

  return NextResponse.json({ success: true });
}
