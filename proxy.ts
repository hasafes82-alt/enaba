import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * يعمل على كل المسارات ما عدا الأصول الثابتة، حتى تُحدَّث جلسة Supabase
     * بانتظام. حماية /admin الفعلية داخل updateSession نفسها.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)",
  ],
};
