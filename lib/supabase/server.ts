import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * عميل Supabase لمكوّنات الخادم و Route Handlers — يعمل باسم المستخدم الحالي (anon + جلسة).
 * لعمليات المشرف التي تتجاوز RLS عمدًا، استخدم createAdminClient بدلًا منه.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // يُستدعى setAll أحيانًا من Server Component حيث لا يمكن تعديل الكوكيز —
            // آمن التجاهل هنا طالما middleware.ts يحدّث الجلسة على كل طلب.
          }
        },
      },
    },
  );
}

/**
 * عميل بصلاحية service_role — يتجاوز RLS بالكامل.
 * لا يُستورد إطلاقًا في أي ملف يحتوي "use client". خادم فقط.
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    },
  );
}
