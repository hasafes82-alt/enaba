import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * عميل Supabase لمكوّنات العميل ("use client").
 * يستخدم مفتاح anon فقط — لا يُستورد هذا الملف على الخادم لعمليات حساسة.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
