import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * يُحدّث جلسة Supabase على كل طلب (Server Components لا يمكنها كتابة كوكيز).
 * يُستدعى من proxy.ts في جذر المشروع (اتفاقية Next.js 16 بديلة عن middleware.ts)،
 * وهو الطبقة الأولى من طبقتَي حماية /admin (الطبقة الثانية هي سياسات RLS —
 * راجع SPEC.md §7).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const redirectToJoin = () => {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/join";
      redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    };

    if (!user) return redirectToJoin();

    // فحص الدور — الطبقة الأولى فقط. سياسات RLS (SPEC.md §6/§7) هي الطبقة
    // الفاصلة الفعلية التي تمنع أي عملية إدارية حتى لو تم تجاوز هذا الفحص.
    const { data: profile } = await supabase
      .from("lawyer_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "moderator")) {
      return redirectToJoin();
    }
  }

  return supabaseResponse;
}
