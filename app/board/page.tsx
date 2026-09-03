import Link from "next/link";
import { ClipboardList, Plus } from "lucide-react";
import { getOpenBoardRequests } from "@/lib/data/requests";
import { getCourts, getGovernorates } from "@/lib/data/reference";
import { createClient } from "@/lib/supabase/server";
import { RequestBoard } from "@/components/board/RequestBoard";
import { NotificationOptIn } from "@/components/board/NotificationOptIn";

export const metadata = {
  title: "لوحة طلبات الإنابة المستعجلة",
  description: "تصفّح طلبات الإنابة المفتوحة الآن في كل محافظات مصر، وتواصل مع الزميل الطالب مباشرة.",
};

export default async function BoardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [requests, courts, governorates] = await Promise.all([
    getOpenBoardRequests(),
    getCourts(),
    getGovernorates(),
  ]);

  const courtNames = Object.fromEntries(courts.map((c) => [c.id, c.name_ar]));
  const governorateNames = Object.fromEntries(governorates.map((g) => [g.id, g.name_ar]));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-right">
          <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">لوحة طلبات الإنابة المستعجلة</h1>
          <p className="mt-1 text-navy-700">طلبات مفتوحة الآن — الجديد يظهر هنا فورًا.</p>
        </div>
        <div className="flex gap-2">
          {user && (
            <Link
              href="/board/mine"
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-bg"
            >
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              طلباتي
            </Link>
          )}
          <Link
            href="/board/new"
            className="flex items-center gap-2 rounded-lg bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            طرح طلب إنابة جديد
          </Link>
        </div>
      </div>

      <NotificationOptIn isAuthenticated={Boolean(user)} />

      <RequestBoard
        initialRequests={requests}
        isAuthenticated={Boolean(user)}
        courtNames={courtNames}
        governorateNames={governorateNames}
      />
    </main>
  );
}
