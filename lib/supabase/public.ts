import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * عميل عام بلا اعتماد على cookies() — للاستخدام في الصفحات المُولَّدة ثابتًا
 * (generateStaticParams وISR) حيث لا يجوز لأي قراءة أن تجبر الصفحة على
 * التصيير الديناميكي. لا يحمل أي سياق مستخدم (anon فقط)، وهذا مقصود: صفحات
 * الدليل العامة لا تحتاج شخصنة.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
